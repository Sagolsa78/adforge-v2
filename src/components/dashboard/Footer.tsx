'use client'

import React from 'react'
import { Box, Text, Flex, Link, HStack } from '@chakra-ui/react'

export function Footer() {
  return (
    <Box 
      py={6} 
      px={8} 
      borderTop="1px solid" 
      borderColor="borderCore"
      bg="rgba(255, 255, 255, 0.5)"
    >
      <Flex 
        direction={{ base: 'column', md: 'row' }} 
        align="center" 
        justify="space-between" 
        gap={4}
      >
        <Text fontSize="sm" color="textMuted">
          © 2024 AdForge AI. All rights reserved.
        </Text>
        
        <HStack gap={6}>
            <Link href="#" fontSize="sm" color="textMuted" _hover={{ color: 'accentViolet' }}>Terms of Service</Link>
            <Link href="#" fontSize="sm" color="textMuted" _hover={{ color: 'accentViolet' }}>Privacy Policy</Link>
            <Link href="#" fontSize="sm" color="accentViolet" fontWeight="bold">Help Center</Link>
        </HStack>
      </Flex>
    </Box>
  )
}
