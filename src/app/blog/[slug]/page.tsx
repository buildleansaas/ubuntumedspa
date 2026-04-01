import ArticleHeader from "components/article-header";
import { notFound } from "next/navigation";
import StructuredData from "components/structured-data";
import BlogCTA from "components/cta-footer";
import { getPostData } from "./getPostData";
import { ORIGIN } from "lib/seo";

export const generateMetadata = async ({ params }: { params: { slug: string } }) => {
  try {
    const { metadata } = await getPostData(params.slug);
    const canonical = `/blog/${params.slug}`;
    const image = metadata?.image ?? "/opengraph-image";
    const imageUrl = image.startsWith("http://") || image.startsWith("https://") ? image : `${ORIGIN}${image}`;

    return {
      title: metadata.title,
      description: metadata.description,
      alternates: {
        canonical,
      },
      openGraph: {
        title: metadata.title,
        description: metadata.description,
        url: canonical,
        images: [
          {
            url: imageUrl,
            alt: metadata?.imageAlt ?? metadata.title,
          },
        ],
      },
      twitter: {
        card: "summary_large_image",
        title: metadata.title,
        description: metadata.description,
        images: [imageUrl],
      },
      robots: metadata.published ? undefined : { index: false, follow: false },
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
    const { Content, metadata } = await getPostData(params.slug);

    return (
      <div className="mx-auto max-w-5xl text-base leading-7 text-white text-left">
        <StructuredData
          type="Breadcrumb"
          breadcrumbItems={[
            { name: "Home", item: "https://www.williamsburgmedspa.com/" },
            { name: "Blog", item: "https://www.williamsburgmedspa.com/blog" },
            { name: metadata.title, item: `https://www.williamsburgmedspa.com/blog/${params.slug}` },
          ]}
        />
        <StructuredData
          type="Article"
          url={`/blog/${params.slug}`}
          headline={metadata.title}
          description={metadata.description}
          date={metadata.date}
          dateModified={metadata.dateModified ?? metadata.date}
          imageUrls={metadata?.image ? [metadata.image] : []}
        />
        {metadata?.faqs && <StructuredData type="FAQ" faqs={metadata.faqs} />}
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
