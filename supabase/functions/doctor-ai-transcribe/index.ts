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
    const formData = await req.formData();
    const audioBlob = formData.get('audio');
    const patientId = formData.get('patientId');

    if (!audioBlob || !patientId) {
      return new Response(
        JSON.stringify({ error: "audio and patientId are required" }),
        {
          status: 400,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    const transcriptText = simulateTranscription();

    return new Response(
      JSON.stringify({
        success: true,
        transcript: transcriptText,
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

function simulateTranscription(): string {
  return "Patient presents with chief complaint of persistent headache for the past three days. " +
         "Pain is described as throbbing, located primarily in the frontal region. " +
         "Pain intensity rated 7 out of 10. Patient denies fever, vision changes, or recent trauma. " +
         "On examination, vital signs are stable. Blood pressure 120/80, heart rate 72, temperature 98.6°F. " +
         "Neurological examination reveals no focal deficits. " +
         "Assessment suggests tension-type headache, possibly stress-related.";
}
