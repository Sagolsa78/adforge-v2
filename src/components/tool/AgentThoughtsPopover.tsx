"use client";

import { Box, Flex, Text, VStack, HStack } from "@chakra-ui/react";
import { Terminal, X, Sparkles } from "lucide-react";
import { AgentThoughtsPopoverProps } from "@/props/AgentThoughtsPopover";
import { STATUS_COLORS } from "@/constants/page2";

export default function AgentThoughtsPopover({ thoughts, status, onClose }: AgentThoughtsPopoverProps) {
  const getStatusColor = () => {
    return STATUS_COLORS[status] || "gray";
  };

  return (
    <Box
      position="absolute"
      top={4}
      right={4}
      w="320px"
      maxH="280px"
      bg="white"
      borderRadius="xl"
      boxShadow="2xl"
      zIndex={20}
      border="1px solid"
      borderColor="gray.200"
      overflow="hidden"
      animation="popoverSlideIn 0.3s ease-out"
    >
      {/* Header with accent glow */}
      <Flex
        align="center"
        justify="space-between"
        px={4}
        py={2.5}
        bg={`linear-gradient(135deg, ${getStatusColor()}.50 0%, white 100%)`}
        borderBottom="1px solid"
        borderColor="gray.100"
      >
        <HStack gap={2}>
          <Box
            p={1}
            borderRadius="md"
            bg={`${getStatusColor()}.100`}
            color={`${getStatusColor()}.600`}
          >
            <Terminal size={14} />
          </Box>
          <Text fontSize="xs" fontWeight="bold" color="gray.700" textTransform="uppercase" letterSpacing="wide">
            Agent Thinking
          </Text>
        </HStack>
        <Box
          as="button"
          onClick={onClose}
          w={5}
          h={5}
          borderRadius="md"
          display="flex"
          alignItems="center"
          justifyContent="center"
          _hover={{ bg: "gray.100" }}
          transition="all 0.2s"
        >
          <X size={12} color="#6B7280" />
        </Box>
      </Flex>

      {/* Thoughts Content */}
      <Box
        p={4}
        fontFamily="mono"
        fontSize="xs"
        overflowY="auto"
        maxH="200px"
        bg="white"
        css={{
          "&::-webkit-scrollbar": { width: "4px" },
          "&::-webkit-scrollbar-track": { bg: "transparent" },
          "&::-webkit-scrollbar-thumb": { bg: "#E5E7EB", borderRadius: "2px" },
        }}
      >
        <VStack align="stretch" gap={2}>
          {thoughts.slice(-5).map((thought, idx) => {
            const isLatest = idx === thoughts.slice(-5).length - 1;
            return (
              <Flex
                key={idx}
                align="flex-start"
                gap={2}
                p={2}
                borderRadius="md"
                bg={isLatest ? `${getStatusColor()}.50` : "transparent"}
                border={isLatest ? `1px solid ${getStatusColor()}.200` : "1px solid transparent"}
              >
                <Box
                  w={1.5}
                  h={1.5}
                  borderRadius="full"
                  bg={isLatest ? `${getStatusColor()}.500` : "gray.300"}
                  flexShrink={0}
                  mt={1}
                />
                <Text
                  color={isLatest ? "gray.900" : "gray.500"}
                  fontSize="xs"
                  lineHeight="relaxed"
                  fontWeight={isLatest ? "medium" : "normal"}
                >
                  {thought}
                </Text>
              </Flex>
            );
          })}
          {thoughts.length === 0 && (
            <Text color="gray.400" fontSize="xs" fontStyle="italic">
              Initializing...
            </Text>
          )}
        </VStack>
      </Box>

      {/* Status indicator at bottom */}
      <Flex
        align="center"
        justify="center"
        gap={2}
        px={4}
        py={2}
        bg="gray.50"
        borderTop="1px solid"
        borderColor="gray.100"
      >
        <Sparkles size={10} color={`${getStatusColor()}.500`} />
        <Text fontSize="9px" color="gray.500" fontWeight="medium" textTransform="uppercase">
          {status}
        </Text>
      </Flex>
    </Box>
  );
}
