"use client"

import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { cn } from "@/lib/utils"
import { Loader2, Send, Square } from "lucide-react"
import { FormEvent, KeyboardEvent, useRef, useState } from "react"

interface ChatInputProps {
  onSendMessage: (message: string) => void;
  disabled?: boolean;
  onStop?: () => void;
}

export default function ChatInput({
  onSendMessage,
  disabled = false,
  onStop,
}: ChatInputProps) {
  const [input, setInput] = useState("")
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault()
    if (input.trim() && !disabled) {
      onSendMessage(input.trim())
      setInput("")
      // Reset textarea height
      if (textareaRef.current) {
        textareaRef.current.style.height = "auto"
      }
    }
  }

  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      handleSubmit(e as FormEvent)
    }
  }

  const handleInput = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInput(e.target.value)
    // Auto-resize textarea
    e.target.style.height = "auto"
    e.target.style.height = `${Math.min(e.target.scrollHeight, 200)}px`
  }

  return (
    <div className="border-t bg-background p-4">
      <div className="mx-auto max-w-4xl">
        <Card className="relative">
          <form onSubmit={handleSubmit} className="flex items-end gap-2 p-2">
            <textarea
              ref={textareaRef}
              value={input}
              onChange={handleInput}
              onKeyDown={handleKeyDown}
              placeholder="Escribe tu mensaje... (Shift + Enter para nueva línea)"
              disabled={disabled}
              rows={1}
              className={cn(
                "min-h-[44px] max-h-[200px] w-full resize-none",
                "rounded-md border-0 bg-transparent px-3 py-3",
                "text-sm placeholder:text-muted-foreground",
                "focus-visible:outline-none",
                "disabled:cursor-not-allowed disabled:opacity-50",
              )}
            />
            <div className="flex gap-1">
              {disabled && onStop ? (
                <Button
                  type="button"
                  size="icon"
                  variant="destructive"
                  onClick={onStop}
                  className="h-11 w-11 shrink-0"
                >
                  <Square className="h-4 w-4" />
                </Button>
              ) : (
                <Button
                  type="submit"
                  size="icon"
                  disabled={disabled || !input.trim()}
                  className="h-11 w-11 shrink-0"
                >
                  {disabled ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <Send className="h-4 w-4" />
                  )}
                </Button>
              )}
            </div>
          </form>
        </Card>
        <p className="mt-2 text-center text-xs text-muted-foreground">
          El asistente puede cometer errores. Verifica la información
          importante.
        </p>
      </div>
    </div>
  )
}
