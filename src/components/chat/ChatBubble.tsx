import { cn } from '@/lib/utils'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { useEffect, useState } from 'react'
import type { ChatMessage as ChatMessageType } from './types'

interface ChatBubbleProps {
  message: ChatMessageType
  guideName: string
  guideAvatar?: string
  primaryColor: string
}

export function ChatBubble({ message, guideName, guideAvatar, primaryColor }: ChatBubbleProps) {
  const [isVisible, setIsVisible] = useState(false)
  const isUser = message.role === 'user'

  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), 50)
    return () => clearTimeout(timer)
  }, [])

  const getInitials = (name: string) =>
    name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)

  return (
    <div
      className={cn(
        'flex items-end gap-2.5 transition-all duration-400 ease-out',
        isUser ? 'flex-row-reverse' : 'flex-row',
        isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-3'
      )}
    >
      {!isUser && (
        <Avatar className="h-8 w-8 ring-2 ring-white shadow-md flex-shrink-0">
          <AvatarImage src={guideAvatar} alt={guideName} className="object-cover" />
          <AvatarFallback
            className="text-white text-xs font-medium"
            style={{ backgroundColor: primaryColor }}
          >
            {getInitials(guideName)}
          </AvatarFallback>
        </Avatar>
      )}

      <div
        className={cn(
          'max-w-[80%] rounded-2xl px-3.5 py-2.5 shadow-sm',
          isUser
            ? 'rounded-br-md text-white'
            : 'rounded-bl-md bg-white border border-gray-100'
        )}
        style={isUser ? {
          background: `linear-gradient(135deg, ${primaryColor} 0%, ${primaryColor}dd 100%)`
        } : {}}
      >
        <p className={cn(
          'text-sm leading-relaxed whitespace-pre-wrap',
          isUser ? 'text-white' : 'text-gray-800'
        )}>
          {message.content}
        </p>
      </div>
    </div>
  )
}

export function TypingIndicator({ guideName, guideAvatar, primaryColor }: {
  guideName: string
  guideAvatar?: string
  primaryColor: string
}) {
  const getInitials = (name: string) =>
    name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)

  return (
    <div className="flex items-end gap-2.5">
      <Avatar className="h-8 w-8 ring-2 ring-white shadow-md flex-shrink-0">
        <AvatarImage src={guideAvatar} alt={guideName} className="object-cover" />
        <AvatarFallback
          className="text-white text-xs font-medium"
          style={{ backgroundColor: primaryColor }}
        >
          {getInitials(guideName)}
        </AvatarFallback>
      </Avatar>
      <div className="bg-white border border-gray-100 rounded-2xl rounded-bl-md px-4 py-3 shadow-sm">
        <div className="flex items-center gap-1">
          <span className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
          <span className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
          <span className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
        </div>
      </div>
    </div>
  )
}
