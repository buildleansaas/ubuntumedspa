import {
  Box,
  Button,
  Heading,
  LightMode,
  Stack,
  Text,
  useBreakpointValue,
  useDisclosure,
  SimpleGrid,
} from "@chakra-ui/react";
import * as React from "react";
import { Link } from "react-scroll";

import Layout from "./Layout";
import { ProductCard } from "./ProductCard";
import { products } from "./_data";
import Dialog from "./Dialog";

export default function Landing() {
  const colorScheme = "teal";

  const { isOpen, onOpen, onClose } = useDisclosure();

  const headingSize = useBreakpointValue({ base: "xl", md: "2xl", lg: "3xl" });
  const subHeadingFontSize = useBreakpointValue({ base: "xl", lg: "3xl" });

  const innerPaddingTop = useBreakpointValue({ base: 4, md: 16, lg: 24 });

  return (
    <Layout
      {...{
        id: "",
        colorScheme: "teal",
        // integrations
        tawkTo: {
          accountID: "62ae6340b0d10b6f3e781076",
          chatID: "1g5sj7dht",
        },
        google: {
          googleTagManagerId: "G-Q9LX7K1BRY",
        },
        facebook: {},
        // social
        socialLinks: [
          { href: "https://facebook.com/ubuntumedspa", title: "Facebook" },
          { href: "https://instagram.com/ubuntumedspa", title: "Instagram" },
        ],
        companyName: "Build Lean SaaS",
        companyLink: "https://buildleansaas.com",
        sharedProductName: "Ubuntu Med Spa",
        sharedProductSlogan: "Plasma Rich Platelet (Vampire) Health Therapy",
        seo: {
          title:
            "Ubuntu Med Spa | Platelet Rich Plasma (Vampire) Beauty and Health Therapy",
          description: "Experience Vampire Procedures using Your Own Blood",
          imageUrl: "",
        },
        // loading,
        loading: false,
        fullWidth: true,
        children: (
          <>
            <Box
              maxW={{ base: "xl", md: "7xl" }}
              mx="auto"
              px={{ base: "6", md: "8" }}
              zIndex={1}
            >
              <Box textAlign="center" pt={innerPaddingTop}>
                <Heading
                  as="h1"
                  size={headingSize}
                  fontWeight="bold"
                  mx="auto"
                  lineHeight="1.2"
                  letterSpacing="tight"
                >
                  Ubuntu Med Spa
                </Heading>
                <Text fontSize={subHeadingFontSize} mt="4" maxW="2xl" mx="auto">
                  Experience <strong>Vampire Procedures</strong> using{" "}
                  <strong>Your Own Blood</strong> to enjoy{" "}
                  <strong>Natural Healing</strong>, for <strong>Joints</strong>,{" "}
                  <strong>Aesthetics</strong>, <strong>Sexual Health</strong>{" "}
                  and <strong>Wellness</strong>.
                </Text>
              </Box>

              <Stack
                justify="center"
                direction={{ base: "column", md: "row" }}
                mt="20"
                mb="10"
                spacing="4"
              >
                <LightMode>
                  <Button
                    onClick={onOpen}
                    size="lg"
                    colorScheme={colorScheme}
                    px="8"
                    fontWeight="bold"
                    fontSize="md"
                  >
                    Schedule Consultation
                  </Button>
                  <Button
                    colorScheme="whiteAlpha"
                    px="8"
                    fontWeight="bold"
                    fontSize="md"
                    size="lg"
                    as={Link}
                    to="procedures"
                    spy={true}
                    smooth={true}
                    offset={-70}
                    duration={500}
                  >
                    Procedures
                  </Button>
                </LightMode>
              </Stack>
              <Box textAlign="center" pt={16} id="procedures">
                <Heading
                  as="h1"
                  size={headingSize}
                  fontWeight="bold"
                  mx="auto"
                  lineHeight="1.2"
                  letterSpacing="tight"
                  pb={16}
                >
                  Procedures
                </Heading>
              </Box>
              <SimpleGrid
                columns={{ base: 1, sm: 2, md: 3, lg: 4 }}
                gap={{ base: "8", lg: "10" }}
              >
                {products.map((product, i) => (
                  <ProductCard key={i} product={product} />
                ))}
              </SimpleGrid>
            </Box>
            <Dialog
              {...{
                onClose,
                isOpen,
                title: "Book Your Consultation",
                onSave: false,
              }}
            >
              <iframe
                className="airtable-embed"
                src="https://airtable.com/embed/shruMDzc8sgAUqjVk"
                width="100%"
                height="533"
              ></iframe>
            </Dialog>
          </>
        ),
      }}
    />
  );
}
