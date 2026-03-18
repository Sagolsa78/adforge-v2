import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
const INSTAGRAM_APP_ID = process.env.INSTAGRAM_APP_ID!;
const INSTAGRAM_APP_SECRET = process.env.INSTAGRAM_APP_SECRET!;
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY!;
const IG_GRAPH_BASE = "https://graph.instagram.com";

/**
 * GET /api/integrations/instagram/status
 * Returns the Instagram connection status for the current user.
 * Also refreshes the token if it expires within 10 days.
 */
export async function GET(_request: NextRequest) {
  try {
    const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
    const { data: { session }, error } = await supabase.auth.getSession();

    if (error || !session) {
      return NextResponse.json({ connected: false });
    }

    const igConnection = session.user.user_metadata?.ig_connection;

    if (!igConnection?.access_token) {
      return NextResponse.json({ connected: false });
    }

    // Refresh token if it expires within 10 days
    let accessToken = igConnection.access_token;
    let expiresAt = igConnection.expires_at;

    const msUntilExpiry = new Date(expiresAt).getTime() - Date.now();
    const tenDaysMs = 10 * 24 * 60 * 60 * 1000;

    if (msUntilExpiry < tenDaysMs && msUntilExpiry > 0) {
      try {
        const refreshParams = new URLSearchParams({
          grant_type: "ig_refresh_token",
          access_token: accessToken,
        });
        const refreshRes = await fetch(
          `${IG_GRAPH_BASE}/refresh_access_token?${refreshParams.toString()}`
        );
        const refreshData = await refreshRes.json();

        if (refreshRes.ok && refreshData.access_token) {
          accessToken = refreshData.access_token;
          expiresAt = new Date(Date.now() + refreshData.expires_in * 1000).toISOString();

          const adminSupabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);
          const userRes = await adminSupabase.auth.admin.getUserById(session.user.id);
          const meta = userRes.data.user?.user_metadata || {};
          await adminSupabase.auth.admin.updateUserById(session.user.id, {
            user_metadata: {
              ...meta,
              ig_connection: { ...igConnection, access_token: accessToken, expires_at: expiresAt },
            },
          });
        }
      } catch (refreshErr) {
        console.warn("Token refresh failed (non-fatal):", refreshErr);
      }
    }

    return NextResponse.json({
      connected: true,
      ig_user_id: igConnection.ig_user_id,
      username: igConnection.username,
      name: igConnection.name,
      profile_picture_url: igConnection.profile_picture_url,
      expires_at: expiresAt,
      connected_at: igConnection.connected_at,
    });
  } catch (err: any) {
    console.error("Instagram status error:", err);
    return NextResponse.json({ connected: false });
  }
}
