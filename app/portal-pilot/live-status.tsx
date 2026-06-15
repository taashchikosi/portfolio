// Real liveness, not a static badge (shared-site contract §3.4): polls the backend
// /health, which itself confirms the browser driver loads and the portal is reachable.
"use client";
import { useEffect, useState } from "react";

const API =
  process.env.NEXT_PUBLIC_PORTALPILOT_API_BASE ??
  "https://portal-pilot.204-168-226-100.sslip.io";

type Health = { status: string; browser_driver: boolean; portal_reachable: boolean };

export function LiveStatus() {
  const [h, setH] = useState<Health | null>(null);
  const [down, setDown] = useState(false);

  useEffect(() => {
    let alive = true;
    async function poll() {
      try {
        const r = await fetch(`${API}/health`, { cache: "no-store" });
        const j = (await r.json()) as Health;
        if (alive) { setH(j); setDown(false); }
      } catch {
        if (alive) { setH(null); setDown(true); }
      }
    }
    poll();
    const t = setInterval(poll, 15000);
    return () => { alive = false; clearInterval(t); };
  }, []);

  const ok = h?.status === "ok" && h.browser_driver && h.portal_reachable;
  const label = down ? "Backend unreachable" : !h ? "Checking…" : ok ? "Live" : "Degraded";
  const tone = ok ? "border-accent/40 bg-accent-soft text-accent"
    : down ? "border-red-500/40 bg-red-500/10 text-red-300"
    : "border-amber-500/40 bg-amber-500/10 text-amber-200";

  return (
    <span className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-[11px] font-medium ${tone}`}>
      {ok && (
        <span className="relative flex h-1.5 w-1.5">
          <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-accent opacity-60" />
          <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-accent" />
        </span>
      )}
      {label}
    </span>
  );
}
