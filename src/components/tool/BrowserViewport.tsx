"use client";

import { Box, Flex, Spinner, Image } from "@chakra-ui/react";
import { Globe } from "lucide-react";
import { BrowserViewportProps } from "@/props/BrowserViewport";

export default function BrowserViewport({ imageUrl, status }: BrowserViewportProps) {
  return (
    <Box
      w="full"
      borderRadius="2xl"
      overflow="hidden"
      border="1px solid"
      borderColor="gray.200"
      bg="white"
      boxShadow="xl"
    >
      {/* Browser Header */}
      <Flex
        align="center"
        gap={2}
        px={4}
        py={3}
        bg="gray.50"
        borderBottom="1px solid"
        borderColor="gray.200"
      >
        <Flex gap={1.5}>
          <Box w={3} h={3} borderRadius="full" bg="red.500" />
          <Box w={3} h={3} borderRadius="full" bg="yellow.500" />
          <Box w={3} h={3} borderRadius="full" bg="green.500" />
        </Flex>
        <Box
          flex={1}
          ml={4}
          px={3}
          py={1.5}
          bg="white"
          borderRadius="md"
          border="1px solid"
          borderColor="gray.200"
          display="flex"
          alignItems="center"
          gap={2}
        >
          <Globe size={12} color="#9CA3AF" />
          <Box flex={1} fontSize="xs" color="gray.400" fontFamily="mono">
            {status === "idle" ? "Waiting to start..." : "Analyzing brand..."}
          </Box>
        </Box>
      </Flex>

      {/* Browser Content */}
      <Box position="relative" aspectRatio="16/9" bg="gray.800">
        {imageUrl ? (
          <>
            <Image
              src={imageUrl ? `data:image/jpeg;base64,${imageUrl}` : undefined}
              w="full"
              h="full"
              objectFit="contain"
              animation="fadeIn 0.5s ease-in"
            />
            {status === "browsing" && (
              <Box
                position="absolute"
                inset={0}
                bg="blackAlpha.600"
                display="flex"
                alignItems="center"
                justifyContent="center"
              >
                <Spinner
                  size="xl"
                  color="blue.500"
                  borderWidth="3px"
                  animationDuration="0.65s"
                />
              </Box>
            )}
          </>
        ) : (
          <Flex
            direction="column"
            align="center"
            justify="center"
            h="full"
            color="gray.500"
          >
            <Globe size={48} strokeWidth={1} color="#6B7280" />
            <Box mt={4} fontSize="sm" fontWeight="medium" color="gray.400">
              {status === "idle" ? "Waiting for Agent to Connect..." : "Loading..."}
            </Box>
          </Flex>
        )}
      </Box>
    </Box>
  );
}
