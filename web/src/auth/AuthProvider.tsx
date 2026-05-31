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
  signOut: () => Promise<void>
}

const AuthContext = createContext<AuthContextValue | null>(null)
const DEMO_KEY = "firstcall.demo.session"

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

async function loadFirmName(userId: string, fallback: string | null): Promise<string | null> {
  if (!supabase) return fallback
  const { data } = await supabase
    .from("profiles")
    .select("firm_name")
    .eq("id", userId)
    .maybeSingle()
  return data?.firm_name ?? fallback
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [ready, setReady] = useState(false)
  const [email, setEmail] = useState<string | null>(null)
  const [firmName, setFirmName] = useState<string | null>(null)

  useEffect(() => {
    if (!isSupabaseConfigured || !supabase) {
      const demo = readDemo()
      if (demo) {
        setEmail(demo.email)
        setFirmName(demo.firmName)
      }
      setReady(true)
      return
    }

    let active = true
    supabase.auth.getSession().then(async ({ data }) => {
      if (!active) return
      const u = data.session?.user
      if (u) {
        setEmail(u.email ?? null)
        setFirmName(
          await loadFirmName(
            u.id,
            (u.user_metadata?.firm_name as string | undefined) ?? FIRM_NAME
          )
        )
      }
      setReady(true)
    })

    const { data: sub } = supabase.auth.onAuthStateChange(async (_e, session) => {
      const u = session?.user
      setEmail(u?.email ?? null)
      if (!u) {
        setFirmName(null)
        return
      }
      setFirmName(
        await loadFirmName(
          u.id,
          (u.user_metadata?.firm_name as string | undefined) ?? FIRM_NAME
        )
      )
    })
    return () => {
      active = false
      sub.subscription.unsubscribe()
    }
  }, [])

  async function signUp(a: SignUpArgs) {
    if (!isSupabaseConfigured || !supabase) {
      const session: DemoSession = { email: a.email, firmName: a.firmName }
      localStorage.setItem(DEMO_KEY, JSON.stringify(session))
      setEmail(a.email)
      setFirmName(a.firmName)
      return {}
    }
    const { data, error } = await supabase.auth.signUp({
      email: a.email,
      password: a.password,
      options: { data: { display_name: a.fullName, firm_name: a.firmName } },
    })
    if (error) return { error: error.message }
    if (data.session?.user) {
      setEmail(data.session.user.email ?? a.email)
      setFirmName(a.firmName)
      return {}
    }
    return { needsConfirmation: true }
  }

  async function signIn(login: string, password: string) {
    if (!isSupabaseConfigured || !supabase) {
      const existing = readDemo()
      const session: DemoSession = {
        email: login,
        firmName: existing?.firmName ?? FIRM_NAME,
      }
      localStorage.setItem(DEMO_KEY, JSON.stringify(session))
      setEmail(session.email)
      setFirmName(session.firmName)
      return {}
    }
    const { data, error } = await supabase.auth.signInWithPassword({
      email: login.trim(),
      password,
    })
    if (error) return { error: error.message }
    const u = data.user
    if (u) {
      setEmail(u.email ?? login.trim())
      setFirmName(
        await loadFirmName(
          u.id,
          (u.user_metadata?.firm_name as string | undefined) ?? FIRM_NAME
        )
      )
    }
    return {}
  }

  async function signOut() {
    if (!isSupabaseConfigured || !supabase) {
      localStorage.removeItem(DEMO_KEY)
    } else {
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
        demoMode: !isSupabaseConfigured,
        signUp,
        signIn,
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
