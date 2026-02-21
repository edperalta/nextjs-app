"use client"

import { Card } from "@/components/ui/card"
import { Lightbulb, Zap } from "lucide-react"

interface ChatStarterProps {
  onSelectPrompt: (prompt: string) => void;
  suggestions: string[];
}

export default function ChatStarter({
  onSelectPrompt,
  suggestions,
}: ChatStarterProps) {
  return (
    <div className="flex h-full items-center justify-center p-8">
      <div className="mx-auto max-w-2xl space-y-8 text-center">
        {/* Header */}
        <div className="space-y-3">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-primary/20 to-primary/10">
            <Zap className="h-8 w-8 text-primary" />
          </div>
          <h2 className="text-3xl font-bold tracking-tight">
            ¿En qué puedo ayudarte?
          </h2>
          <p className="text-muted-foreground">
            Selecciona una sugerencia o escribe tu propia pregunta
          </p>
        </div>

        {/* Suggestions Grid */}
        <div className="grid gap-3 sm:grid-cols-2">
          {suggestions.map((suggestion, index) => (
            <Card
              key={index}
              className="group cursor-pointer border-2 transition-all hover:border-primary hover:shadow-md"
              onClick={() => onSelectPrompt(suggestion)}
            >
              <div className="flex items-start gap-3 p-4 text-left">
                <div className="rounded-lg bg-primary/10 p-2 transition-colors group-hover:bg-primary/20">
                  <Lightbulb className="h-4 w-4 text-primary" />
                </div>
                <p className="text-sm font-medium leading-relaxed">
                  {suggestion}
                </p>
              </div>
            </Card>
          ))}
        </div>

        {/* Features */}
        <div className="grid gap-4 pt-4 text-sm sm:grid-cols-3">
          <div className="space-y-1">
            <div className="font-semibold">💡 Ejemplos inteligentes</div>
            <p className="text-muted-foreground">
              Obtén respuestas basadas en contexto
            </p>
          </div>
          <div className="space-y-1">
            <div className="font-semibold">⚡ Respuestas rápidas</div>
            <p className="text-muted-foreground">
              Streaming en tiempo real
            </p>
          </div>
          <div className="space-y-1">
            <div className="font-semibold">🎯 Soporte Markdown</div>
            <p className="text-muted-foreground">
              Código, listas y formato rico
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
