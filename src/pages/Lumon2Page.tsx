import { useMemo } from "react";
import {
  Avatar,
  Badge,
  Box,
  Button,
  ButtonGroup,
  Checkbox,
  Flex,
  HStack,
  IconButton,
  Input,
  Pagination,
  Table,
  Text,
  VStack,
} from "@chakra-ui/react";
import {
  BellIcon,
  EllipsisVerticalIcon,
  FileTextIcon,
  LayoutGridIcon,
  PlusIcon,
  SearchIcon,
  SettingsIcon,
} from "@gds/icons";

type SitesTab = "all" | "consumer" | "projects" | "history";

type SiteRow = {
  created: string;
  projectNumber: string;
  projectName: string;
  customerName: string;
  type: string;
  status: string;
  address: string;
  zip: string;
  city: string;
  country: string;
  productsBatches: string;
};

const SIDEBAR_ITEMS = [
  { icon: LayoutGridIcon, active: false, label: "Dashboard" },
  { icon: SearchIcon, active: true, label: "Search" },
  { icon: FileTextIcon, active: false, label: "Files" },
  { icon: SettingsIcon, active: false, label: "Settings" },
  { icon: PlusIcon, active: false, label: "Create" },
];

export function Lumon2Page() {
  const tab: SitesTab = "all";

  const rows = useMemo<SiteRow[]>(
    () => [
      {
        created: "dd.mm.yyyy",
        projectNumber: "50447458",
        projectName: "Project name goes here an…",
        customerName: "Company Name",
        type: "Offer",
        status: "Calculation",
        address: "Street Name Is Here",
        zip: "45100",
        city: "Kouvola",
        country: "Finland",
        productsBatches: "5 / 1",
      },
      {
        created: "dd.mm.yyyy",
        projectNumber: "54638293",
        projectName: "Project name goes here an…",
        customerName: "Firstname Lastname",
        type: "Offer",
        status: "Calculation",
        address: "Street Name Is Here",
        zip: "45100",
        city: "Kouvola",
        country: "Finland",
        productsBatches: "5 / 1",
      },
      {
        created: "dd.mm.yyyy",
        projectNumber: "50394839",
        projectName: "Project name goes here an…",
        customerName: "Firstname Lastname",
        type: "Sales opportunity",
        status: "Open",
        address: "Street Name Is Here",
        zip: "45100",
        city: "Kouvola",
        country: "Finland",
        productsBatches: "5 / 1",
      },
      {
        created: "dd.mm.yyyy",
        projectNumber: "50447458 / 75930",
        projectName: "Project name is here",
        customerName: "Company Name",
        type: "Order",
        status: "Contract",
        address: "Street Name Is Here",
        zip: "45100",
        city: "Kouvola",
        country: "Finland",
        productsBatches: "5 / 1",
      },
    ],
    [],
  );

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
        {/* Header / toolbar */}
        <Box borderBottomWidth="1px" borderColor="border.muted" px="6" py="4" flexShrink={0}>
          <HStack justify="space-between" gap="6" flexWrap="wrap" align="center">
            <HStack gap="4" flexWrap="wrap" align="center">
              <HStack gap="3" align="center">
                <Text fontWeight="semibold" textStyle="lg">
                  Sites
                </Text>
                <Badge variant="subtle" colorPalette="gray" borderRadius="full">
                  2981
                </Badge>
              </HStack>

              <HStack gap="2" align="center">
                <Button
                  size="xs"
                  borderRadius="full"
                  variant={tab === "all" ? "solid" : "ghost"}
                  colorPalette={tab === "all" ? "orange" : "gray"}
                >
                  All
                </Button>
                <Button size="xs" borderRadius="full" variant="ghost" colorPalette="gray">
                  Consumer
                </Button>
                <Button size="xs" borderRadius="full" variant="ghost" colorPalette="gray">
                  Projects
                </Button>
                <Button size="xs" borderRadius="full" variant="ghost" colorPalette="gray">
                  History
                </Button>
              </HStack>
            </HStack>

            <HStack gap="3" align="center" flex="1" justify="flex-end" minW={{ base: "full", md: "auto" }}>
              <Checkbox.Root size="sm">
                <Checkbox.HiddenInput />
                <Checkbox.Control />
                <Checkbox.Label>Map</Checkbox.Label>
              </Checkbox.Root>

              <Checkbox.Root size="sm" defaultChecked>
                <Checkbox.HiddenInput />
                <Checkbox.Control />
                <Checkbox.Label>My sites</Checkbox.Label>
              </Checkbox.Root>

              <Button size="sm" variant="outline" colorPalette="gray">
                Filter
              </Button>

              <HStack gap="2" w={{ base: "full", md: "auto" }} flex="1" maxW="md">
                <Input
                  placeholder="Order number, project number, address, contact..."
                  size="sm"
                  bg="bg.subtle"
                  flex="1"
                />
                <IconButton aria-label="Search" size="sm" colorPalette="gray" variant="ghost">
                  <SearchIcon boxSize="4" />
                </IconButton>
              </HStack>

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

        {/* Table */}
        <Box flex="1" minH={0} overflow="hidden">
          <VStack align="stretch" gap="0" h="full">
            <Table.ScrollArea borderBottomWidth="1px" borderColor="border.muted" flex="1">
              <Table.Root size="sm" variant="outline" striped stickyHeader>
                <Table.Header>
                  <Table.Row bg="bg.subtle">
                    <Table.ColumnHeader>Created</Table.ColumnHeader>
                    <Table.ColumnHeader>Project number</Table.ColumnHeader>
                    <Table.ColumnHeader>Project name</Table.ColumnHeader>
                    <Table.ColumnHeader>Customer Name</Table.ColumnHeader>
                    <Table.ColumnHeader>Type</Table.ColumnHeader>
                    <Table.ColumnHeader>Status</Table.ColumnHeader>
                    <Table.ColumnHeader>Address</Table.ColumnHeader>
                    <Table.ColumnHeader>Zip</Table.ColumnHeader>
                    <Table.ColumnHeader>City</Table.ColumnHeader>
                    <Table.ColumnHeader>Country</Table.ColumnHeader>
                    <Table.ColumnHeader>Products / Batches</Table.ColumnHeader>
                    <Table.ColumnHeader textAlign="end" w="10" />
                  </Table.Row>
                </Table.Header>
                <Table.Body>
                  {rows.map((r, i) => (
                    <Table.Row key={i}>
                      <Table.Cell>{r.created}</Table.Cell>
                      <Table.Cell color="brand.solid" fontWeight="semibold">
                        {r.projectNumber}
                      </Table.Cell>
                      <Table.Cell>{r.projectName}</Table.Cell>
                      <Table.Cell>{r.customerName}</Table.Cell>
                      <Table.Cell>{r.type}</Table.Cell>
                      <Table.Cell>{r.status}</Table.Cell>
                      <Table.Cell>{r.address}</Table.Cell>
                      <Table.Cell>{r.zip}</Table.Cell>
                      <Table.Cell>{r.city}</Table.Cell>
                      <Table.Cell>{r.country}</Table.Cell>
                      <Table.Cell color="brand.solid" fontWeight="semibold">
                        {r.productsBatches}
                      </Table.Cell>
                      <Table.Cell textAlign="end">
                        <IconButton aria-label="Row options" size="xs" variant="ghost" colorPalette="gray">
                          <EllipsisVerticalIcon boxSize="4" />
                        </IconButton>
                      </Table.Cell>
                    </Table.Row>
                  ))}
                </Table.Body>
              </Table.Root>
            </Table.ScrollArea>

            <Box py="4">
              <Pagination.Root count={2981} pageSize={20} page={1}>
                <ButtonGroup variant="ghost" size="sm" justifyContent="center" w="full">
                  <Pagination.PrevTrigger asChild>
                    <IconButton aria-label="Previous page">{/* uses built-in icon styles */}‹</IconButton>
                  </Pagination.PrevTrigger>

                  <Pagination.Items
                    render={(page) => (
                      <IconButton aria-label={`Page ${page.value}`} variant={{ base: "ghost", _selected: "outline" }}>
                        {page.value}
                      </IconButton>
                    )}
                  />

                  <Pagination.NextTrigger asChild>
                    <IconButton aria-label="Next page">›</IconButton>
                  </Pagination.NextTrigger>
                </ButtonGroup>
              </Pagination.Root>
            </Box>
          </VStack>
        </Box>
      </Flex>
    </Box>
  );
}

