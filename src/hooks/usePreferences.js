import { useState, useEffect } from 'react'
import { storage } from '../utils/storage.js'
import { sha256 } from '../utils/hash.js'

const DEFAULT_PREFERENCES = {
  adults: 2,
  infant: {
    age: '9 months',
    approach: 'Baby-Led Weaning (BLW)',
    notes: 'Teething — prefers soft or dissolvable foods. No honey, whole nuts, or added salt.',
  },
  dietaryRestrictions: ['No shellfish'],
  dislikedIngredients: ['Coriander/cilantro', 'Blue cheese'],
  cuisinePreferences: ['Mediterranean', 'Asian-inspired', 'British comfort food'],
  maxPrepTime: 20,
  maxPrepTimeUnit: 'minutes',
  cookingSkill: 'intermediate',
  budget: 'moderate',
  additionalNotes: 'Prefer one-pan or batch-cook friendly meals where possible.',
}

export function usePreferences() {
  const [preferences, setPreferencesState] = useState(() => {
    return storage.getPreferences() ?? DEFAULT_PREFERENCES
  })
  const [prefsHash, setPrefsHash] = useState(storage.getPrefsHash() ?? null)

  // Recompute hash whenever preferences change
  useEffect(() => {
    sha256(JSON.stringify(preferences)).then((hash) => {
      setPrefsHash(hash)
      storage.setPrefsHash(hash)
    })
  }, [preferences])

  function setPreferences(updated) {
    storage.setPreferences(updated)
    setPreferencesState(updated)
  }

  return { preferences, setPreferences, prefsHash }
}
