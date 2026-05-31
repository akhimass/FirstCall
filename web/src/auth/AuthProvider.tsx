import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react"
import { supabase, isSupabaseConfigured } from "@/lib/supabase"
import { FIRM_NAME } from "@/lib/mock"

export interface SignUpArgs {
  email: string
  password: string
  fullName: string
  firmName: string
}

interface AuthContextValue {
  ready: boolean
  authed: boolean
  email: string | null
  firmName: string | null
  demoMode: boolean
  signUp: (a: SignUpArgs) => Promise<{ error?: string; needsConfirmation?: boolean }>
  signIn: (login: string, password: string) => Promise<{ error?: string }>
  signInDemo: (login?: string) => void
  signOut: () => Promise<void>
}

const AuthContext = createContext<AuthContextValue | null>(null)
const DEMO_KEY = "firstcall.demo.session"
const BOOT_TIMEOUT_MS = 4000

interface DemoSession {
  email: string
  firmName: string
}

function readDemo(): DemoSession | null {
  try {
    const raw = localStorage.getItem(DEMO_KEY)
    return raw ? (JSON.parse(raw) as DemoSession) : null
  } catch {
    return null
  }
}

function writeDemo(session: DemoSession) {
  localStorage.setItem(DEMO_KEY, JSON.stringify(session))
}

function clearDemo() {
  localStorage.removeItem(DEMO_KEY)
}

async function loadFirmName(userId: string, fallback: string | null): Promise<string | null> {
  if (!supabase) return fallback
  try {
    const { data } = await supabase
      .from("profiles")
      .select("firm_name")
      .eq("id", userId)
      .maybeSingle()
    return data?.firm_name ?? fallback
  } catch {
    return fallback
  }
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [ready, setReady] = useState(false)
  const [email, setEmail] = useState<string | null>(null)
  const [firmName, setFirmName] = useState<string | null>(null)
  const [usingDemoSession, setUsingDemoSession] = useState(false)

  useEffect(() => {
    let active = true

    const timeout = window.setTimeout(() => {
      if (active) setReady(true)
    }, BOOT_TIMEOUT_MS)

    async function boot() {
      const demo = readDemo()

      try {
        if (!isSupabaseConfigured || !supabase) {
          if (demo) {
            setEmail(demo.email)
            setFirmName(demo.firmName)
            setUsingDemoSession(true)
          }
          return
        }

        const { data } = await supabase.auth.getSession()
        if (!active) return

        const u = data.session?.user
        if (u) {
          const fallback =
            (u.user_metadata?.firm_name as string | undefined) ?? FIRM_NAME
          setUsingDemoSession(false)
          setEmail(u.email ?? null)
          setFirmName(fallback)
          void loadFirmName(u.id, fallback).then((name) => {
            if (active && name) setFirmName(name)
          })
        } else if (demo) {
          setUsingDemoSession(true)
          setEmail(demo.email)
          setFirmName(demo.firmName)
        }
      } catch {
        if (demo) {
          setUsingDemoSession(true)
          setEmail(demo.email)
          setFirmName(demo.firmName)
        }
      } finally {
        if (active) setReady(true)
      }
    }

    void boot()

    if (!isSupabaseConfigured || !supabase) {
      return () => {
        active = false
        window.clearTimeout(timeout)
      }
    }

    const { data: sub } = supabase.auth.onAuthStateChange(async (_e, session) => {
      const u = session?.user
      if (!u) {
        const demo = readDemo()
        if (demo) {
          setUsingDemoSession(true)
          setEmail(demo.email)
          setFirmName(demo.firmName)
          return
        }
        setEmail(null)
        setFirmName(null)
        setUsingDemoSession(false)
        return
      }
      clearDemo()
      setUsingDemoSession(false)
      setEmail(u.email ?? null)
      const fallback = (u.user_metadata?.firm_name as string | undefined) ?? FIRM_NAME
      setFirmName(fallback)
      void loadFirmName(u.id, fallback).then((name) => {
        if (active && name) setFirmName(name)
      })
    })

    return () => {
      active = false
      window.clearTimeout(timeout)
      sub.subscription.unsubscribe()
    }
  }, [])

  function signInDemo(login = "demo@firstcall.app") {
    const session: DemoSession = {
      email: login.trim() || "demo@firstcall.app",
      firmName: FIRM_NAME,
    }
    writeDemo(session)
    setUsingDemoSession(true)
    setEmail(session.email)
    setFirmName(session.firmName)
  }

  async function signUp(a: SignUpArgs) {
    if (!isSupabaseConfigured || !supabase) {
      signInDemo(a.email)
      return {}
    }
    const { data, error } = await supabase.auth.signUp({
      email: a.email,
      password: a.password,
      options: { data: { display_name: a.fullName, firm_name: a.firmName } },
    })
    if (error) return { error: error.message }
    if (data.session?.user) {
      clearDemo()
      setUsingDemoSession(false)
      setEmail(data.session.user.email ?? a.email)
      setFirmName(a.firmName)
      return {}
    }
    return { needsConfirmation: true }
  }

  async function signIn(login: string, password: string) {
    if (!isSupabaseConfigured || !supabase) {
      signInDemo(login)
      return {}
    }
    const { data, error } = await supabase.auth.signInWithPassword({
      email: login.trim(),
      password,
    })
    if (error) return { error: error.message }
    const u = data.user
    if (u) {
      clearDemo()
      setUsingDemoSession(false)
      setEmail(u.email ?? login.trim())
      const fallback = (u.user_metadata?.firm_name as string | undefined) ?? FIRM_NAME
      setFirmName(fallback)
      void loadFirmName(u.id, fallback).then((name) => {
        if (name) setFirmName(name)
      })
    }
    return {}
  }

  async function signOut() {
    clearDemo()
    setUsingDemoSession(false)
    if (isSupabaseConfigured && supabase) {
      await supabase.auth.signOut()
    }
    setEmail(null)
    setFirmName(null)
  }

  return (
    <AuthContext.Provider
      value={{
        ready,
        authed: Boolean(email),
        email,
        firmName,
        demoMode: usingDemoSession || !isSupabaseConfigured,
        signUp,
        signIn,
        signInDemo,
        signOut,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error("useAuth must be used within AuthProvider")
  return ctx
}
