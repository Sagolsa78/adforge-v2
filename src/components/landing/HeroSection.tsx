"use client";

import { Box, Flex, Heading, Text, Container } from "@chakra-ui/react";
import Link from "next/link";
import { motion } from "framer-motion";

const MotionBox = motion.create(Box as React.ComponentType<any>);
const MotionFlex = motion.create(Flex as React.ComponentType<any>);

const containerVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.15 } },
};

const itemVariants = {
  hidden: { opacity: 0, y: 60, scale: 0.98 },
  visible: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.85, ease: [0.22, 1, 0.36, 1] } },
};

export default function HeroSection() {
  return (
    <Box
      as="section"
      position="relative"
      pt={{ base: "28", md: "40" }}
      pb={{ base: "16", md: "24" }}
      bg="#faf5ff"
      overflow="hidden"
      overflowX="hidden"
      textAlign="center"
    >
      {/* Background blurs */}
      <Box position="absolute" top="5%" left={{ base: "-20%", md: "10%" }} w={{ base: "300px", md: "420px" }} h={{ base: "300px", md: "420px" }} bg="#e0e7ff" filter="blur(80px)" borderRadius="full" opacity={0.55} pointerEvents="none" />
      <Box position="absolute" bottom="5%" right={{ base: "-20%", md: "10%" }} w={{ base: "300px", md: "480px" }} h={{ base: "300px", md: "480px" }} bg="#fae8ff" filter="blur(100px)" borderRadius="full" opacity={0.55} pointerEvents="none" />

      <Container maxW="6xl" mx="auto" position="relative" zIndex={1} px={{ base: "4", md: "8" }}>
        <MotionFlex direction="column" align="center" variants={containerVariants} initial="hidden" animate="visible">

          {/* Badge */}
          <MotionBox variants={itemVariants}>
            <Flex
              display="inline-flex"
              align="center"
              gap="2"
              bg="white"
              border="1px solid"
              borderColor="gray.200"
              color="gray.700"
              px={{ base: "3", md: "4" }}
              py="1.5"
              borderRadius="full"
              fontSize={{ base: "xs", md: "sm" }}
              fontWeight="600"
              boxShadow="0 2px 10px rgba(0,0,0,0.04)"
              mb={{ base: "6", md: "8" }}
            >
              <Box w="2" h="2" borderRadius="full" bg="#8a2ce2" flexShrink={0} />
              AdForge 2.0 — AI-Powered Ad Automation
            </Flex>
          </MotionBox>

          {/* Headline */}
          <MotionBox variants={itemVariants}>
            <Heading
              as="h1"
              fontSize={{ base: "4xl", sm: "5xl", md: "6xl", lg: "7xl" }}
              fontWeight="800"
              lineHeight="1.1"
              letterSpacing="-0.03em"
              color="gray.900"
              mb={{ base: "4", md: "6" }}
              maxW={{ base: "100%", md: "4xl" }}
              px={{ base: "2", md: "0" }}
            >
              Analyze. Generate.{" "}
              <Box as="span" bgGradient="to-r" gradientFrom="#8a2ce2" gradientTo="#ea580c" backgroundClip="text" color="transparent">
                Schedule & Run
              </Box>{" "}
              your ads automatically.
            </Heading>
          </MotionBox>

          {/* Subheading */}
          <MotionBox variants={itemVariants}>
            <Text
              fontSize={{ base: "md", md: "xl" }}
              color="gray.500"
              lineHeight="1.7"
              maxW={{ base: "100%", md: "2xl" }}
              mx="auto"
              mb={{ base: "8", md: "10" }}
              px={{ base: "2", md: "0" }}
            >
              Enter your website URL. AdForge analyzes your brand, generates a tailored report, creates ad creatives, and schedules your entire campaign — all in one place.
            </Text>
          </MotionBox>

          {/* CTA Buttons */}
          <MotionFlex
            variants={itemVariants}
            gap={{ base: "3", md: "4" }}
            wrap="wrap"
            justify="center"
            mb={{ base: "12", md: "20" }}
            direction={{ base: "column", sm: "row" }}
            align="center"
            w={{ base: "full", sm: "auto" }}
            px={{ base: "4", sm: "0" }}
          >
            <Link href="/onboarding">
              <Box
                as="button"
                bg="#8a2ce2"
                color="white"
                fontWeight="700"
                px={{ base: "6", md: "8" }}
                py={{ base: "3.5", md: "4" }}
                borderRadius="full"
                fontSize={{ base: "sm", md: "md" }}
                transition="all 0.2s"
                boxShadow="0 4px 14px rgba(138,44,226,0.3)"
                w={{ base: "full", sm: "auto" }}
                _hover={{ bg: "#7c28cb", transform: "translateY(-2px)", boxShadow: "0 6px 20px rgba(138,44,226,0.4)" }}
              >
                Analyze My Brand →
              </Box>
            </Link>
            <Flex
              as="button"
              align="center"
              justify="center"
              gap="2"
              bg="white"
              color="gray.700"
              fontWeight="600"
              px={{ base: "6", md: "8" }}
              py={{ base: "3.5", md: "4" }}
              borderRadius="full"
              border="1px solid"
              borderColor="gray.200"
              fontSize={{ base: "sm", md: "md" }}
              transition="all 0.2s"
              boxShadow="0 2px 10px rgba(0,0,0,0.04)"
              w={{ base: "full", sm: "auto" }}
              _hover={{ bg: "gray.50", transform: "translateY(-2px)" }}
            >
              ▶ Watch Demo
            </Flex>
          </MotionFlex>

          {/* App Mockup */}
          <MotionBox variants={itemVariants} w="full" maxW="5xl" mx="auto">
            <Box
              bg="white"
              p={{ base: "2", md: "3" }}
              rounded={{ base: "2xl", md: "3xl" }}
              border="1px solid"
              borderColor="gray.200"
              boxShadow="0 24px 60px rgba(138,44,226,0.08), 0 4px 20px rgba(0,0,0,0.06)"
            >
              <Box
                bg="gray.50"
                rounded={{ base: "xl", md: "2xl" }}
                overflow="hidden"
                border="1px solid"
                borderColor="gray.100"
                h={{ base: "240px", sm: "320px", md: "480px" }}
                position="relative"
              >
                {/* Window bar */}
                <Flex bg="white" px={{ base: "3", md: "4" }} py="2.5" borderBottom="1px solid" borderColor="gray.100" align="center" gap="2">
                  <Box w={{ base: "2", md: "3" }} h={{ base: "2", md: "3" }} rounded="full" bg="#ff5f56" />
                  <Box w={{ base: "2", md: "3" }} h={{ base: "2", md: "3" }} rounded="full" bg="#ffbd2e" />
                  <Box w={{ base: "2", md: "3" }} h={{ base: "2", md: "3" }} rounded="full" bg="#27c93f" />
                  <Flex flex="1" justify="center" display={{ base: "none", sm: "flex" }}>
                    <Box bg="gray.100" rounded="md" px="4" py="1" fontSize="xs" color="gray.400">
                      app.adforge.ai/campaign
                    </Box>
                  </Flex>
                </Flex>

                {/* Simulated Dashboard */}
                <Flex flex="1" p={{ base: "3", md: "6" }} gap={{ base: "3", md: "6" }} h="calc(100% - 40px)">
                  {/* Sidebar */}
                  <Flex direction="column" gap="3" w="52" display={{ base: "none", md: "flex" }}>
                    <Box h="8" w="full" bg="gray.200" rounded="md" />
                    <Box h="4" w="3/4" bg="gray.100" rounded="md" />
                    <Box h="4" w="2/3" bg="gray.100" rounded="md" />
                    <Box h="4" w="3/4" bg="gray.100" rounded="md" />
                    <Box mt="4" h="4" w="1/2" bg="#f3e8ff" rounded="md" />
                  </Flex>

                  {/* Main content */}
                  <Flex direction="column" gap={{ base: "3", md: "5" }} flex="1">
                    {/* Campaign cards row */}
                    <Flex gap={{ base: "2", md: "4" }}>
                      <Flex direction="column" h={{ base: "20", md: "28" }} flex="1" bg="#f3e8ff" rounded="xl" p="3" justify="space-between">
                        <Box h="2" w="12" bg="#8a2ce2" rounded="full" opacity={0.4} />
                        <Box>
                          <Box h="2" w="3/4" bg="#8a2ce2" rounded="full" opacity={0.3} mb="1" />
                          <Box h="2" w="1/2" bg="#8a2ce2" rounded="full" opacity={0.2} />
                        </Box>
                      </Flex>
                      <Flex direction="column" h={{ base: "20", md: "28" }} flex="1" bg="#fff7ed" rounded="xl" p="3" justify="space-between">
                        <Box h="2" w="12" bg="#ea580c" rounded="full" opacity={0.4} />
                        <Box>
                          <Box h="2" w="3/4" bg="#ea580c" rounded="full" opacity={0.3} mb="1" />
                          <Box h="2" w="1/2" bg="#ea580c" rounded="full" opacity={0.2} />
                        </Box>
                      </Flex>
                      <Box h={{ base: "20", md: "28" }} flex="1" bg="#ecfeff" rounded="xl" display={{ base: "none", sm: "block" }} />
                    </Flex>

                    {/* Dashboard inner */}
                    <Box flex="1" w="full" bg="white" border="1px solid" borderColor="gray.100" rounded="xl" shadow="sm" p={{ base: "3", md: "5" }}>
                      <Box h={{ base: "4", md: "5" }} w="1/3" bg="gray.200" rounded="md" mb="4" />
                      <Flex gap="3">
                        <Box h={{ base: "14", md: "16" }} flex="1" bg="#f3e8ff" rounded="lg" />
                        <Box h={{ base: "14", md: "16" }} flex="1" bg="#fff7ed" rounded="lg" />
                        <Box h={{ base: "14", md: "16" }} flex="1" display={{ base: "none", sm: "block" }} bg="#ecfdf5" rounded="lg" />
                      </Flex>
                    </Box>
                  </Flex>
                </Flex>

                {/* Floating badge */}
                <MotionFlex
                  position="absolute"
                  bottom={{ base: "3", md: "6" }}
                  right={{ base: "3", md: "6" }}
                  bg="white"
                  p={{ base: "3", md: "4" }}
                  rounded="xl"
                  shadow="lg"
                  border="1px solid"
                  borderColor="gray.100"
                  align="center"
                  gap="2"
                  initial={{ y: 16, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 1.2, duration: 0.5 }}
                >
                  <Box w={{ base: "5", md: "7" }} h={{ base: "5", md: "7" }} rounded="full" bg="#ecfdf5" display="flex" alignItems="center" justifyContent="center" flexShrink={0}>
                    <Box w="2" h="2" rounded="full" bg="#059669" />
                  </Box>
                  <Box>
                    <Text fontSize={{ base: "xs", md: "sm" }} fontWeight="700" color="gray.800">Campaign scheduled</Text>
                    <Text fontSize="xs" color="gray.500" display={{ base: "none", md: "block" }}>32 ads across 4 platforms</Text>
                  </Box>
                </MotionFlex>
              </Box>
            </Box>
          </MotionBox>
        </MotionFlex>
      </Container>
    </Box>
  );
}
