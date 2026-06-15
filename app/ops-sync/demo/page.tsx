// Shared-site contract §3: frontend/app/ops-sync/demo/page.tsx — the one-click live demo.
// Reads the backend URL from NEXT_PUBLIC_OPSSYNC_API_BASE (matched to backend CORS).
"use client";
import { useState } from "react";

const API = process.env.NEXT_PUBLIC_OPSSYNC_API_BASE ?? "http://localhost:8006";

type Side = { records: number; wrong: number; consistency_pct: number };

export default function OpsSyncDemo() {
  const [level, setLevel] = useState(20);
  const [res, setRes] = useState<{ engineered: Side; naive: Side } | null>(null);
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  async function injectChaos() {
    setLoading(true); setErr(null);
    try {
      const r = await fetch(`${API}/demo/inject-chaos?level=${level / 100}`, { method: "POST" });
      if (!r.ok) throw new Error(`API ${r.status}`);
      setRes(await r.json());
    } catch (e: any) {
      setErr(`Could not reach the backend at ${API}. ${e.message}`);
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="mx-auto max-w-5xl px-6 py-12 text-zinc-100">
      <p className="text-sm font-semibold uppercase tracking-wider text-blue-400">
        Project 03 · Cross-System Ops Sync · live demo
      </p>
      <h1 className="mt-1 text-3xl font-bold tracking-tight">Consistency under chaos</h1>
      <p className="mt-2 max-w-2xl text-zinc-400">
        Same fault stream, two pipelines. Naive corrupts data; the engineered
        reliability layer holds 0% loss.
      </p>

      <div className="mt-6 flex items-center gap-4">
        <button onClick={injectChaos} disabled={loading}
          className="rounded-lg bg-blue-500 px-5 py-3 font-bold text-blue-950 hover:brightness-110 disabled:opacity-50">
          {loading ? "Running…" : "⚡ Inject chaos"}
        </button>
        <label className="flex items-center gap-2 text-sm text-zinc-400">
          chaos level
          <input type="range" min={5} max={50} value={level}
            onChange={(e) => setLevel(+e.target.value)} />
          {level}%
        </label>
      </div>

      {err && <p className="mt-4 rounded-lg bg-red-950/60 px-4 py-3 text-sm text-red-400">{err}</p>}

      <div className="mt-5 grid grid-cols-1 gap-4 md:grid-cols-2">
        <Card title="🟥 Naive direct-sync" side={res?.naive} tone="bad" />
        <Card title="🟩 Engineered layer" side={res?.engineered} tone="good" />
      </div>

      {/* contract §4: be honest about what's real vs representative */}
      <div className="mt-8 rounded-xl border border-zinc-800 bg-zinc-900/40 p-4 text-sm text-zinc-400">
        <b className="text-zinc-200">About the numbers.</b> This panel runs the <i>real</i> sync
        engine (idempotency, DLQ, version guard, echo-suppression, reconciliation) under
        controlled fault injection against representative systems. The two-way <b>live sync</b>
        widget runs against real HubSpot ↔ Supabase. Both are honest: the engine is production
        code; the chaos harness is a labelled fault-injection test, not a staged animation.
      </div>
    </main>
  );
}

function Card({ title, side, tone }: { title: string; side?: Side; tone: "bad" | "good" }) {
  const color = tone === "good" ? "text-green-400" : "text-red-400";
  return (
    <div className="rounded-xl border border-zinc-800 bg-zinc-900/60 p-5">
      <h2 className="text-sm font-medium">{title}</h2>
      <div className={`mt-2 text-4xl font-extrabold tabular-nums ${color}`}>
        {side ? side.consistency_pct.toFixed(1) : "100.0"}%
      </div>
      <div className="mt-1 text-sm text-zinc-400">
        records wrong <b className="text-zinc-100">{side ? side.wrong : 0}</b>
      </div>
    </div>
  );
}
