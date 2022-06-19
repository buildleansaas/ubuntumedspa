import { Link, Text } from "@chakra-ui/react";
import * as React from "react";

export const Copyright = ({
  companyName,
  companyLink,
  colorScheme,
  ...props
}) => (
  <Text fontSize="sm" {...props} color="white">
    &copy; {new Date().getFullYear()} Ubuntu Med Spa. All rights reserved.
    Developed by{" "}
    <Link color={`${colorScheme}.500`} href={companyLink} isExternal>
      {companyName}
    </Link>
    .
  </Text>
);
