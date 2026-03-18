import { NextResponse } from "next/server";

const INSTAGRAM_APP_ID = process.env.INSTAGRAM_APP_ID!;
const APP_URL = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";

const SCOPES = [
  "instagram_business_basic",
  "instagram_business_content_publish",
].join(",");

export async function GET() {
  const redirectUri = `${APP_URL}/api/integrations/instagram/callback`;

  const params = new URLSearchParams({
    client_id: INSTAGRAM_APP_ID,
    redirect_uri: redirectUri,
    response_type: "code",
    scope: SCOPES,
  });

  const authUrl = `https://www.instagram.com/oauth/authorize?${params.toString()}`;

  return NextResponse.json({
    INSTAGRAM_APP_ID,
    APP_URL,
    redirectUri,
    authUrl,
  });
}
