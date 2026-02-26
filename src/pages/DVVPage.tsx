import { useState } from "react";
import {
  Badge,
  Box,
  Container,
  Heading,
  HStack,
  IconButton,
  Separator,
  SegmentGroup,
  Text,
  VStack,
} from "@chakra-ui/react";
import {
  BellIcon,
  EuroIcon,
  HeartIcon,
  MailIcon,
  MenuIcon,
  PaperclipIcon,
  PenIcon,
  SearchIcon,
  SettingsIcon,
} from "@gds/icons";

type InboxFilter = "all" | "unread";

interface InboxItem {
  id: string;
  timestamp: string;
  sender: string;
  subject: string;
  unread: boolean;
  hasEuro?: boolean;
  hasAttachment?: boolean;
}

const DEMO_ITEMS: InboxItem[] = [
  { id: "1", timestamp: "Tänään, 9.45", sender: "Lähettäjäykkönen (4)", subject: "Ykkösviestin aihe tässä", unread: true },
  { id: "2", timestamp: "Tänään, 9.45", sender: "Lähettäjäkakkonen (4)", subject: "Kakkosviestin aihe tässä", unread: true, hasEuro: true },
  { id: "3", timestamp: "Tänään, 9.45", sender: "Lähettäjäkolmonen (4)", subject: "Kolmosviestin aihe tässä", unread: false, hasEuro: true, hasAttachment: true },
  { id: "4", timestamp: "Tänään, 9.45", sender: "Lähettäjänelonen (4)", subject: "Nelosviestin aihe tässä", unread: true },
  { id: "5", timestamp: "Tänään, 9.45", sender: "Lähettäjävitonen (4)", subject: "Vitosviestin aihe tässä", unread: false, hasAttachment: true },
  { id: "6", timestamp: "Tänään, 9.45", sender: "Lähettäjäkutonen (4)", subject: "Kutosviestin aihe tässä", unread: false },
  { id: "7", timestamp: "Tänään, 9.45", sender: "Lähettäjäseiska (4)", subject: "Seiskaviestin aihe tässä", unread: true },
];

const BOTTOM_NAV_ITEMS = [
  { id: "viestit", label: "Viestit", icon: MailIcon, active: true },
  { id: "tapahtumat", label: "Tapahtumat", icon: BellIcon, active: false },
  { id: "tuki", label: "Tuki", icon: HeartIcon, active: false },
  { id: "asetukset", label: "Asetukset", icon: SettingsIcon, active: false },
] as const;

export function DVVPage() {
  const [filter, setFilter] = useState<InboxFilter>("all");

  const items = filter === "unread" ? DEMO_ITEMS.filter((i) => i.unread) : DEMO_ITEMS;
  const unreadCount = DEMO_ITEMS.filter((i) => i.unread).length;

  return (
    <Box minH="100vh" display="flex" flexDirection="column" bg="bg.default" color="fg">
      {/* Header: hamburger, segmented control, search */}
      <Box borderBottomWidth="1px" borderColor="border.muted" flexShrink={0}>
        <Container maxW="2xl">
          <HStack py="4" gap="4" justify="space-between" align="center">
            <IconButton aria-label="Menu" variant="ghost" size="sm" colorPalette="gray">
              <MenuIcon boxSize="5" />
            </IconButton>
            <SegmentGroup.Root
              value={filter}
              onValueChange={(e) => setFilter(e.value as InboxFilter)}
              colorPalette="brand"
              size="sm"
            >
              <SegmentGroup.Indicator />
              <SegmentGroup.Items
                items={[
                  { value: "all", label: "Kaikki" },
                  { value: "unread", label: "Ei luettu" },
                ]}
              />
            </SegmentGroup.Root>
            <IconButton aria-label="Search" variant="ghost" size="sm" colorPalette="gray">
              <SearchIcon boxSize="5" />
            </IconButton>
          </HStack>
        </Container>
      </Box>

      {/* Title + badge */}
      <Box py="4" px="4" borderBottomWidth="1px" borderColor="border.muted">
        <Container maxW="2xl">
          <HStack gap="3" align="center">
            <Heading size="xl" fontWeight="bold">
              Saapuneet
            </Heading>
            <Badge variant="solid" colorPalette="brand" size="sm" borderRadius="full">
              {unreadCount}
            </Badge>
          </HStack>
        </Container>
      </Box>

      {/* Message list */}
      <Box flex="1" overflowY="auto">
        <Container maxW="2xl" py="2">
          <VStack align="stretch" gap="0">
            {items.map((item) => (
              <Box key={item.id}>
                <HStack
                  py="4"
                  px="2"
                  gap="3"
                  align="flex-start"
                  _hover={{ bg: "bg.subtle" }}
                  cursor="pointer"
                  borderRadius="md"
                >
                  {item.unread ? (
                    <Box flexShrink={0} w="2" h="2" borderRadius="full" bg="brand.solid" mt="2" />
                  ) : (
                    <Box flexShrink={0} w="2" />
                  )}
                  <VStack align="stretch" gap="0" flex="1" minW="0">
                    <Text textStyle="xs" color="fg.muted">
                      {item.timestamp}
                    </Text>
                    <Text fontWeight="semibold" textStyle="sm" lineClamp={1}>
                      {item.sender}
                    </Text>
                    <Text textStyle="sm" color="fg.muted" lineClamp={1}>
                      {item.subject}
                    </Text>
                  </VStack>
                  <HStack gap="1" flexShrink={0}>
                    {item.hasEuro && (
                      <Box color="fg.muted">
                        <EuroIcon boxSize="4" />
                      </Box>
                    )}
                    {item.hasAttachment && (
                      <Box color="fg.muted">
                        <PaperclipIcon boxSize="4" />
                      </Box>
                    )}
                  </HStack>
                </HStack>
                <Separator />
              </Box>
            ))}
          </VStack>
        </Container>
      </Box>

      {/* FAB */}
      <Box position="fixed" bottom="20" right="6" zIndex="10">
        <IconButton
          aria-label="Compose"
          size="lg"
          variant="solid"
          colorPalette="brand"
          borderRadius="full"
          boxShadow="lg"
        >
          <PenIcon boxSize="5" />
        </IconButton>
      </Box>

      {/* Bottom nav */}
      <Box
        borderTopWidth="1px"
        borderColor="border.muted"
        bg="bg.default"
        flexShrink={0}
        py="3"
        px="2"
      >
        <Container maxW="2xl">
          <HStack justify="space-around" gap="2">
            {BOTTOM_NAV_ITEMS.map(({ id, label, icon: Icon, active }) => (
              <VStack key={id} gap="1" flex="1" cursor="pointer">
                <Box position="relative">
                  <Icon
                    boxSize="6"
                    color={active ? "brand.solid" : "fg.muted"}
                  />
                  {id === "viestit" && (
                    <Box
                      position="absolute"
                      top="-1"
                      right="-1"
                      w="2"
                      h="2"
                      borderRadius="full"
                      bg="brand.solid"
                    />
                  )}
                  {id === "tapahtumat" && (
                    <Box
                      position="absolute"
                      top="-1"
                      right="-1"
                      w="2"
                      h="2"
                      borderRadius="full"
                      bg="brand.solid"
                    />
                  )}
                </Box>
                <Text
                  textStyle="xs"
                  color={active ? "fg" : "fg.muted"}
                  fontWeight={active ? "semibold" : "normal"}
                >
                  {label}
                </Text>
              </VStack>
            ))}
          </HStack>
        </Container>
      </Box>
    </Box>
  );
}
