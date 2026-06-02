import { supabase } from "@/lib/supabase"

/** Demo workspace — full mock dashboard when signed in as this user. */
export const DEMO_USER_EMAIL = "hartley@firstcall.app"

export async function isDemoUser(): Promise<boolean> {
  if (!supabase) return false
  const { data } = await supabase.auth.getSession()
  return data.session?.user?.email?.toLowerCase() === DEMO_USER_EMAIL
}
