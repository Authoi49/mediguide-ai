const LANGUAGES = [
  { code: 'english', label: 'English', icon: '🌐' },
  { code: 'bengali', label: 'বাংলা', icon: '🌐' },
  { code: 'banglish', label: 'Banglish', icon: '✍️' },
]

function LandingScreen({ onSelectLanguage }) {
  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center px-4">
      <div className="w-full max-w-sm">
        <div className="flex flex-col items-center text-center mb-8">
          <div className="w-16 h-16 rounded-2xl bg-teal-600 flex items-center justify-center mb-4 shadow-lg shadow-teal-600/20">
            <svg viewBox="0 0 24 24" fill="none" className="w-8 h-8 text-white">
              <path
                d="M12 21s-6.5-4.35-9.5-8.5C.5 9.5 1.5 5.5 5 4.5c2-.6 3.8.2 5 1.8 1.2-1.6 3-2.4 5-1.8 3.5 1 4.5 5 2.5 8-3 4.15-9.5 8.5-9.5 8.5z"
                stroke="currentColor"
                strokeWidth="1.6"
                fill="none"
              />
            </svg>
          </div>
          <h1 className="text-2xl font-bold text-slate-900">MediGuide AI</h1>
          <p className="text-sm text-teal-700 font-medium mt-0.5">Your health, our guidance</p>
        </div>

        <h2 className="text-xl font-bold text-slate-900 text-center mb-2">
          Understand your symptoms,<br />in your language.
        </h2>
        <p className="text-sm text-slate-500 text-center mb-8 leading-relaxed">
          Describe your symptoms, get guidance on what kind of care may be appropriate, and
          prepare for a better conversation with your doctor.
        </p>

        <div className="space-y-3 mb-6">
          {LANGUAGES.map((lang) => (
            <button
              key={lang.code}
              onClick={() => onSelectLanguage(lang.code)}
              className="w-full flex items-center justify-between bg-white border border-slate-200 rounded-xl px-4 py-3.5 text-left hover:border-teal-400 hover:shadow-sm transition group"
            >
              <span className="flex items-center gap-3">
                <span className="text-lg">{lang.icon}</span>
                <span className="text-sm font-semibold text-slate-800">{lang.label}</span>
              </span>
              <svg
                viewBox="0 0 24 24"
                fill="none"
                className="w-4 h-4 text-slate-400 group-hover:text-teal-500 transition"
              >
                <path d="M9 6l6 6-6 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
              </svg>
            </button>
          ))}
        </div>

        <p className="text-center text-xs text-slate-400 flex items-center justify-center gap-1.5">
          <svg viewBox="0 0 24 24" fill="none" className="w-3.5 h-3.5">
            <path
              d="M12 2l8 3v6c0 5-3.5 8.5-8 11-4.5-2.5-8-6-8-11V5l8-3z"
              stroke="currentColor"
              strokeWidth="1.5"
            />
          </svg>
          Your health data is private and secure
        </p>
      </div>
    </div>
  )
}

export default LandingScreen