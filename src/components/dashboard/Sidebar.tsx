'use client';

import React from 'react';
import { 
  Box, 
  Flex, 
  VStack, 
  Text, 
  Icon, 
  Separator,
  Circle,
  HStack,
  IconButton
} from '@chakra-ui/react';
import { 
  Home, 
  Layers, 
  Zap, 
  BarChart2, 
  Settings, 
  LogOut,
  Sparkles,
  LayoutGrid,
  Menu
} from 'lucide-react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';

const MENU_ITEMS = [
  { id: 'home', name: 'Overview', icon: Home, path: '/dashboard' },
  { id: 'brand-dna', name: 'Brand DNA', icon: Zap, path: '/dashboard/brand-dna' },
  { id: 'campaigns', name: 'Campaigns', icon: Layers, path: '/dashboard/campaigns' },
  { id: 'analytics', name: 'Analytics', icon: BarChart2, path: '/dashboard/analytics' },
];

interface SidebarProps {
  onToggleSidebar: () => void;
  isCollapsed?: boolean;
}


export function Sidebar({ isCollapsed = false, onToggleSidebar }: SidebarProps) {
  const pathname = usePathname();
  const router = useRouter();

  const handleLogout = () => {
    // In a real app, we would call signout() from next-auth/react or clear supabase session
    router.push('/');
  };

  return (
    <Box 
      w={isCollapsed ? "80px" : "280px"} 
      h="100vh" 
      bg="white" 
      borderRight="1px solid" 
      borderColor="borderCore"
      transition="all 0.3s ease-in-out"
      display="flex"
      flexDirection="column"
      overflow="hidden"
      zIndex={200}
    >
      {/* Sidebar Header - Now Dashboard */}
      <Flex p={6} align="center" gap={3} h="80px">
        <Circle size="40px" bg="bgBase" border="1px solid" borderColor="accentViolet/20">
          
          <IconButton 
            aria-label="Toggle Sidebar" 
            variant="ghost" 
            onClick={onToggleSidebar}
            borderRadius="xl"
            color="textMuted"
            _hover={{ bg: 'bgBase', color: 'accentViolet' }}
          >
            <Menu size={20} />
          </IconButton>
        </Circle>
        {!isCollapsed && (
          <Box>
            <Text fontSize="xl" fontWeight="black" color="textPrimary" letterSpacing="tight">
              Dashboard
            </Text>
            <Text fontSize="8px" fontWeight="bold" color="textMuted" ml={0.5} mt={-1}>
              MAIN CONSOLE
            </Text>
          </Box>
        )}
      </Flex>

      <VStack gap={6} align="stretch" px={4} mt={4} flex={1}>
        {/* Navigation Items */}
        <VStack gap={1} align="stretch">
          {!isCollapsed && (
            <Text fontSize="10px" fontWeight="bold" color="textMuted" px={4} mb={2} textTransform="uppercase" letterSpacing="widest">
              Main Menu
            </Text>
          )}
          {MENU_ITEMS.map((item) => {
            const isActive = pathname === item.path;
            const IconComp = item.icon;
            return (
              <Link key={item.id} href={item.path} style={{ textDecoration: 'none' }}>
                <HStack 
                  gap={3}
                  px={4} 
                  py={3} 
                  borderRadius="xl" 
                  cursor="pointer"
                  transition="all 0.2s"
                  bg={isActive ? 'accentViolet' : 'transparent'}
                  color={isActive ? 'white' : 'textMuted'}
                  _hover={isActive ? {} : { bg: 'bgBase', color: 'accentViolet' }}
                  position="relative"
                  justifyContent={isCollapsed ? "center" : "flex-start"}
                >
                  <Icon color="inherit" size="md">
                    <IconComp size={20} />
                  </Icon>
                  {!isCollapsed && (
                    <Text fontWeight={isActive ? "bold" : "medium"} fontSize="sm">
                      {item.name}
                    </Text>
                  )}
                  {isActive && !isCollapsed && (
                    <Box 
                        position="absolute" 
                        right="-16px" 
                        h="20px" 
                        w="4px" 
                        bg="accentViolet" 
                        borderRadius="full" 
                    />
                  )}
                </HStack>
              </Link>
            );
          })}
        </VStack>

        <Separator variant="solid" borderColor="borderCore" opacity={0.5} />

        {/* Upgrade Card - only if not collapsed */}
        {!isCollapsed && (
            <Box p={4} borderRadius="20px" bg="bgBase" border="1px solid" borderColor="borderCore" position="relative" overflow="hidden">
                 <Box position="absolute" top="-10px" right="-10px" opacity={0.1}>
                    <Sparkles size={60} color="#7C3AED" />
                 </Box>
                 <Text fontSize="xs" fontWeight="bold" color="textPrimary" mb={1}>Pro Plan</Text>
                 <Text fontSize="10px" color="textMuted" mb={3}>Unlock unlimited AI ad generations.</Text>
                 <SidebarButton 
                    bg="accentViolet" 
                    color="white" 
                    size="xs" 
                    borderRadius="lg" 
                    w="full"
                    fontWeight="bold"
                 >
                    Upgrade Now
                 </SidebarButton>
            </Box>
        )}
      </VStack>

      {/* Footer Area */}
      <VStack p={4} gap={1} align="stretch" mb={4}>
        <HStack 
            gap={3}
            px={4} 
            py={3} 
            borderRadius="xl" 
            cursor="pointer"
            transition="all 0.2s"
            color="textMuted"
            _hover={{ bg: 'bgBase', color: 'accentViolet' }}
            justifyContent={isCollapsed ? "center" : "flex-start"}
        >
          <Icon size="md">
            <Settings size={20} />
          </Icon>
          {!isCollapsed && <Text fontWeight="medium" fontSize="sm">Settings</Text>}
        </HStack>
        <HStack 
            as="button"
            onClick={handleLogout}
            w="full"
            gap={3}
            px={4} 
            py={3} 
            borderRadius="xl" 
            cursor="pointer"
            transition="all 0.2s"
            color="red.500"
            _hover={{ bg: 'red.50' }}
            justifyContent={isCollapsed ? "center" : "flex-start"}
        >
          <LogOut size={20} />
          {!isCollapsed && <Text fontWeight="medium" fontSize="sm">Logout</Text>}
        </HStack>
      </VStack>
    </Box>
  );
}

function SidebarButton({ children, bg, color, size, borderRadius, w, fontWeight }: any) {
    return (
        <Box 
            as="button" 
            bg={bg} 
            color={color} 
            fontSize={size === 'xs' ? '10px' : 'sm'} 
            h={size === 'xs' ? '28px' : '40px'}
            borderRadius={borderRadius} 
            w={w} 
            fontWeight={fontWeight}
            _hover={{ opacity: 0.9, transform: 'translateY(-1px)' }}
            transition="all 0.2s"
        >
            {children}
        </Box>
    )
}
