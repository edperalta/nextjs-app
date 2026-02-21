import ChatInterface from "@/components/chat-components/ChatInterface"
import { Navbar } from "@/components/navbar"

export default function ChatPage() {
  return (
    <div className="flex h-screen flex-col">
      <Navbar />
      <ChatInterface />
    </div>
  )
}
