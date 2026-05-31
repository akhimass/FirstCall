import { Navigate, Route, Routes } from "react-router-dom"
import { useAuth } from "@/auth/AuthProvider"
import Landing from "@/pages/Landing"
import SignIn from "@/pages/SignIn"
import ConsoleLayout from "@/app/ConsoleLayout"
import Overview from "@/app/Overview"
import Calls from "@/app/Calls"
import Live from "@/app/Live"
import type { ReactNode } from "react"

function Protected({ children }: { children: ReactNode }) {
  const { ready, authed } = useAuth()
  if (!ready) return null
  if (!authed) return <Navigate to="/signin" replace />
  return <>{children}</>
}

function PublicOnly({ children }: { children: ReactNode }) {
  const { ready, authed } = useAuth()
  if (!ready) return null
  if (authed) return <Navigate to="/app/live" replace />
  return <>{children}</>
}

export default function App() {
  return (
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
      <Route
        path="/app"
        element={
          <Protected>
            <ConsoleLayout />
          </Protected>
        }
      >
        <Route index element={<Navigate to="/app/live" replace />} />
        <Route path="overview" element={<Overview />} />
        <Route path="calls" element={<Calls />} />
        <Route path="live" element={<Live />} />
      </Route>
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}
