"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Box, Button, Flex, SimpleGrid, Text, VStack, Link, Badge, Heading } from "@chakra-ui/react";
import { useAuth } from "@/store/AuthProvider";
import { toaster } from "@/components/ui/toaster";
import NextLink from "next/link";
import PageSelectorModal from "./PageSelectorModal";
import { supabase } from "@/lib/supabase";

// ─── Inline SVG logos ────────────────────────────────────────────────────────

function MetaLogo() {
  return (
    <Flex
      w="48px"
      h="48px"
      borderRadius="14px"
      bg="#1877F2"
      align="center"
      justify="center"
      flexShrink={0}
    >
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path
          d="M9.198 21.5h5.604c.278 0 .51-.197.554-.471L17 9H7l1.644 12.029a.562.562 0 0 0 .554.471Z"
          fill="white"
          opacity="0"
        />
        <text x="7" y="18" fontFamily="Arial, sans-serif" fontSize="16" fontWeight="900" fill="white">f</text>
      </svg>
    </Flex>
  );
}

function InstagramLogo() {
  return (
    <Flex
      w="48px"
      h="48px"
      borderRadius="14px"
      align="center"
      justify="center"
      flexShrink={0}
      style={{
        background: "linear-gradient(135deg, #f09433 0%, #e6683c 25%, #dc2743 50%, #cc2366 75%, #bc1888 100%)",
      }}
    >
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect x="2" y="2" width="20" height="20" rx="6" stroke="white" strokeWidth="2" fill="none" />
        <circle cx="12" cy="12" r="4.5" stroke="white" strokeWidth="2" fill="none" />
        <circle cx="17.5" cy="6.5" r="1" fill="white" />
      </svg>
    </Flex>
  );
}

function PlatformPlaceholderLogo({ label, color }: { label: string; color: string }) {
  return (
    <Flex
      w="36px"
      h="36px"
      borderRadius="10px"
      bg={color}
      align="center"
      justify="center"
      flexShrink={0}
    >
      <Text fontSize="11px" fontWeight="800" color="white">
        {label}
      </Text>
    </Flex>
  );
}

// ─── Types ────────────────────────────────────────────────────────────────────

interface MetaConnection {
  connected: boolean;
  pageName?: string;
  pageId?: string;
  pageAccessToken?: string;
  instagramConnected?: boolean;
  instagramName?: string;
  pages?: Array<{
    id: string;
    name: string;
    access_token: string;
    instagram_id?: string;
    instagram_name?: string;
  }>;
  hasValidToken?: boolean;
}

// ─── Main component ───────────────────────────────────────────────────────────

export default function IntegrationsTab() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { signInWithFacebook, user } = useAuth();
  const [isConnecting, setIsConnecting] = useState(false);
  const [isDisconnecting, setIsDisconnecting] = useState(false);
  const [metaConnection, setMetaConnection] = useState<MetaConnection>({ connected: false });
  const [isLoading, setIsLoading] = useState(true);
  const [showPageSelector, setShowPageSelector] = useState(false);
  const [pendingPages, setPendingPages] = useState<Array<{
    id: string;
    name: string;
    access_token: string;
    instagram_id?: string;
    instagram_name?: string;
  }>>([]);

  // Check for OAuth callback
  useEffect(() => {
    const code = searchParams.get("code");
    const state = searchParams.get("state");
    const pagesAvailable = searchParams.get("pages_available");
    const connected = searchParams.get("connected");

    console.log("IntegrationsTab: Checking for OAuth params", {
      hasCode: !!code,
      state,
      pagesAvailable,
      connected,
    });

    // Force refresh session if OAuth callback detected
    if (connected === "success") {
      console.log("IntegrationsTab: OAuth success detected, forcing session refresh...");
      // Force a fresh session fetch to get updated metadata
      supabase.auth.getSession().then(({ data: { session } }) => {
        console.log("IntegrationsTab: Refreshed session metadata:", session?.user?.user_metadata);
        // Now check connection status with fresh session
        checkConnectionStatus();
      });
      // Clean URL
      window.history.replaceState({}, document.title, "/dashboard?tab=integrations");
      toaster.create({
        title: "Facebook Connected",
        description: "Your Facebook account has been successfully connected.",
        type: "success",
        duration: 5000,
      });

      // Show page selector if pages are available
      if (pagesAvailable === "true") {
        setTimeout(() => {
          checkConnectionStatus().then((data) => {
            console.log("IntegrationsTab: Pages available, showing selector", data);
            setShowPageSelector(true);
          });
        }, 500);
      }
    } else if (code || state?.includes("facebook")) {
      console.log("IntegrationsTab: OAuth detected, checking connection status");
      // OAuth callback - check connection status
      checkConnectionStatus();
      // Clean URL
      window.history.replaceState({}, document.title, "/dashboard?tab=integrations");
      toaster.create({
        title: "Facebook Connected",
        description: "Your Facebook account has been successfully connected.",
        type: "success",
        duration: 5000,
      });

      // Show page selector if pages are available
      if (pagesAvailable === "true") {
        setTimeout(() => {
          checkConnectionStatus().then((data) => {
            console.log("IntegrationsTab: Pages available, showing selector", data);
            setShowPageSelector(true);
          });
        }, 500);
      }
    } else {
      console.log("IntegrationsTab: No OAuth detected, checking connection status");
      checkConnectionStatus();
    }
  }, [searchParams]);

  const checkConnectionStatus = async () => {
    console.log("IntegrationsTab: Checking connection status...");
    try {
      // First, check from current session (client-side, always up-to-date)
      const { data: { session } } = await supabase.auth.getSession();
      const metaConnection = session?.user?.user_metadata?.meta_connection;
      
      console.log("IntegrationsTab: Session meta_connection:", metaConnection);

      if (metaConnection && metaConnection.connected_at) {
        console.log("IntegrationsTab: Found connection in session, using it");
        const data = {
          connected: true,
          facebook_user_id: metaConnection.facebook_user_id,
          facebook_name: metaConnection.facebook_name,
          pageName: metaConnection.pages?.[0]?.name,
          pageId: metaConnection.selected_page_id,
          pages: metaConnection.pages || [],
          instagramConnected: metaConnection.instagram_connected,
          instagramName: metaConnection.instagram_pages?.[0]?.instagram_name,
          hasValidToken: !!metaConnection.access_token,
        };
        setMetaConnection(data);
        if (data.pages && data.pages.length > 0) {
          setPendingPages(data.pages);
        }
        return data;
      }

      // Fallback to backend API if not in session
      console.log("IntegrationsTab: No connection in session, trying backend API...");
      const response = await fetch("/api/integrations/meta/status");
      const data = await response.json();
      console.log("IntegrationsTab: Backend status response:", data);
      setMetaConnection(data);

      // Store pages for selector if available
      if (data.pages && data.pages.length > 0) {
        setPendingPages(data.pages);
      }

      return data;
    } catch (error) {
      console.error("IntegrationsTab: Error checking connection status:", error);
      setMetaConnection({ connected: false });
      return { connected: false };
    } finally {
      setIsLoading(false);
    }
  };

  const handleRefreshStatus = async () => {
    console.log("IntegrationsTab: Manual refresh triggered");
    setIsLoading(true);
    await checkConnectionStatus();
    toaster.create({
      title: "Status Refreshed",
      description: "Connection status has been updated.",
      type: "success",
      duration: 3000,
    });
  };

  const handleConnectFacebook = async () => {
    if (!user) {
      toaster.create({
        title: "Authentication Required",
        description: "Please sign in to connect Facebook.",
        type: "warning",
        duration: 5000,
      });
      return;
    }

    setIsConnecting(true);
    try {
      await signInWithFacebook();
      // User will be redirected to Facebook
      // After redirect back, useEffect will handle the callback
    } catch (error: any) {
      toaster.create({
        title: "Connection Failed",
        description: error.message || "Failed to initiate Facebook connection.",
        type: "error",
        duration: 5000,
      });
    } finally {
      setIsConnecting(false);
    }
  };

  const handleDisconnect = async () => {
    if (!confirm("Are you sure you want to disconnect Facebook? This will remove access to your Facebook Pages and Instagram account.")) {
      return;
    }

    setIsDisconnecting(true);
    try {
      const response = await fetch("/api/integrations/meta/disconnect", {
        method: "POST",
      });

      if (!response.ok) {
        throw new Error("Failed to disconnect");
      }

      setMetaConnection({ connected: false });
      toaster.create({
        title: "Disconnected",
        description: "Facebook has been disconnected from your account.",
        type: "success",
        duration: 5000,
      });
    } catch (error: any) {
      toaster.create({
        title: "Disconnect Failed",
        description: error.message || "Failed to disconnect Facebook.",
        type: "error",
        duration: 5000,
      });
    } finally {
      setIsDisconnecting(false);
    }
  };

  const handleSelectPage = async (page: {
    id: string;
    name: string;
    access_token: string;
    instagram_id?: string;
    instagram_name?: string;
  }) => {
    try {
      const response = await fetch("/api/integrations/meta/select-page", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(page),
      });

      if (!response.ok) {
        throw new Error("Failed to select page");
      }

      const data = await response.json();
      
      // Update local state
      setMetaConnection({
        ...metaConnection,
        pageName: page.name,
        pageId: page.id,
        pageAccessToken: page.access_token,
        instagramConnected: !!page.instagram_id,
        instagramName: page.instagram_name,
      });

      setShowPageSelector(false);

      toaster.create({
        title: "Page Connected",
        description: `${page.name} has been connected successfully.`,
        type: "success",
        duration: 5000,
      });

      if (page.instagram_name) {
        toaster.create({
          title: "Instagram Connected",
          description: `Instagram account ${page.instagram_name} is also connected.`,
          type: "info",
          duration: 5000,
        });
      }
    } catch (error: any) {
      toaster.create({
        title: "Selection Failed",
        description: error.message || "Failed to select page.",
        type: "error",
        duration: 5000,
      });
    }
  };

  const COMING_SOON = [
    { key: "tiktok", name: "TikTok", abbr: "TT", color: "#010101" },
    { key: "linkedin", name: "LinkedIn", abbr: "in", color: "#0A66C2" },
    { key: "twitter", name: "X / Twitter", abbr: "X", color: "#000000" },
  ];

  return (
    <VStack align="stretch" gap={8}>
      {/* Page heading */}
      <Box>
        <Flex justify="space-between" align="center" mb={2}>
          <Text fontSize={{ base: "3xl", md: "4xl" }} fontWeight="700" color="#111111" lineHeight="1.05">
            Integrations
          </Text>
          <Button
            variant="outline"
            size="sm"
            onClick={handleRefreshStatus}
            loading={isLoading}
          >
            Refresh Status
          </Button>
        </Flex>
        <Text fontSize="15px" color="#6B7280">
          Connect your social platforms to publish content directly from PostGini.
        </Text>
      </Box>

      {/* Info note */}
      <Box
        bg="#EFF6FF"
        border="1px solid"
        borderColor="#BFDBFE"
        borderRadius="16px"
        p={4}
      >
        <Flex gap={3} align="flex-start">
          <Box flexShrink={0}>
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
              <circle cx="10" cy="10" r="8" fill="#3B82F6" opacity="0.1"/>
              <path d="M10 6.5V10.5M10 13.5H10.01" stroke="#3B82F6" strokeWidth="1.5" strokeLinecap="round"/>
            </svg>
          </Box>
          <Box>
            <Text fontSize="13px" fontWeight="600" color="#1E40AF" mb={1}>
              Connecting via Personal Account
            </Text>
            <Text fontSize="12px" color="#1E40AF" lineHeight="1.5">
              When connecting Facebook, you'll authenticate with your personal Facebook account. 
              After authorization, you can select which Facebook Pages to connect. 
              For Instagram, you'll need an Instagram Business account linked to your Facebook Page.
              <Link
                href="/privacy"
                color="#1E40AF"
                textDecoration="underline"
                fontWeight="600"
                ml={1}
              >
                Learn more
              </Link>
            </Text>
          </Box>
        </Flex>
      </Box>

      {/* Connected Platforms section */}
      <Box>
        <Text fontSize="13px" fontWeight="800" color="#6B7280" letterSpacing="0.06em" textTransform="uppercase" mb={4}>
          Connected Platforms
        </Text>

        <SimpleGrid columns={{ base: 1, md: 2 }} gap={5}>
          {/* Meta (Facebook) Card */}
          <Box
            bg="white"
            border="1px solid"
            borderColor="#ECECEC"
            borderRadius="24px"
            p={6}
            boxShadow="0 12px 48px rgba(0,0,0,0.04)"
          >
            <Flex align="center" gap={4} mb={4}>
              <MetaLogo />
              <Box flex={1}>
                <Text fontSize="17px" fontWeight="700" color="#111111" lineHeight="1.2">
                  Meta (Facebook)
                </Text>
                {metaConnection.connected ? (
                  <Badge colorScheme="green" mt={1.5}>
                    Connected{metaConnection.pageName && ` - ${metaConnection.pageName}`}
                  </Badge>
                ) : (
                  <Box
                    display="inline-block"
                    mt={1.5}
                    px={2.5}
                    py={0.5}
                    bg="#F3F4F6"
                    borderRadius="999px"
                    border="1px solid"
                    borderColor="#E5E7EB"
                  >
                    <Text fontSize="11px" fontWeight="600" color="#6B7280">
                      Not Connected
                    </Text>
                  </Box>
                )}
              </Box>
            </Flex>

            <Text fontSize="14px" color="#6B7280" lineHeight="1.55" mb={5}>
              Connect your Facebook Page to publish and track posts.
            </Text>

            {metaConnection.connected ? (
              <VStack gap={3} align="stretch">
                {metaConnection.pageName && (
                  <Box bg="#F0FDF4" p={3} borderRadius="lg" border="1px solid" borderColor="#86EFAC">
                    <Text fontSize="13px" color="#166534" fontWeight="600">
                      ✓ Connected Page: {metaConnection.pageName}
                    </Text>
                    {metaConnection.instagramName && (
                      <Text fontSize="12px" color="#166534" mt={1}>
                        📷 Instagram: {metaConnection.instagramName}
                      </Text>
                    )}
                  </Box>
                )}
                <Flex gap={2}>
                  <Button
                    flex={1}
                    variant="outline"
                    borderColor="#D1D5DB"
                    color="#4F46E5"
                    bg="white"
                    borderRadius="12px"
                    h="42px"
                    fontSize="14px"
                    fontWeight="600"
                    _hover={{ bg: "#F5F5FF", borderColor: "#C7D2FE" }}
                    onClick={() => {
                      if (pendingPages.length > 0) {
                        setShowPageSelector(true);
                      } else {
                        // Re-fetch pages
                        checkConnectionStatus().then(() => setShowPageSelector(true));
                      }
                    }}
                  >
                    Change Page
                  </Button>
                  <Button
                    flex={1}
                    variant="outline"
                    borderColor="#FECACA"
                    color="#DC2626"
                    bg="white"
                    borderRadius="12px"
                    h="42px"
                    fontSize="14px"
                    fontWeight="600"
                    _hover={{ bg: "#FEF2F2", borderColor: "#FCA5A5" }}
                    onClick={handleDisconnect}
                    loading={isDisconnecting}
                  >
                    Disconnect
                  </Button>
                </Flex>
              </VStack>
            ) : (
              <Button
                w="full"
                bg="#1877F2"
                color="white"
                borderRadius="14px"
                h="44px"
                fontSize="14px"
                fontWeight="600"
                _hover={{ bg: "#166FE5" }}
                loading={isConnecting}
                onClick={handleConnectFacebook}
              >
                {isConnecting ? "Connecting..." : "Connect with Facebook"}
              </Button>
            )}
          </Box>

          {/* Instagram Card */}
          <Box
            bg="white"
            border="1px solid"
            borderColor={metaConnection.connected ? "#ECECEC" : "#F3F4F6"}
            borderRadius="24px"
            p={6}
            boxShadow="0 12px 48px rgba(0,0,0,0.04)"
            opacity={metaConnection.connected ? 1 : 0.6}
          >
            <Flex align="center" gap={4} mb={4}>
              <InstagramLogo />
              <Box>
                <Text fontSize="17px" fontWeight="700" color="#111111" lineHeight="1.2">
                  Instagram
                </Text>
                {metaConnection.instagramConnected ? (
                  <Badge colorScheme="green" mt={1.5}>
                    Connected{metaConnection.instagramName && ` - ${metaConnection.instagramName}`}
                  </Badge>
                ) : metaConnection.connected ? (
                  <Box
                    display="inline-block"
                    mt={1.5}
                    px={2.5}
                    py={0.5}
                    bg="#FEF3C7"
                    borderRadius="999px"
                    border="1px solid"
                    borderColor="#FDE68A"
                  >
                    <Text fontSize="11px" fontWeight="600" color="#92400E">
                      Connect Facebook First
                    </Text>
                  </Box>
                ) : (
                  <Box
                    display="inline-block"
                    mt={1.5}
                    px={2.5}
                    py={0.5}
                    bg="#F3F4F6"
                    borderRadius="999px"
                    border="1px solid"
                    borderColor="#E5E7EB"
                  >
                    <Text fontSize="11px" fontWeight="600" color="#6B7280">
                      Requires Facebook
                    </Text>
                  </Box>
                )}
              </Box>
            </Flex>

            <Text fontSize="14px" color="#6B7280" lineHeight="1.55" mb={5}>
              Link Instagram Business to auto-publish Reels and Carousels. Requires Facebook connection.
            </Text>

            <Button
              w="full"
              bg="#E5E7EB"
              color="#6B7280"
              borderRadius="14px"
              h="44px"
              fontSize="14px"
              fontWeight="600"
              cursor={metaConnection.connected ? "pointer" : "not-allowed"}
              disabled={!metaConnection.connected}
              onClick={() => {
                if (metaConnection.connected) {
                  toaster.create({
                    title: "Instagram Connection",
                    description: "Instagram is automatically connected when you link it to your Facebook Page. Make sure your Instagram Business account is linked in Facebook Page settings.",
                    type: "info",
                    duration: 8000,
                  });
                }
              }}
            >
              {metaConnection.connected ? "Configure Instagram" : "Connect Facebook First"}
            </Button>
          </Box>
        </SimpleGrid>
      </Box>

      {/* Coming Soon section */}
      <Box>
        <Text fontSize="13px" fontWeight="800" color="#6B7280" letterSpacing="0.06em" textTransform="uppercase" mb={4}>
          Coming Soon
        </Text>

        <Flex gap={4} wrap="wrap">
          {COMING_SOON.map(({ key, name, abbr, color }) => (
            <Flex
              key={key}
              align="center"
              gap={3}
              bg="white"
              border="1px solid"
              borderColor="#ECECEC"
              borderRadius="16px"
              px={4}
              py={3}
              boxShadow="0 4px 16px rgba(0,0,0,0.03)"
              opacity={0.7}
            >
              <PlatformPlaceholderLogo label={abbr} color={color} />
              <Box>
                <Text fontSize="14px" fontWeight="600" color="#111111">
                  {name}
                </Text>
                <Box
                  display="inline-block"
                  mt={0.5}
                  px={2}
                  py={0.5}
                  bg="#FEF3C7"
                  borderRadius="999px"
                  border="1px solid"
                  borderColor="#FDE68A"
                >
                  <Text fontSize="10px" fontWeight="700" color="#92400E">
                    Coming soon
                  </Text>
                </Box>
              </Box>
            </Flex>
          ))}
        </Flex>
      </Box>

      {/* Page Selector Modal */}
      <PageSelectorModal
        open={showPageSelector}
        onClose={() => setShowPageSelector(false)}
        pages={pendingPages}
        onSelectPage={handleSelectPage}
      />
    </VStack>
  );
}
