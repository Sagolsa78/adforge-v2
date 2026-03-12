'use client'

import React from 'react'
import { 
  Box, 
  Flex, 
  Stack, 
  SimpleGrid, 
  Skeleton, 
  Center
} from '@chakra-ui/react'
import { SkeletonCircle, SkeletonText } from '@/components/ui/skeleton'

export function DashboardSkeleton() {
  return (
    <Flex h="100vh" bg="bgBase" overflow="hidden" w="full">
      {/* Sidebar Skeleton */}
      <Box 
        w="240px" 
        flexShrink={0} 
        h="full" 
        borderRight="1px solid" 
        borderColor="borderCore" 
        bg="bgSurface" 
        display={{ base: 'none', lg: 'flex' }} 
        flexDirection="column"
      >
        <Flex h="16" align="center" px={6} gap={2}>
          <Skeleton h="6" w="6" borderRadius="md" />
          <Skeleton h="6" w="24" borderRadius="md" />
        </Flex>
        <Box px={4} py={4}>
          <Skeleton h="12" w="full" borderRadius="xl" />
        </Box>
        <Stack flex={1} px={4} py={2} gap={2}>
          {[...Array(6)].map((_, i) => (
            <Skeleton key={i} h="10" w="full" borderRadius="lg" />
          ))}
        </Stack>
        <Box p={4} mt="auto" borderTop="1px solid" borderColor="borderCore">
          <Skeleton h="12" w="full" borderRadius="xl" />
        </Box>
      </Box>

      {/* Main Content Area Skeleton */}
      <Box as="main" flex={1} display="flex" flexDirection="column" h="full" overflowY="auto">
        <Box p={8} maxW="1200px" mx="auto" w="full" flex={1} display="flex" flexDirection="column">
          
          {/* Welcome Bar Skeleton */}
          <Flex align="center" justify="space-between" py={6} wrap="wrap" gap={4}>
            <Stack gap={2}>
              <Skeleton h="8" w="64" />
              <Skeleton h="4" w="96" />
            </Stack>
            <Skeleton h="44px" w="48" borderRadius="16px" />
          </Flex>

          {/* StatCards Skeleton */}
          <SimpleGrid columns={{ base: 1, md: 2, lg: 4 }} gap={4} mb={4}>
            {[...Array(4)].map((_, i) => (
              <Box 
                key={i} 
                bg="bgSurface" 
                border="1px solid" 
                borderColor="borderCore" 
                borderRadius="24px" 
                p={6} 
                h="160px" 
                display="flex" 
                flexDirection="column" 
                justifyContent="space-between"
                shadow="sm"
              >
                <Skeleton h="3" w="20" />
                <Skeleton h="10" w="16" />
                <Skeleton h="4" w="32" mt="auto" />
              </Box>
            ))}
          </SimpleGrid>

          {/* Bottom Row Skeleton */}
          <SimpleGrid columns={{ base: 1, lg: 3 }} gap={4} flex={1} minH="400px">
            {/* Campaigns Table Skeleton */}
            <Box 
              gridColumn={{ lg: 'span 2' }} 
              bg="bgSurface" 
              border="1px solid" 
              borderColor="borderCore" 
              borderRadius="24px" 
              overflow="hidden" 
              display="flex" 
              flexDirection="column" 
              h="full"
              shadow="sm"
            >
              <Flex px={6} py={5} align="center" justify="space-between" borderBottom="1px solid" borderColor="borderCore">
                <Skeleton h="6" w="32" />
                <Skeleton h="4" w="20" />
              </Flex>
              <Stack w="full" p={6} gap={6}>
                {[...Array(5)].map((_, i) => (
                  <Skeleton key={i} h="12" w="full" borderRadius="12px" />
                ))}
              </Stack>
            </Box>

            {/* Brand DNA Card Skeleton */}
            <Box 
              bg="bgSurface" 
              border="1px solid" 
              borderColor="borderCore" 
              borderRadius="24px" 
              p={6} 
              display="flex" 
              flexDirection="column" 
              h="full"
              shadow="sm"
            >
              <Flex align="center" justify="space-between" mb={8}>
                <Skeleton h="6" w="24" />
                <Skeleton h="4" w="16" />
              </Flex>
              <Center mb={8}>
                <SkeletonCircle size="120px" />
              </Center>
              <Stack gap={5}>
                {[...Array(4)].map((_, i) => (
                  <Flex key={i} justify="space-between" align="center">
                    <Skeleton h="4" w="20" />
                    <Skeleton h="8" w="28" borderRadius="8px" />
                  </Flex>
                ))}
              </Stack>
              <Skeleton mt="auto" w="full" h="44px" borderRadius="12px" />
            </Box>
          </SimpleGrid>
        </Box>
      </Box>

      {/* Right Panel Skeleton */}
      <Box 
        as="aside" 
        w="320px" 
        flexShrink={0} 
        h="full" 
        display={{ base: 'none', xl: 'flex' }} 
        flexDirection="column" 
        p={6}
        bg="bgSurface"
        borderLeft="1px solid"
        borderColor="borderCore"
      >
        <Skeleton h="6" w="32" mb={8} mt={2} />
        <Stack gap={4} mb={10}>
          {[...Array(3)].map((_, i) => (
            <Flex 
              key={i} 
              bg="bgBase" 
              border="1px solid" 
              borderColor="borderCore" 
              borderRadius="16px" 
              p={4} 
              h="20" 
              align="center" 
              gap={3}
            >
              <Skeleton h="8" w="8" borderRadius="10px" />
              <Stack flex={1} gap={2}>
                <Skeleton h="4" w="24" />
                <Skeleton h="3" w="32" />
              </Stack>
            </Flex>
          ))}
        </Stack>
        <Skeleton h="5" w="32" mb={8} />
        <Box position="relative" borderLeft="2px solid" borderColor="borderCore" ml={3} pl={5}>
          <Stack gap={6}>
            {[...Array(5)].map((_, i) => (
              <Stack key={i} gap={2}>
                <Skeleton h="4" w="full" />
                <Skeleton h="3" w="20" />
              </Stack>
            ))}
          </Stack>
        </Box>
      </Box>
    </Flex>
  )
}
