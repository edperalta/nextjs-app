"use client"

import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Message } from "@/lib/types/chat.types"
import { cn } from "@/lib/utils"
import { Bot, Check, Copy, User } from "lucide-react"
import { useState } from "react"
import ReactMarkdown from "react-markdown"
import remarkGfm from "remark-gfm"

interface ChatMessageProps {
  message: Message;
}

export default function ChatMessage({ message }: ChatMessageProps) {
  const [copied, setCopied] = useState(false)
  const isUser = message.role === "user"
  const isAssistant = message.role === "assistant"

  const handleCopy = async () => {
    await navigator.clipboard.writeText(message.content)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div
      className={cn(
        "group relative flex gap-3 px-4 py-6 transition-colors hover:bg-muted/50",
        isUser && "flex-row-reverse"
      )}
    >
      {/* Avatar */}
      <Avatar className="h-8 w-8 shrink-0">
        <AvatarFallback
          className={cn(
            "text-sm font-semibold",
            isUser
              ? "bg-primary text-primary-foreground"
              : "bg-muted text-foreground"
          )}
        >
          {isUser ? <User className="h-4 w-4" /> : <Bot className="h-4 w-4" />}
        </AvatarFallback>
      </Avatar>

      {/* Content */}
      <div className="flex-1 space-y-2 overflow-hidden">
        {/* Header */}
        <div className="flex items-center gap-2">
          <span className="text-sm font-semibold">
            {isUser ? "Tú" : "Asistente"}
          </span>
          <span className="text-xs text-muted-foreground">
            {message.timestamp.toLocaleTimeString("es-ES", {
              hour: "2-digit",
              minute: "2-digit",
            })}
          </span>
        </div>

        {/* Message Content */}
        <div
          className={cn(
            "prose prose-sm max-w-none dark:prose-invert",
            "prose-p:leading-relaxed prose-pre:p-0",
            "break-words"
          )}
        >
          {isAssistant ? (
            <ReactMarkdown remarkPlugins={[remarkGfm]}>
              {message.content}
            </ReactMarkdown>
          ) : (
            <p className="whitespace-pre-wrap">{message.content}</p>
          )}
        </div>

        {/* Actions */}
        {isAssistant && (
          <div className="flex gap-1 opacity-0 transition-opacity group-hover:opacity-100">
            <Button
              variant="ghost"
              size="sm"
              onClick={handleCopy}
              className="h-7 px-2 text-xs"
            >
              {copied ? (
                <>
                  <Check className="mr-1 h-3 w-3" />
                  Copiado
                </>
              ) : (
                <>
                  <Copy className="mr-1 h-3 w-3" />
                  Copiar
                </>
              )}
            </Button>
          </div>
        )}
      </div>
    </div>
  )
}
