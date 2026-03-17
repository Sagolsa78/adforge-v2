"use client";

import { useState } from "react";
import {
  Badge,
  Box,
  Button,
  Flex,
  Image,
  Text,
  VStack,
} from "@chakra-ui/react";
import {
  ChevronDown,
  ChevronUp,
  Coffee,
  Download,
  ImageIcon,
  Loader,
} from "lucide-react";
import type { CampaignAsset } from "@/types/onboarding.types";
import type { CampaignTracker } from "@/hooks/useCampaignPolling";
import {
  type TemplateProps,
  // Awareness variations
  AwarenessVariation1,
  AwarenessVariation2,
  AwarenessVariation3,
  AwarenessVariation4,
  AwarenessVariation5,
  // Sale variations
  SaleVariation1,
  SaleVariation2,
  SaleVariation3,
  SaleVariation4,
  SaleVariation5,
  // Launch variations
  LaunchVariation1,
  LaunchVariation2,
  LaunchVariation3,
  LaunchVariation4,
  LaunchVariation5,
  // Engagement variations
  EngagementVariation1,
  EngagementVariation2,
  EngagementVariation3,
  EngagementVariation4,
  EngagementVariation5,
  // Story Narrative variations
  StoryNarrativeVariation1,
  StoryNarrativeVariation2,
  StoryNarrativeVariation3,
  StoryNarrativeVariation4,
  StoryNarrativeVariation5,
} from "./templates";

/* ─── Types ──────────────────────────────────────────────────────────── */

interface AssetsTabProps {
  trackers: CampaignTracker[];
  statuses: Record<string, { total: number; complete: number; status: string }>;
  assets: Record<string, CampaignAsset[]>;
  progress: number;
  isPolling: boolean;
}

/* ─── Progress Header ────────────────────────────────────────────────── */

function ProgressHeader({ progress, isPolling, totalAssets, totalJobs }: {
  progress: number;
  isPolling: boolean;
  totalAssets: number;
  totalJobs: number;
}) {
  const isComplete = progress === 100 && !isPolling;

  return (
    <Box
      bg={isComplete ? "#F0FDF4" : "white"}
      border="1px solid"
      borderColor={isComplete ? "#BBF7D0" : "#E5E7EB"}
      borderRadius="20px"
      p={{ base: 5, md: 6 }}
    >
      <Flex align="center" gap={4}>
        <Flex
          w="56px" h="56px" borderRadius="full" position="relative"
          align="center" justify="center" flexShrink={0}
          bg={isComplete ? "#DCFCE7" : "#F3F4F6"}
        >
          <svg width="56" height="56" viewBox="0 0 56 56" style={{ position: "absolute", transform: "rotate(-90deg)" }}>
            <circle cx="28" cy="28" r="24" fill="none" stroke={isComplete ? "#BBF7D0" : "#E5E7EB"} strokeWidth="4" />
            <circle
              cx="28" cy="28" r="24" fill="none"
              stroke={isComplete ? "#22C55E" : "#4F46E5"}
              strokeWidth="4"
              strokeDasharray={`${2 * Math.PI * 24}`}
              strokeDashoffset={`${2 * Math.PI * 24 * (1 - progress / 100)}`}
              strokeLinecap="round"
              style={{ transition: "stroke-dashoffset 0.6s ease" }}
            />
          </svg>
          <Text fontSize="14px" fontWeight="700" color={isComplete ? "#166534" : "#4F46E5"}>
            {progress}%
          </Text>
        </Flex>

        <Box flex="1">
          <Flex align="center" gap={2}>
            <Text fontSize="18px" fontWeight="700" color="#111">
              {isComplete ? "All Assets Ready" : "Generating Assets"}
            </Text>
            {isPolling && (
              <Loader size={16} color="#4F46E5" style={{ animation: "spin 1.5s linear infinite" }} />
            )}
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
            <Box
              bg={isComplete
                ? "linear-gradient(90deg, #22C55E 0%, #16A34A 100%)"
                : "linear-gradient(90deg, #4F46E5 0%, #7C3AED 100%)"}
              h="100%"
              borderRadius="999px"
              w={`${progress}%`}
              transition="width 0.6s ease"
            />
          </Box>
          <Text fontSize="12px" color="#9CA3AF" mt={1} textAlign="right">
            {totalAssets} / {totalJobs}
          </Text>
        </Box>
      </Flex>
    </Box>
  );
}

/* ─── Skeleton Card ──────────────────────────────────────────────────── */

function SkeletonCard() {
  return (
    <Box
      border="1px solid" borderColor="#F3F4F6" borderRadius="18px"
      overflow="hidden" bg="white"
    >
      <Box bg="#F3F4F6" position="relative" style={{ aspectRatio: "4/5" }}>
        <Flex
          position="absolute" inset={0} align="center" justify="center"
          bg="linear-gradient(135deg, #F9FAFB 25%, #F3F4F6 50%, #F9FAFB 75%)"
          backgroundSize="400% 400%"
          style={{ animation: "shimmer 1.8s ease-in-out infinite" }}
        >
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

/* ─── Asset Card — Dispatcher ────────────────────────────────────────── */

function AssetCard({ asset }: { asset: CampaignAsset }) {
  const [showPrompt, setShowPrompt] = useState(false);
  const vd = asset.variation_data as Record<string, string>;
  const primary = vd.primary_color || "#4F46E5";
  const secondary = vd.secondary_color || "#1E1B4B";
  const accent = vd.accent_color || "#7C3AED";
  const templateProps: TemplateProps = { vd, imageUrl: asset.image_url, primary, secondary, accent };

  // Get variation index (1-5) to select the correct template variation
  const variationIndex = asset.variation_index || 1;

  // Select template based on ad type AND variation index
  const TemplateComponent = (() => {
    switch (asset.ad_type) {
      case "sale":
        switch (variationIndex) {
          case 1: return SaleVariation1;
          case 2: return SaleVariation2;
          case 3: return SaleVariation3;
          case 4: return SaleVariation4;
          case 5: return SaleVariation5;
          default: return SaleVariation1;
        }
      case "launch":
        switch (variationIndex) {
          case 1: return LaunchVariation1;
          case 2: return LaunchVariation2;
          case 3: return LaunchVariation3;
          case 4: return LaunchVariation4;
          case 5: return LaunchVariation5;
          default: return LaunchVariation1;
        }
      case "story_narrative":
        switch (variationIndex) {
          case 1: return StoryNarrativeVariation1;
          case 2: return StoryNarrativeVariation2;
          case 3: return StoryNarrativeVariation3;
          case 4: return StoryNarrativeVariation4;
          case 5: return StoryNarrativeVariation5;
          default: return StoryNarrativeVariation1;
        }
      case "engagement":
        switch (variationIndex) {
          case 1: return EngagementVariation1;
          case 2: return EngagementVariation2;
          case 3: return EngagementVariation3;
          case 4: return EngagementVariation4;
          case 5: return EngagementVariation5;
          default: return EngagementVariation1;
        }
      case "awareness":
      default:
        switch (variationIndex) {
          case 1: return AwarenessVariation1;
          case 2: return AwarenessVariation2;
          case 3: return AwarenessVariation3;
          case 4: return AwarenessVariation4;
          case 5: return AwarenessVariation5;
          default: return AwarenessVariation1;
        }
    }
  })();

  return (
    <Box
      borderRadius="18px" overflow="hidden" bg="white"
      border="1px solid" borderColor="#ECECEC"
      transition="all 0.3s ease"
      _hover={{ boxShadow: "0 16px 48px rgba(0,0,0,0.1)", transform: "translateY(-3px)" }}
      style={{ animation: "fadeInUp 0.4s ease-out" }}
    >
      {/* Creative area — 4:5 Instagram ratio */}
      <Box position="relative" overflow="hidden" style={{ aspectRatio: "4/5" }}>
        {/* Template content */}
        <TemplateComponent {...templateProps} />

        {/* Badge row + Download — shared across all */}
        <Flex
          position="absolute" top={3} left={3} right={3}
          justify="space-between" align="center" zIndex={10}
        >
          <Badge
            bg="rgba(0,0,0,0.45)" color="white" backdropFilter="blur(4px)"
            borderRadius="8px" px={2.5} py={1} fontSize="10px" fontWeight="600"
            textTransform="capitalize"
          >
            {asset.ad_type?.replace("_", " ")}
          </Badge>
          {asset.image_url && (
            <Button
              size="xs" bg="rgba(255,255,255,0.15)" color="white" borderRadius="8px"
              backdropFilter="blur(4px)"
              _hover={{ bg: "rgba(255,255,255,0.3)" }}
              h="28px" w="28px" p={0} minW="28px"
              onClick={async (e) => {
                e.stopPropagation();
                if (!asset.image_url) return;
                try {
                  const res = await fetch(asset.image_url);
                  const blob = await res.blob();
                  const url = URL.createObjectURL(blob);
                  const a = document.createElement("a");
                  a.href = url;
                  a.download = `${asset.variation_id || "ad"}.webp`;
                  document.body.appendChild(a);
                  a.click();
                  document.body.removeChild(a);
                  URL.revokeObjectURL(url);
                } catch {
                  window.open(asset.image_url, "_blank");
                }
              }}
            >
              <Download size={13} />
            </Button>
          )}
        </Flex>

        {/* Processing overlay when no image */}
        {!asset.image_url && (
          <Flex position="absolute" inset={0} align="center" justify="center" zIndex={5}>
            <VStack gap={1}>
              <Loader size={24} color="white" style={{ animation: "spin 1.5s linear infinite" }} />
              <Text fontSize="12px" color="rgba(255,255,255,0.7)">Generating image...</Text>
            </VStack>
          </Flex>
        )}
      </Box>

      {/* Footer: color chips + prompt toggle */}
      <Box p={3.5}>
        <Flex align="center" justify="space-between">
          <Flex gap={1.5}>
            {[primary, secondary, accent].map((c, i) => (
              <Box key={i} w="16px" h="16px" borderRadius="4px" bg={c} border="1px solid" borderColor="#E5E7EB" />
            ))}
          </Flex>
          <Button
            variant="ghost" size="xs"
            fontSize="11px" color="#9CA3AF" h="26px" px={2}
            _hover={{ color: "#6B7280", bg: "#F9FAFB" }}
            onClick={() => setShowPrompt(!showPrompt)}
          >
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

/* ─── Main Component ─────────────────────────────────────────────────── */

export default function AssetsTab({ trackers, statuses, assets, progress, isPolling }: AssetsTabProps) {
  const allAssets = trackers.flatMap((t) => assets[t.campaignId] || []);
  const totalJobs = Object.values(statuses).reduce((sum, s) => sum + s.total, 0);
  const pendingCount = totalJobs - allAssets.length;

  if (trackers.length === 0) {
    return (
      <Flex
        direction="column" align="center" justify="center"
        bg="white" border="1px solid" borderColor="#ECECEC" borderRadius="24px"
        p={{ base: 8, md: 16 }} textAlign="center" minH="400px"
      >
        <Flex
          w="64px" h="64px" borderRadius="16px" bg="#F3F4F6"
          align="center" justify="center" mb={4}
        >
          <ImageIcon size={28} color="#D1D5DB" />
        </Flex>
        <Text fontSize="xl" fontWeight="700" color="#111" mb={2}>
          No Assets Yet
        </Text>
        <Text fontSize="15px" color="#6B7280" maxW="400px">
          Go to the Content tab, select your contexts and templates, then hit Generate. Your ads will be created in the background — feel free to grab a coffee while you wait.
        </Text>
      </Flex>
    );
  }

  return (
    <VStack align="stretch" gap={6}>
      <Flex align="center" justify="space-between">
        <Box>
          <Text fontSize={{ base: "3xl", md: "4xl" }} fontWeight="700" color="#111" lineHeight="1.05" mb={1}>
            Assets
          </Text>
          <Text fontSize="15px" color="#6B7280">
            Your generated ad creatives appear here in real-time.
          </Text>
        </Box>
        {allAssets.length > 0 && (
          <Badge bg="#EEF2FF" color="#4338CA" px={3} py={2} borderRadius="999px" fontSize="14px">
            {allAssets.length} {allAssets.length === 1 ? "asset" : "assets"}
          </Badge>
        )}
      </Flex>

      <ProgressHeader
        progress={progress}
        isPolling={isPolling}
        totalAssets={allAssets.length}
        totalJobs={totalJobs}
      />

      <Box
        display="grid"
        gridTemplateColumns={{ base: "1fr", sm: "repeat(2, 1fr)", lg: "repeat(3, 1fr)", xl: "repeat(4, 1fr)" }}
        gap={5}
      >
        {allAssets.map((asset) => (
          <AssetCard key={asset.variation_id} asset={asset} />
        ))}

        {isPolling && Array.from({ length: Math.min(pendingCount, 8) }).map((_, i) => (
          <SkeletonCard key={`skeleton-${i}`} />
        ))}
      </Box>

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
    </VStack>
  );
}
