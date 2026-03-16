/**
 * API Related Constants
 */

export const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api/v1/data";

// Campaign status/assets endpoints live under /data (same router as brands)
export const API_ENDPOINTS = {
  SIGNUP: "/auth/signup",
  SIGNIN: "/auth/signin",
  BRANDS: "/brands",
  BRAND_CONTEXT: (id: string | number) => `/brands/${id}/context`,
  BRAND_CONTEXT_FEEDBACK: (id: string | number) =>
    `/brands/${id}/context-feedback`,
  BRAND_CLAIM: (id: string | number) => `/brands/${id}/claim`,
  BRAND_VARIATIONS: (id: string | number) => `/brands/${id}/ad-variations`,
  BRAND_VARIATIONS_BULK: (id: string | number) => `/brands/${id}/ad-variations/bulk`,
  CAMPAIGNS: "/campaigns",
  CAMPAIGN_STATUS: (id: string) => `/campaigns/${id}/status`,
  CAMPAIGN_ASSETS: (id: string) => `/campaigns/${id}/assets`,
} as const;
