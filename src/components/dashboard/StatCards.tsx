'use client'

import React, { useEffect } from 'react'
import { DashboardStats } from '@/lib/api/types'
import { useRouter } from 'next/navigation'
import { ArrowUpRight, Target, Activity, Zap, PieChart } from 'lucide-react'
import { SimpleGrid, Box, Flex, Text, Circle, Icon } from '@chakra-ui/react'

interface StatCardsProps {
  stats: DashboardStats
}

export function StatCards({ stats }: StatCardsProps) {
  const router = useRouter()

  useEffect(() => {
    const interval = setInterval(() => {
      router.refresh()
    }, 60000) // 60 seconds

    return () => clearInterval(interval)
  }, [router])

  return (
    <SimpleGrid columns={{ base: 1, md: 2, lg: 4 }} gap={4}>
      {/* Brand DNA Score */}
      <StatCard 
        label="BRAND DNA SCORE"
        value={stats.brandDnaScore.toString()}
        subtext={stats.brandDnaLabel}
        icon={Target}
        color="accentViolet"
      />

      {/* Campaigns Active */}
      <StatCard 
        label="CAMPAIGNS ACTIVE"
        value={stats.campaignsActive.toString()}
        subtext={`${stats.scheduledPostsThisWeek} posts scheduled`}
        icon={Zap}
        color="accentOrange"
        badge={stats.campaignsLiveCount > 0 ? "Live" : undefined}
      />

      {/* Total Reach */}
      <StatCard 
        label="TOTAL REACH"
        value={stats.totalReach}
        subtext="this week"
        icon={ArrowUpRight}
        color="success"
        trend={stats.reachGrowthPct}
      />

      {/* Content Pieces */}
      <StatCard 
        label="CONTENT PIECES"
        value={stats.contentPiecesGenerated.toString()}
        subtext={`${stats.contentPiecesPending} pending review`}
        icon={Activity}
        color="accentViolet"
      />
    </SimpleGrid>
  )
}

function StatCard({ 
  label, 
  value, 
  subtext, 
  icon: IconComp, 
  color, 
  badge, 
  trend 
}: { 
  label: string, 
  value: string, 
  subtext: string, 
  icon: any, 
  color: string, 
  badge?: string, 
  trend?: string 
}) {
  return (
    <Flex 
      bg="bgSurface" 
      border="1px solid" 
      borderColor="borderCore" 
      borderRadius="24px" 
      p={6} 
      shadow="sm" 
      direction="column" 
      justify="space-between"
      transition="all 0.2s"
      _hover={{ transform: 'translateY(-2px)', shadow: 'md' }}
    >
      <Text 
        fontSize="11px" 
        textTransform="uppercase" 
        color="textMuted" 
        letterSpacing="wider" 
        fontWeight="bold" 
        mb={3}
      >
        {label}
      </Text>
      
      <Flex align="center" gap={3} mb={4}>
        <Text 
          fontSize="36px" 
          fontWeight="bold" 
          color="textPrimary" 
          lineHeight="none"
        >
          {value}
        </Text>
        {badge && (
          <Box 
            bg="accentOrange" 
            color="white" 
            fontSize="10px" 
            fontWeight="bold" 
            px={2} 
            py="0.5" 
            borderRadius="full"
          >
            {badge}
          </Box>
        )}
        {trend && (
           <Flex align="center" color="success" gap={1}>
             <Icon size="sm">
                <IconComp size={16} />
             </Icon>
             <Text fontSize="sm" fontWeight="bold">{trend}</Text>
           </Flex>
        )}
      </Flex>

      <Flex align="center" gap="2" mt="auto">
        <Circle size="2" bg={color} />
        <Text fontSize="13px" fontWeight="medium" color="textSecondary">
          {subtext}
        </Text>
      </Flex>
    </Flex>
  )
}
