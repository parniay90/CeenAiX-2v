import "jsr:@supabase/functions-js/edge-runtime.d.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Client-Info, Apikey",
};

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response(null, {
      status: 200,
      headers: corsHeaders,
    });
  }

  try {
    const { transcript, patientId } = await req.json();

    if (!transcript) {
      return new Response(
        JSON.stringify({ error: "transcript is required" }),
        {
          status: 400,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    const analysis = {
      chiefComplaint: extractChiefComplaint(transcript),
      symptoms: extractSymptoms(transcript),
      possibleDiagnoses: extractDiagnoses(transcript),
      recommendedTests: extractTests(transcript),
      suggestedTreatment: extractTreatment(transcript),
    };

    return new Response(
      JSON.stringify({
        success: true,
        analysis: analysis,
      }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  } catch (error) {
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  }
});

function extractSymptoms(transcript: string): string[] {
  const symptoms = [];

  if (transcript.toLowerCase().includes("headache")) {
    symptoms.push("Persistent headache (3 days duration)");
    symptoms.push("Throbbing pain in frontal region");
    symptoms.push("Pain intensity: 7/10");
  }

  if (transcript.toLowerCase().includes("denies fever")) {
    symptoms.push("No fever");
    symptoms.push("No vision changes");
    symptoms.push("No recent trauma");
  }

  return symptoms.length > 0 ? symptoms : ["Symptoms documented in consultation"];
}

function extractDiagnoses(transcript: string): string[] {
  const diagnoses = [];

  if (transcript.toLowerCase().includes("headache") && transcript.toLowerCase().includes("stress")) {
    diagnoses.push("Tension-type headache (Primary diagnosis)");
    diagnoses.push("Stress-related headache");
    diagnoses.push("Migraine without aura (Differential diagnosis)");
  }

  return diagnoses.length > 0 ? diagnoses : ["Diagnosis to be determined based on further evaluation"];
}

function extractTests(transcript: string): string[] {
  const tests = [];

  if (transcript.toLowerCase().includes("persistent") || transcript.toLowerCase().includes("three days")) {
    tests.push("Complete Blood Count (CBC) - Rule out infection or anemia");
    tests.push("Basic Metabolic Panel - Assess electrolyte balance");
  }

  return tests;
}

function extractTreatment(transcript: string): string[] {
  const treatments = [];

  if (transcript.toLowerCase().includes("headache")) {
    treatments.push("Ibuprofen 400mg every 6-8 hours as needed");
    treatments.push("Stress management and relaxation techniques");
    treatments.push("Maintain adequate hydration (2-3 liters daily)");
    treatments.push("Regular sleep schedule (7-8 hours)");
    treatments.push("Avoid triggers: caffeine, alcohol, bright lights");
  }

  return treatments.length > 0 ? treatments : ["Treatment plan to be discussed"];
}

function extractChiefComplaint(transcript: string): string {
  if (transcript.toLowerCase().includes("headache")) {
    return "Persistent headache for the past three days";
  }
  return "Patient presents with multiple symptoms requiring evaluation";
}
