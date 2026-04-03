import type { Metadata } from "next";
import BlogPostCard from "components/blog-post-card";
import CtaFooter from "components/cta-footer";
import StructuredData from "components/structured-data";
import { getPublishedBlogPosts } from "lib/blog";
import { buildPageMetadata } from "lib/metadata";

export const metadata: Metadata = buildPageMetadata({
  title: "Williamsburg Med Spa Blog | PRP, Injectables, and Treatment Education",
  description:
    "Read treatment education from Williamsburg Med Spa, including PRP guidance, injectables, and planning resources for informed consultation decisions.",
  canonical: "/blog",
});

export default async function BlogPage() {
  const articles = await getPublishedBlogPosts();

  return (
    <div className="mx-auto max-w-2xl lg:max-w-4xl">
      <StructuredData type="Breadcrumb" breadCrumbs={["Home", "Blog"]} />
      <h1 className="sm:text-center text-4xl/snug sm:text-5xl/snug md:text-6xl/snug font-light tracking-tight text-base-content mb-16 sm:mb-24 lg:mb-32 text-balance">
        Williamsburg Med Spa Blog
      </h1>
      <div className="mt-16 space-y-20 lg:mt-20 lg:space-y-20">
        {articles.map((article) => <BlogPostCard key={article.slug} article={article} />)}
      </div>
      <CtaFooter />
    </div>
  );
}
