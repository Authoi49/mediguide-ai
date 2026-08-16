import { useState } from 'react'
import { supabase } from '../supabaseClient'

const LANGUAGES = [
  { code: 'english', label: 'English' },
  { code: 'bengali', label: 'বাংলা' },
  { code: 'banglish', label: 'Banglish' },
]

function ChatWindow({ initialPatientState }) {
  const [language, setLanguage] = useState('english')
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const [patientState, setPatientState] = useState(initialPatientState || null)
  const [messages, setMessages] = useState([
    {
      role: 'assistant',
      text: "Hi, I'm MediGuide AI. Describe your symptoms and I'll help guide you. This is not a diagnosis — for emergencies, seek immediate medical care.",
    },
  ])

  async function handleSend() {
    if (!input.trim() || loading) return

    const userMessage = { role: 'user', text: input }
    const updatedMessages = [...messages, userMessage]
    setMessages(updatedMessages)
    setInput('')
    setLoading(true)

    try {
      const { data, error } = await supabase.functions.invoke('chat', {
        body: { messages: updatedMessages, language, currentState: patientState },
      })

      if (error) throw error

      setMessages((prev) => [...prev, { role: 'assistant', text: data.reply }])
      setPatientState(data.patientState)
    } catch (err) {
      setMessages((prev) => [
        ...prev,
        { role: 'assistant', text: '⚠️ Something went wrong: ' + err.message },
      ])
    } finally {
      setLoading(false)
    }
  }

  function handleKeyDown(e) {
    if (e.key === 'Enter') handleSend()
  }

  return (
    <div className="flex h-screen bg-slate-900 text-white">
      {/* Chat column */}
      <div className="flex flex-col flex-1">
        <div className="flex items-center justify-between px-4 py-3 border-b border-slate-700">
          <h1 className="text-lg font-bold text-green-400">MediGuide AI</h1>
          <select
            value={language}
            onChange={(e) => setLanguage(e.target.value)}
            className="bg-slate-800 text-sm text-white rounded-md px-2 py-1 border border-slate-600"
          >
            {LANGUAGES.map((lang) => (
              <option key={lang.code} value={lang.code}>
                {lang.label}
              </option>
            ))}
          </select>
        </div>

        <div className="flex-1 overflow-y-auto px-4 py-4 space-y-3">
          {messages.map((msg, i) => (
            <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
              <div
                className={`max-w-[75%] rounded-2xl px-4 py-2 text-sm leading-relaxed whitespace-pre-wrap ${
                  msg.role === 'user' ? 'bg-green-600 text-white' : 'bg-slate-800 text-slate-100'
                }`}
              >
                {msg.text}
              </div>
            </div>
          ))}
          {loading && (
            <div className="flex justify-start">
              <div className="max-w-[75%] rounded-2xl px-4 py-2 text-sm bg-slate-800 text-slate-400 italic">
                Thinking...
              </div>
            </div>
          )}
        </div>

        <div className="border-t border-slate-700 px-4 py-3 flex gap-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Describe your symptoms..."
            disabled={loading}
            className="flex-1 bg-slate-800 text-white text-sm rounded-full px-4 py-2 outline-none border border-slate-600 focus:border-green-500 disabled:opacity-50"
          />
          <button
            onClick={handleSend}
            disabled={loading}
            className="bg-green-600 hover:bg-green-500 text-white text-sm font-medium px-5 py-2 rounded-full transition disabled:opacity-50"
          >
            Send
          </button>
        </div>
      </div>

      {/* Debug panel: structured patient state (temporary, for development only) */}
      <div className="w-96 border-l border-slate-700 p-4 overflow-y-auto bg-slate-950">
        <h2 className="text-sm font-bold text-slate-400 mb-2">Structured Patient State (debug)</h2>
        <pre className="text-xs text-green-300 whitespace-pre-wrap break-words">
          {patientState ? JSON.stringify(patientState, null, 2) : 'No data yet.'}
        </pre>
      </div>
    </div>
  )
}

export default ChatWindow