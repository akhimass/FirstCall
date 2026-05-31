import { useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import { Loader2, Phone } from "lucide-react"
import AuthLayout from "@/pages/AuthLayout"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useAuth } from "@/auth/AuthProvider"
import { provisionNumber, saveFirmConfig } from "@/lib/provision"

const TIMEZONES = [
  "America/New_York",
  "America/Chicago",
  "America/Denver",
  "America/Los_Angeles",
  "America/Phoenix",
] as const

const DEFAULT_HOURS = {
  mon: [["09:00", "17:00"]],
  tue: [["09:00", "17:00"]],
  wed: [["09:00", "17:00"]],
  thu: [["09:00", "17:00"]],
  fri: [["09:00", "17:00"]],
}

type Step = "account" | "number" | "hours" | "done"

export default function SignUp() {
  const { signUp } = useAuth()
  const navigate = useNavigate()
  const [step, setStep] = useState<Step>("account")
  const [fullName, setFullName] = useState("")
  const [firmName, setFirmName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [areaCode, setAreaCode] = useState("385")
  const [timezone, setTimezone] = useState<(typeof TIMEZONES)[number]>("America/Denver")
  const [phoneNumber, setPhoneNumber] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  async function onCreateAccount(e: React.FormEvent) {
    e.preventDefault()
    setError(null)
    setLoading(true)
    const result = await signUp({ email: email.trim(), password, fullName: fullName.trim(), firmName: firmName.trim() })
    setLoading(false)
    if (result.error) {
      setError(result.error)
      return
    }
    if (result.needsConfirmation) {
      setError("Check your email to confirm your account, then sign in to finish setup.")
      return
    }
    setStep("number")
  }

  async function onProvision(e: React.FormEvent) {
    e.preventDefault()
    setError(null)
    setLoading(true)
    try {
      const { phone_number } = await provisionNumber(areaCode.trim() || undefined)
      setPhoneNumber(phone_number)
      setStep("hours")
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not provision a number")
    } finally {
      setLoading(false)
    }
  }

  async function onSaveHours(e: React.FormEvent) {
    e.preventDefault()
    setError(null)
    setLoading(true)
    try {
      await saveFirmConfig({
        timezone,
        businessHours: { tz: timezone, days: DEFAULT_HOURS },
      })
      setStep("done")
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not save firm settings")
    } finally {
      setLoading(false)
    }
  }

  if (step === "done") {
    return (
      <AuthLayout title="You're live" subtitle="Your AI intake line is ready.">
        <div className="space-y-4">
          {phoneNumber && (
            <div className="flex items-center gap-3 rounded-lg border border-border bg-muted/40 px-4 py-3">
              <Phone className="size-5 text-primary" />
              <div>
                <div className="text-xs text-muted-foreground">Your intake number</div>
                <div className="font-semibold">{phoneNumber}</div>
              </div>
            </div>
          )}
          <p className="text-sm text-muted-foreground">
            Forward your after-hours line to this number, or share it directly. Calls are scoped to your
            firm in the dashboard.
          </p>
          <Button className="w-full" onClick={() => navigate("/app/overview", { replace: true })}>
            Open dashboard
          </Button>
        </div>
      </AuthLayout>
    )
  }

  if (step === "hours") {
    return (
      <AuthLayout title="Business hours" subtitle="Used for after-hours routing labels (stored on your profile).">
        <form onSubmit={onSaveHours} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="timezone">Timezone</Label>
            <select
              id="timezone"
              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
              value={timezone}
              onChange={(e) => setTimezone(e.target.value as (typeof TIMEZONES)[number])}
            >
              {TIMEZONES.map((tz) => (
                <option key={tz} value={tz}>
                  {tz.replace("America/", "").replace("_", " ")}
                </option>
              ))}
            </select>
          </div>
          <p className="text-sm text-muted-foreground">
            Default intake hours: Monday–Friday, 9:00 AM – 5:00 PM. You can refine this later.
          </p>
          {error && <p className="text-sm text-destructive">{error}</p>}
          <Button type="submit" className="w-full" disabled={loading}>
            {loading && <Loader2 className="animate-spin" />}
            Finish setup
          </Button>
        </form>
      </AuthLayout>
    )
  }

  if (step === "number") {
    return (
      <AuthLayout title="Get your number" subtitle="We'll provision a dedicated Twilio line wired to your AI agent.">
        <form onSubmit={onProvision} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="areaCode">Preferred area code (US)</Label>
            <Input
              id="areaCode"
              inputMode="numeric"
              maxLength={3}
              placeholder="385"
              value={areaCode}
              onChange={(e) => setAreaCode(e.target.value.replace(/\D/g, "").slice(0, 3))}
            />
          </div>
          <p className="text-xs text-muted-foreground">
            This purchases a real Twilio number on the platform account (~$1/mo). Calls route to your
            firm's scoped dashboard automatically.
          </p>
          {error && <p className="text-sm text-destructive">{error}</p>}
          <Button type="submit" className="w-full" disabled={loading}>
            {loading && <Loader2 className="animate-spin" />}
            Get my intake number
          </Button>
        </form>
      </AuthLayout>
    )
  }

  return (
    <AuthLayout title="Create your workspace" subtitle="Set up your firm's AI intake line in minutes.">
      <form onSubmit={onCreateAccount} className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="fullName">Your name</Label>
          <Input
            id="fullName"
            autoComplete="name"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            required
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="firmName">Firm name</Label>
          <Input
            id="firmName"
            value={firmName}
            onChange={(e) => setFirmName(e.target.value)}
            placeholder="Smith & Associates"
            required
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="email">Work email</Label>
          <Input
            id="email"
            type="email"
            autoComplete="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="password">Password</Label>
          <Input
            id="password"
            type="password"
            autoComplete="new-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            minLength={8}
            required
          />
        </div>
        {error && <p className="text-sm text-destructive">{error}</p>}
        <Button type="submit" className="w-full" disabled={loading}>
          {loading && <Loader2 className="animate-spin" />}
          Continue
        </Button>
        <p className="text-center text-sm text-muted-foreground">
          Already have an account?{" "}
          <Link to="/signin" className="font-medium text-primary hover:underline">
            Sign in
          </Link>
        </p>
      </form>
    </AuthLayout>
  )
}
