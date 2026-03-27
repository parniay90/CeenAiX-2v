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
    const { audioData, sessionId } = await req.json();

    if (!audioData || !sessionId) {
      return new Response(
        JSON.stringify({ error: "audioData and sessionId are required" }),
        {
          status: 400,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    // For now, we'll use a simulated transcription
    // In production, you would integrate with OpenAI Whisper API or similar service
    const transcriptText = simulateTranscription(audioData);

    const segments = [
      {
        timestamp: new Date().toISOString(),
        speaker: "doctor",
        text: transcriptText,
      }
    ];

    return new Response(
      JSON.stringify({
        success: true,
        transcript: transcriptText,
        segments: segments,
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

function simulateTranscription(audioData: string): string {
  // This is a placeholder. In production, you would:
  // 1. Decode the base64 audio data
  // 2. Send it to OpenAI Whisper API or similar
  // 3. Return the transcription

  return "Patient presents with chief complaint of persistent headache for the past three days. " +
         "Pain is described as throbbing, located primarily in the frontal region. " +
         "Pain intensity rated 7 out of 10. Patient denies fever, vision changes, or recent trauma. " +
         "On examination, vital signs are stable. Blood pressure 120/80, heart rate 72, temperature 98.6°F. " +
         "Neurological examination reveals no focal deficits. " +
         "Assessment suggests tension-type headache, possibly stress-related.";
}
