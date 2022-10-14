import React from "react";
import { withRouter } from "next/router";
import {
  Box,
  Flex,
  Heading,
  Text,
  useColorModeValue as mode,
  Accordion,
  AccordionItem,
  AccordionButton,
  AccordionIcon,
  AccordionPanel,
} from "@chakra-ui/react";

import sanity, { urlFor } from "lib/fe/sanity";
import { getPostBySlug } from "queries/blog";

import Layout from "components/Layout";
import Block from "components/Block";
import ShareIcons from "components/ShareIcons";

import { BlogMedia } from "components/BlogMedia";
import { BlogMeta } from "components/BlogMeta";
import { BlogAuthor } from "components/BlogAuthor";
import { Product } from "components/Product";

function Post({ post, asPath }) {
  const {
    title = "Missing title",
    description,
    type,
    author,
    categories,
    mainImage,
    body = [],
    slug,
    products,
  } = post;

  const bg = mode("gray.50", "inherit");
  const text = mode("gray.600", "gray.400");

  return (
    <Layout
      id={`blog/${slug.current}`}
      title={`VA Central Blog | ${title}`}
      description={description}
    >
      <Box as="section" bg={bg} py="32">
        <Box
          maxW={{ base: "xl", md: "7xl" }}
          mx="auto"
          px={{ base: "6", md: "8" }}
        >
          <BlogMedia alt={description} src={urlFor(mainImage).url()} />
          <Box mt={8}>
            <Flex direction="column" h="full" mb={12}>
              <Box>
                <Box flex="1">
                  <BlogMeta type={type} categories={categories} />
                  <Heading size="xl" mt="6" mb="4">
                    {title}
                  </Heading>
                  <Text fontSize="lg" color={text} lineHeight="tall">
                    {description}
                  </Text>
                </Box>
                <BlogAuthor
                  mt="8"
                  name={author?.name}
                  image={urlFor(author?.image).url()}
                  role={author?.title}
                  slug={author?.slug}
                />
              </Box>

              {products?.length > 0 && (
                <Accordion allowToggle defaultIndex={0} mt={12}>
                  <AccordionItem>
                    <h2>
                      <AccordionButton
                        _expanded={{ color: "white", bg: "tomato" }}
                      >
                        <Box flex="1" textAlign="left">
                          Related Products
                        </Box>
                        <AccordionIcon />
                      </AccordionButton>
                    </h2>
                    <AccordionPanel
                      display="flex"
                      alignItems="flex-start"
                      justifyContent="flex-start"
                      flexDir="column"
                    >
                      <Box>
                        {products.map((product) => (
                          <Product key={product?.id} {...product} micro />
                        ))}
                      </Box>
                    </AccordionPanel>
                  </AccordionItem>
                </Accordion>
              )}
            </Flex>
            <Box className="block-content">
              <Block content={body} />
            </Box>
          </Box>

          <ShareIcons
            path={asPath}
            title={title}
            description={description}
            caption={description}
            media={urlFor(mainImage).url()}
            image={urlFor(mainImage).url()}
            subject={`Check out this article, ${title}, from highvib.es`}
            body="I found this pretty useful and wanted to share it with you!"
            tags={categories}
            quote={description}
          />
        </Box>
      </Box>
    </Layout>
  );
}

export const getServerSideProps = async ({ query, req: { url }, ...props }) => {
  const { slug = "" } = query;
  const post = await sanity.fetch(getPostBySlug, { slug });

  const {
    title = "",
    description = "",
    mainImage,
    author = {
      name: "",
    },
    publishedAt = "",
    categories,
  } = post;
  const nameSplit = author?.name?.split();
  post.slug = slug;
  return {
    props: {
      post,
      //   seo: {
      //     title: `${title} - VACentral Blog`,
      //     description,
      //     openGraph: {
      //       url: `https://vacentral.es${url}`,
      //       title,
      //       description,
      //       images: [
      //         {
      //           url: urlFor(mainImage).height(800).width(800).url(),
      //           width: 800,
      //           height: 800,
      //           alt: description,
      //         },
      //       ],
      //       profile: {
      //         username: `${nameSplit?.[0]}${nameSplit?.[1]}`,
      //       },
      //       article: {
      //         publishedTime: publishedAt,
      //         authors: [author?.name],
      //         tags: categories,
      //       },
      //     },
      //   },
    },
  };
};

export default withRouter(Post);
