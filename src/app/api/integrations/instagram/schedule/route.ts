import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

/**
 * POST /api/integrations/instagram/schedule
 *
 * Stores a post for scheduled publishing. The backend APScheduler
 * will pick it up and call the Instagram API at the scheduled time.
 *
 * Body:
 *   media_type:    IMAGE | VIDEO | REELS | STORIES | CAROUSEL
 *   media_url:     string (single post)
 *   carousel_urls: string[] (carousel only)
 *   caption:       string
 *   scheduled_at:  ISO 8601 datetime string (must be in the future)
 */
export async function POST(request: NextRequest) {
  try {
    const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
    const { data: { session }, error } = await supabase.auth.getSession();

    if (error || !session) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }

    const igConnection = session.user.user_metadata?.ig_connection;
    if (!igConnection?.access_token) {
      return NextResponse.json({ error: "Instagram not connected" }, { status: 400 });
    }

    const { media_type, media_url, carousel_urls, caption, scheduled_at } =
      await request.json();

    if (!media_type || !scheduled_at) {
      return NextResponse.json(
        { error: "media_type and scheduled_at are required" },
        { status: 400 }
      );
    }

    const scheduledDate = new Date(scheduled_at);
    if (scheduledDate <= new Date()) {
      return NextResponse.json(
        { error: "scheduled_at must be in the future" },
        { status: 400 }
      );
    }

    if (media_type === "CAROUSEL" && !carousel_urls?.length) {
      return NextResponse.json(
        { error: "carousel_urls required for CAROUSEL" },
        { status: 400 }
      );
    }

    if (media_type !== "CAROUSEL" && !media_url) {
      return NextResponse.json(
        { error: "media_url is required" },
        { status: 400 }
      );
    }

    const { data, error: insertError } = await supabase
      .from("scheduled_instagram_posts")
      .insert({
        user_id: session.user.id,
        ig_user_id: igConnection.ig_user_id,
        access_token: igConnection.access_token,
        media_type,
        media_url: media_url || null,
        carousel_urls: carousel_urls || null,
        caption: caption || null,
        scheduled_at: scheduledDate.toISOString(),
        status: "scheduled",
      })
      .select()
      .single();

    if (insertError) {
      console.error("Schedule insert error:", insertError);
      throw new Error(insertError.message);
    }

    return NextResponse.json({ success: true, id: data.id, scheduled_at: data.scheduled_at });
  } catch (err: any) {
    console.error("Instagram schedule error:", err);
    return NextResponse.json(
      { error: err.message || "Schedule failed" },
      { status: 500 }
    );
  }
}

/**
 * GET /api/integrations/instagram/schedule
 * Returns all scheduled posts for the current user.
 */
export async function GET(_request: NextRequest) {
  try {
    const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
    const { data: { session }, error } = await supabase.auth.getSession();

    if (error || !session) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }

    const { data, error: fetchError } = await supabase
      .from("scheduled_instagram_posts")
      .select(
        "id, media_type, media_url, carousel_urls, caption, scheduled_at, status, ig_post_id, error_message, created_at"
      )
      .eq("user_id", session.user.id)
      .order("scheduled_at", { ascending: true });

    if (fetchError) throw new Error(fetchError.message);

    return NextResponse.json({ posts: data || [] });
  } catch (err: any) {
    console.error("Instagram scheduled list error:", err);
    return NextResponse.json({ error: err.message || "Fetch failed" }, { status: 500 });
  }
}

/**
 * DELETE /api/integrations/instagram/schedule?id=<uuid>
 * Cancels a scheduled post (only if still in 'scheduled' status).
 */
export async function DELETE(request: NextRequest) {
  try {
    const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
    const { data: { session }, error } = await supabase.auth.getSession();

    if (error || !session) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }

    const id = request.nextUrl.searchParams.get("id");
    if (!id) {
      return NextResponse.json({ error: "id is required" }, { status: 400 });
    }

    const { error: deleteError } = await supabase
      .from("scheduled_instagram_posts")
      .delete()
      .eq("id", id)
      .eq("user_id", session.user.id)
      .eq("status", "scheduled"); // Prevent cancelling already-published posts

    if (deleteError) throw new Error(deleteError.message);

    return NextResponse.json({ success: true });
  } catch (err: any) {
    console.error("Instagram cancel schedule error:", err);
    return NextResponse.json({ error: err.message || "Cancel failed" }, { status: 500 });
  }
}
