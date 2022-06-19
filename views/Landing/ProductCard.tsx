import {
  AspectRatio,
  Box,
  HStack,
  Image,
  Skeleton,
  Stack,
  Tag,
  Text,
  useColorModeValue,
} from "@chakra-ui/react";
import * as React from "react";
import { PriceTag } from "./PriceTag";
import { ProductButtonGroup } from "./ProductButtonGroup";
import { Product } from "./_data";

interface Props {
  product: Product;
}

export const ProductCard = (props: Props) => {
  const { product } = props;
  return (
    <Stack spacing="3">
      <Box position="relative" className="group">
        <AspectRatio ratio={1}>
          <Image
            src={product.imageUrl}
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
        <Text>{product.description}</Text>
      </Stack>
      <PriceTag
        currency={product.currency}
        price={product.price}
        priceProps={{
          fontWeight: "bold",
          fontSize: "sm",
          color: useColorModeValue("white", "white"),
        }}
      />
    </Stack>
  );
};
