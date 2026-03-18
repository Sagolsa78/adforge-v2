import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const INSTAGRAM_APP_ID = process.env.INSTAGRAM_APP_ID!;
const INSTAGRAM_APP_SECRET = process.env.INSTAGRAM_APP_SECRET!;
const APP_URL = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY!;

const IG_GRAPH_BASE = "https://graph.instagram.com";

/**
 * GET /api/integrations/instagram/callback
 *
 * Handles the OAuth redirect from Instagram.
 * Exchanges the authorization code for tokens and stores the connection.
 *
 * Flow:
 *  1. Receive code from Instagram
 *  2. Exchange code → short-lived token (POST api.instagram.com/oauth/access_token)
 *  3. Exchange short-lived → long-lived token (GET graph.instagram.com/access_token)
 *  4. Fetch IG user info (/me?fields=user_id,username,name,profile_picture_url)
 *  5. Store ig_connection in Supabase user_metadata
 *  6. Redirect to integrations dashboard
 */
export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl;
  const code = searchParams.get("code");
  const error = searchParams.get("error");

  if (error) {
    console.error("Instagram OAuth error:", error, searchParams.get("error_description"));
    return NextResponse.redirect(
      `${APP_URL}/dashboard?tab=integrations&ig_error=${encodeURIComponent(error)}`
    );
  }

  if (!code) {
    return NextResponse.redirect(
      `${APP_URL}/dashboard?tab=integrations&ig_error=no_code`
    );
  }

  const redirectUri = `${APP_URL}/api/integrations/instagram/callback`;

  try {
    // ── Step 1: Exchange code for short-lived token ───────────────────────────
    const tokenFormData = new URLSearchParams({
      client_id: INSTAGRAM_APP_ID,
      client_secret: INSTAGRAM_APP_SECRET,
      grant_type: "authorization_code",
      redirect_uri: redirectUri,
      code,
    });

    const shortTokenRes = await fetch("https://api.instagram.com/oauth/access_token", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: tokenFormData.toString(),
    });

    const shortTokenData = await shortTokenRes.json();

    if (!shortTokenRes.ok || shortTokenData.error) {
      console.error("Short-lived token exchange failed:", shortTokenData);
      throw new Error(shortTokenData.error_message || "Token exchange failed");
    }

    const shortToken = shortTokenData.access_token as string;
    const igUserId = String(shortTokenData.user_id);

    // ── Step 2: Exchange for long-lived token (60 days) ──────────────────────
    const longTokenParams = new URLSearchParams({
      grant_type: "ig_exchange_token",
      client_id: INSTAGRAM_APP_ID,
      client_secret: INSTAGRAM_APP_SECRET,
      access_token: shortToken,
    });

    const longTokenRes = await fetch(
      `${IG_GRAPH_BASE}/access_token?${longTokenParams.toString()}`
    );
    const longTokenData = await longTokenRes.json();

    if (!longTokenRes.ok || longTokenData.error) {
      console.error("Long-lived token exchange failed:", longTokenData);
      throw new Error(longTokenData.error?.message || "Long-lived token exchange failed");
    }

    const accessToken = longTokenData.access_token as string;
    const expiresIn = longTokenData.expires_in as number; // seconds (~5184000 = 60 days)
    const expiresAt = new Date(Date.now() + expiresIn * 1000).toISOString();

    // ── Step 3: Fetch Instagram user profile ─────────────────────────────────
    const meParams = new URLSearchParams({
      fields: "user_id,username,name,profile_picture_url",
      access_token: accessToken,
    });

    const meRes = await fetch(`${IG_GRAPH_BASE}/me?${meParams.toString()}`);
    const meData = await meRes.json();

    if (!meRes.ok || meData.error) {
      console.error("Failed to fetch IG user info:", meData);
      throw new Error(meData.error?.message || "Failed to fetch Instagram profile");
    }

    // ── Step 4: Store connection in Supabase ──────────────────────────────────
    // We need the Supabase session to identify the user.
    // The session token is stored as a cookie — readable server-side via the request.
    const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

    // Get the Supabase session from the request cookies
    const cookieHeader = request.headers.get("cookie") || "";
    const anonClient = createClient(
      SUPABASE_URL,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        global: { headers: { cookie: cookieHeader } },
        auth: { persistSession: false },
      }
    );

    // Parse auth token from cookie
    let userId: string | null = null;
    const cookies = Object.fromEntries(
      cookieHeader.split("; ").map((c) => {
        const [k, ...v] = c.split("=");
        return [k, v.join("=")];
      })
    );

    // Try multiple cookie name patterns Supabase uses
    const tokenCookieNames = Object.keys(cookies).filter(
      (k) => k.includes("auth-token") || k.includes("access-token") || k.startsWith("sb-")
    );

    for (const cookieName of tokenCookieNames) {
      try {
        let cookieValue = decodeURIComponent(cookies[cookieName]);
        // Supabase sometimes stores as base64-encoded JSON
        if (cookieValue.startsWith("base64-")) {
          cookieValue = Buffer.from(cookieValue.slice(7), "base64").toString("utf-8");
        }
        const parsed = JSON.parse(cookieValue);
        const token = parsed.access_token || parsed[0]?.access_token;
        if (token) {
          const { data: { user } } = await supabase.auth.getUser(token);
          if (user) {
            userId = user.id;
            break;
          }
        }
      } catch {}
    }

    if (!userId) {
      // Fallback: redirect to a client-side page that can read the session and complete the flow
      const params = new URLSearchParams({
        ig_user_id: igUserId,
        username: meData.username || "",
        name: meData.name || "",
        access_token: accessToken,
        expires_at: expiresAt,
      });
      return NextResponse.redirect(
        `${APP_URL}/oauth-callback/instagram?${params.toString()}`
      );
    }

    // Store connection
    const igConnection = {
      provider: "instagram",
      connected_at: new Date().toISOString(),
      ig_user_id: igUserId,
      username: meData.username,
      name: meData.name,
      profile_picture_url: meData.profile_picture_url,
      access_token: accessToken,
      expires_at: expiresAt,
    };

    const userRes = await supabase.auth.admin.getUserById(userId);
    const currentMeta = userRes.data?.user?.user_metadata || {};

    await supabase.auth.admin.updateUserById(userId, {
      user_metadata: {
        ...currentMeta,
        ig_connection: igConnection,
      },
    });

    // Also upsert to integrations table
    try {
      await supabase.from("integrations").upsert({
        user_id: userId,
        provider: "instagram",
        provider_account_id: igUserId,
        connected_account: igConnection,
        status: "active",
        updated_at: new Date().toISOString(),
      });
    } catch (e) {
      console.log("Integrations table upsert failed (non-fatal):", e);
    }

    return NextResponse.redirect(
      `${APP_URL}/dashboard?tab=integrations&ig_connected=success`
    );
  } catch (err: any) {
    console.error("Instagram callback error:", err);
    return NextResponse.redirect(
      `${APP_URL}/dashboard?tab=integrations&ig_error=${encodeURIComponent(err.message || "callback_failed")}`
    );
  }
}
