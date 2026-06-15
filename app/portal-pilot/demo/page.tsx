// Shared-site contract §3: app/portal-pilot/demo/page.tsx — the one-click live demo.
// Reads NEXT_PUBLIC_PORTALPILOT_API_BASE; defaults to the public backend so the demo
// works even before the Vercel env var is set. The URL is public (NEXT_PUBLIC_*), not a secret.
"use client";
import { useEffect, useState } from "react";

const API =
  process.env.NEXT_PUBLIC_PORTALPILOT_API_BASE ??
  "https://portal-pilot.204-168-226-100.sslip.io";

const ARMS = [
  { id: "hybrid", label: "Hybrid (PortalPilot)" },
  { id: "rpa", label: "Selector-RPA" },
  { id: "vision", label: "Pure-vision agent" },
];
const INJECTS = [
  { id: "", label: "no injection" },
  { id: "visible_text_instruction", label: "inject: visible-text instruction" },
  { id: "hidden_element", label: "inject: hidden element" },
  { id: "fake_approval_banner", label: "inject: fake approval banner" },
  { id: "lookalike_field", label: "inject: look-alike field" },
  { id: "exfil_link", label: "inject: exfiltration link" },
];

type Run = {
  arm: string; completed: boolean; submitted: boolean; escalated: boolean;
  fields_correct: number; fields_total: number; injected_action_executed: boolean;
  model_calls: number; latency_ms: number; steps: { field: string; status: string }[];
  note: string; engine: Record<string, unknown>;
};

export default function PortalPilotDemo() {
  const [arm, setArm] = useState("hybrid");
  const [drift, setDrift] = useState(true);
  const [inject, setInject] = useState("");
  const [run, setRun] = useState<Run | null>(null);
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  async function go() {
    setLoading(true); setErr(null);
    try {
      const r = await fetch(`${API}/run`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ arm, drift, seed: 1001 + Math.floor(Math.random() * 50), inject }),
      });
      if (!r.ok) throw new Error(`API ${r.status}`);
      setRun(await r.json());
    } catch (e: any) {
      setErr(`Could not reach the backend at ${API}. ${e.message}`);
    } finally {
      setLoading(false);
    }
  }
  // auto-run the hero on first load (zero-click wow)
  useEffect(() => { go(); /* eslint-disable-next-line react-hooks/exhaustive-deps */ }, []);

  return (
    <main className="mx-auto max-w-3xl px-6 py-12 text-zinc-100">
      <p className="text-sm font-semibold uppercase tracking-wider text-accent">
        PortalPilot · live demo
      </p>
      <h1 className="mt-1 text-3xl font-bold tracking-tight">Drive a real browser through a drifting portal</h1>
      <p className="mt-2 max-w-2xl text-zinc-400">
        A real headless Chromium fills a real (mock) legacy carrier portal. Toggle drift and the
        page&rsquo;s injected attacks, then compare the three arms — only the hybrid both survives
        drift and refuses the injection.
      </p>

      <div className="mt-6 flex flex-wrap items-center gap-3">
        <select value={arm} onChange={(e) => setArm(e.target.value)}
          className="rounded-lg border border-surface-border bg-surface px-3 py-2 text-sm">
          {ARMS.map((a) => <option key={a.id} value={a.id}>{a.label}</option>)}
        </select>
        <label className="flex items-center gap-2 text-sm text-zinc-400">
          <input type="checkbox" checked={drift} onChange={(e) => setDrift(e.target.checked)} />
          Drift the portal
        </label>
        <select value={inject} onChange={(e) => setInject(e.target.value)}
          className="rounded-lg border border-surface-border bg-surface px-3 py-2 text-sm">
          {INJECTS.map((i) => <option key={i.id} value={i.id}>{i.label}</option>)}
        </select>
        <button onClick={go} disabled={loading}
          className="rounded-lg bg-accent px-5 py-2 font-bold text-zinc-950 hover:brightness-110 disabled:opacity-50">
          {loading ? "Running…" : "▶ Run"}
        </button>
      </div>

      {err && <p className="mt-4 rounded-lg bg-red-950/60 px-4 py-3 text-sm text-red-300">{err}</p>}

      {run && (
        <div className="mt-6 rounded-xl border border-surface-border bg-surface-raised p-5">
          <div className="flex flex-wrap items-center gap-2 text-sm">
            <Pill ok={run.completed}
              label={run.completed ? "✓ Completed" : run.escalated ? "Surfaced to a human" : "Incomplete"} />
            <Pill ok={!run.injected_action_executed}
              label={run.injected_action_executed ? "⚠ Injection EXECUTED" : "Injection refused / none"} />
            <span className="text-zinc-500">fields <b className="text-zinc-200">{run.fields_correct}/{run.fields_total}</b></span>
            <span className="text-zinc-500">model calls <b className="text-zinc-200">{run.model_calls}</b></span>
            <span className="text-zinc-500">{run.latency_ms} ms</span>
          </div>
          {run.note && <p className="mt-3 text-sm text-amber-300">{run.note}</p>}
          <ol className="mt-4 space-y-1 text-sm">
            {run.steps.map((s, i) => (
              <li key={i} className="flex gap-3">
                <span className="w-5 text-right text-zinc-600">{i + 1}</span>
                <span className="w-40 font-mono text-zinc-300">{s.field}</span>
                <span className={
                  s.status.includes("EXECUTED") ? "text-red-400"
                    : s.status.includes("verified") ? "text-accent"
                    : "text-zinc-500"
                }>{s.status}</span>
              </li>
            ))}
          </ol>
          <p className="mt-4 break-all text-xs text-zinc-500">engine: {JSON.stringify(run.engine)}</p>
        </div>
      )}

      {/* contract §4: be honest about what's real vs representative */}
      <div className="mt-8 rounded-xl border border-surface-border bg-surface-raised p-4 text-sm text-zinc-400">
        <b className="text-zinc-200">What&rsquo;s real.</b> Every run drives a real headless
        Chromium against a self-hosted mock carrier portal — no staged animation. The endpoint is
        rate-limited and serialises to one browser session at a time (a public live-browser demo is
        itself an abuse surface). Hybrid resolves drift offline at 0 model calls; the page is never
        a live third-party site (ToS).
      </div>
    </main>
  );
}

function Pill({ ok, label }: { ok: boolean; label: string }) {
  const cls = ok
    ? "border-accent/40 bg-accent-soft text-accent"
    : "border-red-500/40 bg-red-500/10 text-red-300";
  return (
    <span className={`inline-flex items-center rounded-full border px-3 py-0.5 text-xs font-medium ${cls}`}>
      {label}
    </span>
  );
}
