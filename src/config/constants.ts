/**
 * AdForge App Constants
 *
 * Rules for what lives here:
 *  1. Used in 2+ files across the codebase, OR
 *  2. Referenced in logic (not just rendered), OR
 *  3. Would cause a silent bug if it drifted out of sync between files
 *
 * UI-only strings (button labels, placeholder text, one-off headings)
 * stay inline in their component. Do not add them here.
 */

// ─── App ──────────────────────────────────────────────────────────────────────

export const APP_NAME = "AdForge" as const;

// ─── Routes ───────────────────────────────────────────────────────────────────
// Used in: Navbar.tsx, HeroSection.tsx, FinalCTA.tsx, onboarding/page.tsx

export const ROUTES = {
  HOME:       "/",
  ONBOARDING: "/onboarding",
} as const;

// ─── API ──────────────────────────────────────────────────────────────────────
// Used in: src/lib/api.ts

export const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL ||
  "https://content.bhuexpert.com/api/v1/data";

export const API_ENDPOINTS = {
  SIGNUP:           "/auth/signup",
  SIGNIN:           "/auth/signin",
  BRANDS:           "/brands",
  BRAND_CONTEXT:    (id: string | number) => `/brands/${id}/context`,
  BRAND_CLAIM:      (id: string | number) => `/brands/${id}/claim`,
  BRAND_VARIATIONS: (id: string | number) => `/brands/${id}/ad-variations`,
} as const;

// ─── localStorage Keys ────────────────────────────────────────────────────────
// Used in: src/lib/delayedAuth.ts
// If these strings ever change, sessions break silently — keep centralized

export const STORAGE_KEYS = {
  PENDING_BRAND_ID: "adforge_pending_brand_id",
  PENDING_ACTION:   "adforge_pending_action",
} as const;

// ─── Supabase ─────────────────────────────────────────────────────────────────
// Used in: src/lib/supabase.ts

export const SUPABASE_PROJECT_URL =
  process.env.NEXT_PUBLIC_SUPABASE_URL ||
  "https://cjkovzjojvcjborahmgr.supabase.co";

// ─── Tool Steps ───────────────────────────────────────────────────────────────
// Used in: StepBar.tsx (renamed from StepBar.tsx — see renames below)
// Derived type used in useOnboardingFlow.ts

export const TOOL_STEPS = [
  "URL",
  "Analyse",
  "Results",
  "Template",
  "Generate",
  "Output",
] as const;

export type ToolStep = typeof TOOL_STEPS[number];
export const TOTAL_STEPS = TOOL_STEPS.length;

// ─── Analysis Progress Steps ──────────────────────────────────────────────────
// Used in: BrandAnalysis.tsx

export const ANALYSIS_PROGRESS_STEPS = [
  "Scraping website content",
  "Extracting brand signals",
  "Analysing tone & positioning",
  "Generating 5 brand contexts",
  "Finalising output",
] as const;

// ─── Generation Progress Steps ────────────────────────────────────────────────
// Used in: AdGeneration.tsx

export const GENERATION_PROGRESS_STEPS = [
  "Loading selected context",
  "Applying template structure",
  "Composing slides",
  "Writing caption & hashtags",
  "Finalising output",
] as const;

// ─── Context Index Map ────────────────────────────────────────────────────────
// Used in: contextSplitter.ts, ContextResults.tsx, docs

export const CONTEXT_INDEX_TITLES = {
  1: "Brand Overview",
  2: "Target Audience",
  3: "Value Proposition",
  4: "Tone & Voice",
  5: "Key Differentiators",
} as const;

export type ContextIndex = keyof typeof CONTEXT_INDEX_TITLES;
