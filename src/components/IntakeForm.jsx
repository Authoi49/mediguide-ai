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
    <div className="min-h-screen flex items-center justify-center bg-slate-900 text-white px-4">
      <div className="w-full max-w-sm bg-slate-800 rounded-2xl p-6 border border-slate-700">
        <h1 className="text-xl font-bold text-green-400 mb-1">MediGuide AI</h1>
        <p className="text-sm text-slate-400 mb-6">
          Before we begin, please share a couple of basic details. This helps us give more relevant guidance.
        </p>

        <label className="block text-sm text-slate-300 mb-1">Age</label>
        <input
          type="number"
          value={age}
          onChange={(e) => setAge(e.target.value)}
          placeholder="e.g. 25"
          className="w-full bg-slate-900 border border-slate-600 rounded-lg px-3 py-2 mb-4 text-sm outline-none focus:border-green-500"
        />

        <label className="block text-sm text-slate-300 mb-1">Sex (biological)</label>
        <div className="flex gap-2 mb-4">
          {['male', 'female'].map((option) => (
            <button
              key={option}
              onClick={() => setSex(option)}
              className={`flex-1 py-2 rounded-lg text-sm font-medium border transition ${
                sex === option
                  ? 'bg-green-600 border-green-500 text-white'
                  : 'bg-slate-900 border-slate-600 text-slate-300 hover:border-slate-500'
              }`}
            >
              {option.charAt(0).toUpperCase() + option.slice(1)}
            </button>
          ))}
        </div>

        {error && <p className="text-red-400 text-xs mb-3">{error}</p>}

        <button
          onClick={handleSubmit}
          className="w-full bg-green-600 hover:bg-green-500 text-white text-sm font-semibold py-2 rounded-lg transition"
        >
          Continue
        </button>

        <p className="text-xs text-slate-500 mt-4">
          This tool provides general health guidance and is not a substitute for professional medical advice. In an emergency, contact local emergency services immediately.
        </p>
      </div>
    </div>
  )
}

export default IntakeForm