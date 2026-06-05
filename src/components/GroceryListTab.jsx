const CATEGORY_ICONS = {
  produce: '🥦',
  protein: '🥩',
  dairy:   '🧀',
  grains:  '🌾',
  pantry:  '🫙',
  frozen:  '❄️',
  other:   '🛒',
}

export default function GroceryListTab({ groceryList, checkedItems, toggleItem }) {
  if (!groceryList) return null

  const categories = Object.keys(groceryList).filter(
    (cat) => Array.isArray(groceryList[cat]) && groceryList[cat].length > 0,
  )

  const totalItems   = categories.reduce((n, c) => n + groceryList[c].length, 0)
  const checkedCount = Object.values(checkedItems).filter(Boolean).length

  return (
    <div className="flex flex-col gap-4">
      {/* Progress bar */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4">
        <div className="flex justify-between text-sm text-gray-600 mb-2">
          <span>Shopping progress</span>
          <span className="font-medium">{checkedCount} / {totalItems}</span>
        </div>
        <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
          <div
            className="h-full bg-brand-500 rounded-full transition-all duration-300"
            style={{ width: totalItems ? `${(checkedCount / totalItems) * 100}%` : '0%' }}
          />
        </div>
      </div>

      {categories.map((category) => (
        <div key={category} className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="px-4 py-3 bg-gray-50 border-b border-gray-100 flex items-center gap-2">
            <span>{CATEGORY_ICONS[category] ?? '🛒'}</span>
            <span className="font-semibold text-gray-700 capitalize">{category}</span>
            <span className="ml-auto text-xs text-gray-400">{groceryList[category].length} items</span>
          </div>
          <ul className="divide-y divide-gray-50">
            {groceryList[category].map((item, i) => {
              const key = `${category}-${i}`
              const checked = checkedItems[key] ?? false
              return (
                <li key={key}>
                  <label className="flex items-start gap-3 px-4 py-3 cursor-pointer hover:bg-gray-50 transition-colors">
                    <input
                      type="checkbox"
                      checked={checked}
                      onChange={() => toggleItem(key)}
                      className="mt-0.5 w-4 h-4 rounded border-gray-300 text-brand-500 focus:ring-brand-400 flex-shrink-0"
                    />
                    <div className={`flex-1 min-w-0 ${checked ? 'opacity-40 line-through' : ''}`}>
                      <span className="text-sm font-medium text-gray-800">{item.item}</span>
                      {item.quantity && (
                        <span className="text-xs text-gray-500 ml-2">{item.quantity}</span>
                      )}
                      {item.notes && (
                        <p className="text-xs text-gray-400 mt-0.5">{item.notes}</p>
                      )}
                    </div>
                  </label>
                </li>
              )
            })}
          </ul>
        </div>
      ))}
    </div>
  )
}
