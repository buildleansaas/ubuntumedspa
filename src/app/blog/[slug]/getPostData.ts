export const getPostData = async ({ slug }: { slug: string }) => {
  const { default: Content, metadata } = await import(`markdown/${slug}.mdx`);
  return { Content, metadata };
};
