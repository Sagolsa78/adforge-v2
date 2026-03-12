"use client";

import { useEffect, useState } from "react";
import { Box, Flex, Text, VStack, Spinner } from "@chakra-ui/react";
import { Check } from "lucide-react";

const STEPS = [
  "Loading selected context",
  "Applying template structure",
  "Composing slides",
  "Writing caption & hashtags",
  "Generating image prompts",
  "Finalising output",
];

interface Props {
  onDone: () => void;
}

export default function Page6Generating({ onDone }: Props) {
  const [progress, setProgress] = useState(0);
  const [activeStep, setActiveStep] = useState(0);

  useEffect(() => {
    const dur = 5000;
    const start = Date.now();
    const iv = setInterval(() => {
      const elapsed = Date.now() - start;
      const pct = Math.min((elapsed / dur) * 100, 100);
      setProgress(pct);
      setActiveStep(Math.min(Math.floor((elapsed / dur) * 6), 5));
      if (elapsed >= dur) {
        clearInterval(iv);
        setTimeout(onDone, 400);
      }
    }, 60);
    return () => clearInterval(iv);
  }, [onDone]);

  return (
    <Box w="full" px={4} minH="calc(100vh - 140px)" display="flex" alignItems="center" justifyContent="center" position="relative" overflow="hidden">
      {/* Background blobs */}
      <Box position="absolute" top="-10%" left="-5%" w="400px" h="400px" bg="#e0e7ff" rounded="full" filter="blur(80px)" opacity={0.5} pointerEvents="none" />
      <Box position="absolute" bottom="-10%" right="-5%" w="400px" h="400px" bg="#fae8ff" rounded="full" filter="blur(80px)" opacity={0.5} pointerEvents="none" />

      <Box position="relative" zIndex={1} w="full" maxW="400px" textAlign="center">
        <Flex justify="center" mb={6}>
          <Spinner boxSize="xl" color="#8a2ce2" borderWidth="3px" animationDuration="0.8s" />
        </Flex>

        <Text fontSize="2xl" fontWeight="black" letterSpacing="tight" mb={2} color="#111827">
          Generating Your Content
        </Text>
        <Text color="#6b7280" fontSize="sm" fontWeight="medium" mb={6}>
          Hang tight — crafting something great
        </Text>

        {/* Progress bar */}
        <Box w="full" bg="gray.100" h={2} rounded="full" overflow="hidden" mb={8}>
          <Box h="full" bg="#8a2ce2" w={`${progress}%`} transition="width 0.1s linear" />
        </Box>

        {/* Steps card */}
        <Box bg="white" p={{ base: 4, md: 6 }} rounded="2xl" boxShadow="0 4px 20px rgba(0,0,0,0.06)" border="1px solid" borderColor="gray.100" textAlign="left">
          <VStack align="stretch" gap={0}>
            {STEPS.map((label, i) => {
              const isPast = i < activeStep;
              const isCurrent = i === activeStep;
              const isFuture = i > activeStep;

              let color = "gray.400";
              let bg = "gray.50";
              let borderColor = "gray.200";

              if (isPast) {
                color = "#059669";
                bg = "rgba(5,150,105,0.08)";
                borderColor = "rgba(5,150,105,0.2)";
              } else if (isCurrent) {
                color = "#8a2ce2";
                bg = "rgba(138,44,226,0.08)";
                borderColor = "rgba(138,44,226,0.2)";
              }

              return (
                <Flex
                  key={i}
                  align="center"
                  gap={3}
                  p={2.5}
                  rounded="lg"
                  transition="all 0.3s"
                  opacity={isFuture ? 0.4 : 1}
                  bg={isCurrent ? "rgba(138,44,226,0.06)" : "transparent"}
                >
                  <Flex
                    w={6} h={6} shrink={0} rounded="full"
                    bg={bg} color={color}
                    border="1px solid" borderColor={borderColor}
                    align="center" justify="center" fontSize="xs" fontWeight="bold"
                  >
                    {isPast ? <Box as={Check} boxSize="12px" /> : i + 1}
                  </Flex>
                  <Text fontSize="sm" fontWeight={isCurrent ? "bold" : "medium"} color={isCurrent ? "#111827" : isPast ? "gray.700" : "gray.500"}>
                    {label}
                  </Text>
                </Flex>
              );
            })}
          </VStack>
        </Box>
      </Box>
    </Box>
  );
}
