export interface CekuraMetric {
  id: number
  name: string
  score?: number | null
  score_normalized?: number | null
  explanation?: string | string[] | null
}

export interface CekuraResult {
  id: number
  name: string
  agent_name?: string | null
  status?: string | null
  success_rate?: number | null
  runs?: { id: number; scenario_name?: string | null; status?: string | null }[]
  met_expected_outcome_count?: number | null
  total_expected_outcome_count?: number | null
}

export interface CekuraRunSummary {
  id: number
  scenario_name?: string | null
  personality_name?: string | null
  duration?: string | null
  status?: string | null
  evaluation_status?: string | null
  success?: boolean | null
  timestamp?: string | null
  result_id?: number | null
}

export interface CekuraRunDetail extends CekuraRunSummary {
  evaluation?: { metrics?: CekuraMetric[] }
  transcript?: string | null
  error_message?: string | null
}

export interface CekuraCallLog {
  id: number
  duration?: string | null
  status?: string | null
  agent_name?: string | null
  voice_recording_url?: string | null
  evaluation?: { metrics?: CekuraMetric[] }
  metadata?: Record<string, unknown> | null
}

export interface CekuraAgent {
  id: number
  agent_name?: string | null
  description?: string | null
}

const PROJECT_ID = "5853"
const DASHBOARD_BASE = `https://dashboard.cekura.ai/${PROJECT_ID}`

export function cekuraDashboardUrl(kind: "results" | "observability", id?: number) {
  if (kind === "observability") return `${DASHBOARD_BASE}/observability`
  if (id) return `${DASHBOARD_BASE}/results/${id}`
  return `${DASHBOARD_BASE}/results`
}

async function cekuraGet<T>(params: Record<string, string>): Promise<T | null> {
  const qs = new URLSearchParams(params)
  try {
    const res = await fetch(`/api/cekura?${qs}`)
    if (!res.ok) return null
    return (await res.json()) as T
  } catch {
    return null
  }
}

function listItems<T>(payload: { results?: T[] } | T[] | null): T[] {
  if (!payload) return []
  if (Array.isArray(payload)) return payload
  return payload.results ?? []
}

export async function fetchCekuraAgent(): Promise<CekuraAgent | null> {
  return cekuraGet<CekuraAgent>({ resource: "agent" })
}

export async function fetchCekuraResults(limit = 20): Promise<CekuraResult[]> {
  const data = await cekuraGet<{ results: CekuraResult[] }>({
    resource: "results",
    project_id: PROJECT_ID,
    limit: String(limit),
  })
  return listItems(data)
}

export async function fetchCekuraRuns(resultId: number, limit = 50): Promise<CekuraRunSummary[]> {
  const data = await cekuraGet<{ results: CekuraRunSummary[] }>({
    resource: "runs",
    result_id: String(resultId),
    limit: String(limit),
  })
  return listItems(data)
}

export async function fetchCekuraRun(id: number): Promise<CekuraRunDetail | null> {
  return cekuraGet<CekuraRunDetail>({ resource: "run", id: String(id) })
}

export async function fetchCekuraCallLogs(limit = 25): Promise<CekuraCallLog[]> {
  const data = await cekuraGet<{ results: CekuraCallLog[] }>({
    resource: "call-logs",
    project_id: PROJECT_ID,
    limit: String(limit),
  })
  return listItems(data)
}

export function metricPassed(metric: CekuraMetric): boolean {
  const norm = metric.score_normalized
  if (norm != null && !Number.isNaN(Number(norm))) return Number(norm) >= 1
  const score = metric.score
  if (score != null && !Number.isNaN(Number(score))) return Number(score) >= 1
  return false
}

export function metricExplanation(metric: CekuraMetric): string {
  const ex = metric.explanation
  if (!ex) return ""
  if (Array.isArray(ex)) return ex.join(" ")
  return String(ex)
}

export function formatSuccessRate(rate: number | null | undefined): string {
  if (rate == null || Number.isNaN(Number(rate))) return "—"
  return `${Math.round(Number(rate) * 100)}%`
}

export function countMetricPasses(metrics: CekuraMetric[] | undefined): { pass: number; total: number } {
  const list = metrics ?? []
  const pass = list.filter(metricPassed).length
  return { pass, total: list.length }
}

/** Hackathon-style fallback when CEKURA_API_KEY is not configured locally. */
export const CEKURA_MOCK = {
  versionScores: { v1: 62, v2: 77, v3: 89 },
  personas: [
    "Auto accident — qualified, CA",
    "Slip-and-fall — ongoing PT",
    "SoL expired (TX)",
    "Already represented",
    "Distressed elderly caller",
  ],
  evaluators: [
    "Qualified correctly",
    "Gathered required fields",
    "Handled SoL edge case",
    "Asked injury/treatment Qs",
    "Booking CTA delivered",
  ],
}
