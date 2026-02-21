/**
 * Chat Types & Interfaces
 * 
 * Centralized type definitions for the chat system
 */

export interface Message {
    id: string;
    content: string;
    role: "user" | "assistant" | "system";
    timestamp: Date;
}

export interface ChatConfig {
    model: string;
    temperature?: number;
    maxTokens?: number;
    systemPrompt?: string;
}

export const DEFAULT_SYSTEM_PROMPT =
    "Eres un asistente amigable y útil. Tu objetivo es ayudar a los usuarios con sus preguntas y proporcionarles información precisa y útil. Responde siempre en español de manera clara y concisa."

export const SUGGESTED_PROMPTS = [
    "¿Cómo puedo mejorar mi código TypeScript?",
    "Explícame el patrón Repository",
    "¿Cuáles son las mejores prácticas de Next.js?",
    "Ayúdame a optimizar mi base de datos",
]
