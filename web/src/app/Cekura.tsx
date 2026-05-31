import { useCallback, useEffect, useMemo, useState } from "react"
import { ExternalLink, FlaskConical, Loader2, RefreshCw, ShieldCheck } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  CEKURA_MOCK,
  cekuraDashboardUrl,
  countMetricPasses,
  fetchCekuraAgent,
  fetchCekuraCallLogs,
  fetchCekuraResults,
  fetchCekuraRun,
  fetchCekuraRuns,
  formatSuccessRate,
  metricExplanation,
  metricPassed,
  type CekuraCallLog,
  type CekuraMetric,
  type CekuraResult,
  type CekuraRunDetail,
  type CekuraRunSummary,
} from "@/lib/cekura"
import { cn } from "@/lib/utils"

type Tab = "simulations" | "observability" | "progress"

function Kpi({ label, value, hint }: { label: string; value: string; hint?: string }) {
  return (
    <div className="rounded-xl border border-border bg-card px-5 py-4">
      <div className="text-xs font-medium text-muted-foreground">{label}</div>
      <div className="mt-1 text-2xl font-semibold tracking-tight">{value}</div>
      {hint && <div className="mt-0.5 text-xs text-muted-foreground">{hint}</div>}
    </div>
  )
}

function StatusBadge({ status }: { status?: string | null }) {
  const s = (status ?? "").toLowerCase()
  if (s.includes("success") || s === "completed" && false) {
    return <Badge variant="success">{status}</Badge>
  }
  if (s.includes("fail") || s.includes("error")) {
    return <Badge variant="destructive">{status}</Badge>
  }
  if (s.includes("review")) {
    return <Badge variant="info">{status}</Badge>
  }
  return <Badge variant="outline">{status ?? "unknown"}</Badge>
}

function MetricList({ metrics }: { metrics?: CekuraMetric[] }) {
  const list = metrics ?? []
  if (!list.length) {
    return <p className="text-sm text-muted-foreground">No metrics scored yet.</p>
  }
  return (
    <div className="space-y-2">
      {list.map((m) => (
        <div
          key={m.id}
          className={cn(
            "rounded-lg border border-border px-3 py-2.5",
            metricPassed(m) ? "border-l-4 border-l-[var(--success)]" : "border-l-4 border-l-destructive"
          )}
        >
          <div className="flex flex-wrap items-center justify-between gap-2">
            <span className="text-sm font-medium">{m.name}</span>
            <Badge variant={metricPassed(m) ? "success" : "destructive"}>
              {metricPassed(m) ? "Pass" : "Fail"}
            </Badge>
          </div>
          {metricExplanation(m) && (
            <p className="mt-1.5 text-xs leading-relaxed text-muted-foreground">
              {metricExplanation(m)}
            </p>
          )}
        </div>
      ))}
    </div>
  )
}

export default function Cekura() {
  const [tab, setTab] = useState<Tab>("simulations")
  const [loading, setLoading] = useState(true)
  const [live, setLive] = useState(false)
  const [agentName, setAgentName] = useState<string | null>(null)
  const [results, setResults] = useState<CekuraResult[]>([])
  const [callLogs, setCallLogs] = useState<CekuraCallLog[]>([])
  const [selectedResultId, setSelectedResultId] = useState<number | null>(null)
  const [runs, setRuns] = useState<CekuraRunSummary[]>([])
  const [selectedRunId, setSelectedRunId] = useState<number | null>(null)
  const [runDetail, setRunDetail] = useState<CekuraRunDetail | null>(null)
  const [runLoading, setRunLoading] = useState(false)

  const load = useCallback(async () => {
    setLoading(true)
    const [agent, resultRows, logs] = await Promise.all([
      fetchCekuraAgent(),
      fetchCekuraResults(20),
      fetchCekuraCallLogs(20),
    ])
    const hasLive = resultRows.length > 0 || logs.length > 0
    setLive(hasLive)
    setAgentName(agent?.agent_name ?? "Lawyer Voice Agent")
    setResults(resultRows)
    setCallLogs(logs)
    if (resultRows.length && !selectedResultId) {
      setSelectedResultId(resultRows[0].id)
    }
    setLoading(false)
  }, [selectedResultId])

  useEffect(() => {
    void load()
  }, [load])

  useEffect(() => {
    if (!selectedResultId || !live) {
      setRuns([])
      return
    }
    void fetchCekuraRuns(selectedResultId).then(setRuns)
  }, [selectedResultId, live])

  useEffect(() => {
    if (!selectedRunId || !live) {
      setRunDetail(null)
      return
    }
    setRunLoading(true)
    void fetchCekuraRun(selectedRunId).then((detail) => {
      setRunDetail(detail)
      setRunLoading(false)
    })
  }, [selectedRunId, live])

  useEffect(() => {
    if (runs.length && !selectedRunId) setSelectedRunId(runs[0].id)
    if (runs.length && selectedRunId && !runs.some((r) => r.id === selectedRunId)) {
      setSelectedRunId(runs[0].id)
    }
  }, [runs, selectedRunId])

  const latestRate = results[0]?.success_rate
  const observedPassRate = useMemo(() => {
    const withMetrics = callLogs.filter((c) => (c.evaluation?.metrics?.length ?? 0) > 0)
    if (!withMetrics.length) return null
    let pass = 0
    let total = 0
    for (const log of withMetrics) {
      const { pass: p, total: t } = countMetricPasses(log.evaluation?.metrics)
      pass += p
      total += t
    }
    return total ? Math.round((pass / total) * 100) : null
  }, [callLogs])

  const tabs: { id: Tab; label: string }[] = [
    { id: "simulations", label: "Simulation results" },
    { id: "observability", label: "Observability" },
    { id: "progress", label: "Prompt iterations" },
  ]

  return (
    <div>
      <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b border-border bg-background/80 px-6 backdrop-blur-xl">
        <div>
          <h1 className="flex items-center gap-2 text-lg font-semibold tracking-tight">
            <FlaskConical className="size-5 text-muted-foreground" />
            Cekura
          </h1>
          <p className="text-xs text-muted-foreground">
            {agentName ?? "Agent"} · simulation evals + production observability
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant={live ? "success" : "warning"}>{live ? "Live API" : "Demo data"}</Badge>
          <Button variant="outline" size="sm" onClick={() => void load()} disabled={loading}>
            {loading ? <Loader2 className="size-4 animate-spin" /> : <RefreshCw className="size-4" />}
            Refresh
          </Button>
          <Button asChild variant="outline" size="sm">
            <a href={cekuraDashboardUrl("results")} target="_blank" rel="noreferrer">
              Open Cekura <ExternalLink className="size-3.5" />
            </a>
          </Button>
        </div>
      </header>

      <div className="space-y-6 p-6">
        {!live && (
          <div className="rounded-xl border border-border bg-muted/30 px-4 py-3 text-sm text-muted-foreground">
            Set <code className="text-xs">CEKURA_API_KEY</code> on Vercel (or run{" "}
            <code className="text-xs">vercel dev</code> locally) to load live Cekura data. Showing
            hackathon benchmark scores below.
          </div>
        )}

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <Kpi
            label="Latest eval success rate"
            value={live ? formatSuccessRate(latestRate) : `${CEKURA_MOCK.versionScores.v3}%`}
            hint={live && results[0]?.name ? results[0].name.slice(0, 40) : "v3 benchmark"}
          />
          <Kpi
            label="Eval batches"
            value={live ? String(results.length) : "3"}
            hint="Simulation result groups"
          />
          <Kpi
            label="Observed calls"
            value={live ? String(callLogs.length) : "—"}
            hint="Production observability"
          />
          <Kpi
            label="Metric pass rate (obs.)"
            value={observedPassRate != null ? `${observedPassRate}%` : "—"}
            hint="Across tracked intake metrics"
          />
        </div>

        <div className="flex flex-wrap gap-2 border-b border-border pb-1">
          {tabs.map((t) => (
            <button
              key={t.id}
              type="button"
              onClick={() => setTab(t.id)}
              className={cn(
                "rounded-md px-3 py-1.5 text-sm font-medium transition-colors",
                tab === t.id
                  ? "bg-secondary text-foreground"
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              {t.label}
            </button>
          ))}
        </div>

        {tab === "simulations" && (
          <div className="grid gap-6 lg:grid-cols-[1.1fr_1fr]">
            <div className="rounded-xl border border-border bg-card">
              <div className="border-b border-border px-4 py-3">
                <h2 className="text-sm font-semibold">Recent simulation runs</h2>
              </div>
              <div className="divide-y divide-border">
                {loading && (
                  <div className="flex justify-center py-10">
                    <Loader2 className="size-6 animate-spin text-muted-foreground" />
                  </div>
                )}
                {!loading && live && results.length === 0 && (
                  <p className="px-4 py-8 text-sm text-muted-foreground">No simulation results yet.</p>
                )}
                {!loading &&
                  live &&
                  results.map((r) => (
                    <button
                      key={r.id}
                      type="button"
                      onClick={() => {
                        setSelectedResultId(r.id)
                        setSelectedRunId(null)
                      }}
                      className={cn(
                        "flex w-full items-start justify-between gap-3 px-4 py-3 text-left transition-colors hover:bg-muted/40",
                        selectedResultId === r.id && "bg-muted/50"
                      )}
                    >
                      <div className="min-w-0">
                        <div className="truncate font-medium">{r.name || `Result ${r.id}`}</div>
                        <div className="mt-0.5 text-xs text-muted-foreground">
                          {r.runs?.length ?? 0} runs · {r.agent_name ?? agentName}
                        </div>
                      </div>
                      <div className="flex shrink-0 flex-col items-end gap-1">
                        <span className="text-sm font-semibold">{formatSuccessRate(r.success_rate)}</span>
                        <StatusBadge status={r.status} />
                      </div>
                    </button>
                  ))}
              </div>
            </div>

            <div className="space-y-4">
              <div className="rounded-xl border border-border bg-card p-4">
                <div className="mb-3 flex items-center justify-between gap-2">
                  <h2 className="text-sm font-semibold">Run detail</h2>
                  {selectedResultId && live && (
                    <a
                      className="text-xs text-muted-foreground hover:text-foreground"
                      href={cekuraDashboardUrl("results", selectedResultId)}
                      target="_blank"
                      rel="noreferrer"
                    >
                      View in Cekura ↗
                    </a>
                  )}
                </div>
                {live && runs.length > 0 && (
                  <select
                    className="mb-3 w-full rounded-md border border-border bg-background px-3 py-2 text-sm"
                    value={selectedRunId ?? ""}
                    onChange={(e) => setSelectedRunId(Number(e.target.value))}
                  >
                    {runs.map((run) => (
                      <option key={run.id} value={run.id}>
                        {run.scenario_name ?? `Run ${run.id}`} · {run.duration ?? "—"} ·{" "}
                        {run.evaluation_status ?? run.status}
                      </option>
                    ))}
                  </select>
                )}
                {runLoading && (
                  <div className="flex justify-center py-8">
                    <Loader2 className="size-5 animate-spin text-muted-foreground" />
                  </div>
                )}
                {!runLoading && live && runDetail && (
                  <div className="space-y-3">
                    <div className="flex flex-wrap gap-2 text-xs text-muted-foreground">
                      <span>{runDetail.personality_name}</span>
                      <span>·</span>
                      <span>{runDetail.timestamp ? new Date(runDetail.timestamp).toLocaleString() : ""}</span>
                    </div>
                    {runDetail.error_message && (
                      <p className="rounded-md border border-destructive/30 bg-destructive/5 px-3 py-2 text-xs text-destructive">
                        {runDetail.error_message}
                      </p>
                    )}
                    <MetricList metrics={runDetail.evaluation?.metrics} />
                  </div>
                )}
                {!live && (
                  <div className="space-y-2">
                    <p className="text-sm text-muted-foreground">
                      Tracked metrics from scenario 273084 (Legal Intake Key Questions):
                    </p>
                    {[
                      "Agent Asked What Happened",
                      "Agent Asked About Medical Attention",
                      "Agent Asked About Legal Representation",
                    ].map((name) => (
                      <div key={name} className="rounded-lg border border-border px-3 py-2 text-sm">
                        {name}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {tab === "observability" && (
          <div className="rounded-xl border border-border bg-card">
            <div className="flex items-center justify-between border-b border-border px-4 py-3">
              <h2 className="text-sm font-semibold">Production call logs</h2>
              <a
                className="text-xs text-muted-foreground hover:text-foreground"
                href={cekuraDashboardUrl("observability")}
                target="_blank"
                rel="noreferrer"
              >
                Observability in Cekura ↗
              </a>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full min-w-[640px] text-sm">
                <thead>
                  <tr className="border-b border-border text-left text-xs text-muted-foreground">
                    <th className="px-4 py-2 font-medium">Call</th>
                    <th className="px-4 py-2 font-medium">Duration</th>
                    <th className="px-4 py-2 font-medium">Status</th>
                    <th className="px-4 py-2 font-medium">Metrics</th>
                    <th className="px-4 py-2 font-medium">Agent</th>
                  </tr>
                </thead>
                <tbody>
                  {loading && (
                    <tr>
                      <td colSpan={5} className="py-10 text-center">
                        <Loader2 className="mx-auto size-6 animate-spin text-muted-foreground" />
                      </td>
                    </tr>
                  )}
                  {!loading && live && callLogs.length === 0 && (
                    <tr>
                      <td colSpan={5} className="px-4 py-8 text-muted-foreground">
                        No observability call logs yet. Completed Twilio calls appear here after
                        upload.
                      </td>
                    </tr>
                  )}
                  {!loading &&
                    live &&
                    callLogs.map((log) => {
                      const { pass, total } = countMetricPasses(log.evaluation?.metrics)
                      return (
                        <tr key={log.id} className="border-b border-border/60 hover:bg-muted/30">
                          <td className="px-4 py-3 font-mono text-xs">{log.id}</td>
                          <td className="px-4 py-3">{log.duration ?? "—"}</td>
                          <td className="px-4 py-3">
                            <StatusBadge status={log.status} />
                          </td>
                          <td className="px-4 py-3">
                            {total ? (
                              <span className="inline-flex items-center gap-1">
                                <ShieldCheck className="size-3.5 text-muted-foreground" />
                                {pass}/{total} pass
                              </span>
                            ) : (
                              "—"
                            )}
                          </td>
                          <td className="px-4 py-3 text-muted-foreground">{log.agent_name ?? "—"}</td>
                        </tr>
                      )
                    })}
                  {!live && (
                    <tr>
                      <td colSpan={5} className="px-4 py-8 text-muted-foreground">
                        Connect CEKURA_API_KEY to list production calls from observability.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {tab === "progress" && (
          <div className="grid gap-6 lg:grid-cols-2">
            <div className="rounded-xl border border-border bg-card p-5">
              <h2 className="text-sm font-semibold">Score progression (v1 → v3)</h2>
              <p className="mt-1 text-xs text-muted-foreground">
                Hackathon benchmark from prompt iteration loop — mirrors Streamlit eval dashboard.
              </p>
              <div className="mt-6 space-y-4">
                {(["v1", "v2", "v3"] as const).map((v) => {
                  const score = CEKURA_MOCK.versionScores[v]
                  return (
                    <div key={v}>
                      <div className="mb-1 flex justify-between text-sm">
                        <span className="font-medium uppercase">{v}</span>
                        <span>{score}%</span>
                      </div>
                      <div className="h-2 rounded-full bg-muted">
                        <div className="h-2 rounded-full bg-primary" style={{ width: `${score}%` }} />
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
            <div className="rounded-xl border border-border bg-card p-5">
              <h2 className="text-sm font-semibold">Tracked intake metrics</h2>
              <ul className="mt-4 space-y-2 text-sm text-muted-foreground">
                <li>Agent Asked What Happened</li>
                <li>Agent Asked About Medical Attention</li>
                <li>Agent Asked About Legal Representation</li>
              </ul>
              <p className="mt-4 text-xs leading-relaxed text-muted-foreground">
                After each live call, the agent uploads transcripts to Cekura observability. Failed
                metrics feed the eval loop in <code className="text-[11px]">server/tools/eval_loop.py</code>.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
