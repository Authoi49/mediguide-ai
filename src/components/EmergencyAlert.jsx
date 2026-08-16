function EmergencyAlert({ triggeredFlags, onDismiss }) {
  return (
    <div className="fixed inset-0 z-50 bg-gradient-to-b from-red-50 to-white flex items-center justify-center px-4">
      <div className="w-full max-w-sm">
        <div className="flex justify-center mb-5">
          <div className="w-20 h-20 rounded-full bg-red-600 flex items-center justify-center shadow-lg shadow-red-600/30 animate-pulse">
            <svg viewBox="0 0 24 24" fill="none" className="w-10 h-10 text-white">
              <path
                d="M12 2a5 5 0 00-5 5v3.5L4 15v2h16v-2l-3-4.5V7a5 5 0 00-5-5z"
                fill="currentColor"
              />
              <path d="M10 20a2 2 0 004 0" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
            </svg>
          </div>
        </div>

        <h1 className="text-2xl font-extrabold text-red-700 text-center mb-1">EMERGENCY</h1>
        <p className="text-sm font-semibold text-slate-700 text-center mb-5">
          Seek immediate medical attention.
        </p>

        <p className="text-sm text-slate-600 text-center leading-relaxed mb-5">
          Based on the symptoms you reported, we detected potentially serious signs that may
          require urgent medical care.
        </p>

        <div className="bg-white border border-red-200 rounded-xl px-4 py-3 mb-6">
          <p className="text-xs font-bold text-red-700 uppercase tracking-wide mb-2">
            Symptoms that triggered this alert
          </p>
          <ul className="space-y-1.5">
            {triggeredFlags.map((flag) => (
              <li key={flag.id} className="text-sm text-slate-700 flex items-start gap-2">
                <span className="text-red-500 mt-0.5">•</span>
                {flag.label}
              </li>
            ))}
          </ul>
        </div>

        <a
          href="tel:999"
          className="w-full bg-red-600 hover:bg-red-700 text-white text-sm font-bold py-3.5 rounded-xl transition flex items-center justify-center gap-2 mb-3"
        >
          <svg viewBox="0 0 24 24" fill="none" className="w-4 h-4">
            <path
              d="M6.6 10.8c1.4 2.8 3.8 5.2 6.6 6.6l2.2-2.2c.3-.3.7-.4 1-.2 1.1.4 2.3.6 3.6.6.6 0 1 .4 1 1V20c0 .6-.4 1-1 1C10.6 21 3 13.4 3 4c0-.6.4-1 1-1h3.4c.6 0 1 .4 1 1 0 1.3.2 2.5.6 3.6.1.4 0 .8-.2 1L6.6 10.8z"
              fill="currentColor"
            />
          </svg>
          Get Immediate Help
        </a>

        <button
          onClick={onDismiss}
          className="w-full border border-slate-300 text-slate-600 text-sm font-semibold py-3 rounded-xl hover:bg-slate-50 transition"
        >
          I understand
        </button>

        <p className="text-center text-xs text-red-500 font-medium mt-4">
          If this is a life-threatening emergency, call 999 now.
        </p>
      </div>
    </div>
  )
}

export default EmergencyAlert