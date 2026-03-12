"use client";

import { BrandContext } from "@/types/onboarding.types";
import { TPLS, IG_TPLS, TPL_META, TPL_EXAMPLES } from "@/config";
import {
  Box,
  Flex,
  Text,
  Button,
  SimpleGrid,
  Badge,
  Icon,
  VStack,
  Input,
  Grid,
  Separator,
  Table,
  Slider,
} from "@chakra-ui/react";
import { ArrowLeft, CheckCircle2, TrendingUp } from "lucide-react";

interface Props {
  ctx: BrandContext[];
  selCtx: number | null;
  selTpl: string | null;
  selIgTpl: string | null;
  platform: string;
  tone: string | null;
  emoji: string;
  cta: string;
  offer: string;
  slideN: number;
  isLoggedIn: boolean;
  onBack: () => void;
  onSelPlatform: (p: string) => void;
  onSelTpl: (id: string) => void;
  onSelIgTpl: (id: string) => void;
  onSelTone: (t: string) => void;
  onSelEmoji: (e: string) => void;
  onSetCta: (v: string) => void;
  onSetOffer: (v: string) => void;
  onSetSlideN: (n: number) => void;
  onSetField: (key: string, val: string) => void;
  onGenerate: () => void;
  onOpenLogin: () => void;
}

const PLATFORMS = [
  { id: "linkedin", label: "💼 LinkedIn", color: "blue" },
  { id: "instagram", label: "📸 Instagram", color: "pink" },
  { id: "twitter", label: "𝕏 Twitter/X", color: "gray" },
  { id: "facebook", label: "👥 Facebook", color: "facebook" },
];
const TONES = [
  { id: "luxury", label: "👑 Luxury" },
  { id: "fun", label: "🎉 Fun & Playful" },
  { id: "authority", label: "🎯 Authority" },
  { id: "bold", label: "⚡ Bold & Direct" },
  { id: "warm", label: "🤝 Warm & Human" },
  { id: "educational", label: "📚 Educational" },
];
const EMOJIS = [
  { id: "none", label: "None", samp: "—" },
  { id: "minimal", label: "Minimal", samp: "✨" },
  { id: "moderate", label: "Moderate", samp: "🔥💡" },
  { id: "heavy", label: "Heavy", samp: "🚀🎯🔥" },
];

export default function TemplateOptions(props: Props) {
  const {
    ctx,
    selCtx,
    selTpl,
    selIgTpl,
    platform,
    tone,
    emoji,
    cta,
    offer,
    slideN,
    isLoggedIn,
    onBack,
    onSelPlatform,
    onSelTpl,
    onSelIgTpl,
    onSelTone,
    onSelEmoji,
    onSetCta,
    onSetOffer,
    onSetSlideN,
    onSetField,
    onGenerate,
    onOpenLogin,
  } = props;
  const ctxObj = ctx.find((c) => c.id === selCtx);
  const isIg = platform === "instagram";
  const hasTemplate = isIg ? selIgTpl !== null : selTpl !== null;

  return (
    <Box w="full" px={4} py={12} minH="calc(100vh - 140px)">
      <Box maxW="1140px" mx="auto">
        <Button
          variant="outline"
          size="sm"
          onClick={onBack}
          mb={8}
          rounded="full"
          colorScheme="gray"
        >
          <Icon as={ArrowLeft} boxSize="14px" mr={2} /> Back
        </Button>

        <Box textAlign="center" mb={10}>
          <Box
            display="inline-flex"
            alignItems="center"
            px={3}
            py={1}
            rounded="full"
            bg="rgba(138,44,226,0.08)"
            border="1px solid"
            borderColor="rgba(138,44,226,0.2)"
            color="#8a2ce2"
            fontSize="11px"
            fontWeight="bold"
            textTransform="uppercase"
            letterSpacing="widest"
            mb={4}
          >
            <Box
              w="6px"
              h="6px"
              rounded="full"
              bg="#8a2ce2"
              mr={2}
              className="animate-pulse"
            />
            Step 5 of 7
          </Box>
          <Text
            fontSize={{ base: "3xl", md: "4xl" }}
            fontWeight="black"
            color="gray.900"
            letterSpacing="tight"
            mb={3}
            fontFamily="display"
          >
            Template{" "}
            <Text as="span" color="#8a2ce2">
              & Options
            </Text>
          </Text>
          <Text fontSize="md" color="gray.500" maxW="500px" mx="auto">
            Pick a template, then fine-tune the output. All options are
            optional.
          </Text>
        </Box>

        {ctxObj && (
          <Flex
            bg="rgba(138,44,226,0.06)"
            border="1px solid"
            borderColor="rgba(138,44,226,0.2)"
            rounded="xl"
            p={4}
            mb={8}
            align="center"
            gap={4}
          >
            <Box w={2} h={2} rounded="full" bg="#8a2ce2" flexShrink={0} />
            <Box>
              <Text
                fontSize="10px"
                color="#8a2ce2"
                fontWeight="bold"
                letterSpacing="wider"
                textTransform="uppercase"
                mb={0.5}
              >
                Selected Context
              </Text>
              <Text fontSize="sm" fontWeight="bold" color="gray.900">
                {ctxObj.title}
              </Text>
            </Box>
          </Flex>
        )}

        <Grid templateColumns={{ base: "1fr", lg: "2fr 1fr" }} gap={10}>
          <Box>
            <Box mb={8}>
              <Text fontSize="sm" fontWeight="bold" color="gray.700" mb={3}>
                Target Platform
              </Text>
              <Flex
                gap={3}
                overflowX="auto"
                pb={2}
                css={{ "&::-webkit-scrollbar": { display: "none" } }}
              >
                {PLATFORMS.map((p) => (
                  <Button
                    key={p.id}
                    variant={platform === p.id ? "solid" : "outline"}
                    colorScheme={platform === p.id ? p.color : "gray"}
                    bg={
                      platform === p.id
                        ? p.color === "pink"
                          ? "pink.500"
                          : `${p.color}.600`
                        : "white"
                    }
                    onClick={() => onSelPlatform(p.id)}
                    rounded="full"
                    px={6}
                    shadow={platform === p.id ? "md" : "none"}
                    whiteSpace="nowrap"
                  >
                    {p.label}
                  </Button>
                ))}
              </Flex>
            </Box>

            {!isIg && (
              <Box mb={8}>
                <Box mb={6}>
                  <Text fontSize="sm" fontWeight="bold" color="gray.700" mb={1}>
                    Choose a Template{" "}
                    <Text as="span" color="red.500">
                      *
                    </Text>
                  </Text>
                  <Text fontSize="xs" color="gray.500" mb={4}>
                    Click a template to preview its structure, then select it to
                    continue.
                  </Text>

                  <SimpleGrid columns={{ base: 1, md: 2 }} gap={4}>
                    {TPLS.map((t) => {
                      const meta = TPL_META[t.id];
                      const isSel = selTpl === t.id;
                      return (
                        <Box
                          key={t.id}
                          border="2px solid"
                          borderColor={isSel ? "#8a2ce2" : "gray.200"}
                          bg={isSel ? "rgba(138,44,226,0.06)" : "white"}
                          rounded="xl"
                          cursor="pointer"
                          position="relative"
                          overflow="hidden"
                          transition="all 0.2s"
                          _hover={{
                            borderColor: isSel ? "#7c28cb" : "gray.300",
                            transform: "translateY(-2px)",
                            shadow: "md",
                          }}
                          onClick={() => onSelTpl(t.id)}
                          display="flex"
                          flexDirection="column"
                        >
                          {isSel && (
                            <Flex
                              position="absolute"
                              top={3}
                              right={3}
                              w={6}
                              h={6}
                              bg="#8a2ce2"
                              rounded="full"
                              align="center"
                              justify="center"
                              color="white"
                              shadow="sm"
                            >
                              <Icon as={CheckCircle2} boxSize="14px" />
                            </Flex>
                          )}

                          <Box
                            h="100px"
                            bg={
                              t.cls === "ta-l"
                                ? "#111827"
                                : t.cls === "ta-r"
                                  ? "pink.800"
                                  : t.cls === "ta-h"
                                    ? "purple.800"
                                    : "teal.800"
                            }
                            p={4}
                            display="flex"
                            flexDirection="column"
                            justifyContent="space-between"
                            color="white"
                            position="relative"
                          >
                            <Box
                              opacity={0.3}
                              position="absolute"
                              inset={0}
                              bgImage="radial-gradient(circle at 100% 0%, currentColor 0%, transparent 50%)"
                            />
                            <Badge
                              colorScheme="whiteAlpha"
                              alignSelf="flex-start"
                              variant="subtle"
                              fontSize="9px"
                            >
                              {meta?.label}
                            </Badge>
                            <Flex
                              align="center"
                              gap={1}
                              fontSize="xs"
                              fontWeight="bold"
                            >
                              <Icon as={TrendingUp} boxSize="12px" />{" "}
                              {meta?.stat}
                            </Flex>
                          </Box>

                          <Box p={4} flex="1">
                            <Text
                              fontWeight="bold"
                              color="gray.900"
                              mb={1}
                              fontSize="sm"
                            >
                              {t.name}
                            </Text>
                            <Text
                              fontSize="xs"
                              color="gray.600"
                              lineHeight="short"
                              mb={3}
                            >
                              {t.desc}
                            </Text>
                            <Badge
                              colorScheme="gray"
                              variant="solid"
                              bg="gray.100"
                              color="gray.600"
                              fontSize="9px"
                            >
                              {meta?.use}
                            </Badge>
                          </Box>
                        </Box>
                      );
                    })}
                  </SimpleGrid>
                </Box>

                {selTpl && (
                  <Box
                    bg="white"
                    border="1px solid"
                    borderColor="gray.200"
                    rounded="xl"
                    p={6}
                    shadow="sm"
                    animation="slideDown 0.3s ease-out"
                  >
                    <Text
                      fontSize="md"
                      fontWeight="bold"
                      color="gray.900"
                      mb={4}
                    >
                      {TPLS.find((t) => t.id === selTpl)?.name} Options
                    </Text>
                    <VStack gap={4} align="stretch">
                      {TPLS.find((t) => t.id === selTpl)?.dynOpts.map((opt: { id: string; lbl: string; ph: string; type?: string }) => (
                        <Box key={opt.id}>
                          <Text
                            fontSize="xs"
                            fontWeight="bold"
                            color="gray.700"
                            mb={1.5}
                          >
                            {opt.lbl}
                          </Text>
                          <Input
                            placeholder={opt.ph}
                            type={opt.type || "text"}
                            onChange={(e) => onSetField(opt.id, e.target.value)}
                            bg="gray.50"
                            size="sm"
                            rounded="md"
                          />
                        </Box>
                      ))}
                    </VStack>

                    {TPL_EXAMPLES[selTpl] && (
                      <Box
                        mt={6}
                        pt={6}
                        borderTop="1px solid"
                        borderColor="gray.100"
                      >
                        <Text
                          fontSize="10px"
                          fontWeight="bold"
                          letterSpacing="widest"
                          color="gray.400"
                          textTransform="uppercase"
                          mb={4}
                        >
                          Example Slides
                        </Text>
                        <VStack gap={3} align="stretch">
                          {TPL_EXAMPLES[selTpl].map((ex, i) => (
                            <Box
                              key={i}
                              bg="gray.50"
                              p={4}
                              rounded="lg"
                              borderLeft="3px solid"
                              borderColor="#8a2ce2"
                            >
                              <Text
                                fontSize="10px"
                                fontWeight="bold"
                                color="#8a2ce2"
                                mb={1}
                              >
                                SLIDE {i + 1}
                              </Text>
                              <Text
                                fontSize="sm"
                                fontWeight="bold"
                                color="gray.900"
                                mb={1}
                              >
                                {ex.h}
                              </Text>
                              <Text fontSize="xs" color="gray.600">
                                {ex.b}
                              </Text>
                            </Box>
                          ))}
                        </VStack>
                      </Box>
                    )}
                  </Box>
                )}
              </Box>
            )}

            {isIg && (
              <Box mb={8}>
                <Text fontSize="sm" fontWeight="bold" color="gray.700" mb={3}>
                  Choose an Instagram Template{" "}
                  <Text as="span" color="red.500">
                    *
                  </Text>
                </Text>

                <SimpleGrid columns={{ base: 2, sm: 3, md: 5 }} gap={3} mb={6}>
                  {IG_TPLS.map((t) => {
                    const isSel = selIgTpl === t.id;
                    return (
                      <Box
                        key={t.id}
                        border="2px solid"
                        borderColor={isSel ? "#8a2ce2" : "gray.200"}
                        bg={isSel ? "rgba(138,44,226,0.06)" : "white"}
                        rounded="xl"
                        cursor="pointer"
                        position="relative"
                        transition="all 0.2s"
                        _hover={{
                          borderColor: isSel ? "pink.600" : "gray.300",
                          transform: "translateY(-2px)",
                          shadow: "sm",
                        }}
                        onClick={() => onSelIgTpl(t.id)}
                        overflow="hidden"
                      >
                        {isSel && (
                          <Flex
                            position="absolute"
                            top={2}
                            right={2}
                            w={5}
                            h={5}
                            bg="#8a2ce2"
                            rounded="full"
                            align="center"
                            justify="center"
                            color="white"
                            shadow="sm"
                            zIndex={2}
                          >
                            <Icon as={CheckCircle2} boxSize="12px" />
                          </Flex>
                        )}
                        <Box
                          h="80px"
                          bg={
                            t.cls === "iga-1"
                              ? "purple.500"
                              : t.cls === "iga-2"
                                ? "#8a2ce2"
                                : t.cls === "iga-3"
                                  ? "orange.500"
                                  : t.cls === "iga-4"
                                    ? "teal.500"
                                    : "pink.500"
                          }
                          display="flex"
                          alignItems="flex-end"
                          p={2}
                          position="relative"
                        >
                          <Box
                            opacity={0.2}
                            position="absolute"
                            inset={0}
                            bgImage="linear-gradient(to top right, transparent, currentColor)"
                          />
                          <Text
                            color="whiteAlpha.900"
                            fontSize="10px"
                            fontWeight="bold"
                            zIndex={1}
                          >
                            {t.prev}
                          </Text>
                        </Box>
                        <Box p={3} textAlign="center">
                          <Text
                            fontWeight="bold"
                            color="gray.900"
                            fontSize="xs"
                            mb={1}
                          >
                            {t.name}
                          </Text>
                          <Badge
                            colorScheme="green"
                            variant="subtle"
                            fontSize="9px"
                          >
                            📈 {t.kpi}
                          </Badge>
                        </Box>
                      </Box>
                    );
                  })}
                </SimpleGrid>

                {selIgTpl && (
                  <Box
                    bg="white"
                    border="1px solid"
                    borderColor="gray.200"
                    rounded="xl"
                    p={6}
                    shadow="sm"
                  >
                    <Text
                      fontSize="md"
                      fontWeight="bold"
                      color="gray.900"
                      mb={4}
                    >
                      📸 Template Fields
                    </Text>

                    <SimpleGrid columns={{ base: 1, sm: 2 }} gap={4} mb={6}>
                      {IG_TPLS.find((t) => t.id === selIgTpl)?.fields.map(
                        (f: { id: string; lbl: string; ph: string }) => (
                          <Box key={f.id}>
                            <Text
                              fontSize="xs"
                              fontWeight="bold"
                              color="gray.700"
                              mb={1.5}
                            >
                              {f.lbl}
                            </Text>
                            <Input
                              placeholder={f.ph}
                              onChange={(e) => onSetField(f.id, e.target.value)}
                              bg="gray.50"
                              size="sm"
                              rounded="md"
                            />
                          </Box>
                        ),
                      )}
                    </SimpleGrid>

                    <Box
                      bg="gray.50"
                      border="1px solid"
                      borderColor="gray.100"
                      rounded="lg"
                      p={4}
                      mb={6}
                    >
                      <Flex align="center" gap={2} mb={3}>
                        <Box
                          w={6}
                          h={6}
                          rounded="full"
                          bgGradient="linear(to-tr, yellow.400, pink.500, purple.500)"
                        />
                        <Text fontSize="xs" fontWeight="bold" color="gray.900">
                          @yourbrand
                        </Text>
                      </Flex>
                      <Text
                        fontSize="sm"
                        color="gray.700"
                        mb={3}
                        lineHeight="tall"
                      >
                        {IG_TPLS.find((t) => t.id === selIgTpl)?.example.slice(
                          0,
                          200,
                        )}
                        …
                      </Text>
                      <Flex gap={2} flexWrap="wrap">
                        {IG_TPLS.find((t) => t.id === selIgTpl)?.tags.map(
                          (tag: string, idx: number) => (
                            <Text key={idx} color="#8a2ce2" fontSize="xs" fontWeight="medium" bg="rgba(138,44,226,0.06)" px={2} py={1} rounded="md">
                              #{tag}
                            </Text>
                          ),
                        )}
                      </Flex>
                    </Box>

                    <Box>
                      <Text
                        fontSize="10px"
                        fontWeight="bold"
                        letterSpacing="widest"
                        textTransform="uppercase"
                        color="gray.400"
                        mb={3}
                      >
                        Quick Reference — All 5 Templates
                      </Text>
                      <Box
                        border="1px solid"
                        borderColor="gray.200"
                        rounded="lg"
                        overflowX="auto"
                      >
                        <Table.Root size="sm" variant="outline">
                          <Table.Header bg="gray.50">
                            <Table.Row>
                              <Table.ColumnHeader fontSize="10px" py={3}>
                                Template
                              </Table.ColumnHeader>
                              <Table.ColumnHeader fontSize="10px" py={3}>
                                Best Goal
                              </Table.ColumnHeader>
                              <Table.ColumnHeader fontSize="10px" py={3}>
                                Format
                              </Table.ColumnHeader>
                              <Table.ColumnHeader fontSize="10px" py={3}>
                                KPI
                              </Table.ColumnHeader>
                            </Table.Row>
                          </Table.Header>
                          <Table.Body>
                            <Table.Row>
                              <Table.Cell fontSize="xs" fontWeight="medium">
                                🌿 Storytelling
                              </Table.Cell>
                              <Table.Cell>
                                <Badge colorScheme="purple" fontSize="9px">
                                  Emotional
                                </Badge>
                              </Table.Cell>
                              <Table.Cell fontSize="11px" color="gray.500">
                                Reel / Carousel
                              </Table.Cell>
                              <Table.Cell>
                                <Badge colorScheme="green" fontSize="9px">
                                  Saves & Shares
                                </Badge>
                              </Table.Cell>
                            </Table.Row>
                            <Table.Row>
                              <Table.Cell fontSize="xs" fontWeight="medium">
                                🚨 Educational
                              </Table.Cell>
                              <Table.Cell>
                                <Badge colorPalette="purple" fontSize="9px">
                                  Trust
                                </Badge>
                              </Table.Cell>
                              <Table.Cell fontSize="11px" color="gray.500">
                                Carousel / Post
                              </Table.Cell>
                              <Table.Cell>
                                <Badge colorScheme="green" fontSize="9px">
                                  Saves
                                </Badge>
                              </Table.Cell>
                            </Table.Row>
                            <Table.Row>
                              <Table.Cell fontSize="xs" fontWeight="medium">
                                🔥 Offer
                              </Table.Cell>
                              <Table.Cell>
                                <Badge colorScheme="orange" fontSize="9px">
                                  Conversion
                                </Badge>
                              </Table.Cell>
                              <Table.Cell fontSize="11px" color="gray.500">
                                Feed + Story
                              </Table.Cell>
                              <Table.Cell>
                                <Badge colorScheme="green" fontSize="9px">
                                  Clicks & DMs
                                </Badge>
                              </Table.Cell>
                            </Table.Row>
                            <Table.Row>
                              <Table.Cell fontSize="xs" fontWeight="medium">
                                ⭐ Testimonial
                              </Table.Cell>
                              <Table.Cell>
                                <Badge colorScheme="teal" fontSize="9px">
                                  Proof
                                </Badge>
                              </Table.Cell>
                              <Table.Cell fontSize="11px" color="gray.500">
                                Feed Post / Reel
                              </Table.Cell>
                              <Table.Cell>
                                <Badge colorScheme="green" fontSize="9px">
                                  Comments
                                </Badge>
                              </Table.Cell>
                            </Table.Row>
                            <Table.Row>
                              <Table.Cell fontSize="xs" fontWeight="medium">
                                🌍 Mission
                              </Table.Cell>
                              <Table.Cell>
                                <Badge colorScheme="pink" fontSize="9px">
                                  Loyalty
                                </Badge>
                              </Table.Cell>
                              <Table.Cell fontSize="11px" color="gray.500">
                                Reel / Carousel
                              </Table.Cell>
                              <Table.Cell>
                                <Badge colorScheme="green" fontSize="9px">
                                  Shares & Follows
                                </Badge>
                              </Table.Cell>
                            </Table.Row>
                          </Table.Body>
                        </Table.Root>
                      </Box>
                    </Box>
                  </Box>
                )}
              </Box>
            )}

            <Separator my={8} />

            <Box mb={8}>
              <Text fontSize="sm" fontWeight="bold" color="gray.700" mb={1}>
                Tone of Voice{" "}
                <Text as="span" color="gray.400" fontWeight="normal">
                  (Optional)
                </Text>
              </Text>
              <Flex gap={2} flexWrap="wrap" mt={3}>
                {TONES.map((t) => (
                  <Button
                    key={t.id}
                    variant={tone === t.id ? "solid" : "outline"}
                    bg={tone === t.id ? "#8a2ce2" : "white"}
                    color={tone === t.id ? "white" : "gray.600"}
                    borderColor={tone === t.id ? "#8a2ce2" : "gray.200"}
                    size="sm"
                    rounded="full"
                    onClick={() => onSelTone(t.id)}
                    fontWeight="medium"
                  >
                    {t.label}
                  </Button>
                ))}
              </Flex>
            </Box>

            <Box>
              <Text fontSize="sm" fontWeight="bold" color="gray.700" mb={1}>
                Emoji Style
              </Text>
              <Flex gap={2} flexWrap="wrap" mt={3}>
                {EMOJIS.map((e) => (
                  <Button
                    key={e.id}
                    variant={emoji === e.id ? "solid" : "outline"}
                    colorScheme={emoji === e.id ? "gray" : "gray"}
                    bg={emoji === e.id ? "gray.800" : "white"}
                    color={emoji === e.id ? "white" : "gray.600"}
                    size="sm"
                    rounded="full"
                    onClick={() => onSelEmoji(e.id)}
                    fontWeight="medium"
                  >
                    <Text
                      as="span"
                      mr={2}
                      color={emoji === e.id ? "whiteAlpha.700" : "gray.400"}
                    >
                      {e.samp}
                    </Text>
                    {e.label}
                  </Button>
                ))}
              </Flex>
            </Box>
          </Box>

          <Box>
            <Box
              position="sticky"
              top="120px"
              bg="white"
              border="1px solid"
              borderColor="gray.200"
              rounded="2xl"
              p={6}
              shadow="sm"
            >
              <Text
                fontSize="10px"
                fontWeight="bold"
                letterSpacing="widest"
                color="gray.400"
                textTransform="uppercase"
                mb={5}
              >
                Content Settings
              </Text>

              <VStack gap={5} align="stretch" mb={6}>
                <Box>
                  <Text
                    fontSize="xs"
                    fontWeight="bold"
                    color="gray.700"
                    mb={1.5}
                  >
                    CTA / Closing Line{" "}
                    <Text as="span" color="gray.400" fontWeight="normal">
                      (Optional)
                    </Text>
                  </Text>
                  <Input
                    placeholder="e.g. Follow for more insights"
                    value={cta}
                    onChange={(e) => onSetCta(e.target.value)}
                    bg="gray.50"
                    size="sm"
                    rounded="md"
                  />
                </Box>

                <Box>
                  <Text
                    fontSize="xs"
                    fontWeight="bold"
                    color="gray.700"
                    mb={1.5}
                  >
                    Offer / Promotion{" "}
                    <Text as="span" color="gray.400" fontWeight="normal">
                      (Optional)
                    </Text>
                  </Text>
                  <Input
                    placeholder="e.g. Free audit this week only"
                    value={offer}
                    onChange={(e) => onSetOffer(e.target.value)}
                    bg="gray.50"
                    size="sm"
                    rounded="md"
                  />
                </Box>

                <Box>
                  <Text fontSize="xs" fontWeight="bold" color="gray.700" mb={3}>
                    Number of Slides
                  </Text>
                  <Flex align="center" gap={4}>
                    <Slider.Root
                      // eslint-disable-next-line jsx-a11y/aria-proptypes
                      aria-label={["slider-ex-1"]}
                      min={3}
                      max={8}
                      defaultValue={[slideN]}
                      value={[slideN]}
                      onValueChange={(v) => onSetSlideN(v.value[0])}
                      colorPalette="purple"
                      flex="1"
                    >
                      <Slider.Track bg="gray.200">
                        <Slider.Range bg="#8a2ce2" />
                      </Slider.Track>
                      <Slider.Thumb
                        index={0}
                        boxSize={4}
                        bg="white"
                        border="2px solid"
                        borderColor="#8a2ce2"
                      />
                    </Slider.Root>
                    <Text
                      fontSize="lg"
                      fontWeight="black"
                      color="#8a2ce2"
                      w="24px"
                      textAlign="center"
                    >
                      {slideN}
                    </Text>
                  </Flex>
                </Box>
              </VStack>

              <Separator my={5} />

              {!isLoggedIn ? (
                <Box textAlign="center">
                  <Text fontSize="xs" color="gray.500" mb={3}>
                    Login required to generate content
                  </Text>
                  <Button
                    w="full"
                    size="lg"
                    bg="#8a2ce2"
                    color="white"
                    onClick={onOpenLogin}
                    rounded="full"
                    fontWeight="bold"
                    boxShadow="0 4px 14px rgba(138,44,226,0.3)"
                    _hover={{ bg: "#7c28cb", transform: "translateY(-1px)" }}
                    transition="all 0.2s"
                  >
                    Sign In to Generate
                  </Button>
                </Box>
              ) : (
                <Button
                  w="full"
                  size="lg"
                  bg={hasTemplate ? "#8a2ce2" : "gray.100"}
                  color={hasTemplate ? "white" : "gray.400"}
                  disabled={!hasTemplate}
                  onClick={onGenerate}
                  rounded="full"
                  fontWeight="bold"
                  boxShadow={hasTemplate ? "0 4px 14px rgba(138,44,226,0.3)" : "none"}
                  _hover={
                    hasTemplate
                      ? {
                          bg: "#7c28cb",
                          transform: "translateY(-1px)",
                        }
                      : {}
                  }
                  transition="all 0.2s"
                >
                  {hasTemplate
                    ? "Generate Content →"
                    : "Select a template first"}
                </Button>
              )}
            </Box>
          </Box>
        </Grid>
      </Box>
    </Box>
  );
}
