"use client";

import { useState } from "react";
import { Metadata } from "next";
import {
  Box,
  Container,
  Heading,
  Text,
  VStack,
  HStack,
  SimpleGrid,
  Badge,
  Flex,
  Dialog,
  Portal,
  Button,
} from "@chakra-ui/react";
import Link from "next/link";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";

// Note: Metadata cannot be in a "use client" file. 
// I will move the data and component to a separate client component if needed, 
// or just remove the Metadata export for now to prioritize functionality.
// Actually, I can put the metadata in a layout or keep the page as a server component 
// and wrap the content in a client component. 
// Let's do the latter for best practice.

interface BlogPost {
  id: number;
  title: string;
  category: "Product" | "Growth" | "Strategy";
  excerpt: string;
  content: string;
  author?: string;
  date: string;
  isFeatured?: boolean;
}

const posts: BlogPost[] = [
  {
    id: 1,
    isFeatured: true,
    title: "How We Built Brand DNA: The AI Behind Your Instagram Strategy",
    category: "Product",
    excerpt: "Deep dive into the machine learning models that analyze your brand aesthetics and audience sentiment to create the perfect content strategy.",
    content: "Our Brand DNA engine is the heart of Plug and Play Agent. It uses advanced computer vision to understand your visual style and natural language processing to grasp your brand's unique voice. By analyzing hundreds of data points from your top-performing posts, it builds a comprehensive profile that guides all future content generation. This ensures that every Reel and Carousel we generate feels authentically yours while being optimized for maximum engagement.",
    author: "Plug and Play Team",
    date: "March 10, 2026",
  },
  {
    id: 2,
    title: "7 Instagram Growth Mistakes You're Probably Making",
    category: "Growth",
    excerpt: "From inconsistent posting to ignoring engagement metrics, here are the top pitfalls to avoid if you want to scale in 2026.",
    content: "The most common mistake we see is 'shadow-chasing' — trying to replicate viral trends that don't align with your brand DNA. Other major errors include neglecting your Story strategy, failing to optimize for the first 3 seconds of a Reel, and ignoring the power of SEO-friendly captions. In this post, we break down each mistake and provide actionable solutions to get your growth back on track.",
    date: "March 3, 2026",
  },
  {
    id: 4,
    title: "What's New in Plug and Play Agent v2.4",
    category: "Product",
    excerpt: "Discover the latest features, including the new Support portal, enhanced Carousel generation, and faster Brand DNA analysis.",
    content: "Version 2.4 brings significant performance improvements. Our Brand DNA analysis is now 40% faster, and the new Carousel generator includes 5 new professional templates. We've also launched our comprehensive Support portal to help you master every feature of the platform. Check out the full changelog to see everything we've updated in this milestone release.",
    date: "March 1, 2026",
  },
  {
    id: 3,
    title: "Why Consistency Beats Virality Every Time",
    category: "Strategy",
    excerpt: "Building a sustainable audience requires trust, which only comes from showing up every day with high-quality content that resonates.",
    content: "One viral hit might get you followers, but consistency keeps them. The Instagram algorithm rewards accounts that keep users on the platform regularly. By posting consistent, high-value content, you build a habit with your audience. They begin to look for your posts, engage more frequently, and eventually transition from passive followers to loyal brand advocates.",
    date: "Feb 24, 2026",
  },
  {
    id: 5,
    title: "How to Write Captions That Actually Convert",
    category: "Growth",
    excerpt: "Stop writing boring captions. Learn the hook-body-CTA framework that turns passive viewers into active followers.",
    content: "Your caption is the second most important part of your post after the visual. A great caption should start with a 'Scroll Stopper' hook, provide value or storytelling in the body, and always end with a clear Call to Action (CTA). Whether you want more comments, website visits, or saves, your caption is where you make the ask and drive the result.",
    date: "Feb 15, 2026",
  },
  {
    id: 6,
    title: "The Science of Optimal Posting Times",
    category: "Strategy",
    excerpt: "We analyzed 1 million posts to find out exactly when your audience is most active and ready to engage with your content.",
    content: "There is no single 'best time' for everyone. The optimal time depends on your specific audience's timezone and app usage patterns. However, our data shows clear peaks during morning commutes, lunch breaks, and late evenings. We'll show you how to use your built-in analytics combined with our AI insights to nail your timing every single day.",
    date: "Feb 8, 2026",
  },
  {
    id: 7,
    title: "Creator vs. Business Account: Which One Should You Use?",
    category: "Growth",
    excerpt: "Understand the critical differences in analytics, music rights, and advertising features to make the right choice for your brand.",
    content: "Choosing the wrong account type can limit your reach or access to viral audio. Creator accounts are perfect for individuals and influencers who need access to the full music library, while Business accounts offer enhanced API access and professional contact buttons. We compare both in depth to help you decide which one aligns with your monetization and growth goals.",
    date: "Jan 30, 2026",
  },
];

const categoryColors = {
  Product: "purple",
  Growth: "blue",
  Strategy: "cyan",
};

export default function BlogPage() {
  const [selectedPost, setSelectedPost] = useState<BlogPost | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const handleOpenPost = (post: BlogPost) => {
    setSelectedPost(post);
    setIsDialogOpen(true);
  };

  const featuredPost = posts.find((p) => p.isFeatured);
  const gridPosts = posts.filter((p) => !p.isFeatured);

  return (
    <Box minH="100vh" bg="white" color="gray.800" display="flex" flexDirection="column" overflowX="hidden">
      <Navbar />

      <Box flex="1" as="main">
        {/* Hero Section */}
        <Box 
          pt={{ base: "32", md: "44" }} 
          pb={{ base: "12", md: "20" }}
          bgGradient="linear(to-b, white, gray.50)"
          borderBottom="1px solid"
          borderColor="gray.100"
        >
          <Container maxW="5xl" mx="auto" px={4}>
            <VStack gap={4} align="center" textAlign="center">
              <Heading as="h1" fontSize={{ base: "4xl", md: "6xl" }} fontWeight="800" letterSpacing="-0.02em" color="gray.900">
                Blog
              </Heading>
              <Text fontSize={{ base: "lg", md: "xl" }} color="gray.600" maxW="2xl">
                Tips, updates, and insights for Instagram growth.
              </Text>
            </VStack>
          </Container>
        </Box>

        {/* Featured Post Banner */}
        {featuredPost && (
          <Box py={16}>
            <Container maxW="5xl" mx="auto" px={4}>
              <Box 
                as="button"
                onClick={() => handleOpenPost(featuredPost)}
                textAlign="left"
                w="full"
                p={{ base: 8, md: 12 }} 
                borderRadius="3xl" 
                bg="gray.50" 
                border="1px solid" 
                borderColor="gray.200"
                transition="all 0.3s"
                boxShadow="sm"
                _hover={{ borderColor: "blue.500", boxShadow: "xl", transform: "translateY(-4px)" }}
                cursor="pointer"
              >
                <VStack align="flex-start" gap={6}>
                  <Badge colorPalette={categoryColors[featuredPost.category]} size="lg" borderRadius="full" px={4} py={1}>
                    {featuredPost.category}
                  </Badge>
                  <VStack align="flex-start" gap={3}>
                    <Heading as="h2" fontSize={{ base: "2xl", md: "4xl" }} fontWeight="800" color="gray.900" lineHeight="1.2">
                      {featuredPost.title}
                    </Heading>
                    <Text color="gray.600" fontSize={{ base: "lg", md: "xl" }} maxW="3xl">
                      {featuredPost.excerpt}
                    </Text>
                  </VStack>
                  <HStack gap={4} w="full" justify="space-between" align="center">
                    <HStack gap={2}>
                      <Text fontWeight="700" color="gray.900">{featuredPost.author}</Text>
                      <Text color="gray.400">·</Text>
                      <Text color="gray.500">{featuredPost.date}</Text>
                    </HStack>
                    <Text fontWeight="700" color="blue.600" fontSize="lg">Read Preview →</Text>
                  </HStack>
                </VStack>
              </Box>
            </Container>
          </Box>
        )}

        {/* Blog Grid */}
        <Box pb={24}>
          <Container maxW="5xl" mx="auto" px={4}>
            <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} gap={10}>
              {gridPosts.map((post) => (
                <Box 
                  key={post.id}
                  as="button"
                  onClick={() => handleOpenPost(post)}
                  textAlign="left"
                  h="full"
                  p={8} 
                  borderRadius="2xl" 
                  bg="white" 
                  border="1px solid" 
                  borderColor="gray.200"
                  transition="all 0.3s"
                  boxShadow="sm"
                  display="flex"
                  flexDirection="column"
                  _hover={{ borderColor: "blue.500", boxShadow: "lg", transform: "translateY(-4px)" }}
                  cursor="pointer"
                >
                  <VStack align="flex-start" gap={4} flex="1">
                    <Badge colorPalette={categoryColors[post.category]} borderRadius="full" px={3}>
                      {post.category}
                    </Badge>
                    <Heading as="h3" fontSize="xl" fontWeight="700" color="gray.900" lineHeight="1.3">
                      {post.title}
                    </Heading>
                    <Text color="gray.600" fontSize="sm" lineHeight="1.6" lineClamp={3}>
                      {post.excerpt}
                    </Text>
                  </VStack>
                  <Box mt={6} pt={6} borderTop="1px solid" borderColor="gray.100" w="full">
                    <HStack justify="space-between" align="center">
                      <Text fontSize="xs" color="gray.400" fontWeight="600">{post.date}</Text>
                      <Text fontWeight="700" color="blue.600" fontSize="sm">Read Preview →</Text>
                    </HStack>
                  </Box>
                </Box>
              ))}
            </SimpleGrid>
          </Container>
        </Box>
      </Box>

      {/* Pop-up Dialog */}
      <Dialog.Root open={isDialogOpen} onOpenChange={(e) => setIsDialogOpen(e.open)} size="lg">
        <Portal>
          <Dialog.Backdrop bg="blackAlpha.600" backdropFilter="blur(4px)" />
          <Dialog.Positioner>
            <Dialog.Content borderRadius="2xl" p={8} bg="white">
              {selectedPost && (
                <VStack align="flex-start" gap={6}>
                  <Badge colorPalette={categoryColors[selectedPost.category]} borderRadius="full" px={3}>
                    {selectedPost.category}
                  </Badge>
                  <Dialog.Header p={0}>
                    <Dialog.Title fontSize="3xl" fontWeight="800" color="gray.900">
                      {selectedPost.title}
                    </Dialog.Title>
                  </Dialog.Header>
                  <Dialog.Body p={0}>
                    <VStack align="flex-start" gap={4}>
                      <HStack gap={2} fontSize="sm" color="gray.500">
                        <Text fontWeight="700" color="gray.700">{selectedPost.author || "Plug and Play Team"}</Text>
                        <Text>·</Text>
                        <Text>{selectedPost.date}</Text>
                      </HStack>
                      <Text color="gray.600" fontSize="lg" lineHeight="1.7">
                        {selectedPost.content}
                      </Text>
                    </VStack>
                  </Dialog.Body>
                  <Dialog.Footer p={0} w="full" pt={6} borderTop="1px solid" borderColor="gray.100">
                    <HStack w="full" justify="space-between">
                      <Button variant="ghost" onClick={() => setIsDialogOpen(false)}>Close</Button>
                      <Link href={`/blog/${selectedPost.id}`} passHref>
                        <Button colorPalette="blue" px={8} borderRadius="full">
                          Read Full Article →
                        </Button>
                      </Link>
                    </HStack>
                  </Dialog.Footer>
                </VStack>
              )}
              <Dialog.CloseTrigger />
            </Dialog.Content>
          </Dialog.Positioner>
        </Portal>
      </Dialog.Root>

      <Footer />
    </Box>
  );
}
