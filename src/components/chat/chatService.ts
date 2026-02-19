import type { ChatMessage, LeadData } from './types'

// The TrueInfluence RAG endpoint — real content + real personality
const RAG_API_URL = 'https://web-production-b295.up.railway.app/api/chat/melissavipmagic'

// Discovery context injected into each question so the RAG system
// knows this is a customer discovery conversation, not a general Q&A
function buildDiscoveryQuestion(
  messages: ChatMessage[],
  userMessage: string
): string {
  // Build conversation history for context
  const recentHistory = messages.slice(-6).map(msg =>
    (msg.role === 'user' ? 'Guest' : 'Melissa') + ': ' + msg.content
  ).join('\n')

  // The question sent to RAG includes conversation context + discovery framing
  return [
    recentHistory ? 'CONVERSATION SO FAR:\n' + recentHistory + '\n' : '',
    'Guest just said: ' + userMessage,
  ].join('\n')
}

export async function sendChatMessage(
  messages: ChatMessage[],
  userMessage: string,
  _apiKey?: string,  // kept for interface compat but not used — server handles auth
  _modelId?: string
): Promise<string> {
  const question = buildDiscoveryQuestion(messages, userMessage)

  const response = await fetch(RAG_API_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ question })
  })

  if (!response.ok) {
    const errorText = await response.text()
    console.error('RAG API error:', errorText)
    throw new Error('Failed to generate response')
  }

  const data = await response.json()
  const answer = data.answer

  if (!answer) {
    throw new Error('No response generated')
  }

  return answer
}

export async function extractLeadSummary(
  messages: ChatMessage[],
  apiKey: string,
  modelId: string = 'openai/gpt-4o-mini'
): Promise<LeadData> {
  const conversationText = messages
    .map(msg => (msg.role === 'user' ? 'Guest' : 'Melissa AI') + ': ' + msg.content)
    .join('\n')

  const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': 'Bearer ' + apiKey,
      'HTTP-Referer': window.location.origin,
      'X-Title': 'Disney VIP Lead Extract'
    },
    body: JSON.stringify({
      model: modelId,
      messages: [
        {
          role: 'system',
          content: 'Extract lead information from this Disney vacation planning conversation. Return ONLY valid JSON with these fields (use null for unknown): name, email, phone, partyComposition, travelDates, destination, budget, specialOccasion, experiencePreferences, previousDisneyExperience, priorities, summary (a 2-3 sentence brief for the travel agent).'
        },
        { role: 'user', content: conversationText }
      ],
      temperature: 0.1,
      max_tokens: 500
    })
  })

  if (!response.ok) throw new Error('Failed to extract lead')

  const data = await response.json()
  const text = data.choices?.[0]?.message?.content || '{}'

  try {
    const cleaned = text.replace(/```json|```/g, '').trim()
    return JSON.parse(cleaned)
  } catch {
    return { summary: text }
  }
}
