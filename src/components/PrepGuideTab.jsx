export default function PrepGuideTab({ prepGuide }) {
  if (!Array.isArray(prepGuide) || prepGuide.length === 0) return null

  return (
    <div className="flex flex-col gap-3">
      <p className="text-sm text-gray-500">
        Complete these prep tasks ahead of time to make weekday cooking faster.
      </p>
      {prepGuide.map((task, i) => (
        <div key={i} className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4 flex gap-3">
          <span className="text-2xl flex-shrink-0">🔪</span>
          <div className="flex flex-col gap-1 min-w-0">
            <p className="font-semibold text-gray-800 leading-snug">{task.task}</p>
            <div className="flex flex-wrap gap-2 mt-1">
              {task.duration && (
                <Chip icon="⏱️" label={task.duration} />
              )}
              {task.when && (
                <Chip icon="📅" label={task.when} />
              )}
              {task.makes && (
                <Chip icon="🍱" label={task.makes} />
              )}
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}

function Chip({ icon, label }) {
  return (
    <span className="inline-flex items-center gap-1 bg-gray-100 text-gray-600 rounded-full px-2.5 py-0.5 text-xs">
      <span>{icon}</span>
      <span>{label}</span>
    </span>
  )
}
