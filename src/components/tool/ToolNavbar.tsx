"use client";

import { useState, useRef, useEffect } from "react";
import type { AuthUser } from "@/types/tool";
import { Box, Flex, Text, Button, Container } from "@chakra-ui/react";
import { ChevronDown, LogOut } from "lucide-react";

interface Props {
  user: AuthUser | null;
  onLoginClick: () => void;
  onSignupClick: () => void;
  onLogout: () => void;
  onHome: () => void;
}

export default function ToolNavbar({ user, onLoginClick, onSignupClick, onLogout, onHome }: Props) {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropRef = useRef<HTMLDivElement>(null);

  // Close dropdown on outside click
  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (dropRef.current && !dropRef.current.contains(e.target as Node)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  return (
    <Box as="nav" position="sticky" top="0" w="full" zIndex={100} px={{ base: "4", md: "6" }} py="4">
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
      >
        <Flex align="center" justify="space-between">
          {/* Logo */}
          <Flex align="center" gap="2" cursor="pointer" onClick={onHome}>
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

          {/* Right side */}
          <Flex align="center">
            {!user ? (
              <Flex gap={3}>
                <Button
                  variant="ghost"
                  onClick={onLoginClick}
                  rounded="full"
                  fontWeight="bold"
                  color="gray.700"
                  _hover={{ bg: "gray.50" }}
                >
                  Sign In
                </Button>
                <Button
                  bg="#8a2ce2"
                  color="white"
                  onClick={onSignupClick}
                  rounded="full"
                  fontWeight="bold"
                  px={6}
                  boxShadow="0 4px 14px rgba(138,44,226,0.3)"
                  _hover={{ bg: "#7c28cb", transform: "translateY(-1px)" }}
                  _active={{ transform: "translateY(0)" }}
                  transition="all 0.2s"
                >
                  Start Free
                </Button>
              </Flex>
            ) : (
              <Box position="relative" ref={dropRef}>
                <Button
                  variant="ghost"
                  onClick={() => setDropdownOpen((p) => !p)}
                  rounded="full"
                  h="10"
                  px={4}
                  gap={3}
                  _hover={{ bg: "gray.50" }}
                >
                  {/* Avatar with gradient */}
                  <Flex
                    w="8"
                    h="8"
                    rounded="full"
                    align="center"
                    justify="center"
                    fontSize="sm"
                    fontWeight="black"
                    color="white"
                    css={{
                      backgroundImage: "linear-gradient(135deg, #8a2ce2, #ea580c)",
                    }}
                  >
                    {user.name.charAt(0).toUpperCase()}
                  </Flex>
                  <Text fontSize="sm" fontWeight="bold" color="gray.700">
                    {user.name}
                  </Text>
                  <Box
                    as={ChevronDown}
                    boxSize="16px"
                    color="gray.400"
                    transition="transform 0.2s"
                    transform={dropdownOpen ? "rotate(180deg)" : "rotate(0)"}
                  />
                </Button>

                {/* Dropdown */}
                {dropdownOpen && (
                  <Box
                    position="absolute"
                    top="calc(100% + 6px)"
                    right={0}
                    bg="white"
                    border="1px solid"
                    borderColor="gray.100"
                    rounded="xl"
                    boxShadow="0 10px 40px rgba(0,0,0,0.1)"
                    minW="220px"
                    overflow="hidden"
                    zIndex={200}
                  >
                    <Box px={4} py={3} borderBottom="1px solid" borderColor="gray.100">
                      <Text fontSize="sm" fontWeight="bold" color="gray.900">
                        {user.name}
                      </Text>
                      <Text fontSize="xs" color="gray.500">
                        {user.email}
                      </Text>
                    </Box>
                    <Box px={2} py={2}>
                      <Button
                        variant="ghost"
                        w="full"
                        justifyContent="flex-start"
                        rounded="lg"
                        size="sm"
                        color="red.500"
                        _hover={{ bg: "red.50" }}
                        onClick={() => {
                          setDropdownOpen(false);
                          onLogout();
                        }}
                        gap={2}
                      >
                        <Box as={LogOut} boxSize="14px" />
                        Sign out
                      </Button>
                    </Box>
                  </Box>
                )}
              </Box>
            )}
          </Flex>
        </Flex>
      </Box>
    </Box>
  );
}
