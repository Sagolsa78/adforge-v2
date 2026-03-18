import { Metadata } from "next";
import {
  Box,
  Container,
  Heading,
  Text,
  VStack,
  HStack,
  Input,
  SimpleGrid,
  Flex,
} from "@chakra-ui/react";
import Link from "next/link";
import { Search, Mail, BookOpen } from "lucide-react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import FAQAccordion from "./FAQAccordion";

export const metadata: Metadata = {
  title: "Support | Plug and Play Agent",
  description: "Get help with Plug and Play Agent. Find answers to frequently asked questions or contact our support team.",
};

const faqItems = [
  {
    question: "How does Plug and Play Agent work?",
    answer: "Our AI analyzes your brand's unique voice and visual style (Brand DNA) to generate optimized Instagram content. It then crafts high-engagement Reels, Carousels, and Hooks specifically designed to perform well in the current algorithm, helping you grow without spending hours on ideation."
  },
  {
    question: "Is this safe for my Instagram account?",
    answer: "Yes, absolutely. We prioritize account safety by using official API-compliant methods. We never ask for your Instagram password. Everything is managed through secure connections, and we follow Instagram's best practices to ensure your account remains in good standing."
  },
  {
    question: "What Instagram accounts is this best for?",
    answer: "Plug and Play Agent is designed for creators, small business owners, and personal brands who want to scale their Instagram presence without the burnout of manual content creation. Whether you're a coach, an e-commerce brand, or an influencer, our AI adapts to your niche."
  },
  {
    question: "How long does Brand DNA analysis take?",
    answer: "The initial analysis typically takes between 2 to 5 minutes. During this time, our AI scans your existing content and profile to understand your brand's aesthetics, tone, and target audience, ensuring every piece of generated content feels authentic to you."
  },
  {
    question: "Can I cancel my subscription anytime?",
    answer: "Yes, we believe in flexibility. You can cancel your subscription at any time directly through your account settings. There are no long-term contracts or lock-in periods. After cancellation, you'll still have access to your plan until the end of your current billing cycle."
  },
  {
    question: "Do you offer a free trial?",
    answer: "We offer a 7-day free trial on our Pro plan. This allows you to experience the full power of Plug and Play Agent, including Brand DNA analysis and content generation, so you can see the results for yourself before committing."
  },
  {
    question: "How do I connect my Instagram account?",
    answer: "Connecting is simple. Once you sign up, you'll be guided through our secure onboarding process. You'll link your Instagram Professional account via the Meta API, granting the necessary permissions for our agent to analyze and assist with your content strategy."
  },
  {
    question: "What happens to my data if I cancel?",
    answer: "Your data is securely retained for 30 days after cancellation to allow for easy reactivation. After this period, all personal brand data and analysis are permanently deleted from our systems. For more details, please visit our privacy policy."
  }
];

export default function SupportPage() {
  return (
    <Box minH="100vh" bg="white" color="gray.800" display="flex" flexDirection="column" overflowX="hidden">
      <Navbar />

      <Box flex="1" as="main">
        {/* Hero Section */}
        <Box 
          pt={{ base: "32", md: "44" }} 
          pb={{ base: "16", md: "24" }}
          borderBottom="1px solid"
          borderColor="gray.100"
          bgGradient="linear(to-b, white, gray.50)"
        >
          <Container maxW="5xl" mx="auto" px={4}>
            <VStack gap={6} align="center" textAlign="center">
              <Heading as="h1" fontSize={{ base: "4xl", md: "6xl" }} fontWeight="800" letterSpacing="-0.02em" color="gray.900">
                How can we help?
              </Heading>
              <Text fontSize={{ base: "lg", md: "xl" }} color="gray.600" maxW="2xl">
                Search our documentation or browse our growing library of FAQs below to find the answers you need.
              </Text>
              
              <Box w="full" maxW="2xl" pt={6}>
                <Flex 
                  bg="white" 
                  p={4} 
                  borderRadius="xl" 
                  border="1px solid" 
                  borderColor="gray.200"
                  boxShadow="lg"
                  align="center"
                  gap={4}
                  mx="auto"
                >
                  <Search size={24} color="#2563eb" />
                  <Input 
                    placeholder="Search articles, FAQs..." 
                    fontSize="lg"
                    border="none"
                    outline="none"
                    _placeholder={{ color: "gray.400" }}
                    w="full"
                    _focus={{ boxShadow: "none" }}
                  />
                </Flex>
              </Box>
            </VStack>
          </Container>
        </Box>

        {/* FAQ Section */}
        <Box py={24} bg="white">
          <Container maxW="3xl" mx="auto" px={4}>
            <VStack gap={12} align="stretch" w="full">
              <VStack align="center" gap={3} textAlign="center">
                <Text color="blue.600" fontWeight="700" textTransform="uppercase" letterSpacing="widest" fontSize="xs">
                  Resources
                </Text>
                <Heading as="h2" fontSize={{ base: "3xl", md: "4xl" }} fontWeight="800" color="gray.900">
                  Frequently Asked Questions
                </Heading>
              </VStack>

              <Box w="full">
                <FAQAccordion items={faqItems} />
              </Box>
            </VStack>
          </Container>
        </Box>

        {/* Contact Section */}
        <Box py={24} bg="gray.50" borderTop="1px solid" borderColor="gray.100">
          <Container maxW="5xl" mx="auto" px={4}>
            <SimpleGrid columns={{ base: 1, md: 2 }} gap={10}>
              {/* Email Card */}
              <Box 
                p={{ base: 8, md: 10 }} 
                borderRadius="2xl" 
                bg="white" 
                border="1px solid" 
                borderColor="gray.200"
                transition="all 0.3s"
                boxShadow="sm"
                _hover={{ borderColor: "blue.500", boxShadow: "xl", transform: "translateY(-4px)" }}
              >
                <VStack align="flex-start" gap={6}>
                  <Box p={4} bg="blue.50" color="blue.600" borderRadius="xl">
                    <Mail size={32} />
                  </Box>
                  <Box>
                    <Heading as="h3" fontSize="2xl" mb={2} color="gray.900" fontWeight="700">Email Us</Heading>
                    <Text color="gray.600" mb={4} fontSize="lg">Perfect for complex queries or technical support.</Text>
                    <Text color="blue.600" fontWeight="700" fontSize="xl">contact@plugandplayagent.com</Text>
                  </Box>
                  <Text fontSize="sm" color="gray.400" fontStyle="italic">We reply within 24 hours</Text>
                </VStack>
              </Box>

              {/* Docs Card */}
              <Box 
                p={{ base: 8, md: 10 }} 
                borderRadius="2xl" 
                bg="white" 
                border="1px solid" 
                borderColor="gray.200"
                transition="all 0.3s"
                boxShadow="sm"
                _hover={{ borderColor: "blue.500", boxShadow: "xl", transform: "translateY(-4px)" }}
              >
                <VStack align="flex-start" gap={6}>
                  <Box p={4} bg="blue.50" color="blue.600" borderRadius="xl">
                    <BookOpen size={32} />
                  </Box>
                  <Box>
                    <Heading as="h3" fontSize="2xl" mb={2} color="gray.900" fontWeight="700">Browse Documentation</Heading>
                    <Text color="gray.600" mb={6} fontSize="lg">Detailed guides on every feature, setting, and integration.</Text>
                    <Link href="#" passHref style={{ textDecoration: 'none' }}>
                      <Box 
                        as="span"
                        px={8} 
                        py={3.5} 
                        bg="blue.600" 
                        color="white"
                        borderRadius="full" 
                        fontWeight="700"
                        transition="0.2s"
                        _hover={{ bg: "blue.700" }}
                        display="inline-block"
                        textAlign="center"
                        cursor="pointer"
                      >
                        View Help Center
                      </Box>
                    </Link>
                  </Box>
                  <Text fontSize="sm" color="gray.400" fontStyle="italic">Step-by-step tutorials available</Text>
                </VStack>
              </Box>
            </SimpleGrid>
          </Container>
        </Box>
      </Box>

      <Footer />
    </Box>
  );
}
