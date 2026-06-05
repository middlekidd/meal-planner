import { useState } from 'react'

export default function PreferencesModal({ preferences, onSave, onClose }) {
  const [form, setForm] = useState(structuredClone(preferences))

  function update(path, value) {
    setForm((prev) => {
      const next = structuredClone(prev)
      const keys = path.split('.')
      let obj = next
      for (let i = 0; i < keys.length - 1; i++) obj = obj[keys[i]]
      obj[keys[keys.length - 1]] = value
      return next
    })
  }

  function updateList(field, raw) {
    update(field, raw.split('\n').map((s) => s.trim()).filter(Boolean))
  }

  function handleSave(e) {
    e.preventDefault()
    onSave(form)
    onClose()
  }

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
      <div className="bg-white w-full max-w-lg rounded-3xl shadow-2xl flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
          <h2 className="text-lg font-bold text-gray-800">Family Preferences</h2>
          <button
            onClick={onClose}
            className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100 text-gray-400 hover:text-gray-600 transition-colors"
          >
            ✕
          </button>
        </div>

        {/* Scrollable body */}
        <form onSubmit={handleSave} className="overflow-y-auto flex-1 px-6 py-4 flex flex-col gap-5">

          <Section title="Adults & cooking">
            <Field label="Number of adults">
              <input
                type="number"
                min={1}
                max={10}
                value={form.adults}
                onChange={(e) => update('adults', Number(e.target.value))}
                className={inputCls}
              />
            </Field>
            <Field label="Max prep time (minutes)">
              <input
                type="number"
                min={5}
                max={120}
                value={form.maxPrepTime}
                onChange={(e) => update('maxPrepTime', Number(e.target.value))}
                className={inputCls}
              />
            </Field>
            <Field label="Cooking skill">
              <select
                value={form.cookingSkill}
                onChange={(e) => update('cookingSkill', e.target.value)}
                className={inputCls}
              >
                <option value="beginner">Beginner</option>
                <option value="intermediate">Intermediate</option>
                <option value="advanced">Advanced</option>
              </select>
            </Field>
            <Field label="Budget">
              <select
                value={form.budget}
                onChange={(e) => update('budget', e.target.value)}
                className={inputCls}
              >
                <option value="budget">Budget-conscious</option>
                <option value="moderate">Moderate</option>
                <option value="flexible">Flexible</option>
              </select>
            </Field>
          </Section>

          <Section title="Infant">
            <Field label="Age">
              <input
                type="text"
                value={form.infant?.age ?? ''}
                onChange={(e) => update('infant.age', e.target.value)}
                placeholder="e.g. 9 months"
                className={inputCls}
              />
            </Field>
            <Field label="Feeding approach">
              <input
                type="text"
                value={form.infant?.approach ?? ''}
                onChange={(e) => update('infant.approach', e.target.value)}
                placeholder="e.g. Baby-Led Weaning"
                className={inputCls}
              />
            </Field>
            <Field label="Notes about infant">
              <textarea
                rows={2}
                value={form.infant?.notes ?? ''}
                onChange={(e) => update('infant.notes', e.target.value)}
                className={inputCls}
                placeholder="Allergies, textures to avoid, etc."
              />
            </Field>
          </Section>

          <Section title="Food preferences">
            <Field label="Dietary restrictions (one per line)">
              <textarea
                rows={3}
                value={(form.dietaryRestrictions ?? []).join('\n')}
                onChange={(e) => updateList('dietaryRestrictions', e.target.value)}
                className={inputCls}
                placeholder="e.g. Vegetarian&#10;No shellfish"
              />
            </Field>
            <Field label="Disliked ingredients (one per line)">
              <textarea
                rows={3}
                value={(form.dislikedIngredients ?? []).join('\n')}
                onChange={(e) => updateList('dislikedIngredients', e.target.value)}
                className={inputCls}
                placeholder="e.g. Coriander&#10;Blue cheese"
              />
            </Field>
            <Field label="Cuisine preferences (one per line)">
              <textarea
                rows={3}
                value={(form.cuisinePreferences ?? []).join('\n')}
                onChange={(e) => updateList('cuisinePreferences', e.target.value)}
                className={inputCls}
                placeholder="e.g. Mediterranean&#10;Asian-inspired"
              />
            </Field>
          </Section>

          <Section title="Additional notes">
            <textarea
              rows={3}
              value={form.additionalNotes ?? ''}
              onChange={(e) => update('additionalNotes', e.target.value)}
              className={inputCls}
              placeholder="Anything else the meal planner should know…"
            />
          </Section>

          <div className="flex gap-3 pt-2 pb-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-3 rounded-2xl border border-gray-200 text-gray-600 font-medium hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 py-3 rounded-2xl bg-brand-500 text-white font-semibold hover:bg-brand-600 transition-colors shadow-sm"
            >
              Save & Regenerate
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

function Section({ title, children }) {
  return (
    <fieldset className="flex flex-col gap-3">
      <legend className="text-xs font-semibold uppercase tracking-wider text-gray-400">{title}</legend>
      {children}
    </fieldset>
  )
}

function Field({ label, children }) {
  return (
    <label className="flex flex-col gap-1">
      <span className="text-sm font-medium text-gray-700">{label}</span>
      {children}
    </label>
  )
}

const inputCls =
  'w-full rounded-xl border border-gray-200 bg-gray-50 px-3 py-2 text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-brand-400 focus:border-transparent transition'
