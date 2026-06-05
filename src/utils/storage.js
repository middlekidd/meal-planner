const KEY_PREFERENCES = 'mealplanner_preferences'
const KEY_PLAN        = 'mealplanner_plan'
const KEY_PREFS_HASH  = 'mealplanner_prefs_hash'
const KEY_GENERATED_AT = 'mealplanner_generated_at'

function get(key) {
  try {
    const raw = localStorage.getItem(key)
    return raw ? JSON.parse(raw) : null
  } catch {
    return null
  }
}

function set(key, value) {
  localStorage.setItem(key, JSON.stringify(value))
}

export const storage = {
  getPreferences: () => get(KEY_PREFERENCES),
  setPreferences: (v) => set(KEY_PREFERENCES, v),

  getPlan: () => get(KEY_PLAN),
  setPlan: (v) => set(KEY_PLAN, v),

  getPrefsHash: () => localStorage.getItem(KEY_PREFS_HASH),
  setPrefsHash: (v) => localStorage.setItem(KEY_PREFS_HASH, v),

  getGeneratedAt: () => localStorage.getItem(KEY_GENERATED_AT),
  setGeneratedAt: (v) => localStorage.setItem(KEY_GENERATED_AT, v),

  clearPlan: () => {
    localStorage.removeItem(KEY_PLAN)
    localStorage.removeItem(KEY_GENERATED_AT)
  },
}
