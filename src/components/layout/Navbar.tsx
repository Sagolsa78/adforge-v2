"use client";

import { Box, Flex, Text } from "@chakra-ui/react";
import Link from "next/link";
import { useState } from "react";
import { Menu, X } from "lucide-react";

import { NAV_LINKS } from "@/constants";
import Image from "next/image";
export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <Box as="nav" position="fixed" top="0" left="0" right="0" zIndex="50">
      {/* Main Navbar Bar */}
      <Box
        bg="white"
        px={{ base: "4", md: "8" }}
        py="3"
        borderBottom="1px solid"
        borderColor="gray.100"
        boxShadow="0 1px 12px rgba(79,70,229,0.08)"
      >
        <Box
          maxW="7xl"
          mx="auto"
          display="flex"
          justifyContent="space-between"
          alignItems="center"
        >
          {/* Logo */}
         
          <Flex align="center" gap="2.5">
            <Image
              src="/plug_andPlay_logo.jpeg"
              alt="Plug and Play Agent"
              width={32}
              height={32}
              style={{ objectFit: "contain" }}
            />
            <Text
              fontSize="lg"
              fontWeight="800"
              color="#1a1a2e"
              letterSpacing="-0.02em"
            >
              Plug and Play Agent
            </Text>
          </Flex>
          {/* Desktop Nav */}
          <Flex
            display={{ base: "none", md: "flex" }}
            gap="8"
            fontSize="sm"
            fontWeight="500"
          >
            {NAV_LINKS.map((link) => (
              <Link key={link.label} href={link.href}>
                <Text
                  color="gray.500"
                  _hover={{ color: "#4F46E5" }}
                  transition="color 0.2s"
                  cursor="pointer"
                >
                  {link.label}
                </Text>
              </Link>
            ))}
          </Flex>
          {/* Desktop CTA */}
          <Flex display={{ base: "none", md: "flex" }} align="center" gap="4">
            <Link href="/login">
              <Text
                fontSize="sm"
                fontWeight="500"
                color="gray.500"
                _hover={{ color: "#4F46E5" }}
                transition="color 0.2s"
              >
                Sign In
              </Text>
            </Link>
            <Link href="/onboarding">
              <Box
                bg="#4F46E5"
                color="white"
                px="5"
                py="2"
                rounded="full"
                fontSize="sm"
                fontWeight="600"
                _hover={{
                  bg: "#4338CA",
                  transform: "translateY(-1px)",
                }}
                transition="all 0.2s"
                boxShadow="0 4px 14px rgba(79,70,229,0.3)"
              >
                Get Started
              </Box>
            </Link>
          </Flex>
          {/* Mobile Hamburger */}
          <Box
            display={{ base: "flex", md: "none" }}
            as="button"
            aria-label="Toggle Navigation"
            onClick={() => setMobileOpen(!mobileOpen)}
            color="gray.600"
            p="1"
          >
            {mobileOpen ? <X size={22} /> : <Menu size={22} />}
          </Box>
        </Box>
      </Box>

      {/* Mobile Menu */}
      {mobileOpen && (
        <Box
          mx="4"
          mt="0"
          position="relative"
          zIndex="10"
          bg="white"
          rounded="2xl"
          border="1px solid"
          borderColor="gray.100"
          boxShadow="0 12px 40px rgba(79,70,229,0.12)"
          p="5"
          display={{ md: "none" }}
        >
          <Flex direction="column" gap="4">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.label}
                href={link.href}
                onClick={() => setMobileOpen(false)}
              >
                <Text
                  fontSize="sm"
                  fontWeight="500"
                  color="gray.600"
                  _hover={{ color: "#4F46E5" }}
                >
                  {link.label}
                </Text>
              </Link>
            ))}
            <Box h="1px" bg="gray.100" />
            <Flex gap="3" direction="column">
              <Link href="/login">
                <Text fontSize="sm" fontWeight="500" color="gray.500">
                  Sign In
                </Text>
              </Link>
              <Link href="/onboarding">
                <Box
                  bg="#4F46E5"
                  color="white"
                  px="5"
                  py="2.5"
                  rounded="full"
                  fontSize="sm"
                  fontWeight="600"
                  textAlign="center"
                  boxShadow="0 4px 14px rgba(79,70,229,0.3)"
                >
                  Get Started
                </Box>
              </Link>
            </Flex>
          </Flex>
        </Box>
      )}
    </Box>
  );
}
