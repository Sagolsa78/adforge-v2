'use client'

import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import { useParams, useRouter } from 'next/navigation'
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
  Tabs,
  Image,
  HStack,
  VStack,
  Circle,
  Separator,
  Center
} from '@chakra-ui/react'
import { 
  ChevronLeft, 
  Instagram, 
  Linkedin, 
  Twitter, 
  Facebook, 
  Calendar, 
  Check, 
  X, 
  Edit3, 
  RefreshCcw, 
  Download, 
  Send,
  Activity,
  Globe,
  PieChart
} from 'lucide-react'
import { getCampaign } from '@/lib/api/campaigns'
import { CampaignDetail, ContentPiece, Platform } from '@/lib/api/types'
import { toaster } from '@/components/ui/toaster'
import { Skeleton } from '@/components/ui/skeleton'

export default function CampaignDetailPage() {
  const { id } = useParams()
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [campaign, setCampaign] = useState<CampaignDetail | null>(null)
  const [platformFilter, setPlatformFilter] = useState<Platform | 'All'>('All')

  useEffect(() => {
    async function fetchData() {
      if (!id) return
      try {
        const data = await getCampaign(id as string)
        setCampaign(data)
      } catch (error) {
        toaster.create({
          title: 'Error fetching campaign',
          type: 'error',
        })
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [id])

  const filteredPieces = campaign?.contentPieces.filter(p => 
    platformFilter === 'All' || p.platform === platformFilter
  ) || []

  if (loading) return <DetailSkeleton />
  if (!campaign) return <Box p={8}>Campaign not found.</Box>

  return (
    <Box p={8} maxW="1400px" mx="auto" w="full">
      {/* Navigation */}
      <HStack mb={6} gap={2}>
        <Button 
          variant="ghost" 
          size="sm" 
          onClick={() => router.push('/dashboard/campaigns')}
          color="accentViolet"
          fontWeight="bold"
        >
          <ChevronLeft size={18} style={{ marginRight: '8px' }} /> Back to Campaigns
        </Button>
      </HStack>

      {/* Title & Status */}
      <Flex align="center" justify="space-between" mb={8} wrap="wrap" gap={4}>
        <VStack align="start" gap={1}>
          <Heading fontSize="32px" fontWeight="bold" color="textPrimary">{campaign.name}</Heading>
          <HStack gap={3}>
             <Badge colorPalette="orange" variant="subtle" borderRadius="full" px={3}>{campaign.status.toUpperCase()}</Badge>
             <Text fontSize="sm" color="textMuted">Created on {new Date().toLocaleDateString()}</Text>
          </HStack>
        </VStack>
        <HStack gap={3}>
           <Button variant="outline" borderRadius="xl">
             <Edit3 size={18} style={{ marginRight: '8px' }} /> Edit Campaign
           </Button>
           <Button bg="accentViolet" color="white" borderRadius="xl" _hover={{ bg: '#6D28D9' }}>
             <Send size={18} style={{ marginRight: '8px' }} /> Schedule All
           </Button>
        </HStack>
      </Flex>

      <Flex direction={{ base: 'column', lg: 'row' }} gap={10} align="start">
        {/* Left Column: Content Pieces */}
        <Box flex={1} w="full">
          <Tabs.Root 
            defaultValue="All" 
            onValueChange={(details) => setPlatformFilter(details.value as any)}
            variant="line"
            mb={6}
          >
            <Tabs.List borderColor="borderCore">
              <Tabs.Trigger value="All" fontWeight="bold" px={6}>All Pieces</Tabs.Trigger>
              <Tabs.Trigger value="IG" fontWeight="bold" px={6} gap={2}><Instagram size={14} /> Instagram</Tabs.Trigger>
              <Tabs.Trigger value="LI" fontWeight="bold" px={6} gap={2}><Linkedin size={14} /> LinkedIn</Tabs.Trigger>
              <Tabs.Trigger value="TW" fontWeight="bold" px={6} gap={2}><Twitter size={14} /> Twitter</Tabs.Trigger>
              <Tabs.Trigger value="FB" fontWeight="bold" px={6} gap={2}><Facebook size={14} /> Facebook</Tabs.Trigger>
            </Tabs.List>
          </Tabs.Root>

          <Stack gap={6}>
            {filteredPieces.map((piece) => (
              <ContentPieceCard key={piece.id} piece={piece} />
            ))}
            {filteredPieces.length === 0 && (
              <Center py={20} bg="white" borderRadius="20px" border="1px dashed" borderColor="borderCore">
                <Text color="textMuted">No content pieces for this platform.</Text>
              </Center>
            )}
          </Stack>
        </Box>

        {/* Right Column: Summary Panel */}
        <Box w={{ base: 'full', lg: '400px' }} position={{ lg: 'sticky' }} top="32px">
          <Stack gap={6}>
            {/* Campaign Summary Card */}
            <Box bg="white" borderRadius="24px" p={6} border="1px solid" borderColor="borderCore">
              <Heading fontSize="18px" mb={6}>Campaign Summary</Heading>
              
              <Stack gap={5} mb={8}>
                <SummaryRow label="Total Posts" value={campaign.postsCount.toString()} icon={Activity} />
                <SummaryRow label="Platforms" value={campaign.platforms.join(', ')} icon={Globe} />
                <SummaryRow label="USPs Selected" value={campaign.uspsSelected.join(', ')} icon={Check} />
                <SummaryRow label="Templates" value={campaign.templatesSelected.join(', ')} icon={PieChart} />
              </Stack>

              <Separator mb={6} />

              <Stack gap={3}>
                <Button 
                    bg="accentOrange" 
                    color="white" 
                    w="full" 
                    borderRadius="xl" 
                    _hover={{ bg: '#EA580C' }}
                >
                  <RefreshCcw size={18} style={{ marginRight: '8px' }} /> Regenerate All
                </Button>
                <Button variant="ghost" w="full" borderRadius="xl" color="textMuted">
                  <Download size={18} style={{ marginRight: '8px' }} /> Export Campaign
                </Button>
              </Stack>
            </Box>

            {/* AI Insights Card */}
            <Box bg="#F3EEFF" borderRadius="24px" p={6} border="1px solid" borderColor="rgba(124, 58, 237, 0.1)">
              <Flex align="center" gap={2} mb={3}>
                <Icon color="accentViolet">
                    <RefreshCcw size={16} />
                </Icon>
                <Text fontWeight="bold" color="accentViolet" fontSize="sm">AI Perspective</Text>
              </Flex>
              <Text fontSize="14px" color="textPrimary" lineHeight="tall">
                This campaign focuses on your <strong>{campaign.uspsSelected.join(' & ')}</strong> USPs using the <strong>{campaign.templatesSelected.join(', ')}</strong> frameworks. 
                We recommend scheduling the LinkedIn posts during Tuesday morning for maximum B2B engagement.
              </Text>
            </Box>
          </Stack>
        </Box>
      </Flex>
    </Box>
  )
}

// Sub-components
function ContentPieceCard({ piece }: { piece: ContentPiece }) {
  const [showFull, setShowFull] = useState(false)
  const platformIcons = {
    'IG': Instagram,
    'LI': Linkedin,
    'TW': Twitter,
    'FB': Facebook
  }
  const IconComp = platformIcons[piece.platform] || Globe

  return (
    <Box bg="white" borderRadius="20px" p={6} border="1px solid" borderColor="borderCore">
      <Flex gap={6} direction={{ base: 'column', sm: 'row' }}>
        {/* Thumbnail */}
        <Box 
          w={{ base: 'full', sm: '120px' }} 
          h="120px" 
          bg="bgBase" 
          borderRadius="16px" 
          overflow="hidden"
          flexShrink={0}
        >
          {piece.imageUrl ? (
            <Image src={piece.imageUrl} alt="Content Piece" w="full" h="full" objectFit="cover" />
          ) : (
            <Center h="full" w="full">
                <Icon color="textMuted" fontSize="24px" opacity={0.3}>
                    <IconComp size={24} />
                </Icon>
            </Center>
          )}
        </Box>

        {/* Content */}
        <Box flex={1}>
          <Flex align="center" justify="space-between" mb={3}>
            <HStack gap={3}>
              <Circle size="32px" bg="bgBase">
                <Icon color="accentViolet" fontSize="16px">
                    <IconComp size={16} />
                </Icon>
              </Circle>
              <VStack align="start" gap={0}>
                <Text fontWeight="bold" fontSize="sm">{piece.platform} Post</Text>
                <Flex align="center" gap={1}>
                    <Calendar size={12} color="#6B6880" />
                    <Text fontSize="xs" color="textMuted">Mar 20, 10:00 AM</Text>
                </Flex>
              </VStack>
            </HStack>
            <Badge 
                colorPalette={piece.status === 'approved' ? 'green' : piece.status === 'pending' ? 'orange' : 'red'} 
                borderRadius="full" 
                variant="subtle"
                px={2}
            >
              {piece.status}
            </Badge>
          </Flex>

          <Text 
            fontSize="15px" 
            color="textPrimary" 
            lineClamp={showFull ? undefined : 3} 
            mb={2}
            lineHeight="tall"
          >
            {piece.caption}
          </Text>
          <Button 
            size="xs" 
            variant="ghost" 
            color="accentViolet" 
            onClick={() => setShowFull(!showFull)}
            mb={4}
            p={0}
            _hover={{ bg: 'transparent', textDecoration: 'underline' }}
          >
            {showFull ? 'Show less' : 'Show more'}
          </Button>

          <Flex gap={3}>
            <Button variant="ghost" size="sm" borderRadius="lg" fontWeight="bold">
                <Edit3 size={14} style={{ marginRight: '4px' }} /> Edit
            </Button>
            <Button variant="ghost" size="sm" color="green.600" borderRadius="lg" fontWeight="bold">
                <Check size={14} style={{ marginRight: '4px' }} /> Approve
            </Button>
            <Button variant="ghost" size="sm" color="red.500" borderRadius="lg" fontWeight="bold">
                <X size={14} style={{ marginRight: '4px' }} /> Reject
            </Button>
          </Flex>
        </Box>
      </Flex>
    </Box>
  )
}

function SummaryRow({ label, value, icon }: { label: string, value: string, icon: any }) {
  return (
    <Flex align="center" justify="space-between">
      <HStack gap={2}>
        <Icon color="textMuted" fontSize="16px">
            {React.createElement(icon, { size: 16 })}
        </Icon>
        <Text fontSize="sm" color="textMuted">{label}</Text>
      </HStack>
      <Text fontSize="sm" fontWeight="bold" color="textPrimary">{value}</Text>
    </Flex>
  )
}

function DetailSkeleton() {
  return (
    <Box p={8} maxW="1400px" mx="auto" w="full">
      <Skeleton height="8" width="40" mb={6} />
      <Flex align="center" justify="space-between" mb={8}>
        <Skeleton height="12" width="64" />
        <Skeleton height="10" width="48" />
      </Flex>
      <Flex direction={{ base: 'column', lg: 'row' }} gap={10}>
        <Box flex={1}>
          <Skeleton height="10" width="full" mb={6} />
          <Stack gap={6}>
            {[...Array(3)].map((_, i) => (
              <Skeleton key={i} height="180px" borderRadius="20px" />
            ))}
          </Stack>
        </Box>
        <Skeleton width={{ base: 'full', lg: '400px' }} height="500px" borderRadius="24px" />
      </Flex>
    </Box>
  )
}
