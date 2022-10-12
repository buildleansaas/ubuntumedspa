import NextLink from "next/link";
import {
  AspectRatio,
  Box,
  Image,
  Skeleton,
  Stack,
  Text,
  Button,
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
          {/* <Box
        opacity="0"
        transition="opacity 0.1s"
        _groupHover={{ opacity: 1 }}
        position="absolute"
        bottom="3"
        left="3"
        right="3"
        bg={useColorModeValue("white", "gray.800")}
        borderRadius="md"
        padding="1.5"
      >
        <ProductButtonGroup />
      </Box> */}
        </Box>
        <Stack spacing="1">
          <Text fontSize="xl" fontWeight={700}>
            {product.name}
          </Text>
          <Block value={product.description} />
        </Stack>
      </Stack>
    </NextLink>
  );
};
