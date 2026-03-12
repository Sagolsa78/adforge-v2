"use client";

import { Box, Flex, Text, VStack, HStack } from "@chakra-ui/react";
import { Terminal, X } from "lucide-react";
import { AgentThoughtsPopupProps } from "@/props/AgentThoughtsPopup";
import { STATUS_COLORS } from "@/constants/page2";

export default function AgentThoughtsPopup({ thoughts, status, isOpen, onClose }: AgentThoughtsPopupProps) {
  if (!isOpen) return null;

  const getStatusColor = () => {
    return STATUS_COLORS[status] || "gray";
  };

  const getStatusLabel = () => {
    return status.toUpperCase();
  };

  return (
    <Box
      position="fixed"
      bottom={6}
      right={6}
      w="400px"
      maxH="500px"
      bg="white"
      borderRadius="2xl"
      boxShadow="2xl"
      zIndex="sticky"
      border="1px solid"
      borderColor="gray.200"
      overflow="hidden"
      animation="slideIn 0.3s ease-out"
    >
      {/* Header */}
      <Flex
        align="center"
        justify="space-between"
        px={4}
        py={3}
        bg="gray.50"
        borderBottom="1px solid"
        borderColor="gray.200"
      >
        <HStack gap={2}>
          <Box
            w={2}
            h={2}
            borderRadius="full"
            bg={`${getStatusColor()}.500`}
            animation="pulse 2s infinite"
          />
          <Text fontSize="xs" fontWeight="bold" color="gray.600" textTransform="uppercase" letterSpacing="wide">
            Agent Thoughts
          </Text>
          <Box
            px={2}
            py={0.5}
            borderRadius="full"
            bg={`${getStatusColor()}.100`}
            borderWidth="1px"
            borderColor={`${getStatusColor()}.300`}
          >
            <Text fontSize="9px" fontWeight="bold" color={`${getStatusColor()}.700`}>
              {getStatusLabel()}
            </Text>
          </Box>
        </HStack>
        <Box
          as="button"
          onClick={onClose}
          w={6}
          h={6}
          borderRadius="md"
          display="flex"
          alignItems="center"
          justifyContent="center"
          _hover={{ bg: "gray.100" }}
          transition="all 0.2s"
        >
          <X size={14} color="#6B7280" />
        </Box>
      </Flex>

      {/* Terminal Content */}
      <Box
        p={4}
        fontFamily="mono"
        fontSize="sm"
        overflowY="auto"
        maxH="400px"
        bg="white"
        css={{
          "&::-webkit-scrollbar": { width: "6px" },
          "&::-webkit-scrollbar-track": { bg: "transparent" },
          "&::-webkit-scrollbar-thumb": { bg: "#D1D5DB", borderRadius: "3px" },
        }}
      >
        <VStack align="stretch" gap={2}>
          {thoughts.length === 0 ? (
            <Text color="gray.500" fontSize="sm">
              &gt; Initializing Discovery Agent...
            </Text>
          ) : (
            thoughts.map((thought, idx) => (
              <Text
                key={idx}
                color={idx === thoughts.length - 1 ? "emerald.600" : "gray.700"}
                fontSize="sm"
                lineHeight="relaxed"
                animation={idx === thoughts.length - 1 ? "fadeIn 0.3s ease-in" : "none"}
              >
                &gt; {thought}
              </Text>
            ))
          )}
          {status === "browsing" && (
            <Text color="blue.600" fontSize="sm">
              &gt; <span className="typing">Analyzing brand identity</span>
            </Text>
          )}
        </VStack>
      </Box>
    </Box>
  );
}
