import {
  Box,
  Heading,
  SimpleGrid,
  Text,
  useColorModeValue as mode,
} from "@chakra-ui/react";

import sanity from "lib/fe/sanity";

import { getAllBlogPosts } from "queries/blog";

import Layout from "components/Layout";
import { BlogCard } from "components/BlogCard";

const BLOG_TITLE = "The VACentral Blog";
const BLOG_DESCRIPTION =
  "VA Central is a startup that specializes in creating effective home-based Virtual Assistants and Freelancers, help them develop their skills and provide Employment to aspiring businesses around the globe. Get Started with us Today.";

export const BlogPosts = ({ posts }) => {
  const subtitleText = mode("gray.600", "gray.400");
  return (
    <Layout title={BLOG_TITLE} description={BLOG_DESCRIPTION} id="Blog Page">
      <Box bg="gray.50" as="section" pt="48" pb="12">
        <Box
          maxW={{ base: "xl", md: "2xl", lg: "7xl" }}
          mx="auto"
          px={{ base: "6", md: "8" }}
        >
          <Box textAlign="center" maxW="lg" mx="auto">
            <Heading size="2xl" fontWeight="extrabold" letterSpacing="tight">
              From the blog
            </Heading>
            <Text mt="4" fontSize="lg" color={subtitleText}>
              Keep up to date with the latest trends in online entreprenurship,
              updates from VACentral, community events and more!
            </Text>
          </Box>
          <SimpleGrid mt="14" columns={{ base: 1, lg: 3 }} spacing="14">
            {posts?.map((item, index) => (
              <BlogCard preview key={index} data={item} />
            ))}
          </SimpleGrid>
        </Box>
      </Box>
    </Layout>
  );
};

export const getServerSideProps = async ({ asPath }) => ({
  props: {
    posts: await sanity.fetch(getAllBlogPosts),
  },
});

export default BlogPosts;
