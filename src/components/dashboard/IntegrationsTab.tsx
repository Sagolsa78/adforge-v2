"use client";

import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { Box, Button, Flex, SimpleGrid, Text, VStack, Badge } from "@chakra-ui/react";
import { useAuth } from "@/store/AuthProvider";
import { toaster } from "@/components/ui/toaster";
import { supabase } from "@/lib/supabase";

// ─── Logos ────────────────────────────────────────────────────────────────────

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
        background:
          "linear-gradient(135deg, #f09433 0%, #e6683c 25%, #dc2743 50%, #cc2366 75%, #bc1888 100%)",
      }}
    >
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
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
      <Text fontSize="11px" fontWeight="800" color="white">{label}</Text>
    </Flex>
  );
}

// ─── Types ────────────────────────────────────────────────────────────────────

interface IgConnection {
  connected: boolean;
  username?: string;
  name?: string;
  ig_user_id?: string;
  profile_picture_url?: string;
  expires_at?: string;
  connected_at?: string;
}

// ─── Main component ───────────────────────────────────────────────────────────

export default function IntegrationsTab() {
  const searchParams = useSearchParams();
  const { user } = useAuth();

  const [igConnection, setIgConnection] = useState<IgConnection>({ connected: false });
  const [isLoading, setIsLoading] = useState(true);
  const [isDisconnecting, setIsDisconnecting] = useState(false);

  const COMING_SOON = [
    { key: "facebook", name: "Facebook", abbr: "f", color: "#1877F2" },
    { key: "tiktok",   name: "TikTok",   abbr: "TT", color: "#010101" },
    { key: "linkedin", name: "LinkedIn", abbr: "in", color: "#0A66C2" },
    { key: "twitter",  name: "X / Twitter", abbr: "X", color: "#000000" },
  ];

  // ── Effects ─────────────────────────────────────────────────────────────────

  useEffect(() => {
    const igConnected = searchParams.get("ig_connected");
    const igError = searchParams.get("ig_error");

    if (igConnected === "success") {
      window.history.replaceState({}, "", "/dashboard?tab=integrations");
      // Force refresh Supabase session so new user_metadata is visible
      supabase.auth.refreshSession().then(() => checkStatus());
      toaster.create({
        title: "Instagram Connected",
        description: "Your Instagram account has been connected successfully.",
        type: "success",
        duration: 5000,
      });
    } else if (igError) {
      window.history.replaceState({}, "", "/dashboard?tab=integrations");
      toaster.create({
        title: "Connection Failed",
        description: decodeURIComponent(igError),
        type: "error",
        duration: 6000,
      });
      setIsLoading(false);
    } else {
      checkStatus();
    }
  }, [searchParams]);

  // ── Helpers ──────────────────────────────────────────────────────────────────

  const checkStatus = async () => {
    setIsLoading(true);
    try {
      // Prefer fresh session metadata over API round-trip
      const { data: { session } } = await supabase.auth.getSession();
      const igConn = session?.user?.user_metadata?.ig_connection;

      if (igConn?.access_token) {
        setIgConnection({
          connected: true,
          ig_user_id: igConn.ig_user_id,
          username: igConn.username,
          name: igConn.name,
          profile_picture_url: igConn.profile_picture_url,
          expires_at: igConn.expires_at,
          connected_at: igConn.connected_at,
        });
        return;
      }

      // Fallback to API (also handles token refresh)
      const res = await fetch("/api/integrations/instagram/status");
      const data = await res.json();
      setIgConnection(data);
    } catch (err) {
      console.error("Status check error:", err);
      setIgConnection({ connected: false });
    } finally {
      setIsLoading(false);
    }
  };

  const handleConnect = () => {
    if (!user) {
      toaster.create({
        title: "Sign in required",
        description: "Please sign in before connecting Instagram.",
        type: "warning",
        duration: 4000,
      });
      return;
    }
    // Redirect to our server-side connect route which redirects to Instagram OAuth
    window.location.href = "/api/integrations/instagram/connect";
  };

  const handleDisconnect = async () => {
    if (!confirm("Disconnect Instagram? Scheduled posts will not be published.")) return;

    setIsDisconnecting(true);
    try {
      const res = await fetch("/api/integrations/instagram/disconnect", { method: "POST" });
      if (!res.ok) throw new Error("Disconnect failed");

      setIgConnection({ connected: false });
      toaster.create({
        title: "Disconnected",
        description: "Instagram has been disconnected.",
        type: "success",
        duration: 4000,
      });
    } catch (err: any) {
      toaster.create({
        title: "Error",
        description: err.message || "Could not disconnect.",
        type: "error",
        duration: 4000,
      });
    } finally {
      setIsDisconnecting(false);
    }
  };

  // Days until token expires
  const daysUntilExpiry = igConnection.expires_at
    ? Math.floor(
        (new Date(igConnection.expires_at).getTime() - Date.now()) / (1000 * 60 * 60 * 24)
      )
    : null;

  // ── Render ───────────────────────────────────────────────────────────────────

  return (
    <VStack align="stretch" gap={8}>
      {/* Header */}
      <Box>
        <Flex justify="space-between" align="center" mb={2}>
          <Text fontSize={{ base: "3xl", md: "4xl" }} fontWeight="700" color="#111111" lineHeight="1.05">
            Integrations
          </Text>
          <Button variant="outline" size="sm" onClick={checkStatus} loading={isLoading}>
            Refresh
          </Button>
        </Flex>
        <Text fontSize="15px" color="#6B7280">
          Connect your social platforms to publish content directly from PostGini.
        </Text>
      </Box>

      {/* Info banner */}
      <Box bg="#FFF7ED" border="1px solid" borderColor="#FED7AA" borderRadius="16px" p={4}>
        <Flex gap={3} align="flex-start">
          <Box flexShrink={0} mt="1px">
            <svg width="18" height="18" viewBox="0 0 20 20" fill="none">
              <circle cx="10" cy="10" r="8" fill="#F97316" opacity="0.15" />
              <path d="M10 6.5V10.5M10 13.5H10.01" stroke="#F97316" strokeWidth="1.5" strokeLinecap="round" />
            </svg>
          </Box>
          <Text fontSize="13px" color="#9A3412" lineHeight="1.55">
            Connect with <strong>Instagram Business Login</strong> — no Facebook account required.
            Your Instagram account must be a <strong>Business</strong> or <strong>Creator</strong> account.
          </Text>
        </Flex>
      </Box>

      {/* Connected Platforms */}
      <Box>
        <Text fontSize="13px" fontWeight="800" color="#6B7280" letterSpacing="0.06em" textTransform="uppercase" mb={4}>
          Connected Platforms
        </Text>

        <SimpleGrid columns={{ base: 1, md: 2 }} gap={5}>
          {/* Instagram Card */}
          <Box
            bg="white"
            border="1px solid"
            borderColor={igConnection.connected ? "#FBCFE8" : "#ECECEC"}
            borderRadius="24px"
            p={6}
            boxShadow="0 12px 48px rgba(0,0,0,0.04)"
          >
            <Flex align="center" gap={4} mb={4}>
              <InstagramLogo />
              <Box flex={1}>
                <Text fontSize="17px" fontWeight="700" color="#111111" lineHeight="1.2">
                  Instagram
                </Text>
                {igConnection.connected ? (
                  <Badge colorScheme="green" mt={1.5}>
                    @{igConnection.username}
                  </Badge>
                ) : (
                  <Box
                    display="inline-block" mt={1.5} px={2.5} py={0.5}
                    bg="#F3F4F6" borderRadius="999px" border="1px solid" borderColor="#E5E7EB"
                  >
                    <Text fontSize="11px" fontWeight="600" color="#6B7280">Not Connected</Text>
                  </Box>
                )}
              </Box>
            </Flex>

            <Text fontSize="14px" color="#6B7280" lineHeight="1.55" mb={5}>
              Publish Photos, Videos, Reels, Stories, and Carousels directly to your Instagram Business account.
            </Text>

            {igConnection.connected ? (
              <VStack gap={3} align="stretch">
                <Box bg="#F0FDF4" p={3} borderRadius="12px" border="1px solid" borderColor="#86EFAC">
                  <Text fontSize="13px" color="#166534" fontWeight="600">
                    ✓ @{igConnection.username}
                    {igConnection.name && ` · ${igConnection.name}`}
                  </Text>
                  {daysUntilExpiry !== null && (
                    <Text fontSize="11px" color={daysUntilExpiry < 10 ? "#DC2626" : "#166534"} mt={0.5}>
                      Token expires in {daysUntilExpiry} day{daysUntilExpiry !== 1 ? "s" : ""}
                      {daysUntilExpiry < 10 ? " — reconnect soon" : ""}
                    </Text>
                  )}
                </Box>

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
                    onClick={handleConnect}
                  >
                    Reconnect
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
                borderRadius="14px"
                h="44px"
                fontSize="14px"
                fontWeight="600"
                color="white"
                style={{
                  background:
                    "linear-gradient(135deg, #f09433 0%, #e6683c 25%, #dc2743 50%, #cc2366 75%, #bc1888 100%)",
                }}
                _hover={{ opacity: 0.9 }}
                loading={isLoading}
                onClick={handleConnect}
              >
                Connect with Instagram
              </Button>
            )}
          </Box>
        </SimpleGrid>
      </Box>

      {/* Coming Soon */}
      <Box>
        <Text fontSize="13px" fontWeight="800" color="#6B7280" letterSpacing="0.06em" textTransform="uppercase" mb={4}>
          Coming Soon
        </Text>
        <Flex gap={4} wrap="wrap">
          {COMING_SOON.map(({ key, name, abbr, color }) => (
            <Flex
              key={key}
              align="center" gap={3} bg="white"
              border="1px solid" borderColor="#ECECEC"
              borderRadius="16px" px={4} py={3}
              boxShadow="0 4px 16px rgba(0,0,0,0.03)" opacity={0.7}
            >
              <PlatformPlaceholderLogo label={abbr} color={color} />
              <Box>
                <Text fontSize="14px" fontWeight="600" color="#111111">{name}</Text>
                <Box
                  display="inline-block" mt={0.5} px={2} py={0.5}
                  bg="#FEF3C7" borderRadius="999px" border="1px solid" borderColor="#FDE68A"
                >
                  <Text fontSize="10px" fontWeight="700" color="#92400E">Coming soon</Text>
                </Box>
              </Box>
            </Flex>
          ))}
        </Flex>
      </Box>
    </VStack>
  );
}
