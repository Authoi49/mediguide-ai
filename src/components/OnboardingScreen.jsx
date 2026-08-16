import { useState } from 'react'

function OnboardingScreen({ onContinue }) {
  const [understood, setUnderstood] = useState(false)

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center px-4">
      <div className="w-full max-w-sm">
        <div className="flex justify-center mb-6">
          <div className="w-16 h-16 rounded-2xl bg-teal-50 border border-teal-100 flex items-center justify-center">
            <svg viewBox="0 0 24 24" fill="none" className="w-8 h-8 text-teal-600">
              <path
                d="M12 2l8 3v6c0 5-3.5 8.5-8 11-4.5-2.5-8-6-8-11V5l8-3z"
                stroke="currentColor"
                strokeWidth="1.6"
              />
              <path d="M9 12l2 2 4-4" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </div>
        </div>

        <h2 className="text-lg font-bold text-slate-900 text-center mb-6">
          A little important information
        </h2>

        <p className="text-sm text-slate-600 text-center leading-relaxed mb-4">
          MediGuide AI provides health guidance and triage support to help you understand your
          symptoms and decide what kind of care may be appropriate.
        </p>

        <div className="bg-amber-50 border border-amber-200 rounded-xl px-4 py-3 mb-4 flex gap-2.5">
          <span className="text-amber-500 text-base leading-none mt-0.5">⚠️</span>
          <p className="text-xs text-amber-800 leading-relaxed">
            This is not a doctor and not a substitute for professional medical advice, diagnosis, or
            treatment.
          </p>
        </div>

        <p className="text-sm text-slate-600 text-center leading-relaxed mb-6">
          If you are experiencing a medical emergency, seek immediate professional medical
          attention or call emergency services.
        </p>

        <label className="flex items-center gap-2.5 justify-center mb-6 cursor-pointer select-none">
          <input
            type="checkbox"
            checked={understood}
            onChange={(e) => setUnderstood(e.target.checked)}
            className="w-4 h-4 accent-teal-600 rounded"
          />
          <span className="text-sm text-slate-700 font-medium">I understand</span>
        </label>

        <button
          onClick={onContinue}
          disabled={!understood}
          className="w-full bg-teal-600 hover:bg-teal-700 disabled:bg-slate-200 disabled:text-slate-400 text-white text-sm font-semibold py-3 rounded-xl transition"
        >
          Continue
        </button>

        <p className="text-center text-xs text-slate-400 mt-4">
          <a href="#" className="underline hover:text-slate-600">Learn more about this tool</a>
        </p>
      </div>
    </div>
  )
}

export default OnboardingScreen