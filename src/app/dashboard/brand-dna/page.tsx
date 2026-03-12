'use client'

import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
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
  Circle, 
  Textarea, 
  Spinner, 
  Center,
  VStack,
  HStack,
  Image,
  Separator
} from '@chakra-ui/react'
import { 
  Check, 
  Sparkles, 
  Target, 
  Globe,
  Facebook,
  Instagram,
  Linkedin,
  Twitter,
  Layout,
  RotateCcw,
  Zap,
  ArrowRight
} from 'lucide-react'
import { getBrandDNA } from '@/lib/api/dashboard'
import { generateCampaign } from '@/lib/api/campaigns'
import { BrandDNA, Platform } from '@/lib/api/types'
import { toaster } from '@/components/ui/toaster'
import { ProgressRoot, ProgressBar } from '@/components/ui/progress'
import { Skeleton } from '@/components/ui/skeleton'

import { PLATFORMS, TEMPLATES } from '@/lib/constants'

export default function BrandDNAPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [brandDna, setBrandDna] = useState<BrandDNA | null>(null)
  
  // Selection State
  const [selectedUSPs, setSelectedUSPs] = useState<string[]>([])
  const [selectedTemplates, setSelectedTemplates] = useState<string[]>([])
  const [selectedPlatforms, setSelectedPlatforms] = useState<Platform[]>([])
  const [campaignGoal, setCampaignGoal] = useState('')
  
  const [isGenerating, setIsGenerating] = useState(false)
  const [generatingText, setGeneratingText] = useState('Initializing AI engine...')
  const [progress, setProgress] = useState(0)

  const userId = 'user_123'

  useEffect(() => {
    async function fetchData() {
      try {
        const data = await getBrandDNA(userId)
        setBrandDna(data)
      } catch (error) {
        toaster.create({ title: 'Error fetching Brand DNA', type: 'error' })
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [userId])

  useEffect(() => {
    if (isGenerating) {
      const texts = [
        "Analyzing your brand core...",
        "Crafting platform-specific copies...",
        "Applying design frameworks...",
        "Optimizing for maximum conversion...",
        "Generating final ad variations..."
      ]
      let i = 0
      const textInterval = setInterval(() => {
        i = (i + 1) % texts.length
        setGeneratingText(texts[i])
      }, 2000)

      const progressInterval = setInterval(() => {
        setProgress(prev => Math.min(prev + 0.5, 100))
      }, 50)

      return () => {
        clearInterval(textInterval)
        clearInterval(progressInterval)
      }
    }
  }, [isGenerating])

  const toggleSelection = (list: string[], setList: (val: string[]) => void, item: string) => {
    if (list.includes(item)) {
      setList(list.filter(i => i !== item))
    } else {
      setList([...list, item])
    }
  }

  const selectAll = (allList: string[], setList: (val: string[] | any) => void) => {
    setList(allList)
  }

  const clearAll = (setList: (val: any) => void) => {
    setList([])
  }

  const handleGenerate = async () => {
    if (!brandDna) return
    setIsGenerating(true)
    
    try {
      // In a real app, this would be an API call
      // For now, we simulate generation and show the sidebar
      const result = await generateCampaign({
        userId,
        brandDnaId: brandDna.id || 'dna_123',
        uspsSelected: selectedUSPs,
        templatesSelected: selectedTemplates,
        platformsSelected: selectedPlatforms,
        goal: campaignGoal
      })
      
      // Simulate progress and then redirect
      setTimeout(() => {
        router.push(`/dashboard/campaigns/${result.campaignId}`)
      }, 3000)
      
    } catch (error) {
      setIsGenerating(false)
      toaster.create({
        title: 'Generation failed',
        description: 'Please try again.',
        type: 'error',
      })
    }
  }

  if (loading) return <BrandDNASkeleton />

  if (isGenerating) return <ModernGeneratingView text={generatingText} progress={progress} />

  return (
    <Box p={8} maxW="1100px" mx="auto" w="full" pb="120px">
      {/* Unified Header */}
      <Flex direction="column" mb={10}>
          <HStack gap={2} mb={4}>
            <Badge variant="subtle" colorPalette="purple" size="sm" borderRadius="full">AI CAMPAIGN ENGINE</Badge>
          </HStack>
          <Heading fontSize="40px" fontWeight="black" color="textPrimary" mb={2}>
            Campaign Generator
          </Heading>
          <Text color="textMuted" fontSize="md">
            Configure all aspects of your campaign in one place.
          </Text>
      </Flex>

      <Stack gap={12}>
        {/* SECTION 1: USPs */}
        <Stack gap={6}>
            <SectionHeader 
                title="1. Selective USPs" 
                onSelectAll={() => selectAll(brandDna?.usps || [], setSelectedUSPs)}
                onClearAll={() => clearAll(setSelectedUSPs)}
                count={selectedUSPs.length}
            />
            <SimpleGrid columns={{ base: 2, md: 5 }} gap={4}>
                {(brandDna?.usps || []).map((usp) => (
                <NeoSelectableCard 
                    key={usp} 
                    label={usp} 
                    isSelected={selectedUSPs.includes(usp)} 
                    onClick={() => toggleSelection(selectedUSPs, setSelectedUSPs, usp)} 
                    icon={Sparkles}
                />
                ))}
            </SimpleGrid>
        </Stack>

        <Separator borderColor="borderCore/50" />

        {/* SECTION 2: Templates & Goal */}
        <Stack gap={6}>
            <SectionHeader 
                title="2. Strategic Templates & Goal" 
                onSelectAll={() => selectAll(TEMPLATES.map(t => t.id), setSelectedTemplates)}
                onClearAll={() => clearAll(setSelectedTemplates)}
                count={selectedTemplates.length}
            />
            <SimpleGrid columns={{ base: 1, md: 3 }} gap={4}>
                {TEMPLATES.map((t) => (
                <TemplateCard 
                    key={t.id}
                    label={t.label}
                    description={t.description}
                    isSelected={selectedTemplates.includes(t.id)}
                    onClick={() => toggleSelection(selectedTemplates, setSelectedTemplates, t.id)}
                />
                ))}
            </SimpleGrid>

            {/* Campaign Goal Integrated */}
            <Box mt={2} p={6} bg="white" borderRadius="24px" border="1px solid" borderColor="borderCore" shadow="sm">
                <HStack mb={4} gap={2}>
                    <Icon color="accentViolet" size="sm"><Target size={16} /></Icon>
                    <Text fontWeight="bold" fontSize="sm" color="textPrimary">Specific Campaign Goal</Text>
                    <Badge variant="outline" size="xs" colorPalette="gray">Optional</Badge>
                </HStack>
                <Textarea 
                    placeholder="e.g. Drive sales for the summer collection or increase brand awareness." 
                    value={campaignGoal}
                    onChange={(e) => setCampaignGoal(e.target.value)}
                    borderRadius="16px"
                    borderColor="borderCore"
                    bg="bgBase/40"
                    color="textPrimary"
                    p={4}
                    fontSize="sm"
                    _placeholder={{ color: 'textMuted' }}
                    _focus={{ borderColor: 'accentViolet', bg: 'white', ring: "2px", ringColor: 'accentViolet/10' }}
                    minH="90px"
                />
            </Box>
        </Stack>

        <Separator borderColor="borderCore/50" />

        {/* SECTION 3: Platforms */}
        <Stack gap={6}>
            <SectionHeader 
                title="3. Distribution Platforms" 
                onSelectAll={() => selectAll(PLATFORMS.map(p => p.id), setSelectedPlatforms)}
                onClearAll={() => clearAll(setSelectedPlatforms)}
                count={selectedPlatforms.length}
            />
            <SimpleGrid columns={{ base: 1, sm: 2, md: 4 }} gap={4}>
                {PLATFORMS.map((p) => (
                <NeoPlatformCard 
                    key={p.id}
                    platform={p}
                    isSelected={selectedPlatforms.includes(p.id)}
                    onClick={() => toggleSelection(selectedPlatforms as any, setSelectedPlatforms as any, p.id)}
                />
                ))}
            </SimpleGrid>
        </Stack>
      </Stack>

      {/* Sticky Action Footer */}
      <Box 
        position="fixed" 
        bottom="0" 
        left={{ base: 0, md: "auto" }} 
        right="0"
        w={{ base: "full", md: "calc(100% - 280px)" }}
        p={6}
        bg="rgba(255, 255, 255, 0.8)"
        backdropFilter="blur(16px)"
        borderTop="1px solid"
        borderColor="borderCore"
        zIndex={100}
      >
        <Flex maxW="1100px" mx="auto" align="center" justify="space-between">
            <HStack gap={6} display={{ base: 'none', lg: 'flex' }}>
                <StatsItem label="USPs" value={selectedUSPs.length} />
                <Separator orientation="vertical" h="24px" />
                <StatsItem label="Templates" value={selectedTemplates.length} />
                <Separator orientation="vertical" h="24px" />
                <StatsItem label="Platforms" value={selectedPlatforms.length} />
            </HStack>

            <HStack gap={4}>
                <Box textAlign="right" display={{ base: 'none', sm: 'block' }}>
                    <Text fontSize="xs" color="textMuted" fontWeight="bold">ESTIMATED OUTPUT</Text>
                    <Text fontSize="sm" fontWeight="black" color="accentViolet">
                        {selectedTemplates.length * 5} variations
                    </Text>
                </Box>
                <Button 
                    bg="accentViolet" 
                    color="white" 
                    borderRadius="xl" 
                    px={10} 
                    h="60px"
                    fontWeight="black"
                    onClick={handleGenerate}
                    disabled={!selectedUSPs.length || !selectedTemplates.length || !selectedPlatforms.length}
                    _hover={{ bg: '#6D28D9', transform: 'translateY(-2px)' }}
                    transition="all 0.2s"
                    shadow="xl"
                    shadowColor="accentViolet/40"
                >
                    Generate All Campaigns <ArrowRight size={20} style={{ marginLeft: '12px' }} />
                </Button>
            </HStack>
        </Flex>
      </Box>
    </Box>
  )
}

// UI Components
function StatsItem({ label, value }: { label: string, value: number }) {
    return (
        <Box>
            <Text fontSize="10px" color="textMuted" fontWeight="black" textTransform="uppercase" letterSpacing="widest">{label}</Text>
            <Text fontSize="lg" fontWeight="black" color={value > 0 ? "textPrimary" : "textMuted"}>{value}</Text>
        </Box>
    )
}

function SectionHeader({ title, onSelectAll, onClearAll, count }: { title: string, onSelectAll: () => void, onClearAll: () => void, count: number }) {
    return (
        <Flex align="center" justify="space-between">
            <HStack gap={3}>
                <Heading fontSize="22px" fontWeight="black" letterSpacing="tight">{title}</Heading>
                {count > 0 && <Badge colorPalette="purple" variant="solid" borderRadius="full" px={2}>{count}</Badge>}
            </HStack>
            <HStack gap={2}>
                <Button variant="ghost" size="xs" color="accentViolet" fontWeight="bold" onClick={onSelectAll} _hover={{ bg: 'accentViolet/10' }}>
                    Select All
                </Button>
                <Separator orientation="vertical" h="12px" />
                <Button variant="ghost" size="xs" color="textMuted" fontWeight="medium" onClick={onClearAll} _hover={{ bg: 'bgBase' }}>
                    <RotateCcw size={10} style={{ marginRight: '4px' }} /> Clear
                </Button>
            </HStack>
        </Flex>
    )
}

function NeoSelectableCard({ label, isSelected, onClick, icon: IconComp }: any) {
    return (
        <Box 
            as="button"
            onClick={onClick}
            p={5}
            bg={isSelected ? '#7C3AED' : 'white'}
            border="1px solid"
            borderColor={isSelected ? '#7C3AED' : 'borderCore'}
            borderRadius="20px"
            transition="all 0.2s"
            shadow={isSelected ? 'lg' : 'sm'}
            shadowColor={isSelected ? 'accentViolet/40' : 'transparent'}
            _hover={{ borderColor: 'accentViolet', transform: 'translateY(-2px)' }}
            textAlign="center"
            position="relative"
            overflow="hidden"
        >
            <VStack gap={3}>
                <Circle size="32px" bg={isSelected ? 'white/20' : 'bgBase'} color={isSelected ? 'white' : 'accentViolet'}>
                    <IconComp size={16} />
                </Circle>
                <Text fontWeight="bold" fontSize="sm" color={isSelected ? 'white' : 'textPrimary'}>{label}</Text>
            </VStack>
        </Box>
    )
}

function TemplateCard({ label, description, isSelected, onClick }: any) {
    return (
        <Box 
            as="button"
            onClick={onClick}
            p={6}
            bg={isSelected ? '#7C3AED' : 'white'}
            border="1px solid"
            borderColor={isSelected ? '#7C3AED' : 'borderCore'}
            borderRadius="24px"
            transition="all 0.2s"
            textAlign="left"
            _hover={{ borderColor: 'accentViolet' }}
            position="relative"
            h="full"
        >
            {isSelected && (
                <Circle size="24px" bg="white" color="accentViolet" position="absolute" top={4} right={4} shadow="md">
                    <Check size={14} strokeWidth={3} />
                </Circle>
            )}
            <Heading fontSize="16px" fontWeight="bold" color={isSelected ? 'white' : 'textPrimary'} mb={2}>{label}</Heading>
            <Text fontSize="12px" color={isSelected ? 'white/80' : 'textMuted'} lineHeight="tall">{description}</Text>
            <HStack mt={4} gap={2}>
                <Badge variant="subtle" colorPalette={isSelected ? 'purple' : 'gray'} fontSize="10px">5 ADS</Badge>
            </HStack>
        </Box>
    )
}

function NeoPlatformCard({ platform, isSelected, onClick }: any) {
    const IconComp = platform.icon
    return (
        <Box 
            as="button"
            onClick={onClick}
            p={6}
            bg={isSelected ? platform.color : 'white'}
            border="1px solid"
            borderColor={isSelected ? platform.color : 'borderCore'}
            borderRadius="24px"
            transition="all 0.2s"
            _hover={{ borderColor: platform.color, transform: 'scale(1.02)' }}
            position="relative"
            display="flex"
            flexDirection="column"
            alignItems="center"
            gap={4}
            shadow={isSelected ? 'xl' : 'sm'}
            shadowColor={isSelected ? `${platform.color}40` : 'transparent'}
        >
            <Circle size="56px" bg={isSelected ? 'white/20' : platform.accent} color={isSelected ? 'white' : platform.color}>
                <IconComp size={24} />
            </Circle>
            <Text fontWeight="black" fontSize="sm" color={isSelected ? 'white' : 'textPrimary'}>{platform.label}</Text>
            {isSelected && (
                <Circle size="20px" bg="white" color={platform.color} position="absolute" top={3} right={3} shadow="md">
                    <Check size={12} strokeWidth={4} />
                </Circle>
            )}
        </Box>
    )
}

function ModernGeneratingView({ text, progress }: { text: string, progress: number }) {
    return (
        <Center h="70vh" w="full">
            <VStack gap={12} w="full" maxW="500px">
                <Box position="relative" h="200px" w="200px">
                    <Box 
                        w="200px" h="200px" borderRadius="full" border="2px solid" 
                        borderColor="accentViolet/10" position="absolute" animation="pulse 2s infinite"
                    />
                    <Box 
                        w="160px" h="160px" borderRadius="full" border="2px solid" 
                        borderColor="accentViolet/20" position="absolute" top="20px" left="20px" animation="pulse 2s infinite 0.5s"
                    />
                    <Box 
                        position="absolute" inset="0" m="auto" w="100px" h="100px" 
                        bg="accentViolet" borderRadius="40px" shadow="2xl" shadowColor="accentViolet"
                        display="flex" alignItems="center" justifyContent="center" transform="rotate(45deg)"
                    >
                        <Box transform="rotate(-45deg)">
                            <Icon color="white" size="xl"><Sparkles size={40} /></Icon>
                        </Box>
                    </Box>
                </Box>

                <VStack gap={4} textAlign="center">
                    <Heading fontSize="28px" fontWeight="black" color="textPrimary">{text}</Heading>
                    <Text color="textMuted" fontWeight="medium">Our neural networks are weaving your artifacts together.</Text>
                </VStack>

                <Box w="full" px={10}>
                    <ProgressRoot value={progress} size="sm" colorPalette="purple" borderRadius="full">
                        <ProgressBar borderRadius="full" />
                    </ProgressRoot>
                    <Flex justify="space-between" mt={3}>
                        <Text fontSize="xs" fontWeight="bold" color="textMuted" textTransform="uppercase" letterSpacing="widest">Neural Link</Text>
                        <Text fontSize="xs" fontWeight="black" color="accentViolet">{Math.round(progress)}%</Text>
                    </Flex>
                </Box>
            </VStack>
            
            <style jsx global>{`
                @keyframes pulse {
                    0% { transform: scale(0.95); opacity: 0.8; }
                    50% { transform: scale(1.05); opacity: 0.4; }
                    100% { transform: scale(0.95); opacity: 0.8; }
                }
            `}</style>
        </Center>
    )
}

function BrandDNASkeleton() {
  return (
    <Box p={8} maxW="1000px" mx="auto" w="full">
      <Skeleton height="10" width="64" mb={2} />
      <Skeleton height="4" width="96" mb={10} />
      <Stack gap={10}>
          {[...Array(3)].map((_, i) => (
              <Box key={i}>
                <Skeleton height="6" width="48" mb={4} />
                <SimpleGrid columns={{ base: 2, md: 4 }} gap={4}>
                    {[...Array(4)].map((_, j) => (
                        <Skeleton key={j} height="120px" borderRadius="16px" />
                    ))}
                </SimpleGrid>
              </Box>
          ))}
      </Stack>
    </Box>
  )
}
