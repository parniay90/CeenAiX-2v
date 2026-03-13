import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from "jsr:@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Client-Info, Apikey",
};

interface ChatMessage {
  role: "user" | "assistant" | "system";
  content: string;
}

interface ChatRequest {
  messages: ChatMessage[];
  patientContext?: {
    name?: string;
    age?: number;
    medicalHistory?: string[];
  };
  isAuthenticated?: boolean;
}

interface Doctor {
  id: string;
  specialty: string;
  sub_specialty?: string;
  years_of_experience?: number;
  bio?: string;
  languages?: string[];
  consultation_fee_clinic?: number;
  consultation_fee_tele?: number;
  available_for_tele?: boolean;
  profile?: {
    full_name: string;
  };
}

async function getDoctorRecommendations(specialty?: string): Promise<Doctor[]> {
  const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
  const supabaseKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
  const supabase = createClient(supabaseUrl, supabaseKey);

  let query = supabase
    .from("doctors")
    .select(`
      id,
      specialty,
      sub_specialty,
      years_of_experience,
      bio,
      languages,
      consultation_fee_clinic,
      consultation_fee_tele,
      available_for_tele,
      profiles!doctors_id_fkey (
        full_name
      )
    `)
    .order("years_of_experience", { ascending: false })
    .limit(5);

  if (specialty) {
    query = query.ilike("specialty", `%${specialty}%`);
  }

  const { data, error } = await query;

  if (error) {
    console.error("Error fetching doctors:", error);
    return [];
  }

  return (data || []).map((doc: any) => ({
    ...doc,
    profile: doc.profiles,
  }));
}

function detectDoctorRequest(messages: ChatMessage[]): string | null {
  const lastUserMessage = messages
    .filter((m) => m.role === "user")
    .pop()?.content.toLowerCase();

  if (!lastUserMessage) return null;

  const keywords = [
    "doctor",
    "specialist",
    "physician",
    "cardiologist",
    "dermatologist",
    "pediatrician",
    "gynecologist",
    "orthopedic",
    "neurologist",
    "psychiatrist",
    "find a doctor",
    "recommend a doctor",
    "need a doctor",
    "see a doctor",
  ];

  const specialties = [
    "cardiology",
    "dermatology",
    "pediatrics",
    "gynecology",
    "orthopedics",
    "neurology",
    "psychiatry",
    "general medicine",
    "internal medicine",
  ];

  if (keywords.some((keyword) => lastUserMessage.includes(keyword))) {
    const foundSpecialty = specialties.find((s) => lastUserMessage.includes(s));
    return foundSpecialty || "general";
  }

  return null;
}

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response(null, {
      status: 200,
      headers: corsHeaders,
    });
  }

  try {
    const { messages, patientContext, isAuthenticated }: ChatRequest = await req.json();

    const openaiApiKey = Deno.env.get("OPENAI_API_KEY");
    if (!openaiApiKey) {
      throw new Error("OPENAI_API_KEY is not configured");
    }

    const doctorRequestType = detectDoctorRequest(messages);
    let doctorContext = "";

    if (doctorRequestType) {
      if (!isAuthenticated) {
        return new Response(
          JSON.stringify({
            message: "I'd be happy to help you find the right doctor! However, to view and book appointments with our doctors, you'll need to create an account or log in. Would you like me to help you with anything else in the meantime?",
            requiresLogin: true,
          }),
          {
            headers: {
              ...corsHeaders,
              "Content-Type": "application/json",
            },
          }
        );
      }

      const doctors = await getDoctorRecommendations(
        doctorRequestType !== "general" ? doctorRequestType : undefined
      );

      if (doctors.length > 0) {
        doctorContext = `\n\nAvailable doctors in our system:\n${doctors
          .map(
            (d, i) =>
              `${i + 1}. Dr. ${d.profile?.full_name} - ${d.specialty}${
                d.sub_specialty ? ` (${d.sub_specialty})` : ""
              }, ${d.years_of_experience || 0} years experience${
                d.available_for_tele ? ", Available for telemedicine" : ""
              }${
                d.consultation_fee_clinic
                  ? `, Clinic: AED ${d.consultation_fee_clinic}`
                  : ""
              }`
          )
          .join("\n")}

Based on these doctors, recommend the most suitable ones for the patient's needs. Mention that they can book an appointment through the platform.`;
      }
    }

    const systemMessage: ChatMessage = {
      role: "system",
      content: `You are CeenAiX AI Health Assistant, a helpful and empathetic healthcare AI assistant. You provide general health information, wellness tips, and help patients understand their health better.

Important guidelines:
- Always be warm, professional, and empathetic
- Provide general health information and wellness advice
- Never diagnose conditions or prescribe medications
- Always recommend consulting with healthcare professionals for medical concerns
- Be supportive and encouraging about healthy lifestyle choices
- Keep responses concise and easy to understand
${patientContext?.name ? `- The patient's name is ${patientContext.name}` : ""}
${patientContext?.age ? `- The patient is ${patientContext.age} years old` : ""}
${isAuthenticated ? "- The user is logged in and can book appointments" : "- The user is NOT logged in. If they want to book a doctor or get personalized medical services, inform them they need to log in first"}
${doctorContext}

Remember: You're here to support and inform, not to replace professional medical advice.`,
    };

    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${openaiApiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "gpt-3.5-turbo",
        messages: [systemMessage, ...messages],
        temperature: 0.7,
        max_tokens: 500,
      }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(`OpenAI API error: ${JSON.stringify(error)}`);
    }

    const data = await response.json();
    const assistantMessage = data.choices[0]?.message?.content;

    return new Response(
      JSON.stringify({
        message: assistantMessage,
        usage: data.usage,
        requiresLogin: false,
      }),
      {
        headers: {
          ...corsHeaders,
          "Content-Type": "application/json",
        },
      }
    );
  } catch (error) {
    console.error("Error in ai-chat function:", error);

    return new Response(
      JSON.stringify({
        error: error instanceof Error ? error.message : "An unknown error occurred",
      }),
      {
        status: 500,
        headers: {
          ...corsHeaders,
          "Content-Type": "application/json",
        },
      }
    );
  }
});
