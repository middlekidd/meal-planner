import { useState, useEffect, useCallback, useRef } from 'react'
import { storage } from '../utils/storage.js'
import { generatePlan } from '../api/generatePlan.js'

const STALE_MS = 7 * 24 * 60 * 60 * 1000 // 7 days

function isPlanStale() {
  const ts = storage.getGeneratedAt()
  if (!ts) return true
  return Date.now() - new Date(ts).getTime() > STALE_MS
}

export function useMealPlan(preferences, prefsHash) {
  const [plan, setPlanState]       = useState(() => storage.getPlan())
  const [loading, setLoading]      = useState(false)
  const [daysReady, setDaysReady]  = useState(0)
  const [error, setError]          = useState(null)
  const [checkedItems, setCheckedItems] = useState({})

  const lastHashRef = useRef(null)

  const generate = useCallback(async () => {
    setLoading(true)
    setDaysReady(0)
    setError(null)
    try {
      const result = await generatePlan(preferences, ({ daysReady }) => {
        setDaysReady(daysReady)
      })
      storage.setPlan(result)
      storage.setGeneratedAt(new Date().toISOString())
      // store current hash as the one that produced this plan
      storage.setPrefsHash(prefsHash)
      lastHashRef.current = prefsHash
      setPlanState(result)
      setCheckedItems({})
    } catch (err) {
      setError(err.message ?? 'Failed to generate meal plan.')
    } finally {
      setLoading(false)
    }
  }, [preferences, prefsHash])

  // Auto-generate on mount if plan is stale or prefs changed
  useEffect(() => {
    if (!prefsHash) return // wait for hash to compute

    const storedHash = storage.getPrefsHash()
    const hashChanged = storedHash && storedHash !== prefsHash

    if (!plan || isPlanStale() || hashChanged) {
      generate()
    } else {
      lastHashRef.current = prefsHash
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [prefsHash])

  function toggleItem(key) {
    setCheckedItems((prev) => ({ ...prev, [key]: !prev[key] }))
  }

  return { plan, loading, daysReady, error, generate, checkedItems, toggleItem }
}
