import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

/**
 * GET /api/integrations/meta/status
 * 
 * Returns the Meta (Facebook/Instagram) connection status for the current user.
 */
export async function GET(request: NextRequest) {
  try {
    const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
    const { data: { session }, error: sessionError } = await supabase.auth.getSession();

    if (sessionError || !session) {
      return NextResponse.json({ connected: false });
    }

    const user = session.user;

    // Check for Meta connection in user_metadata or a separate table
    // For now, we'll check user_metadata which is set after OAuth callback
    const metaConnection = user.user_metadata?.meta_connection;
    
    if (metaConnection) {
      return NextResponse.json({
        connected: true,
        pageName: metaConnection.page_name,
        pageId: metaConnection.page_id,
        instagramConnected: metaConnection.instagram_connected || false,
        instagramName: metaConnection.instagram_name,
      });
    }

    // Check integrations table if it exists
    try {
      const response = await supabase
        .from("integrations")
        .select("provider, connected_account, status")
        .eq("user_id", user.id)
        .eq("provider", "meta")
        .single();

      if (response.data && response.data.status === "active") {
        const account = response.data.connected_account as any;
        return NextResponse.json({
          connected: true,
          pageName: account?.page_name,
          pageId: account?.page_id,
          instagramConnected: account?.instagram_connected || false,
          instagramName: account?.instagram_name,
        });
      }
    } catch (e) {
      // Table might not exist yet, that's ok
      console.log("Integrations table not found, using user_metadata");
    }

    return NextResponse.json({ connected: false });
  } catch (error: any) {
    console.error("Error checking Meta connection status:", error);
    return NextResponse.json({ connected: false });
  }
}
