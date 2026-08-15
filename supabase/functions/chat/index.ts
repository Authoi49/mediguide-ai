import "jsr:@supabase/functions-js/edge-runtime.d.ts"

const GEMINI_API_KEY = Deno.env.get("GEMINI_API_KEY")
const GEMINI_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-3.6-flash:generateContent?key=${GEMINI_API_KEY}`

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", {
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
      },
    })
  }

  try {
    const { messages, language } = await req.json()

    const systemInstruction = `You are MediGuide AI, a multilingual health triage assistant. 
The user is communicating in: ${language}.
You are NOT a doctor and must NEVER give a definitive diagnosis.
Ask relevant follow-up questions about symptoms one at a time.
Be concise, calm, and clear. If the user describes anything resembling a medical emergency 
(difficulty breathing, severe chest pain, loss of consciousness, severe bleeding, seizure), 
clearly and immediately advise them to seek emergency care.`

    const contents = messages.map((m) => ({
      role: m.role === "assistant" ? "model" : "user",
      parts: [{ text: m.text }],
    }))

    const response = await fetch(GEMINI_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents,
        systemInstruction: { parts: [{ text: systemInstruction }] },
      }),
    })

    const data = await response.json()

    // Log the raw Gemini response so we can debug via Supabase logs
    console.log("Gemini raw response:", JSON.stringify(data))

    if (!response.ok) {
      return new Response(
        JSON.stringify({ reply: "Gemini API error: " + JSON.stringify(data) }),
        {
          status: 200,
          headers: {
            "Content-Type": "application/json",
            "Access-Control-Allow-Origin": "*",
          },
        }
      )
    }

    const reply =
      data?.candidates?.[0]?.content?.parts?.[0]?.text ??
      "No reply text found. Raw: " + JSON.stringify(data)

    return new Response(JSON.stringify({ reply }), {
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
      },
    })
  } catch (err) {
    return new Response(JSON.stringify({ error: err.message }), {
      status: 500,
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
      },
    })
  }
})