import React from "react";
import {
  BoxProps,
  Img,
  Box,
  Button,
  Heading,
  Text,
  useBreakpointValue,
  useDisclosure,
  HStack,
  VStack,
  Accordion,
  AccordionItem,
  AccordionButton,
  AccordionPanel,
  AccordionIcon,
} from "@chakra-ui/react";

import { imageBuilder } from "sanity";
import { Link } from "react-scroll";

import { getProcedure } from "sanity/queries";

import Layout from "components/Layout";
import Block from "components/Block";
import BookConsultation from "components/BookConsultation";

interface BlogMediaProps extends BoxProps {
  src: string;
  alt: string;
  preview?: boolean;
}

export const BlogMedia = (props: BlogMediaProps) => {
  const { src, alt, ...rest } = props;
  return (
    <Box
      pos="relative"
      cursor="pointer"
      className="group"
      h="400px"
      overflow="hidden"
      {...rest}
    >
      <Img
        w="full"
        h="full"
        objectFit="cover"
        htmlWidth="672"
        htmlHeight="448"
        src={src}
        alt={alt}
        transition="all 0.2s"
        _groupHover={{ transform: "scale(1.05)" }}
      />
    </Box>
  );
};

export default function Landing({ procedure }) {
  const image = imageBuilder(procedure.image).url();
  const { isOpen, onOpen, onClose } = useDisclosure();

  const header = useBreakpointValue({ base: "md", md: "lg", lg: "xl" });
  const sectionHeader = useBreakpointValue({ base: "md", md: "lg" });
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
      title: "Ubuntu Med Spa | Vampire Breast Lift",
      description: "Ubuntu Med Spa provides ",
      imageUrl: "",
    },
    // loading,
    loading: false,
    fullWidth: true,
  };

  const ButtonContainer = isDesktop ? HStack : VStack;

  const ELEMENTS_TOTAL = 3;

  const NO_EXPANDED = Boolean(
    Object.keys(procedure?.expanded ?? {})?.length !== 0
  );
  const NO_QNA = Boolean(procedure?.questionsAndAnswers?.length);

  return (
    <Layout
      {...{
        ...layoutProps,
        fullWidth: true,
        children: (
          <>
            <Box
              maxW={{ base: "xl", md: "7xl" }}
              mx="auto"
              px={{ base: "6", md: "8" }}
              zIndex={1}
            >
              <BlogMedia src="/yt-thumb.png" alt={procedure.name} mb={6} />
              <Box textAlign="center" id="procedures">
                <Heading
                  as="h2"
                  size={header}
                  fontWeight="bold"
                  mx="auto"
                  lineHeight="1.2"
                  letterSpacing="tight"
                >
                  {procedure.name}
                </Heading>
                <Block value={procedure.description} />

                <Box mt={8}>
                  <ButtonContainer spacing={4} justify="center">
                    <Button colorScheme="blue" onClick={onOpen} size="lg">
                      Book a Consultation
                    </Button>
                  </ButtonContainer>
                </Box>

                {NO_EXPANDED && (
                  <>
                    <Heading
                      mt={16}
                      as="h2"
                      size={sectionHeader}
                      fontWeight="bold"
                      mx="auto"
                      lineHeight="1.2"
                      letterSpacing="tight"
                    >
                      More about the {procedure.name}
                    </Heading>
                    <Block
                      value={procedure.expanded}
                      maxW={900}
                      textAlign="left"
                    />
                  </>
                )}

                {NO_QNA ? (
                  <>
                    <Heading
                      mt={16}
                      as="h2"
                      size={sectionHeader}
                      fontWeight="bold"
                      mx="auto"
                      lineHeight="1.2"
                      letterSpacing="tight"
                    >
                      Common Questions and Answers about the {procedure.name}
                    </Heading>
                    <Accordion
                      mt={8}
                      borderTopColor="transparent"
                      borderBottomColor="transparent"
                      maxWidth={900}
                    >
                      {procedure.questionsAndAnswers.map(
                        ({ question, answer }, i) => (
                          <AccordionItem key={i}>
                            <h2>
                              <AccordionButton>
                                <Box flex="1" textAlign="left">
                                  <Text fontSize={20} fontWeight={500}>
                                    {question}
                                  </Text>
                                </Box>
                                <AccordionIcon />
                              </AccordionButton>
                            </h2>
                            <AccordionPanel>
                              <Block
                                value={answer}
                                fontSize={16}
                                textAlign="left"
                              />
                            </AccordionPanel>
                          </AccordionItem>
                        )
                      )}
                    </Accordion>
                  </>
                ) : (
                  <></>
                )}
                <Heading
                  mt={16}
                  as="h2"
                  size={sectionHeader}
                  fontWeight="bold"
                  mx="auto"
                  lineHeight="1.2"
                  letterSpacing="tight"
                >
                  Ready to get started?
                </Heading>
                <Box mt={8}>
                  <ButtonContainer spacing={4} justify="center">
                    <Button colorScheme="blue" onClick={onOpen} size="lg">
                      Book a Consultation
                    </Button>
                  </ButtonContainer>
                </Box>
              </Box>
            </Box>

            <BookConsultation isOpen={isOpen} onClose={onClose} />
          </>
        ),
      }}
    />
  );
}

export const getServerSideProps = async ({ res, query: { slug = "" } }) => {
  res.setHeader(
    "Cache-Control",
    "public, s-maxage=10, stale-while-revalidate=59"
  );

  const procedure = await getProcedure(slug);

  return {
    props: {
      procedure,
    },
  };
};
