import type { ReactNode } from "react"
import { Link, useLocation } from "react-router-dom"
import { Button } from "@/components/ui/button"
import { Wordmark } from "@/components/Logo"
import { cn } from "@/lib/utils"

const NAV = [
  { to: "/features", label: "Features" },
  { to: "/how-it-works", label: "How it works" },
  { to: "/pricing", label: "Pricing" },
] as const

export default function MarketingLayout({ children }: { children: ReactNode }) {
  const { pathname } = useLocation()

  return (
    <div className="min-h-screen bg-background text-foreground">
      <header className="sticky top-0 z-50 border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/80">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-6 py-4">
          <Link to="/" className="shrink-0">
            <Wordmark showTagline />
          </Link>
          <nav className="hidden items-center gap-6 text-sm md:flex">
            {NAV.map(({ to, label }) => (
              <Link
                key={to}
                to={to}
                className={cn(
                  "transition-colors hover:text-foreground",
                  pathname === to ? "font-medium text-foreground" : "text-muted-foreground",
                )}
              >
                {label}
              </Link>
            ))}
          </nav>
          <div className="flex items-center gap-2">
            <Button asChild variant="ghost" className="hidden sm:inline-flex">
              <Link to="/signin">Sign in</Link>
            </Button>
            <Button asChild>
              <Link to="/signup">Get started</Link>
            </Button>
          </div>
        </div>
      </header>

      <main>{children}</main>

      <footer className="border-t border-border">
        <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-4 px-6 py-8">
          <Link to="/">
            <Wordmark showTagline />
          </Link>
          <p className="text-sm text-muted-foreground">
            © 2026 FirstCall AI · Built on Pipecat &amp; NVIDIA Nemotron
          </p>
          <div className="flex flex-wrap gap-5 text-sm text-muted-foreground">
            {NAV.map(({ to, label }) => (
              <Link key={to} to={to} className="hover:text-foreground">
                {label}
              </Link>
            ))}
            <Link to="/signin" className="hover:text-foreground">
              Sign in
            </Link>
          </div>
        </div>
      </footer>
    </div>
  )
}
