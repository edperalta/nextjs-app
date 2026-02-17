import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-4xl mx-auto space-y-8">
          {/* Header */}
          <div className="text-center space-y-4">
            <h1 className="text-5xl font-bold tracking-tight text-gray-900">
              Next.js Production App
            </h1>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              A scalable, production-grade application built with Clean
              Architecture, SOLID principles, and modern best practices.
            </p>
          </div>

          {/* Architecture Overview */}
          <Card className="bg-white">
            <CardHeader>
              <CardTitle>Architecture Overview</CardTitle>
              <CardDescription>
                Built following industry best practices
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="p-4 rounded-lg bg-blue-50 border border-blue-200">
                  <h3 className="font-semibold text-blue-900 mb-2">
                    Controllers
                  </h3>
                  <p className="text-sm text-blue-700">
                    Handle HTTP requests and responses only
                  </p>
                </div>
                <div className="p-4 rounded-lg bg-green-50 border border-green-200">
                  <h3 className="font-semibold text-green-900 mb-2">
                    Services
                  </h3>
                  <p className="text-sm text-green-700">
                    Implement business logic and validation
                  </p>
                </div>
                <div className="p-4 rounded-lg bg-purple-50 border border-purple-200">
                  <h3 className="font-semibold text-purple-900 mb-2">
                    Repositories
                  </h3>
                  <p className="text-sm text-purple-700">
                    Handle data access and persistence
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Tech Stack */}
          <Card className="bg-white">
            <CardHeader>
              <CardTitle>Tech Stack</CardTitle>
              <CardDescription>
                Modern technologies for building scalable applications
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {[
                  "Next.js 15",
                  "React 19",
                  "TypeScript",
                  "Tailwind CSS",
                  "shadcn/ui",
                  "TanStack Table",
                  "React Hook Form",
                  "Zod Validation",
                ].map((tech) => (
                  <div
                    key={tech}
                    className="px-3 py-2 text-center rounded-md bg-gray-100 text-gray-700 text-sm font-medium"
                  >
                    {tech}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Features */}
          <Card className="bg-white">
            <CardHeader>
              <CardTitle>Key Features</CardTitle>
              <CardDescription>
                Production-ready features out of the box
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2">
                {[
                  "✅ Strong TypeScript typing with no 'any' types",
                  "✅ DTO boundaries for data validation",
                  "✅ Graceful error handling",
                  "✅ Responsive UI components",
                  "✅ Optimistic updates",
                  "✅ Clean Architecture pattern",
                  "✅ SOLID principles",
                ].map((feature) => (
                  <li key={feature} className="text-gray-700">
                    {feature}
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>

          {/* CTA */}
          <div className="flex justify-center gap-4">
            <Link href="/users">
              <Button size="lg">View Users Demo</Button>
            </Link>
            <a
              href="https://github.com"
              target="_blank"
              rel="noopener noreferrer"
            >
              <Button variant="outline" size="lg">
                View Documentation
              </Button>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
