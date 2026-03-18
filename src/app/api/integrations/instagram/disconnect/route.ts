import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY!;

/**
 * POST /api/integrations/instagram/disconnect
 * Removes the Instagram connection from the current user.
 */
export async function POST(_request: NextRequest) {
  try {
    const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
    const { data: { session }, error } = await supabase.auth.getSession();

    if (error || !session) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }

    const adminSupabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);
    const userRes = await adminSupabase.auth.admin.getUserById(session.user.id);
    const meta = { ...(userRes.data.user?.user_metadata || {}) };
    delete meta.ig_connection;

    await adminSupabase.auth.admin.updateUserById(session.user.id, {
      user_metadata: meta,
    });

    try {
      await adminSupabase
        .from("integrations")
        .delete()
        .eq("user_id", session.user.id)
        .eq("provider", "instagram");
    } catch {}

    return NextResponse.json({ success: true });
  } catch (err: any) {
    console.error("Instagram disconnect error:", err);
    return NextResponse.json({ error: err.message || "Disconnect failed" }, { status: 500 });
  }
}
