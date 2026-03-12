'use client'

import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import { PLATFORMS } from '@/lib/constants'
import { 
  Box, 
  Flex, 
  Heading, 
  Text, 
  Button, 
  SimpleGrid, 
  Icon, 
  Stack, 
  Badge, 
  Input,
  Tabs,
  HStack,
  Center,
  IconButton
} from '@chakra-ui/react'
import { 
  Plus, 
  Search, 
  MoreVertical, 
  ExternalLink, 
  Edit2, 
  Trash2, 
  Instagram, 
  Linkedin, 
  Twitter, 
  Facebook,
  BarChart2,
  Calendar,
  Layers,
  ArrowRight
} from 'lucide-react'
import { getCampaigns } from '@/lib/api/campaigns'
import { Campaign, Platform } from '@/lib/api/types'
import { toaster } from '@/components/ui/toaster'
import { Skeleton } from '@/components/ui/skeleton'
import { ProgressRoot, ProgressBar } from '@/components/ui/progress'
import { 
  MenuRoot, 
  MenuTrigger, 
  MenuContent, 
  MenuItem 
} from '@/components/ui/menu'
import { InputGroup } from '@/components/ui/input-group'

export default function CampaignsPage() {
  const [loading, setLoading] = useState(true)
  const [campaigns, setCampaigns] = useState<Campaign[]>([])
  const [filter, setFilter] = useState<'All' | 'Live' | 'Scheduled' | 'Draft'>('All')
  const [searchQuery, setSearchQuery] = useState('')

  const userId = 'user_123'

  useEffect(() => {
    async function fetchData() {
      try {
        const data = await getCampaigns(userId)
        setCampaigns(data)
      } catch (error) {
        toaster.create({
          title: 'Error fetching campaigns',
          type: 'error',
        })
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [userId])

  const filteredCampaigns = campaigns.filter(c => {
    const matchesFilter = filter === 'All' || c.status === filter.toLowerCase()
    const matchesSearch = c.name.toLowerCase().includes(searchQuery.toLowerCase())
    return matchesFilter && matchesSearch
  })

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'live': return 'orange'
      case 'scheduled': return 'purple'
      case 'draft': return 'gray'
      default: return 'gray'
    }
  }

  const getPlatformIcon = (platform: Platform) => {
    return PLATFORMS.find(p => p.id === platform)?.icon || Layers;
  }

  if (loading) return <CampaignsSkeleton />

  return (
    <Box p={8} maxW="1200px" mx="auto" w="full">
      {/* Header */}
      <Flex align="center" justify="space-between" mb={8}>
        <Heading fontSize="28px" fontWeight="bold" color="textPrimary">Campaigns</Heading>
        <Link href="/dashboard/brand-dna" passHref>
          <Button 
            bg="accentOrange" 
            color="white" 
            px={6} 
            py={4} 
            borderRadius="xl"
            _hover={{ bg: '#EA580C' }}
          >
            <Plus size={18} style={{ marginRight: '8px' }} /> New Campaign
          </Button>
        </Link>
      </Flex>

      {/* Filter Bar */}
      <Flex direction={{ base: 'column', md: 'row' }} align={{ md: 'center' }} justify="space-between" mb={8} gap={4}>
        <Tabs.Root 
          defaultValue="All"
          onValueChange={(details) => setFilter(details.value as any)}
        >
          <Tabs.List bg="bgSurface" border="1px solid" borderColor="borderCore" p={1} borderRadius="full">
            {['All', 'Live', 'Scheduled', 'Draft'].map(v => (
              <Tabs.Trigger key={v} value={v} px={6} py={2} fontSize="sm" fontWeight="bold" borderRadius="full" _selected={{ bg: 'accentViolet', color: 'white' }}>
                {v}
              </Tabs.Trigger>
            ))}
          </Tabs.List>
        </Tabs.Root>

        <InputGroup 
            flex="1" 
            maxW={{ md: '320px' }} 
            startElement={<Search size={18} color="#A09DB8" />}
        >
          <Input 
            placeholder="Search campaigns..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            bg="white"
            borderRadius="full"
            borderColor="borderCore"
            _focus={{ borderColor: 'accentViolet', ring: "2px", ringColor: 'accentViolet' }}
          />
        </InputGroup>
      </Flex>

      {/* Campaigns Grid */}
      {filteredCampaigns.length === 0 ? (
        <Center flexDir="column" py={20} bg="white" borderRadius="24px" border="1px dashed" borderColor="borderCore">
          <Box mb={6} p={8} bg="bgBase" borderRadius="24px">
            <Layers size={48} color="#6B6880" strokeWidth={1.5} />
          </Box>
          <Heading fontSize="20px" mb={2}>No campaigns yet</Heading>
          <Text color="textMuted" mb={8} textAlign="center">Analyze your brand and generate your first campaign</Text>
          <Link href="/dashboard/brand-dna" passHref>
            <Button bg="accentViolet" color="white" borderRadius="xl">
              Start with Brand DNA <ArrowRight size={18} style={{ marginLeft: '8px' }} />
            </Button>
          </Link>
        </Center>
      ) : (
        <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} gap={6}>
          {filteredCampaigns.map((campaign) => (
            <Box 
              key={campaign.id} 
              bg="white"
              borderRadius="20px" 
              overflow="hidden" 
              border="1px solid" 
              borderColor="borderCore"
              transition="all 0.2s"
              _hover={{ borderColor: 'accentViolet', transform: 'translateY(-2px)' }}
              position="relative"
            >
              <Box h="4px" bg={campaign.color || 'accentViolet'} />
              <Box p={5}>
                <Flex align="center" justify="space-between" mb={3}>
                  <Heading fontSize="16px" fontWeight="bold" lineClamp={1}>{campaign.name}</Heading>
                  <Badge 
                    colorPalette={getStatusColor(campaign.status)} 
                    variant="subtle" 
                    borderRadius="full"
                    px={2}
                  >
                    {campaign.status}
                  </Badge>
                </Flex>
                
                <HStack gap={2} mb={4}>
                  {campaign.platforms.map(p => {
                    const PlatformIcon = getPlatformIcon(p)
                    return (
                        <Badge key={p} variant="outline" colorPalette="gray" fontSize="10px" px={1.5} borderRadius="md" display="flex" alignItems="center" gap={1}>
                            <PlatformIcon size={10} /> {p}
                        </Badge>
                    )
                  })}
                </HStack>

                <SimpleGrid columns={3} gap={4} mb={6}>
                  <StatItem label="Posts" value={campaign.postsCount.toString()} icon={Layers} />
                  <StatItem label="Reach" value={campaign.reach || '-'} icon={BarChart2} />
                  <StatItem label="Eng." value="4.2%" icon={Calendar} />
                </SimpleGrid>

                <Stack gap={1.5} mb={5}>
                    <Flex justify="space-between" fontSize="xs" fontWeight="bold">
                        <Text color="textMuted">Progress</Text>
                        <Text color="textPrimary">75%</Text>
                    </Flex>
                    <ProgressRoot value={75} size="xs" colorPalette="purple">
                        <ProgressBar borderRadius="full" />
                    </ProgressRoot>
                </Stack>

                <Flex align="center" justify="space-between" pt={3} borderTop="1px solid" borderColor="gray.50">
                  <HStack gap={2}>
                    <Link href={`/dashboard/campaigns/${campaign.id}`} passHref>
                        <Button size="sm" variant="outline" borderColor="accentViolet" color="accentViolet" borderRadius="lg" fontSize="xs" fontWeight="bold">
                        View
                        </Button>
                    </Link>
                    <Button size="sm" variant="ghost" color="textMuted" borderRadius="lg" fontSize="xs" fontWeight="bold">
                      Edit
                    </Button>
                  </HStack>
                  
                  <MenuRoot>
                    <MenuTrigger asChild>
                      <IconButton aria-label="More options" variant="ghost" size="sm" borderRadius="full">
                        <MoreVertical size={16} />
                      </IconButton>
                    </MenuTrigger>
                    <MenuContent borderRadius="xl" borderColor="borderCore" p={1}>
                      <MenuItem value="edit" borderRadius="lg">
                        <Edit2 size={14} style={{ marginRight: '8px' }} /> Edit Campaign
                      </MenuItem>
                      <MenuItem value="export" borderRadius="lg">
                        <ExternalLink size={14} style={{ marginRight: '8px' }} /> Export Report
                      </MenuItem>
                      <MenuItem value="delete" color="red.500" borderRadius="lg">
                        <Trash2 size={14} style={{ marginRight: '8px' }} /> Delete
                      </MenuItem>
                    </MenuContent>
                  </MenuRoot>
                </Flex>
              </Box>
            </Box>
          ))}
        </SimpleGrid>
      )}
    </Box>
  )
}

function StatItem({ label, value, icon }: { label: string, value: string, icon: any }) {
  return (
    <Stack gap={1}>
      <Flex align="center" gap={1}>
        <Icon color="textMuted" fontSize="12px">
            {React.createElement(icon, { size: 12 })}
        </Icon>
        <Text fontSize="10px" color="textMuted" fontWeight="bold" textTransform="uppercase">{label}</Text>
      </Flex>
      <Text fontSize="14px" fontWeight="bold" color="textPrimary">{value}</Text>
    </Stack>
  )
}

function CampaignsSkeleton() {
  return (
    <Box p={8} maxW="1200px" mx="auto" w="full">
      <Flex align="center" justify="space-between" mb={8}>
        <Skeleton h="10" w="40" borderRadius="lg" />
        <Skeleton h="10" w="32" borderRadius="xl" />
      </Flex>
      <Flex mb={8} gap={4}>
        <Skeleton h="10" w="64" borderRadius="full" />
        <Skeleton h="10" w="full" maxW="320px" borderRadius="full" />
      </Flex>
      <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} gap={6}>
        {[...Array(6)].map((_, i) => (
          <Skeleton key={i} h="280px" borderRadius="20px" />
        ))}
      </SimpleGrid>
    </Box>
  )
}
