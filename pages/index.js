import * as React from "react";
import {
  Box,
  Button,
  Heading,
  Text,
  useBreakpointValue,
  useDisclosure,
  SimpleGrid,
  HStack,
  VStack,
} from "@chakra-ui/react";

import { Link } from "react-scroll";

import { getProcedures } from "../sanity/queries";

import Layout from "components/Layout";
import { ProcedureCard } from "components/ProcedureCard";
import BookConsultation from "components/BookConsultation";

export default function Landing({ procedures }) {
  const { isOpen, onOpen, onClose } = useDisclosure();

  const header = useBreakpointValue({ base: "xl", md: "2xl", lg: "3xl" });
  const subHeader = useBreakpointValue({ base: "xl", lg: "2xl" });

  const sectionHeader = useBreakpointValue({
    base: "xl",
    md: "2xl",
  });
  const sectionSubHeader = useBreakpointValue({ base: "lg", lg: "xl" });

  const innerPaddingTop = useBreakpointValue({
    base: 16,
    sm: "160px",
    md: "260px",
    lg: "320px",
  });

  const isDesktop = useBreakpointValue({ base: false, lg: true });

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
    sharedProductSlogan: "Regenerative Health and Wellness",
    seo: {
      title: "Ubuntu Med Spa | Regenerative Holistic Health Spa",
      description: "Experience Vampire Procedures using Your Own Blood",
      imageUrl: "",
    },
    // loading,
    loading: false,
    fullWidth: true,
  };

  const ButtonContainer = isDesktop ? HStack : VStack;

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
                  as="h2"
                  size={header}
                  fontWeight="bold"
                  mx="auto"
                  lineHeight="1.2"
                  letterSpacing="tight"
                  pb={4}
                >
                  Rejuvinate Your Life
                </Heading>
                <Text fontSize={subHeader} mb={8} maxW="2xl" mx="auto">
                  Experience the amazing effects of{" "}
                  <strong>Vampire Procedures</strong> using{" "}
                  <strong>Your Own Blood</strong> to enjoy{" "}
                  <strong>Natural Healing</strong>, for <strong>Joints</strong>,{" "}
                  <strong>Aesthetics</strong>, <strong>Sexual Health</strong>{" "}
                  and overall <strong>Wellness</strong>.
                </Text>
                <Box mb={32}>
                  <ButtonContainer spacing={4} justify="center">
                    <Button colorScheme="blue" onClick={onOpen}>
                      Book a Consultation
                    </Button>
                    <Link
                      to="about"
                      spy={true}
                      smooth={true}
                      offset={-50}
                      duration={500}
                    >
                      <Button colorScheme="whiteAlpha">Our Procedures</Button>
                    </Link>
                  </ButtonContainer>
                </Box>
              </Box>

              <Box
                alignItems="center"
                justifyContent="center"
                mb={16}
                textAlign="center"
                id="about"
              >
                <Heading
                  as="h1"
                  size={sectionHeader}
                  fontWeight="bold"
                  mx="auto"
                  lineHeight="1.2"
                  letterSpacing="tight"
                  pb={4}
                >
                  Certified Procedures and Services
                </Heading>
                <Text fontSize={sectionSubHeader} mb={8} maxW="5xl" mx="auto">
                  Platelet Rich Plasma Injections, which are based on a
                  synthesis of your own blood, provokes radical healing by the
                  release of your own stem cells applicable to most of the human
                  body. This medical technology has been available to
                  professional athletes for years to treat sport injuries, and
                  now is available for wellness, restoration and aesthetic
                  procedures that you won't even realize are done with
                  complimentary Lidocane pre treatment.
                </Text>
              </Box>

              <SimpleGrid
                columns={{ base: 1, sm: 2, md: 3, lg: 4 }}
                gap={{ base: "8", lg: "10" }}
              >
                {procedures.map((procedure, i) => (
                  <ProcedureCard onClick={onOpen} key={i} product={procedure} />
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

export const getServerSideProps = async ({ res }) => {
  res.setHeader(
    "Cache-Control",
    "public, s-maxage=10, stale-while-revalidate=59"
  );

  const procedures = await getProcedures();

  return {
    props: {
      procedures,
    },
  };
};
