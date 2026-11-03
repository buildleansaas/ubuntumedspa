import type { Metadata } from "next";
import BlogPostCollection from "components/blog-post-collection";
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
    <div className="mx-auto max-w-6xl px-6 md:px-8">
      <StructuredData type="Breadcrumb" breadCrumbs={["Home", "Blog"]} />
      <header className="max-w-3xl py-14 text-left md:py-20">
        <p className="eyebrow">Treatment Education</p>
        <h1 className="mt-4 text-4xl leading-[1.08] tracking-tight text-balance text-base-content sm:text-5xl md:text-6xl">
          Williamsburg Med Spa Blog
        </h1>
        <p className="mt-5 max-w-[62ch] text-base leading-relaxed text-base-content/85 md:text-lg">
          Newest treatment guides, planning notes, and local med spa education from Williamsburg Med Spa.
        </p>
      </header>
      <BlogPostCollection articles={articles} featuredFirst tone="editorial" />
      <CtaFooter />
    </div>
  );
}
