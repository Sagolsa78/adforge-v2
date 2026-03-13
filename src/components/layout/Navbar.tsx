"use client";

import { Box, Flex, Text, Button, Circle } from "@chakra-ui/react";
import Link from "next/link";
import { useState } from "react";
import { Menu, X, User, LogOut, LayoutDashboard } from "lucide-react";
import { useSession, signOut } from "next-auth/react";

const navLinks = [
  { label: "Features", href: "#features" },
  { label: "How It Works", href: "#how-it-works" },
  { label: "Use Cases", href: "#use-cases" },
];

interface NavbarProps {
  onLoginClick?: () => void;
}

export default function Navbar({ onLoginClick }: NavbarProps) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const { data: session, status } = useSession();

  return (
    <Box as="nav" position="fixed" top="0" w="full" zIndex="50" px={{ base: "4", md: "6" }} py="4">
      <Box
        maxW="7xl"
        mx="auto"
        bg="rgba(255,255,255,0.85)"
        backdropFilter="blur(12px)"
        rounded="full"
        px={{ base: "5", md: "6" }}
        py="3"
        boxShadow="0 2px 20px rgba(0,0,0,0.06)"
        border="1px solid"
        borderColor="gray.200"
        display="flex"
        justifyContent="space-between"
        alignItems="center"
      >
        {/* Logo */}
        <Link href="/">
          <Flex align="center" gap="2" cursor="pointer">
            <Flex
              w="8"
              h="8"
              bg="linear-gradient(135deg,#8a2ce2,#ea580c)"
              rounded="lg"
              align="center"
              justify="center"
            >
              <Text color="white" fontWeight="800" fontSize="sm">A</Text>
            </Flex>
            <Text fontSize="lg" fontWeight="800" color="gray.900" letterSpacing="-0.02em">
              AdForge
            </Text>
          </Flex>
        </Link>

        {/* Desktop Nav */}
        <Flex display={{ base: "none", md: "flex" }} gap="8" fontSize="sm" fontWeight="500" color="gray.600">
          {navLinks.map((link) => (
            <Link key={link.label} href={link.href}>
              <Text _hover={{ color: "#8a2ce2" }} transition="color 0.2s" cursor="pointer">
                {link.label}
              </Text>
            </Link>
          ))}
        </Flex>

        {/* Desktop CTA */}
        <Flex display={{ base: "none", md: "flex" }} align="center" gap="3">
          {status === "authenticated" ? (
            <Flex align="center" gap={4}>
               <Link href="/dashboard">
                <Button variant="ghost" size="sm" color="gray.600" gap={2}>
                  <LayoutDashboard size={16} /> Dashboard
                </Button>
              </Link>
              <Button 
                variant="outline" 
                size="sm" 
                rounded="full" 
                borderColor="gray.200" 
                color="gray.600" 
                onClick={() => signOut()}
                gap={2}
              >
                <LogOut size={16} /> Log out
              </Button>
              <Circle size="36px" bg="purple.50" color="purple.500">
                <User size={18} />
              </Circle>
            </Flex>
          ) : (
            <>
              <Box 
                onClick={onLoginClick}
                cursor="pointer"
              >
                <Text fontSize="sm" fontWeight="500" color="gray.600" _hover={{ color: "#8a2ce2" }} transition="color 0.2s">
                  Log in
                </Text>
              </Box>
              <Link href="/onboarding">
                <Box
                  bg="#8a2ce2"
                  color="white"
                  px="5"
                  py="2"
                  rounded="full"
                  fontSize="sm"
                  fontWeight="600"
                  _hover={{ bg: "#7c28cb", transform: "translateY(-1px)" }}
                  transition="all 0.2s"
                  boxShadow="0 4px 10px rgba(138,44,226,0.25)"
                  cursor="pointer"
                >
                  Start for free
                </Box>
              </Link>
            </>
          )}
        </Flex>

        {/* Mobile Hamburger */}
        <Box
          display={{ base: "flex", md: "none" }}
          as="button"
          aria-label="Toggle Navigation"
          onClick={() => setMobileOpen(!mobileOpen)}
          color="gray.700"
          p="1"
        >
          {mobileOpen ? <X size={22} /> : <Menu size={22} />}
        </Box>
      </Box>

      {/* Mobile Menu */}
      {mobileOpen && (
        <Box
          maxW="7xl"
          mx="auto"
          mt="2"
          bg="white"
          rounded="2xl"
          border="1px solid"
          borderColor="gray.100"
          boxShadow="0 8px 30px rgba(0,0,0,0.08)"
          p="5"
          display={{ md: "none" }}
        >
          <Flex direction="column" gap="4">
            {navLinks.map((link) => (
              <Link key={link.label} href={link.href} onClick={() => setMobileOpen(false)}>
                <Text fontSize="sm" fontWeight="500" color="gray.700" _hover={{ color: "#8a2ce2" }}>
                  {link.label}
                </Text>
              </Link>
            ))}
            <Box h="1px" bg="gray.100" />
            <Flex gap="3" direction="column">
              {status === "authenticated" ? (
                <>
                  <Link href="/dashboard" onClick={() => setMobileOpen(false)}>
                    <Text fontSize="sm" fontWeight="500" color="gray.600">Dashboard</Text>
                  </Link>
                  <Button 
                    variant="ghost" 
                    justifyContent="flex-start" 
                    p={0} 
                    h="auto" 
                    fontSize="sm" 
                    fontWeight="500" 
                    color="gray.600" 
                    onClick={() => { signOut(); setMobileOpen(false); }}
                  >
                    Log out
                  </Button>
                </>
              ) : (
                <>
                  <Box onClick={() => { onLoginClick?.(); setMobileOpen(false); }} cursor="pointer">
                    <Text fontSize="sm" fontWeight="500" color="gray.600">Log in</Text>
                  </Box>
                  <Link href="/onboarding" onClick={() => setMobileOpen(false)}>
                    <Box
                      bg="#8a2ce2"
                      color="white"
                      px="5"
                      py="2.5"
                      rounded="full"
                      fontSize="sm"
                      fontWeight="600"
                      textAlign="center"
                      cursor="pointer"
                    >
                      Start for free
                    </Box>
                  </Link>
                </>
              )}
            </Flex>
          </Flex>
        </Box>
      )}
    </Box>
  );
}
