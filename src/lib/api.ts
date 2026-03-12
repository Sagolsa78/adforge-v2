import type {
  BrandEvent,
  AdVariationsPayload,
  AdVariation,
} from "@/types/tool";

const BASE_URL = (
  process.env.NEXT_PUBLIC_API_URL || "https://content.bhuexpert.com/api/v1/data"
).replace(/\/$/, "");

// ─── Error helper ────────────────────────────────────────────────────

function apiError(message: string, status: number): never {
  throw { message, status } as { message: string; status: number };
}

// ─── Auth endpoints ──────────────────────────────────────────────────

export async function signUp(
  email: string,
  password: string
): Promise<{ token: string; user_id: string }> {
  const res = await fetch(`${BASE_URL}/auth/signup`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  });
  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    apiError(body.message || "Sign-up failed", res.status);
  }
  return res.json();
}

export async function signIn(
  email: string,
  password: string
): Promise<{ token: string; user_id: string }> {
  const res = await fetch(`${BASE_URL}/auth/signin`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  });
  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    apiError(body.message || "Sign-in failed", res.status);
  }
  return res.json();
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

  const res = await fetch(`${BASE_URL}/brands`, {
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
  const res = await fetch(`${BASE_URL}/brands/${brandId}/context`, {
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
  const res = await fetch(`${BASE_URL}/brands/${brandId}/claim`, {
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
  const res = await fetch(`${BASE_URL}/brands/${brandId}/ad-variations`, {
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
