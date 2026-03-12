"use client";

import { useState, useCallback } from "react";
import { Box, Flex, Text, Button, HStack, VStack, SimpleGrid } from "@chakra-ui/react";
import { Star, Bookmark, Heart, Copy, ChevronDown, ChevronUp, ArrowRight, RotateCcw } from "lucide-react";
import { BrandContext } from "@/types/onboarding.types";

interface Props {
  url: string;
  ctx: BrandContext[];
  ratings: Record<number, number>;
  bm: Set<number>;
  likes: Set<number>;
  selCtx: number | null;
  onSelect: (id: number) => void;
  onRate: (id: number, stars: number) => void;
  onToggleBm: (id: number) => void;
  onToggleLike: (id: number) => void;
  onUseSelected: () => void;
  onNewAnalysis: () => void;
  onCopy: (text: string) => void;
}

const BADGE_COLORS = [
  { bg: "rgba(138,44,226,0.08)", text: "#8a2ce2", border: "rgba(138,44,226,0.2)" },
  { bg: "rgba(234,88,12,0.08)", text: "#ea580c", border: "rgba(234,88,12,0.2)" },
  { bg: "rgba(5,150,105,0.08)", text: "#059669", border: "rgba(5,150,105,0.2)" },
  { bg: "rgba(219,39,119,0.08)", text: "#db2777", border: "rgba(219,39,119,0.2)" },
  { bg: "rgba(79,70,229,0.08)", text: "#4f46e5", border: "rgba(79,70,229,0.2)" },
];

export default function ContextResults({
  url, ctx, ratings, bm, likes, selCtx,
  onSelect, onRate, onToggleBm, onToggleLike, onUseSelected, onNewAnalysis, onCopy,
}: Props) {
  const [view, setView] = useState<"list" | "grid">("list");
  const [expanded, setExpanded] = useState<Set<number>>(new Set());
  const [filter, setFilter] = useState<"all" | "fav" | "bm">("all");

  const toggle = useCallback((id: number) => {
    setExpanded((p) => {
      const n = new Set(p);
      if (n.has(id)) { n.delete(id); } else { n.add(id); }
      return n;
    });
  }, []);

  const filtered = ctx.filter((c) => {
    if (filter === "fav") return likes.has(c.id);
    if (filter === "bm") return bm.has(c.id);
    return true;
  });

  return (
    <Box w="full" px={4} py={8} minH="calc(100vh - 140px)" position="relative">
      {/* Background blobs */}
      <Box position="absolute" top="-10%" left="-5%" w="400px" h="400px" bg="#e0e7ff" rounded="full" filter="blur(80px)" opacity={0.3} pointerEvents="none" />
      <Box position="absolute" bottom="-10%" right="-5%" w="400px" h="400px" bg="#fae8ff" rounded="full" filter="blur(80px)" opacity={0.3} pointerEvents="none" />

      <Box maxW="1140px" mx="auto" position="relative" zIndex={1}>
        {/* Header */}
        <Flex align="flex-start" justify="space-between" gap={6} mb={6} flexWrap="wrap">
          <Box flex="1" minW="260px">
            <Button
              size="sm"
              variant="outline"
              rounded="full"
              mb={4}
              borderColor="gray.200"
              color="gray.700"
              fontWeight="bold"
              _hover={{ bg: "gray.50" }}
              onClick={onNewAnalysis}
              gap={2}
            >
              <Box as={RotateCcw} boxSize="12px" /> New Analysis
            </Button>
            <Text fontSize={{ base: "2xl", md: "3xl" }} fontWeight="black" letterSpacing="tight" color="#111827" mb={1}>
              Brand DNA <Text as="span" color="#8a2ce2">Results</Text>
            </Text>
            <Flex align="center" gap={3} flexWrap="wrap">
              <Text color="#6b7280" fontSize="13px" fontWeight="medium">{url}</Text>
              <Box
                display="inline-flex"
                alignItems="center"
                gap={1.5}
                bg="rgba(5,150,105,0.08)"
                border="1px solid"
                borderColor="rgba(5,150,105,0.2)"
                color="#059669"
                px={2.5}
                py={0.5}
                rounded="full"
                fontSize="11px"
                fontWeight="bold"
              >
                <Box w="5px" h="5px" rounded="full" bg="#059669" className="animate-pulse" />
                5 Contexts Generated
              </Box>
            </Flex>
          </Box>
          <Flex align="center" gap={5} flexWrap="wrap">
            <Box textAlign="center">
              <Text fontSize="10px" fontWeight="bold" color="#6b7280" textTransform="uppercase" letterSpacing="wider" mb={0.5}>Selected</Text>
              <Text fontSize="xl" fontWeight="black" color="#111827">{selCtx != null ? "1" : "—"}</Text>
            </Box>
            <Button
              bg="#8a2ce2"
              color="white"
              rounded="full"
              fontWeight="bold"
              px={6}
              disabled={selCtx === null}
              onClick={onUseSelected}
              boxShadow="0 4px 14px rgba(138,44,226,0.3)"
              _hover={{ bg: "#7c28cb", transform: "translateY(-1px)" }}
              _active={{ transform: "translateY(0)" }}
              transition="all 0.2s"
              gap={2}
            >
              Use Selected <Box as={ArrowRight} boxSize="14px" />
            </Button>
          </Flex>
        </Flex>

        {/* Filter bar */}
        <Flex
          align="center"
          justify="space-between"
          gap={3}
          mb={6}
          p={3}
          bg="white"
          border="1px solid"
          borderColor="gray.100"
          rounded="xl"
          boxShadow="0 1px 3px rgba(0,0,0,0.04)"
          flexWrap="wrap"
        >
          <Flex gap={2} flexWrap="wrap" align="center">
            <Text fontSize="10px" fontWeight="bold" color="#6b7280" textTransform="uppercase" letterSpacing="wider" mr={1}>Filter</Text>
            {(["all", "fav", "bm"] as const).map((f) => (
              <Button
                key={f}
                size="sm"
                rounded="full"
                bg={filter === f ? "#8a2ce2" : "transparent"}
                color={filter === f ? "white" : "#6b7280"}
                border="1px solid"
                borderColor={filter === f ? "#8a2ce2" : "gray.200"}
                fontWeight="semibold"
                fontSize="12px"
                _hover={{ bg: filter === f ? "#7c28cb" : "gray.50" }}
                onClick={() => setFilter(f)}
                px={4}
              >
                {f === "all" ? "All 5" : f === "fav" ? "⭐ Favourited" : "🔖 Bookmarked"}
              </Button>
            ))}
          </Flex>
          <Flex gap={2} align="center">
            <Text fontSize="10px" fontWeight="bold" color="#6b7280" textTransform="uppercase" letterSpacing="wider">View</Text>
            {(["list", "grid"] as const).map((v) => (
              <Button
                key={v}
                size="sm"
                w="30px"
                h="30px"
                p={0}
                minW="30px"
                rounded="lg"
                bg={view === v ? "#8a2ce2" : "white"}
                color={view === v ? "white" : "#6b7280"}
                border="1px solid"
                borderColor={view === v ? "#8a2ce2" : "gray.200"}
                _hover={{ bg: view === v ? "#7c28cb" : "gray.50" }}
                onClick={() => setView(v)}
              >
                {v === "list" ? (
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><line x1="3" y1="6" x2="21" y2="6" /><line x1="3" y1="12" x2="21" y2="12" /><line x1="3" y1="18" x2="21" y2="18" /></svg>
                ) : (
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><rect x="3" y="3" width="7" height="7" /><rect x="14" y="3" width="7" height="7" /><rect x="3" y="14" width="7" height="7" /><rect x="14" y="14" width="7" height="7" /></svg>
                )}
              </Button>
            ))}
          </Flex>
        </Flex>

        {/* Cards */}
        <SimpleGrid columns={view === "grid" ? { base: 1, md: 2 } : 1} gap={5} mb={8}>
          {filtered.map((c) => {
            const idx = c.id - 1;
            const isExp = expanded.has(c.id);
            const isSel = selCtx === c.id;
            const col = BADGE_COLORS[idx % 5];

            return (
              <Box
                key={c.id}
                bg="white"
                border={isSel ? "2px solid" : "1px solid"}
                borderColor={isSel ? "#8a2ce2" : "gray.100"}
                rounded="2xl"
                overflow="hidden"
                boxShadow={isSel ? "0 4px 20px rgba(138,44,226,0.15)" : "0 4px 20px rgba(0,0,0,0.06)"}
                transition="all 0.2s"
                _hover={{ boxShadow: "0 4px 20px rgba(138,44,226,0.15)", transform: "translateY(-2px)" }}
              >
                <Flex direction={{ base: "column", md: view === "list" ? "row" : "column" }}>
                  {/* Content area */}
                  <Box flex="1" p={6}>
                    <Flex align="flex-start" gap={3} mb={3}>
                      <Flex
                        w="32px"
                        h="32px"
                        rounded="lg"
                        bg={col.bg}
                        color={col.text}
                        border="1px solid"
                        borderColor={col.border}
                        align="center"
                        justify="center"
                        fontSize="12px"
                        fontWeight="black"
                        shrink={0}
                      >
                        {String(idx + 1).padStart(2, "0")}
                      </Flex>
                      <Box>
                        <Text fontSize="15px" fontWeight="bold" color="#111827" lineHeight="1.3" mb={1}>
                          {c.title}
                        </Text>
                      </Box>
                    </Flex>

                    <Text
                      fontSize="13px"
                      color="gray.600"
                      lineHeight="1.7"
                      whiteSpace="pre-wrap"
                      maxH={isExp ? "none" : "72px"}
                      overflow="hidden"
                    >
                      {c.body}
                    </Text>
                    <Button
                      variant="ghost"
                      size="sm"
                      color="#8a2ce2"
                      fontWeight="semibold"
                      fontSize="12px"
                      mt={2}
                      p={0}
                      h="auto"
                      _hover={{ bg: "transparent", opacity: 0.7 }}
                      onClick={() => toggle(c.id)}
                      gap={1}
                    >
                      {isExp ? "Show less" : "Read more"}
                      {isExp ? <Box as={ChevronUp} boxSize="14px" /> : <Box as={ChevronDown} boxSize="14px" />}
                    </Button>
                  </Box>

                  {/* Actions sidebar */}
                  <VStack
                    p={5}
                    gap={3}
                    align="stretch"
                    borderLeft={{ base: "none", md: view === "list" ? "1px solid" : "none" }}
                    borderTop={{ base: "1px solid", md: view === "list" ? "none" : "1px solid" }}
                    borderColor="gray.100"
                    minW={{ base: "auto", md: view === "list" ? "180px" : "auto" }}
                  >
                    <Button
                      bg={isSel ? "#8a2ce2" : "white"}
                      color={isSel ? "white" : "#8a2ce2"}
                      border="1px solid"
                      borderColor={isSel ? "#8a2ce2" : "rgba(138,44,226,0.3)"}
                      rounded="full"
                      size="sm"
                      fontWeight="bold"
                      onClick={() => onSelect(c.id)}
                      _hover={{ bg: isSel ? "#7c28cb" : "rgba(138,44,226,0.06)" }}
                      transition="all 0.2s"
                    >
                      {isSel ? "✓ Selected" : "Select"}
                    </Button>

                    {/* Star rating */}
                    <Flex justify="center" gap={0.5}>
                      {[1, 2, 3, 4, 5].map((s) => (
                        <Button
                          key={s}
                          variant="ghost"
                          size="xs"
                          p={0}
                          minW="24px"
                          h="24px"
                          onClick={() => onRate(c.id, s)}
                          color={(ratings[c.id] || 0) >= s ? "#ea580c" : "gray.300"}
                          _hover={{ color: "#ea580c" }}
                        >
                          <Box as={Star} boxSize="14px" fill={(ratings[c.id] || 0) >= s ? "currentColor" : "none"} />
                        </Button>
                      ))}
                    </Flex>

                    {/* Action buttons */}
                    <HStack justify="center" gap={1}>
                      <Button
                        variant="ghost"
                        size="sm"
                        p={1}
                        minW="32px"
                        h="32px"
                        color={likes.has(c.id) ? "red.500" : "gray.400"}
                        _hover={{ color: "red.500", bg: "red.50" }}
                        onClick={() => onToggleLike(c.id)}
                        title="Favourite"
                      >
                        <Box as={Heart} boxSize="16px" fill={likes.has(c.id) ? "currentColor" : "none"} />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        p={1}
                        minW="32px"
                        h="32px"
                        color={bm.has(c.id) ? "#8a2ce2" : "gray.400"}
                        _hover={{ color: "#8a2ce2", bg: "rgba(138,44,226,0.06)" }}
                        onClick={() => onToggleBm(c.id)}
                        title="Bookmark"
                      >
                        <Box as={Bookmark} boxSize="16px" fill={bm.has(c.id) ? "currentColor" : "none"} />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        p={1}
                        minW="32px"
                        h="32px"
                        color="gray.400"
                        _hover={{ color: "#8a2ce2", bg: "rgba(138,44,226,0.06)" }}
                        onClick={() => onCopy(c.body)}
                        title="Copy"
                      >
                        <Box as={Copy} boxSize="16px" />
                      </Button>
                    </HStack>
                  </VStack>
                </Flex>
              </Box>
            );
          })}
        </SimpleGrid>

        {/* Bottom sticky bar */}
        {selCtx != null && (
          <Flex
            position="fixed"
            bottom={0}
            left={0}
            right={0}
            bg="white"
            borderTop="1px solid"
            borderColor="gray.100"
            boxShadow="0 -4px 20px rgba(0,0,0,0.08)"
            p={4}
            justify="center"
            zIndex={50}
          >
            <Flex maxW="1140px" w="full" align="center" justify="space-between" gap={4}>
              <Flex align="center" gap={3}>
                <Box
                  bg="rgba(138,44,226,0.08)"
                  color="#8a2ce2"
                  border="1px solid"
                  borderColor="rgba(138,44,226,0.2)"
                  px={3}
                  py={1}
                  rounded="full"
                  fontSize="12px"
                  fontWeight="bold"
                >
                  Context {String(selCtx).padStart(2, "0")} selected
                </Box>
                <Text fontSize="13px" color="#6b7280" display={{ base: "none", md: "block" }}>
                  Ready to generate content from this positioning angle
                </Text>
              </Flex>
              <Button
                bg="#8a2ce2"
                color="white"
                rounded="full"
                fontWeight="bold"
                px={6}
                onClick={onUseSelected}
                boxShadow="0 4px 14px rgba(138,44,226,0.3)"
                _hover={{ bg: "#7c28cb", transform: "translateY(-1px)" }}
                transition="all 0.2s"
                gap={2}
              >
                Continue to Templates <Box as={ArrowRight} boxSize="14px" />
              </Button>
            </Flex>
          </Flex>
        )}
      </Box>
    </Box>
  );
}
