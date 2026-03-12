"use client";

import { useEffect, useState } from "react";
import { Box, Flex, Text, VStack, Spinner, HStack, Button } from "@chakra-ui/react";
import { Check } from "lucide-react";
import { createBrandStream } from "@/lib/api";
import { savePendingBrandId } from "@/lib/delayedAuth";
import { ANALYSIS_PROGRESS_STEPS } from "@/config";

const STEPS = ANALYSIS_PROGRESS_STEPS;

interface Props {
  url: string;
  brandName?: string;
  token?: string;
  onDone: () => void;
  onBack: () => void;
}

export default function BrandAnalysis({ url, brandName, token, onDone, onBack }: Props) {
  const [progress, setProgress] = useState(0);
  const [activeStep, setActiveStep] = useState(0);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  useEffect(() => {
    let active = true;

    async function processStream() {
      try {
        const stream = createBrandStream(url, brandName || "", token);

        for await (const data of stream) {
          if (!active) break;

          if (data.progress !== undefined) {
            setProgress(data.progress);
          }

          if (data.step === "brand_created" && data.brand_id) {
            savePendingBrandId(data.brand_id);
          } else if (data.step === "completed" || (data.progress ?? 0) >= 100) {
            setProgress(100);
            setActiveStep(4);
            setTimeout(() => {
              if (active) onDone();
            }, 600);
            break;
          } else if (
            data.step === "error" ||
            data.step === "orchestration_error"
          ) {
            setErrorMsg(data.message || "An error occurred during analysis.");
            break;
          }

          if (data.step === "scraping_started") setActiveStep(0);
          if (data.step === "extracting_signals") setActiveStep(1);
          if (data.step === "analysing_tone") setActiveStep(2);
          if (data.step === "generating_contexts") setActiveStep(3);
        }
      } catch (err: unknown) {
        if (active) {
          const error = err as { message?: string };
          setErrorMsg(
            error.message || "Failed to connect to the analysis stream."
          );
        }
      }
    }

    processStream();

    return () => {
      active = false;
    };
  }, [url, brandName, token, onDone]);

  return (
    <Flex
      minH="calc(100vh - 140px)"
      align="center"
      justify="center"
      position="relative"
      w="full"
      px={4}
      py={12}
    >
      {/* Background blobs */}
      <Box position="absolute" top="-10%" left="-5%" w="400px" h="400px" bg="#e0e7ff" rounded="full" filter="blur(80px)" opacity={0.5} pointerEvents="none" />
      <Box position="absolute" bottom="-10%" right="-5%" w="400px" h="400px" bg="#fae8ff" rounded="full" filter="blur(80px)" opacity={0.5} pointerEvents="none" />

      <Box position="relative" zIndex="1" w="full" maxW="480px" mx="auto" textAlign="center">
        <Flex justify="center" mb={6}>
          {errorMsg ? (
            <Box
              w="12"
              h="12"
              rounded="full"
              bg="red.50"
              color="red.500"
              display="flex"
              alignItems="center"
              justifyContent="center"
              fontSize="2xl"
              fontWeight="bold"
            >
              !
            </Box>
          ) : (
            <Spinner
              size="lg"
              color="#8a2ce2"
              borderWidth="3px"
              animationDuration="0.65s"
            />
          )}
        </Flex>

        <Text
          fontSize="2xl"
          fontWeight="black"
          color="#111827"
          letterSpacing="tight"
          mb={1}
        >
          {errorMsg ? "Analysis Failed" : "Analysing Your Brand"}
        </Text>

        <Text color="#6b7280" fontSize="sm" fontWeight="medium" mb={6}>
          {url}
        </Text>

        {errorMsg && (
          <VStack gap={4} mb={8}>
            <Text color="red.500" fontSize="sm" fontWeight="bold">
              {errorMsg}
            </Text>
            <Button
              onClick={onBack}
              size="md"
              bg="white"
              border="1px solid"
              borderColor="gray.200"
              rounded="full"
              px={8}
              _hover={{ bg: "gray.50" }}
            >
              Go Back & Try Again
            </Button>
          </VStack>
        )}

        {/* Progress bar */}
        {!errorMsg && (
          <Box w="full" h="4px" bg="gray.100" rounded="full" overflow="hidden" mb={8}>
            <Box
              h="full"
              bg="#8a2ce2"
              w={`${progress}%`}
              transition="width 0.1s linear"
            />
          </Box>
        )}

        {/* Steps card */}
        <Box
          bg="white"
          border="1px solid"
          borderColor="gray.100"
          rounded="2xl"
          p={6}
          boxShadow="0 4px 20px rgba(0,0,0,0.06)"
          textAlign="left"
        >
          <VStack align="stretch" gap={4}>
            {STEPS.map((label, i) => {
              const isActive = i === activeStep;
              const isDone = i < activeStep;

              let color = "gray.300";
              let weight: "medium" | "bold" = "medium";
              let iconBg = "gray.100";
              let iconColor = "gray.400";
              let iconBorder = "transparent";

              if (isActive) {
                color = "#111827";
                weight = "bold";
                iconBg = "rgba(138,44,226,0.08)";
                iconColor = "#8a2ce2";
                iconBorder = "rgba(138,44,226,0.3)";
              } else if (isDone) {
                color = "gray.600";
                iconBg = "#059669";
                iconColor = "white";
                iconBorder = "#059669";
              }

              return (
                <HStack
                  key={i}
                  gap={3}
                  opacity={!isActive && !isDone ? 0.5 : 1}
                  transition="all 0.3s"
                >
                  <Flex
                    w="22px"
                    h="22px"
                    rounded="full"
                    bg={iconBg}
                    color={iconColor}
                    border="1px solid"
                    borderColor={iconBorder}
                    align="center"
                    justify="center"
                    shrink={0}
                    fontSize="11px"
                    fontWeight="bold"
                  >
                    {isDone ? <Check size={12} strokeWidth={3} /> : i + 1}
                  </Flex>
                  <Text fontSize="14px" fontWeight={weight} color={color}>
                    {label}
                  </Text>
                </HStack>
              );
            })}
          </VStack>
        </Box>
      </Box>
    </Flex>
  );
}
