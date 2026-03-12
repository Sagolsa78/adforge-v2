'use client'

import React from 'react'
import { 
  Box, 
  Flex, 
  HStack, 
  IconButton, 
  Text, 
  Input,
  Avatar,
  Icon,
  Badge,
  Circle
} from '@chakra-ui/react'
import { 
  Menu, 
  Bell, 
  Search, 
  ChevronDown,
  Rocket
} from 'lucide-react'
import { InputGroup } from '@/components/ui/input-group'



export function Navbar() {
  return (
    <Box 
      h="72px" 
      bg="white" 
      borderBottom="1px solid" 
      borderColor="borderCore" 
      px={6} 
      position="sticky"
      top={0}
      zIndex={100}
      w="full"
    >
      <Flex h="full" align="center" justify="space-between">
        <HStack gap={4}>
          
          
          <HStack gap={2.5} ml={2}>
            <Circle size="36px" bg="accentViolet" shadow="md" shadowColor="accentViolet/20">
                <Icon color="white" size="sm">
                    <Rocket size={18} />
                </Icon>
            </Circle>
            <Box>
                <Text fontWeight="black" color="textPrimary" fontSize="xl" letterSpacing="tight" lineHeight="1">
                    AdForge
                </Text>
                <Badge variant="subtle" colorPalette="purple" size="xs" fontSize="8px" px={1.5} py={0} borderRadius="full" mt={0.5}>
                    AI POWERED
                </Badge>
            </Box>
          </HStack>
        </HStack>

        <HStack gap={6}>
          {/* Search Bar */}
          <InputGroup 
            display={{ base: 'none', lg: 'block' }}
            w="300px"
            startElement={<Search size={16} color="#A09DB8" />}
          >
            <Input 
              placeholder="Search anything..." 
              borderRadius="full"
              bg="bgBase"
              borderColor="borderCore"
              color="textPrimary"
              fontSize="sm"
              _placeholder={{ color: 'textMuted' }}
              _focus={{ borderColor: 'accentViolet', ring: "2px", ringColor: 'accentViolet/10', bg: 'white' }}
            />
          </InputGroup>

          {/* Notifications */}
          <Box position="relative" cursor="pointer">
            <IconButton 
                variant="ghost" 
                borderRadius="full" 
                color="textMuted"
                _hover={{ bg: 'bgBase', color: 'accentViolet' }}
            >
                <Bell size={20} />
            </IconButton>
            <Circle 
                size="8px" 
                bg="red.500" 
                position="absolute" 
                top="8px" 
                right="8px" 
                border="2px solid white" 
            />
          </Box>

          {/* User Profile */}
          <HStack gap={3} p={1} pl={2} pr={4} borderRadius="full" cursor="pointer" transition="all 0.2s" _hover={{ bg: 'bgBase' }}>
                <Avatar.Root size="sm">
                    <Avatar.Image src="https://i.pravatar.cc/150?u=mohit" />
                    <Avatar.Fallback name="User Name" />
                </Avatar.Root>
                <Box display={{ base: 'none', md: 'block' }}>
                    <Text fontSize="sm" fontWeight="bold" color="textPrimary" lineHeight="1">Mohit</Text>
                    <Text fontSize="10px" color="textMuted">Admin</Text>
                </Box>
                <ChevronDown size={14} color="#6B6880" />
          </HStack>
        </HStack>
      </Flex>
    </Box>
  )
}
