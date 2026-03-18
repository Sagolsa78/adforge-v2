"use client";

import {
  Box,
  Button,
  Flex,
  Heading,
  Icon,
  Text,
  Badge,
  SimpleGrid,
} from "@chakra-ui/react";
import { Check } from "lucide-react";
import { motion } from "framer-motion";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const MotionBox = motion.create(Box as any);

interface PricingCardProps {
  name: string;
  price?: string;
  customPriceText?: string;
  description: string;
  features: string[];
  isFeatured?: boolean;
  badgeText?: string;
  buttonText: string;
  ctaHref: string;
}

const PricingCard = ({
  name,
  price,
  customPriceText,
  description,
  features,
  isFeatured = false,
  badgeText,
  buttonText,
  ctaHref,
}: PricingCardProps) => {
  return (
    <MotionBox
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      whileHover={{ y: -6 }}
      transition={{ duration: 0.4 }}
      flex="1"
      display="flex"
      flexDirection="column"
      position="relative"
      bg={isFeatured ? "blue.600" : "white"}
      border="1px solid"
      borderColor={isFeatured ? "blue.500" : "gray.200"}
      borderRadius="28px"
      p={8}
      boxShadow={
        isFeatured
          ? "0 24px 64px rgba(37,99,235,0.25)"
          : "0 4px 24px rgba(0,0,0,0.04)"
      }
    >
      {isFeatured && badgeText && (
        <Badge
          bg="white"
          color="blue.600"
          borderRadius="full"
          px={3}
          py={1}
          position="absolute"
          top="-14px"
          left="50%"
          transform="translateX(-50%)"
          fontSize="xs"
          fontWeight="800"
          textTransform="uppercase"
          letterSpacing="0.05em"
          boxShadow="0 4px 12px rgba(0,0,0,0.1)"
          whiteSpace="nowrap"
        >
          {badgeText}
        </Badge>
      )}

      {/* Plan name & price */}
      <div style={{ display: "flex", flexDirection: "column", gap: "4px", marginBottom: "20px" }}>
        <Text
          fontSize="sm"
          fontWeight="700"
          color={isFeatured ? "blue.100" : "gray.500"}
          textTransform="uppercase"
          letterSpacing="0.06em"
        >
          {name}
        </Text>
        <Flex align="baseline" gap={1}>
          {customPriceText ? (
            <Text
              fontSize="5xl"
              fontWeight="800"
              color={isFeatured ? "white" : "gray.900"}
              letterSpacing="-0.04em"
              lineHeight={1}
            >
              {customPriceText}
            </Text>
          ) : (
            <>
              <Text
                fontSize="5xl"
                fontWeight="800"
                color={isFeatured ? "white" : "gray.900"}
                letterSpacing="-0.04em"
                lineHeight={1}
              >
                ${price}
              </Text>
              <Text fontSize="sm" color={isFeatured ? "blue.200" : "gray.400"} fontWeight="500">
                / mo
              </Text>
            </>
          )}
        </Flex>
      </div>

      <Text
        fontSize="sm"
        color={isFeatured ? "blue.100" : "gray.500"}
        mb={7}
        lineHeight="1.65"
        minH="40px"
      >
        {description}
      </Text>

      {/* Feature list */}
      <div style={{ display: "flex", flexDirection: "column", gap: "12px", flex: 1, marginBottom: "32px" }}>
        {features.map((feature, i) => (
          <Flex key={i} align="center" gap={3}>
            <Flex
              w={5}
              h={5}
              borderRadius="full"
              bg={isFeatured ? "whiteAlpha.300" : "blue.50"}
              align="center"
              justify="center"
              flexShrink={0}
            >
              <Icon
                as={Check}
                boxSize={3}
                color={isFeatured ? "white" : "blue.500"}
                strokeWidth={3}
              />
            </Flex>
            <Text
              fontSize="sm"
              fontWeight="500"
              color={isFeatured ? "white" : "gray.700"}
            >
              {feature}
            </Text>
          </Flex>
        ))}
      </div>

      <Button
        asChild
        w="full"
        h="48px"
        borderRadius="14px"
        fontSize="sm"
        fontWeight="700"
        bg={isFeatured ? "white" : "gray.900"}
        color={isFeatured ? "blue.600" : "white"}
        _hover={{
          bg: isFeatured ? "blue.50" : "gray.700",
          transform: "translateY(-1px)",
        }}
        _active={{ transform: "translateY(0)" }}
        transition="all 0.2s"
      >
        <a href={ctaHref}>{buttonText}</a>
      </Button>
    </MotionBox>
  );
};

export default function Pricing() {
  return (
    <Box
      as="section"
      py={{ base: 24, md: 40 }}
      bg="white"
      id="pricing"
    >
      {/* Outer container — plain div, guaranteed centered */}
      <div style={{ maxWidth: "1100px", margin: "0 auto", padding: "0 24px" }}>

        {/* Heading block */}
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", textAlign: "center", gap: "20px", marginBottom: "64px" }}>
          <Badge
            bg="blue.50"
            color="blue.600"
            borderRadius="full"
            px={4}
            py={1.5}
            fontSize="xs"
            fontWeight="700"
            letterSpacing="0.06em"
            textTransform="uppercase"
          >
            Pricing
          </Badge>

          <Heading
            as="h2"
            fontSize={{ base: "3xl", md: "5xl" }}
            fontWeight="800"
            color="gray.900"
            letterSpacing="-0.04em"
            lineHeight="1.05"
            style={{ textAlign: "center", maxWidth: "560px" }}
          >
            Simple, transparent pricing
          </Heading>

          <Text
            color="gray.500"
            fontSize="xl"
            lineHeight="1.65"
            style={{ textAlign: "center", maxWidth: "440px" }}
          >
            Pick the plan that fits your brand. Upgrade or cancel anytime.
          </Text>


        </div>

        {/* Pricing cards */}
        <SimpleGrid
          columns={{ base: 1, md: 2 }}
          gap={6}
          maxW="3xl"
          mx="auto"
        >
          
          <PricingCard
            name="Starter"
            customPriceText="Free"
            description="Perfect for founders building their first personal brand."
            buttonText="Get Started"
            ctaHref="/onboarding"
            features={[
              "50 AI post generations / mo",
              "1 Workspace",
              "Connect 2 social accounts",
              "Basic content templates",
            ]}
          />
          <PricingCard
            name="Custom"
            customPriceText="Let's talk"
            isFeatured
            badgeText="For Teams & Enterprises"
            description="For agencies managing content across multiple client brands."
            buttonText="Contact Sales"
            ctaHref="mailto:sales@yourdomain.com"
            features={[
              "Unlimited AI post generations",
              "Unlimited Workspaces",
              "Custom global guardrails",
              "Unlimited team members",
              "Priority email support",
            ]}
          />
        </SimpleGrid>

        

      </div>
    </Box>
  );
}
