import { useState } from 'react'

function IntakeForm({ onComplete }) {
  const [age, setAge] = useState('')
  const [sex, setSex] = useState('')
  const [error, setError] = useState('')

  function handleSubmit() {
    if (!age || Number(age) <= 0 || Number(age) > 120) {
      setError('Please enter a valid age.')
      return
    }
    if (!sex) {
      setError('Please select sex.')
      return
    }
    setError('')
    onComplete({ age: Number(age), sex })
  }

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center px-4">
      <div className="w-full max-w-sm bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
        <div className="flex justify-center mb-4">
          <div className="w-14 h-14 rounded-2xl bg-teal-50 border border-teal-100 flex items-center justify-center">
            <svg viewBox="0 0 24 24" fill="none" className="w-7 h-7 text-teal-600">
              <path
                d="M12 21s-6.5-4.35-9.5-8.5C.5 9.5 1.5 5.5 5 4.5c2-.6 3.8.2 5 1.8 1.2-1.6 3-2.4 5-1.8 3.5 1 4.5 5 2.5 8-3 4.15-9.5 8.5-9.5 8.5z"
                stroke="currentColor"
                strokeWidth="1.6"
              />
            </svg>
          </div>
        </div>

        <h1 className="text-lg font-bold text-slate-900 text-center mb-1">MediGuide AI</h1>
        <p className="text-sm text-slate-500 text-center mb-6 leading-relaxed">
          Before we begin, please share a couple of basic details. This helps us give more
          relevant guidance.
        </p>

        <label className="block text-xs font-semibold text-slate-600 mb-1.5">Age</label>
        <input
          type="number"
          value={age}
          onChange={(e) => setAge(e.target.value)}
          placeholder="e.g. 25"
          className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 mb-4 text-sm outline-none focus:border-teal-400 text-slate-900"
        />

        <label className="block text-xs font-semibold text-slate-600 mb-1.5">
          Sex (biological)
        </label>
        <div className="flex gap-2 mb-5">
          {['male', 'female'].map((option) => (
            <button
              key={option}
              onClick={() => setSex(option)}
              className={`flex-1 py-2.5 rounded-xl text-sm font-medium border transition ${
                sex === option
                  ? 'bg-teal-600 border-teal-600 text-white'
                  : 'bg-slate-50 border-slate-200 text-slate-600 hover:border-slate-300'
              }`}
            >
              {option.charAt(0).toUpperCase() + option.slice(1)}
            </button>
          ))}
        </div>

        {error && <p className="text-red-500 text-xs mb-3">{error}</p>}

        <button
          onClick={handleSubmit}
          className="w-full bg-teal-600 hover:bg-teal-700 text-white text-sm font-semibold py-3 rounded-xl transition"
        >
          Continue
        </button>

        <p className="text-xs text-slate-400 text-center mt-4 leading-relaxed">
          This tool provides general health guidance and is not a substitute for professional
          medical advice. In an emergency, contact local emergency services immediately.
        </p>
      </div>
    </div>
  )
}

export default IntakeForm