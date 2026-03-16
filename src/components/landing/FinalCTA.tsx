"use client";

import { Box, Button, Flex, Heading, Text } from "@chakra-ui/react";
import Link from "next/link";

export default function FinalCTA() {
  return (
    <Box
      as="section"
      py={{ base: 14, md: 24 }}
      px={{ base: 4, md: 6 }}
      bg="#ffffff"
      color="white"
    >
      <Box
        maxW="6xl"
        mx="auto"
        borderRadius="40px"
        boxShadow="0 40px 100px rgba(79,70,229,0.15)"
        p={{ base: 8, md: 16 }}
        bg="#0A1E7A"
        textAlign="center"
        position="relative"
        overflow="hidden"
      >
        {/* Decorative elements */}
        <Box
          position="absolute"
          top="-10%"
          right="-10%"
          w="300px"
          h="300px"
          bg="blue.600"
          filter="blur(100px)"
          opacity={0.3}
          borderRadius="full"
        />
        <Box
          position="absolute"
          bottom="-10%"
          left="-10%"
          w="240px"
          h="240px"
          bg="blue.400"
          filter="blur(80px)"
          opacity={0.2}
          borderRadius="full"
        />

        <Box position="relative" zIndex={1}>
          <Text
            fontSize="sm"
            letterSpacing="0.2em"
            textTransform="uppercase"
            color="blue.200"
            fontWeight="700"
          >
            Ready to scale?
          </Text>
          <Heading
            mt={4}
            fontSize={{ base: "3xl", md: "5xl" }}
            fontWeight="800"
            lineHeight="1.2"
          >
            Turn your website into 30 days of <br /> Instagram content in
            minutes.
          </Heading>
          <Text
            mt={6}
            color="blue.100"
            maxW="700px"
            mx="auto"
            fontSize={{ base: "md", md: "lg" }}
          >
            Stop wasting hours on content creation. Let Plug and Play Agent
            handle the heavy lifting while you focus on growing your brand.
          </Text>
          <Flex mt={10} gap={4} flexWrap="wrap" justify="center">
            <Link href="/onboarding">
              <Button
                bg="#4F46E5"
                color="white"
                boxShadow="0 20px 50px rgba(79,70,229,0.4)"
                borderRadius="full"
                px={10}
                py={7}
                fontSize="lg"
                fontWeight="700"
                _hover={{
                  bg: "#4338CA",
                  transform: "translateY(-2px)",
                  boxShadow: "0 30px 60px rgba(79,70,229,0.45)",
                }}
                transition="all 0.2s"
              >
                Start Free Trial
              </Button>
            </Link>
            <Button
              variant="outline"
              borderColor="whiteAlpha.400"
              color="white"
              borderRadius="full"
              px={10}
              py={7}
              fontSize="lg"
              fontWeight="700"
              _hover={{ bg: "whiteAlpha.100", transform: "translateY(-2px)" }}
              transition="all 0.2s"
            >
              Watch Video
            </Button>
          </Flex>
          <Text mt={8} fontSize="sm" color="whiteAlpha.600" fontWeight="500">
            No credit card required · Instant setup · Cancel anytime
          </Text>
        </Box>
      </Box>
    </Box>
  );
}
