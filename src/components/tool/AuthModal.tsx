"use client";

import { useState } from "react";
import { Box, Flex, Text, Button, Input, VStack, HStack, IconButton, Spinner } from "@chakra-ui/react";
import { X, Check, Mail } from "lucide-react";
import { useAuth } from "@/store/authStore";

interface Props {
  open: boolean;
  mode: "login" | "signup";
  onClose: () => void;
  onSwitch: (mode: "login" | "signup") => void;
  onAuthSuccess: () => void;
}

export default function AuthModal({ open, mode, onClose, onSwitch, onAuthSuccess }: Props) {
  const { signInWithEmail, signUpWithEmail, signInWithGoogle, signInWithMagicLink } = useAuth();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [pass, setPass] = useState("");
  const [err, setErr] = useState("");
  const [loading, setLoading] = useState(false);
  const [magicSent, setMagicSent] = useState(false);

  const resetForm = () => {
    setName("");
    setEmail("");
    setPass("");
    setErr("");
    setLoading(false);
    setMagicSent(false);
  };

  const handleSubmit = async () => {
    if (!email || !pass) {
      setErr("Please fill in all required fields.");
      return;
    }
    if (mode === "signup" && !name) {
      setErr("Please enter your name.");
      return;
    }
    setErr("");
    setLoading(true);
    try {
      if (mode === "login") {
        await signInWithEmail(email, pass);
      } else {
        await signUpWithEmail(email, pass, name);
      }
      resetForm();
      onAuthSuccess();
    } catch (e: unknown) {
      const error = e as { message?: string };
      setErr(error.message || "Authentication failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleGoogle = async () => {
    setErr("");
    try {
      await signInWithGoogle();
    } catch (e: unknown) {
      const error = e as { message?: string };
      setErr(error.message || "Google sign-in failed.");
    }
  };

  const handleMagicLink = async () => {
    if (!email) {
      setErr("Please enter your email address first.");
      return;
    }
    setErr("");
    setLoading(true);
    try {
      await signInWithMagicLink(email);
      setMagicSent(true);
    } catch (e: unknown) {
      const error = e as { message?: string };
      setErr(error.message || "Failed to send magic link.");
    } finally {
      setLoading(false);
    }
  };

  const handleSwitchMode = (newMode: "login" | "signup") => {
    resetForm();
    onSwitch(newMode);
  };

  if (!open) return null;

  return (
    <Flex
      position="fixed"
      top="0" left="0" right="0" bottom="0"
      bg="blackAlpha.600"
      zIndex="1000"
      align="center"
      justify="center"
      p={4}
      backdropFilter="blur(4px)"
      onClick={(e) => { if (e.target === e.currentTarget) { resetForm(); onClose(); } }}
    >
      <Box
        data-testid="auth-modal"
        bg="white"
        rounded="2xl"
        w="90%"
        maxW="420px"
        position="relative"
        overflow="hidden"
        boxShadow="0 24px 60px rgba(0,0,0,0.15)"
      >
        {/* Close button */}
        <IconButton
          position="absolute"
          top={4}
          right={4}
          variant="ghost"
          size="sm"
          onClick={() => { resetForm(); onClose(); }}
          aria-label="Close"
          color="gray.500"
          _hover={{ bg: "gray.100", color: "gray.900" }}
          zIndex="2"
        >
          <X size={18} />
        </IconButton>

        {/* Header */}
        <Box bg="gray.50" px={8} pt={8} pb={6} borderBottom="1px solid" borderColor="gray.100" textAlign="center">
          <Box
            display="inline-flex"
            alignItems="center"
            px={3} py={1}
            rounded="full"
            bg="white"
            border="1px solid"
            borderColor="gray.200"
            fontSize="11px"
            fontWeight="bold"
            color="gray.700"
            mb={4}
          >
            🔐 Secure Access
          </Box>
          <Text fontSize="2xl" fontWeight="black" color="gray.900" mb={2}>
            {mode === "login" ? "Welcome back" : "Join AdForge"}
          </Text>
          <Text fontSize="sm" color="gray.500" mb={6}>
            {mode === "login"
              ? "Sign in to generate and save your content."
              : "Create your account to unlock all features."}
          </Text>

          {/* Mode toggle pills */}
          <Flex bg="gray.200" p={1} rounded="xl">
            <Button
              flex={1}
              size="sm"
              variant={mode === "login" ? "solid" : "ghost"}
              bg={mode === "login" ? "white" : "transparent"}
              color={mode === "login" ? "gray.900" : "gray.600"}
              boxShadow={mode === "login" ? "sm" : "none"}
              onClick={() => handleSwitchMode("login")}
              rounded="lg"
            >
              Sign In
            </Button>
            <Button
              flex={1}
              size="sm"
              variant={mode === "signup" ? "solid" : "ghost"}
              bg={mode === "signup" ? "white" : "transparent"}
              color={mode === "signup" ? "gray.900" : "gray.600"}
              boxShadow={mode === "signup" ? "sm" : "none"}
              onClick={() => handleSwitchMode("signup")}
              rounded="lg"
            >
              Create Account
            </Button>
          </Flex>
        </Box>

        {/* Body */}
        <Box p={8}>
          {/* Signup features */}
          
          {/* Error display */}
          {err && (
            <Box bg="red.50" border="1px solid" borderColor="red.100" color="red.600" fontSize="sm" p={3} rounded="xl" mb={5}>
              {err}
            </Box>
          )}

          {/* Form */}
          <VStack gap={4} align="stretch">
            {mode === "signup" && (
              <Box>
                <Text fontSize="13px" fontWeight="bold" color="gray.900" mb={1.5}>Full Name</Text>
                <Input
                  h="44px"
                  pl="20px"
                  placeholder="Jane Doe"
                  bg="gray.50"
                  border="1px solid"
                  borderColor="gray.200"
                  rounded="xl"
                  fontSize="14px"
                  _focus={{ borderColor: "#8a2ce2", bg: "white", boxShadow: "0 0 0 3px rgba(138,44,226,0.12)" }}
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              </Box>
            )}
            <Box>
              <Text fontSize="13px" fontWeight="bold" color="gray.900" mb={1.5}>Email Address</Text>
              <Input
                h="44px"
                pl="20px"
                type="email"
                placeholder="you@company.com"
                bg="gray.50"
                border="1px solid"
                borderColor="gray.200"
                rounded="xl"
                fontSize="14px"
                _focus={{ borderColor: "#8a2ce2", bg: "white", boxShadow: "0 0 0 3px rgba(138,44,226,0.12)" }}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </Box>
            <Box>
              <Text fontSize="13px" fontWeight="bold" color="gray.900" mb={1.5}>Password</Text>
              <Input
                h="44px"
                pl="20px"
                type="password"
                placeholder="••••••••"
                bg="gray.50"
                border="1px solid"
                borderColor="gray.200"
                rounded="xl"
                fontSize="14px"
                _focus={{ borderColor: "#8a2ce2", bg: "white", boxShadow: "0 0 0 3px rgba(138,44,226,0.12)" }}
                value={pass}
                onChange={(e) => setPass(e.target.value)}
              />
            </Box>

            {mode === "login" && (
              <Text textAlign="right" fontSize="12px" fontWeight="semibold" color="#8a2ce2" cursor="pointer" mt="-2">
                Forgot password?
              </Text>
            )}

            {/* Primary CTA */}
            <Button
              h="48px"
              bg="#8a2ce2"
              color="white"
              _hover={{ bg: "#7c28cb", transform: "translateY(-1px)" }}
              _active={{ transform: "translateY(0)" }}
              rounded="xl"
              fontWeight="bold"
              onClick={handleSubmit}
              mt={2}
              disabled={loading}
              boxShadow="0 4px 14px rgba(138,44,226,0.3)"
              transition="all 0.2s"
            >
              {loading ? <Spinner size="sm" /> : mode === "login" ? "Sign In" : "Create Account"}
            </Button>
          </VStack>

          {/* Magic Link option */}
          {!magicSent ? (
            <Button
              variant="ghost"
              size="sm"
              w="full"
              mt={3}
              color="#8a2ce2"
              fontWeight="semibold"
              _hover={{ bg: "rgba(138,44,226,0.06)" }}
              onClick={handleMagicLink}
              disabled={loading}
              gap={2}
            >
              <Box as={Mail} boxSize="14px" />
              Send magic link
            </Button>
          ) : (
            <Flex
              align="center"
              justify="center"
              gap={2}
              mt={3}
              p={3}
              rounded="xl"
              bg="rgba(5,150,105,0.08)"
              border="1px solid"
              borderColor="rgba(5,150,105,0.2)"
            >
              <Box as={Check} boxSize="14px" color="#059669" strokeWidth={3} />
              <Text fontSize="sm" fontWeight="bold" color="#059669">
                Check your inbox ✓
              </Text>
            </Flex>
          )}

          {/* Divider */}
          <Flex align="center" my={6}>
            <Box flex="1" h="1px" bg="gray.200" />
            <Text px={3} fontSize="12px" color="gray.400" fontWeight="medium">or continue with</Text>
            <Box flex="1" h="1px" bg="gray.200" />
          </Flex>

          {/* Google OAuth */}
          <Button
            h="48px"
            w="full"
            bg="white"
            border="1px solid"
            borderColor="gray.200"
            color="gray.700"
            _hover={{ bg: "gray.50" }}
            rounded="xl"
            fontWeight="bold"
            onClick={handleGoogle}
          >
            <svg width="18" height="18" viewBox="0 0 24 24" style={{ marginRight: 8 }} fill="none">
              <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
              <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
              <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" fill="#FBBC05" />
              <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
            </svg>
            Continue with Google
          </Button>

          {/* Switch mode link */}
          <Text textAlign="center" fontSize="13px" color="gray.500" mt={6}>
            {mode === "login" ? (
              <>Don&apos;t have an account?{" "}
                <Text as="span" color="#8a2ce2" fontWeight="semibold" cursor="pointer" onClick={() => handleSwitchMode("signup")}>
                  Create one free →
                </Text>
              </>
            ) : (
              <>Already have an account?{" "}
                <Text as="span" color="#8a2ce2" fontWeight="semibold" cursor="pointer" onClick={() => handleSwitchMode("login")}>
                  Sign in →
                </Text>
              </>
            )}
          </Text>
        </Box>
      </Box>
    </Flex>
  );
}
