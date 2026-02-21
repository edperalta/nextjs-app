"use client"

export function Footer() {
  return (
    <footer className="border-t bg-muted/30 mt-auto">
      <div className="container py-8 md:py-12">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
          <div className="space-y-3">
            <div className="flex items-center space-x-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground font-bold text-sm">
                N
              </div>
              <span className="font-bold">Next.js App</span>
            </div>
            <p className="text-sm text-muted-foreground">
              Production-grade architecture with modern best practices.
            </p>
          </div>
          
          <div className="space-y-3">
            <h3 className="text-sm font-semibold">Resources</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>
                <a href="#" className="hover:text-foreground transition-colors">
                  Documentation
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-foreground transition-colors">
                  Examples
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-foreground transition-colors">
                  GitHub
                </a>
              </li>
            </ul>
          </div>
          
          <div className="space-y-3">
            <h3 className="text-sm font-semibold">Tech Stack</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>Next.js 16 + React 19</li>
              <li>TypeScript + Tailwind CSS</li>
              <li>shadcn/ui + TanStack Table</li>
            </ul>
          </div>
        </div>
        
        <div className="mt-8 border-t pt-8 text-center text-sm text-muted-foreground">
          <p>Built with ❤️ using modern web technologies</p>
        </div>
      </div>
    </footer>
  )
}
