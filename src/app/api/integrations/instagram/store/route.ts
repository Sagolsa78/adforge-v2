import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY!;

/**
 * POST /api/integrations/instagram/store
 *
 * Client-side fallback: stores the IG connection data after the client
 * has confirmed the Supabase session. Called from the /oauth-callback/instagram page.
 */
export async function POST(request: NextRequest) {
  try {
    const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
    const { data: { session }, error: sessionError } = await supabase.auth.getSession();

    if (sessionError || !session) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }

    const { ig_user_id, username, name, access_token, expires_at } = await request.json();

    if (!ig_user_id || !access_token) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const igConnection = {
      provider: "instagram",
      connected_at: new Date().toISOString(),
      ig_user_id,
      username,
      name,
      access_token,
      expires_at,
    };

    const adminSupabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);
    const userRes = await adminSupabase.auth.admin.getUserById(session.user.id);
    const currentMeta = userRes.data.user?.user_metadata || {};

    await adminSupabase.auth.admin.updateUserById(session.user.id, {
      user_metadata: { ...currentMeta, ig_connection: igConnection },
    });

    try {
      await adminSupabase.from("integrations").upsert({
        user_id: session.user.id,
        provider: "instagram",
        provider_account_id: ig_user_id,
        connected_account: igConnection,
        status: "active",
        updated_at: new Date().toISOString(),
      });
    } catch {}

    return NextResponse.json({ success: true });
  } catch (err: any) {
    console.error("Instagram store error:", err);
    return NextResponse.json({ error: err.message || "Store failed" }, { status: 500 });
  }
}
