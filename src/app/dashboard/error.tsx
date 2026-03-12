'use client'

import { useEffect } from 'react'
import { 
  Box, 
  Flex, 
  Heading, 
  Text, 
  Button, 
  Center,
  VStack
} from '@chakra-ui/react'

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error)
  }, [error])

  return (
    <Center h="100vh" w="full" bg="bgBase">
      <VStack gap={6} textAlign="center">
        <Heading as="h2" fontSize="2xl" fontWeight="bold" color="textPrimary">
          Something went wrong!
        </Heading>
        <Text color="textMuted" maxW="md">
          {error.message || "Failed to load dashboard data."}
        </Text>
        <Button
          bg="accentViolet" 
          color="white" 
          h="44px"
          px={8}
          borderRadius="12px" 
          fontWeight="bold" 
          _hover={{ opacity: 0.9 }} 
          onClick={() => reset()}
        >
          Try again
        </Button>
      </VStack>
    </Center>
  )
}
