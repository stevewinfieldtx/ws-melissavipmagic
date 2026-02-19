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

const LEAD_API_URL = 'https://web-production-b295.up.railway.app/api/lead/melissavipmagic'

/**
 * Send lead data to server for storage + email notification to Melissa.
 * Works for both chat conversations and Q&A interactions.
 */
export async function captureLead(leadData: Record<string, string | undefined>): Promise<void> {
  try {
    await fetch(LEAD_API_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(leadData),
    })
  } catch (err) {
    console.error('Lead capture failed:', err)
  }
}

/**
 * Extract lead info from chat conversation using the LLM, then send to server.
 */
export async function extractAndCaptureLead(messages: ChatMessage[]): Promise<void> {
  const conversationText = messages
    .map(msg => (msg.role === 'user' ? 'Guest' : 'Melissa') + ': ' + msg.content)
    .join('\n')

  // Use the RAG endpoint itself to extract lead data (no separate API key needed)
  const extractPrompt = `Extract lead info from this conversation. Return ONLY valid JSON with these fields (null if unknown): name, email, phone, party_composition, travel_dates, destination, budget, special_occasion, experience_prefs, previous_experience, priorities, summary (2-3 sentence brief for the travel agent), next_steps (what to discuss on the follow-up call: specific topics, unanswered questions, concerns raised, what excited them most, and what to recommend based on what they shared).\n\nConversation:\n${conversationText}`

  try {
    const response = await fetch('https://web-production-b295.up.railway.app/api/chat/melissavipmagic', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ question: extractPrompt }),
    })
    const data = await response.json()
    const text = data.answer || '{}'

    let leadData: Record<string, string>
    try {
      const cleaned = text.replace(/```json|```/g, '').trim()
      leadData = JSON.parse(cleaned)
    } catch {
      leadData = { summary: text }
    }

    // Add conversation and source
    leadData.conversation = conversationText
    leadData.source = 'chat'

    await captureLead(leadData)
  } catch (err) {
    // Fallback: save raw conversation even if extraction fails
    await captureLead({
      source: 'chat',
      conversation: conversationText,
      summary: 'Lead extraction failed — raw conversation saved',
    })
  }
}
