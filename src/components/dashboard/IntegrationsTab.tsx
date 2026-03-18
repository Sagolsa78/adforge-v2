"use client";

import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { Box, Button, Flex, SimpleGrid, Text, VStack, Badge, Textarea } from "@chakra-ui/react";
import { useAuth } from "@/store/AuthProvider";
import { toaster } from "@/components/ui/toaster";
import { supabase } from "@/lib/supabase";

// ─── Logos ────────────────────────────────────────────────────────────────────

function InstagramLogo() {
  return (
    <Flex
      w="48px" h="48px" borderRadius="14px"
      align="center" justify="center" flexShrink={0}
      style={{ background: "linear-gradient(135deg, #f09433 0%, #e6683c 25%, #dc2743 50%, #cc2366 75%, #bc1888 100%)" }}
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
    <Flex w="36px" h="36px" borderRadius="10px" bg={color} align="center" justify="center" flexShrink={0}>
      <Text fontSize="11px" fontWeight="800" color="white">{label}</Text>
    </Flex>
  );
}

// ─── Types ────────────────────────────────────────────────────────────────────

type MediaType = "IMAGE" | "VIDEO" | "REELS" | "STORIES" | "CAROUSEL";
type PostMode  = "now" | "schedule";

interface IgConnection {
  connected: boolean;
  username?: string;
  name?: string;
  ig_user_id?: string;
  profile_picture_url?: string;
  expires_at?: string;
  connected_at?: string;
}

interface ScheduledPost {
  id: string;
  media_type: MediaType;
  media_url?: string;
  carousel_urls?: string[];
  caption?: string;
  scheduled_at: string;
  status: "scheduled" | "published" | "failed";
  ig_post_id?: string;
  error_message?: string;
}

// ─── Main component ───────────────────────────────────────────────────────────

export default function IntegrationsTab() {
  const searchParams = useSearchParams();
  const { user } = useAuth();

  const [igConnection, setIgConnection] = useState<IgConnection>({ connected: false });
  const [isLoading,      setIsLoading]      = useState(true);
  const [isDisconnecting, setIsDisconnecting] = useState(false);

  // Post form state
  const [postMode,       setPostMode]       = useState<PostMode>("now");
  const [mediaType,      setMediaType]      = useState<MediaType>("IMAGE");
  const [mediaUrl,       setMediaUrl]       = useState("");
  const [carouselUrls,   setCarouselUrls]   = useState("");  // newline-separated
  const [caption,        setCaption]        = useState("");
  const [scheduledAt,    setScheduledAt]    = useState("");
  const [isPosting,      setIsPosting]      = useState(false);

  // Scheduled posts list
  const [scheduledPosts,     setScheduledPosts]     = useState<ScheduledPost[]>([]);
  const [loadingScheduled,   setLoadingScheduled]   = useState(false);
  const [cancellingId,       setCancellingId]       = useState<string | null>(null);

  const COMING_SOON = [
    { key: "facebook", name: "Facebook",   abbr: "f",  color: "#1877F2" },
    { key: "tiktok",   name: "TikTok",     abbr: "TT", color: "#010101" },
    { key: "linkedin", name: "LinkedIn",   abbr: "in", color: "#0A66C2" },
    { key: "twitter",  name: "X / Twitter", abbr: "X", color: "#000000" },
  ];

  // ── Effects ──────────────────────────────────────────────────────────────────

  useEffect(() => {
    const igConnected = searchParams.get("ig_connected");
    const igError     = searchParams.get("ig_error");

    if (igConnected === "success") {
      window.history.replaceState({}, "", "/dashboard?tab=integrations");
      supabase.auth.refreshSession().then(({ data: { user } }) => {
        const igConn = user?.user_metadata?.ig_connection;
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
          setIsLoading(false);
        } else {
          checkStatus();
        }
      }).catch(() => checkStatus());
      toaster.create({
        title: "Instagram Connected",
        description: "Your Instagram account has been connected successfully.",
        type: "success", duration: 5000,
      });
    } else if (igError) {
      window.history.replaceState({}, "", "/dashboard?tab=integrations");
      toaster.create({
        title: "Connection Failed",
        description: decodeURIComponent(igError),
        type: "error", duration: 6000,
      });
      setIsLoading(false);
    } else {
      checkStatus();
    }
  }, [searchParams]);

  useEffect(() => {
    if (igConnection.connected) fetchScheduledPosts();
  }, [igConnection.connected]);

  // ── Helpers ──────────────────────────────────────────────────────────────────

  const checkStatus = async () => {
    setIsLoading(true);
    try {
      // getUser() makes a live network request — always returns fresh metadata
      const { data: { user } } = await supabase.auth.getUser();
      const igConn = user?.user_metadata?.ig_connection;
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
      setIgConnection({ connected: false });
    } catch (err) {
      console.error("Status check error:", err);
      setIgConnection({ connected: false });
    } finally {
      setIsLoading(false);
    }
  };

  const fetchScheduledPosts = async () => {
    setLoadingScheduled(true);
    try {
      const res  = await fetch("/api/integrations/instagram/schedule");
      const data = await res.json();
      setScheduledPosts(data.posts || []);
    } catch (err) {
      console.error("Fetch scheduled posts error:", err);
    } finally {
      setLoadingScheduled(false);
    }
  };

  const handleConnect = () => {
    if (!user) {
      toaster.create({ title: "Sign in required", description: "Please sign in before connecting Instagram.", type: "warning", duration: 4000 });
      return;
    }
    window.location.href = `/api/integrations/instagram/connect?user_id=${encodeURIComponent(user.id)}`;
  };

  const handleDisconnect = async () => {
    if (!confirm("Disconnect Instagram? Scheduled posts will not be published.")) return;
    setIsDisconnecting(true);
    try {
      const res = await fetch("/api/integrations/instagram/disconnect", { method: "POST" });
      if (!res.ok) throw new Error("Disconnect failed");
      setIgConnection({ connected: false });
      setScheduledPosts([]);
      toaster.create({ title: "Disconnected", description: "Instagram has been disconnected.", type: "success", duration: 4000 });
    } catch (err: any) {
      toaster.create({ title: "Error", description: err.message || "Could not disconnect.", type: "error", duration: 4000 });
    } finally {
      setIsDisconnecting(false);
    }
  };

  const handlePost = async () => {
    if (!caption && mediaType !== "STORIES") {
      toaster.create({ title: "Caption required", description: "Please add a caption for your post.", type: "warning", duration: 3000 });
      return;
    }
    if (mediaType === "CAROUSEL") {
      const urls = carouselUrls.split("\n").map(u => u.trim()).filter(Boolean);
      if (urls.length < 2) {
        toaster.create({ title: "Add at least 2 URLs", description: "Carousel requires 2–10 image/video URLs.", type: "warning", duration: 3000 });
        return;
      }
    } else if (!mediaUrl.trim()) {
      toaster.create({ title: "Media URL required", description: "Please provide a publicly accessible URL.", type: "warning", duration: 3000 });
      return;
    }
    if (postMode === "schedule" && !scheduledAt) {
      toaster.create({ title: "Pick a date/time", description: "Please choose when to publish this post.", type: "warning", duration: 3000 });
      return;
    }

    setIsPosting(true);
    try {
      const body: Record<string, any> = {
        media_type: mediaType,
        caption:    caption || undefined,
      };
      if (mediaType === "CAROUSEL") {
        body.carousel_urls = carouselUrls.split("\n").map(u => u.trim()).filter(Boolean);
      } else {
        body.media_url = mediaUrl.trim();
      }
      if (postMode === "schedule") {
        body.scheduled_at = new Date(scheduledAt).toISOString();
      }

      const endpoint = postMode === "now"
        ? "/api/integrations/instagram/publish"
        : "/api/integrations/instagram/schedule";

      const res  = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      const data = await res.json();

      if (!res.ok) throw new Error(data.error || "Failed");

      if (postMode === "now") {
        toaster.create({
          title: "Published! 🎉",
          description: `Post live at ${data.post_url}`,
          type: "success", duration: 6000,
        });
      } else {
        toaster.create({
          title: "Scheduled ✓",
          description: `Post scheduled for ${new Date(scheduledAt).toLocaleString()}`,
          type: "success", duration: 5000,
        });
        fetchScheduledPosts();
      }

      // Reset form
      setMediaUrl(""); setCarouselUrls(""); setCaption(""); setScheduledAt("");
    } catch (err: any) {
      toaster.create({ title: "Error", description: err.message || "Something went wrong.", type: "error", duration: 5000 });
    } finally {
      setIsPosting(false);
    }
  };

  const handleCancelScheduled = async (id: string) => {
    if (!confirm("Cancel this scheduled post?")) return;
    setCancellingId(id);
    try {
      const res = await fetch(`/api/integrations/instagram/schedule?id=${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Cancel failed");
      setScheduledPosts(prev => prev.filter(p => p.id !== id));
      toaster.create({ title: "Cancelled", type: "success", duration: 3000 });
    } catch (err: any) {
      toaster.create({ title: "Error", description: err.message, type: "error", duration: 4000 });
    } finally {
      setCancellingId(null);
    }
  };

  const daysUntilExpiry = igConnection.expires_at
    ? Math.floor((new Date(igConnection.expires_at).getTime() - Date.now()) / (1000 * 60 * 60 * 24))
    : null;

  // ── Render ────────────────────────────────────────────────────────────────────

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
            bg="white" border="1px solid"
            borderColor={igConnection.connected ? "#FBCFE8" : "#ECECEC"}
            borderRadius="24px" p={6}
            boxShadow="0 12px 48px rgba(0,0,0,0.04)"
          >
            <Flex align="center" gap={4} mb={4}>
              <InstagramLogo />
              <Box flex={1}>
                <Text fontSize="17px" fontWeight="700" color="#111111" lineHeight="1.2">Instagram</Text>
                {igConnection.connected ? (
                  <Badge colorScheme="green" mt={1.5}>@{igConnection.username}</Badge>
                ) : (
                  <Box display="inline-block" mt={1.5} px={2.5} py={0.5}
                    bg="#F3F4F6" borderRadius="999px" border="1px solid" borderColor="#E5E7EB">
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
                  <Button flex={1} variant="outline" borderColor="#D1D5DB" color="#4F46E5" bg="white"
                    borderRadius="12px" h="42px" fontSize="14px" fontWeight="600"
                    _hover={{ bg: "#F5F5FF", borderColor: "#C7D2FE" }} onClick={handleConnect}>
                    Reconnect
                  </Button>
                  <Button flex={1} variant="outline" borderColor="#FECACA" color="#DC2626" bg="white"
                    borderRadius="12px" h="42px" fontSize="14px" fontWeight="600"
                    _hover={{ bg: "#FEF2F2", borderColor: "#FCA5A5" }}
                    onClick={handleDisconnect} loading={isDisconnecting}>
                    Disconnect
                  </Button>
                </Flex>
              </VStack>
            ) : (
              <Button w="full" borderRadius="14px" h="44px" fontSize="14px" fontWeight="600" color="white"
                style={{ background: "linear-gradient(135deg, #f09433 0%, #e6683c 25%, #dc2743 50%, #cc2366 75%, #bc1888 100%)" }}
                _hover={{ opacity: 0.9 }} loading={isLoading} onClick={handleConnect}>
                Connect with Instagram
              </Button>
            )}
          </Box>
        </SimpleGrid>
      </Box>

      {/* ── Post to Instagram (only when connected) ── */}
      {igConnection.connected && (
        <Box bg="white" border="1px solid" borderColor="#E5E7EB" borderRadius="24px" p={6}
          boxShadow="0 12px 48px rgba(0,0,0,0.04)">

          {/* Section header */}
          <Flex align="center" gap={3} mb={5}>
            <InstagramLogo />
            <Box>
              <Text fontSize="17px" fontWeight="700" color="#111111">Post to Instagram</Text>
              <Text fontSize="13px" color="#6B7280">Publish now or schedule for later</Text>
            </Box>
          </Flex>

          {/* Mode toggle */}
          <Flex gap={2} mb={5} bg="#F9FAFB" p={1} borderRadius="12px" w="fit-content">
            {(["now", "schedule"] as PostMode[]).map(mode => (
              <Button key={mode} size="sm"
                borderRadius="10px" h="34px" px={4} fontSize="13px" fontWeight="600"
                bg={postMode === mode ? "white" : "transparent"}
                color={postMode === mode ? "#111111" : "#6B7280"}
                boxShadow={postMode === mode ? "0 1px 4px rgba(0,0,0,0.08)" : "none"}
                _hover={{ bg: postMode === mode ? "white" : "#F3F4F6" }}
                onClick={() => setPostMode(mode)}>
                {mode === "now" ? "⚡ Publish Now" : "🗓 Schedule"}
              </Button>
            ))}
          </Flex>

          <VStack gap={4} align="stretch">

            {/* Media type */}
            <Box>
              <Text fontSize="13px" fontWeight="600" color="#374151" mb={2}>Media Type</Text>
              <Flex gap={2} wrap="wrap">
                {(["IMAGE", "VIDEO", "REELS", "CAROUSEL", "STORIES"] as MediaType[]).map(type => (
                  <Button key={type} size="sm" borderRadius="999px" h="32px" px={3} fontSize="12px" fontWeight="600"
                    bg={mediaType === type ? "#111111" : "#F3F4F6"}
                    color={mediaType === type ? "white" : "#374151"}
                    border="1px solid" borderColor={mediaType === type ? "#111111" : "#E5E7EB"}
                    _hover={{ bg: mediaType === type ? "#111111" : "#E5E7EB" }}
                    onClick={() => setMediaType(type)}>
                    {type}
                  </Button>
                ))}
              </Flex>
            </Box>

            {/* Media URL(s) */}
            {mediaType === "CAROUSEL" ? (
              <Box>
                <Text fontSize="13px" fontWeight="600" color="#374151" mb={1}>
                  Image / Video URLs <Text as="span" color="#9CA3AF" fontWeight="400">(one per line, 2–10)</Text>
                </Text>
                <Textarea
                  value={carouselUrls}
                  onChange={e => setCarouselUrls(e.target.value)}
                  placeholder={"https://example.com/image1.jpg\nhttps://example.com/image2.jpg"}
                  rows={4} fontSize="13px" borderRadius="12px"
                  border="1px solid" borderColor="#E5E7EB"
                  _focus={{ borderColor: "#6366F1", boxShadow: "0 0 0 3px rgba(99,102,241,0.1)" }}
                />
              </Box>
            ) : (
              <Box>
                <Text fontSize="13px" fontWeight="600" color="#374151" mb={1}>
                  Media URL <Text as="span" color="#9CA3AF" fontWeight="400">(must be publicly accessible)</Text>
                </Text>
                <input
                  type="url"
                  value={mediaUrl}
                  onChange={e => setMediaUrl(e.target.value)}
                  placeholder="https://example.com/your-image.jpg"
                  style={{
                    width: "100%", padding: "10px 14px", fontSize: "13px",
                    border: "1px solid #E5E7EB", borderRadius: "12px",
                    outline: "none", fontFamily: "inherit", color: "#111111",
                    background: "white",
                  }}
                  onFocus={e => { e.target.style.borderColor = "#6366F1"; e.target.style.boxShadow = "0 0 0 3px rgba(99,102,241,0.1)"; }}
                  onBlur={e =>  { e.target.style.borderColor = "#E5E7EB";  e.target.style.boxShadow = "none"; }}
                />
              </Box>
            )}

            {/* Caption */}
            {mediaType !== "STORIES" && (
              <Box>
                <Flex justify="space-between" mb={1}>
                  <Text fontSize="13px" fontWeight="600" color="#374151">Caption</Text>
                  <Text fontSize="12px" color="#9CA3AF">{caption.length}/2200</Text>
                </Flex>
                <Textarea
                  value={caption}
                  onChange={e => setCaption(e.target.value.slice(0, 2200))}
                  placeholder="Write your caption, add hashtags..."
                  rows={4} fontSize="13px" borderRadius="12px"
                  border="1px solid" borderColor="#E5E7EB"
                  _focus={{ borderColor: "#6366F1", boxShadow: "0 0 0 3px rgba(99,102,241,0.1)" }}
                />
              </Box>
            )}

            {/* Schedule date/time */}
            {postMode === "schedule" && (
              <Box>
                <Text fontSize="13px" fontWeight="600" color="#374151" mb={1}>Schedule Date & Time</Text>
                <input
                  type="datetime-local"
                  value={scheduledAt}
                  onChange={e => setScheduledAt(e.target.value)}
                  min={new Date(Date.now() + 60000).toISOString().slice(0, 16)}
                  style={{
                    width: "100%", padding: "10px 14px", fontSize: "13px",
                    border: "1px solid #E5E7EB", borderRadius: "12px",
                    outline: "none", fontFamily: "inherit", color: "#111111",
                    background: "white",
                  }}
                  onFocus={e => { e.target.style.borderColor = "#6366F1"; e.target.style.boxShadow = "0 0 0 3px rgba(99,102,241,0.1)"; }}
                  onBlur={e =>  { e.target.style.borderColor = "#E5E7EB";  e.target.style.boxShadow = "none"; }}
                />
              </Box>
            )}

            {/* Submit */}
            <Button
              w="full" h="46px" borderRadius="14px" fontSize="14px" fontWeight="700"
              color="white" loading={isPosting}
              style={{ background: postMode === "now"
                ? "linear-gradient(135deg, #f09433 0%, #e6683c 25%, #dc2743 50%, #cc2366 75%, #bc1888 100%)"
                : "linear-gradient(135deg, #6366F1 0%, #8B5CF6 100%)"
              }}
              _hover={{ opacity: 0.9 }}
              onClick={handlePost}>
              {postMode === "now" ? "⚡ Publish to Instagram" : "🗓 Schedule Post"}
            </Button>
          </VStack>
        </Box>
      )}

      {/* ── Scheduled Posts list ── */}
      {igConnection.connected && (
        <Box>
          <Flex justify="space-between" align="center" mb={4}>
            <Text fontSize="13px" fontWeight="800" color="#6B7280" letterSpacing="0.06em" textTransform="uppercase">
              Scheduled Posts
            </Text>
            <Button variant="ghost" size="xs" onClick={fetchScheduledPosts} loading={loadingScheduled}
              color="#6B7280" _hover={{ color: "#111111" }}>
              Refresh
            </Button>
          </Flex>

          {loadingScheduled ? (
            <Box bg="white" border="1px solid" borderColor="#E5E7EB" borderRadius="16px" p={6} textAlign="center">
              <Text fontSize="14px" color="#9CA3AF">Loading scheduled posts...</Text>
            </Box>
          ) : scheduledPosts.length === 0 ? (
            <Box bg="white" border="1px solid" borderColor="#E5E7EB" borderRadius="16px" p={6} textAlign="center">
              <Text fontSize="14px" color="#9CA3AF">No scheduled posts yet.</Text>
              <Text fontSize="13px" color="#D1D5DB" mt={1}>Use the scheduler above to queue posts.</Text>
            </Box>
          ) : (
            <VStack gap={3} align="stretch">
              {scheduledPosts.map(post => (
                <Box key={post.id} bg="white" border="1px solid"
                  borderColor={
                    post.status === "published" ? "#86EFAC"
                    : post.status === "failed"   ? "#FECACA"
                    : "#E5E7EB"
                  }
                  borderRadius="16px" p={4}>
                  <Flex justify="space-between" align="flex-start" gap={3}>
                    <Box flex={1} minW={0}>
                      <Flex align="center" gap={2} mb={1} wrap="wrap">
                        <Box px={2} py={0.5} borderRadius="999px" fontSize="10px" fontWeight="700"
                          bg={
                            post.status === "published" ? "#DCFCE7"
                            : post.status === "failed"  ? "#FEE2E2"
                            : "#EEF2FF"
                          }
                          color={
                            post.status === "published" ? "#166534"
                            : post.status === "failed"  ? "#DC2626"
                            : "#4F46E5"
                          }>
                          {post.status.toUpperCase()}
                        </Box>
                        <Box px={2} py={0.5} bg="#F3F4F6" borderRadius="999px" fontSize="10px" fontWeight="700" color="#374151">
                          {post.media_type}
                        </Box>
                      </Flex>
                      {post.caption && (
                        <Text fontSize="13px" color="#374151" lineHeight="1.5"
                          overflow="hidden" style={{ display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical" }}>
                          {post.caption}
                        </Text>
                      )}
                      <Text fontSize="12px" color="#9CA3AF" mt={1}>
                        {post.status === "scheduled"
                          ? `Scheduled: ${new Date(post.scheduled_at).toLocaleString()}`
                          : post.status === "published"
                          ? `Published · IG ID: ${post.ig_post_id}`
                          : `Failed: ${post.error_message || "unknown error"}`}
                      </Text>
                    </Box>
                    {post.status === "scheduled" && (
                      <Button size="xs" variant="ghost" color="#DC2626"
                        _hover={{ bg: "#FEF2F2" }} borderRadius="8px" flexShrink={0}
                        loading={cancellingId === post.id}
                        onClick={() => handleCancelScheduled(post.id)}>
                        Cancel
                      </Button>
                    )}
                  </Flex>
                </Box>
              ))}
            </VStack>
          )}
        </Box>
      )}

      {/* Coming Soon */}
      <Box>
        <Text fontSize="13px" fontWeight="800" color="#6B7280" letterSpacing="0.06em" textTransform="uppercase" mb={4}>
          Coming Soon
        </Text>
        <Flex gap={4} wrap="wrap">
          {COMING_SOON.map(({ key, name, abbr, color }) => (
            <Flex key={key} align="center" gap={3} bg="white"
              border="1px solid" borderColor="#ECECEC"
              borderRadius="16px" px={4} py={3}
              boxShadow="0 4px 16px rgba(0,0,0,0.03)" opacity={0.7}>
              <PlatformPlaceholderLogo label={abbr} color={color} />
              <Box>
                <Text fontSize="14px" fontWeight="600" color="#111111">{name}</Text>
                <Box display="inline-block" mt={0.5} px={2} py={0.5}
                  bg="#FEF3C7" borderRadius="999px" border="1px solid" borderColor="#FDE68A">
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
