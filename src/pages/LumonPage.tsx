import {
  Alert,
  Avatar,
  Badge,
  Box,
  Button,
  Card,
  Checkbox,
  Flex,
  Grid,
  HStack,
  IconButton,
  Input,
  SimpleGrid,
  Text,
  VStack,
} from "@chakra-ui/react";
import {
  BellIcon,
  BuildingIcon,
  CalendarIcon,
  ChevronRightIcon,
  ClockIcon,
  EllipsisVerticalIcon,
  EuroIcon,
  LayoutGridIcon,
  MapPinIcon,
  PlusIcon,
  SearchIcon,
  SendIcon,
  SettingsIcon,
  FileTextIcon,
} from "@gdesignsystem/icons";

const ANNOUNCEMENTS = [
  {
    id: "1",
    text: "RAL8019, RAI9005 ja RAL7016 värien väriryhmämuutos; Lasitus- ja kaidetuotteet: EPD laskuri…",
    timestamp: "Fri 12.12.2025, 12.43",
  },
  {
    id: "2",
    text: "RAL8019, RAI9005 ja RAL7016 värien väriryhmämuutos; Lasitus- ja kaidetuotteet: EPD laskuri…",
    timestamp: "Fri 12.12.2025, 12.43",
  },
];

const SITES = [
  { id: "50447458", name: "Site name goes here and it can be quite long", tag: "QUOTE", due: true },
  { id: "50447459", name: "Site name placeholder", tag: "OFFER", due: false },
  { id: "50447460", name: "Another site", tag: "ORDER", due: false },
];

const EVENTS = [
  { tag: "LAPUTUS", tagColor: "green", title: "As Oy Tammelan Tammi laputus", desc: "Laputus koko kerrostaloon", late: true },
  { tag: "MEETING", tagColor: "purple", title: "5098272-Työmaakokous YIT", desc: "Vaskivuorenkadulla työmaakokous.", date: "Tue 15.12.2025, 12.15", late: false },
];

const CALENDAR_ITEMS = [
  { date: "15.1.", headline: "Headline goes here", desc: "Description goes here and it can be a qu…" },
  { date: "21.1.", headline: "Headline goes here", desc: "Description goes here and it can be a qu…" },
  { date: "22.1.", headline: "Headline goes here", desc: "Description goes here and it can be a qu…" },
];

const SIDEBAR_ITEMS = [
  { icon: LayoutGridIcon, active: true, label: "Dashboard" },
  { icon: SearchIcon, active: false, label: "Search" },
  { icon: FileTextIcon, active: false, label: "Files" },
  { icon: SettingsIcon, active: false, label: "Settings" },
  { icon: PlusIcon, active: false, label: "Create" },
];

export function LumonPage() {
  return (
    <Box minH="100vh" display="flex" bg="bg.default" color="fg">
      {/* Left sidebar */}
      <Box
        w="14"
        flexShrink={0}
        borderRightWidth="1px"
        borderColor="border.muted"
        py="4"
        display="flex"
        flexDirection="column"
        alignItems="center"
        gap="2"
      >
        {SIDEBAR_ITEMS.map(({ icon: Icon, active, label }, i) => (
          <IconButton
            key={i}
            aria-label={label}
            variant={active ? "solid" : "ghost"}
            colorPalette={active ? "brand" : "gray"}
            size="sm"
          >
            <Icon boxSize="5" />
          </IconButton>
        ))}
      </Box>

      {/* Main content */}
      <Flex flex="1" flexDirection="column" minW="0">
        {/* Header */}
        <Box borderBottomWidth="1px" borderColor="border.muted" px="6" py="4" flexShrink={0}>
          <HStack justify="space-between" gap="4" flexWrap="wrap">
            <HStack gap="3">
              <Text fontWeight="bold" textStyle="lg" color="brand.solid">
                LUMON
              </Text>
              <Text fontWeight="semibold" textStyle="lg" color="fg">
                Salestori
              </Text>
            </HStack>
            <HStack gap="2" flex="1" maxW="md">
              <Input
                placeholder="Order number, project number, address, contact..."
                size="sm"
                bg="bg.subtle"
                flex="1"
              />
              <IconButton aria-label="Search" size="sm" colorPalette="gray" variant="ghost">
                <SearchIcon boxSize="4" />
              </IconButton>
              <Box position="relative">
                <IconButton aria-label="Notifications" size="sm" variant="ghost" colorPalette="gray">
                  <BellIcon boxSize="5" />
                </IconButton>
                <Badge
                  position="absolute"
                  top="-1"
                  right="-1"
                  variant="solid"
                  colorPalette="red"
                  size="sm"
                  borderRadius="full"
                >
                  3
                </Badge>
              </Box>
              <Avatar.Root size="sm">
                <Avatar.Fallback name="FL" />
              </Avatar.Root>
            </HStack>
          </HStack>
        </Box>

        {/* Content area */}
        <Box flex="1" overflowY="auto" p="6">
          <VStack align="stretch" gap="6" w="full">
            {/* Announcements */}
            <VStack align="stretch" gap="3">
              {ANNOUNCEMENTS.map((a) => (
                <Alert.Root key={a.id} status="info" variant="subtle" colorPalette="blue">
                  <Alert.Indicator>
                    <SendIcon boxSize="4" />
                  </Alert.Indicator>
                  <Alert.Content flex="1">
                    <Alert.Title textStyle="sm">{a.text}</Alert.Title>
                  </Alert.Content>
                  <Text textStyle="xs" color="fg.muted" flexShrink={0}>
                    {a.timestamp}
                  </Text>
                </Alert.Root>
              ))}
            </VStack>

            {/* Widget grid 2x2 */}
            <SimpleGrid columns={{ base: 1, md: 2, lg: 4 }} gap="6">
              {/* My sites and leads */}
              <Card.Root variant="elevated" size="md">
                <Card.Header>
                  <VStack align="stretch" gap="0">
                    <HStack justify="space-between" w="full">
                      <HStack gap="2">
                        <BuildingIcon boxSize="5" color="fg.muted" />
                        <Card.Title textStyle="md">My sites and leads (18)</Card.Title>
                      </HStack>
                      <IconButton aria-label="Options" variant="ghost" size="xs" colorPalette="gray">
                        <EllipsisVerticalIcon boxSize="4" />
                      </IconButton>
                    </HStack>
                    <HStack gap="2">
                      <Box w="5" flexShrink={0} aria-hidden />
                      <Text textStyle="xs" color="fg.muted">
                        All
                      </Text>
                    </HStack>
                  </VStack>
                </Card.Header>
                <Card.Body pt="0">
                  <VStack align="stretch" gap="0">
                    {SITES.map((site) => (
                      <Box
                        key={site.id}
                        py="3"
                        borderLeftWidth={site.due ? "3px" : "0"}
                        borderColor={site.due ? "red.solid" : "transparent"}
                        pl={site.due ? "3" : "0"}
                      >
                        <HStack justify="space-between" align="flex-start">
                          <VStack align="stretch" gap="0">
                            <Text textStyle="xs" color="fg.muted">
                              {site.id}
                            </Text>
                            <Text textStyle="sm" fontWeight="medium" lineClamp={1}>
                              {site.name}
                            </Text>
                          </VStack>
                          <Badge variant="outline" size="sm" colorPalette="gray">
                            {site.tag}
                          </Badge>
                        </HStack>
                      </Box>
                    ))}
                  </VStack>
                </Card.Body>
              </Card.Root>

              {/* Events & Activities */}
              <Card.Root variant="elevated" size="md">
                <Card.Header>
                  <VStack align="stretch" gap="0">
                    <HStack justify="space-between" w="full">
                      <HStack gap="2">
                        <ClockIcon boxSize="5" color="fg.muted" />
                        <Card.Title textStyle="md">Events & Activities</Card.Title>
                      </HStack>
                      <IconButton aria-label="Options" variant="ghost" size="xs" colorPalette="gray">
                        <EllipsisVerticalIcon boxSize="4" />
                      </IconButton>
                    </HStack>
                    <HStack gap="2">
                      <Box w="5" flexShrink={0} aria-hidden />
                      <Text textStyle="xs" color="fg.muted">
                        Today
                      </Text>
                    </HStack>
                  </VStack>
                </Card.Header>
                <Card.Body pt="0">
                  <VStack align="stretch" gap="3">
                    {EVENTS.map((e, i) => (
                      <Box
                        key={i}
                        py="2"
                        borderLeftWidth={e.late ? "3px" : "0"}
                        borderColor={e.late ? "red.solid" : "transparent"}
                        pl={e.late ? "3" : "0"}
                      >
                        <HStack gap="2" mb="1">
                          <Badge variant="subtle" size="sm" colorPalette={e.tagColor as "green" | "purple"}>
                            {e.tag}
                          </Badge>
                          {e.date && (
                            <Text textStyle="xs" color="fg.muted">
                              {e.date}
                            </Text>
                          )}
                        </HStack>
                        <Text textStyle="sm" fontWeight="medium">
                          {e.title}
                        </Text>
                        <Text textStyle="xs" color="fg.muted">
                          {e.desc}
                        </Text>
                        <Button size="xs" variant="outline" colorPalette="brand" mt="2">
                          Mark ready
                        </Button>
                      </Box>
                    ))}
                  </VStack>
                </Card.Body>
              </Card.Root>

              {/* My Calendar */}
              <Card.Root variant="elevated" size="md">
                <Card.Header>
                  <VStack align="stretch" gap="0">
                    <HStack justify="space-between" w="full">
                      <HStack gap="2">
                        <CalendarIcon boxSize="5" color="fg.muted" />
                        <Card.Title textStyle="md">My Calendar (4)</Card.Title>
                      </HStack>
                      <IconButton aria-label="Options" variant="ghost" size="xs" colorPalette="gray">
                        <EllipsisVerticalIcon boxSize="4" />
                      </IconButton>
                    </HStack>
                    <HStack gap="2">
                      <Box w="5" flexShrink={0} aria-hidden />
                      <Text textStyle="xs" color="fg.muted">
                        This week
                      </Text>
                    </HStack>
                  </VStack>
                </Card.Header>
                <Card.Body pt="0">
                  <VStack align="stretch" gap="2">
                    {CALENDAR_ITEMS.map((item, i) => (
                      <HStack key={i} justify="space-between" py="2" _hover={{ bg: "bg.subtle" }} borderRadius="md">
                        <HStack gap="3">
                          <Text textStyle="sm" color="fg.muted">
                            {item.date}
                          </Text>
                          <VStack align="stretch" gap="0">
                            <Text textStyle="sm" fontWeight="medium">
                              {item.headline}
                            </Text>
                            <Text textStyle="xs" color="fg.muted" lineClamp={1}>
                              {item.desc}
                            </Text>
                          </VStack>
                        </HStack>
                        <ChevronRightIcon boxSize="4" color="fg.muted" />
                      </HStack>
                    ))}
                  </VStack>
                </Card.Body>
              </Card.Root>

              {/* Monthly budget */}
              <Card.Root variant="elevated" size="md">
                <Card.Header>
                  <VStack align="stretch" gap="0">
                    <HStack justify="space-between" w="full">
                      <HStack gap="2">
                        <EuroIcon boxSize="5" color="fg.muted" />
                        <Card.Title textStyle="md">Monthly budget</Card.Title>
                      </HStack>
                      <IconButton aria-label="Options" variant="ghost" size="xs" colorPalette="gray">
                        <EllipsisVerticalIcon boxSize="4" />
                      </IconButton>
                    </HStack>
                    <HStack gap="2">
                      <Box w="5" flexShrink={0} aria-hidden />
                      <Text textStyle="xs" color="fg.muted">
                        This month
                      </Text>
                    </HStack>
                  </VStack>
                </Card.Header>
                <Card.Body pt="0">
                  <Grid templateColumns="1fr 1fr" gap="3" textStyle="sm">
                    <Text color="fg.muted">Budget:</Text>
                    <Text>12345,50 €</Text>
                    <Text color="fg.muted">Budget left:</Text>
                    <Text>6475,75 €</Text>
                    <Text color="fg.muted">Goal target:</Text>
                    <Text>—</Text>
                    <Text color="fg.muted">Goals gained:</Text>
                    <Text>—</Text>
                    <Text color="fg.muted">Goal percentage:</Text>
                    <Text>53%</Text>
                    <Text color="fg.muted">Remaining days:</Text>
                    <Text>8</Text>
                  </Grid>
                  <Box borderTopWidth="1px" borderColor="border.muted" mt="4" pt="4">
                    <Text textStyle="xs" fontWeight="medium" mb="2">
                      Comparison to previous month
                    </Text>
                    <Grid templateColumns="1fr 1fr" gap="2" textStyle="xs">
                      <Text color="fg.muted">Goal target:</Text>
                      <Text color="green.solid">+18%</Text>
                      <Text color="fg.muted">Goal percentage:</Text>
                      <Text color="red.solid">-2%</Text>
                      <Text color="fg.muted">Budget:</Text>
                      <Text color="green.solid">+1024 €</Text>
                    </Grid>
                  </Box>
                </Card.Body>
              </Card.Root>
            </SimpleGrid>

            {/* Sites map */}
            <Card.Root variant="elevated" size="lg">
              <Card.Header>
                <HStack justify="space-between" w="full">
                  <HStack gap="2">
                    <MapPinIcon boxSize="5" color="fg.muted" />
                    <Card.Title textStyle="md">Sites</Card.Title>
                  </HStack>
                  <HStack gap="2">
                    <Checkbox.Root size="sm">
                      <Checkbox.HiddenInput />
                      <Checkbox.Control />
                      <Checkbox.Label>My sites</Checkbox.Label>
                    </Checkbox.Root>
                    <IconButton aria-label="Options" variant="ghost" size="xs" colorPalette="gray">
                      <EllipsisVerticalIcon boxSize="4" />
                    </IconButton>
                  </HStack>
                </HStack>
              </Card.Header>
              <Card.Body pt="0">
                  <Box
                    bg="bg.subtle"
                    borderRadius="md"
                    h="64"
                    display="flex"
                    alignItems="center"
                    justifyContent="center"
                    borderWidth="1px"
                    borderColor="border.muted"
                  >
                    <VStack gap="2">
                      <MapPinIcon boxSize="10" color="fg.muted" />
                      <Text textStyle="sm" color="fg.muted">
                        Map view (Pori, Rauma, Tampere, Valkeakoski, Heinola, Lappeenranta)
                      </Text>
                      <HStack gap="2">
                        <Badge variant="outline" size="sm">
                          Map
                        </Badge>
                        <Badge variant="outline" size="sm">
                          Satellite
                        </Badge>
                      </HStack>
                    </VStack>
                  </Box>
                </Card.Body>
              </Card.Root>
            </VStack>
        </Box>
      </Flex>
    </Box>
  );
}
