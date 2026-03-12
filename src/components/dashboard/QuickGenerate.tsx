'use client'

import React from 'react'
import { ActivityItem } from '@/lib/api/types'
import { Sparkles, Plus, LayoutGrid, FileText, Clock, ArrowRight } from 'lucide-react'
import { 
  Box, 
  Flex, 
  Heading, 
  Stack, 
  Text, 
  Button, 
  Icon, 
  Center,
  VStack,
  HStack 
} from '@chakra-ui/react'

interface QuickGenerateProps {
  activities: ActivityItem[]
}

export function QuickGenerate({ activities }: QuickGenerateProps) {
  return (
    <Box 
      as="aside" 
      w="320px" 
      flexShrink={0} 
      h="full" 
      display={{ base: 'none', xl: 'flex' }} 
      flexDirection="column" 
      p={6} 
      overflowY="auto"
      borderLeft="1px solid"
      borderColor="borderCore"
      bg="bgSurface"
    >
      {/* Quick Generate Header */}
      <Heading 
        as="h2" 
        fontSize="16px" 
        fontWeight="bold" 
        color="textPrimary" 
        display="flex" 
        alignItems="center" 
        gap={2} 
        mb={6} 
        mt={2}
      >
        <Icon color="accentViolet" fontSize="18px">
            <Sparkles size={18} />
        </Icon>
        Quick Actions
      </Heading>

      {/* Action Cards */}
      <Stack gap={4} mb={10}>
        <QuickActionButton 
          icon={Plus} 
          label="New Post" 
          subtext="Single image & caption..." 
          iconBg="accentOrange"
        />
        <QuickActionButton 
          icon={LayoutGrid} 
          label="New Campaign" 
          subtext="Multi-platform content..." 
          iconBg="accentViolet"
        />
        <QuickActionButton 
          icon={FileText} 
          label="Brand Report" 
          subtext="PDF export of assets..." 
          iconBg="success"
        />
      </Stack>

      {/* Recent Activity Header */}
      <Heading 
        as="h3" 
        fontSize="14px" 
        fontWeight="bold" 
        color="textPrimary" 
        display="flex" 
        alignItems="center" 
        gap={2} 
        mb={6}
      >
        <Center boxSize="6" borderRadius="full" bg="bgBase" border="1px solid" borderColor="borderCore">
          <Icon color="textMuted" fontSize="12px">
            <Clock size={12} />
          </Icon>
        </Center>
        Recent Activity
      </Heading>

      {/* Activity Timeline */}
      <Box position="relative" borderLeft="1px solid" borderColor="borderCore" ml={3} pl={5}>
        <Stack gap={6}>
          {activities.map((activity, index) => (
            <Box key={activity.id} position="relative">
              {/* Timeline Dot */}
              <Box 
                position="absolute" 
                left="-25px" 
                top="1.5" 
                w="9px" 
                h="9px" 
                borderRadius="full" 
                bg="white" 
                border="2px solid" 
                borderColor={index === 0 ? 'accentViolet' : 'textMuted'} 
                zIndex={1}
              />
              
              <Text fontSize="13px" fontWeight="bold" color="textPrimary" lineHeight="tall">
                {activity.text}
              </Text>
              <Text fontSize="11px" color="textMuted" mt={1}>
                {activity.timestamp}
              </Text>
            </Box>
          ))}
        </Stack>
      </Box>
    </Box>
  )
}

function QuickActionButton({ icon: IconComp, label, subtext, iconBg }: { 
  icon: any, 
  label: string, 
  subtext: string, 
  iconBg: string 
}) {
  return (
    <Button 
      variant="ghost"
      w="full" 
      h="auto"
      bg="bgBase" 
      border="1px solid" 
      borderColor="borderCore" 
      borderRadius="16px" 
      p={4} 
      display="flex" 
      alignItems="center" 
      justifyContent="space-between" 
      textAlign="left" 
      transition="all 0.2s" 
      _hover={{ borderColor: 'accentViolet', bg: 'white', shadow: 'sm' }} 
    >
      <Flex align="center" gap={3}>
        <Center boxSize="8" borderRadius="10px" bg={iconBg} color="white">
          <Icon fontSize="18px">
            <IconComp size={18} />
          </Icon>
        </Center>
        <Box>
          <Text fontWeight="bold" fontSize="14px" color="textPrimary" lineHeight="tight">{label}</Text>
          <Text fontSize="12px" color="textMuted" mt="0.5">{subtext}</Text>
        </Box>
      </Flex>
      <Icon fontSize="16px" color="textMuted">
        <ArrowRight size={16} />
      </Icon>
    </Button>
  )
}
