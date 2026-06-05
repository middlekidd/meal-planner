import Anthropic from '@anthropic-ai/sdk'

const client = new Anthropic({
  apiKey: import.meta.env.VITE_ANTHROPIC_API_KEY,
  dangerouslyAllowBrowser: true,
})

const SYSTEM_PROMPT = `You are a family meal planning expert. You create practical, nutritious weekly meal plans tailored to the family's needs.

You MUST respond with valid JSON only — no markdown fences, no prose before or after. The JSON must match this exact shape:

{
  "mealPlan": {
    "monday":    { "breakfast": { "name": "", "description": "", "infantAdaptation": "" }, "lunch": { ... }, "dinner": { ... } },
    "tuesday":   { ... },
    "wednesday": { ... },
    "thursday":  { ... },
    "friday":    { ... },
    "saturday":  { ... },
    "sunday":    { ... }
  },
  "groceryList": {
    "produce":   [{ "item": "", "quantity": "", "notes": "" }],
    "protein":   [...],
    "dairy":     [...],
    "grains":    [...],
    "pantry":    [...],
    "frozen":    [...],
    "other":     [...]
  },
  "prepGuide": [
    { "task": "", "duration": "", "when": "", "makes": "" }
  ]
}

Rules:
- Each meal has name, description (1–2 sentences), and infantAdaptation (how to serve safely for a BLW infant).
- groceryList groups items under the keys listed; use at least produce, protein, grains, pantry.
- prepGuide lists batch-cooking or prep tasks that save time during the week.
- Keep prep times within the family's stated maximum.
- Vary cuisines and avoid repeating the same protein two days in a row.`

export async function generatePlan(preferences) {
  const userPrompt = `Generate a complete weekly meal plan for this family:

${JSON.stringify(preferences, null, 2)}

Remember: respond with valid JSON only, no markdown fences.`

  const message = await client.messages.create({
    model: 'claude-sonnet-4-6',
    max_tokens: 8000,
    system: SYSTEM_PROMPT,
    messages: [{ role: 'user', content: userPrompt }],
  })

  const raw = message.content[0]?.text ?? ''
  return parseJSON(raw)
}

function parseJSON(raw) {
  const trimmed = raw.trim()

  // Try direct parse first
  try {
    return JSON.parse(trimmed)
  } catch (_) {
    // Strip markdown fences if present
    const match = trimmed.match(/```(?:json)?\s*([\s\S]*?)```/)
    if (match) {
      try {
        return JSON.parse(match[1].trim())
      } catch (_) {
        // fall through
      }
    }

    // Last resort: find first { to last }
    const start = trimmed.indexOf('{')
    const end   = trimmed.lastIndexOf('}')
    if (start !== -1 && end > start) {
      return JSON.parse(trimmed.slice(start, end + 1))
    }

    throw new Error('Could not parse meal plan JSON from API response.')
  }
}
