"use client";

import {
  Box,
  Button,
  Flex,
  Heading,
  Text,
  VStack,
  SimpleGrid,
} from "@chakra-ui/react";
import { motion } from "framer-motion";
import Link from "next/link";
import { Check, Zap, ArrowRight } from "lucide-react";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const MotionBox = motion.create(Box as any);
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const MotionFlex = motion.create(Flex as any);

export default function HeroSection() {
  return (
    <Box
      as="section"
      pt={{ base: 24, md: 32 }}
      pb={{ base: 16, md: 20 }}
      bg="white"
      overflow="hidden"
      style={{ textAlign: "center" }}
    >
      {/* Subtle dot grid */}
      <Box
        position="absolute"
        inset={0}
        bgImage="radial-gradient(circle at 1px 1px, rgba(0,0,0,0.05) 1px, transparent 0)"
        bgSize="28px 28px"
        pointerEvents="none"
        zIndex={0}
      />

      <div
        style={{
          maxWidth: "760px",
          margin: "0 auto",
          padding: "0 24px",
          position: "relative",
          zIndex: 1,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          textAlign: "center",
          gap: "32px",
        }}
      >
        {/* Pill badge */}
        <MotionBox
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45 }}
        >
          <Flex
            display="inline-flex"
            align="center"
            gap={2}
            px={4}
            py={1.5}
            bg="blue.50"
            border="1px solid"
            borderColor="blue.100"
            borderRadius="full"
          >
            <Box w={2} h={2} bg="blue.500" borderRadius="full" flexShrink={0} />
            <Text
              fontSize="sm"
              fontWeight="600"
              color="blue.700"
              letterSpacing="0.01em"
            >
              Instagram-only AI content workspace
            </Text>
          </Flex>
        </MotionBox>

        {/* Headline */}
        <MotionBox
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45, delay: 0.08 }}
        >
          <Heading
            as="h1"
            fontSize={{ base: "4xl", sm: "5xl", md: "6xl", lg: "7xl" }}
            fontWeight="800"
            lineHeight="1.0"
            letterSpacing="-0.04em"
            color="gray.900"
            textAlign="center"
            mx="auto"
          >
            Turn your website into{" "}
            <Box as="span" color="blue.600">
              30 days of Instagram content
            </Box>
          </Heading>
        </MotionBox>

        {/* Sub-copy */}
        <MotionBox
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45, delay: 0.14 }}
        >
          <Text
            fontSize={{ base: "md", md: "lg" }}
            color="gray.500"
            lineHeight="1.75"
            maxW="480px"
            mx="auto"
            textAlign="center"
          >
            Paste your URL. Get reel hooks, carousel ideas, captions, CTAs, and
            hashtags — all in one clean workflow, in under 60 seconds.
          </Text>
        </MotionBox>

        {/* CTA buttons */}
        <MotionFlex
          direction={{ base: "column", sm: "row" }}
          gap={3}
          justify="center"
          align="center"
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45, delay: 0.2 }}
        >
          <Link href="/onboarding">
            <Button
              h="52px"
              px={8}
              fontSize="md"
              fontWeight="700"
              bg="blue.600"
              color="white"
              borderRadius="14px"
              _hover={{
                bg: "blue.700",
                transform: "translateY(-2px)",
                boxShadow: "0 10px 24px rgba(37,99,235,0.3)",
              }}
              _active={{ transform: "translateY(0)" }}
              transition="all 0.2s"
              gap={2}
            >
              Start for free
              <ArrowRight size={16} />
            </Button>
          </Link>
          <Button
            h="52px"
            px={8}
            fontSize="md"
            fontWeight="600"
            variant="outline"
            borderColor="gray.200"
            bg="white"
            color="gray.700"
            borderRadius="14px"
            _hover={{ bg: "gray.50", borderColor: "gray.300" }}
            transition="all 0.2s"
          >
            See how it works
          </Button>
        </MotionFlex>

        {/* Trust row */}
        <MotionFlex
          gap={{ base: 4, sm: 8 }}
          justify="center"
          align="center"
          wrap="wrap"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.35 }}
        >
          {[
            "No credit card required",
            "30 posts in one run",
            "Built only for Instagram",
          ].map((item) => (
            <Flex key={item} align="center" gap={1.5}>
              <Check size={14} color="#2563EB" strokeWidth={2.5} />
              <Text fontSize="sm" fontWeight="500" color="gray.500">
                {item}
              </Text>
            </Flex>
          ))}
        </MotionFlex>
      </div>

      {/* Dashboard mockup — wider than text */}
      <MotionBox
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.65, delay: 0.3 }}
        position="relative"
        maxW="1000px"
        mx="auto"
        mt={16}
        px={{ base: 4, md: 8 }}
        zIndex={1}
      >
        {/* Blue glow */}
        <Box
          position="absolute"
          top="15%"
          left="15%"
          right="15%"
          bottom="-5%"
          bg="blue.400"
          opacity={0.07}
          filter="blur(72px)"
          borderRadius="full"
          pointerEvents="none"
        />

        {/* Browser shell */}
        <Box
          position="relative"
          bg="white"
          border="1px solid"
          borderColor="gray.200"
          borderRadius={{ base: "16px", md: "24px" }}
          overflow="hidden"
          boxShadow="0 24px 64px rgba(0,0,0,0.10), 0 1px 0 rgba(0,0,0,0.04)"
          zIndex={1}
        >
          {/* Browser top bar */}
          <Flex
            h="42px"
            bg="#F4F4F2"
            borderBottom="1px solid"
            borderColor="gray.200"
            align="center"
            px={4}
            gap={2}
          >
            <Box w={3} h={3} borderRadius="full" bg="#FF5F57" />
            <Box w={3} h={3} borderRadius="full" bg="#FEBC2E" />
            <Box w={3} h={3} borderRadius="full" bg="#28C840" />
            <Box
              flex={1}
              maxW="280px"
              mx={4}
              h="22px"
              bg="white"
              borderRadius="full"
              border="1px solid"
              borderColor="gray.200"
            />
          </Flex>

          {/* App layout */}
          <Flex h={{ base: "320px", sm: "380px", md: "440px" }}>
            {/* Sidebar */}
            <Box
              w="196px"
              flexShrink={0}
              borderRight="1px solid"
              borderColor="gray.100"
              p={4}
              bg="#FAFAF9"
              display={{ base: "none", md: "flex" }}
              flexDirection="column"
              gap={1}
            >
              <Box h="26px" w="100px" bg="gray.200" borderRadius="md" mb={5} />
              <Flex
                align="center"
                gap={3}
                px={3}
                py={2.5}
                bg="blue.50"
                borderRadius="lg"
              >
                <Box
                  w={4}
                  h={4}
                  bg="blue.200"
                  borderRadius="sm"
                  flexShrink={0}
                />
                <Box h="11px" w="52px" bg="blue.200" borderRadius="sm" />
              </Flex>
              {[56, 44, 64, 48, 36, 52].map((w, i) => (
                <Flex key={i} align="center" gap={3} px={3} py={2.5}>
                  <Box
                    w={4}
                    h={4}
                    bg="gray.100"
                    borderRadius="sm"
                    flexShrink={0}
                  />
                  <Box h="11px" bg="gray.100" borderRadius="sm" w={`${w}px`} />
                </Flex>
              ))}
            </Box>

            {/* Main content area */}
            <Box flex={1} p={{ base: 4, md: 6 }} overflowY="hidden" bg="white">
              {/* Header */}
              <Flex justify="space-between" align="center" mb={5}>
                <Box>
                  <Box
                    h="16px"
                    w="130px"
                    bg="gray.800"
                    borderRadius="md"
                    mb={2}
                    opacity={0.85}
                  />
                  <Box h="11px" w="170px" bg="gray.200" borderRadius="sm" />
                </Box>
                <Box px={3} py={1.5} bg="#ECFDF5" borderRadius="full">
                  <Box h="10px" w="80px" bg="#6EE7B7" borderRadius="sm" />
                </Box>
              </Flex>

              {/* Stat cards */}
              <SimpleGrid columns={{ base: 2, sm: 3 }} gap={3} mb={5}>
                {[
                  { label: "Captions Ready", val: "30" },
                  { label: "Approved", val: "18" },
                  { label: "Scheduled", val: "12" },
                ].map((s) => (
                  <Box
                    key={s.label}
                    bg="#FAFAF9"
                    p={{ base: 3, md: 4 }}
                    borderRadius="xl"
                    border="1px solid"
                    borderColor="gray.100"
                  >
                    <Box
                      h="9px"
                      w="56px"
                      bg="gray.200"
                      borderRadius="sm"
                      mb={2}
                    />
                    <Box
                      h="20px"
                      w="28px"
                      bg="gray.700"
                      borderRadius="sm"
                      opacity={0.8}
                    />
                  </Box>
                ))}
              </SimpleGrid>

              {/* Content rows */}
              <VStack gap={2} align="stretch">
                {[
                  { type: "Reel", bg: "#EFF6FF", fg: "#3B82F6" },
                  { type: "Carousel", bg: "#F0FDF4", fg: "#16A34A" },
                  { type: "Post", bg: "#FFF7ED", fg: "#EA580C" },
                ].map((row) => (
                  <Flex
                    key={row.type}
                    bg="white"
                    p={{ base: 2.5, md: 3 }}
                    borderRadius="xl"
                    border="1px solid"
                    borderColor="gray.100"
                    align="center"
                    justify="space-between"
                    gap={3}
                  >
                    <Flex align="center" gap={3}>
                      <Box
                        px={3}
                        py={1}
                        bg={row.bg}
                        borderRadius="full"
                        fontSize="11px"
                        fontWeight="700"
                        color={row.fg}
                        whiteSpace="nowrap"
                        flexShrink={0}
                      >
                        {row.type}
                      </Box>
                      <Box>
                        <Box
                          h="11px"
                          w={{ base: "80px", md: "180px" }}
                          bg="gray.200"
                          borderRadius="sm"
                          mb={1.5}
                        />
                        <Box
                          h="9px"
                          w={{ base: "60px", md: "140px" }}
                          bg="gray.100"
                          borderRadius="sm"
                        />
                      </Box>
                    </Flex>
                    <Box
                      h="11px"
                      w="40px"
                      bg="blue.200"
                      borderRadius="sm"
                      flexShrink={0}
                    />
                  </Flex>
                ))}
              </VStack>
            </Box>
          </Flex>
        </Box>

        {/* Floating speed badge */}
        <MotionBox
          animate={{ y: [0, -7, 0] }}
          transition={{ duration: 3.5, repeat: Infinity, ease: "easeInOut" }}
          position="absolute"
          top="-18px"
          right={{ base: "12px", md: "48px" }}
          bg="blue.600"
          px={4}
          py={3}
          borderRadius="16px"
          color="white"
          boxShadow="0 12px 32px rgba(37,99,235,0.35)"
          zIndex={10}
        >
          <Flex align="center" gap={2.5}>
            <Flex
              w={8}
              h={8}
              bg="whiteAlpha.300"
              borderRadius="lg"
              align="center"
              justify="center"
              flexShrink={0}
            >
              <Zap size={15} fill="currentColor" />
            </Flex>
            <Box style={{ textAlign: "left" }}>
              <Text
                fontSize="9px"
                fontWeight="700"
                opacity={0.75}
                letterSpacing="0.07em"
                mb={0.5}
              >
                GENERATION TIME
              </Text>
              <Text fontSize="sm" fontWeight="800" lineHeight={1}>
                30 days in 30 mins
              </Text>
            </Box>
          </Flex>
        </MotionBox>
      </MotionBox>
    </Box>
  );
}
