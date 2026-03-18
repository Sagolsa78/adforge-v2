// ─────────────────────────────────────────────────────────────────────────────
// OLD: Meta / Facebook disconnect — replaced by /api/integrations/instagram/disconnect
// ─────────────────────────────────────────────────────────────────────────────
// import { NextRequest, NextResponse } from "next/server";
// import { createClient } from "@supabase/supabase-js";

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

/**
 * POST /api/integrations/meta/disconnect
 * 
 * Disconnects Meta (Facebook/Instagram) integration for the current user.
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

    // Remove meta_connection from user_metadata
    const adminSupabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY || SUPABASE_ANON_KEY);
    
    try {
      // Update user_metadata to remove meta connection
      const { error: updateError } = await adminSupabase.auth.admin.updateUserById(
        user.id,
        {
          user_metadata: {
            ...user.user_metadata,
            meta_connection: null,
          },
        }
      );

      if (updateError) {
        console.error("Error updating user metadata:", updateError);
      }
    } catch (e) {
      console.log("Could not update user_metadata, continuing...");
    }

    // Try to delete from integrations table if it exists
    try {
      await supabase
        .from("integrations")
        .delete()
        .eq("user_id", user.id)
        .eq("provider", "meta");
    } catch (e) {
      // Table might not exist, that's ok
    }

    return NextResponse.json({
      success: true,
      message: "Meta integration disconnected successfully",
    });
  } catch (error: any) {
    console.error("Error disconnecting Meta integration:", error);
    return NextResponse.json(
      { error: error.message || "Failed to disconnect Meta integration" },
      { status: 500 }
    );
  }
}
