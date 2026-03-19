import "jsr:@supabase/functions-js/edge-runtime.d.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Client-Info, Apikey",
};

interface EmergencyRequest {
  message: string;
  history?: Array<{ role: string; content: string }>;
}

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response(null, {
      status: 200,
      headers: corsHeaders,
    });
  }

  try {
    const { message, history = [] }: EmergencyRequest = await req.json();

    if (!message || typeof message !== "string") {
      return new Response(
        JSON.stringify({ error: "Message is required" }),
        {
          status: 400,
          headers: {
            ...corsHeaders,
            "Content-Type": "application/json",
          },
        }
      );
    }

    const response = await generateEmergencyResponse(message, history);
    const severity = assessSeverity(message, response);

    return new Response(
      JSON.stringify({
        response,
        severity,
        timestamp: new Date().toISOString(),
      }),
      {
        headers: {
          ...corsHeaders,
          "Content-Type": "application/json",
        },
      }
    );
  } catch (error) {
    console.error("Emergency AI Error:", error);
    return new Response(
      JSON.stringify({ error: "Failed to process emergency request" }),
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

function assessSeverity(
  userMessage: string,
  aiResponse: string
): "low" | "medium" | "high" | "critical" {
  const critical = [
    "chest pain",
    "can't breathe",
    "unconscious",
    "seizure",
    "stroke",
    "heart attack",
    "severe bleeding",
    "suicide",
  ];
  const high = [
    "difficulty breathing",
    "severe pain",
    "allergic reaction",
    "broken bone",
    "high fever",
    "bleeding",
  ];
  const medium = ["fever", "pain", "injury", "vomiting", "diarrhea"];

  const combined = (userMessage + " " + aiResponse).toLowerCase();

  if (critical.some((term) => combined.includes(term))) return "critical";
  if (high.some((term) => combined.includes(term))) return "high";
  if (medium.some((term) => combined.includes(term))) return "medium";
  return "low";
}

function generateEmergencyResponse(
  message: string,
  history: Array<{ role: string; content: string }>
): string {
  const lowerMessage = message.toLowerCase();

  if (lowerMessage.includes("chest pain") || lowerMessage.includes("heart")) {
    return "⚠️ CRITICAL: Chest pain could indicate a heart attack. Call 999 immediately or have someone take you to the emergency room. While waiting:\n\n• Sit down and stay calm\n• Chew an aspirin if available and not allergic\n• Loosen tight clothing\n• Do NOT drive yourself\n\nIs someone with you? Are you able to call 999 now?";
  }

  if (
    lowerMessage.includes("can't breathe") ||
    lowerMessage.includes("difficulty breathing") ||
    lowerMessage.includes("breathing")
  ) {
    return "⚠️ URGENT: Difficulty breathing requires immediate attention. Call 999 now. While waiting:\n\n• Sit upright, don't lie down\n• Loosen tight clothing\n• Try to stay calm and breathe slowly\n• If you have an inhaler, use it\n\nAre you able to speak in full sentences? Do you have a history of asthma?";
  }

  if (lowerMessage.includes("bleeding") || lowerMessage.includes("blood")) {
    return "⚠️ URGENT: For severe bleeding:\n\n• Apply direct pressure with a clean cloth\n• Don't remove the cloth if it soaks through, add more on top\n• Elevate the wound above heart level if possible\n• Call 999 if bleeding doesn't stop in 10 minutes\n\nHow much blood have you lost? Is the bleeding slowing down with pressure?";
  }

  if (
    lowerMessage.includes("unconscious") ||
    lowerMessage.includes("passed out") ||
    lowerMessage.includes("fainted")
  ) {
    return "⚠️ CRITICAL: If someone is unconscious, call 999 immediately.\n\n• Check if they're breathing\n• Place them on their side (recovery position)\n• Do NOT give them anything to eat or drink\n• Stay with them until help arrives\n\nAre they breathing? Are they responsive to touch or voice?";
  }

  if (lowerMessage.includes("seizure") || lowerMessage.includes("convulsion")) {
    return "⚠️ CRITICAL: During a seizure:\n\n• Call 999 immediately\n• Protect them from injury (move objects away)\n• Do NOT restrain them or put anything in their mouth\n• Time the seizure\n• Turn them on their side when seizure stops\n\nIs this their first seizure? How long has it lasted?";
  }

  if (
    lowerMessage.includes("stroke") ||
    lowerMessage.includes("face drooping") ||
    lowerMessage.includes("arm weakness")
  ) {
    return "⚠️ CRITICAL: Possible stroke. Use FAST test:\n\n• Face: Is one side drooping?\n• Arms: Can they raise both arms?\n• Speech: Is speech slurred?\n• Time: Call 999 immediately\n\nEvery minute counts in stroke treatment. Do NOT drive to hospital. Which symptoms are you experiencing?";
  }

  if (
    lowerMessage.includes("allergic reaction") ||
    lowerMessage.includes("swelling") ||
    lowerMessage.includes("hives")
  ) {
    return "⚠️ URGENT: Severe allergic reaction needs immediate care. Call 999 if:\n\n• Difficulty breathing or swallowing\n• Swelling of face, lips, or tongue\n• Dizziness or fainting\n• Use EpiPen if available\n\nDo you have an EpiPen? Are you having trouble breathing or swallowing?";
  }

  if (
    lowerMessage.includes("poison") ||
    lowerMessage.includes("overdose") ||
    lowerMessage.includes("swallowed")
  ) {
    return "⚠️ CRITICAL: Poisoning emergency:\n\n• Call Poison Control: 800-POISON (800-764-766)\n• Call 999 if unconscious, seizing, or not breathing\n• Do NOT induce vomiting unless instructed\n• Keep the substance container if possible\n\nWhat was ingested? How much and when?";
  }

  if (lowerMessage.includes("fever") || lowerMessage.includes("temperature")) {
    return "Fever assessment:\n\n• High fever (103°F+): Seek urgent care\n• Moderate fever (100-102°F): Monitor and rest\n• Take acetaminophen or ibuprofen\n• Stay hydrated\n• Rest\n\nWhat's your temperature? Do you have other symptoms like rash, stiff neck, or confusion?";
  }

  if (
    lowerMessage.includes("broken") ||
    lowerMessage.includes("fracture") ||
    lowerMessage.includes("bone")
  ) {
    return "Possible fracture care:\n\n• Don't move the injured area\n• Apply ice (not directly on skin)\n• Elevate if possible\n• Seek medical attention\n• Go to ER if severe pain, deformity, or bone visible\n\nCan you move the area? Is there visible deformity or swelling?";
  }

  if (lowerMessage.includes("burn")) {
    return "Burn treatment:\n\n• Cool the burn with cool (not ice) water for 10-20 minutes\n• Remove jewelry/tight items before swelling\n• Don't break blisters\n• Cover with sterile gauze\n• Seek ER for large burns, face/hand/joint burns, or third-degree burns\n\nHow large is the burn? What caused it?";
  }

  if (
    lowerMessage.includes("suicide") ||
    lowerMessage.includes("kill myself") ||
    lowerMessage.includes("end my life")
  ) {
    return "⚠️ CRITICAL: Your life matters and help is available:\n\n• National Suicide Prevention Lifeline: 800-HOPE (800-4673)\n• Crisis Text Line: Text HOME to 741741\n• Call 999 if in immediate danger\n\nYou don't have to face this alone. Will you call 800-HOPE (800-4673) now? Is someone with you?";
  }

  if (
    lowerMessage.includes("anxiety") ||
    lowerMessage.includes("panic attack")
  ) {
    return "For anxiety/panic attack:\n\n• Find a quiet place to sit\n• Practice deep breathing: inhale 4 counts, hold 4, exhale 4\n• Focus on your senses (5 things you see, 4 you hear, etc.)\n• Remind yourself this will pass\n\nCall 800-HOPE (800-4673) for mental health crisis support if needed. How long have you been feeling this way?";
  }

  if (lowerMessage.includes("pain")) {
    return "Pain assessment needed:\n\n• Location and type of pain?\n• On a scale of 1-10, how severe?\n• When did it start?\n• Any other symptoms?\n\nSevere, sudden pain (especially chest, abdomen, or head) requires immediate ER visit. Can you describe the pain in more detail?";
  }

  if (
    lowerMessage.includes("thank") ||
    lowerMessage.includes("thanks") ||
    lowerMessage.includes("appreciate")
  ) {
    return "You're welcome. Remember, if your symptoms worsen or you feel this is an emergency, please call 999 or go to the nearest emergency room. Your health and safety are the top priority. Is there anything else I can help you with?";
  }

  return "I understand you need help. To better assist you, please tell me:\n\n• What are your main symptoms?\n• When did they start?\n• On a scale of 1-10, how severe?\n• Any other medical conditions?\n\nRemember: If this is life-threatening (chest pain, difficulty breathing, severe bleeding, etc.), call 999 immediately. How can I help assess your situation?";
}
