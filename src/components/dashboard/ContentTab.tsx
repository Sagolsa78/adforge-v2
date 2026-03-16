"use client";

import { useEffect, useMemo, useState } from "react";
import {
  Badge,
  Box,
  Button,
  Flex,
  Text,
  Textarea,
  VStack,
  Image,
} from "@chakra-ui/react";
import {
  BadgeCheck,
  ChevronDown,
  ChevronUp,
  ImageIcon,
  Megaphone,
  Rocket,
  Sparkles,
  Tags,
} from "lucide-react";
import { generateAdVariations } from "@/api";
import { useCampaignPolling } from "@/hooks/useCampaignPolling";
import type {
  AdVariation,
  CampaignAsset,
  ContextBlock,
  RenderedAd,
} from "@/types/onboarding.types";
import type { LucideIcon } from "lucide-react";

/* ─── Types ──────────────────────────────────────────────────────────── */

interface TemplateOption {
  id: string;
  label: string;
  description: string;
  icon: LucideIcon;
}

interface GeneratedTemplateBatch {
  campaignId: string;
  contextIndex: number;
  contextTitle: string;
  templateId: string;
  templateLabel: string;
  variations: RenderedAd[];
}

interface ContentTabBrand {
  id: string;
  name: string;
  industry: string | null;
}

interface ContentTabProps {
  brand: ContentTabBrand | null;
  contextBlocks: ContextBlock[];
  token?: string;
}

/* ─── Constants ──────────────────────────────────────────────────────── */

const CONTENT_TEMPLATE_OPTIONS: TemplateOption[] = [
  { id: "awareness", label: "Awareness", description: "Top-of-funnel concepts for reach and recall.", icon: Megaphone },
  { id: "sale", label: "Sales / Offer", description: "Direct-response angles with clear conversion intent.", icon: Tags },
  { id: "launch", label: "Launch", description: "New product or campaign momentum creatives.", icon: Rocket },
  { id: "story_narrative", label: "Story / Narrative", description: "Brand story and origin-driven creatives.", icon: BadgeCheck },
  { id: "engagement", label: "Engagement", description: "Interactive hooks designed to start response.", icon: Sparkles },
];

/* ─── Helpers ────────────────────────────────────────────────────────── */

function getContextTags(block: { title: string; content: string }, industry: string | null): string[] {
  const baseTags = industry ? [industry] : [];
  const keywordMap = [
    { label: "Employer Branding", keywords: ["employee", "team", "culture", "retention", "workforce"] },
    { label: "Compliance", keywords: ["compliance", "certificate", "reporting", "esg"] },
    { label: "B2B Culture", keywords: ["b2b", "corporate", "business"] },
    { label: "Sustainability", keywords: ["sustainability", "environmental", "eco", "carbon"] },
    { label: "Community", keywords: ["community", "movement", "participation"] },
    { label: "Innovation", keywords: ["innovation", "design", "technology"] },
    { label: "Data-Driven", keywords: ["data", "measurable", "analytics", "dashboard"] },
  ];
  const source = `${block.title} ${block.content}`.toLowerCase();
  const derivedTags = keywordMap
    .filter((tag) => tag.keywords.some((keyword) => source.includes(keyword)))
    .slice(0, 2)
    .map((tag) => tag.label);
  return [...baseTags, ...derivedTags].slice(0, 2);
}

/* ─── Sub-components ─────────────────────────────────────────────────── */

function ProgressBar({ value, label }: { value: number; label: string }) {
  return (
    <Box>
      <Flex justify="space-between" mb={1.5}>
        <Text fontSize="13px" color="#6B7280" fontWeight="500">{label}</Text>
        <Text fontSize="13px" color="#4F46E5" fontWeight="600">{value}%</Text>
      </Flex>
      <Box bg="#F3F4F6" borderRadius="999px" h="8px" overflow="hidden">
        <Box
          bg="linear-gradient(90deg, #4F46E5 0%, #7C3AED 100%)"
          h="100%"
          borderRadius="999px"
          w={`${value}%`}
          transition="width 0.6s ease"
        />
      </Box>
    </Box>
  );
}

function CampaignProgressPanel({
  statuses,
  trackers,
  progress,
}: {
  statuses: Record<string, { total: number; complete: number; status: string; by_context: Record<string, { complete: number; total: number }> }>;
  trackers: { campaignId: string; contextTitle: string; templateLabel: string }[];
  progress: number;
}) {
  const allComplete = progress === 100;
  return (
    <Box
      bg={allComplete ? "#F0FDF4" : "white"}
      border="1px solid"
      borderColor={allComplete ? "#BBF7D0" : "#E5E7EB"}
      borderRadius="20px"
      p={{ base: 5, md: 6 }}
    >
      <Flex align="center" gap={3} mb={4}>
        <Flex
          w="36px" h="36px" borderRadius="10px"
          bg={allComplete ? "#DCFCE7" : "#EEF2FF"}
          align="center" justify="center"
        >
          {allComplete ? (
            <Text fontSize="16px">&#10003;</Text>
          ) : (
            <ImageIcon size={16} color="#4F46E5" />
          )}
        </Flex>
        <Box>
          <Text fontSize="16px" fontWeight="600" color="#111111">
            {allComplete ? "Images Ready" : "Generating Images..."}
          </Text>
          <Text fontSize="13px" color="#6B7280">
            {allComplete
              ? "All ad images have been generated and uploaded."
              : "Background image generation in progress. You can keep working."}
          </Text>
        </Box>
      </Flex>

      <ProgressBar value={progress} label="Overall Progress" />

      <Box mt={4} display="grid" gridTemplateColumns="repeat(auto-fill, minmax(200px, 1fr))" gap={3}>
        {trackers.map((t) => {
          const status = statuses[t.campaignId];
          if (!status) return null;
          const pct = status.total > 0 ? Math.round((status.complete / status.total) * 100) : 0;
          return (
            <Flex
              key={t.campaignId}
              bg="#F9FAFB" border="1px solid" borderColor="#F3F4F6"
              borderRadius="12px" px={3} py={2.5} align="center" gap={2}
            >
              <Box flex="1" minW={0}>
                <Text fontSize="12px" fontWeight="600" color="#111" truncate>
                  {t.contextTitle}
                </Text>
                <Text fontSize="11px" color="#9CA3AF">{t.templateLabel}</Text>
              </Box>
              <Badge
                bg={pct === 100 ? "#DCFCE7" : "#EEF2FF"}
                color={pct === 100 ? "#166534" : "#4338CA"}
                borderRadius="8px" px={2} py={0.5} fontSize="11px"
              >
                {status.complete}/{status.total}
              </Badge>
            </Flex>
          );
        })}
      </Box>
    </Box>
  );
}

function AssetCard({ asset }: { asset: CampaignAsset }) {
  const [expanded, setExpanded] = useState(false);
  const vd = asset.variation_data as Record<string, string>;

  return (
    <Box
      border="1px solid" borderColor="#ECECEC" borderRadius="18px"
      overflow="hidden" bg="white" transition="all 0.2s ease"
      _hover={{ boxShadow: "0 8px 32px rgba(0,0,0,0.06)" }}
    >
      {asset.image_url ? (
        <Box position="relative" bg="#F3F4F6">
          <Image
            src={asset.image_url}
            alt={vd.headline || "Ad image"}
            w="100%"
            h="220px"
            objectFit="cover"
          />
          <Badge
            position="absolute" top={3} right={3}
            bg="rgba(0,0,0,0.6)" color="white"
            borderRadius="8px" px={2} py={0.5} fontSize="10px"
          >
            {asset.ad_type}
          </Badge>
        </Box>
      ) : (
        <Flex h="120px" bg="#F9FAFB" align="center" justify="center">
          <ImageIcon size={24} color="#D1D5DB" />
        </Flex>
      )}

      <Box p={4}>
        <Text fontSize="15px" fontWeight="700" color="#111" mb={1} lineClamp={2}>
          {vd.headline || "Untitled"}
        </Text>
        {vd.subheadline && (
          <Text fontSize="13px" fontWeight="500" color="#4F46E5" mb={2}>
            {vd.subheadline}
          </Text>
        )}

        {expanded && (
          <Box mt={2}>
            {vd.body_text && (
              <Text fontSize="13px" color="#5B6472" mb={2}>{vd.body_text}</Text>
            )}
            {vd.cta_text && (
              <Badge bg="#EEF2FF" color="#4338CA" borderRadius="8px" px={2.5} py={1} fontSize="12px">
                {vd.cta_text}
              </Badge>
            )}
            {(vd.primary_color || vd.secondary_color || vd.accent_color) && (
              <Flex gap={2} mt={3}>
                {[vd.primary_color, vd.secondary_color, vd.accent_color]
                  .filter(Boolean)
                  .map((c, i) => (
                    <Box key={i} w="24px" h="24px" borderRadius="6px" bg={c} border="1px solid" borderColor="#E5E7EB" />
                  ))}
              </Flex>
            )}
          </Box>
        )}

        <Button
          variant="ghost" size="sm" w="100%" mt={2}
          fontSize="12px" color="#6B7280"
          onClick={() => setExpanded(!expanded)}
        >
          {expanded ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
          <Text ml={1}>{expanded ? "Less" : "More"}</Text>
        </Button>
      </Box>
    </Box>
  );
}

function AssetGallery({
  assets,
  trackers,
}: {
  assets: Record<string, CampaignAsset[]>;
  trackers: { campaignId: string; contextTitle: string; templateLabel: string }[];
}) {
  const allAssets = trackers.flatMap((t) => {
    const campaignAssets = assets[t.campaignId] || [];
    return campaignAssets.map((a) => ({
      ...a,
      contextTitle: t.contextTitle,
      templateLabel: t.templateLabel,
    }));
  });

  if (allAssets.length === 0) return null;

  return (
    <Box>
      <Flex align="center" justify="space-between" mb={4}>
        <Text fontSize="20px" fontWeight="600" color="#111">
          Generated Assets
        </Text>
        <Badge bg="#EEF2FF" color="#4338CA" px={3} py={1.5} borderRadius="999px">
          {allAssets.length} images
        </Badge>
      </Flex>
      <Box
        display="grid"
        gridTemplateColumns={{ base: "1fr", sm: "repeat(2, 1fr)", lg: "repeat(3, 1fr)", xl: "repeat(4, 1fr)" }}
        gap={5}
      >
        {allAssets.map((asset) => (
          <AssetCard key={asset.variation_id} asset={asset} />
        ))}
      </Box>
    </Box>
  );
}

/* ─── Main Component ─────────────────────────────────────────────────── */

export default function ContentTab({ brand, contextBlocks, token }: ContentTabProps) {
  const [selectedContextIds, setSelectedContextIds] = useState<number[]>([]);
  const [selectedTemplateIds, setSelectedTemplateIds] = useState<string[]>(["awareness"]);
  const [contentBrief, setContentBrief] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [contentError, setContentError] = useState<string | null>(null);
  const [generatedTemplateBatches, setGeneratedTemplateBatches] = useState<GeneratedTemplateBatch[]>([]);

  const campaign = useCampaignPolling(token);

  const totalPosts = useMemo(
    () => selectedContextIds.length * selectedTemplateIds.length * 5,
    [selectedContextIds, selectedTemplateIds]
  );

  useEffect(() => {
    if (contextBlocks.length === 0) {
      setSelectedContextIds([]);
      return;
    }
    setSelectedContextIds(contextBlocks.slice(0, 2).map((block) => block.context_index));
    setGeneratedTemplateBatches([]);
    setContentError(null);
    campaign.clearCampaigns();
  }, [contextBlocks]);

  const fieldChrome = {
    bg: "white",
    border: "1px solid",
    borderColor: "#D8DDE6",
    borderRadius: "16px",
    fontSize: "15px",
    color: "#111111",
    transition: "all 0.18s ease",
    _placeholder: { color: "#9CA3AF" },
    _hover: { borderColor: "#C5CCD8" },
    _focusVisible: { borderColor: "#4F46E5", boxShadow: "0 0 0 4px rgba(79, 70, 229, 0.14)" },
  } as const;

  const toggleContext = (contextIndex: number) => {
    setSelectedContextIds((prev) =>
      prev.includes(contextIndex)
        ? prev.filter((id) => id !== contextIndex)
        : [...prev, contextIndex].sort((a, b) => a - b)
    );
  };

  const toggleTemplate = (templateId: string) => {
    setSelectedTemplateIds((prev) =>
      prev.includes(templateId) ? prev.filter((id) => id !== templateId) : [...prev, templateId]
    );
  };

  const handleGenerateContent = async () => {
    if (!brand || !token || selectedContextIds.length === 0 || selectedTemplateIds.length === 0) return;

    setIsGenerating(true);
    setContentError(null);
    campaign.clearCampaigns();

    try {
      const responses = await Promise.all(
        selectedContextIds.flatMap((contextIndex) =>
          selectedTemplateIds.map(async (templateId) => {
            const template = CONTENT_TEMPLATE_OPTIONS.find((o) => o.id === templateId);
            const contextBlock = contextBlocks.find((b) => b.context_index === contextIndex);
            if (!contextBlock) return null;

            const response = await generateAdVariations(
              brand.id,
              {
                context_index: contextBlock.context_index,
                user_brief: contentBrief.trim()
                  ? `${contentBrief.trim()}\n\nFocus context: ${contextBlock.title}\nTemplate: ${template?.label || templateId}`
                  : `Generate ${template?.label || templateId} variations for the context "${contextBlock.title}".`,
                ad_type: templateId,
              },
              token
            );

            // Track this campaign for polling
            campaign.addCampaign({
              campaignId: response.campaign_id,
              contextIndex: contextBlock.context_index,
              contextTitle: contextBlock.title,
              templateId,
              templateLabel: template?.label || templateId,
            });

            return {
              campaignId: response.campaign_id,
              contextIndex: contextBlock.context_index,
              contextTitle: contextBlock.title,
              templateId,
              templateLabel: template?.label || templateId,
              variations: response.variations_data,
            } satisfies GeneratedTemplateBatch;
          })
        )
      );

      setGeneratedTemplateBatches(responses.filter(Boolean) as GeneratedTemplateBatch[]);
    } catch (error) {
      const apiError = error as { message?: string };
      setContentError(apiError.message || "Failed to generate content variations.");
    } finally {
      setIsGenerating(false);
    }
  };

  if (!brand) {
    return (
      <Box bg="white" border="1px solid" borderColor="#ECECEC" borderRadius="24px" p={{ base: 6, md: 10 }} textAlign="center">
        <Text fontSize="lg" color="#6B7280">
          Select a brand first to use the Content tab.
        </Text>
      </Box>
    );
  }

  const hasAssets = Object.keys(campaign.assets).length > 0;

  return (
    <VStack align="stretch" gap={6}>
      {/* Header */}
      <Flex align={{ base: "flex-start", md: "center" }} justify="space-between" direction={{ base: "column", md: "row" }} gap={4}>
        <Box>
          <Text fontSize={{ base: "3xl", md: "4xl" }} fontWeight="700" color="#111111" lineHeight="1.05" mb={2}>
            Content Generation
          </Text>
          <Text fontSize="15px" color="#6B7280">
            Select your approved contexts and pair them with content formats to generate posts.
          </Text>
        </Box>
        <Badge bg="#EEF2FF" color="#4338CA" px={3} py={2} borderRadius="999px">
          {brand.name} &middot; Active Brand
        </Badge>
      </Flex>

      {/* Step 1: Contexts */}
      <Box mb={10}>
        <Text fontSize="20px" fontWeight="600" color="#111111" mb={2}>1. Select Contexts</Text>
        <Text fontSize="15px" color="#6B7280" mb={6}>Choose the narrative angles you want to turn into posts.</Text>
        <Box display="grid" gridTemplateColumns={{ base: "1fr", md: "repeat(2, 1fr)", xl: "repeat(5, 1fr)" }} gap={5}>
          {contextBlocks.map((block) => {
            const isSelected = selectedContextIds.includes(block.context_index);
            const tags = getContextTags(block, brand.industry);
            const primaryTag = tags[0] || "Context";
            return (
              <Box
                key={block.context_index}
                bg={isSelected ? "#EEF2FF" : "white"}
                border="2px solid" borderColor={isSelected ? "#4F46E5" : "#ECECEC"}
                borderRadius="14px" p={5} cursor="pointer" position="relative"
                transition="all 0.2s ease"
                _hover={{ borderColor: "#D1D5DB", boxShadow: "0 8px 32px rgba(0, 0, 0, 0.06)" }}
                onClick={() => toggleContext(block.context_index)}
              >
                <Flex
                  position="absolute" top="16px" right="16px"
                  w="20px" h="20px" borderRadius="full" border="2px solid"
                  borderColor={isSelected ? "#4F46E5" : "#D1D5DB"}
                  bg={isSelected ? "#4F46E5" : "transparent"}
                  color="white" align="center" justify="center"
                >
                  {isSelected ? <Text fontSize="10px">&#10003;</Text> : null}
                </Flex>
                <Badge bg="white" border="1px solid" borderColor="#ECECEC" color="#6B7280" borderRadius="12px" px={2.5} py={1} mb={3}>
                  {primaryTag}
                </Badge>
                <Text fontSize="14px" fontWeight="600" color="#111111" pr={6} mb={2}>
                  {block.title}
                </Text>
              </Box>
            );
          })}
        </Box>
      </Box>

      {/* Step 2: Templates */}
      <Box mb={6}>
        <Text fontSize="20px" fontWeight="600" color="#111111" mb={2}>2. Select Templates</Text>
        <Text fontSize="15px" color="#6B7280" mb={6}>Choose the formats to apply to your selected contexts.</Text>
        <Box display="grid" gridTemplateColumns={{ base: "1fr", md: "repeat(2, 1fr)", xl: "repeat(5, 1fr)" }} gap={5}>
          {CONTENT_TEMPLATE_OPTIONS.map((template) => {
            const isSelected = selectedTemplateIds.includes(template.id);
            const TemplateIcon = template.icon;
            return (
              <Box
                key={template.id}
                bg={isSelected ? "#EEF2FF" : "white"}
                border="2px solid" borderColor={isSelected ? "#4F46E5" : "#ECECEC"}
                borderRadius="14px" p={5} cursor="pointer" position="relative"
                transition="all 0.2s ease"
                _hover={{ borderColor: "#D1D5DB", boxShadow: "0 8px 32px rgba(0, 0, 0, 0.06)" }}
                onClick={() => toggleTemplate(template.id)}
              >
                <Flex
                  position="absolute" top="16px" right="16px"
                  w="20px" h="20px" borderRadius="full" border="2px solid"
                  borderColor={isSelected ? "#4F46E5" : "#D1D5DB"}
                  bg={isSelected ? "#4F46E5" : "transparent"}
                  color="white" align="center" justify="center"
                >
                  {isSelected ? <Text fontSize="10px">&#10003;</Text> : null}
                </Flex>
                <Flex
                  w="40px" h="40px" bg={isSelected ? "white" : "#F8F8F6"}
                  borderRadius="12px" mb={4} align="center" justify="center"
                  color={isSelected ? "#4F46E5" : "#6B7280"}
                >
                  <TemplateIcon size={18} strokeWidth={2.1} />
                </Flex>
                <Text fontSize="16px" fontWeight="600" color="#111111" mb={1.5}>{template.label}</Text>
                <Text fontSize="13px" color="#6B7280" lineHeight="1.4">{template.description}</Text>
              </Box>
            );
          })}
        </Box>
      </Box>

      {/* Brief */}
      <Box mb={8}>
        <Text fontSize="12px" fontWeight="600" textTransform="uppercase" color="#6B7280" letterSpacing="0.05em" mb={3}>
          Brief
        </Text>
        <Textarea
          placeholder="Optional. Add campaign instructions before generating variations."
          value={contentBrief}
          onChange={(event) => setContentBrief(event.target.value)}
          minH="110px" px="16px" py="14px" resize="vertical"
          {...fieldChrome}
        />
      </Box>

      {/* Sticky Generate Bar */}
      <Box
        position="sticky" bottom={{ base: 2, md: 4 }}
        bg="rgba(255, 255, 255, 0.9)" backdropFilter="blur(12px)"
        border="1px solid" borderColor="#ECECEC" borderRadius="20px"
        px={{ base: 4, md: 6 }} py={4}
      >
        <Flex align={{ base: "stretch", md: "center" }} justify="space-between" direction={{ base: "column", md: "row" }} gap={4}>
          <Flex align="center" gap={4} bg="#F8F8F6" border="1px solid" borderColor="#ECECEC" borderRadius="20px" px={5} py={3} wrap="wrap">
            <Box textAlign="center">
              <Text fontSize="18px" fontWeight="700" color="#111111">{selectedContextIds.length}</Text>
              <Text fontSize="12px" color="#6B7280" textTransform="uppercase">Contexts</Text>
            </Box>
            <Text color="#9CA3AF">&times;</Text>
            <Box textAlign="center">
              <Text fontSize="18px" fontWeight="700" color="#111111">{selectedTemplateIds.length}</Text>
              <Text fontSize="12px" color="#6B7280" textTransform="uppercase">Templates</Text>
            </Box>
            <Text color="#9CA3AF">&times;</Text>
            <Box textAlign="center">
              <Text fontSize="18px" fontWeight="700" color="#111111">5</Text>
              <Text fontSize="12px" color="#6B7280" textTransform="uppercase">Variations</Text>
            </Box>
            <Text color="#9CA3AF">=</Text>
            <Box textAlign="center">
              <Text fontSize="18px" fontWeight="700" color="#4F46E5">{totalPosts}</Text>
              <Text fontSize="12px" color="#4F46E5" textTransform="uppercase">Total Posts</Text>
            </Box>
          </Flex>

          <Button
            bg="#4F46E5" color="white" borderRadius="14px" h="52px" px={7}
            fontSize="15px" fontWeight="600"
            _hover={{ bg: "#4338CA" }}
            disabled={selectedContextIds.length === 0 || selectedTemplateIds.length === 0 || isGenerating}
            onClick={handleGenerateContent}
          >
            {isGenerating ? "Generating..." : totalPosts === 0 ? "Select to Generate" : `Generate ${totalPosts} Posts`}
          </Button>
        </Flex>
      </Box>

      {/* Error */}
      {contentError && (
        <Box mt={4} bg="red.50" border="1px solid" borderColor="red.200" color="red.600" fontSize="sm" borderRadius="14px" p={4}>
          {contentError}
        </Box>
      )}

      {/* Campaign Progress */}
      {campaign.trackers.length > 0 && (
        <CampaignProgressPanel
          statuses={campaign.statuses}
          trackers={campaign.trackers}
          progress={campaign.progress}
        />
      )}

      {/* Asset Gallery (appears when images are ready) */}
      {hasAssets && (
        <AssetGallery assets={campaign.assets} trackers={campaign.trackers} />
      )}

      {/* LLM text variations (shown immediately) */}
      {generatedTemplateBatches.length > 0 && (
        <VStack align="stretch" gap={5}>
          <Text fontSize="20px" fontWeight="600" color="#111">Ad Copy</Text>
          {generatedTemplateBatches.map((batch) => (
            <Box key={`${batch.contextIndex}-${batch.templateId}`} bg="white" border="1px solid" borderColor="#ECECEC" borderRadius="24px" p={{ base: 5, md: 8 }}>
              <Flex align={{ base: "flex-start", md: "center" }} justify="space-between" direction={{ base: "column", md: "row" }} gap={3} mb={5}>
                <Box>
                  <Text fontSize="xl" fontWeight="700" color="#111111">{batch.contextTitle}</Text>
                  <Text fontSize="14px" color="#6B7280">{batch.templateLabel}</Text>
                </Box>
                <Badge bg="#ECFDF5" color="#166534" px={3} py={1.5} borderRadius="999px">
                  {batch.variations.length} variations
                </Badge>
              </Flex>
              <VStack align="stretch" gap={4}>
                {batch.variations.map((renderedAd: RenderedAd, index: number) => (
                  <Box key={`${batch.templateId}-${index}`} border="1px solid" borderColor="#ECECEC" borderRadius="18px" p={4} bg="#FAFAFA">
                    <Text fontSize="16px" fontWeight="700" color="#111111" mb={1}>{renderedAd.variation.headline}</Text>
                    <Text fontSize="14px" fontWeight="600" color="#4F46E5" mb={2}>{renderedAd.variation.subheadline}</Text>
                    <Text fontSize="14px" color="#5B6472" mb={3}>{renderedAd.variation.body_text}</Text>
                    <Text fontSize="13px" fontWeight="700" color="#111111" mb={1}>CTA</Text>
                    <Text fontSize="14px" color="#5B6472">{renderedAd.variation.cta_text}</Text>
                  </Box>
                ))}
              </VStack>
            </Box>
          ))}
        </VStack>
      )}
    </VStack>
  );
}
