// Chat types for the Disney VIP Concierge
export interface ChatMessage {
  id: string
  role: 'user' | 'assistant'
  content: string
  timestamp: Date
}

export interface LeadData {
  name?: string
  email?: string
  phone?: string
  partyComposition?: string
  travelDates?: string
  destination?: string
  budget?: string
  specialOccasion?: string
  experiencePreferences?: string
  previousDisneyExperience?: string
  priorities?: string
  summary?: string
}

export interface ChatConfig {
  guideName: string
  guideTitle: string
  guideAvatar?: string
  primaryColor: string
  secondaryColor: string
  accentColor: string
  welcomeMessage: string
  apiEndpoint: string
  modelId: string
  onLeadCapture?: (lead: LeadData) => void
}
