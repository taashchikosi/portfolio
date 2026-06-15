// Shared-site contract §3: app/portal-pilot/page.tsx — recruiter case study.
import Link from "next/link";
import { LiveStatus } from "./live-status";

export default function PortalPilotCaseStudy() {
  return (
    <main className="mx-auto max-w-3xl px-6 py-12 text-zinc-100">
      <div className="flex items-center gap-3">
        <p className="text-sm font-semibold uppercase tracking-wider text-accent">
          Computer-use · Legacy-portal automation
        </p>
        <LiveStatus />
      </div>
      <h1 className="mt-1 text-4xl font-bold tracking-tight">PortalPilot</h1>
      <p className="mt-3 text-lg text-zinc-300">
        Computer-use with a paper trail: it automates the legacy carrier and government
        portals that have <b>no API</b> — driving a real browser like a human, but with the
        reliability, safety and audit trail an RPA bot never had.
      </p>

      <div className="mt-6 flex gap-3">
        <Link href="/portal-pilot/demo"
          className="rounded-lg bg-accent px-5 py-3 font-bold text-zinc-950 hover:brightness-110">
          ▶ Try the live demo
        </Link>
        <a href="https://github.com/taashchikosi/portal-pilot"
          className="rounded-lg border border-surface-border px-5 py-3 font-semibold text-zinc-200 hover:border-accent/50">
          GitHub
        </a>
      </div>

      <Section title="The problem">
        Insurers, brokers and super funds re-key the same data across 15–20 carrier and
        government portals that expose no API. Legacy RPA &ldquo;solves&rdquo; this but breaks on
        every layout change and can silently corrupt records. The hireable skill in 2026
        isn&rsquo;t clicking — it&rsquo;s an agent that <i>survives drift, can&rsquo;t silently
        corrupt a record, and can&rsquo;t be weaponised by the page</i>.
      </Section>

      <Section title="The approach — a hybrid loop">
        Deterministic browser actions handle the predictable ~80%; the model escalates only
        when the page <i>drifts</i> (a field moves or is renamed). Every committed value is
        <b> read back</b> from the DOM and compared to intent. The page is treated as
        <b> untrusted input</b>: only actions on the approved plan&rsquo;s <b>allow-list</b> run,
        and a human approves before any state-changing submit.
      </Section>

      <Section title="Three arms, measured live (not a strawman)">
        <span className="block">
          The live demo runs all three on a real headless Chromium against a real drifting mock
          portal. The hybrid arm is the only one that both survives drift <i>and</i> refuses the
          page&rsquo;s injected instructions.
        </span>
        <div className="mt-4 overflow-x-auto">
          <table className="w-full border-collapse text-sm">
            <thead>
              <tr className="text-zinc-400">
                <th className="border-b border-surface-border py-2 text-left font-medium"></th>
                <th className="border-b border-surface-border py-2 text-right font-medium">Selector-RPA</th>
                <th className="border-b border-surface-border py-2 text-right font-medium">Pure-vision</th>
                <th className="border-b border-surface-border py-2 text-right font-medium text-accent">Hybrid (ours)</th>
              </tr>
            </thead>
            <tbody className="tabular-nums">
              <Row k="Exact-submission under drift" a="0%" b="~96%" c="~96%" />
              <Row k="Accuracy among submitted" a="28%" b="99%" c="100%" />
              <Row k="Silent record corruption" a="69" b="1" c="0" />
              <Row k="Injected actions executed (5 classes)" a="0/20" b="20/20" c="0/20" />
              <Row k="Model calls" a="0" b="144" c="0*" />
            </tbody>
          </table>
        </div>
      </Section>

      <Section title="The signature move — a paper trail">
        Every run emits an <b>evidence pack</b>: per-step screenshot + DOM snapshot + read-back
        diff, the refused injection, the human approval, and a trace ID — the artifact a
        regulated insurer hands to compliance. No RPA clone produces this.
      </Section>

      <Section title="Security — the page is the attack surface">
        Indirect prompt-injection is tested across 5 classes (visible-text instruction ·
        camouflaged element · fake approval banner · look-alike field · exfil link). The
        <i> more capable</i> the agent, the bigger its injection surface — the pure-vision agent
        executes <b>20/20</b>; the hybrid executes <b>0/20</b>, because the boundary is a
        deterministic allow-list, not the prompt.
      </Section>

      {/* contract §4: honest about what's real vs representative */}
      <div className="mt-10 rounded-xl border border-surface-border bg-surface-raised p-5 text-sm text-zinc-400">
        <b className="text-zinc-200">About the numbers.</b> The table shows <i>representative</i>
        figures from real runs on a self-hosted Playwright browser against a self-hosted mock
        carrier portal. Live exact-submission varies ~82–96% with the truncation rate; what holds
        every run are the invariants — <b>0 silent corruption</b>, <b>0 executed injections</b>,
        and <b>0 model calls</b> for hybrid (offline semantic locate resolved every label rename;
        DeepSeek escalation is wired for genuinely ambiguous drift). The target is always a mock —
        never a live third-party site (ToS); captcha-evasion is out of scope.
      </div>
    </main>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="mt-8">
      <h2 className="text-sm font-semibold uppercase tracking-wide text-zinc-400">{title}</h2>
      <div className="mt-2 leading-relaxed text-zinc-200">{children}</div>
    </section>
  );
}

function Row({ k, a, b, c }: { k: string; a: string; b: string; c: string }) {
  return (
    <tr className="text-zinc-300">
      <td className="border-b border-surface-border/60 py-2 text-left">{k}</td>
      <td className="border-b border-surface-border/60 py-2 text-right text-zinc-500">{a}</td>
      <td className="border-b border-surface-border/60 py-2 text-right text-zinc-500">{b}</td>
      <td className="border-b border-surface-border/60 py-2 text-right font-semibold text-accent">{c}</td>
    </tr>
  );
}
