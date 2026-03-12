'use client'

import React from 'react'
import { BrandDNA } from '@/lib/api/types'
import NextLink from 'next/link'
import { Target, Users, Zap, Rocket } from 'lucide-react'
import { 
  Box, 
  Flex, 
  Text, 
  Link, 
  Button, 
  Icon, 
  Stack, 
  HStack,
  Center
} from '@chakra-ui/react'

interface BrandDNACardProps {
  brandDna: BrandDNA
}

export function BrandDNACard({ brandDna }: BrandDNACardProps) {
  // Calculate stroke parameters for the ring
  const ringSize = 120
  const strokeWidth = 10
  const radius = (ringSize - strokeWidth) / 2
  const circumference = radius * 2 * Math.PI
  const strokeDashoffset = circumference - (brandDna.score / 100) * circumference

  return (
    <Flex 
      bg="bgSurface" 
      border="1px solid" 
      borderColor="borderCore" 
      borderRadius="24px" 
      p={6} 
      shadow="sm" 
      direction="column" 
      h="full"
    >
      {/* Header */}
      <Flex align="center" justify="space-between" mb={6}>
        <Text fontSize="md" fontWeight="bold" color="textPrimary">Brand DNA</Text>
        <Link 
          asChild
          color="accentViolet" 
          fontSize="sm" 
          fontWeight="bold" 
          _hover={{ textDecoration: 'underline' }}
        >
          <NextLink href="/dashboard/brand-dna">
            Full Report
          </NextLink>
        </Link>
      </Flex>

      {/* Circular Progress Ring */}
      <Center flexDir="column" mb={8} position="relative">
        <svg 
          width={ringSize} 
          height={ringSize} 
          viewBox={`0 0 ${ringSize} ${ringSize}`} 
          style={{ transform: 'rotate(-90deg)' }}
        >
          <defs>
            <linearGradient id="dnaGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="var(--chakra-colors-accentViolet)" />
              <stop offset="100%" stopColor="var(--chakra-colors-accentOrange)" />
            </linearGradient>
          </defs>
          {/* Background Track */}
          <circle
            cx={ringSize / 2}
            cy={ringSize / 2}
            r={radius}
            stroke="var(--chakra-colors-bgBase)"
            strokeWidth={strokeWidth}
            fill="transparent"
          />
          {/* Progress Arc */}
          <circle
            cx={ringSize / 2}
            cy={ringSize / 2}
            r={radius}
            stroke="url(#dnaGradient)"
            strokeWidth={strokeWidth}
            fill="transparent"
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
            style={{ transition: 'all 1s ease-out' }}
          />
        </svg>
        <Center position="absolute" inset="0" flexDir="column">
          <Text fontSize="28px" fontWeight="bold" color="textPrimary" lineHeight="none">{brandDna.score}</Text>
          <Text fontSize="10px" color="textMuted" letterSpacing="widest" fontWeight="bold" textTransform="uppercase" mt={1}>SCORE</Text>
        </Center>
      </Center>

      {/* Trait Rows */}
      <Stack gap={4} mb={8}>
        <TraitRow icon={Target} label="Tone" value={brandDna.tone} />
        <TraitRow icon={Users} label="Audience" value={brandDna.audience} />
        <TraitRow icon={Zap} label="Voice" value={brandDna.voice} />
        <TraitRow icon={Rocket} label="Positioning" value={brandDna.positioning} />
      </Stack>

      {/* Regenerate Button */}
      <Button 
        variant="outline"
        mt="auto" 
        w="full" 
        h="44px"
        borderRadius="12px" 
        borderColor="accentViolet" 
        color="accentViolet" 
        fontWeight="bold" 
        fontSize="sm" 
        _hover={{ bg: 'bgSurfaceHover' }} 
      >
        Regenerate Analysis
      </Button>
    </Flex>
  )
}

function TraitRow({ icon: IconComp, label, value }: { icon: any, label: string, value: string }) {
  return (
    <Flex align="center" justify="space-between">
      <HStack gap={3}>
        <Icon color="textMuted" fontSize="16px">
          <IconComp size={16} />
        </Icon>
        <Text fontSize="sm" fontWeight="medium" color="textMuted">{label}</Text>
      </HStack>
      <BadgeValue>{value}</BadgeValue>
    </Flex>
  )
}

function BadgeValue({ children }: { children: React.ReactNode }) {
  return (
    <Box 
      bg="bgBase" 
      border="1px solid" 
      borderColor="borderCore" 
      rounded="8px" 
      px={2.5} 
      py={1} 
      fontSize="xs" 
      fontWeight="bold" 
      color="textPrimary"
    >
      {children}
    </Box>
  )
}
