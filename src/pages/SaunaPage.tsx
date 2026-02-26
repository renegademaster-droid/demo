import { useCallback, useEffect, useRef, useState } from "react";
import {
  Badge,
  Box,
  CloseButton,
  Container,
  Dialog,
  Flex,
  Heading,
  Portal,
  SimpleGrid,
  Table,
  Text,
  VStack,
} from "@chakra-ui/react";
import {
  BuildingIcon,
  CalendarIcon,
  MapPinIcon,
  ThermometerIcon,
  UsersIcon,
  WavesIcon,
} from "@gds/icons";
import { SAUNAS, type Sauna } from "../data/saunas";

const FINLAND_CENTER: [number, number] = [64.5, 26.0];
const MAP_ZOOM = 5;

function escapeHtml(text: string): string {
  const div = document.createElement("div");
  div.textContent = text;
  return div.innerHTML;
}

function createSaunaMarkerIcon(saunaName: string): ReturnType<typeof L.divIcon> {
  const safeName = escapeHtml(saunaName);
  return L.divIcon({
    className: "sauna-marker-icon",
    html: `
      <span class="sauna-marker-label">
        <span class="sauna-marker-text">${safeName}</span>
        <span class="sauna-marker-pointer"></span>
      </span>
    `,
    iconSize: [160, 36],
    iconAnchor: [80, 34],
  });
}

function SaunaMap({ onSaunaSelect }: { onSaunaSelect: (sauna: Sauna) => void }) {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<ReturnType<typeof L.map> | null>(null);
  const clusterRef = useRef<ReturnType<typeof L.markerClusterGroup> | null>(null);

  useEffect(() => {
    if (!mapRef.current || typeof L === "undefined") return;

    const map = L.map(mapRef.current).setView(FINLAND_CENTER, MAP_ZOOM);
    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
    }).addTo(map);

    const cluster = L.markerClusterGroup({
      maxClusterRadius: 60,
      spiderfyOnMaxZoom: true,
      showCoverageOnHover: false,
    });

    SAUNAS.forEach((sauna) => {
      const marker = L.marker([sauna.lat, sauna.lng], {
        icon: createSaunaMarkerIcon(sauna.name),
      });
      marker.on("click", () => onSaunaSelect(sauna));
      cluster.addLayer(marker);
    });

    map.addLayer(cluster);
    mapInstanceRef.current = map;
    clusterRef.current = cluster;

    return () => {
      map.removeLayer(cluster);
      map.remove();
      mapInstanceRef.current = null;
      clusterRef.current = null;
    };
  }, [onSaunaSelect]);

  return (
    <Box position="relative" w="100%" h="100%" minH="400px" borderRadius="lg" overflow="hidden" bg="bg.muted" display="flex" flexDirection="column">
      <Box
        as="style"
        flexShrink={0}
        dangerouslySetInnerHTML={{
          __html: `
            .sauna-marker-icon { background: none !important; border: none !important; }
            .sauna-marker-label {
              display: flex;
              flex-direction: column;
              align-items: center;
              filter: drop-shadow(0 2px 4px rgba(0,0,0,0.25));
            }
            .sauna-marker-text {
              display: inline-block;
              padding: 5px 12px;
              background: #fff;
              border-radius: 14px;
              font-size: 12px;
              font-weight: 600;
              color: #1a202c;
              white-space: nowrap;
              max-width: 152px;
              overflow: hidden;
              text-overflow: ellipsis;
              border: 1px solid #e2e8f0;
              box-sizing: border-box;
            }
            .sauna-marker-icon:hover .sauna-marker-text {
              background: #2b6cb0;
              color: #fff;
              border-color: #2b6cb0;
            }
            .sauna-marker-pointer {
              width: 0;
              height: 0;
              border-left: 6px solid transparent;
              border-right: 6px solid transparent;
              border-top: 8px solid #fff;
              margin-top: -1px;
              margin-left: 1px;
            }
            .sauna-marker-icon:hover .sauna-marker-pointer { border-top-color: #2b6cb0; }
          `,
        }}
      />
      <Box ref={mapRef} flex="1" minH="0" w="100%" />
    </Box>
  );
}

function SaunaDetailDialog({
  sauna,
  open,
  onClose,
}: {
  sauna: Sauna | null;
  open: boolean;
  onClose: () => void;
}) {
  if (!sauna) return null;

  return (
    <Dialog.Root open={open} onOpenChange={(e) => !e.open && onClose()} size="md" placement="center">
      <Portal>
        <Dialog.Backdrop />
        <Dialog.Positioner>
          <Dialog.Content>
            <Dialog.Header>
              <Dialog.Title>{sauna.name}</Dialog.Title>
              <Dialog.CloseTrigger asChild>
                <CloseButton size="sm" />
              </Dialog.CloseTrigger>
            </Dialog.Header>
            <Dialog.Body>
              <VStack align="stretch" gap="4">
                <Box>
                  <Text textStyle="sm" color="fg.muted" mb="1">
                    Address
                  </Text>
                  <Text>
                    {sauna.address}, {sauna.city}
                  </Text>
                </Box>
                <Box>
                  <Text textStyle="sm" color="fg.muted" mb="1">
                    Opening hours
                  </Text>
                  <Text>{sauna.openingHours}</Text>
                </Box>
                <Box>
                  <Text textStyle="sm" color="fg.muted" mb="1">
                    Temperature range
                  </Text>
                  <Text>{sauna.temperature}</Text>
                </Box>
                <Flex gap="4" flexWrap="wrap">
                  <Box>
                    <Text textStyle="sm" color="fg.muted" mb="1">
                      Current temperature
                    </Text>
                    <Text fontWeight="semibold">{sauna.currentTemperatureC} °C</Text>
                  </Box>
                  <Box>
                    <Text textStyle="sm" color="fg.muted" mb="1">
                      Current occupancy
                    </Text>
                    <Text fontWeight="semibold">{sauna.currentOccupancyRate}%</Text>
                  </Box>
                  <Box>
                    <Text textStyle="sm" color="fg.muted" mb="1">
                      Löylyä jäljellä
                    </Text>
                    <Text fontWeight="semibold">
                      {sauna.loylyMinutesRemaining === 0 ? "Closing" : `${sauna.loylyMinutesRemaining} min`}
                    </Text>
                  </Box>
                </Flex>
                <Flex gap="2" flexWrap="wrap">
                  <Badge colorPalette="green" size="sm">
                    Capacity: {sauna.capacity}
                  </Badge>
                  {sauna.hasSwimming && (
                    <Badge colorPalette="blue" size="sm">
                      Swimming
                    </Badge>
                  )}
                  {sauna.establishedYear && (
                    <Badge variant="subtle" size="sm">
                      Since {sauna.establishedYear}
                    </Badge>
                  )}
                </Flex>
                <Box>
                  <Text textStyle="sm" color="fg.muted" mb="1">
                    Description
                  </Text>
                  <Text>{sauna.description}</Text>
                </Box>
              </VStack>
            </Dialog.Body>
          </Dialog.Content>
        </Dialog.Positioner>
      </Portal>
    </Dialog.Root>
  );
}

export function SaunaPage() {
  const [selectedSauna, setSelectedSauna] = useState<Sauna | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);

  const handleSaunaSelect = useCallback((sauna: Sauna) => {
    setSelectedSauna(sauna);
    setDialogOpen(true);
  }, []);

  const handleDialogClose = useCallback(() => {
    setDialogOpen(false);
    setSelectedSauna(null);
  }, []);

  const cities = [...new Set(SAUNAS.map((s) => s.city))];
  const withSwimming = SAUNAS.filter((s) => s.hasSwimming).length;
  const avgOccupancy =
    SAUNAS.length > 0
      ? Math.round(SAUNAS.reduce((a, s) => a + s.currentOccupancyRate, 0) / SAUNAS.length)
      : 0;
  const avgTemp =
    SAUNAS.length > 0
      ? Math.round(SAUNAS.reduce((a, s) => a + s.currentTemperatureC, 0) / SAUNAS.length)
      : 0;

  return (
    <Box minH="100vh" bg="bg.subtle">
      <Box as="section" py={{ base: "6", md: "10" }} px={{ base: "4", md: "6" }} borderBottomWidth="1px" borderColor="border.muted">
        <Container maxW="6xl">
          <VStack gap="8" align="stretch">
            <Box>
              <Heading size="xl" fontWeight="bold" letterSpacing="tight" mb="2">
                Finnish public saunas
              </Heading>
              <Text color="fg.muted" fontSize="md">
                Explore public saunas across Finland. Click a pin on the map to see details.
              </Text>
            </Box>

            <SimpleGrid columns={{ base: 1, sm: 2, md: 3, lg: 6 }} gap="4">
              <Box
                p="4"
                borderRadius="lg"
                bg="bg.panel"
                borderWidth="1px"
                borderColor="border.muted"
                boxShadow="sm"
              >
                <Flex align="center" gap="3" mb="2">
                  <Box color="brand.solid">
                    <BuildingIcon boxSize="5" />
                  </Box>
                  <Text textStyle="2xl" fontWeight="bold" color="fg">
                    {SAUNAS.length}
                  </Text>
                </Flex>
                <Text textStyle="sm" color="fg.muted">
                  Public saunas
                </Text>
              </Box>
              <Box
                p="4"
                borderRadius="lg"
                bg="bg.panel"
                borderWidth="1px"
                borderColor="border.muted"
                boxShadow="sm"
              >
                <Flex align="center" gap="3" mb="2">
                  <Box color="brand.solid">
                    <MapPinIcon boxSize="5" />
                  </Box>
                  <Text textStyle="2xl" fontWeight="bold" color="fg">
                    {cities.length}
                  </Text>
                </Flex>
                <Text textStyle="sm" color="fg.muted">
                  Cities
                </Text>
              </Box>
              <Box
                p="4"
                borderRadius="lg"
                bg="bg.panel"
                borderWidth="1px"
                borderColor="border.muted"
                boxShadow="sm"
              >
                <Flex align="center" gap="3" mb="2">
                  <Box color="brand.solid">
                    <WavesIcon boxSize="5" />
                  </Box>
                  <Text textStyle="2xl" fontWeight="bold" color="fg">
                    {withSwimming}
                  </Text>
                </Flex>
                <Text textStyle="sm" color="fg.muted">
                  With swimming
                </Text>
              </Box>
              <Box
                p="4"
                borderRadius="lg"
                bg="bg.panel"
                borderWidth="1px"
                borderColor="border.muted"
                boxShadow="sm"
              >
                <Flex align="center" gap="3" mb="2">
                  <Box color="brand.solid">
                    <CalendarIcon boxSize="5" />
                  </Box>
                  <Text textStyle="2xl" fontWeight="bold" color="fg">
                    {SAUNAS.filter((s) => s.establishedYear && s.establishedYear < 1950).length}
                  </Text>
                </Flex>
                <Text textStyle="sm" color="fg.muted">
                  Historic (pre-1950)
                </Text>
              </Box>
              <Box
                p="4"
                borderRadius="lg"
                bg="bg.panel"
                borderWidth="1px"
                borderColor="border.muted"
                boxShadow="sm"
              >
                <Flex align="center" gap="3" mb="2">
                  <Box color="brand.solid">
                    <UsersIcon boxSize="5" />
                  </Box>
                  <Text textStyle="2xl" fontWeight="bold" color="fg">
                    {avgOccupancy}%
                  </Text>
                </Flex>
                <Text textStyle="sm" color="fg.muted">
                  Avg. occupancy now
                </Text>
              </Box>
              <Box
                p="4"
                borderRadius="lg"
                bg="bg.panel"
                borderWidth="1px"
                borderColor="border.muted"
                boxShadow="sm"
              >
                <Flex align="center" gap="3" mb="2">
                  <Box color="brand.solid">
                    <ThermometerIcon boxSize="5" />
                  </Box>
                  <Text textStyle="2xl" fontWeight="bold" color="fg">
                    {avgTemp} °C
                  </Text>
                </Flex>
                <Text textStyle="sm" color="fg.muted">
                  Avg. temperature now
                </Text>
              </Box>
            </SimpleGrid>

            <Box>
              <Heading size="md" fontWeight="semibold" mb="3">
                Current status
              </Heading>
              <Table.ScrollArea overflow="auto" maxW="100%">
                <Box
                  borderRadius="lg"
                  borderWidth="1px"
                  borderColor="border.muted"
                  bg="bg.panel"
                  overflow="hidden"
                  minW={{ base: "600px", md: "auto" }}
                >
                <Table.Root size="sm">
                  <Table.Header>
                    <Table.Row>
                      <Table.ColumnHeader>Sauna</Table.ColumnHeader>
                      <Table.ColumnHeader>City</Table.ColumnHeader>
                      <Table.ColumnHeader textAlign="end">Occupancy</Table.ColumnHeader>
                      <Table.ColumnHeader textAlign="end">Temperature</Table.ColumnHeader>
                      <Table.ColumnHeader textAlign="end">Löylyä jäljellä</Table.ColumnHeader>
                    </Table.Row>
                  </Table.Header>
                  <Table.Body>
                    {SAUNAS.map((sauna) => (
                      <Table.Row
                        key={sauna.id}
                        cursor="pointer"
                        _hover={{ bg: "bg.muted" }}
                        onClick={() => handleSaunaSelect(sauna)}
                      >
                        <Table.Cell fontWeight="medium">{sauna.name}</Table.Cell>
                        <Table.Cell color="fg.muted">{sauna.city}</Table.Cell>
                        <Table.Cell textAlign="end">
                          <Badge
                            colorPalette={sauna.currentOccupancyRate > 80 ? "orange" : sauna.currentOccupancyRate > 50 ? "green" : "gray"}
                            size="sm"
                          >
                            {sauna.currentOccupancyRate}%
                          </Badge>
                        </Table.Cell>
                        <Table.Cell textAlign="end">{sauna.currentTemperatureC} °C</Table.Cell>
                        <Table.Cell textAlign="end">
                          {sauna.loylyMinutesRemaining === 0 ? "Closing" : `${sauna.loylyMinutesRemaining} min`}
                        </Table.Cell>
                      </Table.Row>
                    ))}
                  </Table.Body>
                </Table.Root>
                </Box>
              </Table.ScrollArea>
            </Box>

            <Box
              borderRadius="lg"
              overflow="hidden"
              borderWidth="1px"
              borderColor="border.muted"
              bg="bg.panel"
              boxShadow="sm"
              h="500px"
              minH="400px"
            >
              <SaunaMap onSaunaSelect={handleSaunaSelect} />
            </Box>
          </VStack>
        </Container>
      </Box>

      <SaunaDetailDialog sauna={selectedSauna} open={dialogOpen} onClose={handleDialogClose} />
    </Box>
  );
}
