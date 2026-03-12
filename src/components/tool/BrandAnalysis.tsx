"use client";

import { useState, useEffect } from "react";
import { Box, Flex, Text, VStack, HStack, Button, SimpleGrid } from "@chakra-ui/react";
import { useDiscoveryStream } from "@/hooks/useDiscoveryStream";
import BrowserViewport from "./BrowserViewport";
import AgentThoughtsPopover from "./AgentThoughtsPopover";
import BrandIdentityCards from "./BrandIdentityCards";
import { Sparkles, Globe, CheckCircle2, X } from "lucide-react";
import { Page2AnalysingProps } from "@/props/Page2Analysing";
import { STATUS_COLORS } from "@/constants/page2";

export default function Page2Analysing({ url, brandName, onDone }: Page2AnalysingProps) {
  const [showThoughts, setShowThoughts] = useState(true);
  const [selectedContextIndex, setSelectedContextIndex] = useState<number | null>(null);

  const {
    isRunning,
    status,
    thoughts,
    contexts,
    browserImage,
    error,
    startDiscovery,
    resetDiscovery,
  } = useDiscoveryStream();

  useEffect(() => {
    if (url) {
      startDiscovery(url, brandName || "");
    }
  }, [url, brandName, startDiscovery]);

  useEffect(() => {
    if (status === "finished" && contexts.length > 0) {
      const timer = setTimeout(() => {
        onDone(contexts);
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [status, contexts, onDone]);

  const handleViewResults = () => {
    onDone(contexts);
  };

  const handleRetry = () => {
    resetDiscovery();
    startDiscovery(url, brandName || "");
  };

  const getProgressValue = () => {
    switch (status) {
      case "browsing": return 35;
      case "generating": return 70;
      case "finished": return 100;
      default: return 0;
    }
  };

  return (
    <Flex
      direction="column"
      h="calc(100vh - 80px)"
      w="full"
      position="relative"
      bg="gray.50"
    >
      {/* Header Bar */}
      <Box
        w="full"
        px={8}
        py={4}
        bg="white"
        borderBottom="1px solid"
        borderColor="gray.200"
        flexShrink={0}
      >
        <Flex align="center" justify="space-between" gap={4}>
          <Flex align="center" gap={3}>
            <Flex
              align="center"
              gap={2}
              px={3}
              py={1.5}
              borderRadius="full"
              bg="blue.100"
              color="blue.700"
              fontSize="sm"
              fontWeight="medium"
            >
              <Sparkles size={14} />
              AI Discovery Agent
            </Flex>
            <HStack gap={2}>
              <Box
                w={2}
                h={2}
                borderRadius="full"
                bg={`${STATUS_COLORS[status] || "gray"}.500`}
                animation={isRunning ? "pulse 2s infinite" : "none"}
              />
              <Text fontSize="sm" fontWeight="medium" color="gray.600" textTransform="uppercase">
                {status}
              </Text>
            </HStack>
          </Flex>
          
          <Flex align="center" gap={3} flex={1} maxW="600px">
            <Box p={2} borderRadius="lg" bg="gray.100">
              <Globe size={16} color="#6B7280" />
            </Box>
            <Text
              flex={1}
              fontSize="sm"
              color="gray.600"
              fontFamily="mono"
              overflow="hidden"
              textOverflow="ellipsis"
              whiteSpace="nowrap"
            >
              {url}
            </Text>
          </Flex>
        </Flex>

        {/* Progress Bar */}
        {isRunning && (
          <Box w="full" mt={4}>
            <Box w="full" h={1.5} bg="gray.200" borderRadius="full" overflow="hidden">
              <Box
                h="full"
                bg={status === "browsing" ? "emerald.500" : status === "generating" ? "violet.500" : "blue.500"}
                w={`${getProgressValue()}%`}
                transition="width 0.3s ease"
                borderRadius="full"
              />
            </Box>
          </Box>
        )}
      </Box>

      {/* Main Split-Screen Container */}
      <Flex flex={1} overflow="hidden" position="relative">
        {/* Left Column: Text Panel (35% - Scrollable) */}
        <Box
          w="35%"
          h="full"
          overflowY="auto"
          borderRight="1px solid"
          borderColor="gray.200"
          bg="white"
          css={{
            "&::-webkit-scrollbar": { width: "6px" },
            "&::-webkit-scrollbar-track": { bg: "transparent" },
            "&::-webkit-scrollbar-thumb": { bg: "#E5E7EB", borderRadius: "3px" },
          }}
        >
          <VStack p={6} gap={4} align="stretch">
            {/* Analysis Steps Card */}
            <Box
              p={5}
              borderRadius="xl"
              bg="gray.50"
              border="1px solid"
              borderColor="gray.200"
            >
              <Text fontSize="xs" fontWeight="bold" color="gray.500" textTransform="uppercase" letterSpacing="wide" mb={4}>
                Analysis Progress
              </Text>
              <VStack align="stretch" gap={3}>
                {[
                  { label: "Scraping content", step: "browsing" },
                  { label: "Extracting signals", step: "browsing" },
                  { label: "Analyzing tone", step: "generating" },
                  { label: "Generating contexts", step: "generating" },
                  { label: "Finalizing", step: "finished" },
                ].map((item, idx) => {
                  const isActive = status === item.step;
                  const isComplete = 
                    (status === "generating" && idx < 2) ||
                    (status === "finished" && idx < 4) ||
                    (status === "finished" && idx === 4);
                  
                  return (
                    <HStack key={idx} gap={3}>
                      <Box
                        w={6}
                        h={6}
                        borderRadius="full"
                        display="flex"
                        alignItems="center"
                        justifyContent="center"
                        bg={isComplete ? "green.500" : isActive ? "blue.500" : "gray.200"}
                        color="white"
                        fontSize="xs"
                        fontWeight="bold"
                        flexShrink={0}
                      >
                        {isComplete ? <CheckCircle2 size={12} /> : idx + 1}
                      </Box>
                      <Text
                        fontSize="sm"
                        color={isComplete || isActive ? "gray.900" : "gray.400"}
                        fontWeight={isActive ? "medium" : "normal"}
                      >
                        {item.label}
                      </Text>
                    </HStack>
                  );
                })}
              </VStack>
            </Box>

            {/* Error Card */}
            {error && (
              <Box
                p={4}
                borderRadius="xl"
                bg="red.50"
                border="1px solid"
                borderColor="red.200"
              >
                <Text fontSize="sm" color="red.700" fontWeight="medium" mb={3}>
                  {error}
                </Text>
                <Button
                  w="full"
                  colorScheme="red"
                  size="sm"
                  onClick={handleRetry}
                  borderRadius="lg"
                  fontWeight="medium"
                >
                  Retry Analysis
                </Button>
              </Box>
            )}

            {/* Status Messages */}
            {status === "browsing" && (
              <Box p={4} bg="blue.50" borderRadius="lg" border="1px solid" borderColor="blue.200">
                <Flex align="center" gap={2}>
                  <Box w={2} h={2} borderRadius="full" bg="blue.500" animation="pulse 2s infinite" />
                  <Text fontSize="sm" color="blue.700" fontWeight="medium">
                    Analyzing website content...
                  </Text>
                </Flex>
              </Box>
            )}

            {status === "generating" && (
              <Box p={4} bg="violet.50" borderRadius="lg" border="1px solid" borderColor="violet.200">
                <Flex align="center" gap={2}>
                  <Box w={2} h={2} borderRadius="full" bg="violet.500" animation="pulse 2s infinite" />
                  <Text fontSize="sm" color="violet.700" fontWeight="medium">
                    Generating {contexts.length} of 5 identities...
                  </Text>
                </Flex>
              </Box>
            )}

            {/* Brand Identity Cards (when complete) */}
            {status === "finished" && contexts.length > 0 && (
              <VStack align="stretch" gap={4}>
                <Flex align="center" gap={2} p={3} bg="emerald.50" borderRadius="xl" border="1px solid" borderColor="emerald.200">
                  <CheckCircle2 size={16} color="#10B981" />
                  <Text fontSize="xs" fontWeight="bold" color="emerald.700" textTransform="uppercase" letterSpacing="wide">
                    Analysis Complete - Ready to Review
                  </Text>
                </Flex>
                <Box p={4} bg="white" borderRadius="lg" border="1px solid" borderColor="gray.200">
                  <Text fontSize="sm" color="gray.600" lineHeight="relaxed" mb={3}>
                    We've generated <strong>5 unique brand identities</strong> for your website. Each captures a different positioning angle to help you connect with your audience.
                  </Text>
                  <Text fontSize="sm" color="gray.600" lineHeight="relaxed">
                    Click <strong>"View All Results"</strong> to see the complete analysis with detailed breakdowns, ratings, and recommendations.
                  </Text>
                </Box>
                <Button
                  w="full"
                  colorScheme="emerald"
                  size="md"
                  onClick={handleViewResults}
                  borderRadius="xl"
                  fontWeight="semibold"
                >
                  View All Results <CheckCircle2 size={18} style={{ marginLeft: 8 }} />
                </Button>
              </VStack>
            )}
          </VStack>
        </Box>

        {/* Right Column: Action Panel (65% - Fixed) */}
        <Box
          w="65%"
          h="full"
          position="relative"
          bg="gray.100"
          p={8}
          display="flex"
          alignItems="center"
          justifyContent="center"
        >
          {/* Browser Viewport Container - with closing animation */}
          <Box
            w="full"
            h="full"
            position="relative"
            borderRadius="2xl"
            overflow="hidden"
            boxShadow="2xl"
            animation={status === "generating" ? "browserClose 0.6s ease-in forwards" : "none"}
            style={{
              transformOrigin: "center center",
            }}
          >
            <BrowserViewport imageUrl={browserImage} status={status} />
            
            {/* Overlay during closing animation */}
            {status === "generating" && (
              <Box
                position="absolute"
                inset={0}
                bg="white"
                opacity={0}
                animation="overlayFadeIn 0.6s ease-in forwards"
                style={{ animationDelay: "0.3s" }}
              />
            )}
            
            {/* Agent Thought Popover - Positioned over browser */}
            {showThoughts && thoughts.length > 0 && status !== "finished" && (
              <AgentThoughtsPopover
                thoughts={thoughts}
                status={status}
                onClose={() => setShowThoughts(false)}
              />
            )}
          </Box>

          {/* Streaming identities replace browser when generating */}
          {status === "generating" && (
            <Box
              position="absolute"
              inset={0}
              p={8}
              display="flex"
              alignItems="center"
              justifyContent="center"
              opacity={0}
              animation="identitiesFadeIn 0.8s ease-out forwards"
              style={{ animationDelay: "0.4s" }}
            >
              <VStack
                w="full"
                h="full"
                p={6}
                bg="white"
                borderRadius="2xl"
                boxShadow="xl"
                border="1px solid"
                borderColor="gray.200"
                overflowY="auto"
                css={{
                  "&::-webkit-scrollbar": { width: "6px" },
                  "&::-webkit-scrollbar-track": { bg: "transparent" },
                  "&::-webkit-scrollbar-thumb": { bg: "#E5E7EB", borderRadius: "3px" },
                }}
              >
                <Flex align="center" gap={3} mb={4}>
                  <Box
                    p={2}
                    borderRadius="xl"
                    bg="violet.100"
                    color="violet.600"
                  >
                    <Sparkles size={20} />
                  </Box>
                  <Box>
                    <Text fontSize="lg" fontWeight="bold" color="gray.900">
                      Generating Brand Identities
                    </Text>
                    <Text fontSize="sm" color="gray.500">
                      AI is crafting your unique brand positioning
                    </Text>
                  </Box>
                </Flex>
                <Box w="full" h={1} bg="gray.200" borderRadius="full" overflow="hidden" mb={4}>
                  <Box
                    h="full"
                    bg="violet.500"
                    w={`${(contexts.length / 5) * 100}%`}
                    transition="width 0.3s ease"
                    borderRadius="full"
                  />
                </Box>
                <SimpleGrid columns={2} gap={4} w="full">
                  {contexts.map((context, idx) => (
                    <Box
                      key={idx}
                      p={4}
                      borderRadius="lg"
                      bg="white"
                      border="1px solid"
                      borderColor="gray.200"
                      boxShadow="sm"
                      cursor="pointer"
                      _hover={{ borderColor: "violet.400", boxShadow: "md", transform: "translateY(-2px)" }}
                      transition="all 0.2s"
                      onClick={() => setSelectedContextIndex(idx)}
                      animation="cardScaleIn 0.4s ease-out"
                      animationDelay={`${idx * 0.1}s`}
                      style={{ animationFillMode: "both" }}
                    >
                      <Flex align="center" gap={2} mb={2}>
                        <Box
                          px={2}
                          py={0.5}
                          borderRadius="md"
                          bg="violet.500"
                          color="white"
                          fontSize="10px"
                          fontWeight="bold"
                          fontFamily="mono"
                        >
                          {String(idx + 1).padStart(2, "0")}
                        </Box>
                        <Text fontSize="xs" fontWeight="bold" color="gray.600" textTransform="uppercase">
                          Identity
                        </Text>
                      </Flex>
                      <Box
                        fontSize="xs"
                        color="gray.600"
                        lineHeight="relaxed"
                        dangerouslySetInnerHTML={{ __html: context.substring(0, 150) + "..." }}
                      />
                      <Flex align="center" gap={1} mt={2} color="violet.600" fontSize="xs" fontWeight="medium">
                        <Text>Click to view full</Text>
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <path d="M5 12h14M12 5l7 7-7 7"/>
                        </svg>
                      </Flex>
                    </Box>
                  ))}
                  {/* Placeholder cards for remaining identities */}
                  {Array.from({ length: Math.max(0, 5 - contexts.length) }).map((_, idx) => (
                    <Box
                      key={`placeholder-${idx}`}
                      p={4}
                      borderRadius="lg"
                      bg="gray.50"
                      border="1px dashed"
                      borderColor="gray.300"
                      display="flex"
                      alignItems="center"
                      justifyContent="center"
                      minH="120px"
                    >
                      <Flex align="center" gap={2} color="gray.400">
                        <Box
                          w={3}
                          h={3}
                          borderRadius="full"
                          bg="violet.500"
                          animation="pulse 2s infinite"
                        />
                        <Text fontSize="xs">Generating Identity {contexts.length + idx + 1}...</Text>
                      </Flex>
                    </Box>
                  ))}
                </SimpleGrid>
              </VStack>
            </Box>
          )}

          {/* Completion Screen */}
          {status === "finished" && (
            <Box
              position="absolute"
              inset={0}
              p={8}
              display="flex"
              alignItems="center"
              justifyContent="center"
              opacity={0}
              animation="identitiesFadeIn 0.6s ease-out forwards"
            >
              <VStack
                w="full"
                h="full"
                p={8}
                bg="white"
                borderRadius="2xl"
                boxShadow="xl"
                border="1px solid"
                borderColor="gray.200"
                gap={6}
              >
                <Flex
                  direction="column"
                  align="center"
                  justify="center"
                  flex={1}
                  textAlign="center"
                >
                  <Box
                    p={4}
                    borderRadius="full"
                    bg="emerald.100"
                    color="emerald.600"
                    mb={4}
                  >
                    <CheckCircle2 size={48} />
                  </Box>
                  <Text
                    fontSize="3xl"
                    fontWeight="bold"
                    color="gray.900"
                    mb={2}
                  >
                    Brand Analysis Complete!
                  </Text>
                  <Text
                    fontSize="lg"
                    color="gray.600"
                    maxW="500px"
                    mb={6}
                  >
                    We've generated 5 unique brand identities for your website. Each one captures a different positioning angle that can help you connect with your audience.
                  </Text>
                  <Flex gap={4} wrap="wrap" justify="center" mb={8}>
                    <Flex align="center" gap={2} px={4} py={2} bg="blue.50" borderRadius="xl" border="1px solid" borderColor="blue.200">
                      <Box w={2} h={2} borderRadius="full" bg="blue.500" />
                      <Text fontSize="sm" fontWeight="medium" color="blue.700">5 Identities</Text>
                    </Flex>
                    <Flex align="center" gap={2} px={4} py={2} bg="violet.50" borderRadius="xl" border="1px solid" borderColor="violet.200">
                      <Box w={2} h={2} borderRadius="full" bg="violet.500" />
                      <Text fontSize="sm" fontWeight="medium" color="violet.700">Ready to Use</Text>
                    </Flex>
                    <Flex align="center" gap={2} px={4} py={2} bg="emerald.50" borderRadius="xl" border="1px solid" borderColor="emerald.200">
                      <Box w={2} h={2} borderRadius="full" bg="emerald.500" />
                      <Text fontSize="sm" fontWeight="medium" color="emerald.700">AI Generated</Text>
                    </Flex>
                  </Flex>
                  <Button
                    size="lg"
                    colorScheme="blue"
                    onClick={handleViewResults}
                    borderRadius="xl"
                    px={8}
                    fontSize="md"
                    fontWeight="semibold"
                  >
                    View All Results →
                  </Button>
                </Flex>
              </VStack>
            </Box>
          )}
        </Box>
      </Flex>

      {/* Full Brand Identity Cards Section - Removed, results pass to Page3 */}

      {/* Identity Detail Modal */}
      {selectedContextIndex !== null && contexts[selectedContextIndex] && (
        <Flex
          position="fixed"
          inset={0}
          bg="blackAlpha.600"
          zIndex={100}
          align="center"
          justify="center"
          p={4}
          onClick={() => setSelectedContextIndex(null)}
        >
          <Box
            w="full"
            maxW="900px"
            maxH="85vh"
            bg="white"
            borderRadius="2xl"
            boxShadow="2xl"
            overflow="hidden"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <Flex
              align="center"
              justify="space-between"
              p={6}
              bg="violet.50"
              borderBottom="1px solid"
              borderColor="violet.200"
            >
              <Flex align="center" gap={3}>
                <Box
                  px={3}
                  py={1}
                  borderRadius="lg"
                  bg="violet.500"
                  color="white"
                  fontSize="sm"
                  fontWeight="bold"
                  fontFamily="mono"
                >
                  {String(selectedContextIndex + 1).padStart(2, "0")}
                </Box>
                <Text fontSize="xl" fontWeight="bold" color="gray.900">
                  {(() => {
                    const content = contexts[selectedContextIndex];
                    const titleMatch = content.match(/^##\s*\d+\.\s*(.+)$/m);
                    return titleMatch ? titleMatch[1].trim() : `Brand Identity ${selectedContextIndex + 1}`;
                  })()}
                </Text>
              </Flex>
              <Box
                as="button"
                onClick={() => setSelectedContextIndex(null)}
                w={10}
                h={10}
                borderRadius="lg"
                display="flex"
                alignItems="center"
                justifyContent="center"
                _hover={{ bg: "violet.100" }}
                transition="all 0.2s"
              >
                <X size={20} color="#6B7280" />
              </Box>
            </Flex>

            {/* Modal Content - Full content displayed statically */}
            <Box
              p={8}
              overflowY="auto"
              maxH="calc(85vh - 100px)"
              css={{
                "&::-webkit-scrollbar": { width: "8px" },
                "&::-webkit-scrollbar-track": { bg: "transparent" },
                "&::-webkit-scrollbar-thumb": { bg: "#E5E7EB", borderRadius: "4px" },
              }}
            >
              <Box
                fontSize="base"
                color="gray.700"
                lineHeight="relaxed"
                position="relative"
                whiteSpace="pre-wrap"
              >
                {contexts[selectedContextIndex]}
              </Box>
            </Box>
          </Box>
        </Flex>
      )}

      {/* Global Styles for Animations */}
      <style jsx global>{`
        @keyframes popoverSlideIn {
          from {
            opacity: 0;
            transform: translateY(-8px) scale(0.98);
          }
          to {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
        }
        @keyframes browserClose {
          0% {
            opacity: 1;
            transform: scale(1);
          }
          50% {
            opacity: 0.5;
            transform: scale(0.95);
          }
          100% {
            opacity: 0;
            transform: scale(0.8);
          }
        }
        @keyframes overlayFadeIn {
          0% {
            opacity: 0;
          }
          100% {
            opacity: 1;
          }
        }
        @keyframes identitiesFadeIn {
          0% {
            opacity: 0;
            transform: scale(0.95);
          }
          100% {
            opacity: 1;
            transform: scale(1);
          }
        }
        @keyframes identitySlideIn {
          0% {
            opacity: 0;
            transform: translateX(-16px);
          }
          100% {
            opacity: 1;
            transform: translateX(0);
          }
        }
        @keyframes cardScaleIn {
          0% {
            opacity: 0;
            transform: scale(0.9);
          }
          100% {
            opacity: 1;
            transform: scale(1);
          }
        }
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.5; }
        }
        @keyframes blink {
          0%, 100% { opacity: 1; }
          50% { opacity: 0; }
        }
      `}</style>
    </Flex>
  );
}
