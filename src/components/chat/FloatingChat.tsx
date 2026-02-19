import { useState, useRef, useEffect, useCallback } from 'react'
import { MessageCircle, X, Send, Sparkles } from 'lucide-react'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { ChatBubble, TypingIndicator } from './ChatBubble'
import { sendChatMessage } from './chatService'
import type { ChatMessage } from './types'

const WELCOME_MESSAGE = "Hey! Are you planning a Disney trip, or still in the dreaming phase?"

interface FloatingChatProps {
  guideName?: string
  guideTitle?: string
  guideAvatar?: string
  primaryColor?: string
  secondaryColor?: string
  accentColor?: string
  apiKey: string
  modelId?: string
}

export function FloatingChat({
  guideName = 'Melissa Jiles',
  guideTitle = 'Disney VIP Travel Expert',
  guideAvatar = '/images/melissa-portrait.jpg',
  primaryColor = '#7B2D8E',
  secondaryColor = '#E91E8C',
  accentColor = '#F5A623',
  apiKey,
  modelId = 'openai/gpt-4o-mini'
}: FloatingChatProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [inputValue, setInputValue] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [isInitialized, setIsInitialized] = useState(false)
  const [showPulse, setShowPulse] = useState(true)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  // Auto-scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, isLoading])

  // Initialize with welcome message
  useEffect(() => {
    if (isOpen && !isInitialized) {
      const timer = setTimeout(() => {
        setMessages([{
          id: 'welcome',
          role: 'assistant',
          content: WELCOME_MESSAGE,
          timestamp: new Date()
        }])
        setIsInitialized(true)
      }, 400)
      return () => clearTimeout(timer)
    }
  }, [isOpen, isInitialized])

  // Focus input when chat opens AND after every message
  useEffect(() => {
    if (isOpen && isInitialized && !isLoading) {
      setTimeout(() => inputRef.current?.focus(), 50)
    }
  }, [isOpen, isInitialized, isLoading, messages])

  // Stop pulse after first open
  useEffect(() => {
    if (isOpen) setShowPulse(false)
  }, [isOpen])

  const getInitials = (name: string) =>
    name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)

  const sendMessage = useCallback(async () => {
    const trimmed = inputValue.trim()
    if (!trimmed || isLoading) return

    const userMsg: ChatMessage = {
      id: `user-${Date.now()}`,
      role: 'user',
      content: trimmed,
      timestamp: new Date()
    }

    setMessages(prev => [...prev, userMsg])
    setInputValue('')
    setIsLoading(true)

    try {
      const response = await sendChatMessage(messages, trimmed, apiKey, modelId)

      setMessages(prev => [...prev, {
        id: `assistant-${Date.now()}`,
        role: 'assistant',
        content: response,
        timestamp: new Date()
      }])
    } catch (error) {
      console.error('Chat error:', error)
      setMessages(prev => [...prev, {
        id: `error-${Date.now()}`,
        role: 'assistant',
        content: "Sorry, something glitched on my end. Mind trying that again?",
        timestamp: new Date()
      }])
    } finally {
      setIsLoading(false)
    }
  }, [inputValue, isLoading, messages, apiKey, modelId])

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      sendMessage()
    }
  }

  return (
    <>
      {/* Chat Window */}
      <div
        className={`fixed bottom-24 right-6 z-[9999] transition-all duration-300 ease-out ${
          isOpen
            ? 'opacity-100 translate-y-0 scale-100'
            : 'opacity-0 translate-y-4 scale-95 pointer-events-none'
        }`}
      >
        <div
          className="w-[380px] max-w-[calc(100vw-48px)] rounded-3xl shadow-2xl overflow-hidden flex flex-col"
          style={{
            height: 'min(560px, calc(100vh - 140px))',
            background: 'linear-gradient(180deg, #ffffff 0%, #faf8ff 100%)'
          }}
        >
          {/* Header */}
          <div
            className="p-4 text-white relative overflow-hidden flex-shrink-0"
            style={{
              background: `linear-gradient(135deg, ${primaryColor} 0%, ${secondaryColor}cc 100%)`
            }}
          >
            {/* Sparkle dots */}
            <div className="absolute top-2 left-4 w-1.5 h-1.5 bg-white/30 rounded-full animate-pulse" />
            <div className="absolute top-6 right-8 w-1 h-1 bg-white/20 rounded-full animate-pulse" style={{ animationDelay: '0.5s' }} />
            <div className="absolute bottom-3 left-12 w-1 h-1 bg-yellow-300/30 rounded-full animate-pulse" style={{ animationDelay: '1s' }} />

            <div className="flex items-center justify-between relative z-10">
              <div className="flex items-center gap-3">
                <Avatar className="h-11 w-11 ring-2 ring-white/30 shadow-lg">
                  <AvatarImage src={guideAvatar} alt={guideName} className="object-cover" />
                  <AvatarFallback className="text-white font-bold" style={{ backgroundColor: `${primaryColor}99` }}>
                    {getInitials(guideName)}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <h3 className="font-bold text-base leading-tight">{guideName}</h3>
                  <p className="text-white/80 text-xs flex items-center gap-1">
                    <Sparkles className="w-3 h-3" />
                    {guideTitle}
                  </p>
                </div>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="w-8 h-8 rounded-full bg-white/20 hover:bg-white/30 flex items-center justify-center transition-colors"
              >
                <X className="w-4 h-4 text-white" />
              </button>
            </div>
          </div>

          {/* Messages Area */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3">
            {messages.map(msg => (
              <ChatBubble
                key={msg.id}
                message={msg}
                guideName={guideName}
                guideAvatar={guideAvatar}
                primaryColor={primaryColor}
              />
            ))}
            {isLoading && (
              <TypingIndicator
                guideName={guideName}
                guideAvatar={guideAvatar}
                primaryColor={primaryColor}
              />
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input Area */}
          <div className="p-3 border-t border-gray-100 bg-white/80 backdrop-blur-sm flex-shrink-0">
            <div className="flex items-center gap-2">
              <input
                ref={inputRef}
                type="text"
                placeholder="Type your message..."
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyDown={handleKeyDown}
                disabled={isLoading}
                className="flex-1 rounded-full border border-gray-200 px-4 py-2.5 text-sm focus:outline-none focus:border-purple-300 focus:ring-2 focus:ring-purple-200/50 disabled:opacity-50"
              />
              <button
                onClick={sendMessage}
                disabled={isLoading || !inputValue.trim()}
                className="rounded-full h-10 w-10 flex items-center justify-center shadow-md transition-all hover:scale-105 active:scale-95 disabled:opacity-40 disabled:hover:scale-100"
                style={{
                  background: `linear-gradient(135deg, ${primaryColor} 0%, ${secondaryColor} 100%)`
                }}
              >
                <Send className="h-4 w-4 text-white" />
              </button>
            </div>
            <p className="text-center text-[10px] text-gray-400 mt-2">
              Powered by Melissa VIP Magic &bull; AI-Assisted Planning
            </p>
          </div>
        </div>
      </div>

      {/* Floating Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`fixed bottom-6 right-6 z-[9999] w-14 h-14 rounded-full shadow-xl flex items-center justify-center transition-all duration-300 hover:scale-110 active:scale-95 ${
          isOpen ? 'rotate-0' : 'rotate-0'
        }`}
        style={{
          background: `linear-gradient(135deg, ${primaryColor} 0%, ${secondaryColor} 100%)`
        }}
        aria-label={isOpen ? 'Close chat' : 'Chat with Melissa'}
      >
        {isOpen ? (
          <X className="w-6 h-6 text-white" />
        ) : (
          <MessageCircle className="w-6 h-6 text-white" />
        )}

        {/* Pulse ring */}
        {showPulse && !isOpen && (
          <span
            className="absolute inset-0 rounded-full animate-ping opacity-30"
            style={{ backgroundColor: accentColor }}
          />
        )}

        {/* Notification dot */}
        {!isOpen && !isInitialized && (
          <span
            className="absolute -top-1 -right-1 w-4 h-4 rounded-full border-2 border-white flex items-center justify-center"
            style={{ backgroundColor: accentColor }}
          >
            <span className="text-[8px] text-white font-bold">1</span>
          </span>
        )}
      </button>
    </>
  )
}
