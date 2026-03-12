import { Suspense } from 'react';
import { WelcomeBar } from '@/components/dashboard/WelcomeBar';
import { StatCards } from '@/components/dashboard/StatCards';
import { CampaignsTable } from '@/components/dashboard/CampaignsTable';
import { BrandDNACard } from '@/components/dashboard/BrandDNACard';
import { QuickGenerate } from '@/components/dashboard/QuickGenerate';
import { DashboardSkeleton } from '@/components/dashboard/DashboardSkeleton';
import { getDashboardStats, getCampaigns, getBrandDNA, getRecentActivity } from '@/lib/api/dashboard';
import { 
  Box, 
  Flex, 
  SimpleGrid 
} from '@chakra-ui/react';


// Server Component for data fetching
async function DashboardContent() {
  const userId = 'user_123';
  
  try {
    const [stats, campaigns, brandDna, activity] = await Promise.all([
      getDashboardStats(userId),
      getCampaigns(userId),
      getBrandDNA(userId),
      getRecentActivity(userId)
    ]);

    if (!stats || !brandDna) {
      return <Box p={8}>Failed to load dashboard data. Stats or Brand DNA missing.</Box>;
    }

    return (
      <Box p={8} maxW="1200px" mx="auto" w="full">
        <WelcomeBar />
        
        <Box mb={10}>
          <StatCards stats={stats} />
        </Box>

        <SimpleGrid columns={{ base: 1, lg: 3 }} gap={8} minH="400px">
          <Box gridColumn={{ lg: 'span 2' }}>
            <CampaignsTable campaigns={campaigns} />
          </Box>
          <Box>
            <Flex direction="column" gap={8}>
                <BrandDNACard brandDna={brandDna} />
                <QuickGenerate activities={activity} />
            </Flex>
          </Box>
        </SimpleGrid>
      </Box>
    );
  } catch (error) {
    console.error("Error in DashboardContent:", error);
    return <Box p={8}>Something went wrong while loading the dashboard. Please try again later.</Box>;
  }
}

export default function DashboardPage() {
  return (
    <Suspense fallback={<DashboardSkeleton />}>
      <DashboardContent />
    </Suspense>
  );
}
