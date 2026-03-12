"use client";

import { Box, Flex, Heading, Text } from "@chakra-ui/react";
import { motion } from "framer-motion";
import { Globe, BrainCircuit, LayoutTemplate, CalendarClock } from "lucide-react";

const MotionBox = motion.create(Box as React.ComponentType<any>);
const MotionFlex = motion.create(Flex as React.ComponentType<any>);

const steps = [
  {
    num: "01",
    icon: Globe,
    title: "Paste Your Website URL",
    description: "Enter your website URL and AdForge instantly crawls your brand — scanning your messaging, colors, tone, and identity to build a complete brand profile.",
    color: "#8a2ce2",
    bgColor: "#f3e8ff",
  },
  {
    num: "02",
    icon: BrainCircuit,
    title: "Get Your Brand Analysis Report",
    description: "Receive a detailed AI-generated brand analysis report covering your audience, tone of voice, key value propositions, and competitor positioning.",
    color: "#ea580c",
    bgColor: "#fff7ed",
  },
  {
    num: "03",
    icon: LayoutTemplate,
    title: "Generate Tailored Ad Creatives",
    description: "Select your campaign goals and target context. AdForge generates multiple ad creatives — images, copy, and formats — precisely matched to your brand.",
    color: "#0891b2",
    bgColor: "#ecfeff",
  },
  {
    num: "04",
    icon: CalendarClock,
    title: "Schedule & Run Your Campaign",
    description: "Pick your platforms, set your schedule, and launch. AdForge publishes and manages your ad campaign automatically across all selected channels.",
    color: "#059669",
    bgColor: "#ecfdf5",
  },
];

const containerVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.2 } },
};

const itemVariants = {
  hidden: { opacity: 0, y: 60, scale: 0.98 },
  visible: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.85, ease: [0.22, 1, 0.36, 1] } },
};

export default function HowItWorks() {
  return (
    <Box
      as="section"
      py={{ base: "14", md: "24" }}
      px={{ base: "4", md: "6" }}
      bg="linear-gradient(180deg, #faf5ff 0%, #ffffff 100%)"
      id="how-it-works"
    >
      <Box maxW={{ base: "100%", md: "6xl" }} mx="auto">
        {/* Header */}
        <MotionBox
          textAlign="center"
          mb={{ base: "12", md: "20" }}
          initial={{ opacity: 0, y: 60, scale: 0.98 }}
          whileInView={{ opacity: 1, y: 0, scale: 1 }}
          viewport={{ once: true, amount: 0.15 }}
          transition={{ duration: 0.85, ease: [0.22, 1, 0.36, 1] }}
        >
          <Flex justify="center" mb="4">
            <Box px="4" py="1.5" bg="#ede9fe" color="#7c3aed" rounded="full" fontSize={{ base: "xs", md: "sm" }} fontWeight="600">
              How It Works
            </Box>
          </Flex>
          <Heading as="h2" fontSize={{ base: "2xl", sm: "3xl", md: "5xl" }} fontWeight="800" mb="4" lineHeight="1.1" color="gray.900">
            From brand scan to live campaign in{" "}
            <Box as="span" color="#8a2ce2">4 steps</Box>
          </Heading>
          <Text color="gray.500" fontSize={{ base: "sm", md: "lg" }} maxW="2xl" mx="auto">
            No marketing expertise needed. AdForge handles the strategy, creatives, and scheduling automatically.
          </Text>
        </MotionBox>

        {/* Timeline */}
        <MotionBox
          position="relative"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.1 }}
        >
          {/* Desktop center line */}
          <Box
            display={{ base: "none", md: "block" }}
            position="absolute"
            left="50%"
            top="40px"
            bottom="40px"
            w="2px"
            bg="linear-gradient(180deg, #e9d5ff, #fed7aa, #bae6fd, #bbf7d0)"
            transform="translateX(-50%)"
            zIndex={0}
          />

          {/* Mobile left line */}
          <Box
            display={{ base: "block", md: "none" }}
            position="absolute"
            left="23px"
            top="40px"
            bottom="40px"
            w="2px"
            bg="linear-gradient(180deg, #e9d5ff, #fed7aa, #bae6fd, #bbf7d0)"
            zIndex={0}
          />

          {steps.map((step, idx) => {
            const isEven = idx % 2 === 0;
            return (
              <Box key={step.num} mb={{ base: "8", md: "14" }} position="relative" zIndex={1} _last={{ mb: 0 }}>
                {/* Mobile layout */}
                <Flex display={{ base: "flex", md: "none" }} align="flex-start" gap="5">
                  <Flex
                    w="12" h="12"
                    bg="white"
                    border="2px solid"
                    borderColor={step.color}
                    color={step.color}
                    rounded="full"
                    align="center"
                    justify="center"
                    fontSize="sm"
                    fontWeight="800"
                    flexShrink={0}
                    boxShadow={`0 0 0 4px ${step.bgColor}`}
                    zIndex={2}
                    position="relative"
                  >
                    {step.num}
                  </Flex>
                  <MotionBox
                    variants={itemVariants}
                    bg="white"
                    p="5"
                    rounded="2xl"
                    border="1px solid"
                    borderColor="gray.100"
                    boxShadow="0 4px 20px rgba(0,0,0,0.04)"
                    flex="1"
                    _hover={{ boxShadow: "0 12px 32px rgba(0,0,0,0.08)" }}
                    transition="all 0.3s ease"
                  >
                    <Flex w="12" h="12" bg={step.bgColor} rounded="xl" align="center" justify="center" mb="3">
                      <step.icon size={20} color={step.color} />
                    </Flex>
                    <Heading as="h3" fontSize="lg" fontWeight="700" mb="2" color="gray.900">{step.title}</Heading>
                    <Text color="gray.500" fontSize="sm" lineHeight="1.7">{step.description}</Text>
                  </MotionBox>
                </Flex>

                {/* Desktop alternating */}
                <Flex
                  display={{ base: "none", md: "flex" }}
                  direction={isEven ? "row" : "row-reverse"}
                  align="center"
                  position="relative"
                >
                  <MotionBox
                    variants={itemVariants}
                    w="45%"
                    display="flex"
                    justifyContent={isEven ? "flex-end" : "flex-start"}
                  >
                    <Box
                      bg="white"
                      p="8"
                      rounded="2xl"
                      border="1px solid"
                      borderColor="gray.100"
                      boxShadow="0 4px 20px rgba(0,0,0,0.04)"
                      maxW="md"
                      w="full"
                      transition="all 0.3s ease"
                      _hover={{ transform: "translateY(-4px)", boxShadow: "0 16px 40px rgba(0,0,0,0.08)" }}
                    >
                      <Flex w="14" h="14" bg={step.bgColor} rounded="2xl" align="center" justify="center" mb="5">
                        <step.icon size={26} color={step.color} />
                      </Flex>
                      <Heading as="h3" fontSize="xl" fontWeight="700" mb="3" color="gray.900">{step.title}</Heading>
                      <Text color="gray.500" fontSize="md" lineHeight="1.7">{step.description}</Text>
                    </Box>
                  </MotionBox>

                  {/* Node */}
                  <MotionFlex
                    variants={itemVariants}
                    w="10%"
                    justify="center"
                    position="absolute"
                    left="50%"
                    transform="translateX(-50%)"
                    zIndex={2}
                  >
                    <Flex
                      w="12" h="12"
                      bg="white"
                      border="2px solid"
                      borderColor={step.color}
                      color={step.color}
                      rounded="full"
                      align="center"
                      justify="center"
                      fontSize="sm"
                      fontWeight="800"
                      boxShadow={`0 0 0 5px ${step.bgColor}`}
                    >
                      {step.num}
                    </Flex>
                  </MotionFlex>
                  <Box w="45%" />
                </Flex>
              </Box>
            );
          })}
        </MotionBox>
      </Box>
    </Box>
  );
}
