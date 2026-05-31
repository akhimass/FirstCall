import { Navigate, Outlet, Route, Routes } from "react-router-dom"
import { Loader2 } from "lucide-react"
import { useAuth } from "@/auth/AuthProvider"
import Landing from "@/pages/Landing"
import SignIn from "@/pages/SignIn"
import ConsoleLayout from "@/app/ConsoleLayout"
import Overview from "@/app/Overview"
import Calls from "@/app/Calls"
import Live from "@/app/Live"
import type { ReactNode } from "react"

function AuthBoot({ children }: { children: ReactNode }) {
  const { ready } = useAuth()
  if (!ready) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <Loader2 className="size-8 animate-spin text-muted-foreground" />
      </div>
    )
  }
  return <>{children}</>
}

function Protected({ children }: { children: ReactNode }) {
  const { authed } = useAuth()
  if (!authed) return <Navigate to="/signin" replace />
  return <>{children}</>
}

function PublicOnly({ children }: { children: ReactNode }) {
  const { authed } = useAuth()
  if (authed) return <Navigate to="/app/live" replace />
  return <>{children}</>
}

export default function App() {
  return (
    <AuthBoot>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route
          path="/signin"
          element={
            <PublicOnly>
              <SignIn />
            </PublicOnly>
          }
        />
        <Route path="/signup" element={<Navigate to="/signin" replace />} />
        <Route path="/app" element={<ConsoleLayout />}>
          <Route index element={<Navigate to="/app/live" replace />} />
          <Route path="live" element={<Live />} />
          <Route
            element={
              <Protected>
                <Outlet />
              </Protected>
            }
          >
            <Route path="overview" element={<Overview />} />
            <Route path="calls" element={<Calls />} />
          </Route>
        </Route>
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </AuthBoot>
  )
}
