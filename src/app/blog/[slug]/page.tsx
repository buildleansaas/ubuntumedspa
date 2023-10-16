import ArticleHeader from "components/article-header";
import { notFound } from "next/navigation";
import StructuredData from "components/structured-data";
import BlogCTA from "components/cta-footer";

const getPostData = async ({ slug }: { slug: string }) => {
  const { default: Content, metadata } = await import(`markdown/${slug}.mdx`);
  return { Content, metadata };
};

export const generateMetadata = async ({ params }: { params: { slug: string } }) => {
  try {
    const { metadata } = await getPostData(params);

    return {
      title: metadata.title,
      description: metadata.description,
      openGraph: {
        title: metadata.title,
        description: metadata.description,
      },
      twitter: {
        title: metadata.title,
        description: metadata.description,
      },
    };
  } catch {
    return {};
  }
};

export default async function ArticlePage({
  params,
}: {
  params: {
    slug: string;
  };
}) {
  try {
    const { Content, metadata } = await getPostData(params);

    return (
      <div className="mx-auto max-w-5xl text-base leading-7 text-white text-left">
        <StructuredData type="Article" {...{ ...metadata, headline: metadata.title }} />
        {metadata?.faqs && <StructuredData type="FAQ" {...{ ...metadata, headline: metadata.title }} />}
        <ArticleHeader metadata={metadata} />
        <BlogCTA />
        <Content />
        <BlogCTA />
      </div>
    );
  } catch (error: any) {
    notFound();
  }
}
