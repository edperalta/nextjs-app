"use client"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Separator } from "@/components/ui/separator"
import { Skeleton } from "@/components/ui/skeleton"
import { Message, SUGGESTED_PROMPTS } from "@/lib/types/chat.types"
import {
  Bot,
  MessageSquare,
  Sparkles,
  Trash2
} from "lucide-react"
import { useEffect, useRef, useState } from "react"
import ChatInput from "./ChatInput"
import ChatMessage from "./ChatMessage"
import ChatStarter from "./ChatStarter"

export default function ChatInterface() {
  const [messages, setMessages] = useState<Message[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const scrollAreaRef = useRef<HTMLDivElement>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const handleSendMessage = async (content: string) => {
    if (!content.trim()) return

    // Add user message
    const userMessage: Message = {
      id: Date.now().toString(),
      content,
      role: "user",
      timestamp: new Date(),
    }

    setMessages((prev) => [...prev, userMessage])
    setIsLoading(true)

    // Simulate AI response with streaming effect
    setTimeout(() => {
      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: `Gracias por tu mensaje. Basándome en mi configuración, te ayudaré con lo siguiente:\n\n**Tu consulta:** "${content}"\n\n### Respuesta\n\nEsta es una respuesta simulada que demuestra soporte para **Markdown**, incluyendo:\n\n- Listas con viñetas\n- **Texto en negrita**\n- *Texto en cursiva*\n- \`Código en línea\`\n\n\`\`\`javascript\n// Y bloques de código\nconst ejemplo = "Hola Mundo";\nconsole.log(ejemplo);\n\`\`\`\n\nEn una implementación real, aquí se integraría con APIs como OpenAI, Anthropic Claude, o Google Gemini. 🚀`,
        role: "assistant",
        timestamp: new Date(),
      }
      setMessages((prev) => [...prev, assistantMessage])
      setIsLoading(false)
    }, 1500)
  }

  const handleClearChat = () => {
    setMessages([])
  }

  const handleSelectPrompt = (prompt: string) => {
    handleSendMessage(prompt)
  }

  const handleStopGeneration = () => {
    setIsLoading(false)
  }

  return (
    <div className="flex h-[calc(100vh-4rem)] flex-col">
      {/* Header */}
      <div className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="flex items-center justify-between px-6 py-4">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
              <Bot className="h-5 w-5 text-primary" />
            </div>
            <div>
              <h1 className="text-lg font-semibold">Chat con Agente IA</h1>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Sparkles className="h-3 w-3" />
                <span>Modelo: GPT-4 Simulado</span>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            {messages.length > 0 && (
              <>
                <Badge variant="secondary" className="hidden sm:inline-flex">
                  <MessageSquare className="mr-1 h-3 w-3" />
                  {messages.length} mensajes
                </Badge>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleClearChat}
                >
                  <Trash2 className="h-4 w-4" />
                  <span className="ml-2 hidden sm:inline">Limpiar</span>
                </Button>
              </>
            )}
          </div>
        </div>
        <Separator />
      </div>

      {/* Messages Container */}
      <ScrollArea ref={scrollAreaRef} className="flex-1">
        <div className="mx-auto max-w-4xl">
          {messages.length === 0 && !isLoading ? (
            <ChatStarter
              onSelectPrompt={handleSelectPrompt}
              suggestions={SUGGESTED_PROMPTS}
            />
          ) : (
            <>
              {messages.map((message) => (
                <ChatMessage key={message.id} message={message} />
              ))}
              {isLoading && (
                <div className="px-4 py-6">
                  <div className="flex gap-3">
                    <Skeleton className="h-8 w-8 shrink-0 rounded-full" />
                    <div className="flex-1 space-y-2">
                      <Skeleton className="h-4 w-20" />
                      <Skeleton className="h-4 w-full" />
                      <Skeleton className="h-4 w-3/4" />
                    </div>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </>
          )}
        </div>
      </ScrollArea>

      {/* Input Area */}
      <ChatInput
        onSendMessage={handleSendMessage}
        disabled={isLoading}
        onStop={handleStopGeneration}
      />
    </div>
  )
}
