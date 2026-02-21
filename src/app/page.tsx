import { Footer } from "@/components/footer"
import { Navbar } from "@/components/navbar"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import Link from "next/link"

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950">
      <Navbar />
      <div className="container mx-auto px-4 py-12 lg:py-20">
        <div className="max-w-6xl mx-auto space-y-12">
          {/* Hero Section */}
          <div className="text-center space-y-6 py-12 lg:py-20">
            <div className="inline-flex items-center rounded-full px-4 py-1.5 text-sm font-medium bg-primary/10 text-primary ring-1 ring-inset ring-primary/20 mb-4">
              ⚡ Production-Ready Architecture
            </div>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-gray-900 dark:text-white">
              Next.js <span className="text-primary">Production</span> App
            </h1>
            <p className="text-lg sm:text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto leading-relaxed">
              A scalable, production-grade application built with Clean
              Architecture, SOLID principles, and modern best practices.
            </p>
            <div className="flex flex-wrap justify-center gap-4 pt-4">
              <Link href="/users">
                <Button size="lg" className="h-12 px-8 text-base">
                  View Users Demo →
                </Button>
              </Link>
              <a
                href="https://github.com"
                target="_blank"
                rel="noopener noreferrer"
              >
                <Button variant="outline" size="lg" className="h-12 px-8 text-base">
                  Documentation
                </Button>
              </a>
            </div>
          </div>

          {/* Architecture Overview */}
          <div>
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold tracking-tight mb-2">Architecture Overview</h2>
              <p className="text-muted-foreground">Built following industry best practices</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card className="border-2 hover:border-primary/50 transition-colors duration-200 hover:shadow-lg">
                <CardHeader>
                  <div className="w-12 h-12 rounded-lg bg-blue-500/10 flex items-center justify-center mb-2">
                    <span className="text-2xl">🎯</span>
                  </div>
                  <CardTitle className="text-xl">Controllers</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    Handle HTTP requests and responses with clean boundaries. No business logic here.
                  </p>
                </CardContent>
              </Card>
              <Card className="border-2 hover:border-primary/50 transition-colors duration-200 hover:shadow-lg">
                <CardHeader>
                  <div className="w-12 h-12 rounded-lg bg-green-500/10 flex items-center justify-center mb-2">
                    <span className="text-2xl">⚙️</span>
                  </div>
                  <CardTitle className="text-xl">Services</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    Implement core business logic and validation rules. Testable and independent.
                  </p>
                </CardContent>
              </Card>
              <Card className="border-2 hover:border-primary/50 transition-colors duration-200 hover:shadow-lg">
                <CardHeader>
                  <div className="w-12 h-12 rounded-lg bg-purple-500/10 flex items-center justify-center mb-2">
                    <span className="text-2xl">📦</span>
                  </div>
                  <CardTitle className="text-xl">Repositories</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    Handle data access and persistence. Abstract away database specifics.
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Tech Stack */}
          <Card className="bg-gradient-to-br from-card to-card/50">
            <CardHeader className="text-center">
              <CardTitle className="text-2xl">Tech Stack</CardTitle>
              <CardDescription>
                Modern technologies for building scalable applications
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
                {[
                  { name: "Next.js 16", icon: "⚡" },
                  { name: "React 19", icon: "⚛️" },
                  { name: "TypeScript", icon: "📘" },
                  { name: "Tailwind CSS", icon: "🎨" },
                  { name: "shadcn/ui", icon: "🎭" },
                  { name: "TanStack Table", icon: "📊" },
                  { name: "React Hook Form", icon: "📝" },
                  { name: "Zod Validation", icon: "✅" },
                ].map((tech) => (
                  <div
                    key={tech.name}
                    className="flex flex-col items-center gap-2 p-4 rounded-lg bg-muted/50 hover:bg-muted transition-colors border border-transparent hover:border-primary/20"
                  >
                    <span className="text-2xl">{tech.icon}</span>
                    <span className="text-sm font-medium text-center">{tech.name}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Features */}
          <Card>
            <CardHeader className="text-center">
              <CardTitle className="text-2xl">Key Features</CardTitle>
              <CardDescription>
                Production-ready features out of the box
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                {[
                  { icon: "🔒", text: "Strong TypeScript typing with no 'any' types" },
                  { icon: "🛡️", text: "DTO boundaries for data validation" },
                  { icon: "⚠️", text: "Graceful error handling" },
                  { icon: "📱", text: "Responsive UI components" },
                  { icon: "⚡", text: "Optimistic updates" },
                  { icon: "🏗️", text: "Clean Architecture pattern" },
                  { icon: "✨", text: "SOLID principles" },
                  { icon: "🎯", text: "Type-safe API routes" },
                ].map((feature) => (
                  <div key={feature.text} className="flex items-start gap-3 p-3 rounded-lg hover:bg-muted/50 transition-colors">
                    <span className="text-xl flex-shrink-0">{feature.icon}</span>
                    <span className="text-sm">{feature.text}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
      <Footer />
    </div>
  )
}
