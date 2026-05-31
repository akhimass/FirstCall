import { useEffect, useMemo, useState } from "react"
import { Badge } from "@/components/ui/badge"
import { DecisionBadge } from "@/components/CallBadges"
import { computeKpis, fetchCalls, isAfterHours, whenLabel } from "@/lib/calls"
import { useAuth } from "@/auth/AuthProvider"
import type { Call } from "@/lib/types"

function Kpi({ label, value, hint }: { label: string; value: string; hint?: string }) {
  return (
    <div className="rounded-xl border border-border bg-card px-5 py-4">
      <div className="text-xs font-medium text-muted-foreground">{label}</div>
      <div className="mt-1 text-2xl font-semibold tracking-tight">{value}</div>
      {hint && <div className="mt-0.5 text-xs text-muted-foreground">{hint}</div>}
    </div>
  )
}

function Bar({ label, count, total }: { label: string; count: number; total: number }) {
  const pct = total ? Math.round((count / total) * 100) : 0
  return (
    <div>
      <div className="mb-1 flex justify-between text-sm">
        <span>{label}</span>
        <span className="text-muted-foreground">{count}</span>
      </div>
      <div className="h-2 rounded-full bg-muted">
        <div className="h-2 rounded-full bg-primary" style={{ width: `${pct}%` }} />
      </div>
    </div>
  )
}

export default function Overview() {
  const { firmName } = useAuth()
  const [calls, setCalls] = useState<Call[]>([])
  const [live, setLive] = useState(false)

  useEffect(() => {
    fetchCalls().then(({ calls, live }) => {
      setCalls(calls)
      setLive(live)
    })
  }, [])

  const kpis = useMemo(() => computeKpis(calls), [calls])
  const byCaseType = useMemo(() => {
    const map = new Map<string, number>()
    for (const c of calls) {
      const k = c.case_type ?? "Unknown"
      map.set(k, (map.get(k) ?? 0) + 1)
    }
    return [...map.entries()].sort((a, b) => b[1] - a[1]).slice(0, 6)
  }, [calls])
  const recent = useMemo(() => calls.slice(0, 6), [calls])

  return (
    <div>
      <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b border-border bg-background/80 px-6 backdrop-blur-xl">
        <div>
          <h1 className="text-lg font-semibold tracking-tight">Overview</h1>
          <p className="text-xs text-muted-foreground">{firmName ?? "Your firm"}</p>
        </div>
        <Badge variant={live ? "success" : "outline"}>{live ? "Live data" : "Demo data"}</Badge>
      </header>
      <div className="space-y-6 p-6">
        <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
          <Kpi label="Total calls" value={String(kpis.total)} />
          <Kpi label="Qualified" value={String(kpis.qualified)} hint={`${kpis.qualifiedRate}%`} />
          <Kpi label="After-hours" value={String(kpis.afterHours)} />
          <Kpi label="Declined" value={String(kpis.declined)} />
        </div>
        <div className="grid gap-6 lg:grid-cols-2">
          <div className="rounded-xl border border-border bg-card p-5">
            <h2 className="text-sm font-semibold">Calls by case type</h2>
            <div className="mt-5 space-y-4">
              {byCaseType.map(([label, count]) => (
                <Bar key={label} label={label} count={count} total={calls.length} />
              ))}
            </div>
          </div>
          <div className="rounded-xl border border-border bg-card p-5">
            <h2 className="text-sm font-semibold">Recent activity</h2>
            <div className="mt-3 divide-y divide-border">
              {recent.map((c) => (
                <div key={c.id} className="flex items-center justify-between py-2.5 text-sm">
                  <div>
                    <div className="font-medium">{c.caller_name ?? "Unknown"}</div>
                    <div className="text-xs text-muted-foreground">
                      {c.case_type ?? "—"} · {whenLabel(c)}
                      {isAfterHours(c) ? " · after-hours" : ""}
                    </div>
                  </div>
                  <DecisionBadge decision={c.decision} />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
