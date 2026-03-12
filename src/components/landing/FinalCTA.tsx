"use client";

import { Box, Flex, Heading, Text } from "@chakra-ui/react";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const MotionBox = motion.create(Box as React.ComponentType<any>);
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const MotionFlex = motion.create(Flex as React.ComponentType<any>);

export default function FinalCTA() {
  return (
    <Box
      as="section"
      py={{ base: "12", md: "24" }}
      px={{ base: "4", md: "6" }}
      position="relative"
      overflow="hidden"
    >
      <MotionBox
        maxW="5xl"
        mx="auto"
        textAlign="center"
        position="relative"
        zIndex="1"
        bg="linear-gradient(135deg, #1e1b4b 0%, #312e81 40%, #4c1d95 100%)"
        py={{ base: "14", md: "20" }}
        px={{ base: "6", md: "16" }}
        rounded={{ base: "2xl", md: "3xl" }}
        overflow="hidden"
        initial={{ opacity: 0, y: 40, scale: 0.98 }}
        whileInView={{ opacity: 1, y: 0, scale: 1 }}
        viewport={{ once: true, amount: 0.15 }}
        transition={{ duration: 0.85, ease: [0.22, 1, 0.36, 1] }}
      >
        {/* Decorative blurs */}
        <Box
          position="absolute"
          top="-60px"
          right="-60px"
          w={{ base: "120px", md: "200px" }}
          h={{ base: "120px", md: "200px" }}
          bg="linear-gradient(135deg, #8b5cf6, #c084fc)"
          rounded="full"
          filter="blur(60px)"
          opacity="0.4"
        />
        <Box
          position="absolute"
          bottom="-40px"
          left="-40px"
          w={{ base: "100px", md: "160px" }}
          h={{ base: "100px", md: "160px" }}
          bg="linear-gradient(135deg, #6d28d9, #a78bfa)"
          rounded="full"
          filter="blur(50px)"
          opacity="0.3"
        />
        <Box
          position="absolute"
          inset="0"
          opacity="0.05"
          bgImage="radial-gradient(circle, white 1px, transparent 1px)"
          bgSize="24px 24px"
        />

        <Box position="relative" zIndex="2">
          <Flex justify="center" mb={{ base: "4", md: "6" }}>
            <Box
              px={{ base: "3", md: "4" }}
              py="1.5"
              bg="whiteAlpha.200"
              color="white"
              rounded="full"
              fontSize={{ base: "xs", md: "sm" }}
              fontWeight="600"
              backdropFilter="blur(8px)"
            >
              🚀 Start Your First Campaign Today
            </Box>
          </Flex>
          <Heading
            as="h2"
            fontSize={{ base: "3xl", sm: "4xl", md: "5xl" }}
            fontWeight="800"
            color="white"
            mb={{ base: "4", md: "5" }}
            lineHeight="1.15"
          >
            From URL to live campaign{" "}
            <Box
              as="span"
              bgGradient="to-r"
              gradientFrom="#c084fc"
              gradientTo="#f472b6"
            >
              in minutes.
            </Box>
          </Heading>
          <Text
            color="whiteAlpha.800"
            fontSize={{ base: "sm", md: "lg" }}
            mb={{ base: "8", md: "10" }}
            maxW="lg"
            mx="auto"
          >
            Enter your website URL, get a brand analysis report, generate
            targeted ad creatives, and schedule your campaign across all
            platforms — automatically.
          </Text>
          <MotionFlex
            justify="center"
            gap={{ base: "3", md: "4" }}
            direction={{ base: "column", sm: "row" }}
            align="center"
          >
            <MotionBox
              as="button"
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.97 }}
              bg="white"
              color="#4c1d95"
              px={{ base: "6", md: "8" }}
              py={{ base: "3.5", md: "4" }}
              rounded="full"
              fontSize={{ base: "sm", md: "md" }}
              fontWeight="700"
              display="inline-flex"
              alignItems="center"
              justifyContent="center"
              gap="2"
              boxShadow="0 4px 20px rgba(0,0,0,0.2)"
              cursor="pointer"
              _hover={{ bg: "gray.50" }}
              w={{ base: "full", sm: "auto" }}
            >
              Analyze My Brand
              <ArrowRight size={18} />
            </MotionBox>
            <MotionBox
              as="button"
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.97 }}
              bg="transparent"
              color="white"
              px={{ base: "6", md: "8" }}
              py={{ base: "3.5", md: "4" }}
              rounded="full"
              fontSize={{ base: "sm", md: "md" }}
              fontWeight="600"
              border="1px solid"
              borderColor="whiteAlpha.400"
              cursor="pointer"
              _hover={{ bg: "whiteAlpha.100" }}
              w={{ base: "full", sm: "auto" }}
            >
              See How It Works
            </MotionBox>
          </MotionFlex>
          <Text
            color="whiteAlpha.500"
            fontSize="xs"
            mt={{ base: "5", md: "6" }}
          >
            No credit card required · Free to start · First campaign in minutes
          </Text>
        </Box>
      </MotionBox>
    </Box>
  );
}
