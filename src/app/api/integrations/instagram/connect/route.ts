import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const SUPABASE_URL          = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const SUPABASE_ANON_KEY     = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

// Backend base URL — the FastAPI server that handles the OAuth flow
// e.g. https://content.bhuexpert.com
const BACKEND_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL?.replace("/api/v1/data", "") ||
  "http://localhost:8000";

/**
 * GET /api/integrations/instagram/connect
 *
 * Reads the current Supabase session, then redirects the browser to the
 * FastAPI backend connect endpoint which builds the Instagram OAuth URL.
 *
 * The registered Meta redirect URI points to the backend:
 *   https://content.bhuexpert.com/api/integrations/instagram/callback
 * so the entire OAuth flow (connect → Instagram → callback) is handled there.
 */
export async function GET(request: NextRequest) {
  const cookieHeader = request.headers.get("cookie") || "";

  // Try to read user session from Supabase cookie
  let userId: string | null = null;

  try {
    const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
      global: { headers: { cookie: cookieHeader } },
      auth:   { persistSession: false },
    });

    // Parse token from cookie manually (Supabase cookie patterns)
    const cookies = Object.fromEntries(
      cookieHeader.split("; ").filter(Boolean).map((c) => {
        const [k, ...v] = c.split("=");
        return [k.trim(), v.join("=")];
      })
    );

    const tokenKeys = Object.keys(cookies).filter(
      (k) =>
        k.includes("auth-token") ||
        k.includes("access-token") ||
        k.startsWith("sb-")
    );

    for (const key of tokenKeys) {
      try {
        let val = decodeURIComponent(cookies[key]);
        if (val.startsWith("base64-")) {
          val = Buffer.from(val.slice(7), "base64").toString("utf-8");
        }
        const parsed = JSON.parse(val);
        const token  = parsed.access_token || parsed[0]?.access_token;
        if (token) {
          const { data: { user } } = await supabase.auth.getUser(token);
          if (user) {
            userId = user.id;
            break;
          }
        }
      } catch {}
    }
  } catch (e) {
    console.warn("Instagram connect: could not read session from cookie", e);
  }

  if (!userId) {
    // Not authenticated — redirect to login with return path
    return NextResponse.redirect(
      new URL("/login?next=/dashboard?tab=integrations", request.url)
    );
  }

  // Hand off to backend — it builds the signed state + Instagram OAuth URL
  const backendConnectUrl = `${BACKEND_BASE_URL}/api/integrations/instagram/connect?user_id=${encodeURIComponent(userId)}`;
  return NextResponse.redirect(backendConnectUrl);
}
