import * as React from "react";
import {
  Box,
  Button,
  ButtonGroup,
  Flex,
  HStack,
  IconButton,
  Text,
  useBreakpointValue,
  useDisclosure,
  VStack,
  Image,
  Divider,
} from "@chakra-ui/react";
import NextLink from "next/link";
import { AiFillFacebook, AiFillInstagram, AiFillMessage } from "react-icons/ai";

import Dialog from "components/Dialog";
import Footer from "./Footer";

const AppHeader = ({
  onClose,
  sharedProductName,
  sharedProductSlogan,
  color = "white",
}) => {
  return (
    <NextLink href="/" passHref>
      <Box
        display="flex"
        alignItems="center"
        justifyContent="flex-start"
        onClick={onClose}
      >
        <Image width={50} height={50} src="/ubuntu.png" />
        <Box
          display={{ base: "flex" }}
          flexDir="column"
          alignItems={{ base: "flex-start" }}
          justifyContent={{ base: "center" }}
          ml={{ base: 2 }}
          mt={{ base: 0 }}
          onClick={onClose}
        >
          <Text
            fontSize={{ base: 20, md: 24 }}
            letterSpacing="tight"
            color={color}
            fontWeight={700}
          >
            {sharedProductName}
          </Text>
          <Text
            mt={{ base: 0, lg: -1.5 }}
            fontSize={{ base: 14, md: 16 }}
            fontWeight={300}
            letterSpacing="tight"
            color={color}
          >
            {sharedProductSlogan}
          </Text>
        </Box>
      </Box>
    </NextLink>
  );
};

const NavButton = ({
  id,
  onClose,
  name,
  href,
  label,
  icon,
  isDesktop,
  ...rest
}) => (
  <NextLink href={href} passHref>
    <Button
      {...{
        onClick: onClose,
        leftIcon: <>{icon}</>,
        size: "sm",
        ...rest,
        colorScheme: isDesktop ? "whiteAlpha" : "blackAlpha",
        m: 2,
      }}
    >
      {label}
    </Button>
  </NextLink>
);

export default function Navbar({
  id,
  colorScheme = "teal",
  companyName = "Build Lean SaaS",
  companyLink = "https://buildleansaas.com",
  sharedProductName = "Ubuntu Med Spa",
  sharedProductSlogan = "Plasma Rich Platelet Health Therapy",
}) {
  const { isOpen, onOpen, onClose } = useDisclosure();

  const isDesktop = useBreakpointValue({ base: false, lg: true });
  const padding = useBreakpointValue({ base: 2, md: 4, lg: 6 });

  const appHeaderProps = {
    id,
    sharedProductName,
    sharedProductSlogan,
    onClose,
    isDesktop,
  };

  const navLinks = () =>
    [
      {
        id: "Facebook",
        onClose,
        name: "facebook",
        href: "https://facebook.com/ubuntumedspa",
        label: "Facebook",
        icon: <AiFillFacebook />,
      },
      {
        id: "Instagram",
        onClose,
        name: "instagram",
        href: "https://instagram.com/ubuntumedspa",
        label: "Instagram",
        icon: <AiFillInstagram />,
      },
      {
        id: "Newsletter",
        onClose,
        name: "newsletter",
        href: "https://instagram.com/ubuntumedspa",
        label: "Newsletter",
        icon: <AiFillMessage />,
      },
    ]
      .filter(Boolean)
      ?.map((props) => (
        <NavButton {...{ ...props, onClose, isDesktop, key: props.href }} />
      ));

  return (
    <Flex
      display="flex"
      alignItems="flex-start"
      justifyContent="space-between"
      width="100%"
      px={padding}
      pt={padding}
      zIndex={1}
    >
      <AppHeader {...appHeaderProps} />
      {isDesktop ? (
        <VStack align="end">
          <HStack pr={2} mb={3}>
            <ButtonGroup spacing="1" ml="auto" mr={2}>
              {navLinks()}
            </ButtonGroup>
            {/* {!isEmpty(user) ? (
              <IconButton
                icon={
                  <Avatar
                    fontSize={8}
                    boxSize="8"
                    name={user.name}
                    src={user.image}
                  />
                }
                onClick={signOut}
                variant="ghost"
              />
            ) : (
              <Button
                size="sm"
                aria-label="Signup"
                variant="ghost"
                leftIcon={<>👋</>}
                onClick={() => signIn()}
              >
                Signup
              </Button>
            )} */}
          </HStack>
        </VStack>
      ) : (
        <IconButton
          variant="ghost"
          icon={
            <svg viewBox="0 0 64 48" width="20" height="20">
              <rect fill="white" width="64" height="8"></rect>
              <rect fill="white" y="20" width="64" height="8"></rect>
              <rect fill="white" y="40" width="64" height="8"></rect>
            </svg>
          }
          aria-label="Open Menu"
          onClick={onOpen}
        />
      )}

      {!isDesktop && (
        <Dialog
          {...{
            title: <AppHeader {...{ ...appHeaderProps, color: "black" }} />,
            onClose,
            isOpen,
            onSave: false,
            children: (
              <VStack
                spacing={4}
                height="100%"
                width="100%"
                flexDir="column"
                align="center"
                justify="center"
              >
                <VStack spacing={3} width="100%">
                  {navLinks()}
                </VStack>
                <Divider my={2} />
                <Footer
                  {...{
                    companyName,
                    companyLink,
                    colorScheme,
                    isDesktop,
                  }}
                />
              </VStack>
            ),
          }}
        />
      )}
    </Flex>
  );
}
