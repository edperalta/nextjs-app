/**
 * Auth Route Group Layout
 * Centered, full-height layout without Navbar/Footer — used for /login and /register.
 */
export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-indigo-50 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950 p-4">
      {children}
    </div>
  )
}
