"use client";

import { Box, Flex, Grid, Heading, Text } from "@chakra-ui/react";
import Link from "next/link";

import { FOOTER_LINKS, HEADING_COLORS } from "@/constants";

/**
 * Site-wide footer with multi-column link grid and a "last update" card.
 * Uses dark theme with color-coded section headings.
 */
export default function Footer() {
  return (
    <Box bg="#F8FAFF" p={{ base: "4", md: "10" }}>
      <Box
        bg="#1e1b4b"
        borderRadius={{ base: "3xl", md: "40px" }}
        px={{ base: "6", md: "16", lg: "24" }}
        py={{ base: "10", md: "20" }}
        maxW="100%"
        mx="auto"
        color="purple.100"
        minH={{ md: "350px" }}
        position="relative"
        overflow="hidden"
      >
        <Flex
          direction={{ base: "column", lg: "row" }}
          justify="space-between"
          gap={{ base: "10", lg: "8" }}
          maxW="7xl"
          mx="auto"
          position="relative"
          zIndex={1}
        >
          {/* Link columns */}
          <Grid
            templateColumns={{
              base: "1fr 1fr",
              md: "repeat(4, 1fr)",
            }}
            gap={{ base: "8", md: "12", lg: "20" }}
            w={{ lg: "70%" }}
          >
            {Object.entries(FOOTER_LINKS).map(([title, links]) => (
              <Box key={title}>
                <Heading
                  fontSize={{ base: "13px", md: "15px" }}
                  mb={{ base: "4", md: "5" }}
                  color="white"
                  fontWeight="700"
                >
                  {title}
                </Heading>
                <Flex direction="column" gap={{ base: "3", md: "4" }}>
                  {links.map((link) => (
                    <Link key={link.label} href={link.href}>
                      <Text
                        fontSize={{ base: "12px", md: "13px" }}
                        color="purple.200"
                        _hover={{ color: "white" }}
                        transition="0.2s"
                        cursor="pointer"
                      >
                        {link.label}
                      </Text>
                    </Link>
                  ))}
                </Flex>
              </Box>
            ))}
          </Grid>

          {/* Last Update Card */}
          <Box
            display="flex"
            justifyContent={{ base: "flex-start", lg: "flex-end" }}
            w={{ lg: "30%" }}
          >
            <Box
              bg="rgba(255, 255, 255, 0.05)"
              p={{ base: "4", md: "5" }}
              borderRadius="2xl"
              w="full"
              maxW={{ base: "full", lg: "240px" }}
              h="fit-content"
              border="1px solid"
              borderColor="whiteAlpha.200"
              backdropFilter="blur(10px)"
            >
              <Text
                fontSize="11px"
                mb="1"
                color="purple.300"
                fontWeight="600"
                textTransform="uppercase"
                letterSpacing="0.1em"
              >
                Latest Update
              </Text>
              <Text
                color="white"
                fontSize={{ base: "13px", md: "14px" }}
                mb="1"
                fontWeight="600"
              >
                Plug and Play Agent v2.4
              </Text>
              <Text fontSize="11px" color="purple.200">
                Released March 2026
              </Text>
            </Box>
          </Box>
        </Flex>

        <Box
          mt={20}
          pt={8}
          borderTop="1px solid"
          borderColor="whiteAlpha.100"
          textAlign="center"
        >
          <Text fontSize="xs" color="purple.300">
            © {new Date().getFullYear()} Plug and Play Agent. Built for
            Instagram growth.
          </Text>
        </Box>
      </Box>
    </Box>
  );
}
