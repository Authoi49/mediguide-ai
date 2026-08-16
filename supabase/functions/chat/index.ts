import "jsr:@supabase/functions-js/edge-runtime.d.ts"

const GEMINI_API_KEY = Deno.env.get("GEMINI_API_KEY")
const MODEL = "gemini-3.6-flash"
const GEMINI_URL = `https://generativelanguage.googleapis.com/v1beta/models/${MODEL}:generateContent?key=${GEMINI_API_KEY}`

async function callGemini(contents, systemInstruction, jsonMode = false) {
  const body = {
    contents,
    systemInstruction: { parts: [{ text: systemInstruction }] },
  }
  if (jsonMode) {
    body.generationConfig = { responseMimeType: "application/json" }
  }

  const response = await fetch(GEMINI_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  })

  const data = await response.json()
  if (!response.ok) {
    throw new Error("Gemini API error: " + JSON.stringify(data))
  }
  return data?.candidates?.[0]?.content?.parts?.[0]?.text ?? ""
}

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
    const { messages, language, currentState } = await req.json()

    const contents = messages.map((m) => ({
      role: m.role === "assistant" ? "model" : "user",
      parts: [{ text: m.text }],
    }))

    const conversationSystemPrompt = `You are MediGuide AI, a multilingual health triage assistant. 
The user is communicating in: ${language}.
You are NOT a doctor and must NEVER give a definitive diagnosis.
Ask relevant follow-up questions about symptoms one at a time.
Be concise, calm, and clear. If the user describes anything resembling a medical emergency 
(difficulty breathing, severe chest pain, loss of consciousness, severe bleeding, seizure), 
clearly and immediately advise them to seek emergency care.`

    const reply = await callGemini(contents, conversationSystemPrompt)

    const extractionSystemPrompt = `You are a medical data extraction engine. 
Read the conversation and output ONLY valid JSON (no markdown, no explanation) matching this exact schema:

{
  "age": number or null,
  "sex": "male" | "female" | null,
  "language": string,
  "symptoms": [ { "name": string, "duration": string or null, "severity": "mild" | "moderate" | "severe" or null } ],
  "associated_symptoms": [string],
  "relevant_history": [string],
  "risk_factors": [string],
  "red_flags": [string],
  "suggestedReplies": [string]
}

Rules:
- Only include information explicitly stated or clearly implied by the user. Do not guess.
- red_flags should only list clinically concerning symptoms the user has confirmed (e.g. "difficulty breathing", "severe chest pain", "loss of consciousness", "severe bleeding", "seizure").
- If information is unknown, use null or an empty array.
- language field should be: "${language}"
- suggestedReplies: look at the LAST assistant message in the conversation. If it asks a yes/no question, set suggestedReplies to ["Yes", "No"]. If it asks about severity, set suggestedReplies to ["Mild", "Moderate", "Severe"]. If it asks an open-ended question needing free text (e.g. "describe your symptoms", "how long", "what medications"), set suggestedReplies to an empty array []. Only suggest replies when they would be genuinely quick, valid answers to the exact question just asked.
- Current known state (merge/update this with any new info from the latest messages): ${JSON.stringify(currentState || {})}
- Output ONLY the JSON object, nothing else.`

    const extractionRaw = await callGemini(contents, extractionSystemPrompt, true)

    let patientState
    try {
      patientState = JSON.parse(extractionRaw)
    } catch {
      patientState = currentState || {}
    }

    const suggestedReplies = patientState.suggestedReplies || []
    delete patientState.suggestedReplies

    return new Response(JSON.stringify({ reply, patientState, suggestedReplies }), {
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