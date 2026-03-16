"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  Box,
  Button,
  Flex,
  Input,
  Spinner,
  Text,
  VStack,
} from "@chakra-ui/react";
import { Check, Mail, Sparkles } from "lucide-react";
import { useAuth } from "@/store/AuthProvider";
import { ROUTES } from "@/constants";
import { LoginPageProps } from "@/props/LoginPage";

/**
 * LoginPage Component
 * Full-page authentication UI with email/password and Google OAuth.
 */
export default function LoginPage({
  redirectTo = ROUTES.DASHBOARD,
}: LoginPageProps) {
  const router = useRouter();
  const {
    user,
    isLoading,
    signInWithEmail,
    signUpWithEmail,
    signInWithGoogle,
    signInWithMagicLink,
  } = useAuth();
  const [mode, setMode] = useState<"login" | "signup">("login");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [pass, setPass] = useState("");
  const [err, setErr] = useState("");
  const [loading, setLoading] = useState(false);
  const [magicSent, setMagicSent] = useState(false);

  useEffect(() => {
    if (!isLoading && user) {
      router.push(redirectTo);
    }
  }, [isLoading, router, redirectTo, user]);

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
      router.push(redirectTo);
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

  if (isLoading) {
    return (
      <Flex minH="100vh" align="center" justify="center" bg="#F8F8F6">
        <Spinner size="lg" color="#4F46E5" />
      </Flex>
    );
  }

  return (
    <Flex minH="100vh" bg="#F8F8F6" align="center" justify="center" px={6}>
      <Box
        w="full"
        maxW="480px"
        bg="white"
        borderRadius="24px"
        boxShadow="0 12px 48px rgba(0, 0, 0, 0.04)"
        overflow="hidden"
      >
        <Box
          bg="#F8F8F6"
          px={8}
          pt={8}
          pb={6}
          borderBottom="1px solid"
          borderColor="#ECECEC"
        >
          <Flex align="center" gap={3} mb={4}>
            <Flex
              w="32px"
              h="32px"
              borderRadius="10px"
              bg="#4F46E5"
              align="center"
              justify="center"
              color="white"
            >
              <Sparkles size={18} strokeWidth={2.5} />
            </Flex>
            <Text fontWeight="700" fontSize="lg" color="#111111">
              Plug and Play Agent
            </Text>
          </Flex>
          <Text fontSize="2xl" fontWeight="700" color="#111111" mb={2}>
            {mode === "login" ? "Welcome back" : "Create your account"}
          </Text>
          <Text fontSize="sm" color="#6B7280">
            {mode === "login"
              ? "Sign in to access your dashboard."
              : "Start generating content with AI in minutes."}
          </Text>
          <Flex bg="#ECECEC" p={1} borderRadius="14px" mt={6}>
            <Button
              flex={1}
              size="sm"
              variant={mode === "login" ? "solid" : "ghost"}
              bg={mode === "login" ? "white" : "transparent"}
              color={mode === "login" ? "#111111" : "#6B7280"}
              boxShadow={mode === "login" ? "sm" : "none"}
              onClick={() => setMode("login")}
              borderRadius="12px"
            >
              Sign In
            </Button>
            <Button
              flex={1}
              size="sm"
              variant={mode === "signup" ? "solid" : "ghost"}
              bg={mode === "signup" ? "white" : "transparent"}
              color={mode === "signup" ? "#111111" : "#6B7280"}
              boxShadow={mode === "signup" ? "sm" : "none"}
              onClick={() => setMode("signup")}
              borderRadius="12px"
            >
              Create Account
            </Button>
          </Flex>
        </Box>

        <Box px={8} py={8}>
          {err && (
            <Box
              bg="red.50"
              border="1px solid"
              borderColor="red.100"
              color="red.600"
              fontSize="sm"
              p={3}
              borderRadius="12px"
              mb={5}
            >
              {err}
            </Box>
          )}

          <VStack gap={4} align="stretch">
            {mode === "signup" && (
              <Box>
                <Text fontSize="13px" fontWeight="700" color="#111111" mb={1.5}>
                  Full Name
                </Text>
                <Input
                  h="44px"
                  pl="16px"
                  placeholder="Jane Doe"
                  bg="#F8F8F6"
                  border="1px solid"
                  borderColor="#ECECEC"
                  borderRadius="14px"
                  fontSize="14px"
                  _focus={{
                    borderColor: "#4F46E5",
                    bg: "white",
                    boxShadow: "0 0 0 3px rgba(79, 70, 229, 0.12)",
                  }}
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              </Box>
            )}
            <Box>
              <Text fontSize="13px" fontWeight="700" color="#111111" mb={1.5}>
                Email Address
              </Text>
              <Input
                h="44px"
                pl="16px"
                type="email"
                placeholder="you@company.com"
                bg="#F8F8F6"
                border="1px solid"
                borderColor="#ECECEC"
                borderRadius="14px"
                fontSize="14px"
                _focus={{
                  borderColor: "#4F46E5",
                  bg: "white",
                  boxShadow: "0 0 0 3px rgba(79, 70, 229, 0.12)",
                }}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </Box>
            <Box>
              <Text fontSize="13px" fontWeight="700" color="#111111" mb={1.5}>
                Password
              </Text>
              <Input
                h="44px"
                pl="16px"
                type="password"
                placeholder="••••••••"
                bg="#F8F8F6"
                border="1px solid"
                borderColor="#ECECEC"
                borderRadius="14px"
                fontSize="14px"
                _focus={{
                  borderColor: "#4F46E5",
                  bg: "white",
                  boxShadow: "0 0 0 3px rgba(79, 70, 229, 0.12)",
                }}
                value={pass}
                onChange={(e) => setPass(e.target.value)}
              />
            </Box>

            <Button
              h="48px"
              bg="#4F46E5"
              color="white"
              _hover={{ bg: "#4338CA", transform: "translateY(-1px)" }}
              _active={{ transform: "translateY(0)" }}
              borderRadius="14px"
              fontWeight="700"
              onClick={handleSubmit}
              mt={2}
              disabled={loading}
              boxShadow="0 4px 12px rgba(79, 70, 229, 0.2)"
              transition="all 0.2s ease"
            >
              {loading ? (
                <Spinner size="sm" />
              ) : mode === "login" ? (
                "Sign In"
              ) : (
                "Create Account"
              )}
            </Button>
          </VStack>

          {!magicSent ? (
            <Button
              variant="ghost"
              size="sm"
              w="full"
              mt={3}
              color="#4F46E5"
              fontWeight="600"
              _hover={{ bg: "rgba(79, 70, 229, 0.06)" }}
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
              borderRadius="12px"
              bg="rgba(5,150,105,0.08)"
              border="1px solid"
              borderColor="rgba(5,150,105,0.2)"
            >
              <Box as={Check} boxSize="14px" color="#059669" strokeWidth={3} />
              <Text fontSize="sm" fontWeight="700" color="#059669">
                Check your inbox
              </Text>
            </Flex>
          )}

          <Flex align="center" my={6}>
            <Box flex="1" h="1px" bg="#ECECEC" />
            <Text px={3} fontSize="12px" color="#6B7280" fontWeight="600">
              or continue with
            </Text>
            <Box flex="1" h="1px" bg="#ECECEC" />
          </Flex>

          <Button
            h="48px"
            w="full"
            bg="white"
            border="1px solid"
            borderColor="#ECECEC"
            color="#111111"
            _hover={{ bg: "#F8F8F6" }}
            borderRadius="14px"
            fontWeight="700"
            onClick={handleGoogle}
          >
            <svg
              width="18"
              height="18"
              viewBox="0 0 24 24"
              style={{ marginRight: 8 }}
              fill="none"
            >
              <path
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                fill="#4285F4"
              />
              <path
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                fill="#34A853"
              />
              <path
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z"
                fill="#FBBC05"
              />
              <path
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                fill="#EA4335"
              />
            </svg>
            Continue with Google
          </Button>
        </Box>
      </Box>
    </Flex>
  );
}
