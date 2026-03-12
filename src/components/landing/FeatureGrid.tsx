"use client";

import { Box, Flex, Grid, Heading, Text, Icon } from "@chakra-ui/react";
import { motion } from "framer-motion";
import { ScanSearch, FileChartColumn, Sparkles, CalendarClock, Share2, BarChart3 } from "lucide-react";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const MotionBox = motion.create(Box as React.ComponentType<any>);
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const MotionGrid = motion.create(Grid as React.ComponentType<any>);

const containerVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.12 } },
};

const cardVariants = {
  hidden: { opacity: 0, y: 70, scale: 0.98 },
  visible: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.85, ease: [0.22, 1, 0.36, 1] } },
};

export default function FeatureGrid() {
  return (
    <Box as="section" py={{ base: "14", md: "24" }} px={{ base: "4", md: "6" }} bg="gray.50" id="features">
      <Box maxW="6xl" mx="auto">
        {/* Header */}
        <MotionBox
          textAlign="center"
          mb={{ base: "10", md: "16" }}
          initial={{ opacity: 0, y: 60, scale: 0.98 }}
          whileInView={{ opacity: 1, y: 0, scale: 1 }}
          viewport={{ once: true, amount: 0.15 }}
          transition={{ duration: 0.85, ease: [0.22, 1, 0.36, 1] }}
        >
          <Flex justify="center" mb="4">
            <Box px="4" py="1.5" bg="#ecfdf5" color="#059669" rounded="full" fontSize={{ base: "xs", md: "sm" }} fontWeight="600">
              Everything in one platform
            </Box>
          </Flex>
          <Heading as="h2" fontSize={{ base: "2xl", sm: "3xl", md: "5xl" }} fontWeight="800" mb="4" lineHeight="1.1" color="gray.900">
            Powerful features built for{" "}
            <Box as="span" color="#8a2ce2">modern marketers</Box>
          </Heading>
          <Text color="gray.500" fontSize={{ base: "sm", md: "lg" }} maxW="2xl" mx="auto">
            From deep brand analysis to automated campaign scheduling — AdForge gives you everything you need to run great ads.
          </Text>
        </MotionBox>

        {/* Bento Grid */}
        <MotionGrid
          templateColumns={{ base: "1fr", sm: "repeat(2, 1fr)", lg: "repeat(3, 1fr)" }}
          autoRows={{ base: "auto", md: "minmax(260px, auto)" }}
          gap={{ base: "4", md: "6" }}
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.1 }}
        >
          {/* Large card — 2 col, 2 row */}
          <MotionBox
            variants={cardVariants}
            whileHover={{ y: -5, boxShadow: "0 20px 40px rgba(0,0,0,0.08)" }}
            bg="white"
            p={{ base: "7", md: "10" }}
            rounded={{ base: "2xl", md: "3xl" }}
            border="1px solid" borderColor="gray.100"
            boxShadow="0 4px 20px rgba(0,0,0,0.04)"
            gridColumn={{ lg: "1 / span 2" }}
            gridRow={{ lg: "1 / span 2" }}
            display="flex" flexDirection="column"
          >
            <Flex w="16" h="16" bg="#f3e8ff" rounded="2xl" align="center" justify="center" mb="5">
              <Icon as={ScanSearch} boxSize="7" color="#8a2ce2" />
            </Flex>
            <Heading as="h3" fontSize={{ base: "xl", md: "2xl" }} fontWeight="800" mb="3" color="gray.900">AI Brand Analysis</Heading>
            <Text color="gray.600" fontSize={{ base: "sm", md: "lg" }} lineHeight="1.8">
              AdForge crawls your website and generates a comprehensive brand analysis report — tone of voice, audience personas, key messaging, and competitive positioning. Your ads will always reflect who you truly are.
            </Text>
            <Box mt="auto" pt="6">
              <Flex gap="3" align="center" p="4" bg="gray.50" rounded="xl" border="1px dashed" borderColor="gray.200" wrap="wrap">
                {["Tone", "Audience", "Positioning", "Messaging"].map((tag) => (
                  <Box key={tag} px="3" py="1" bg="#f3e8ff" color="#8a2ce2" rounded="full" fontSize="xs" fontWeight="600">{tag}</Box>
                ))}
              </Flex>
            </Box>
          </MotionBox>

          {/* Standard card */}
          <MotionBox
            variants={cardVariants}
            whileHover={{ y: -5, boxShadow: "0 20px 40px rgba(0,0,0,0.08)" }}
            bg="white" p={{ base: "6", md: "8" }} rounded={{ base: "2xl", md: "3xl" }}
            border="1px solid" borderColor="gray.100" boxShadow="0 4px 20px rgba(0,0,0,0.04)"
          >
            <Flex w="14" h="14" bg="#fff7ed" rounded="xl" align="center" justify="center" mb="4">
              <Icon as={Sparkles} boxSize="6" color="#ea580c" />
            </Flex>
            <Heading as="h3" fontSize={{ base: "lg", md: "xl" }} fontWeight="700" mb="2" color="gray.900">Instant Ad Creative Generation</Heading>
            <Text color="gray.500" fontSize={{ base: "sm", md: "md" }} lineHeight="1.7">Select your campaign focus and instantly generate multiple ad creative variants — visuals, headlines, and copy — tailored to your brand.</Text>
          </MotionBox>

          {/* Tall card — 2 row span */}
          <MotionBox
            variants={cardVariants}
            whileHover={{ y: -5, boxShadow: "0 20px 40px rgba(0,0,0,0.08)" }}
            bg="white" p={{ base: "6", md: "8" }} rounded={{ base: "2xl", md: "3xl" }}
            border="1px solid" borderColor="gray.100" boxShadow="0 4px 20px rgba(0,0,0,0.04)"
            gridRow={{ lg: "span 2" }}
            display="flex" flexDirection="column"
          >
            <Flex w="14" h="14" bg="#fdf4ff" rounded="xl" align="center" justify="center" mb="4">
              <Icon as={Share2} boxSize="6" color="#d946ef" />
            </Flex>
            <Heading as="h3" fontSize={{ base: "lg", md: "xl" }} fontWeight="700" mb="2" color="gray.900">Multi-Platform Distribution</Heading>
            <Text color="gray.500" fontSize={{ base: "sm", md: "md" }} lineHeight="1.7" mb="5">
              Publish and manage your ads across every major platform. AdForge formats each creative perfectly for the channel and audience it&apos;s targeting.
            </Text>
            <Flex direction="column" gap="3" mt="auto">
              {[["Instagram", "#d946ef"], ["Facebook", "#2563eb"], ["LinkedIn", "#0891b2"], ["Twitter / X", "#374151"]].map(([name, color]) => (
                <Flex key={name} align="center" gap="3" p="3" bg="gray.50" rounded="xl">
                  <Box w="3" h="3" rounded="full" bg={color} flexShrink={0} />
                  <Text fontSize="sm" fontWeight="600" color="gray.700">{name}</Text>
                </Flex>
              ))}
            </Flex>
          </MotionBox>

          {/* Wide card */}
          <MotionBox
            variants={cardVariants}
            whileHover={{ y: -5, boxShadow: "0 20px 40px rgba(0,0,0,0.08)" }}
            bg="white" p={{ base: "6", md: "10" }} rounded={{ base: "2xl", md: "3xl" }}
            border="1px solid" borderColor="gray.100" boxShadow="0 4px 20px rgba(0,0,0,0.04)"
            gridColumn={{ lg: "1 / span 2" }}
            display="flex" flexDirection={{ base: "column", sm: "row" }} alignItems={{ sm: "center" }} gap={{ base: "4", md: "8" }}
          >
            <Flex w={{ base: "14", md: "20" }} h={{ base: "14", md: "20" }} bg="#ecfeff" rounded="2xl" align="center" justify="center" flexShrink={0}>
              <Icon as={CalendarClock} boxSize={{ base: "6", md: "8" }} color="#0891b2" />
            </Flex>
            <Box>
              <Heading as="h3" fontSize={{ base: "lg", md: "2xl" }} fontWeight="700" mb="2" color="gray.900">Automated Campaign Scheduling</Heading>
              <Text color="gray.500" fontSize={{ base: "sm", md: "md" }} lineHeight="1.7">
                Set your campaign schedule and AdForge automatically publishes your ads at the best times — across all your platforms, without you lifting a finger.
              </Text>
            </Box>
          </MotionBox>

          {/* Standard card */}
          <MotionBox
            variants={cardVariants}
            whileHover={{ y: -5, boxShadow: "0 20px 40px rgba(0,0,0,0.08)" }}
            bg="white" p={{ base: "6", md: "8" }} rounded={{ base: "2xl", md: "3xl" }}
            border="1px solid" borderColor="gray.100" boxShadow="0 4px 20px rgba(0,0,0,0.04)"
          >
            <Flex w="14" h="14" bg="#ecfdf5" rounded="xl" align="center" justify="center" mb="4">
              <Icon as={FileChartColumn} boxSize="6" color="#059669" />
            </Flex>
            <Heading as="h3" fontSize={{ base: "lg", md: "xl" }} fontWeight="700" mb="2" color="gray.900">Brand Report Generation</Heading>
            <Text color="gray.500" fontSize={{ base: "sm", md: "md" }} lineHeight="1.7">Get a detailed, AI-generated brand report with actionable insights on your positioning, voice, audience, and top ad opportunities.</Text>
          </MotionBox>

          {/* Standard card */}
          <MotionBox
            variants={cardVariants}
            whileHover={{ y: -5, boxShadow: "0 20px 40px rgba(0,0,0,0.08)" }}
            bg="white" p={{ base: "6", md: "8" }} rounded={{ base: "2xl", md: "3xl" }}
            border="1px solid" borderColor="gray.100" boxShadow="0 4px 20px rgba(0,0,0,0.04)"
          >
            <Flex w="14" h="14" bg="#eff6ff" rounded="xl" align="center" justify="center" mb="4">
              <Icon as={BarChart3} boxSize="6" color="#2563eb" />
            </Flex>
            <Heading as="h3" fontSize={{ base: "lg", md: "xl" }} fontWeight="700" mb="2" color="gray.900">Campaign Performance Tracking</Heading>
            <Text color="gray.500" fontSize={{ base: "sm", md: "md" }} lineHeight="1.7">Track impressions, clicks, and conversions across all your campaigns in one unified dashboard. Make data-driven decisions in real-time.</Text>
          </MotionBox>
        </MotionGrid>
      </Box>
    </Box>
  );
}
