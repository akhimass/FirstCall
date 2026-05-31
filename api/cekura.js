/** Proxy read-only Cekura API calls (key stays server-side). */
const BASE = "https://api.cekura.ai"

const RESOURCES = new Set(["results", "runs", "run", "call-logs", "metrics", "agent"])

function defaultProjectId() {
  return process.env.CEKURA_PROJECT_ID?.trim() || "5853"
}

function defaultAgentId() {
  return process.env.CEKURA_AGENT_ID?.trim() || "18019"
}

function buildPath(resource, query) {
  if (resource === "run") {
    const id = query.id
    if (!id) return { error: "id is required for resource=run", status: 400 }
    delete query.id
    return { path: `/test_framework/v1/runs/${encodeURIComponent(String(id))}/` }
  }
  if (resource === "agent") {
    const id = query.id || defaultAgentId()
    delete query.id
    return { path: `/test_framework/v1/aiagents/${encodeURIComponent(String(id))}/` }
  }
  if (resource === "results") return { path: "/test_framework/v1/results/" }
  if (resource === "runs") return { path: "/test_framework/v1/runs/" }
  if (resource === "call-logs") return { path: "/observability/v1/call-logs/" }
  if (resource === "metrics") return { path: "/test_framework/v1/metrics/" }
  return { error: `unknown resource: ${resource}`, status: 400 }
}

export default async function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*")
  res.setHeader("Access-Control-Allow-Methods", "GET, OPTIONS")
  res.setHeader("Access-Control-Allow-Headers", "Content-Type")

  if (req.method === "OPTIONS") return res.status(200).end()
  if (req.method !== "GET") return res.status(405).json({ error: "Method not allowed" })

  const key = process.env.CEKURA_API_KEY?.trim()
  if (!key) {
    return res.status(503).json({ error: "CEKURA_API_KEY is not configured on the server" })
  }

  const query = { ...(req.query ?? {}) }
  const resource = String(query.resource ?? "").trim()
  delete query.resource

  if (!RESOURCES.has(resource)) {
    return res.status(400).json({ error: "resource must be one of: " + [...RESOURCES].join(", ") })
  }

  const built = buildPath(resource, query)
  if (built.error) return res.status(built.status).json({ error: built.error })

  const params = new URLSearchParams()
  for (const [k, v] of Object.entries(query)) {
    if (v != null && v !== "") params.set(k, String(v))
  }
  if (
    (resource === "results" || resource === "call-logs" || resource === "metrics") &&
    !params.has("project_id")
  ) {
    params.set("project_id", defaultProjectId())
  }

  const qs = params.toString()
  const url = `${BASE}${built.path}${qs ? `?${qs}` : ""}`

  try {
    const upstream = await fetch(url, {
      headers: { "X-CEKURA-API-KEY": key, Accept: "application/json" },
    })
    const body = await upstream.text()
    res.status(upstream.status)
    res.setHeader("Content-Type", "application/json")
    return res.send(body)
  } catch (err) {
    return res.status(502).json({
      error: "Failed to reach Cekura API",
      detail: err instanceof Error ? err.message : String(err),
    })
  }
}
