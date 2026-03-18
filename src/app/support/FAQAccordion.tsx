"use client";

import { useState } from "react";
import { Box, Flex, Text, VStack } from "@chakra-ui/react";
import { ChevronDown, ChevronUp } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface FAQItem {
  question: string;
  answer: string;
}

interface FAQAccordionProps {
  items: FAQItem[];
}

export default function FAQAccordion({ items }: FAQAccordionProps) {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const toggleItem = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <VStack gap={4} align="stretch" w="full">
      {items.map((item, index) => {
        const isOpen = openIndex === index;
        return (
          <Box 
            key={index} 
            border="1px solid" 
            borderColor={isOpen ? "blue.200" : "gray.200"}
            borderRadius="xl"
            bg={isOpen ? "blue.50/30" : "white"}
            transition="all 0.2s"
            boxShadow={isOpen ? "md" : "sm"}
            overflow="hidden"
          >
            <Flex 
              as="button" 
              w="full" 
              p={6} 
              align="center" 
              justify="space-between" 
              onClick={() => toggleItem(index)}
              _hover={{ bg: isOpen ? "blue.50/50" : "gray.50" }}
              textAlign="left"
            >
              <Text fontSize="md" fontWeight="600" color={isOpen ? "blue.700" : "gray.800"}>
                {item.question}
              </Text>
              <Box color={isOpen ? "blue.500" : "gray.400"}>
                {isOpen ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
              </Box>
            </Flex>
            
            <AnimatePresence>
              {isOpen && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.3, ease: "easeInOut" }}
                >
                  <Box px={6} pb={6}>
                    <Text color="gray.600" lineHeight="1.6" fontSize="sm">
                      {item.answer}
                    </Text>
                  </Box>
                </motion.div>
              )}
            </AnimatePresence>
          </Box>
        );
      })}
    </VStack>
  );
}
