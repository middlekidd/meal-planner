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
    "frozen":    [...],
    "other":     [...],
    "staples":   [{ "item": "", "quantity": "", "notes": "" }]
  },
  "prepGuide": [
    { "task": "", "duration": "", "when": "", "makes": "" }
  ]
}

Rules:
- Each meal has name, description (1–2 sentences), and infantAdaptation (how to serve safely for a BLW infant).
- groceryList groups items under the keys listed; use at least produce, protein, grains.
- "staples" are pantry items the family very likely already has (olive oil, salt, pepper, basic spices, flour, sugar, stock cubes, vinegar, soy sauce, etc.) — list them so the family can check, but keep them visually separate from the main shop.
- All other categories (produce, protein, dairy, grains, frozen, other) are items that need to be specifically purchased for this week's plan.
- prepGuide lists batch-cooking or prep tasks that save time during the week.
- Keep prep times within the family's stated maximum.
- Vary cuisines and avoid repeating the same protein two days in a row.`

const DAYS = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday']

function countDaysInText(text) {
  const lower = text.toLowerCase()
  return DAYS.filter((d) => lower.includes(`"${d}"`)).length
}

export async function generatePlan(preferences, onProgress) {
  const userPrompt = `Generate a complete weekly meal plan for this family:

${JSON.stringify(preferences, null, 2)}

Remember: respond with valid JSON only, no markdown fences.`

  const stream = client.messages.stream({
    model: 'claude-haiku-4-5',
    max_tokens: 8000,
    system: SYSTEM_PROMPT,
    messages: [{ role: 'user', content: userPrompt }],
  })

  let accumulated = ''

  stream.on('text', (text) => {
    accumulated += text
    onProgress?.({ daysReady: countDaysInText(accumulated) })
  })

  await stream.finalMessage()

  return parseJSON(accumulated)
}

function parseJSON(raw) {
  const trimmed = raw.trim()

  try {
    return JSON.parse(trimmed)
  } catch (_) {
    const match = trimmed.match(/```(?:json)?\s*([\s\S]*?)```/)
    if (match) {
      try {
        return JSON.parse(match[1].trim())
      } catch (_) {
        // fall through
      }
    }

    const start = trimmed.indexOf('{')
    const end   = trimmed.lastIndexOf('}')
    if (start !== -1 && end > start) {
      return JSON.parse(trimmed.slice(start, end + 1))
    }

    throw new Error('Could not parse meal plan JSON from API response.')
  }
}
