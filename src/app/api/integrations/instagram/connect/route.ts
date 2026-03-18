import { NextRequest, NextResponse } from "next/server";

const INSTAGRAM_APP_ID = process.env.INSTAGRAM_APP_ID!;
const APP_URL = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";

const SCOPES = [
  "instagram_business_basic",
  "instagram_business_content_publish",
].join(",");

/**
 * GET /api/integrations/instagram/connect
 *
 * Redirects the user to Instagram's OAuth authorization page.
 * Uses Business Login for Instagram (Instagram API with Instagram Login).
 */
export async function GET(_request: NextRequest) {
  if (!INSTAGRAM_APP_ID) {
    return NextResponse.json(
      { error: "Instagram App ID not configured" },
      { status: 500 }
    );
  }

  const redirectUri = `${APP_URL}/api/integrations/instagram/callback`;

  const params = new URLSearchParams({
    client_id: INSTAGRAM_APP_ID,
    redirect_uri: redirectUri,
    response_type: "code",
    scope: SCOPES,
  });

  const authUrl = `https://www.instagram.com/oauth/authorize?${params.toString()}`;

  return NextResponse.redirect(authUrl);
}
