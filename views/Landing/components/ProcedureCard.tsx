import NextLink from "next/link";
import {
  AspectRatio,
  Box,
  Image,
  Skeleton,
  Stack,
  Text,
  Button,
  useColorModeValue,
  ButtonGroup,
} from "@chakra-ui/react";
import * as React from "react";
import Block from "components/Block";

import { imageBuilder } from "sanity";

interface Props {
  product: {
    name: string;
    description: [];
    image: object;
    slug: {
      current: string;
    };
  };
}

export const ProcedureCard = ({ product }: Props) => {
  return (
    <NextLink href={`/procedures/${product.slug.current}`} passHref>
      <Stack
        spacing="3"
        _hover={{
          cursor: "pointer",
        }}
      >
        <Box position="relative" className="group">
          <AspectRatio ratio={1}>
            <Image
              src={imageBuilder(product.image).width(500).height(500).url()}
              alt={product.name}
              draggable="false"
              fallback={<Skeleton />}
            />
          </AspectRatio>
        </Box>
        <Stack spacing="1">
          <Text fontSize="xl" fontWeight={700}>
            {product.name}
          </Text>
          <Block value={product.description} />
        </Stack>
        <ButtonGroup>
          <Button colorScheme="blue">Schedule</Button>
          <Button colorScheme="whiteAlpha">Learn</Button>
        </ButtonGroup>
      </Stack>
    </NextLink>
  );
};
