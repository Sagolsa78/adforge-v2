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
} from "@chakra-ui/react";
import {
  BadgeCheck,
  Megaphone,
  Rocket,
  Sparkles,
  Tags,
} from "lucide-react";
import { generateAdVariations } from "@/api";
import { useCampaignPolling } from "@/hooks/useCampaignPolling";
import type { ContextBlock } from "@/types/onboarding.types";
import type { LucideIcon } from "lucide-react";

/* ─── Types ──────────────────────────────────────────────────────────── */

interface TemplateOption {
  id: string;
  label: string;
  description: string;
  icon: LucideIcon;
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
  campaign: ReturnType<typeof useCampaignPolling>;
  onNavigateToAssets: () => void;
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

/* ─── Main Component ─────────────────────────────────────────────────── */

export default function ContentTab({ brand, contextBlocks, token, campaign, onNavigateToAssets }: ContentTabProps) {
  const [selectedContextIds, setSelectedContextIds] = useState<number[]>([]);
  const [selectedTemplateIds, setSelectedTemplateIds] = useState<string[]>(["awareness"]);
  const [contentBrief, setContentBrief] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [contentError, setContentError] = useState<string | null>(null);

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
    setContentError(null);
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

  const handleGenerateContent = () => {
    if (!brand || !token || selectedContextIds.length === 0 || selectedTemplateIds.length === 0) return;

    setIsGenerating(true);
    setContentError(null);
    campaign.clearCampaigns();

    // Navigate to assets page INSTANTLY
    onNavigateToAssets();

    // Fire all API calls in the background (don't await)
    const calls = selectedContextIds.flatMap((contextIndex) =>
      selectedTemplateIds.map(async (templateId) => {
        const template = CONTENT_TEMPLATE_OPTIONS.find((o) => o.id === templateId);
        const contextBlock = contextBlocks.find((b) => b.context_index === contextIndex);
        if (!contextBlock) return;

        try {
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

          campaign.addCampaign({
            campaignId: response.campaign_id,
            contextIndex: contextBlock.context_index,
            contextTitle: contextBlock.title,
            templateId,
            templateLabel: template?.label || templateId,
          });
        } catch (error) {
          const apiError = error as { message?: string };
          setContentError(apiError.message || "Failed to generate content variations.");
        }
      })
    );

    Promise.all(calls).finally(() => setIsGenerating(false));
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
    </VStack>
  );
}
