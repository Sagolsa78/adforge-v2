'use client'

import React, { useState } from 'react'
import { Box, Flex } from '@chakra-ui/react'
import { Sidebar } from '@/components/dashboard/Sidebar'
import { Navbar } from '@/components/dashboard/Navbar'
import { Footer } from '@/components/dashboard/Footer'

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false)

  const toggleSidebar = () => {
    setIsSidebarCollapsed(!isSidebarCollapsed)
  }

  return (
    <Flex h="100vh" w="full" bg="bgBase" overflow="hidden">
      {/* Sidebar */}
      <Sidebar 
        isCollapsed={isSidebarCollapsed} 
        onToggleSidebar={toggleSidebar} 
      />

      {/* Main Content Area */}
      <Box 
        flex={1} 
        display="flex" 
        flexDirection="column" 
        h="full" 
        overflow="hidden"
        transition="all 0.3s ease-in-out"
        position="relative"
      >
        {/* Navbar */}
        <Navbar />

        {/* Content Scroll Area */}
        <Box 
          as="main" 
          flex={1} 
          overflowY="auto" 
          position="relative"
          bg="bgBase"
          display="flex"
          flexDirection="column"
        >
          <Box flex={1}>
            {children}
          </Box>
          
          {/* Footer at the bottom of the scroll area */}
          <Footer />
        </Box>
      </Box>
    </Flex>
  )
}
