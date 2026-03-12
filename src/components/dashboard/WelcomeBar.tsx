import React from 'react'
import NextLink from 'next/link'
import { Flex, Box, Heading, Text, Link, Button } from '@chakra-ui/react'

export function WelcomeBar() {
  return (
    <Flex align="center" justify="space-between" py={6} wrap="wrap" gap={4}>
      <Flex direction="column" gap={1}>
        <Heading fontSize="28px" fontWeight="bold" color="textPrimary" lineHeight="tight">
          Good morning, Mohit 👋
        </Heading>
        <Text color="textSecondary" fontSize="sm">
          Your{' '}
          <Link
            asChild
            color="accentViolet"
            textDecoration="underline"
            fontWeight="medium"
          >
            <NextLink href="/dashboard/brand-dna">Brand DNA</NextLink>
          </Link>{' '}
          is ready. Start your first campaign.
        </Text>
      </Flex>
      
      <Button 
        bg="accentViolet" 
        color="white" 
        h="44px" 
        px={6} 
        borderRadius="16px" 
        fontWeight="bold" 
        transition="all 0.2s"
        _hover={{ bg: '#6D28D9', transform: "translateY(-2px)" }}
      >
        <Box as="span" fontSize="lg" lineHeight="none" mb="2px" mr={2}>✦</Box> Generate Campaign
      </Button>
    </Flex>
  )
}
