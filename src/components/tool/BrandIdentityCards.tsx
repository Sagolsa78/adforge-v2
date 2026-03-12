"use client";

import { Box, SimpleGrid, VStack, Text, Flex } from "@chakra-ui/react";
import { marked } from "marked";
import { CheckCircle2 } from "lucide-react";
import { BrandIdentityCardsProps } from "@/props/BrandIdentityCards";
import { IDENTITY_ACCENTS } from "@/constants/page2";

export default function BrandIdentityCards({ contexts, status }: BrandIdentityCardsProps) {
  if (contexts.length === 0) return null;

  return (
    <Box w="full" mt={8}>
      <Flex align="center" gap={3} mb={6}>
        {status === "finished" && (
          <CheckCircle2 size={20} color="#10B981" />
        )}
        <Text fontSize="lg" fontWeight="bold" color="gray.900">
          {status === "finished" ? "Brand Identities Generated" : "Generating Brand Identities..."}
        </Text>
        {status !== "finished" && (
          <Box
            px={2}
            py={0.5}
            borderRadius="full"
            bg="violet.100"
            borderWidth="1px"
            borderColor="violet.300"
          >
            <Text fontSize="10px" fontWeight="bold" color="violet.700">
              {contexts.length} / 5
            </Text>
          </Box>
        )}
      </Flex>

      <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} gap={6}>
        {contexts.map((context, idx) => {
          const accent = IDENTITY_ACCENTS[idx % IDENTITY_ACCENTS.length];
          const cleanContent = context.trim();

          return (
            <Box
              key={idx}
              p={6}
              borderRadius="2xl"
              borderWidth="1px"
              borderColor="gray.200"
              bg="white"
              boxShadow="lg"
              animation="slideUp 0.4s ease-out"
              animationDelay={`${idx * 0.1}s`}
              style={{ animationFillMode: "both" }}
              _hover={{
                boxShadow: "xl",
                transform: "translateY(-2px)",
                transition: "all 0.3s",
              }}
            >
              <Flex align="center" gap={3} mb={4}>
                <Box
                  px={2.5}
                  py={1}
                  borderRadius="lg"
                  className={accent.numBg}
                  color="white"
                  fontSize="xs"
                  fontWeight="bold"
                  fontFamily="mono"
                >
                  {String(idx + 1).padStart(2, "0")}
                </Box>
                <Text
                  fontSize="xs"
                  fontWeight="bold"
                  textTransform="uppercase"
                  letterSpacing="wide"
                  className={accent.text}
                >
                  Brand Identity {idx + 1}
                </Text>
              </Flex>

              <Box
                className="prose prose-sm max-w-none"
                css={{
                  h1: { fontSize: "16px", fontWeight: "700", marginBottom: "12px", color: "#111827" },
                  h2: { fontSize: "14px", fontWeight: "600", marginBottom: "10px", color: "#374151" },
                  h3: { fontSize: "13px", fontWeight: "600", marginBottom: "8px", color: "#4B5563" },
                  p: { fontSize: "13px", lineHeight: "1.7", color: "#4B5563", marginBottom: "10px" },
                  ul: { paddingLeft: "16px", marginBottom: "10px" },
                  ol: { paddingLeft: "16px", marginBottom: "10px" },
                  li: { fontSize: "13px", lineHeight: "1.7", color: "#4B5563", marginBottom: "4px" },
                  strong: { fontWeight: "600", color: "#111827" },
                  em: { fontStyle: "italic", color: "#6B7280" },
                  blockquote: {
                    borderLeft: "3px solid #E5E7EB",
                    paddingLeft: "12px",
                    margin: "12px 0",
                    color: "#6B7280",
                    fontStyle: "italic",
                  },
                }}
                dangerouslySetInnerHTML={{ __html: marked.parse(cleanContent) }}
              />
            </Box>
          );
        })}
      </SimpleGrid>
    </Box>
  );
}
