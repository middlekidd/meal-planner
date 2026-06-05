const DAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']

export default function LoadingState({ daysReady = 0 }) {
  return (
    <div className="flex flex-col items-center justify-center py-32 gap-6">
      <div className="relative w-20 h-20">
        <div className="absolute inset-0 rounded-full border-4 border-brand-200" />
        <div className="absolute inset-0 rounded-full border-4 border-brand-500 border-t-transparent animate-spin" />
        <span className="absolute inset-0 flex items-center justify-center text-3xl">🍳</span>
      </div>

      <div className="flex flex-col items-center gap-3">
        <p className="text-xl font-medium text-brand-700">Cooking up your week…</p>

        {/* Day-by-day progress pills */}
        <div className="flex gap-1.5">
          {DAYS.map((day, i) => (
            <div
              key={day}
              className={`flex flex-col items-center gap-1 transition-all duration-300 ${
                i < daysReady ? 'opacity-100' : 'opacity-30'
              }`}
            >
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-semibold transition-colors duration-300 ${
                  i < daysReady
                    ? 'bg-brand-500 text-white'
                    : 'bg-gray-200 text-gray-400'
                }`}
              >
                {i < daysReady ? '✓' : day[0]}
              </div>
              <span className="text-xs text-gray-400">{day}</span>
            </div>
          ))}
        </div>

        <p className="text-sm text-gray-400">
          {daysReady === 0
            ? 'Starting up…'
            : daysReady < 7
            ? `${daysReady} of 7 days ready`
            : 'Finishing up grocery list…'}
        </p>
      </div>
    </div>
  )
}
