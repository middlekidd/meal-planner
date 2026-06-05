import { useState } from 'react'
import MealCard from './MealCard.jsx'

const DAYS = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday']
const DAY_LABELS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
const MEALS = ['breakfast', 'lunch', 'dinner']

export default function MealPlanTab({ plan }) {
  const [activeDay, setActiveDay] = useState(0)

  if (!plan?.mealPlan) return null

  const dayKey  = DAYS[activeDay]
  const dayData = plan.mealPlan[dayKey] ?? {}

  return (
    <div className="flex flex-col gap-4">
      {/* Day selector */}
      <div className="flex gap-1 overflow-x-auto pb-1">
        {DAY_LABELS.map((label, i) => (
          <button
            key={label}
            onClick={() => setActiveDay(i)}
            className={`flex-shrink-0 px-3 py-2 rounded-xl text-sm font-medium transition-colors ${
              activeDay === i
                ? 'bg-brand-500 text-white shadow-sm'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      {/* Meal cards */}
      <div className="flex flex-col gap-3">
        {MEALS.map((meal) => (
          <MealCard key={meal} mealType={meal} meal={dayData[meal]} />
        ))}
      </div>
    </div>
  )
}
