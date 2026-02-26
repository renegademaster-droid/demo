import { Box, Button, Container, Heading, HStack, Text, VStack } from "@chakra-ui/react";
import { CheckIcon, ArrowRightIcon } from "@gdesignsystem/icons";

export function HomePage() {
  return (
    <Box
      as="section"
      py={{ base: "12", md: "20" }}
      px="6"
      bg="bg.subtle"
      borderBottomWidth="1px"
      borderColor="border.muted"
    >
      <Container maxW="4xl">
        <VStack gap="6" textAlign="center" maxW="2xl" mx="auto">
          <Heading size="2xl" fontWeight="bold" letterSpacing="tight">
            Build with the GDS design system
          </Heading>
          <Text color="fg.muted" fontSize="lg" lineHeight="tall">
            Use brand colors, semantic tokens, and Chakra UI components so your app stays consistent with Figma—whether you run it inside or outside the repo.
          </Text>
          <HStack gap="4" flexWrap="wrap" justify="center">
            <Button colorPalette="brand" size="lg">
              <CheckIcon /> Get started
            </Button>
            <Button variant="outline" size="lg">
              View docs <ArrowRightIcon />
            </Button>
          </HStack>
        </VStack>
      </Container>
    </Box>
  );
}
