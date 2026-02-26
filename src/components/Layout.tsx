import { useState } from "react";
import {
  Box,
  Button,
  CloseButton,
  Drawer,
  Flex,
  HStack,
  IconButton,
  Link as ChakraLink,
  Menu,
  Portal,
  Text,
  VStack,
} from "@chakra-ui/react";
import { Link, Outlet, useLocation } from "react-router-dom";
import { MenuIcon } from "@gdesignsystem/icons";

const NAV_ITEMS = [
  { path: "/sauna", label: "Sauna" },
  { path: "/theme", label: "Theme" },
  { path: "/study", label: "Study" },
  { path: "/summary", label: "Summary" },
] as const;

const LUMON_ITEMS = [
  { path: "/lumon", label: "Lumon" },
  { path: "/lumon/2", label: "Lumon 2" },
] as const;

function NavLinks({
  locationPath,
  onNavigate,
  includeLumon,
  linkProps,
}: {
  locationPath: string;
  onNavigate?: () => void;
  includeLumon: boolean;
  linkProps?: (path: string, isActive: boolean) => Record<string, unknown>;
}) {
  const items = includeLumon ? [...NAV_ITEMS, ...LUMON_ITEMS] : [...NAV_ITEMS];

  return (
    <>
      {items.map(({ path, label }) => {
        const active = locationPath === path;
        return (
          <Link
            key={path}
            to={path}
            style={{ textDecoration: "none" }}
            onClick={onNavigate}
          >
            <Text
              textStyle="sm"
              color={active ? "fg" : "fg.muted"}
              fontWeight={active ? "semibold" : "normal"}
              py="2"
              px={linkProps ? 3 : 0}
              borderRadius="md"
              _hover={{ color: "fg", bg: linkProps ? "bg.muted" : undefined }}
              {...(linkProps?.(path, active) ?? {})}
            >
              {label}
            </Text>
          </Link>
        );
      })}
    </>
  );
}

export function Layout() {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const location = useLocation();

  return (
    <Box display="flex" flexDirection="column" minH="100vh">
      {/* WCAG 2.4.1 Bypass Blocks: skip link, näkyy vain fokuksessa */}
      <ChakraLink
        href="#main-content"
        position="absolute"
        left={{ base: "4", md: "6" }}
        top="4"
        zIndex={50}
        p="3"
        borderRadius="md"
        bg="bg.panel"
        color="fg"
        textStyle="sm"
        fontWeight="medium"
        borderWidth="1px"
        borderColor="border.muted"
        _focus={{ outline: "2px solid", outlineColor: "border.emphasized", outlineOffset: "2px" }}
        _focusVisible={{ opacity: 1 }}
        opacity={0}
        transform="translateY(-100%)"
        transition="opacity 0.2s, transform 0.2s"
        sx={{ "&:focus": { opacity: 1, transform: "translateY(0)" } }}
      >
        Siirry pääsisältöön
      </ChakraLink>

      <Box as="header" borderBottomWidth="1px" borderColor="border.muted" px={{ base: "4", md: "6" }} py="4" flexShrink={0}>
        <Flex align="center" justify="space-between" maxW="6xl" mx="auto">
          <Link to="/" style={{ textDecoration: "none" }} aria-label="Etusivu - GDS Demo">
            <Text fontWeight="semibold" textStyle="lg" color="fg" lineClamp={1}>
              GDS Demo (external)
            </Text>
          </Link>

          {/* Desktop nav: visible from md up */}
          <HStack as="nav" gap="6" display={{ base: "none", md: "flex" }} aria-label="Päävalikko">
            <NavLinks locationPath={location.pathname} includeLumon={false} />
            <Menu.Root positioning={{ placement: "bottom-start" }}>
              <Menu.Trigger asChild>
                <Button variant="ghost" size="sm" type="button" aria-haspopup="menu" fontWeight={location.pathname.startsWith("/lumon") ? "semibold" : "normal"} color={location.pathname.startsWith("/lumon") ? "fg" : "fg.muted"} _hover={{ color: "fg" }}>
                  Lumon
                </Button>
              </Menu.Trigger>
              <Portal>
                <Menu.Positioner>
                  <Menu.Content minW="40">
                    <Menu.Item value="lumon" asChild>
                      <Link to="/lumon" style={{ textDecoration: "none" }}>
                        Lumon
                      </Link>
                    </Menu.Item>
                    <Menu.Item value="lumon-2" asChild>
                      <Link to="/lumon/2" style={{ textDecoration: "none" }}>
                        Lumon 2
                      </Link>
                    </Menu.Item>
                  </Menu.Content>
                </Menu.Positioner>
              </Portal>
            </Menu.Root>
          </HStack>

          {/* Mobile: menu button that opens drawer */}
          <Drawer.Root
            open={drawerOpen}
            onOpenChange={(e) => setDrawerOpen(e.open)}
            placement="start"
            size="xs"
          >
            <Drawer.Trigger asChild>
              <IconButton
                aria-label="Open menu"
                variant="ghost"
                size="sm"
                colorPalette="gray"
                display={{ base: "inline-flex", md: "none" }}
              >
                <MenuIcon boxSize="5" />
              </IconButton>
            </Drawer.Trigger>
            <Portal>
              <Drawer.Backdrop />
              <Drawer.Positioner>
                <Drawer.Content>
                  <Drawer.Header>
                    <Drawer.Title>Menu</Drawer.Title>
                    <Drawer.CloseTrigger asChild>
                      <CloseButton size="sm" />
                    </Drawer.CloseTrigger>
                  </Drawer.Header>
                  <Drawer.Body pt="0">
                    <VStack align="stretch" gap="0">
                      <NavLinks
                        locationPath={location.pathname}
                        includeLumon={true}
                        onNavigate={() => setDrawerOpen(false)}
                        linkProps={() => ({ w: "full", textAlign: "start" })}
                      />
                    </VStack>
                  </Drawer.Body>
                </Drawer.Content>
              </Drawer.Positioner>
            </Portal>
          </Drawer.Root>
        </Flex>
      </Box>
      <Box as="main" id="main-content" flex="1" minH={0} tabIndex={-1}>
        <Outlet />
      </Box>
    </Box>
  );
}
