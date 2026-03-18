import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
const IG_GRAPH_BASE = "https://graph.instagram.com";
const API_VERSION = "v21.0";

type MediaType = "IMAGE" | "VIDEO" | "REELS" | "STORIES" | "CAROUSEL";

/**
 * POST /api/integrations/instagram/publish
 *
 * Immediately publishes content to Instagram.
 *
 * Body:
 *   media_type: IMAGE | VIDEO | REELS | STORIES | CAROUSEL
 *   media_url:  publicly accessible URL (required for single posts)
 *   carousel_urls: string[] (required for CAROUSEL, max 10)
 *   caption:    string (not supported for STORIES)
 *
 * Flow: Create container → poll until FINISHED → media_publish
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

    const { media_type, media_url, carousel_urls, caption } =
      (await request.json()) as {
        media_type: MediaType;
        media_url?: string;
        carousel_urls?: string[];
        caption?: string;
      };

    if (!media_type) {
      return NextResponse.json({ error: "media_type is required" }, { status: 400 });
    }

    const { ig_user_id, access_token } = igConnection;
    const base = `${IG_GRAPH_BASE}/${API_VERSION}/${ig_user_id}`;

    let containerId: string;

    if (media_type === "CAROUSEL") {
      if (!carousel_urls?.length) {
        return NextResponse.json({ error: "carousel_urls required for CAROUSEL" }, { status: 400 });
      }
      containerId = await createCarouselContainer(
        base, access_token, carousel_urls, caption
      );
    } else {
      if (!media_url) {
        return NextResponse.json({ error: "media_url is required" }, { status: 400 });
      }
      containerId = await createSingleContainer(
        base, access_token, media_type, media_url, caption
      );
    }

    // Poll container status until FINISHED (max 30 attempts × 2 s = 60 s)
    await pollContainerStatus(containerId, access_token);

    // Publish
    const publishRes = await fetch(`${base}/media_publish`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ creation_id: containerId, access_token }),
    });
    const publishData = await publishRes.json();

    if (!publishRes.ok || publishData.error) {
      throw new Error(publishData.error?.message || "Publish failed");
    }

    const igPostId = publishData.id as string;

    // Store record
    try {
      await supabase.from("published_posts").insert({
        user_id: session.user.id,
        platform: "instagram",
        platform_post_id: igPostId,
        post_url: `https://www.instagram.com/p/${igPostId}/`,
        content: caption,
        media_url: media_url || carousel_urls?.[0],
        status: "published",
        published_at: new Date().toISOString(),
      });
    } catch {}

    return NextResponse.json({
      success: true,
      id: igPostId,
      post_url: `https://www.instagram.com/p/${igPostId}/`,
    });
  } catch (err: any) {
    console.error("Instagram publish error:", err);
    return NextResponse.json(
      { error: err.message || "Publish failed" },
      { status: 500 }
    );
  }
}

// ── Helpers ──────────────────────────────────────────────────────────────────

async function createSingleContainer(
  base: string,
  accessToken: string,
  mediaType: MediaType,
  mediaUrl: string,
  caption?: string
): Promise<string> {
  const body: Record<string, string> = {
    access_token: accessToken,
    media_type: mediaType,
  };

  if (mediaType === "IMAGE") {
    body.image_url = mediaUrl;
  } else {
    // VIDEO, REELS, STORIES (video)
    body.video_url = mediaUrl;
  }

  if (caption && mediaType !== "STORIES") {
    body.caption = caption;
  }

  const res = await fetch(`${base}/media`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  const data = await res.json();

  if (!res.ok || data.error) {
    throw new Error(data.error?.message || "Container creation failed");
  }
  return data.id as string;
}

async function createCarouselContainer(
  base: string,
  accessToken: string,
  mediaUrls: string[],
  caption?: string
): Promise<string> {
  // Step 1: Create a container for each carousel item
  const itemIds: string[] = [];

  for (const url of mediaUrls.slice(0, 10)) {
    const isVideo = /\.(mp4|mov|avi)$/i.test(url);
    const body: Record<string, string> = {
      access_token: accessToken,
      is_carousel_item: "true",
    };
    if (isVideo) {
      body.media_type = "VIDEO";
      body.video_url = url;
    } else {
      body.image_url = url;
    }

    const res = await fetch(`${base}/media`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
    const data = await res.json();
    if (!res.ok || data.error) {
      throw new Error(data.error?.message || "Carousel item creation failed");
    }
    itemIds.push(data.id as string);
  }

  // Step 2: Create the carousel container
  const carouselBody: Record<string, string> = {
    access_token: accessToken,
    media_type: "CAROUSEL",
    children: itemIds.join(","),
  };
  if (caption) carouselBody.caption = caption;

  const res = await fetch(`${base}/media`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(carouselBody),
  });
  const data = await res.json();

  if (!res.ok || data.error) {
    throw new Error(data.error?.message || "Carousel container creation failed");
  }
  return data.id as string;
}

async function pollContainerStatus(
  containerId: string,
  accessToken: string,
  maxAttempts = 30
): Promise<void> {
  const base = `${IG_GRAPH_BASE}/${containerId}`;

  for (let i = 0; i < maxAttempts; i++) {
    const res = await fetch(
      `${base}?fields=status_code,status&access_token=${accessToken}`
    );
    const data = await res.json();
    const statusCode = data.status_code as string;

    if (statusCode === "FINISHED") return;
    if (statusCode === "ERROR" || statusCode === "EXPIRED") {
      throw new Error(`Container status: ${statusCode} — ${data.status || ""}`);
    }

    // IN_PROGRESS: wait 2 s and retry
    await new Promise((r) => setTimeout(r, 2000));
  }

  throw new Error("Container did not become FINISHED within timeout");
}
