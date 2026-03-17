import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

/**
 * GET /api/integrations/meta/callback
 * 
 * Handles OAuth callback from Supabase after Facebook authentication.
 * This endpoint processes the Facebook OAuth response and stores connection data.
 */
export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const code = searchParams.get("code");
  const provider = searchParams.get("provider") || "facebook";
  const error = searchParams.get("error");
  const errorDescription = searchParams.get("error_description");

  // Handle OAuth errors
  if (error) {
    console.error("OAuth error:", error, errorDescription);
    return NextResponse.redirect(
      new URL("/dashboard?tab=integrations&error=oauth_failed", request.url)
    );
  }

  try {
    const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
    
    // Get the session - Supabase should have already set the session cookie
    const { data: { session }, error: sessionError } = await supabase.auth.getSession();

    if (sessionError || !session) {
      console.error("No session found after OAuth callback");
      return NextResponse.redirect(
        new URL("/dashboard?tab=integrations&error=auth_failed", request.url)
      );
    }

    const user = session.user;

    // Get provider token from session or fetch from Supabase
    // Note: In a production app, you'd want to fetch the actual Facebook access token
    // from Supabase's provider_tokens table or session
    
    // For now, we'll mark the connection as successful
    // In production, you should fetch and store the actual Facebook access token
    const metaConnection = {
      provider: provider,
      connected_at: new Date().toISOString(),
      user_id: user.id,
      page_name: user.user_metadata?.full_name || "Facebook Page",
      page_id: user.id, // Placeholder - should be actual Facebook Page ID
      instagram_connected: false,
      instagram_name: null,
    };

    // Store connection in user_metadata
    const adminSupabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY || SUPABASE_ANON_KEY);
    
    try {
      await adminSupabase.auth.admin.updateUserById(
        user.id,
        {
          user_metadata: {
            ...user.user_metadata,
            meta_connection: metaConnection,
          },
        }
      );
    } catch (e) {
      console.error("Error updating user_metadata:", e);
    }

    // Try to save to integrations table if it exists
    try {
      await supabase.from("integrations").insert({
        user_id: user.id,
        provider: "meta",
        provider_account_id: user.id,
        connected_account: metaConnection,
        status: "active",
        created_at: new Date().toISOString(),
      });
    } catch (e) {
      console.log("Integrations table not found, using user_metadata only");
    }

    // Redirect back to integrations tab with success
    return NextResponse.redirect(
      new URL("/dashboard?tab=integrations&connected=success", request.url)
    );
  } catch (error: any) {
    console.error("Error processing OAuth callback:", error);
    return NextResponse.redirect(
      new URL("/dashboard?tab=integrations&error=callback_failed", request.url)
    );
  }
}
