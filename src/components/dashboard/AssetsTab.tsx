"use client";

import { useState, useEffect, useCallback } from "react";
import {
  Badge, Box, Button, Flex, Image, Text, VStack, Textarea,
} from "@chakra-ui/react";
import {
  ChevronDown, ChevronUp, Coffee, Download, ImageIcon, Loader, Send, Calendar, X,
} from "lucide-react";
import type { CampaignAsset } from "@/types/onboarding.types";
import type { CampaignTracker } from "@/hooks/useCampaignPolling";
import { supabase } from "@/lib/supabase";
import {
  type TemplateProps,
  AwarenessVariation1, AwarenessVariation2, AwarenessVariation3, AwarenessVariation4, AwarenessVariation5,
  SaleVariation1, SaleVariation2, SaleVariation3, SaleVariation4, SaleVariation5,
  LaunchVariation1, LaunchVariation2, LaunchVariation3, LaunchVariation4, LaunchVariation5,
  EngagementVariation1, EngagementVariation2, EngagementVariation3, EngagementVariation4, EngagementVariation5,
  StoryNarrativeVariation1, StoryNarrativeVariation2, StoryNarrativeVariation3, StoryNarrativeVariation4, StoryNarrativeVariation5,
} from "./templates";

// ─── Types ────────────────────────────────────────────────────────────────────

interface AssetsTabProps {
  trackers: CampaignTracker[];
  statuses: Record<string, { total: number; complete: number; status: string }>;
  assets: Record<string, CampaignAsset[]>;
  progress: number;
  isPolling: boolean;
}

type MediaType    = "IMAGE" | "VIDEO" | "REELS" | "CAROUSEL" | "STORIES";
type PostMode     = "now" | "schedule";
type ImageFormat  = "stories" | "feed" | "feed_4_5";

const FORMAT_LABELS: Record<ImageFormat, string> = {
  stories:  "Stories (9:16)",
  feed:     "Feed Square (1:1)",
  feed_4_5: "Feed 4:5",
};

const FORMAT_RATIO: Record<ImageFormat, string> = {
  stories:  "9/16",
  feed:     "1/1",
  feed_4_5: "4/5",
};

const FORMAT_IG_TYPE: Record<ImageFormat, MediaType> = {
  stories:  "STORIES",
  feed:     "IMAGE",
  feed_4_5: "IMAGE",
};

interface LibraryFile {
  id: string;
  name: string;
  url: string;
  format: ImageFormat;
  label?: string | null;
  created_at?: string | null;
}

interface PublishTarget {
  url: string;
  label: string;
  defaultMediaType?: MediaType;
}

// ─── Instagram Publish Modal ──────────────────────────────────────────────────

function PublishModal({
  target,
  onClose,
}: {
  target: PublishTarget;
  onClose: () => void;
}) {
  const [mode,        setMode]        = useState<PostMode>("now");
  const [mediaType,   setMediaType]   = useState<MediaType>(target.defaultMediaType ?? "IMAGE");
  const [caption,     setCaption]     = useState("");
  const [scheduledAt, setScheduledAt] = useState("");
  const [isPosting,   setIsPosting]   = useState(false);

  const handlePublish = async () => {
    setIsPosting(true);
    try {
      const body: Record<string, any> = {
        media_type: mediaType,
        media_url:  target.url,
        caption:    caption || undefined,
      };
      if (mode === "schedule") {
        if (!scheduledAt) {
          alert("Please pick a date/time.");
          setIsPosting(false);
          return;
        }
        body.scheduled_at = new Date(scheduledAt).toISOString();
      }

      const endpoint = mode === "now"
        ? "/api/integrations/instagram/publish"
        : "/api/integrations/instagram/schedule";

      const res  = await fetch(endpoint, {
        method:  "POST",
        headers: { "Content-Type": "application/json" },
        body:    JSON.stringify(body),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed");

      onClose();
      alert(mode === "now"
        ? `✅ Published! ${data.post_url}`
        : `✅ Scheduled for ${new Date(scheduledAt).toLocaleString()}`
      );
    } catch (err: any) {
      alert(`❌ ${err.message}`);
    } finally {
      setIsPosting(false);
    }
  };

  return (
    // Backdrop
    <Box
      position="fixed" inset={0} zIndex={1000}
      bg="rgba(0,0,0,0.55)" backdropFilter="blur(4px)"
      display="flex" alignItems="center" justifyContent="center"
      onClick={onClose}
    >
      {/* Modal */}
      <Box
        bg="white" borderRadius="24px" p={6} w="full" maxW="440px" mx={4}
        boxShadow="0 32px 80px rgba(0,0,0,0.2)"
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <Flex justify="space-between" align="center" mb={5}>
          <Flex align="center" gap={2}>
            <Box w="28px" h="28px" borderRadius="8px" flexShrink={0}
              style={{ background: "linear-gradient(135deg, #f09433 0%, #dc2743 50%, #bc1888 100%)" }}
              display="flex" alignItems="center" justifyContent="center">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                <rect x="2" y="2" width="20" height="20" rx="6" stroke="white" strokeWidth="2" fill="none" />
                <circle cx="12" cy="12" r="4.5" stroke="white" strokeWidth="2" fill="none" />
                <circle cx="17.5" cy="6.5" r="1" fill="white" />
              </svg>
            </Box>
            <Text fontSize="16px" fontWeight="700" color="#111111">Post to Instagram</Text>
          </Flex>
          <Button variant="ghost" size="xs" onClick={onClose} p={1} borderRadius="8px"
            _hover={{ bg: "#F3F4F6" }}>
            <X size={16} color="#6B7280" />
          </Button>
        </Flex>

        {/* Preview */}
        <Box mb={4} borderRadius="12px" overflow="hidden" border="1px solid" borderColor="#E5E7EB"
          style={{ aspectRatio: "4/5", maxHeight: "180px" }}>
          <Image src={target.url} alt={target.label} objectFit="cover" w="full" h="full" />
        </Box>

        {/* Mode toggle */}
        <Flex gap={2} mb={4} bg="#F9FAFB" p={1} borderRadius="10px">
          {(["now", "schedule"] as PostMode[]).map(m => (
            <Button key={m} flex={1} size="sm" borderRadius="8px" h="32px" fontSize="12px" fontWeight="600"
              bg={mode === m ? "white" : "transparent"}
              color={mode === m ? "#111111" : "#6B7280"}
              boxShadow={mode === m ? "0 1px 4px rgba(0,0,0,0.08)" : "none"}
              _hover={{ bg: mode === m ? "white" : "#F3F4F6" }}
              onClick={() => setMode(m)}>
              {m === "now" ? "⚡ Now" : "🗓 Schedule"}
            </Button>
          ))}
        </Flex>

        {/* Media type */}
        <Box mb={4}>
          <Text fontSize="12px" fontWeight="600" color="#374151" mb={1.5}>Media Type</Text>
          <Flex gap={1.5} wrap="wrap">
            {(["IMAGE", "VIDEO", "REELS", "CAROUSEL", "STORIES"] as MediaType[]).map(type => (
              <Button key={type} size="xs" borderRadius="999px" h="26px" px={2.5} fontSize="11px" fontWeight="600"
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

        {/* Caption */}
        {mediaType !== "STORIES" && (
          <Box mb={4}>
            <Flex justify="space-between" mb={1}>
              <Text fontSize="12px" fontWeight="600" color="#374151">Caption</Text>
              <Text fontSize="11px" color="#9CA3AF">{caption.length}/2200</Text>
            </Flex>
            <Textarea
              value={caption}
              onChange={e => setCaption(e.target.value.slice(0, 2200))}
              placeholder="Write your caption, add hashtags..."
              rows={3} fontSize="13px" borderRadius="10px"
              border="1px solid" borderColor="#E5E7EB"
              _focus={{ borderColor: "#6366F1", boxShadow: "0 0 0 3px rgba(99,102,241,0.1)" }}
            />
          </Box>
        )}

        {/* Schedule datetime */}
        {mode === "schedule" && (
          <Box mb={4}>
            <Text fontSize="12px" fontWeight="600" color="#374151" mb={1}>Schedule Date & Time</Text>
            <input
              type="datetime-local"
              value={scheduledAt}
              onChange={e => setScheduledAt(e.target.value)}
              min={new Date(Date.now() + 60000).toISOString().slice(0, 16)}
              style={{
                width: "100%", padding: "8px 12px", fontSize: "13px",
                border: "1px solid #E5E7EB", borderRadius: "10px",
                outline: "none", fontFamily: "inherit", color: "#111111", background: "white",
              }}
            />
          </Box>
        )}

        {/* Submit */}
        <Button w="full" h="44px" borderRadius="12px" fontSize="14px" fontWeight="700"
          color="white" loading={isPosting}
          style={{ background: mode === "now"
            ? "linear-gradient(135deg, #f09433 0%, #e6683c 25%, #dc2743 50%, #cc2366 75%, #bc1888 100%)"
            : "linear-gradient(135deg, #6366F1 0%, #8B5CF6 100%)"
          }}
          _hover={{ opacity: 0.9 }}
          onClick={handlePublish}>
          {mode === "now" ? "⚡ Publish Now" : "🗓 Schedule Post"}
        </Button>
      </Box>
    </Box>
  );
}

// ─── Progress Header ──────────────────────────────────────────────────────────

function ProgressHeader({ progress, isPolling, totalAssets, totalJobs }: {
  progress: number; isPolling: boolean; totalAssets: number; totalJobs: number;
}) {
  const isComplete = progress === 100 && !isPolling;
  return (
    <Box bg={isComplete ? "#F0FDF4" : "white"} border="1px solid"
      borderColor={isComplete ? "#BBF7D0" : "#E5E7EB"} borderRadius="20px"
      p={{ base: 5, md: 6 }}>
      <Flex align="center" gap={4}>
        <Flex w="56px" h="56px" borderRadius="full" position="relative"
          align="center" justify="center" flexShrink={0}
          bg={isComplete ? "#DCFCE7" : "#F3F4F6"}>
          <svg width="56" height="56" viewBox="0 0 56 56" style={{ position: "absolute", transform: "rotate(-90deg)" }}>
            <circle cx="28" cy="28" r="24" fill="none" stroke={isComplete ? "#BBF7D0" : "#E5E7EB"} strokeWidth="4" />
            <circle cx="28" cy="28" r="24" fill="none"
              stroke={isComplete ? "#22C55E" : "#4F46E5"} strokeWidth="4"
              strokeDasharray={`${2 * Math.PI * 24}`}
              strokeDashoffset={`${2 * Math.PI * 24 * (1 - progress / 100)}`}
              strokeLinecap="round"
              style={{ transition: "stroke-dashoffset 0.6s ease" }} />
          </svg>
          <Text fontSize="14px" fontWeight="700" color={isComplete ? "#166534" : "#4F46E5"}>{progress}%</Text>
        </Flex>
        <Box flex="1">
          <Flex align="center" gap={2}>
            <Text fontSize="18px" fontWeight="700" color="#111">
              {isComplete ? "All Assets Ready" : "Generating Assets"}
            </Text>
            {isPolling && <Loader size={16} color="#4F46E5" style={{ animation: "spin 1.5s linear infinite" }} />}
          </Flex>
          <Text fontSize="14px" color="#6B7280" mt={0.5}>
            {isComplete
              ? `${totalAssets} images generated and uploaded to your library.`
              : `${totalAssets} of ${totalJobs} images complete. New assets appear below as they finish.`}
          </Text>
          {isPolling && !isComplete && (
            <Flex align="center" gap={1.5} mt={1.5}>
              <Coffee size={14} color="#A78BFA" />
              <Text fontSize="13px" color="#7C3AED" fontWeight="500">
                Go grab a coffee — this runs in the background, even if you close the tab.
              </Text>
            </Flex>
          )}
        </Box>
        <Box flex="1" maxW="300px" display={{ base: "none", md: "block" }}>
          <Box bg="#F3F4F6" borderRadius="999px" h="10px" overflow="hidden">
            <Box bg={isComplete
                ? "linear-gradient(90deg, #22C55E 0%, #16A34A 100%)"
                : "linear-gradient(90deg, #4F46E5 0%, #7C3AED 100%)"}
              h="100%" borderRadius="999px" w={`${progress}%`} transition="width 0.6s ease" />
          </Box>
          <Text fontSize="12px" color="#9CA3AF" mt={1} textAlign="right">{totalAssets} / {totalJobs}</Text>
        </Box>
      </Flex>
    </Box>
  );
}

// ─── Skeleton Card ────────────────────────────────────────────────────────────

function SkeletonCard() {
  return (
    <Box border="1px solid" borderColor="#F3F4F6" borderRadius="18px" overflow="hidden" bg="white">
      <Box bg="#F3F4F6" position="relative" style={{ aspectRatio: "4/5" }}>
        <Flex position="absolute" inset={0} align="center" justify="center"
          bg="linear-gradient(135deg, #F9FAFB 25%, #F3F4F6 50%, #F9FAFB 75%)"
          backgroundSize="400% 400%"
          style={{ animation: "shimmer 1.8s ease-in-out infinite" }}>
          <ImageIcon size={28} color="#D1D5DB" />
        </Flex>
      </Box>
      <Box p={4}>
        <Box h="16px" w="70%" bg="#F3F4F6" borderRadius="8px" mb={2} />
        <Box h="12px" w="50%" bg="#F3F4F6" borderRadius="8px" />
      </Box>
    </Box>
  );
}

// ─── Instagram Publish Button (overlay) ──────────────────────────────────────

function IgPublishButton({ url, label, onPublish }: { url: string; label: string; onPublish: (t: PublishTarget) => void }) {
  return (
    <Button
      size="xs" borderRadius="8px" h="28px" px={2}
      bg="rgba(0,0,0,0.45)" color="white"
      backdropFilter="blur(4px)"
      _hover={{ bg: "rgba(220,39,67,0.85)" }}
      onClick={e => { e.stopPropagation(); onPublish({ url, label }); }}
      gap={1}
    >
      <svg width="12" height="12" viewBox="0 0 24 24" fill="none">
        <rect x="2" y="2" width="20" height="20" rx="6" stroke="white" strokeWidth="2" fill="none" />
        <circle cx="12" cy="12" r="4.5" stroke="white" strokeWidth="2" fill="none" />
        <circle cx="17.5" cy="6.5" r="1" fill="white" />
      </svg>
      <Text fontSize="10px" fontWeight="700">Post</Text>
    </Button>
  );
}

// ─── Asset Card (generated template) ─────────────────────────────────────────

function AssetCard({ asset, igConnected, onPublish }: {
  asset: CampaignAsset;
  igConnected: boolean;
  onPublish: (t: PublishTarget) => void;
}) {
  const [showPrompt, setShowPrompt] = useState(false);
  const vd = asset.variation_data as Record<string, string>;
  const primary   = vd.primary_color   || "#4F46E5";
  const secondary = vd.secondary_color || "#1E1B4B";
  const accent    = vd.accent_color    || "#7C3AED";
  const templateProps: TemplateProps = { vd, imageUrl: asset.image_url, primary, secondary, accent };
  const variationIndex = asset.variation_index || 1;

  const TemplateComponent = (() => {
    switch (asset.ad_type) {
      case "sale":
        return [SaleVariation1, SaleVariation2, SaleVariation3, SaleVariation4, SaleVariation5][variationIndex - 1] || SaleVariation1;
      case "launch":
        return [LaunchVariation1, LaunchVariation2, LaunchVariation3, LaunchVariation4, LaunchVariation5][variationIndex - 1] || LaunchVariation1;
      case "story_narrative":
        return [StoryNarrativeVariation1, StoryNarrativeVariation2, StoryNarrativeVariation3, StoryNarrativeVariation4, StoryNarrativeVariation5][variationIndex - 1] || StoryNarrativeVariation1;
      case "engagement":
        return [EngagementVariation1, EngagementVariation2, EngagementVariation3, EngagementVariation4, EngagementVariation5][variationIndex - 1] || EngagementVariation1;
      default:
        return [AwarenessVariation1, AwarenessVariation2, AwarenessVariation3, AwarenessVariation4, AwarenessVariation5][variationIndex - 1] || AwarenessVariation1;
    }
  })();

  return (
    <Box borderRadius="18px" overflow="hidden" bg="white"
      border="1px solid" borderColor="#ECECEC"
      transition="all 0.3s ease"
      _hover={{ boxShadow: "0 16px 48px rgba(0,0,0,0.1)", transform: "translateY(-3px)" }}
      style={{ animation: "fadeInUp 0.4s ease-out" }}>
      <Box position="relative" overflow="hidden" style={{ aspectRatio: "4/5" }}>
        <TemplateComponent {...templateProps} />

        {/* Top bar: ad type badge + action buttons */}
        <Flex position="absolute" top={3} left={3} right={3}
          justify="space-between" align="center" zIndex={10}>
          <Badge bg="rgba(0,0,0,0.45)" color="white" backdropFilter="blur(4px)"
            borderRadius="8px" px={2.5} py={1} fontSize="10px" fontWeight="600" textTransform="capitalize">
            {asset.ad_type?.replace("_", " ")}
          </Badge>
          <Flex gap={1.5}>
            {igConnected && asset.image_url && (
              <IgPublishButton
                url={asset.image_url}
                label={asset.ad_type || "asset"}
                onPublish={onPublish}
              />
            )}
            {asset.image_url && (
              <Button size="xs" bg="rgba(255,255,255,0.15)" color="white" borderRadius="8px"
                backdropFilter="blur(4px)" _hover={{ bg: "rgba(255,255,255,0.3)" }}
                h="28px" w="28px" p={0} minW="28px"
                onClick={async (e) => {
                  e.stopPropagation();
                  if (!asset.image_url) return;
                  try {
                    const res = await fetch(asset.image_url);
                    const blob = await res.blob();
                    const url = URL.createObjectURL(blob);
                    const a = document.createElement("a");
                    a.href = url; a.download = `${asset.variation_id || "ad"}.webp`;
                    document.body.appendChild(a); a.click();
                    document.body.removeChild(a); URL.revokeObjectURL(url);
                  } catch { window.open(asset.image_url, "_blank"); }
                }}>
                <Download size={13} />
              </Button>
            )}
          </Flex>
        </Flex>

        {!asset.image_url && (
          <Flex position="absolute" inset={0} align="center" justify="center" zIndex={5}>
            <VStack gap={1}>
              <Loader size={24} color="white" style={{ animation: "spin 1.5s linear infinite" }} />
              <Text fontSize="12px" color="rgba(255,255,255,0.7)">Generating image...</Text>
            </VStack>
          </Flex>
        )}
      </Box>

      <Box p={3.5}>
        <Flex align="center" justify="space-between">
          <Flex gap={1.5}>
            {[primary, secondary, accent].map((c, i) => (
              <Box key={i} w="16px" h="16px" borderRadius="4px" bg={c} border="1px solid" borderColor="#E5E7EB" />
            ))}
          </Flex>
          <Button variant="ghost" size="xs" fontSize="11px" color="#9CA3AF" h="26px" px={2}
            _hover={{ color: "#6B7280", bg: "#F9FAFB" }}
            onClick={() => setShowPrompt(!showPrompt)}>
            {showPrompt ? <ChevronUp size={12} /> : <ChevronDown size={12} />}
            <Text ml={1}>{showPrompt ? "Hide" : "Prompt"}</Text>
          </Button>
        </Flex>
        {showPrompt && vd.image_prompt && (
          <Box mt={2.5} bg="#F9FAFB" borderRadius="10px" p={3}>
            <Text fontSize="11px" fontWeight="600" color="#9CA3AF" mb={1}>IMAGE PROMPT</Text>
            <Text fontSize="12px" color="#6B7280" lineHeight="1.4">{vd.image_prompt}</Text>
          </Box>
        )}
      </Box>
    </Box>
  );
}

// ─── Library Image Card ───────────────────────────────────────────────────────

function LibraryCard({ file, igConnected, onPublish }: {
  file: LibraryFile;
  igConnected: boolean;
  onPublish: (t: PublishTarget) => void;
}) {
  const ratio = FORMAT_RATIO[file.format];
  const igType = FORMAT_IG_TYPE[file.format];

  return (
    <Box borderRadius="18px" overflow="hidden" bg="white"
      border="1px solid" borderColor="#ECECEC"
      transition="all 0.3s ease"
      _hover={{ boxShadow: "0 16px 48px rgba(0,0,0,0.1)", transform: "translateY(-3px)" }}>
      <Box position="relative" overflow="hidden" style={{ aspectRatio: ratio }}>
        <Image src={file.url} alt={file.label || file.name} objectFit="cover" w="full" h="full" />

        <Flex position="absolute" top={3} left={3} right={3}
          justify="space-between" align="center" zIndex={10}>
          <Badge bg="rgba(0,0,0,0.45)" color="white" backdropFilter="blur(4px)"
            borderRadius="8px" px={2.5} py={1} fontSize="10px" fontWeight="600">
            {FORMAT_LABELS[file.format]}
          </Badge>
          <Flex gap={1.5}>
            {igConnected && (
              <IgPublishButton
                url={file.url}
                label={file.label || file.name}
                onPublish={t => onPublish({ ...t, defaultMediaType: igType })}
              />
            )}
            <Button size="xs" bg="rgba(255,255,255,0.15)" color="white" borderRadius="8px"
              backdropFilter="blur(4px)" _hover={{ bg: "rgba(255,255,255,0.3)" }}
              h="28px" w="28px" p={0} minW="28px"
              onClick={async e => {
                e.stopPropagation();
                try {
                  const res = await fetch(file.url);
                  const blob = await res.blob();
                  const url = URL.createObjectURL(blob);
                  const a = document.createElement("a");
                  a.href = url; a.download = file.name;
                  document.body.appendChild(a); a.click();
                  document.body.removeChild(a); URL.revokeObjectURL(url);
                } catch { window.open(file.url, "_blank"); }
              }}>
              <Download size={13} />
            </Button>
          </Flex>
        </Flex>
      </Box>

      <Box p={3.5}>
        <Text fontSize="13px" fontWeight="600" color="#111111"
          overflow="hidden" whiteSpace="nowrap" style={{ textOverflow: "ellipsis" }}>
          {file.label || file.name}
        </Text>
        <Text fontSize="11px" color="#9CA3AF" mt={0.5}>{FORMAT_LABELS[file.format]}</Text>
      </Box>
    </Box>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────

const STORAGE_BUCKET = "images";
const FORMATS: ImageFormat[] = ["stories", "feed", "feed_4_5"];

export default function AssetsTab({ trackers, statuses, assets, progress, isPolling }: AssetsTabProps) {
  const [igConnected,    setIgConnected]    = useState(false);
  const [libraryFiles,   setLibraryFiles]   = useState<LibraryFile[]>([]);
  const [loadingLib,     setLoadingLib]     = useState(true);
  const [publishTarget,  setPublishTarget]  = useState<PublishTarget | null>(null);
  const [activeFormat,   setActiveFormat]   = useState<ImageFormat | "all">("all");

  const allAssets   = trackers.flatMap(t => assets[t.campaignId] || []);
  const totalJobs   = Object.values(statuses).reduce((sum, s) => sum + s.total, 0);
  const pendingCount = totalJobs - allAssets.length;

  // ── Load IG connection state ────────────────────────────────────────────────
  useEffect(() => {
    supabase.auth.getUser().then(({ data: { user } }) => {
      setIgConnected(!!user?.user_metadata?.ig_connection?.access_token);
    });
  }, []);

  // ── Load library_images from Supabase table ────────────────────────────────
  const loadLibrary = useCallback(async () => {
    setLoadingLib(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) { setLibraryFiles([]); return; }

      const { data, error } = await supabase
        .from("library_images")
        .select("id, storage_path, external_url, format, label, created_at")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false });

      if (error || !data) { setLibraryFiles([]); return; }

      const files: LibraryFile[] = data.map(row => ({
        id:         row.id as string,
        name:       (row.storage_path as string).split("/").pop() || row.storage_path as string,
        // Use external_url if present, otherwise derive from storage bucket
        url:        (row.external_url as string | null) ||
                    supabase.storage.from(STORAGE_BUCKET).getPublicUrl(row.storage_path as string).data.publicUrl,
        format:     row.format as ImageFormat,
        label:      row.label as string | null,
        created_at: row.created_at as string | null,
      }));
      setLibraryFiles(files);
    } catch (err) {
      console.error("Library load error:", err);
      setLibraryFiles([]);
    } finally {
      setLoadingLib(false);
    }
  }, []);

  useEffect(() => { loadLibrary(); }, [loadLibrary]);

  // ── Empty state ─────────────────────────────────────────────────────────────
  if (trackers.length === 0 && libraryFiles.length === 0 && !loadingLib) {
    return (
      <Flex direction="column" align="center" justify="center"
        bg="white" border="1px solid" borderColor="#ECECEC" borderRadius="24px"
        p={{ base: 8, md: 16 }} textAlign="center" minH="400px">
        <Flex w="64px" h="64px" borderRadius="16px" bg="#F3F4F6" align="center" justify="center" mb={4}>
          <ImageIcon size={28} color="#D1D5DB" />
        </Flex>
        <Text fontSize="xl" fontWeight="700" color="#111" mb={2}>No Assets Yet</Text>
        <Text fontSize="15px" color="#6B7280" maxW="400px">
          Go to the Content tab, select your contexts and templates, then hit Generate. Your ads will appear here in real-time.
        </Text>
      </Flex>
    );
  }

  return (
    <>
      {/* Publish modal */}
      {publishTarget && (
        <PublishModal target={publishTarget} onClose={() => setPublishTarget(null)} />
      )}

      <VStack align="stretch" gap={6}>

        {/* Header */}
        <Flex align="center" justify="space-between">
          <Box>
            <Text fontSize={{ base: "3xl", md: "4xl" }} fontWeight="700" color="#111" lineHeight="1.05" mb={1}>
              Assets
            </Text>
            <Text fontSize="15px" color="#6B7280">
              Your generated ad creatives and uploaded library images.
            </Text>
          </Box>
          <Flex gap={2} align="center">
            {igConnected && (
              <Box px={3} py={1.5} borderRadius="999px"
                style={{ background: "linear-gradient(135deg, #f09433, #dc2743, #bc1888)" }}>
                <Text fontSize="11px" fontWeight="700" color="white">IG Connected</Text>
              </Box>
            )}
            {(allAssets.length > 0 || libraryFiles.length > 0) && (
              <Badge bg="#EEF2FF" color="#4338CA" px={3} py={2} borderRadius="999px" fontSize="14px">
                {allAssets.length + libraryFiles.length} {(allAssets.length + libraryFiles.length) === 1 ? "asset" : "assets"}
              </Badge>
            )}
          </Flex>
        </Flex>

        {/* Progress bar (generated assets only) */}
        {trackers.length > 0 && (
          <ProgressHeader
            progress={progress} isPolling={isPolling}
            totalAssets={allAssets.length} totalJobs={totalJobs}
          />
        )}

        {/* Generated assets grid */}
        {allAssets.length > 0 && (
          <Box>
            <Text fontSize="13px" fontWeight="800" color="#6B7280" letterSpacing="0.06em"
              textTransform="uppercase" mb={4}>
              Generated Ads
            </Text>
            <Box display="grid"
              gridTemplateColumns={{ base: "1fr", sm: "repeat(2, 1fr)", lg: "repeat(3, 1fr)", xl: "repeat(4, 1fr)" }}
              gap={5}>
              {allAssets.map(asset => (
                <AssetCard key={asset.variation_id} asset={asset}
                  igConnected={igConnected} onPublish={setPublishTarget} />
              ))}
              {isPolling && Array.from({ length: Math.min(pendingCount, 8) }).map((_, i) => (
                <SkeletonCard key={`skeleton-${i}`} />
              ))}
            </Box>
          </Box>
        )}

        {/* Library images */}
        <Box>
          <Flex justify="space-between" align="center" mb={4}>
            <Text fontSize="13px" fontWeight="800" color="#6B7280" letterSpacing="0.06em" textTransform="uppercase">
              Upload Library
            </Text>
            <Button variant="ghost" size="xs" onClick={loadLibrary} loading={loadingLib}
              color="#6B7280" _hover={{ color: "#111111" }}>
              Refresh
            </Button>
          </Flex>

          {/* Format filter tabs */}
          {libraryFiles.length > 0 && (
            <Flex gap={2} mb={5} wrap="wrap">
              {(["all", ...FORMATS] as (ImageFormat | "all")[]).map(f => {
                const count = f === "all" ? libraryFiles.length : libraryFiles.filter(img => img.format === f).length;
                return (
                  <Button key={f} size="sm" borderRadius="999px" h="32px" px={3} fontSize="12px" fontWeight="600"
                    bg={activeFormat === f ? "#111111" : "#F3F4F6"}
                    color={activeFormat === f ? "white" : "#374151"}
                    border="1px solid" borderColor={activeFormat === f ? "#111111" : "#E5E7EB"}
                    _hover={{ bg: activeFormat === f ? "#111111" : "#E5E7EB" }}
                    onClick={() => setActiveFormat(f)}>
                    {f === "all" ? "All" : FORMAT_LABELS[f]} ({count})
                  </Button>
                );
              })}
            </Flex>
          )}

          {loadingLib ? (
            <Box display="grid"
              gridTemplateColumns={{ base: "1fr", sm: "repeat(2, 1fr)", lg: "repeat(3, 1fr)", xl: "repeat(4, 1fr)" }}
              gap={5}>
              {[1, 2, 3, 4].map(i => <SkeletonCard key={i} />)}
            </Box>
          ) : libraryFiles.length === 0 ? (
            <Box bg="white" border="1px solid" borderColor="#E5E7EB" borderRadius="16px" p={6} textAlign="center">
              <Text fontSize="14px" color="#9CA3AF">No library images assigned to you yet.</Text>
              <Text fontSize="13px" color="#D1D5DB" mt={1}>
                Upload to Supabase Storage → <strong>{STORAGE_BUCKET}/</strong>&#123;stories|feed|feed_4_5&#125;/ then insert a row in <strong>library_images</strong>.
              </Text>
            </Box>
          ) : (
            <Box display="grid"
              gridTemplateColumns={{ base: "1fr", sm: "repeat(2, 1fr)", lg: "repeat(3, 1fr)", xl: "repeat(4, 1fr)" }}
              gap={5}>
              {libraryFiles
                .filter(f => activeFormat === "all" || f.format === activeFormat)
                .map(file => (
                  <LibraryCard key={file.id} file={file}
                    igConnected={igConnected} onPublish={setPublishTarget} />
                ))}
            </Box>
          )}
        </Box>
      </VStack>

      <style>{`
        @keyframes shimmer {
          0% { background-position: 200% 0; }
          100% { background-position: -200% 0; }
        }
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(12px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>
    </>
  );
}
