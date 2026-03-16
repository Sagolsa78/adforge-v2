"use client";

import { useEffect, useRef, useState } from "react";
import {
  Box,
  Button,
  Flex,
  Input,
  Grid,
  Spinner,
  Text,
  Textarea,
  VStack,
} from "@chakra-ui/react";
import { CheckCircle2, Globe, ShieldCheck, Signature } from "lucide-react";
import { useDiscoveryStream } from "@/hooks/useDiscoveryStream";
import { saveClaimedBrandId } from "@/lib/delayedAuth";
import { CreateBrandPanelProps } from "@/props/CreateBrandPanel";
import BrowserViewport from "@/components/onboarding/BrowserViewport";

/**
 * CreateBrandPanel Component
 * Renders the create brand form and streams the browser automation preview.
 *
 * @param isOpen - Whether the panel should show the form state
 * @param onBrandCreated - Callback when a brand ID is created
 * @param onClose - Callback to close the panel
 */
export default function CreateBrandPanel({
  isOpen,
  onBrandCreated,
  onClose,
}: CreateBrandPanelProps) {
  const completedBrandIdRef = useRef<string | null>(null);

  const fieldChrome = {
    bg: "white",
    border: "1px solid",
    borderColor: "#D8DDE6",
    borderRadius: "16px",
    fontSize: "15px",
    color: "#111111",
    transition: "all 0.18s ease",
    _placeholder: {
      color: "#9CA3AF",
    },
    _hover: {
      borderColor: "#C5CCD8",
    },
    _focusVisible: {
      borderColor: "#4F46E5",
      boxShadow: "0 0 0 4px rgba(79, 70, 229, 0.14)",
    },
  } as const;

  const [websiteUrl, setWebsiteUrl] = useState("");
  const [brandName, setBrandName] = useState("");
  const [guardrails, setGuardrails] = useState("");
  const [error, setError] = useState("");

  const {
    isRunning,
    status,
    thoughts,
    browserImage,
    error: streamError,
    brandId,
    startDiscovery,
    resetDiscovery,
  } = useDiscoveryStream();

  useEffect(() => {
    if (
      status === "finished" &&
      brandId &&
      completedBrandIdRef.current !== brandId
    ) {
      completedBrandIdRef.current = brandId;
      saveClaimedBrandId(brandId);
      onBrandCreated(brandId);
    }
  }, [brandId, onBrandCreated, status]);

  const displayError = error || streamError || "";

  const handleSubmit = () => {
    if (!websiteUrl || !brandName) {
      setError("Please enter both the website URL and brand name.");
      return;
    }
    completedBrandIdRef.current = null;
    setError("");
    startDiscovery(websiteUrl, brandName, guardrails);
  };

  const handleReset = () => {
    completedBrandIdRef.current = null;
    resetDiscovery();
    setError("");
  };

  return (
    <Box
      bg="white"
      border="1px solid"
      borderColor="#ECECEC"
      borderRadius="24px"
      p={8}
      boxShadow="0 12px 48px rgba(0, 0, 0, 0.04)"
    >
      {!isOpen ? (
        <Flex
          direction="column"
          align="center"
          justify="center"
          textAlign="center"
          minH="460px"
          gap={3}
        >
          <Flex
            w="56px"
            h="56px"
            borderRadius="16px"
            bg="rgba(79, 70, 229, 0.08)"
            color="#4F46E5"
            align="center"
            justify="center"
          >
            <Globe size={24} />
          </Flex>
          <Text fontSize="lg" fontWeight="700" color="#111111">
            Ready to create a brand?
          </Text>
          <Text fontSize="sm" color="#6B7280" maxW="320px">
            Click the button on the left to open the brand creation form here.
          </Text>
        </Flex>
      ) : (
        <>
          <Flex align="center" justify="space-between" mb={6}>
            <Box>
              <Text fontSize="lg" fontWeight="700" color="#111111">
                Create a Brand
              </Text>
              <Text fontSize="sm" color="#6B7280">
                Submit your site and we&apos;ll run the discovery agent.
              </Text>
            </Box>
            <Button variant="ghost" size="sm" onClick={onClose}>
              Close
            </Button>
          </Flex>

          <Grid
            templateColumns={{
              base: "1fr",
              xl: "minmax(0, 1.15fr) minmax(380px, 0.85fr)",
            }}
            gap={6}
            alignItems="start"
          >
            <Box
              border="1px solid"
              borderColor="#ECECEC"
              borderRadius="20px"
              p={5}
              bg="#F8F8F6"
              position={{ base: "static", xl: "sticky" }}
              top="24px"
            >
              <Text fontSize="12px" fontWeight="700" color="#6B7280" mb={3}>
                Discovery Preview
              </Text>
              <Box borderRadius="16px" overflow="hidden" bg="white" mb={3}>
                <BrowserViewport imageUrl={browserImage} status={status} />
              </Box>
              <Flex align="center" gap={2} color="#6B7280" fontSize="12px">
                <Globe size={14} />
                <Text>{isRunning ? "Browsing and extracting..." : "Idle"}</Text>
                {brandId ? (
                  <Flex align="center" gap={1} color="#16A34A" ml={2}>
                    <CheckCircle2 size={14} />
                    <Text>Brand created</Text>
                  </Flex>
                ) : null}
              </Flex>
              {thoughts.length > 0 && (
                <Box mt={4}>
                  <Text fontSize="11px" fontWeight="700" color="#111111" mb={2}>
                    Agent Thoughts
                  </Text>
                  <Box
                    bg="white"
                    border="1px solid"
                    borderColor="#ECECEC"
                    borderRadius="12px"
                    p={3}
                    maxH="160px"
                    overflowY="auto"
                    fontSize="12px"
                    color="#4B5563"
                  >
                    {thoughts.slice(-6).map((thought, idx) => (
                      <Text key={`${thought}-${idx}`} mb={1}>
                        {thought}
                      </Text>
                    ))}
                  </Box>
                </Box>
              )}
              <Flex
                align="center"
                gap={2}
                mt={4}
                color="#6B7280"
                fontSize="12px"
              >
                <ShieldCheck size={14} />
                <Text>
                  Guardrails are applied during brand identity generation.
                </Text>
              </Flex>
            </Box>

            <Box>
              <VStack align="stretch" gap={4} mb={6}>
                <Box>
                  <Flex align="center" justify="space-between" mb={2}>
                    <Text
                      fontSize="12px"
                      fontWeight="700"
                      color="#111111"
                      letterSpacing="0.02em"
                    >
                      Website URL
                    </Text>
                    <Text fontSize="11px" fontWeight="600" color="#4F46E5">
                      Required
                    </Text>
                  </Flex>
                  <Box position="relative">
                    <Flex
                      position="absolute"
                      left="14px"
                      top="50%"
                      transform="translateY(-50%)"
                      color="#6B7280"
                      pointerEvents="none"
                      zIndex={1}
                    >
                      <Globe size={16} />
                    </Flex>
                    <Input
                      type="url"
                      placeholder="https://yourbrand.com"
                      value={websiteUrl}
                      onChange={(e) => setWebsiteUrl(e.target.value)}
                      h="52px"
                      pl="42px"
                      pr="16px"
                      {...fieldChrome}
                    />
                  </Box>
                  <Text fontSize="12px" color="#6B7280" mt={2}>
                    Paste the homepage or landing page you want the agent to
                    inspect.
                  </Text>
                </Box>

                <Box>
                  <Flex align="center" justify="space-between" mb={2}>
                    <Text
                      fontSize="12px"
                      fontWeight="700"
                      color="#111111"
                      letterSpacing="0.02em"
                    >
                      Brand Name
                    </Text>
                    <Text fontSize="11px" fontWeight="600" color="#4F46E5">
                      Required
                    </Text>
                  </Flex>
                  <Box position="relative">
                    <Flex
                      position="absolute"
                      left="14px"
                      top="50%"
                      transform="translateY(-50%)"
                      color="#6B7280"
                      pointerEvents="none"
                      zIndex={1}
                    >
                      <Signature size={16} />
                    </Flex>
                    <Input
                      placeholder="Plug and Play Agent"
                      value={brandName}
                      onChange={(e) => setBrandName(e.target.value)}
                      h="52px"
                      pl="42px"
                      pr="16px"
                      {...fieldChrome}
                    />
                  </Box>
                  <Text fontSize="12px" color="#6B7280" mt={2}>
                    Use the name you want attached to the generated identity.
                  </Text>
                </Box>

                <Box>
                  <Flex align="center" justify="space-between" mb={2}>
                    <Text
                      fontSize="12px"
                      fontWeight="700"
                      color="#111111"
                      letterSpacing="0.02em"
                    >
                      Guardrails
                    </Text>
                    <Text fontSize="11px" fontWeight="600" color="#6B7280">
                      Optional
                    </Text>
                  </Flex>
                  <Textarea
                    placeholder="Avoid aggressive sales language, keep tone professional, and skip slang."
                    value={guardrails}
                    onChange={(e) => setGuardrails(e.target.value)}
                    minH="132px"
                    py="14px"
                    px="16px"
                    resize="vertical"
                    lineHeight="1.55"
                    {...fieldChrome}
                  />
                  <Text fontSize="12px" color="#6B7280" mt={2}>
                    Add tone, compliance, or messaging constraints for the
                    discovery output.
                  </Text>
                </Box>
              </VStack>

              {displayError && (
                <Box
                  bg="red.50"
                  border="1px solid"
                  borderColor="red.100"
                  color="red.600"
                  fontSize="sm"
                  p={3}
                  borderRadius="12px"
                  mb={4}
                >
                  {displayError}
                </Box>
              )}

              <Flex gap={3} wrap="wrap">
                <Button
                  bg="#4F46E5"
                  color="white"
                  h="42px"
                  px={6}
                  fontSize="14px"
                  fontWeight="700"
                  borderRadius="12px"
                  boxShadow="0 6px 16px rgba(79, 70, 229, 0.25)"
                  _hover={{
                    bg: "#4338CA",
                    transform: "translateY(-1px)",
                    boxShadow: "0 10px 24px rgba(79, 70, 229, 0.28)",
                  }}
                  _active={{ transform: "translateY(0)" }}
                  onClick={handleSubmit}
                  disabled={!isOpen || isRunning}
                >
                  {isRunning ? <Spinner size="sm" /> : "Start Discovery"}
                </Button>
                <Button
                  variant="outline"
                  h="42px"
                  px={5}
                  fontSize="13px"
                  fontWeight="600"
                  borderRadius="12px"
                  borderColor="#E5E7EB"
                  color="#6B7280"
                  _hover={{ bg: "#F3F4F6", color: "#111111" }}
                  onClick={handleReset}
                  disabled={!isOpen}
                >
                  Reset
                </Button>
              </Flex>
            </Box>
          </Grid>
        </>
      )}
    </Box>
  );
}
