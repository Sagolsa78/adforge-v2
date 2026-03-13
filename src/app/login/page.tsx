"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { 
  Box, 
  Flex, 
  Heading, 
  Text, 
  Button, 
  Input, 
  VStack, 
  Center,
  Image,
  Icon,
  Spinner
} from "@chakra-ui/react";
import { Mail, Lock, Sparkles, ArrowRight } from "lucide-react";
import { toaster } from "@/components/ui/toaster";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      const result = await signIn("credentials", {
        email,
        password,
        redirect: false,
      });

      if (result?.error) {
        toaster.create({
          title: "Authentication failed",
          description: "Please check your credentials.",
          type: "error",
        });
      } else {
        router.push("/dashboard");
      }
    } catch (error) {
      toaster.create({
        title: "An error occurred",
        description: "Please try again later.",
        type: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box minH="100vh" bg="#FAFAFA" position="relative" overflow="hidden">
      {/* Background Orbs */}
      <Box position="absolute" top="-10%" right="-5%" w="500px" h="500px" bg="purple.100" filter="blur(100px)" borderRadius="full" opacity="0.4" />
      <Box position="absolute" bottom="-10%" left="-5%" w="500px" h="500px" bg="orange.100" filter="blur(100px)" borderRadius="full" opacity="0.4" />

      <Center minH="100vh" p={4} zIndex={1} position="relative">
        <Box 
          bg="white" 
          p={{ base: 8, md: 10 }} 
          rounded="32px" 
          shadow="2xl" 
          w="full" 
          maxW="480px"
          border="1px solid"
          borderColor="gray.100"
        >
          <VStack gap={8} align="stretch">
            <VStack gap={2} align="center">
              <Flex
                w="12"
                h="12"
                bg="linear-gradient(135deg,#8a2ce2,#ea580c)"
                rounded="xl"
                align="center"
                justify="center"
                mb={2}
              >
                <Text color="white" fontWeight="800" fontSize="xl">A</Text>
              </Flex>
              <Heading fontSize="3xl" fontWeight="black" color="gray.900">Welcome Back</Heading>
              <Text color="gray.500" fontWeight="medium">Sign in to your AdForge account</Text>
            </VStack>

            <form onSubmit={handleSubmit}>
              <VStack gap={5} align="stretch">
                <Box>
                  <Text fontSize="sm" fontWeight="bold" color="gray.700" mb={2}>Email Address</Text>
                  <Flex position="relative" align="center">
                    <Box position="absolute" left={4} color="gray.400">
                      <Mail size={18} />
                    </Box>
                    <Input 
                      type="email" 
                      placeholder="name@company.com" 
                      h="56px"
                      pl="48px"
                      bg="gray.50"
                      border="1px solid"
                      borderColor="gray.200"
                      rounded="16px"
                      _focus={{ borderColor: "#8a2ce2", bg: "white", ring: "4px", ringColor: "purple.50" }}
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                    />
                  </Flex>
                </Box>

                <Box>
                  <Flex justify="space-between" mb={2}>
                    <Text fontSize="sm" fontWeight="bold" color="gray.700">Password</Text>
                    <Text fontSize="xs" fontWeight="bold" color="#8a2ce2" cursor="pointer">Forgot password?</Text>
                  </Flex>
                  <Flex position="relative" align="center">
                    <Box position="absolute" left={4} color="gray.400">
                      <Lock size={18} />
                    </Box>
                    <Input 
                      type="password" 
                      placeholder="••••••••" 
                      h="56px"
                      pl="48px"
                      bg="gray.50"
                      border="1px solid"
                      borderColor="gray.200"
                      rounded="16px"
                      _focus={{ borderColor: "#8a2ce2", bg: "white", ring: "4px", ringColor: "purple.50" }}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                    />
                  </Flex>
                </Box>

                <Button 
                  type="submit"
                  bg="#8a2ce2" 
                  color="white" 
                  h="60px"
                  rounded="16px"
                  fontWeight="black"
                  fontSize="md"
                  _hover={{ bg: "#7c28cb", transform: "translateY(-2px)" }}
                  _active={{ transform: "translateY(0)" }}
                  shadow="lg"
                  shadowColor="purple.200"
                  transition="all 0.2s"
                  disabled={loading}
                >
                  {loading ? <Spinner size="sm" /> : <>Sign In <ArrowRight size={20} style={{ marginLeft: '8px' }} /></>}
                </Button>
              </VStack>
            </form>

            <Flex align="center" gap={4}>
              <Box flex={1} h="1px" bg="gray.100" />
              <Text fontSize="xs" color="gray.400" fontWeight="bold" textTransform="uppercase" letterSpacing="widest">or</Text>
              <Box flex={1} h="1px" bg="gray.100" />
            </Flex>

            <VStack gap={3}>
                <Button 
                  variant="outline"
                  w="full"
                  h="56px"
                  rounded="16px"
                  fontWeight="bold"
                  borderColor="gray.200"
                  _hover={{ bg: "gray.50" }}
                  gap={3}
                >
                    <Image src="https://www.google.com/favicon.ico" w="20px" alt="Google" />
                    Sign in with Google
                </Button>
                <Text fontSize="sm" color="gray.500" textAlign="center" mt={2}>
                    Don't have an account? <Text as="span" color="#8a2ce2" fontWeight="bold" cursor="pointer">Create for free</Text>
                </Text>
            </VStack>
          </VStack>
        </Box>
      </Center>
    </Box>
  );
}
