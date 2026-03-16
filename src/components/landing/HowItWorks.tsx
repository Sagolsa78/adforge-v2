"use client";

import { Box, Flex, Heading, Text } from "@chakra-ui/react";
import { motion } from "framer-motion";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const MotionBox = motion.create(Box as React.ComponentType<any>);
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const MotionFlex = motion.create(Flex as React.ComponentType<any>);

import {
  HOW_IT_WORKS_STEPS,
  CONTAINER_VARIANTS,
  ITEM_VARIANTS,
} from "@/constants";

/**
 * Alternating timeline section illustrating the 4-step brand-to-campaign workflow.
 * Responsive layout with mobile vertical and desktop zigzag timelines.
 */
export default function HowItWorks() {
  return (
    <Box
      as="section"
      py={{ base: "14", md: "24" }}
      px={{ base: "4", md: "6" }}
      bg="linear-gradient(180deg, #F8FAFF 0%, #ffffff 100%)"
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
            <Box
              px="4"
              py="1.5"
              bg="blue.50"
              color="blue.600"
              rounded="full"
              fontSize={{ base: "xs", md: "sm" }}
              fontWeight="600"
            >
              How It Works
            </Box>
          </Flex>
          <Heading
            as="h2"
            fontSize={{ base: "2xl", sm: "3xl", md: "5xl" }}
            fontWeight="800"
            mb="4"
            lineHeight="1.1"
            color="gray.900"
          >
            From brand scan to live content in{" "}
            <Box as="span" color="#4F46E5">
              3 steps
            </Box>
          </Heading>
          <Text
            color="gray.500"
            fontSize={{ base: "sm", md: "lg" }}
            maxW="2xl"
            mx="auto"
          >
            No marketing expertise needed. Plug and Play Agent handles the
            insights, creatives, and scheduling automatically.
          </Text>
        </MotionBox>

        {/* Timeline */}
        <MotionBox
          position="relative"
          variants={CONTAINER_VARIANTS}
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
            bg="linear-gradient(180deg, #E0E7FF, #DBEAFE, #E0E7FF)"
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
            bg="linear-gradient(180deg, #E0E7FF, #DBEAFE, #E0E7FF)"
            zIndex={0}
          />

          {HOW_IT_WORKS_STEPS.map((step, idx) => {
            const isEven = idx % 2 === 0;
            const stepColor = "#4F46E5";
            const stepBg = "#EEF2FF";
            return (
              <Box
                key={step.num}
                mb={{ base: "8", md: "14" }}
                position="relative"
                zIndex={1}
                _last={{ mb: 0 }}
              >
                {/* Mobile layout */}
                <Flex
                  display={{ base: "flex", md: "none" }}
                  align="flex-start"
                  gap="5"
                >
                  <Flex
                    w="12"
                    h="12"
                    bg="white"
                    border="2px solid"
                    borderColor={stepColor}
                    color={stepColor}
                    rounded="full"
                    align="center"
                    justify="center"
                    fontSize="sm"
                    fontWeight="800"
                    flexShrink={0}
                    boxShadow={`0 0 0 4px ${stepBg}`}
                    zIndex={2}
                    position="relative"
                  >
                    {step.num}
                  </Flex>
                  <MotionBox
                    variants={ITEM_VARIANTS}
                    bg="white"
                    p="5"
                    rounded="2xl"
                    border="1px solid"
                    borderColor="gray.100"
                    boxShadow="0 4px 20px rgba(79,70,229,0.04)"
                    flex="1"
                    _hover={{ boxShadow: "0 12px 32px rgba(79,70,229,0.08)" }}
                    transition="all 0.3s ease"
                  >
                    <Flex
                      w="12"
                      h="12"
                      bg={stepBg}
                      rounded="xl"
                      align="center"
                      justify="center"
                      mb="3"
                    >
                      <step.icon size={20} color={stepColor} />
                    </Flex>
                    <Heading
                      as="h3"
                      fontSize="lg"
                      fontWeight="700"
                      mb="2"
                      color="gray.900"
                    >
                      {step.title}
                    </Heading>
                    <Text color="gray.500" fontSize="sm" lineHeight="1.7">
                      {step.description}
                    </Text>
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
                    variants={ITEM_VARIANTS}
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
                      boxShadow="0 4px 20px rgba(79,70,229,0.04)"
                      maxW="md"
                      w="full"
                      transition="all 0.3s ease"
                      _hover={{
                        transform: "translateY(-4px)",
                        boxShadow: "0 16px 40px rgba(79,70,229,0.08)",
                      }}
                    >
                      <Flex
                        w="14"
                        h="14"
                        bg={stepBg}
                        rounded="2xl"
                        align="center"
                        justify="center"
                        mb="5"
                      >
                        <step.icon size={26} color={stepColor} />
                      </Flex>
                      <Heading
                        as="h3"
                        fontSize="xl"
                        fontWeight="700"
                        mb="3"
                        color="gray.900"
                      >
                        {step.title}
                      </Heading>
                      <Text color="gray.500" fontSize="md" lineHeight="1.7">
                        {step.description}
                      </Text>
                    </Box>
                  </MotionBox>

                  {/* Node */}
                  <MotionFlex
                    variants={ITEM_VARIANTS}
                    w="10%"
                    justify="center"
                    position="absolute"
                    left="50%"
                    transform="translateX(-50%)"
                    zIndex={2}
                  >
                    <Flex
                      w="12"
                      h="12"
                      bg="white"
                      border="2px solid"
                      borderColor={stepColor}
                      color={stepColor}
                      rounded="full"
                      align="center"
                      justify="center"
                      fontSize="sm"
                      fontWeight="800"
                      boxShadow={`0 0 0 5px ${stepBg}`}
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
