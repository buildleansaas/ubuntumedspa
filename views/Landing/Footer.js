import React from "react";
import { Box, useBreakpointValue } from "@chakra-ui/react";
import { Copyright } from "./Copyright";

export default function Footer({
  companyName,
  companyLink,
  colorScheme,
  isDesktop,
}) {
  const footerMarginTop = useBreakpointValue({ base: 4, sm: 6, md: 8 });
  return (
    <Box
      as="footer"
      width="100%"
      role="contentinfo"
      mx="auto"
      mt={footerMarginTop}
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
