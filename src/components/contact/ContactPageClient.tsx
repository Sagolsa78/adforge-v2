"use client";

import { useState } from "react";
import {
  Box,
  Container,
  Heading,
  Text,
  VStack,
  HStack,
  SimpleGrid,
  Input,
  Textarea,
  Button,
  Field,
  IconButton,
  Link,
} from "@chakra-ui/react";
import { toaster } from "@/components/ui/toaster";
import { Mail, Instagram, Twitter, MessageSquare, Send, CheckCircle } from "lucide-react";

export default function ContactPageClient() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const validate = () => {
    const newErrors: Record<string, string> = {};
    if (!form.name.trim()) newErrors.name = "Name is required";

    if (!form.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
      newErrors.email = "Invalid email format";
    }

    if (!form.subject.trim()) newErrors.subject = "Subject is required";

    if (!form.message.trim()) {
      newErrors.message = "Message is required";
    } else if (form.message.trim().length < 20) {
      newErrors.message = "Message must be at least 20 characters";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setIsSubmitting(true);

    // Simulate SMTP Mailer call
    console.log("Simulating SMTP Mailer sending email...");
    console.log("To: contact@plugandplayagent.com");
    console.log("From:", form.email);
    console.log("Subject:", form.subject);
    console.log("Body:", form.message);

    await new Promise((resolve) => setTimeout(resolve, 1500));

    setIsSubmitting(false);
    setIsSuccess(true);

    toaster.create({
      title: "Message sent!",
      description: "We'll get back to you within 24 hours.",
      type: "success",
      duration: 5000,
    });
  };

  return (
    <Box flex="1" as="main" py={{ base: 20, md: 32 }} bg="white">
      <Container maxW="6xl" mx="auto" px={4}>
        <SimpleGrid columns={{ base: 1, md: 2 }} gap={{ base: 16, lg: 24 }}>

          {/* Left Side: Info + Socials */}
          <VStack align="flex-start" gap={10}>
            <VStack align="flex-start" gap={4}>
              <Heading
                as="h1"
                fontSize={{ base: "4xl", md: "5xl" }}
                fontWeight="800"
                color="gray.900"
                letterSpacing="-0.02em"
              >
                Get in touch
              </Heading>
              <Text fontSize="lg" color="gray.600" maxW="md">
                Have a question, feedback, or just want to say hi? We&apos;d
                love to hear from you.
              </Text>
            </VStack>

            <VStack align="flex-start" gap={6}>
              <HStack gap={4}>
                <Box p={3} bg="blue.50" color="blue.600" borderRadius="lg">
                  <Mail size={24} />
                </Box>
                <Box>
                  <Text
                    fontSize="xs"
                    fontWeight="bold"
                    textTransform="uppercase"
                    letterSpacing="widest"
                    color="gray.400"
                    mb={1}
                  >
                    Email Us
                  </Text>
                  <Link
                    href="mailto:contact@plugandplayagent.com"
                    fontSize="lg"
                    fontWeight="600"
                    color="gray.900"
                    _hover={{ color: "blue.600" }}
                    variant="plain"
                  >
                    contact@plugandplayagent.com
                  </Link>
                </Box>
              </HStack>

              <VStack align="flex-start" gap={4}>
                <Text
                  fontSize="xs"
                  fontWeight="bold"
                  textTransform="uppercase"
                  letterSpacing="widest"
                  color="gray.400"
                >
                  Follow us
                </Text>
                <HStack gap={4}>
                  {[
                    { icon: <MessageSquare size={20} />, label: "Discord" },
                    { icon: <Instagram size={20} />, label: "Instagram" },
                    { icon: <Twitter size={20} />, label: "X" },
                  ].map((social) => (
                    <IconButton
                      key={social.label}
                      aria-label={social.label}
                      variant="ghost"
                      color="gray.500"
                      _hover={{
                        color: "blue.600",
                        bg: "blue.50",
                        transform: "translateY(-2px)",
                      }}
                      borderRadius="xl"
                      size="lg"
                      transition="all 0.2s"
                      asChild
                    >
                      <a href="#">{social.icon}</a>
                    </IconButton>
                  ))}
                </HStack>
              </VStack>
            </VStack>

            <Box
              p={4}
              bg="blue.50"
              borderRadius="xl"
              borderLeft="4px solid"
              borderColor="blue.500"
            >
              <Text fontSize="sm" color="blue.800" fontWeight="600">
                ⚡ We typically reply within 24 hours.
              </Text>
            </Box>
          </VStack>

          {/* Right Side: Form */}
          <Box w="full" maxW="500px" mx={{ base: "auto", md: "0" }}>
            {isSuccess ? (
              <VStack
                bg="white"
                p={{ base: 8, md: 10 }}
                borderRadius="2xl"
                border="1px solid"
                borderColor="blue.100"
                boxShadow="xl"
                gap={6}
                align="center"
                textAlign="center"
              >
                <Box
                  p={4}
                  bg="blue.50"
                  color="blue.600"
                  borderRadius="full"
                >
                  <CheckCircle size={48} />
                </Box>
                <VStack gap={2}>
                  <Heading size="lg" color="gray.900">
                    Message Sent!
                  </Heading>
                  <Text color="gray.600" fontSize="md">
                    Thanks for reaching out! We&apos;ll get back to you within 24 hours.
                  </Text>
                </VStack>
                <Button
                  colorPalette="blue"
                  variant="outline"
                  onClick={() => setIsSuccess(false)}
                  borderRadius="xl"
                  size="md"
                >
                  Send Another Message
                </Button>
              </VStack>
            ) : (
              <Box 
                bg="white" 
                p={{ base: 6, md: 10 }}
                borderRadius="3xl" 
                border="1px solid" 
                borderColor="gray.100" 
                boxShadow="2xl"
              >
                <form onSubmit={handleSubmit}>
                  <VStack gap={6}>
                    <Field.Root invalid={!!errors.name} width="full">
                      <Field.Label
                        fontSize="xs"
                        fontWeight="bold"
                        textTransform="uppercase"
                        letterSpacing="widest"
                        color="gray.500"
                        mb={1}
                      >
                        Name
                      </Field.Label>
                      <Input 
                        placeholder="Jane Doe" 
                        size="lg"
                        value={form.name}
                        onChange={(e) => setForm({ ...form, name: e.target.value })}
                        borderRadius="xl"
                        bg="gray.50"
                        border="1px solid"
                        borderColor="gray.100"
                        h="52px"
                        px={4}
                        _focus={{ 
                          borderColor: "blue.500", 
                          bg: "white", 
                          boxShadow: "0 0 0 1px #2563eb",
                        }}
                      />
                      <Field.ErrorText>{errors.name}</Field.ErrorText>
                    </Field.Root>

                    <Field.Root invalid={!!errors.email} width="full">
                      <Field.Label
                        fontSize="xs"
                        fontWeight="bold"
                        textTransform="uppercase"
                        letterSpacing="widest"
                        color="gray.500"
                        mb={1}
                      >
                        Email
                      </Field.Label>
                      <Input 
                        type="email"
                        placeholder="jane@example.com" 
                        size="lg"
                        value={form.email}
                        onChange={(e) => setForm({ ...form, email: e.target.value })}
                        borderRadius="xl"
                        bg="gray.50"
                        border="1px solid"
                        borderColor="gray.100"
                        h="52px"
                        px={4}
                        _focus={{ 
                          borderColor: "blue.500", 
                          bg: "white", 
                          boxShadow: "0 0 0 1px #2563eb",
                        }}
                      />
                      <Field.ErrorText>{errors.email}</Field.ErrorText>
                    </Field.Root>

                    <Field.Root invalid={!!errors.subject} width="full">
                      <Field.Label
                        fontSize="xs"
                        fontWeight="bold"
                        textTransform="uppercase"
                        letterSpacing="widest"
                        color="gray.500"
                        mb={1}
                      >
                        Subject
                      </Field.Label>
                      <Input 
                        placeholder="Inquiry about growth" 
                        size="lg"
                        value={form.subject}
                        onChange={(e) => setForm({ ...form, subject: e.target.value })}
                        borderRadius="xl"
                        bg="gray.50"
                        border="1px solid"
                        borderColor="gray.100"
                        h="52px"
                        px={4}
                        _focus={{ 
                          borderColor: "blue.500", 
                          bg: "white", 
                          boxShadow: "0 0 0 1px #2563eb",
                        }}
                      />
                      <Field.ErrorText>{errors.subject}</Field.ErrorText>
                    </Field.Root>

                    <Field.Root invalid={!!errors.message} width="full">
                      <Field.Label
                        fontSize="xs"
                        fontWeight="bold"
                        textTransform="uppercase"
                        letterSpacing="widest"
                        color="gray.500"
                        mb={1}
                      >
                        Message
                      </Field.Label>
                      <Textarea 
                        placeholder="Tell us about your project..." 
                        size="lg"
                        rows={5}
                        value={form.message}
                        onChange={(e) => setForm({ ...form, message: e.target.value })}
                        borderRadius="xl"
                        bg="gray.50"
                        border="1px solid"
                        borderColor="gray.100"
                        p={4}
                        _focus={{ 
                          borderColor: "blue.500", 
                          bg: "white", 
                          boxShadow: "0 0 0 1px #2563eb",
                        }}
                        resize="none"
                      />
                      <Field.ErrorText>{errors.message}</Field.ErrorText>
                    </Field.Root>

                    <Button 
                      type="submit" 
                      colorPalette="blue" 
                      size="lg" 
                      w="full" 
                      h="56px" 
                      borderRadius="xl" 
                      fontSize="md" 
                      fontWeight="bold"
                      loading={isSubmitting}
                      loadingText="Sending..."
                      _hover={{ transform: "translateY(-1px)", boxShadow: "0 4px 12px rgba(37, 99, 235, 0.2)" }}
                    >
                      Send Message
                      <Send size={18} style={{ marginLeft: "8px" }} />
                    </Button>
                  </VStack>
                </form>
              </Box>
            )}
          </Box>
        </SimpleGrid>
      </Container>
    </Box>
  );
}
