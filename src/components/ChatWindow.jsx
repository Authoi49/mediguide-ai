import { useState } from 'react'

const LANGUAGES = [
  { code: 'english', label: 'English' },
  { code: 'bengali', label: 'বাংলা' },
  { code: 'banglish', label: 'Banglish' },
]

function ChatWindow() {
  const [language, setLanguage] = useState('english')
  const [input, setInput] = useState('')
  const [messages, setMessages] = useState([
    {
      role: 'assistant',
      text: 'Hi, I\'m MediGuide AI. Describe your symptoms and I\'ll help guide you. This is not a diagnosis — for emergencies, seek immediate medical care.',
    },
  ])

  function handleSend() {
    if (!input.trim()) return
    setMessages((prev) => [...prev, { role: 'user', text: input }])
    setInput('')
    // AI response logic comes in Module 4 — placeholder for now
  }

  function handleKeyDown(e) {
    if (e.key === 'Enter') handleSend()
  }

  return (
    <div className="flex flex-col h-screen bg-slate-900 text-white">
      {/* Header */}
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

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-4 py-4 space-y-3">
        {messages.map((msg, i) => (
          <div
            key={i}
            className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`max-w-[75%] rounded-2xl px-4 py-2 text-sm leading-relaxed ${
                msg.role === 'user'
                  ? 'bg-green-600 text-white'
                  : 'bg-slate-800 text-slate-100'
              }`}
            >
              {msg.text}
            </div>
          </div>
        ))}
      </div>

      {/* Input bar */}
      <div className="border-t border-slate-700 px-4 py-3 flex gap-2">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Describe your symptoms..."
          className="flex-1 bg-slate-800 text-white text-sm rounded-full px-4 py-2 outline-none border border-slate-600 focus:border-green-500"
        />
        <button
          onClick={handleSend}
          className="bg-green-600 hover:bg-green-500 text-white text-sm font-medium px-5 py-2 rounded-full transition"
        >
          Send
        </button>
      </div>
    </div>
  )
}

export default ChatWindow