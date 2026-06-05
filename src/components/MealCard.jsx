const MEAL_ICONS = { breakfast: '☀️', lunch: '🌤️', dinner: '🌙' }

export default function MealCard({ mealType, meal }) {
  if (!meal) return null

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4 flex flex-col gap-2">
      <div className="flex items-center gap-2">
        <span className="text-lg">{MEAL_ICONS[mealType]}</span>
        <span className="text-xs font-semibold uppercase tracking-wide text-gray-400">
          {mealType}
        </span>
      </div>

      <h3 className="font-semibold text-gray-800 leading-snug">{meal.name}</h3>

      <p className="text-sm text-gray-600 leading-relaxed">{meal.description}</p>

      {meal.infantAdaptation && (
        <div className="mt-1 rounded-xl bg-amber-50 border border-amber-200 px-3 py-2 flex gap-2 items-start">
          <span className="text-base flex-shrink-0">👶</span>
          <p className="text-xs text-amber-800 leading-relaxed">{meal.infantAdaptation}</p>
        </div>
      )}
    </div>
  )
}
