// Shared-site contract §3: frontend/app/ops-sync/page.tsx — recruiter case study.
import Link from "next/link";

export default function OpsSyncCaseStudy() {
  return (
    <main className="mx-auto max-w-3xl px-6 py-12 text-zinc-100">
      <p className="text-sm font-semibold uppercase tracking-wider text-blue-400">
        Data / Ops · Integration reliability
      </p>
      <h1 className="mt-1 text-4xl font-bold tracking-tight">Cross-System Ops Sync</h1>
      <p className="mt-3 text-lg text-zinc-300">
        Two-way sync that <b>provably loses nothing</b> under realistic webhook/API chaos.
      </p>

      <Section title="The problem">
        Data lives in silos (CRM ↔ ops DB ↔ chat). Staff re-key by hand (~10 hrs/week), and
        when a sync silently fails, numbers drift for days before anyone notices.
      </Section>

      <Section title="What makes it not a zap">
        The hard part isn’t copying a record — it’s what happens when delivery goes wrong.
        This engine guarantees <b>effectively-once</b> apply (idempotency), kills the classic
        two-way <b>echo loop</b> (origin tagging), blocks <b>stale overwrites</b> (version guard),
        and never silently loses data (retry → dead-letter queue → reconciliation sweep).
      </Section>

      <Section title="Proven, not claimed">
        Under heavy fault injection on the real engine: naive direct-sync corrupts
        <b> 15.4% → 0%</b> with the reliability layer; holds 0% across a 5–50% fault sweep and
        12 seeds; convergence p50 0 ms / p95 150 ms / p99 30 s (the reconcile interval); a
        two-way echo loop drops from 50 writes/edit to 1. Eight tests, one per guarantee.
      </Section>

      <div className="mt-8 flex gap-3">
        <Link href="/ops-sync/demo"
          className="rounded-lg bg-blue-500 px-5 py-3 font-bold text-blue-950">
          ▶ Try the live demo
        </Link>
        <a href="https://github.com/taashchikosi/ops-sync"
          className="rounded-lg border border-zinc-700 px-5 py-3 font-semibold">
          GitHub
        </a>
      </div>
    </main>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="mt-8">
      <h2 className="text-sm font-semibold uppercase tracking-wide text-zinc-400">{title}</h2>
      <p className="mt-2 leading-relaxed text-zinc-200">{children}</p>
    </section>
  );
}
