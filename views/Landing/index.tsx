import * as React from "react";
import {
  Box,
  Button,
  ButtonGroup,
  Heading,
  Text,
  useBreakpointValue,
  useDisclosure,
  SimpleGrid,
} from "@chakra-ui/react";

import Layout from "./components/Layout";
import { ProcedureCard } from "./components/ProcedureCard";
import Dialog from "components/Dialog";
import BookConsultation from "components/BookConsultation";

export default function Landing({ procedures }) {
  const { isOpen, onOpen, onClose } = useDisclosure();

  const headingSize = useBreakpointValue({ base: "xl", md: "2xl", lg: "3xl" });
  const subHeadingFontSize = useBreakpointValue({ base: "xl", lg: "3xl" });

  const innerPaddingTop = useBreakpointValue({
    base: 16,
    sm: "160px",
    md: "260px",
    lg: "360px",
  });

  const layoutProps = {
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
    companyName: "Build Lean SaaS",
    companyLink: "https://buildleansaas.com",
    sharedProductName: "Ubuntu Med Spa",
    sharedProductSlogan: "Holistic Regenerative Health and Wellness",
    seo: {
      title: "Ubuntu Med Spa | Regenerative Holistic Health Spa",
      description: "Experience Vampire Procedures using Your Own Blood",
      imageUrl: "",
    },
    // loading,
    loading: false,
    fullWidth: true,
  };

  return (
    <Layout
      {...{
        ...layoutProps,
        children: (
          <>
            <Box
              maxW={{ base: "xl", md: "7xl" }}
              mx="auto"
              px={{ base: "6", md: "8" }}
              zIndex={1}
            >
              <Box textAlign="center" pt={innerPaddingTop} id="procedures">
                <Heading
                  as="h1"
                  size={headingSize}
                  fontWeight="bold"
                  mx="auto"
                  lineHeight="1.2"
                  letterSpacing="tight"
                  pb={4}
                >
                  Rejuvinate Your Life
                </Heading>
                <Text
                  fontSize={subHeadingFontSize}
                  mb={16}
                  maxW="2xl"
                  mx="auto"
                >
                  Experience the amazing effects of{" "}
                  <strong>Vampire Procedures</strong> using{" "}
                  <strong>Your Own Blood</strong> to enjoy{" "}
                  <strong>Natural Healing</strong>, for <strong>Joints</strong>,{" "}
                  <strong>Aesthetics</strong>, <strong>Sexual Health</strong>{" "}
                  and overall <strong>Wellness</strong>.
                </Text>
                <Box mb={16}>
                  <Button colorScheme="blue" onClick={onOpen}>
                    Book a Consultation
                  </Button>
                  <Text fontSize="14px" mt={2} color="gray.400">
                    or explore our procedures below!
                  </Text>
                </Box>
              </Box>

              <SimpleGrid
                columns={{ base: 1, sm: 2, md: 3, lg: 4 }}
                gap={{ base: "8", lg: "10" }}
              >
                {procedures.map((procedure, i) => (
                  <ProcedureCard key={i} product={procedure} />
                ))}
              </SimpleGrid>
            </Box>
            <BookConsultation isOpen={isOpen} onClose={onClose} />
          </>
        ),
      }}
    />
  );
}
