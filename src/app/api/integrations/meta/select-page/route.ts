// ─────────────────────────────────────────────────────────────────────────────
// OLD: Meta / Facebook select-page — no longer needed with Instagram Login
// ─────────────────────────────────────────────────────────────────────────────
// import { NextRequest, NextResponse } from "next/server";
// import { createClient } from "@supabase/supabase-js";

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

/**
 * POST /api/integrations/meta/select-page
 * 
 * Updates the selected Facebook Page for the user's Meta connection.
 */
export async function POST(request: NextRequest) {
  try {
    const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
    const { data: { session }, error: sessionError } = await supabase.auth.getSession();

    if (sessionError || !session) {
      return NextResponse.json(
        { error: "Not authenticated" },
        { status: 401 }
      );
    }

    const user = session.user;
    const body = await request.json();
    const { page_id, page_name, access_token, instagram_id, instagram_name } = body;

    if (!page_id || !page_name) {
      return NextResponse.json(
        { error: "Page ID and name are required" },
        { status: 400 }
      );
    }

    // Get current meta connection
    const metaConnection = user.user_metadata?.meta_connection || {};

    // Update with selected page
    const updatedConnection = {
      ...metaConnection,
      selected_page_id: page_id,
      selected_page_name: page_name,
      selected_page_access_token: access_token,
      instagram_connected: !!instagram_id,
      instagram_id,
      instagram_name,
    };

    // Update user_metadata
    const adminSupabase = SUPABASE_SERVICE_ROLE_KEY 
      ? createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY)
      : supabase;
    
    try {
      await adminSupabase.auth.admin.updateUserById(
        user.id,
        {
          user_metadata: {
            ...user.user_metadata,
            meta_connection: updatedConnection,
          },
        }
      );
    } catch (e) {
      console.error("Error updating user_metadata:", e);
      return NextResponse.json(
        { error: "Failed to update page selection" },
        { status: 500 }
      );
    }

    // Update integrations table if it exists
    try {
      await supabase.from("integrations").upsert({
        user_id: user.id,
        provider: "meta",
        provider_account_id: user.id,
        connected_account: updatedConnection,
        status: "active",
        updated_at: new Date().toISOString(),
      });
    } catch (e) {
      console.log("Integrations table not found");
    }

    return NextResponse.json({
      success: true,
      page_id,
      page_name,
      instagram_connected: !!instagram_id,
    });
  } catch (error: any) {
    console.error("Error selecting page:", error);
    return NextResponse.json(
      { error: error.message || "Failed to update page selection" },
      { status: 500 }
    );
  }
}
