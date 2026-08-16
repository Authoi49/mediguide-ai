import { useState } from 'react'
import { supabase } from '../supabaseClient'
import { evaluateRedFlags } from '../logic/redFlagRules'
import EmergencyAlert from './EmergencyAlert'

const LANGUAGES = [
  { code: 'english', label: 'English' },
  { code: 'bengali', label: 'বাংলা' },
  { code: 'banglish', label: 'Banglish' },
]

const MAX_STEPS = 6 // approximate, for progress bar visualization

function ChatWindow({ initialPatientState }) {
  const [language, setLanguage] = useState(initialPatientState?.language || 'english')
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const [patientState, setPatientState] = useState(initialPatientState || null)
  const [triggeredRedFlags, setTriggeredRedFlags] = useState([])
  const [showEmergencyScreen, setShowEmergencyScreen] = useState(false)
  const [suggestedReplies, setSuggestedReplies] = useState([])
  const [messages, setMessages] = useState([
    {
      role: 'assistant',
      text: "Hi, I'm MediGuide AI. Tell me what you're experiencing — you can describe it in your own words.",
    },
  ])

  const symptomCount = patientState?.symptoms?.length || 0
  const stepProgress = Math.min(symptomCount + 1, MAX_STEPS)

  async function sendMessage(text) {
    if (!text.trim() || loading) return

    const userMessage = { role: 'user', text }
    const updatedMessages = [...messages, userMessage]
    setMessages(updatedMessages)
    setInput('')
    setSuggestedReplies([])
    setLoading(true)

    try {
      const { data, error } = await supabase.functions.invoke('chat', {
        body: { messages: updatedMessages, language, currentState: patientState },
      })

      if (error) throw error

      setMessages((prev) => [...prev, { role: 'assistant', text: data.reply }])
      setPatientState(data.patientState)
      setSuggestedReplies(data.suggestedReplies || [])

      const flags = evaluateRedFlags(data.patientState)
      setTriggeredRedFlags(flags)
      if (flags.length > 0) {
        setShowEmergencyScreen(true)
      }
    } catch (err) {
      setMessages((prev) => [
        ...prev,
        { role: 'assistant', text: '⚠️ Something went wrong: ' + err.message },
      ])
    } finally {
      setLoading(false)
    }
  }

  function handleSend() {
    sendMessage(input)
  }

  function handleKeyDown(e) {
    if (e.key === 'Enter') handleSend()
  }

  function handleQuickReply(reply) {
    sendMessage(reply)
  }

  return (
    <div className="flex h-screen bg-slate-50 text-slate-900">
      {showEmergencyScreen && (
        <EmergencyAlert
          triggeredFlags={triggeredRedFlags}
          onDismiss={() => setShowEmergencyScreen(false)}
        />
      )}

      {/* Chat column */}
      <div className="flex flex-col flex-1 max-w-2xl mx-auto w-full">
        {/* Header */}
        <div className="px-4 pt-4 pb-3 bg-white border-b border-slate-200">
          <div className="flex items-center justify-between mb-3">
            <h1 className="text-base font-bold text-slate-900">MediGuide AI</h1>
            <select
              value={language}
              onChange={(e) => setLanguage(e.target.value)}
              className="bg-slate-100 text-xs font-medium text-slate-700 rounded-lg px-2.5 py-1.5 border border-slate-200 outline-none"
            >
              {LANGUAGES.map((lang) => (
                <option key={lang.code} value={lang.code}>
                  {lang.label}
                </option>
              ))}
            </select>
          </div>

          {/* Progress bar */}
          <div className="flex items-center gap-1.5">
            {Array.from({ length: MAX_STEPS }).map((_, i) => (
              <div
                key={i}
                className={`h-1.5 flex-1 rounded-full transition-colors ${
                  i < stepProgress ? 'bg-teal-500' : 'bg-slate-200'
                }`}
              />
            ))}
          </div>
          <p className="text-[11px] text-slate-400 mt-1.5">
            Step {stepProgress} of ~{MAX_STEPS}
          </p>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto px-4 py-4 space-y-3">
          {messages.map((msg, i) => (
            <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
              <div
                className={`max-w-[75%] rounded-2xl px-4 py-2.5 text-sm leading-relaxed whitespace-pre-wrap ${
                  msg.role === 'user'
                    ? 'bg-teal-600 text-white'
                    : 'bg-white text-slate-800 border border-slate-200'
                }`}
              >
                {msg.text}
              </div>
            </div>
          ))}
          {loading && (
            <div className="flex justify-start">
              <div className="max-w-[75%] rounded-2xl px-4 py-2.5 text-sm bg-white border border-slate-200 text-slate-400 italic">
                Thinking...
              </div>
            </div>
          )}

          {/* Quick reply buttons */}
          {!loading && suggestedReplies.length > 0 && (
            <div className="flex flex-wrap gap-2 justify-start pt-1">
              {suggestedReplies.map((reply) => (
                <button
                  key={reply}
                  onClick={() => handleQuickReply(reply)}
                  className="bg-white border border-teal-300 text-teal-700 text-sm font-medium px-4 py-1.5 rounded-full hover:bg-teal-50 transition"
                >
                  {reply}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Detected symptoms chip bar */}
        {symptomCount > 0 && (
          <div className="px-4 py-2.5 bg-white border-t border-slate-200">
            <div className="flex items-center justify-between mb-1.5">
              <p className="text-[11px] font-bold text-slate-500 uppercase tracking-wide">
                Detected Symptoms
              </p>
              <span className="text-[11px] text-teal-600 font-medium cursor-default">
                {symptomCount} found
              </span>
            </div>
            <div className="flex flex-wrap gap-1.5">
              {patientState.symptoms.map((s, i) => (
                <span
                  key={i}
                  className="bg-teal-50 text-teal-700 text-xs font-medium px-2.5 py-1 rounded-full border border-teal-100"
                >
                  {s.name}
                </span>
              ))}
              {patientState.symptoms
                .filter((s) => s.duration)
                .map((s, i) => (
                  <span
                    key={`dur-${i}`}
                    className="bg-slate-100 text-slate-600 text-xs font-medium px-2.5 py-1 rounded-full"
                  >
                    {s.duration}
                  </span>
                ))}
              {patientState.symptoms
                .filter((s) => s.severity)
                .map((s, i) => (
                  <span
                    key={`sev-${i}`}
                    className="bg-slate-100 text-slate-600 text-xs font-medium px-2.5 py-1 rounded-full capitalize"
                  >
                    {s.severity}
                  </span>
                ))}
            </div>
          </div>
        )}

        {/* Input bar */}
        <div className="border-t border-slate-200 bg-white px-4 py-3 flex gap-2 items-center">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Type your message..."
            disabled={loading}
            className="flex-1 bg-slate-100 text-slate-900 text-sm rounded-full px-4 py-2.5 outline-none border border-transparent focus:border-teal-400 disabled:opacity-50"
          />
          <button
            title="Voice input (coming soon)"
            className="w-9 h-9 flex items-center justify-center rounded-full bg-slate-100 text-slate-400 hover:bg-slate-200 transition shrink-0"
          >
            <svg viewBox="0 0 24 24" fill="none" className="w-4 h-4">
              <path
                d="M12 14a3 3 0 003-3V6a3 3 0 00-6 0v5a3 3 0 003 3z"
                stroke="currentColor"
                strokeWidth="1.6"
              />
              <path
                d="M19 11a7 7 0 01-14 0M12 18v3"
                stroke="currentColor"
                strokeWidth="1.6"
                strokeLinecap="round"
              />
            </svg>
          </button>
          <button
            onClick={handleSend}
            disabled={loading}
            className="w-9 h-9 flex items-center justify-center rounded-full bg-teal-600 hover:bg-teal-700 text-white transition disabled:opacity-50 shrink-0"
          >
            <svg viewBox="0 0 24 24" fill="none" className="w-4 h-4">
              <path d="M5 12h14M13 6l6 6-6 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  )
}

export default ChatWindow