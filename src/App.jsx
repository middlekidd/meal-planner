import { useState } from 'react'
import { usePreferences } from './hooks/usePreferences.js'
import { useMealPlan }    from './hooks/useMealPlan.js'
import PreferencesModal  from './components/PreferencesModal.jsx'
import MealPlanTab       from './components/MealPlanTab.jsx'
import GroceryListTab    from './components/GroceryListTab.jsx'
import PrepGuideTab      from './components/PrepGuideTab.jsx'
import LoadingState      from './components/LoadingState.jsx'

const TABS = ['Meal Plan', 'Grocery List', 'Prep Guide']

export default function App() {
  const [activeTab, setActiveTab]     = useState(0)
  const [showModal, setShowModal]     = useState(false)

  const { preferences, setPreferences, prefsHash } = usePreferences()
  const { plan, loading, error, generate, checkedItems, toggleItem } = useMealPlan(preferences, prefsHash)

  function handleSavePreferences(updated) {
    setPreferences(updated)
    // useMealPlan will auto-trigger generation when prefsHash changes
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-100 sticky top-0 z-40">
        <div className="max-w-2xl mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-2xl">🍽️</span>
            <div>
              <h1 className="font-bold text-gray-800 leading-tight">Weekly Meal Planner</h1>
              <p className="text-xs text-gray-400">Family of 2 + baby</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowModal(true)}
              className="text-sm px-3 py-1.5 rounded-xl border border-gray-200 text-gray-600 hover:bg-gray-50 transition-colors"
            >
              Preferences
            </button>
            <button
              onClick={generate}
              disabled={loading}
              className="text-sm px-3 py-1.5 rounded-xl bg-brand-500 text-white font-medium hover:bg-brand-600 disabled:opacity-50 transition-colors shadow-sm"
            >
              Regenerate
            </button>
          </div>
        </div>

        {/* Tabs */}
        {!loading && plan && (
          <div className="max-w-2xl mx-auto px-4 flex border-t border-gray-100">
            {TABS.map((tab, i) => (
              <button
                key={tab}
                onClick={() => setActiveTab(i)}
                className={`py-2.5 px-4 text-sm font-medium border-b-2 transition-colors ${
                  activeTab === i
                    ? 'border-brand-500 text-brand-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700'
                }`}
              >
                {tab}
              </button>
            ))}
          </div>
        )}
      </header>

      {/* Main content */}
      <main className="max-w-2xl mx-auto px-4 py-6">
        {loading ? (
          <LoadingState />
        ) : error ? (
          <ErrorState message={error} onRetry={generate} />
        ) : !plan ? (
          <EmptyState onGenerate={generate} />
        ) : (
          <>
            {activeTab === 0 && <MealPlanTab plan={plan} />}
            {activeTab === 1 && (
              <GroceryListTab
                groceryList={plan.groceryList}
                checkedItems={checkedItems}
                toggleItem={toggleItem}
              />
            )}
            {activeTab === 2 && <PrepGuideTab prepGuide={plan.prepGuide} />}
          </>
        )}
      </main>

      {/* Preferences modal */}
      {showModal && (
        <PreferencesModal
          preferences={preferences}
          onSave={handleSavePreferences}
          onClose={() => setShowModal(false)}
        />
      )}
    </div>
  )
}

function ErrorState({ message, onRetry }) {
  return (
    <div className="flex flex-col items-center justify-center py-24 gap-4 text-center">
      <span className="text-5xl">😕</span>
      <h2 className="text-lg font-semibold text-gray-700">Something went wrong</h2>
      <p className="text-sm text-gray-500 max-w-xs">{message}</p>
      <button
        onClick={onRetry}
        className="mt-2 px-5 py-2.5 rounded-2xl bg-brand-500 text-white font-medium hover:bg-brand-600 transition-colors shadow-sm"
      >
        Try again
      </button>
    </div>
  )
}

function EmptyState({ onGenerate }) {
  return (
    <div className="flex flex-col items-center justify-center py-24 gap-4 text-center">
      <span className="text-5xl">🥗</span>
      <h2 className="text-lg font-semibold text-gray-700">No meal plan yet</h2>
      <p className="text-sm text-gray-500 max-w-xs">
        Generate your first personalised weekly meal plan in seconds.
      </p>
      <button
        onClick={onGenerate}
        className="mt-2 px-5 py-2.5 rounded-2xl bg-brand-500 text-white font-medium hover:bg-brand-600 transition-colors shadow-sm"
      >
        Generate plan
      </button>
    </div>
  )
}
