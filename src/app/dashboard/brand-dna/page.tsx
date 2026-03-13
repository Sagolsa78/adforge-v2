'use client'

import React, { useState, useEffect, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { useSession } from 'next-auth/react'
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
  Spinner, 
  Center,
  VStack,
  HStack,
  Image,
  Separator,
  Grid
} from '@chakra-ui/react'
import { 
  Check, 
  Sparkles, 
  Target, 
  Facebook,
  Instagram,
  Linkedin,
  Twitter,
  Layout,
  RotateCcw,
  Zap,
  ArrowRight,
  Eye,
  Calendar,
  MoreVertical,
  ChevronRight
} from 'lucide-react'
import { getBrandDNA } from '@/lib/api/dashboard'
import { generateCampaign, getCampaign } from '@/lib/api/campaigns'
import { BrandDNA, CampaignDetail, ContentPiece } from '@/lib/api/types'
import { toaster } from '@/components/ui/toaster'
import { ProgressRoot, ProgressBar } from '@/components/ui/progress'
import { Skeleton } from '@/components/ui/skeleton'

import { TEMPLATES } from '@/lib/constants'

export default function BrandDNAPage() {
  const { data: session } = useSession()
  const router = useRouter()
  const resultsRef = useRef<HTMLDivElement>(null)
  
  const [loading, setLoading] = useState(true)
  const [brandDna, setBrandDna] = useState<BrandDNA | null>(null)
  
  // Selection State
  const [selectedUSPs, setSelectedUSPs] = useState<string[]>([])
  const [selectedTemplates, setSelectedTemplates] = useState<string[]>([])
  
  const [isGenerating, setIsGenerating] = useState(false)
  const [generatingText, setGeneratingText] = useState('Initializing AI engine...')
  const [progress, setProgress] = useState(0)

  const [generatedCampaign, setGeneratedCampaign] = useState<CampaignDetail | null>(null)

  const userId = (session?.user as any)?.id || 'user_123'

  useEffect(() => {
    async function fetchData() {
      if (!session && userId === 'user_123') {
          // Allow dev fallback
      } else if (!session) {
          return
      }

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
  }, [userId, session])

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

  const selectAll = (allList: string[], setList: (val: string[]) => void) => {
    setList(allList)
  }

  const clearAll = (setList: (val: string[]) => void) => {
    setList([])
  }

  const handleGenerate = async () => {
    if (!brandDna) return
    setIsGenerating(true)
    setGeneratedCampaign(null)
    
    try {
      const result = await generateCampaign({
        userId,
        brandDnaId: brandDna.id || 'dna_123',
        uspsSelected: selectedUSPs,
        templatesSelected: selectedTemplates,
        platformsSelected: ['IG', 'FB'], // Default platforms since they are removed from UI
        goal: "Drive high-intent traffic and conversions" // Default goal
      })
      
      // Simulate progress duration
      await new Promise(resolve => setTimeout(resolve, 5000))
      
      // Fetch the generated data
      const campaignData = await getCampaign(result.campaignId)
      setGeneratedCampaign(campaignData)
      setIsGenerating(false)
      
      // Scroll to results
      setTimeout(() => {
        resultsRef.current?.scrollIntoView({ behavior: 'smooth' })
      }, 100)
      
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
          <Heading fontSize="40px" fontWeight="black" color="gray.900" mb={2}>
            Campaign Generator
          </Heading>
          <Text color="gray.500" fontSize="md">
            Select your USPs and Templates to generate high-converting ad variations.
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

        <Separator borderColor="gray.100" />

        {/* SECTION 2: Templates */}
        <Stack gap={6}>
            <SectionHeader 
                title="2. Strategic Templates" 
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
        </Stack>
      </Stack>

      {/* Results Section */}
      {generatedCampaign && (
        <Box mt={20} ref={resultsRef} animation="fadeIn 0.8s ease-out">
            <Flex align="center" justify="space-between" mb={8}>
                <VStack align="start" gap={1}>
                    <Heading fontSize="32px" fontWeight="black" color="gray.900">Generated Variations</Heading>
                    <Text color="gray.500">AI-optimized copies based on your brand DNA.</Text>
                </VStack>
                <Button variant="outline" borderRadius="full" size="sm" onClick={() => setGeneratedCampaign(null)}>
                    <RotateCcw size={14} style={{ marginRight: '8px' }} /> Reset Generator
                </Button>
            </Flex>

            <Stack gap={6}>
                {generatedCampaign.contentPieces.map((piece, idx) => (
                    <AdResultCard key={piece.id} piece={piece} index={idx} />
                ))}
            </Stack>

            <Center mt={12}>
                <Button 
                    bg="purple.600" 
                    color="white" 
                    size="lg" 
                    h="64px" 
                    px={12} 
                    borderRadius="2xl"
                    fontWeight="black"
                    onClick={() => router.push(`/dashboard/campaigns/${generatedCampaign.id}`)}
                    _hover={{ bg: 'purple.700', transform: 'translateY(-2px)' }}
                    shadow="xl"
                >
                    Finalize & Schedule Campaign <ChevronRight size={20} style={{ marginLeft: '12px' }} />
                </Button>
            </Center>
        </Box>
      )}

      {/* Sticky Action Footer */}
      {!generatedCampaign && (
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
            borderColor="gray.200"
            zIndex={100}
        >
            <Flex maxW="1100px" mx="auto" align="center" justify="space-between">
                <HStack gap={6} display={{ base: 'none', lg: 'flex' }}>
                    <StatsItem label="USPs" value={selectedUSPs.length} />
                    <Separator orientation="vertical" h="24px" />
                    <StatsItem label="Templates" value={selectedTemplates.length} />
                </HStack>

                <HStack gap={4}>
                    <Box textAlign="right" display={{ base: 'none', sm: 'block' }}>
                        <Text fontSize="xs" color="gray.500" fontWeight="bold">ESTIMATED OUTPUT</Text>
                        <Text fontSize="sm" fontWeight="black" color="purple.600">
                            {selectedTemplates.length * 5} variations
                        </Text>
                    </Box>
                    <Button 
                        bg="purple.600" 
                        color="white" 
                        borderRadius="xl" 
                        px={10} 
                        h="60px"
                        fontWeight="black"
                        onClick={handleGenerate}
                        disabled={!selectedUSPs.length || !selectedTemplates.length}
                        _hover={{ bg: 'purple.700', transform: 'translateY(-2px)' }}
                        transition="all 0.2s"
                        shadow="xl"
                    >
                        Generate All Campaigns <ArrowRight size={20} style={{ marginLeft: '12px' }} />
                    </Button>
                </HStack>
            </Flex>
        </Box>
      )}

      <style jsx global>{`
          @keyframes fadeIn {
              from { opacity: 0; transform: translateY(20px); }
              to { opacity: 1; transform: translateY(0); }
          }
      `}</style>
    </Box>
  )
}

// UI Components
function AdResultCard({ piece, index }: { piece: ContentPiece, index: number }) {
    const PlatformIcon = piece.platform === 'IG' ? Instagram : piece.platform === 'FB' ? Facebook : piece.platform === 'LI' ? Linkedin : Twitter;
    const platformColor = piece.platform === 'IG' ? '#E1306C' : piece.platform === 'FB' ? '#1877F2' : piece.platform === 'LI' ? '#0A66C2' : '#1DA1F2';

    return (
        <Box 
            p={6} 
            bg="white" 
            borderRadius="32px" 
            border="1px solid" 
            borderColor="gray.100" 
            shadow="sm"
            _hover={{ shadow: 'md', borderColor: 'gray.200' }}
            transition="all 0.3s"
        >
            <Grid templateColumns={{ base: "1fr", md: "300px 1fr" }} gap={8}>
                {/* Visual Preview */}
                <Box 
                    bg="gray.50" 
                    borderRadius="24px" 
                    h="300px" 
                    overflow="hidden" 
                    position="relative"
                    border="1px solid"
                    borderColor="gray.100"
                >
                    {piece.imageUrl ? (
                        <Image src={piece.imageUrl} w="full" h="full" objectFit="cover" alt="Ad Preview" />
                    ) : (
                        <Center h="full" p={8} textAlign="center">
                            <VStack gap={2}>
                                <Icon color="gray.300" size="xl"><Layout size={40} /></Icon>
                                <Text fontSize="xs" color="gray.400" fontWeight="bold">AI IMAGE PENDING</Text>
                            </VStack>
                        </Center>
                    )}
                    <Badge 
                        position="absolute" 
                        top={4} 
                        left={4} 
                        bg={platformColor} 
                        color="white" 
                        p={2} 
                        borderRadius="full"
                        shadow="lg"
                    >
                        <PlatformIcon size={14} />
                    </Badge>
                </Box>

                {/* Content Side */}
                <VStack align="start" gap={6} flex="1">
                    <Flex w="full" justify="space-between" align="center">
                        <HStack gap={3}>
                            <Circle size="40px" bg="purple.50" color="purple.600">
                                <Text fontWeight="bold" fontSize="sm">#{index + 1}</Text>
                            </Circle>
                            <VStack align="start" gap={0}>
                                <Text fontWeight="black" color="gray.900" fontSize="md">Ad Variation</Text>
                                <Text color="gray.500" fontSize="xs">Optimized for {piece.platform}</Text>
                            </VStack>
                        </HStack>
                        <HStack gap={2}>
                            <Button variant="ghost" size="xs" color="gray.400"><MoreVertical size={16} /></Button>
                        </HStack>
                    </Flex>

                    <Box 
                        w="full" 
                        p={5} 
                        bg="gray.50" 
                        borderRadius="20px" 
                        border="1px solid" 
                        borderColor="gray.100"
                    >
                        <Text color="gray.700" fontSize="sm" lineHeight="1.6" fontStyle="italic">
                            "{piece.caption}"
                        </Text>
                    </Box>

                    <SimpleGrid columns={3} w="full" gap={4}>
                        <Box p={3} bg="gray.50" borderRadius="xl" textAlign="center">
                            <Text fontSize="10px" color="gray.400" fontWeight="bold">EMOTION</Text>
                            <Text fontSize="xs" fontWeight="bold" color="gray.700">Excitement</Text>
                        </Box>
                        <Box p={3} bg="gray.50" borderRadius="xl" textAlign="center">
                            <Text fontSize="10px" color="gray.400" fontWeight="bold">TONE</Text>
                            <Text fontSize="xs" fontWeight="bold" color="gray.700">Bold</Text>
                        </Box>
                        <Box p={3} bg="gray.50" borderRadius="xl" textAlign="center">
                            <Text fontSize="10px" color="gray.400" fontWeight="bold">CTA</Text>
                            <Text fontSize="xs" fontWeight="bold" color="gray.700">Shop Now</Text>
                        </Box>
                    </SimpleGrid>

                    <Flex w="full" pt={2} borderTop="1px solid" borderColor="gray.50" justify="space-between" align="center">
                        <HStack gap={4}>
                            <HStack color="gray.400" gap={1}>
                                <Eye size={14} />
                                <Text fontSize="xs">Preview</Text>
                            </HStack>
                            <HStack color="gray.400" gap={1}>
                                <Calendar size={14} />
                                <Text fontSize="xs">Schedule</Text>
                            </HStack>
                        </HStack>
                        <Button size="xs" variant="subtle" colorPalette="purple" fontWeight="bold" borderRadius="full">
                            Approve Copy
                        </Button>
                    </Flex>
                </VStack>
            </Grid>
        </Box>
    )
}

function StatsItem({ label, value }: { label: string, value: number }) {
    return (
        <Box>
            <Text fontSize="10px" color="gray.500" fontWeight="black" textTransform="uppercase" letterSpacing="widest">{label}</Text>
            <Text fontSize="lg" fontWeight="black" color={value > 0 ? "gray.900" : "gray.400"}>{value}</Text>
        </Box>
    )
}

function SectionHeader({ title, onSelectAll, onClearAll, count }: { title: string, onSelectAll: () => void, onClearAll: () => void, count: number }) {
    return (
        <Flex align="center" justify="space-between">
            <HStack gap={3}>
                <Heading fontSize="22px" fontWeight="black" letterSpacing="tight" color="gray.900">{title}</Heading>
                {count > 0 && <Badge colorPalette="purple" variant="solid" borderRadius="full" px={2}>{count}</Badge>}
            </HStack>
            <HStack gap={2}>
                <Button variant="ghost" size="xs" color="purple.600" fontWeight="bold" onClick={onSelectAll} _hover={{ bg: 'purple.50' }}>
                    Select All
                </Button>
                <Separator orientation="vertical" h="12px" />
                <Button variant="ghost" size="xs" color="gray.500" fontWeight="medium" onClick={onClearAll} _hover={{ bg: 'gray.50' }}>
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
            bg={isSelected ? 'purple.600' : 'white'}
            border="1px solid"
            borderColor={isSelected ? 'purple.600' : 'gray.200'}
            borderRadius="20px"
            transition="all 0.2s"
            shadow={isSelected ? 'lg' : 'sm'}
            _hover={{ borderColor: 'purple.600', transform: 'translateY(-2px)' }}
            textAlign="center"
            position="relative"
            overflow="hidden"
            w="full"
        >
            <VStack gap={3}>
                <Circle size="32px" bg={isSelected ? 'white/20' : 'gray.50'} color={isSelected ? 'white' : 'purple.600'}>
                    <IconComp size={16} />
                </Circle>
                <Text fontWeight="bold" fontSize="sm" color={isSelected ? 'white' : 'gray.900'}>{label}</Text>
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
            bg={isSelected ? 'purple.600' : 'white'}
            border="1px solid"
            borderColor={isSelected ? 'purple.600' : 'gray.200'}
            borderRadius="24px"
            transition="all 0.2s"
            textAlign="left"
            _hover={{ borderColor: 'purple.600' }}
            position="relative"
            h="full"
            w="full"
        >
            {isSelected && (
                <Circle size="24px" bg="white" color="purple.600" position="absolute" top={4} right={4} shadow="md">
                    <Check size={14} strokeWidth={3} />
                </Circle>
            )}
            <Heading fontSize="16px" fontWeight="bold" color={isSelected ? 'white' : 'gray.900'} mb={2}>{label}</Heading>
            <Text fontSize="12px" color={isSelected ? 'white/80' : 'gray.500'} lineHeight="tall">{description}</Text>
            <HStack mt={4} gap={2}>
                <Badge variant="subtle" colorPalette={isSelected ? 'purple' : 'gray'} fontSize="10px">5 ADS</Badge>
            </HStack>
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
                        borderColor="purple.100" position="absolute" animation="pulse 2s infinite"
                    />
                    <Box 
                        w="160px" h="160px" borderRadius="full" border="2px solid" 
                        borderColor="purple.200" position="absolute" top="20px" left="20px" animation="pulse 2s infinite 0.5s"
                    />
                    <Box 
                        position="absolute" inset="0" m="auto" w="100px" h="100px" 
                        bg="purple.600" borderRadius="40px" shadow="2xl"
                        display="flex" alignItems="center" justifyContent="center" transform="rotate(45deg)"
                    >
                        <Box transform="rotate(-45deg)">
                            <Icon color="white" size="xl"><Sparkles size={40} /></Icon>
                        </Box>
                    </Box>
                </Box>

                <VStack gap={4} textAlign="center">
                    <Heading fontSize="28px" fontWeight="black" color="gray.900">{text}</Heading>
                    <Text color="gray.500" fontWeight="medium">Our neural networks are weaving your artifacts together.</Text>
                </VStack>

                <Box w="full" px={10}>
                    <ProgressRoot value={progress} size="sm" colorPalette="purple" borderRadius="full">
                        <ProgressBar borderRadius="full" />
                    </ProgressRoot>
                    <Flex justify="space-between" mt={3}>
                        <Text fontSize="xs" fontWeight="bold" color="gray.500" textTransform="uppercase" letterSpacing="widest">Neural Link</Text>
                        <Text fontSize="xs" fontWeight="black" color="purple.600">{Math.round(progress)}%</Text>
                    </Flex>
                </Box>
            </VStack>
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
