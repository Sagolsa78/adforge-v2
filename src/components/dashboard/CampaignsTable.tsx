'use client'

import React, { useEffect, useState } from 'react'
import { Campaign } from '@/lib/api/types'
import { useRouter } from 'next/navigation'
import { MoreHorizontal } from 'lucide-react'
import NextLink from 'next/link'
import { 
  Box, 
  Flex, 
  Text, 
  Link, 
  Table, 
  IconButton, 
  Badge,
  HStack,
  Center,
  Icon
} from '@chakra-ui/react'

interface CampaignsTableProps {
  campaigns: Campaign[]
}

export function CampaignsTable({ campaigns }: CampaignsTableProps) {
  const router = useRouter()
  const [minsAgo, setMinsAgo] = useState(0)

  useEffect(() => {
    const refreshInterval = setInterval(() => {
      router.refresh()
      setMinsAgo(0)
    }, 60000)

    const timerInterval = setInterval(() => {
      setMinsAgo((prev) => prev + 1)
    }, 60000)

    return () => {
      clearInterval(refreshInterval)
      clearInterval(timerInterval)
    }
  }, [router])

  return (
    <Box 
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
      {/* Header */}
      <Flex px={6} py={5} align="center" justify="space-between" borderBottom="1px solid" borderColor="borderCore">
        <HStack gap={3}>
          <Text fontSize="lg" fontWeight="bold" color="textPrimary">Active Campaigns</Text>
          <Badge variant="subtle" colorPalette="gray" fontSize="10px">
            {minsAgo === 0 ? 'Just now' : `${minsAgo}m ago`}
          </Badge>
        </HStack>
        <Link 
          asChild
          color="accentViolet" 
          fontSize="sm" 
          fontWeight="bold" 
          _hover={{ textDecoration: 'underline' }}
        >
          <NextLink href="/dashboard/campaigns">
            View All
          </NextLink>
        </Link>
      </Flex>

      {/* Table */}
      <Box w="full" overflowX="auto">
        <Table.Root w="full" variant="line" interactive>
          <Table.Header>
            <Table.Row bg="bgBase">
              <Table.ColumnHeader px={6} py={3} fontSize="11px" textTransform="uppercase" color="textMuted">CAMPAIGN</Table.ColumnHeader>
              <Table.ColumnHeader px={6} py={3} fontSize="11px" textTransform="uppercase" color="textMuted">PLATFORMS</Table.ColumnHeader>
              <Table.ColumnHeader px={6} py={3} fontSize="11px" textTransform="uppercase" color="textMuted">STATUS</Table.ColumnHeader>
              <Table.ColumnHeader px={6} py={3} fontSize="11px" textTransform="uppercase" color="textMuted">POSTS</Table.ColumnHeader>
              <Table.ColumnHeader px={6} py={3} fontSize="11px" textTransform="uppercase" color="textMuted">REACH</Table.ColumnHeader>
              <Table.ColumnHeader px={6} py={3} fontSize="11px" textTransform="uppercase" color="textMuted" textAlign="right">ACTION</Table.ColumnHeader>
            </Table.Row>
          </Table.Header>
          <Table.Body>
            {campaigns.map((campaign) => (
              <Table.Row 
                key={campaign.id} 
                onClick={() => router.push(`/dashboard/campaigns/${campaign.id}`)}
                transition="all 0.2s" 
                cursor="pointer"
              >
                <Table.Cell px={6} py={4}>
                  <HStack gap={3}>
                    <Box 
                      w="3px" 
                      h="16px" 
                      borderRadius="full" 
                      bg={campaign.color || "accentViolet"}
                    />
                    <Text fontWeight="bold" fontSize="14px" color="textPrimary" truncate maxW="150px">
                      {campaign.name}
                    </Text>
                  </HStack>
                </Table.Cell>
                <Table.Cell px={6} py={4}>
                  <HStack gap="2">
                    {campaign.platforms.map(platform => (
                      <Badge 
                        key={platform} 
                        variant="outline"
                        colorPalette="gray"
                        fontSize="10px" 
                        px="1.5"
                      >
                        {platform}
                      </Badge>
                    ))}
                  </HStack>
                </Table.Cell>
                <Table.Cell px={6} py={4}>
                  <Badge 
                    colorPalette={
                      campaign.status === 'live' ? 'orange' : 
                      campaign.status === 'scheduled' ? 'purple' : 'gray'
                    }
                    variant="subtle"
                    borderRadius="full"
                    textTransform="capitalize"
                  >
                    {campaign.status}
                  </Badge>
                </Table.Cell>
                <Table.Cell px={6} py={4}>
                  <Text fontWeight="bold" fontSize="14px" color="textPrimary">
                    {campaign.postsCount}
                  </Text>
                </Table.Cell>
                <Table.Cell px={6} py={4}>
                  <Text fontWeight="medium" fontSize="14px" color="textSecondary">
                    {campaign.reach || '--'}
                  </Text>
                </Table.Cell>
                <Table.Cell px={6} py={4} textAlign="right">
                  <IconButton 
                    variant="ghost" 
                    size="sm"
                    color="textMuted" 
                    _hover={{ color: 'accentViolet', bg: 'bgSurfaceHover' }} 
                  >
                    <MoreHorizontal size={18} />
                  </IconButton>
                </Table.Cell>
              </Table.Row>
            ))}
          </Table.Body>
        </Table.Root>
      </Box>
    </Box>
  )
}
