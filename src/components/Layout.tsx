import { useState } from "react";
import {
  Box,
  CloseButton,
  Drawer,
  Flex,
  HStack,
  IconButton,
  Link as ChakraLink,
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

function NavLinks({
  locationPath,
  onNavigate,
  linkProps,
}: {
  locationPath: string;
  onNavigate?: () => void;
  linkProps?: (path: string, isActive: boolean) => Record<string, unknown>;
}) {
  const items = [...NAV_ITEMS];

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
      <Box
        position="absolute"
        left={{ base: "4", md: "6" }}
        top="4"
        zIndex={50}
        opacity={0}
        transform="translateY(-100%)"
        transition="opacity 0.2s, transform 0.2s"
        _focusWithin={{ opacity: 1, transform: "translateY(0)" }}
      >
        <ChakraLink
          href="#main-content"
          display="block"
          p="3"
          borderRadius="md"
          bg="bg.panel"
          color="fg"
          textStyle="sm"
          fontWeight="medium"
          borderWidth="1px"
          borderColor="border.muted"
          _focus={{ outline: "2px solid", outlineColor: "border.emphasized", outlineOffset: "2px" }}
        >
          Siirry pääsisältöön
        </ChakraLink>
      </Box>

      <Box as="header" borderBottomWidth="1px" borderColor="border.muted" px={{ base: "4", md: "6" }} py="4" flexShrink={0}>
        <Flex align="center" justify="space-between" maxW="6xl" mx="auto">
          <Link to="/" style={{ textDecoration: "none" }} aria-label="Etusivu - GDS Demo">
            <Text fontWeight="semibold" textStyle="lg" color="fg" lineClamp={1}>
              GDS Demo (external)
            </Text>
          </Link>

          {/* Desktop nav: visible from md up */}
          <HStack as="nav" gap="6" display={{ base: "none", md: "flex" }} aria-label="Päävalikko">
            <NavLinks locationPath={location.pathname} />
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
