"use client";

import { Box, Flex, Text, Button, SimpleGrid, Badge, HStack } from "@chakra-ui/react";
import { ArrowLeft, CheckCircle2 } from "lucide-react";
import { BrandContext } from "@/types/onboarding.types";
import { CTX_META } from "@/config";

interface Props {
  ctx: BrandContext[];
  selCtx: number | null;
  onSelect: (id: number) => void;
  onBack: () => void;
  onNext: () => void;
}

const COLORS = [
  { bg: "rgba(138,44,226,0.06)", text: "#8a2ce2", border: "rgba(138,44,226,0.2)", accent: "#8a2ce2" },
  { bg: "rgba(234,88,12,0.06)", text: "#ea580c", border: "rgba(234,88,12,0.2)", accent: "#ea580c" },
  { bg: "rgba(5,150,105,0.06)", text: "#059669", border: "rgba(5,150,105,0.2)", accent: "#059669" },
  { bg: "rgba(219,39,119,0.06)", text: "#db2777", border: "rgba(219,39,119,0.2)", accent: "#db2777" },
  { bg: "rgba(79,70,229,0.06)", text: "#4f46e5", border: "rgba(79,70,229,0.2)", accent: "#4f46e5" },
];

export default function ContextSelector({ ctx, selCtx, onSelect, onBack, onNext }: Props) {
  return (
    <Box w="full" px={4} py={12} minH="calc(100vh - 140px)" position="relative">
      {/* Background blobs */}
      <Box position="absolute" top="-10%" left="-5%" w="400px" h="400px" bg="#e0e7ff" rounded="full" filter="blur(80px)" opacity={0.3} pointerEvents="none" />
      <Box position="absolute" bottom="-10%" right="-5%" w="400px" h="400px" bg="#fae8ff" rounded="full" filter="blur(80px)" opacity={0.3} pointerEvents="none" />

      <Box maxW="840px" mx="auto" position="relative" zIndex={1}>
        <Button
          variant="outline"
          size="sm"
          onClick={onBack}
          mb={8}
          rounded="full"
          borderColor="gray.200"
          color="gray.700"
          _hover={{ bg: "gray.50" }}
          gap={2}
        >
          <Box as={ArrowLeft} boxSize="14px" /> Back
        </Button>

        <Box textAlign="center" mb={10}>
          <Box
            display="inline-flex"
            alignItems="center"
            px={3} py={1}
            rounded="full"
            bg="rgba(138,44,226,0.08)"
            border="1px solid"
            borderColor="rgba(138,44,226,0.2)"
            color="#8a2ce2"
            fontSize="11px"
            fontWeight="bold"
            textTransform="uppercase"
            letterSpacing="widest"
            mb={4}
          >
            <Box w="6px" h="6px" rounded="full" bg="#8a2ce2" mr={2} className="animate-pulse" />
            Step 4 of 7
          </Box>
          <Text fontSize={{ base: "3xl", md: "4xl" }} fontWeight="black" color="#111827" letterSpacing="tight" mb={3}>
            Choose Your <Text as="span" color="#8a2ce2">Context</Text>
          </Text>
          <Text fontSize="md" color="#6b7280" maxW="500px" mx="auto">
            Select the positioning angle you want to turn into content.
          </Text>
        </Box>

        <SimpleGrid columns={{ base: 1, sm: 2, md: 3 }} gap={5} mb={10}>
          {ctx.map((c) => {
            const idx = c.id - 1;
            const meta = CTX_META[idx];
            const isSel = selCtx === c.id;
            const col = COLORS[idx % 5];

            return (
              <Box
                key={c.id}
                bg="white"
                border="2px solid"
                borderColor={isSel ? col.accent : "gray.100"}
                rounded="2xl"
                p={5}
                cursor="pointer"
                position="relative"
                boxShadow={isSel ? `0 4px 20px ${col.accent}26` : "0 4px 20px rgba(0,0,0,0.06)"}
                transition="all 0.2s"
                _hover={!isSel ? { borderColor: "gray.300", transform: "translateY(-2px)", boxShadow: "0 8px 25px rgba(0,0,0,0.08)" } : { transform: "translateY(-2px)" }}
                onClick={() => onSelect(c.id)}
                display="flex"
                flexDirection="column"
              >
                {isSel && (
                  <Flex position="absolute" top={3} right={3} w={6} h={6} bg={col.accent} rounded="full" align="center" justify="center" color="white" boxShadow="sm">
                    <Box as={CheckCircle2} boxSize="14px" />
                  </Flex>
                )}

                <Badge
                  bg={col.bg}
                  color={col.text}
                  border="1px solid"
                  borderColor={col.border}
                  fontSize="9px"
                  fontWeight="bold"
                  letterSpacing="wider"
                  px={2}
                  py={0.5}
                  rounded="md"
                  mb={3}
                  alignSelf="flex-start"
                >
                  CONTEXT {String(idx + 1).padStart(2, "0")}
                </Badge>

                <Text fontSize="15px" fontWeight="bold" color="#111827" mb={2} lineHeight="1.3">
                  {c.title}
                </Text>

                <HStack gap={2} mb={3} flexWrap="wrap">
                  <Badge bg={col.bg} color={col.text} border="1px solid" borderColor={col.border} rounded="md" px={1.5} py={0} textTransform="none" fontSize="10px" fontWeight="bold">
                    {meta?.funnel}
                  </Badge>
                  <Badge bg="gray.100" color="gray.600" border="1px solid" borderColor="gray.200" rounded="md" px={1.5} py={0} textTransform="none" fontSize="10px" fontWeight="bold">
                    {meta?.angle}
                  </Badge>
                </HStack>

                <Text fontSize="13px" color="gray.600" lineHeight="1.6" flex="1">
                  {c.body.slice(0, 120)}…
                </Text>
              </Box>
            );
          })}
        </SimpleGrid>

        <Flex justify="flex-end" px={{ base: 4, md: 0 }}>
          <Button
            size="lg"
            disabled={selCtx === null}
            onClick={onNext}
            bg="#8a2ce2"
            color="white"
            _hover={{ bg: "#7c28cb", transform: "translateY(-1px)", boxShadow: "0 8px 25px rgba(138,44,226,0.35)" }}
            _active={{ transform: "translateY(0)" }}
            rounded="full"
            fontWeight="bold"
            w={{ base: "full", sm: "auto" }}
            boxShadow="0 4px 14px rgba(138,44,226,0.3)"
            transition="all 0.2s"
            px={8}
          >
            Pick Template & Options →
          </Button>
        </Flex>
      </Box>
    </Box>
  );
}
