import type {
  BrandEvent,
  AdVariationsPayload,
  AdVariation,
} from "@/types/onboarding.types";
import { API_BASE_URL, API_ENDPOINTS } from "@/config";

const BASE_URL = API_BASE_URL.replace(/\/$/, "");

// ─── Error helper ────────────────────────────────────────────────────

function apiError(message: string, status: number): never {
  throw { message, status } as { message: string; status: number };
}

// ─── Auth endpoints ──────────────────────────────────────────────────

import { supabase } from "./supabase";

export async function signUp(
  email: string,
  password: string,
  name?: string
): Promise<{ user_id: string }> {
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: { full_name: name || email.split("@")[0] },
    },
  });

  if (error || !data.user) {
    apiError(error?.message || "Sign-up failed", 400);
  }

  return { user_id: data.user.id };
}

export async function signIn(
  email: string,
  password: string
): Promise<{ user_id: string; token: string }> {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error || !data.user || !data.session) {
    apiError(error?.message || "Sign-in failed", 401);
  }

  return { 
    user_id: data.user.id, 
    token: data.session.access_token 
  };
}

// ─── Brand SSE stream ────────────────────────────────────────────────

export async function* createBrandStream(
  url: string,
  brandName: string,
  token?: string
): AsyncGenerator<BrandEvent, void, unknown> {
  const payload = {
    website_url: url,
    name: brandName || "My Brand",
  };

  const res = await fetch(`${BASE_URL}${API_ENDPOINTS.BRANDS}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "text/event-stream",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    body: JSON.stringify(payload),
  });

  if (!res.ok) {
    apiError(`Failed to create brand: ${res.statusText}`, res.status);
  }

  if (!res.body) {
    apiError("ReadableStream not supported in this browser.", 0);
  }

  const reader = res.body.getReader();
  const decoder = new TextDecoder("utf-8");
  let buffer = "";

  while (true) {
    const { done, value } = await reader.read();
    if (done) break;

    buffer += decoder.decode(value, { stream: true });
    const lines = buffer.split("\n");

    buffer = lines.pop() || "";

    for (const line of lines) {
      if (line.trim() === "") continue;

      let jsonString = line;
      if (line.startsWith("data:")) {
        jsonString = line.slice(5).trim();
      }

      try {
        if (jsonString) {
          const event: BrandEvent = JSON.parse(jsonString);
          yield event;
        }
      } catch {
        // Ignore lines that aren't valid JSON
      }
    }
  }
}

// ─── Brand context ───────────────────────────────────────────────────

export async function getBrandContext(
  brandId: string,
  token: string
): Promise<{ context_md: string }> {
  const res = await fetch(`${BASE_URL}${API_ENDPOINTS.BRAND_CONTEXT(brandId)}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });
  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    apiError(body.message || "Failed to fetch brand context", res.status);
  }
  return res.json();
}

// ─── Claim brand ─────────────────────────────────────────────────────

export async function claimBrand(
  brandId: string,
  token: string
): Promise<void> {
  const res = await fetch(`${BASE_URL}${API_ENDPOINTS.BRAND_CLAIM(brandId)}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });
  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    apiError(body.message || "Failed to claim brand", res.status);
  }
}

// ─── Generate ad variations ──────────────────────────────────────────

export async function generateAdVariations(
  brandId: string,
  payload: AdVariationsPayload,
  token: string
): Promise<AdVariation[]> {
  const res = await fetch(`${BASE_URL}${API_ENDPOINTS.BRAND_VARIATIONS(brandId)}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(payload),
  });
  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    apiError(body.message || "Failed to generate ad variations", res.status);
  }
  return res.json();
}
