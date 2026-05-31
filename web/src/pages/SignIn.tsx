import { useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import { Loader2 } from "lucide-react"
import AuthLayout from "@/pages/AuthLayout"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useAuth } from "@/auth/AuthProvider"
import { FIRM_NAME } from "@/lib/mock"

export default function SignIn() {
  const { signIn } = useAuth()
  const navigate = useNavigate()
  const [login, setLogin] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError(null)
    setLoading(true)
    const { error } = await signIn(login.trim(), password)
    setLoading(false)
    if (error) {
      setError(error)
      return
    }
    navigate("/app/overview", { replace: true })
  }

  return (
    <AuthLayout
      title="Sign in"
      subtitle={`${FIRM_NAME} team members only.`}
    >
      <form onSubmit={onSubmit} className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="login">Username or email</Label>
          <Input
            id="login"
            type="text"
            autoComplete="username"
            placeholder="hartley@firstcall.app"
            value={login}
            onChange={(e) => setLogin(e.target.value)}
            required
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="password">Password</Label>
          <Input
            id="password"
            type="password"
            autoComplete="current-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        {error && <p className="text-sm text-destructive">{error}</p>}
        <Button type="submit" className="w-full" disabled={loading}>
          {loading && <Loader2 className="animate-spin" />}
          Sign in
        </Button>
        <p className="text-center text-sm text-muted-foreground">
          New firm?{" "}
          <Link to="/signup" className="font-medium text-primary hover:underline">
            Create your workspace
          </Link>
        </p>
      </form>
    </AuthLayout>
  )
}
