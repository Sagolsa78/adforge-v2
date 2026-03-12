"use client";

import { Flex, Box, Text, HStack, VStack } from "@chakra-ui/react";
import { Check } from "lucide-react";

import { TOOL_STEPS } from "@/config";

const STEPS = TOOL_STEPS;

interface Props {
  curStep: number;
  maxReached: number;
  onNav: (step: number) => void;
}

export default function StepBar({ curStep, maxReached, onNav }: Props) {
  return (
    <Box
      data-testid="step-bar"
      w="100%"
      bg="white"
      borderBottom="1px solid"
      borderColor="gray.100"
      position="sticky"
      top="100px"
      zIndex="10"
      px={4}
      py={3}
    >
      <Flex
        maxW="900px"
        mx="auto"
        align="center"
        justify="space-between"
        overflowX="auto"
        css={{
          "&::-webkit-scrollbar": { display: "none" },
          msOverflowStyle: "none",
          scrollbarWidth: "none",
        }}
      >
        {STEPS.map((label, i) => {
          const n = i + 1;
          const done = n < curStep;
          const active = n === curStep;
          const reachable = n <= maxReached && n !== curStep;
          const isFuture = !done && !active && !reachable;

          let circleColor = "gray.400";
          let circleBg = "white";
          let circleBorder = "gray.300";

          if (active) {
            circleColor = "white";
            circleBg = "#8a2ce2";
            circleBorder = "#8a2ce2";
          } else if (done) {
            circleColor = "white";
            circleBg = "#059669";
            circleBorder = "#059669";
          } else if (reachable) {
            circleColor = "#8a2ce2";
            circleBorder = "#8a2ce2";
          }

          return (
            <HStack key={n} gap={0} flex="1" justify="center" position="relative" minW="100px">
              <VStack
                as="button"
                aria-label={label}
                gap={1}
                onClick={() => (done || reachable) && onNav(n)}
                cursor={(done || reachable) ? "pointer" : "default"}
                opacity={isFuture ? 0.4 : 1}
                transition="all 0.2s"
                _hover={(done || reachable) ? { transform: "translateY(-1px)" } : {}}
              >
                <Flex
                  w="28px"
                  h="28px"
                  rounded="full"
                  border="2px solid"
                  borderColor={circleBorder}
                  bg={circleBg}
                  color={circleColor}
                  align="center"
                  justify="center"
                  fontSize="xs"
                  fontWeight="bold"
                  transition="all 0.2s"
                >
                  {done ? <Check size={13} strokeWidth={3} /> : n}
                </Flex>
                <Text
                  fontSize="10px"
                  fontWeight={active ? "700" : "medium"}
                  color={active ? "#8a2ce2" : "gray.500"}
                  textAlign="center"
                  whiteSpace="nowrap"
                  display={{ base: "none", sm: "block" }}
                >
                  {label}
                </Text>
              </VStack>
              {n < 7 && (
                <Box
                  position="absolute"
                  top="14px"
                  left="calc(50% + 14px)"
                  right="calc(-50% + 14px)"
                  h="2px"
                  bg={done ? "#059669" : "gray.200"}
                  zIndex="-1"
                  transition="background 0.3s"
                />
              )}
            </HStack>
          );
        })}
      </Flex>
    </Box>
  );
}
