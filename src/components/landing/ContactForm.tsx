"use client";

import { Box, Flex, Heading, Text } from "@chakra-ui/react";
import { motion } from "framer-motion";
import { useState } from "react";
import { Send, CheckCircle } from "lucide-react";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const MotionBox = motion.create(Box as any);

export default function ContactForm() {
  const [form, setForm] = useState({ name: "", email: "", message: "" });
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.MouseEvent) => {
    e.preventDefault();
    if (!form.name || !form.email || !form.message) return;
    setLoading(true);
    // Replace with your form submission endpoint (e.g. Formspree, Resend, etc.)
    await new Promise((r) => setTimeout(r, 800));
    setLoading(false);
    setSubmitted(true);
  };

  return (
    <Box
      as="section"
      py={{ base: "14", md: "24" }}
      px={{ base: "4", md: "6" }}
      bg="#F8FAFF"
      id="contact"
    >
      <Box maxW="2xl" mx="auto">
        <MotionBox
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
        >
          {/* Header */}
          <Flex justify="center" mb="4">
            <Box
              px="4"
              py="1.5"
              bg="blue.50"
              color="blue.600"
              rounded="full"
              fontSize={{ base: "xs", md: "sm" }}
              fontWeight="600"
            >
              Get in touch
            </Box>
          </Flex>
          <Heading
            as="h2"
            fontSize={{ base: "2xl", sm: "3xl", md: "4xl" }}
            fontWeight="800"
            textAlign="center"
            mb="3"
            lineHeight="1.1"
            color="gray.900"
          >
            We&apos;d love to hear from you
          </Heading>
          <Text
            color="gray.500"
            fontSize={{ base: "sm", md: "md" }}
            textAlign="center"
            mb="10"
            maxW="lg"
            mx="auto"
          >
            Have a question or want to know more? Drop us a message and we&apos;ll get back to you.
          </Text>

          {submitted ? (
            <Flex
              direction="column"
              align="center"
              gap="4"
              bg="white"
              p="10"
              rounded="2xl"
              border="1px solid"
              borderColor="blue.100"
              boxShadow="0 4px 20px rgba(79,70,229,0.06)"
            >
              <CheckCircle size={40} color="#4F46E5" />
              <Text fontWeight="700" fontSize="lg" color="gray.900">
                Message sent!
              </Text>
              <Text color="gray.500" fontSize="sm" textAlign="center">
                Thanks for reaching out. We&apos;ll get back to you shortly.
              </Text>
            </Flex>
          ) : (
            <Box
              bg="white"
              p={{ base: "6", md: "10" }}
              rounded="2xl"
              border="1px solid"
              borderColor="blue.100"
              boxShadow="0 4px 20px rgba(79,70,229,0.06)"
            >
              <Flex direction="column" gap="5">
                {/* Name */}
                <Box>
                  <Text fontSize="sm" fontWeight="600" color="gray.700" mb="2">
                    Your name
                  </Text>
                  <input
                    type="text"
                    placeholder="Jane Smith"
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    style={{
                      width: "100%",
                      padding: "12px 16px",
                      borderRadius: "12px",
                      border: "1px solid #E5E7EB",
                      fontSize: "14px",
                      outline: "none",
                      fontFamily: "inherit",
                      boxSizing: "border-box",
                    }}
                    onFocus={(e) => (e.target.style.borderColor = "#4F46E5")}
                    onBlur={(e) => (e.target.style.borderColor = "#E5E7EB")}
                  />
                </Box>

                {/* Email */}
                <Box>
                  <Text fontSize="sm" fontWeight="600" color="gray.700" mb="2">
                    Email address
                  </Text>
                  <input
                    type="email"
                    placeholder="jane@example.com"
                    value={form.email}
                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                    style={{
                      width: "100%",
                      padding: "12px 16px",
                      borderRadius: "12px",
                      border: "1px solid #E5E7EB",
                      fontSize: "14px",
                      outline: "none",
                      fontFamily: "inherit",
                      boxSizing: "border-box",
                    }}
                    onFocus={(e) => (e.target.style.borderColor = "#4F46E5")}
                    onBlur={(e) => (e.target.style.borderColor = "#E5E7EB")}
                  />
                </Box>

                {/* Message */}
                <Box>
                  <Text fontSize="sm" fontWeight="600" color="gray.700" mb="2">
                    Message
                  </Text>
                  <textarea
                    placeholder="Tell us what's on your mind..."
                    value={form.message}
                    onChange={(e) => setForm({ ...form, message: e.target.value })}
                    rows={5}
                    style={{
                      width: "100%",
                      padding: "12px 16px",
                      borderRadius: "12px",
                      border: "1px solid #E5E7EB",
                      fontSize: "14px",
                      outline: "none",
                      fontFamily: "inherit",
                      resize: "vertical",
                      boxSizing: "border-box",
                    }}
                    onFocus={(e) => (e.target.style.borderColor = "#4F46E5")}
                    onBlur={(e) => (e.target.style.borderColor = "#E5E7EB")}
                  />
                </Box>

                {/* Submit */}
                <Box
                  as="button"
                  onClick={handleSubmit}
                  display="flex"
                  alignItems="center"
                  justifyContent="center"
                  gap="2"
                  w="full"
                  h="52px"
                  bg="#4F46E5"
                  color="white"
                  rounded="14px"
                  fontSize="sm"
                  fontWeight="700"
                  cursor="pointer"
                  opacity={loading ? 0.7 : 1}
                  _hover={{ bg: "#4338CA", transform: "translateY(-1px)" }}
                  transition="all 0.2s"
                  border="none"
                >
                  {loading ? "Sending..." : (
                    <>
                      Send message
                      <Send size={15} />
                    </>
                  )}
                </Box>
              </Flex>
            </Box>
          )}
        </MotionBox>
      </Box>
    </Box>
  );
}