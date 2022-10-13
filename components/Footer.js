import React from "react";
import { Box, useBreakpointValue } from "@chakra-ui/react";
import { Copyright } from "./Copyright";

export default function Footer({ companyName, companyLink, colorScheme }) {
  const footerMarginTop = useBreakpointValue({ base: 8, sm: 12, md: 16 });
  return (
    <Box
      as="footer"
      width="100%"
      role="contentinfo"
      mx="auto"
      mt={footerMarginTop}
      mb={4}
      zIndex={1}
    >
      <Copyright
        colorScheme={colorScheme}
        companyName={companyName}
        companyLink={companyLink}
        textAlign="center"
        mb={2}
        isDesktop
      />
    </Box>
  );
}
