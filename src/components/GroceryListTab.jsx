const CATEGORY_ICONS = {
  produce: '🥦',
  protein: '🥩',
  dairy:   '🧀',
  grains:  '🌾',
  frozen:  '❄️',
  other:   '🛒',
  staples: '🫙',
}

const SHOP_ORDER = ['produce', 'protein', 'dairy', 'grains', 'frozen', 'other']

export default function GroceryListTab({ groceryList, checkedItems, toggleItem }) {
  if (!groceryList) return null

  const shopCategories = SHOP_ORDER.filter(
    (cat) => Array.isArray(groceryList[cat]) && groceryList[cat].length > 0,
  )
  const staples = Array.isArray(groceryList.staples) ? groceryList.staples : []

  const shopTotal    = shopCategories.reduce((n, c) => n + groceryList[c].length, 0)
  const checkedCount = Object.values(checkedItems).filter(Boolean).length

  return (
    <div className="flex flex-col gap-4">
      {/* Progress bar — only counts the "buy" items */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4">
        <div className="flex justify-between text-sm text-gray-600 mb-2">
          <span>Shopping progress</span>
          <span className="font-medium">{checkedCount} / {shopTotal}</span>
        </div>
        <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
          <div
            className="h-full bg-brand-500 rounded-full transition-all duration-300"
            style={{ width: shopTotal ? `${(checkedCount / shopTotal) * 100}%` : '0%' }}
          />
        </div>
      </div>

      {/* Items to buy */}
      {shopCategories.map((category) => (
        <CategoryBlock
          key={category}
          category={category}
          items={groceryList[category]}
          checkedItems={checkedItems}
          toggleItem={toggleItem}
        />
      ))}

      {/* Pantry staples — visually distinct */}
      {staples.length > 0 && (
        <div className="mt-2">
          <div className="flex items-center gap-2 px-1 mb-2">
            <div className="flex-1 h-px bg-gray-200" />
            <span className="text-xs font-semibold uppercase tracking-wider text-gray-400">
              Pantry staples — check you have these
            </span>
            <div className="flex-1 h-px bg-gray-200" />
          </div>
          <div className="bg-amber-50 rounded-2xl border border-amber-100 overflow-hidden">
            <div className="px-4 py-3 bg-amber-100/60 border-b border-amber-100 flex items-center gap-2">
              <span>🫙</span>
              <span className="font-semibold text-amber-800">Staples</span>
              <span className="ml-auto text-xs text-amber-600">{staples.length} items</span>
            </div>
            <ul className="divide-y divide-amber-100/50">
              {staples.map((item, i) => {
                const key = `staples-${i}`
                const checked = checkedItems[key] ?? false
                return (
                  <li key={key}>
                    <label className="flex items-start gap-3 px-4 py-3 cursor-pointer hover:bg-amber-100/30 transition-colors">
                      <input
                        type="checkbox"
                        checked={checked}
                        onChange={() => toggleItem(key)}
                        className="mt-0.5 w-4 h-4 rounded border-amber-300 text-amber-500 focus:ring-amber-400 flex-shrink-0"
                      />
                      <div className={`flex-1 min-w-0 ${checked ? 'opacity-40 line-through' : ''}`}>
                        <span className="text-sm font-medium text-amber-900">{item.item}</span>
                        {item.quantity && (
                          <span className="text-xs text-amber-600 ml-2">{item.quantity}</span>
                        )}
                        {item.notes && (
                          <p className="text-xs text-amber-600/70 mt-0.5">{item.notes}</p>
                        )}
                      </div>
                    </label>
                  </li>
                )
              })}
            </ul>
          </div>
        </div>
      )}
    </div>
  )
}

function CategoryBlock({ category, items, checkedItems, toggleItem }) {
  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
      <div className="px-4 py-3 bg-gray-50 border-b border-gray-100 flex items-center gap-2">
        <span>{CATEGORY_ICONS[category] ?? '🛒'}</span>
        <span className="font-semibold text-gray-700 capitalize">{category}</span>
        <span className="ml-auto text-xs text-gray-400">{items.length} items</span>
      </div>
      <ul className="divide-y divide-gray-50">
        {items.map((item, i) => {
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
  )
}
