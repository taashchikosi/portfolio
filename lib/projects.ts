// Project registry — the home page grid renders from this list.
// Adding a project = add an entry here + a page under app/<slug>/.

export type ProjectStatus = "live" | "in-progress" | "planned";

export type Project = {
  slug: string;
  title: string;
  tagline: string;
  blurb: string;
  tags: string[];
  status: ProjectStatus;
  href?: string; // internal case-study route; omit for planned projects
  repo?: string;
};

export const PROJECTS: Project[] = [
  {
    slug: "retrofitgpt",
    title: "RetrofitGPT",
    tagline: "Autonomous building decarbonisation advisor",
    blurb:
      "A five-agent system that turns a building energy model + 12 months of bills into an audit-ready retrofit business case — running real EnergyPlus behind an MCP physics layer, verified against ASHRAE Guideline 14, an OWASP-LLM06 guardrail, and real NCC 2022 Section J code compliance.",
    tags: ["LangGraph", "MCP", "EnergyPlus", "Claude + DeepSeek", "Next.js"],
    status: "live",
    href: "/retrofitgpt",
    repo: "https://github.com/taashchikosi/Taash_Chikosi_Portfolio",
  },
  {
    slug: "ops-sync",
    title: "Cross-System Ops Sync",
    tagline: "Two-way sync that provably loses nothing under chaos",
    blurb:
      "A reliability engine for two-way HubSpot ↔ Supabase sync: idempotent effectively-once apply, echo-loop suppression, version guard against stale overwrites, and retry → dead-letter → reconciliation so data never silently drops. Under heavy fault injection, naive direct-sync corrupts ~15% of records → 0% with the reliability layer.",
    tags: ["FastAPI", "HubSpot", "Supabase", "Reliability", "Next.js"],
    status: "live",
    href: "/ops-sync",
    repo: "https://github.com/taashchikosi/ops-sync",
  },
  {
    slug: "portal-pilot",
    title: "PortalPilot",
    tagline: "Computer-use with a paper trail",
    blurb:
      "A legacy-portal automation agent that drives a real headless browser through portals with no API — self-heals when the page drifts, read-back-verifies every field so it can't silently corrupt a record, and treats the page as untrusted: it executes 0/20 indirect prompt-injections where a pure-vision agent executes 20/20. Self-hosted Playwright keeps all portal data on-box; every run leaves an audit trail.",
    tags: ["Playwright", "Computer-use", "FastAPI", "Prompt-injection defense", "Next.js"],
    status: "live",
    href: "/portal-pilot",
    repo: "https://github.com/taashchikosi/portal-pilot",
  },
];
