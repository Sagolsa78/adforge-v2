import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "https://content.bhuexpert/api/v1/data";
const META_GRAPH_API_VERSION = "v18.0";

/**
 * GET /api/integrations/meta/status
 * 
 * Returns the Meta (Facebook/Instagram) connection status for the current user.
 * First tries backend API, falls back to Supabase.
 */
export async function GET(request: NextRequest) {
  try {
    const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
    const { data: { session }, error: sessionError } = await supabase.auth.getSession();

    if (sessionError || !session) {
      console.log("No session found");
      return NextResponse.json({ connected: false });
    }

    const user = session.user;
    console.log("Checking Meta connection for user:", user.id);

    // Try backend API first
    try {
      const backendResponse = await fetch(`${API_BASE_URL}/integrations/meta/status`, {
        headers: {
          "Authorization": `Bearer ${session.access_token}`,
        },
      });
      
      if (backendResponse.ok) {
        const backendData = await backendResponse.json();
        console.log("Backend status response:", backendData);
        return NextResponse.json(backendData);
      }
    } catch (backendError) {
      console.log("Backend API not available, using Supabase:", backendError);
    }

    // Fallback to Supabase user_metadata
    const metaConnection = user.user_metadata?.meta_connection;
    console.log("Meta connection in metadata:", !!metaConnection);
    
    if (metaConnection && metaConnection.connected_at) {
      console.log("Found Meta connection:", {
        hasToken: !!metaConnection.access_token,
        pagesCount: metaConnection.pages?.length || 0,
        selectedPageId: metaConnection.selected_page_id,
      });

      let pages = metaConnection.pages || [];
      
      if (metaConnection.access_token) {
        try {
          const pagesResponse = await fetch(
            `https://graph.facebook.com/${META_GRAPH_API_VERSION}/me/accounts?fields=id,name,access_token,instagram_business_account{id,name}&access_token=${metaConnection.access_token}`
          );
          const pagesData = await pagesResponse.json();
          
          if (pagesData.data) {
            pages = pagesData.data.map((page: any) => ({
              id: page.id,
              name: page.name,
              access_token: page.access_token,
              instagram_id: page.instagram_business_account?.id,
              instagram_name: page.instagram_business_account?.name,
            }));
            console.log("Refreshed pages from Graph API:", pages.length);
          }
        } catch (e) {
          console.log("Could not refresh pages from Graph API, using cached data");
        }
      }

      const selectedPage = pages.find((p: any) => p.id === metaConnection.selected_page_id) || pages[0];
      const instagramPage = pages.find((p: any) => p.instagram_id);

      const result = {
        connected: true,
        facebook_user_id: metaConnection.facebook_user_id,
        facebook_name: metaConnection.facebook_name,
        pageName: selectedPage?.name,
        pageId: selectedPage?.id,
        pageAccessToken: selectedPage?.access_token,
        pages: pages,
        instagramConnected: !!instagramPage,
        instagramId: instagramPage?.instagram_id,
        instagramName: instagramPage?.instagram_name,
        hasValidToken: !!metaConnection.access_token,
      };

      console.log("Returning connected status:", result);
      return NextResponse.json(result);
    }

    console.log("No Meta connection found");
    return NextResponse.json({ connected: false });
  } catch (error: any) {
    console.error("Error checking Meta connection status:", error);
    return NextResponse.json({ connected: false });
  }
}
