"use client";

import { Box, Flex, Text } from "@chakra-ui/react";
import { CreativesShellProps } from "@/props/CreativesShell";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";

/**
 * CreativesShell Component
 * Provides the base layout for the creatives page.
 */
export default function CreativesShell({ brandId }: CreativesShellProps) {
  return (
    <Box bg="white" minH="100vh">
      <Navbar />
      
      <Flex
        direction="column"
        align="center"
        justify="center"
        py={20}
        px={4}
      >
        <Text fontSize="2xl" fontWeight="700" color="#111111" mb={4}>
          Creatives
        </Text>
        <Text fontSize="md" color="#6B7280" textAlign="center" maxW="md">
          {brandId 
            ? "Create and manage your brand creatives here." 
            : "Select a brand to start creating creatives."}
        </Text>
      </Flex>

      <Footer />
    </Box>
  );
}
