import path from "node:path"
import { execSync } from "node:child_process"
import { defineConfig, loadEnv, type Plugin } from "vite"
import react from "@vitejs/plugin-react"
import tailwindcss from "@tailwindcss/vite"

function gitSha(): string {
  try {
    return execSync("git rev-parse --short HEAD", { encoding: "utf8" }).trim()
  } catch {
    return "dev"
  }
}

/** Local dev proxy for /api/cekura (same contract as Vercel serverless). */
function cekuraDevApi(env: Record<string, string>): Plugin {
  const BASE = "https://api.cekura.ai"
  return {
    name: "cekura-dev-api",
    configureServer(server) {
      server.middlewares.use("/api/cekura", async (req, res) => {
        if (req.method === "OPTIONS") {
          res.statusCode = 200
          res.end()
          return
        }
        if (req.method !== "GET") {
          res.statusCode = 405
          res.setHeader("Content-Type", "application/json")
          res.end(JSON.stringify({ error: "Method not allowed" }))
          return
        }
        const key = env.CEKURA_API_KEY?.trim()
        if (!key) {
          res.statusCode = 503
          res.setHeader("Content-Type", "application/json")
          res.end(JSON.stringify({ error: "CEKURA_API_KEY is not configured" }))
          return
        }
        const url = new URL(req.url ?? "", "http://localhost")
        const resource = url.searchParams.get("resource") ?? ""
        const params = new URLSearchParams(url.searchParams)
        params.delete("resource")

        let apiPath = ""
        if (resource === "run") {
          const id = params.get("id")
          params.delete("id")
          if (!id) {
            res.statusCode = 400
            res.end(JSON.stringify({ error: "id required" }))
            return
          }
          apiPath = `/test_framework/v1/runs/${id}/`
        } else if (resource === "agent") {
          const id = params.get("id") || env.CEKURA_AGENT_ID || "18019"
          params.delete("id")
          apiPath = `/test_framework/v1/aiagents/${id}/`
        } else if (resource === "results") apiPath = "/test_framework/v1/results/"
        else if (resource === "runs") apiPath = "/test_framework/v1/runs/"
        else if (resource === "call-logs") apiPath = "/observability/v1/call-logs/"
        else if (resource === "metrics") apiPath = "/test_framework/v1/metrics/"
        else {
          res.statusCode = 400
          res.end(JSON.stringify({ error: "invalid resource" }))
          return
        }

        if (
          (resource === "results" || resource === "call-logs" || resource === "metrics") &&
          !params.has("project_id")
        ) {
          params.set("project_id", env.CEKURA_PROJECT_ID || "5853")
        }

        try {
          const upstream = await fetch(`${BASE}${apiPath}?${params}`, {
            headers: { "X-CEKURA-API-KEY": key, Accept: "application/json" },
          })
          const body = await upstream.text()
          res.statusCode = upstream.status
          res.setHeader("Content-Type", "application/json")
          res.end(body)
        } catch (err) {
          res.statusCode = 502
          res.end(
            JSON.stringify({
              error: "Failed to reach Cekura API",
              detail: err instanceof Error ? err.message : String(err),
            })
          )
        }
      })
    },
  }
}

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), "")
  return {
    plugins: [react(), tailwindcss(), cekuraDevApi(env)],
    define: {
      __APP_BUILD__: JSON.stringify(gitSha()),
    },
    resolve: {
      alias: {
        "@": path.resolve(__dirname, "./src"),
      },
    },
  }
})
