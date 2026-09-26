/**
 * jev router: cost/latency-aware model routing.
 * Priority: local small LMs (Ollama) -> free tiers -> paid escalation only when needed.
 */
export interface Route {
  name: string;
  kind: "ollama" | "github-models" | "free-api" | "paid";
  model: string;
  baseUrl: string;
  apiKeyEnv: string | null;
  costPer1k: number;
  latencyMsP50: number;
  maxContext: number;
  available: boolean;
}

export function defaultRoutes(): Route[] {
  return [
    {
      name: "ollama-local", kind: "ollama",
      model: process.env.JEV_LOCAL_MODEL ?? "qwen2.5:7b",
      baseUrl: "http://localhost:11434", apiKeyEnv: null,
      costPer1k: 0, latencyMsP50: 400, maxContext: 32768, available: false,
    },
    {
      name: "github-models", kind: "github-models",
      model: process.env.JEV_GH_MODEL ?? "gpt-4o-mini",
      baseUrl: "https://models.github.ai/inference", apiKeyEnv: "JEV_MODEL_TOKEN",
      costPer1k: 0, latencyMsP50: 1200, maxContext: 128000, available: false,
    },
  ];
}

async function ollamaAlive(url: string): Promise<boolean> {
  try {
    const ctl = new AbortController();
    const t = setTimeout(() => ctl.abort(), 1500);
    const res = await fetch(`${url.replace(/\/$/, "")}/api/tags`, { signal: ctl.signal });
    clearTimeout(t);
    return res.ok;
  } catch {
    return false;
  }
}

export function estimateComplexity(task: string): number {
  const t = task.toLowerCase();
  let score = Math.min(task.length / 4000, 1) * 0.4;
  const hard = ["prove", "security", "architecture", "refactor", "distributed", "concurrency"];
  for (const m of hard) if (t.includes(m)) score += 0.15;
  return Math.min(score, 1);
}

export type Budget = "free" | "balanced" | "max-quality";

/** Pick the cheapest route that can plausibly handle the task. */
export async function route(task: string, budget: Budget = "free"): Promise<Route> {
  const complexity = estimateComplexity(task);
  const routes = defaultRoutes();
  const [local, gh] = routes;
  local.available = await ollamaAlive(local.baseUrl);
  gh.available = Boolean(gh.apiKeyEnv && process.env[gh.apiKeyEnv]);

  if (local.available && (complexity < 0.55 || budget === "free")) return local;
  if (gh.available) return gh;
  if (local.available) return local;
  throw new Error("no model route available: start Ollama or set JEV_MODEL_TOKEN");
}
