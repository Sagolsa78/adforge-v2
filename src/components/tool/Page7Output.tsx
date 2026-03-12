"use client";

import { Box, Flex, Text, Button, SimpleGrid, Badge, IconButton } from "@chakra-ui/react";
import { ArrowLeft, Download, RotateCcw, Copy, MessageSquare, Hash, Image as ImageIcon, Layers, CheckCircle2 } from "lucide-react";
import { GeneratedContent } from "@/types/tool";

interface Props {
  gen: GeneratedContent;
  onCopy: (text: string) => void;
  onBack: () => void;
  onNewAnalysis: () => void;
}

export default function Page7Output({ gen, onCopy, onBack, onNewAnalysis }: Props) {
  return (
    <Box w="full" px={4} py={12} minH="calc(100vh - 140px)" position="relative">
      {/* Background blobs */}
      <Box position="absolute" top="-10%" left="-5%" w="400px" h="400px" bg="#e0e7ff" rounded="full" filter="blur(80px)" opacity={0.3} pointerEvents="none" />
      <Box position="absolute" bottom="-10%" right="-5%" w="400px" h="400px" bg="#fae8ff" rounded="full" filter="blur(80px)" opacity={0.3} pointerEvents="none" />

      <Box maxW="1140px" mx="auto" position="relative" zIndex={1}>
        <Flex justify="space-between" align={{ base: "flex-start", md: "center" }} mb={8} flexWrap="wrap" gap={6} direction={{ base: "column", md: "row" }}>
          <Box>
            <Button
              size="sm"
              variant="outline"
              mb={4}
              onClick={onBack}
              rounded="full"
              borderColor="gray.200"
              color="gray.700"
              _hover={{ bg: "gray.50" }}
              gap={2}
            >
              <Box as={ArrowLeft} boxSize="14px" /> Back to Options
            </Button>
            <Flex align="center" gap={3} mb={3}>
              <Box
                display="inline-flex"
                alignItems="center"
                px={3} py={1}
                rounded="full"
                bg="rgba(5,150,105,0.08)"
                border="1px solid"
                borderColor="rgba(5,150,105,0.2)"
                color="#059669"
                fontSize="10px"
                fontWeight="bold"
                textTransform="uppercase"
                letterSpacing="widest"
                gap={1.5}
              >
                <Box as={CheckCircle2} boxSize="16px" />
                Step 7 of 7 — Complete!
              </Box>
            </Flex>
            <Text fontSize={{ base: "3xl", md: "4xl" }} fontWeight="black" color="#111827" letterSpacing="tight" mb={1}>
              Your <Text as="span" color="#8a2ce2">Content</Text>
            </Text>
            <Text fontSize="md" color="#6b7280">
              Review your generated carousel, caption, hashtags, and image prompts.
            </Text>
          </Box>
          <Flex gap={3}>
            <Button
              variant="outline"
              onClick={() => onCopy(JSON.stringify(gen, null, 2))}
              rounded="full"
              fontWeight="bold"
              borderColor="gray.200"
              color="gray.700"
              _hover={{ bg: "gray.50" }}
              gap={2}
            >
              <Box as={Download} boxSize="16px" /> Export JSON
            </Button>
            <Button
              bg="#8a2ce2"
              color="white"
              onClick={onNewAnalysis}
              rounded="full"
              fontWeight="bold"
              boxShadow="0 4px 14px rgba(138,44,226,0.3)"
              _hover={{ bg: "#7c28cb", transform: "translateY(-1px)" }}
              transition="all 0.2s"
              gap={2}
            >
              <Box as={RotateCcw} boxSize="14px" /> New Analysis
            </Button>
          </Flex>
        </Flex>

        {/* Slides */}
        <Box mb={8} bg="white" border="1px solid" borderColor="gray.100" rounded="2xl" overflow="hidden" boxShadow="0 4px 20px rgba(0,0,0,0.06)">
          <Flex bg="gray.50" px={6} py={4} borderBottom="1px solid" borderColor="gray.100" align="center" gap={3}>
            <Flex w={8} h={8} rounded="lg" bg="rgba(138,44,226,0.1)" color="#8a2ce2" align="center" justify="center">
              <Box as={Layers} boxSize="16px" />
            </Flex>
            <Text fontSize="md" fontWeight="bold" color="#111827">Carousel Slides ({gen.slides.length})</Text>
          </Flex>
          <Box p={6}>
            <SimpleGrid columns={{ base: 1, sm: 2, md: 3, lg: 4 }} gap={4}>
              {gen.slides.map((s) => (
                <Box
                  key={s.num}
                  bg="white"
                  border="1px solid"
                  borderColor={s.cov ? "rgba(138,44,226,0.3)" : "gray.100"}
                  rounded="xl"
                  p={5}
                  position="relative"
                  boxShadow={s.cov ? "0 4px 12px rgba(138,44,226,0.1)" : "none"}
                  display="flex"
                  flexDirection="column"
                >
                  {s.cov && (
                    <Box position="absolute" top={0} left={0} right={0} h="4px" bg="#8a2ce2" borderTopRadius="md" />
                  )}
                  <Flex justify="space-between" align="center" mb={3}>
                    <Flex w={6} h={6} rounded="full" bg={s.cov ? "rgba(138,44,226,0.1)" : "gray.100"} color={s.cov ? "#8a2ce2" : "gray.600"} align="center" justify="center" fontSize="xs" fontWeight="black">
                      {s.num}
                    </Flex>
                    <Badge
                      bg={s.cov ? "rgba(138,44,226,0.08)" : "gray.100"}
                      color={s.cov ? "#8a2ce2" : "gray.600"}
                      fontSize="9px"
                      fontWeight="bold"
                      px={2}
                      py={0.5}
                      rounded="md"
                    >
                      {s.cov ? "COVER SLIDE" : `SLIDE ${s.num}`}
                    </Badge>
                  </Flex>
                  <Text fontSize="sm" fontWeight="black" color="#111827" mb={2} lineHeight="1.3">{s.h}</Text>
                  <Text fontSize="xs" color="gray.600" lineHeight="1.6" flex="1">{s.b}</Text>
                </Box>
              ))}
            </SimpleGrid>
          </Box>
        </Box>

        <SimpleGrid columns={{ base: 1, lg: 2 }} gap={8}>
          {/* Caption */}
          <Box bg="white" border="1px solid" borderColor="gray.100" rounded="2xl" overflow="hidden" boxShadow="0 4px 20px rgba(0,0,0,0.06)">
            <Flex bg="gray.50" px={6} py={4} borderBottom="1px solid" borderColor="gray.100" align="center" justify="space-between">
              <Flex align="center" gap={3}>
                <Flex w={8} h={8} rounded="lg" bg="rgba(138,44,226,0.1)" color="#8a2ce2" align="center" justify="center">
                  <Box as={MessageSquare} boxSize="16px" />
                </Flex>
                <Text fontSize="md" fontWeight="bold" color="#111827">Caption</Text>
              </Flex>
              <Button size="sm" variant="ghost" color="#8a2ce2" onClick={() => onCopy(gen.caption)} _hover={{ bg: "rgba(138,44,226,0.06)" }} gap={1}>
                <Box as={Copy} boxSize="14px" /> Copy
              </Button>
            </Flex>
            <Box p={6}>
              <Box bg="gray.50" border="1px solid" borderColor="gray.100" rounded="xl" p={5} whiteSpace="pre-wrap" fontSize="sm" color="gray.800" lineHeight="1.7">
                {gen.caption}
              </Box>
            </Box>
          </Box>

          <Box display="flex" flexDirection="column" gap={8}>
            {/* Hashtags */}
            <Box bg="white" border="1px solid" borderColor="gray.100" rounded="2xl" overflow="hidden" boxShadow="0 4px 20px rgba(0,0,0,0.06)">
              <Flex bg="gray.50" px={6} py={4} borderBottom="1px solid" borderColor="gray.100" align="center" justify="space-between">
                <Flex align="center" gap={3}>
                  <Flex w={8} h={8} rounded="lg" bg="rgba(5,150,105,0.1)" color="#059669" align="center" justify="center">
                    <Box as={Hash} boxSize="16px" />
                  </Flex>
                  <Text fontSize="md" fontWeight="bold" color="#111827">Hashtags ({gen.hashtags.length})</Text>
                </Flex>
                <Button size="sm" variant="ghost" color="#8a2ce2" onClick={() => onCopy(gen.hashtags.join(" "))} _hover={{ bg: "rgba(138,44,226,0.06)" }} gap={1}>
                  <Box as={Copy} boxSize="14px" /> Copy all
                </Button>
              </Flex>
              <Box p={6}>
                <Flex flexWrap="wrap" gap={2}>
                  {gen.hashtags.map((h, i) => (
                    <Text key={i} color="#8a2ce2" fontSize="sm" fontWeight="medium" bg="rgba(138,44,226,0.06)" px={2} py={1} rounded="md">
                      {h}
                    </Text>
                  ))}
                </Flex>
              </Box>
            </Box>

            {/* Image Prompts */}
            <Box bg="white" border="1px solid" borderColor="gray.100" rounded="2xl" overflow="hidden" boxShadow="0 4px 20px rgba(0,0,0,0.06)" flex="1">
              <Flex bg="gray.50" px={6} py={4} borderBottom="1px solid" borderColor="gray.100" align="center" gap={3}>
                <Flex w={8} h={8} rounded="lg" bg="rgba(234,88,12,0.1)" color="#ea580c" align="center" justify="center">
                  <Box as={ImageIcon} boxSize="16px" />
                </Flex>
                <Text fontSize="md" fontWeight="bold" color="#111827">Image Prompts ({gen.prompts.length})</Text>
              </Flex>
              <Box p={6}>
                <Box display="flex" flexDirection="column" gap={4}>
                  {gen.prompts.map((p, i) => (
                    <Box key={i} bg="gray.50" border="1px solid" borderColor="gray.100" rounded="xl" p={4}>
                      <Flex justify="space-between" align="center" mb={2}>
                        <Badge bg="rgba(234,88,12,0.08)" color="#ea580c" border="1px solid" borderColor="rgba(234,88,12,0.2)" fontSize="10px" fontWeight="bold" px={2} py={0.5} rounded="md">
                          {p.lbl}
                        </Badge>
                        <IconButton aria-label="Copy prompt" size="xs" variant="ghost" onClick={() => onCopy(p.txt)} color="#8a2ce2" _hover={{ bg: "rgba(138,44,226,0.06)" }}>
                          <Box as={Copy} boxSize="14px" />
                        </IconButton>
                      </Flex>
                      <Text fontSize="xs" color="gray.700" lineHeight="1.6">{p.txt}</Text>
                    </Box>
                  ))}
                </Box>
              </Box>
            </Box>
          </Box>
        </SimpleGrid>
      </Box>
    </Box>
  );
}
