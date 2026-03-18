import { Box, Flex, Heading, Text } from "@chakra-ui/react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";

interface LegalLayoutProps {
  children: React.ReactNode;
  title: string;
  lastUpdated: string;
}

export default function LegalLayout({ children, title, lastUpdated }: LegalLayoutProps) {
  return (
    <Box minH="100vh" bg="#1a1a3e" display="flex" flexDirection="column">
      <Navbar />
      
      <Box flex="1" pt={{ base: 28, md: 36 }} pb={{ base: 16, md: 24 }}>
        <Box maxW="3xl" mx="auto" px={{ base: 6, md: 8 }}>
          <Flex direction="column" gap={8}>
            <Box borderBottom="1px solid" borderColor="whiteAlpha.200" pb={8} mb={4}>
              <Heading as="h1" fontSize={{ base: "3xl", md: "4xl" }} color="white" mb={4} fontWeight="bold">
                {title}
              </Heading>
              <Text color="purple.300" fontSize="sm" fontWeight="medium">
                Last Updated: {lastUpdated}
              </Text>
            </Box>
            
            <Box
              css={{
                "& h2": {
                  fontSize: "1.25rem",
                  fontWeight: "bold",
                  color: "#d6bcfa", // purple.300
                  marginTop: "2.5rem",
                  marginBottom: "1rem",
                },
                "& h3": {
                  fontSize: "1.125rem",
                  fontWeight: "semibold",
                  color: "white",
                  marginTop: "2rem",
                  marginBottom: "0.75rem",
                },
                "& p": {
                  color: "rgba(255, 255, 255, 0.8)", // whiteAlpha.800 equivalent
                  marginBottom: "1rem",
                  lineHeight: "1.7",
                  fontSize: "1rem",
                },
                "& ul, & ol": {
                  color: "rgba(255, 255, 255, 0.8)",
                  marginBottom: "1rem",
                  paddingLeft: "1.5rem",
                  lineHeight: "1.7",
                },
                "& li": {
                  marginBottom: "0.5rem",
                },
                "& a": {
                  color: "#d6bcfa",
                  textDecoration: "underline",
                  transition: "color 0.2s",
                },
                "& a:hover": {
                  color: "#e9d8fd", // purple.200
                },
                "& hr": {
                  marginTop: "2.5rem",
                  marginBottom: "2.5rem",
                  borderColor: "rgba(255, 255, 255, 0.2)",
                  borderTopWidth: "1px",
                }
              }}
            >
              {children}
            </Box>
          </Flex>
        </Box>
      </Box>

      <Footer />
    </Box>
  );
}
