import Link from "next/link";

import BlogPostCollection from "components/blog-post-collection";
import { getPublishedBlogPosts } from "lib/blog";

export default async function LatestPosts() {
  const articles = (await getPublishedBlogPosts()).slice(0, 6);

  return (
    <section className="scroll-mt-28 border-t border-base-300 py-16 md:py-24" aria-labelledby="latest-posts-heading">
      <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
        <div className="max-w-3xl">
          <p className="text-xs font-medium uppercase tracking-[0.22em] text-base-content/80">Latest Guidance</p>
          <h2
            id="latest-posts-heading"
            className="font-display mt-3 text-4xl font-medium leading-[1.12] tracking-tight text-base-content text-balance md:text-5xl"
          >
            Williamsburg Med Spa Blog
          </h2>
        </div>
        <Link
          href="/blog"
          className="self-start border border-base-300 px-4 py-2.5 text-sm font-medium text-base-content transition-colors hover:border-primary/40 hover:text-primary focus:outline-none focus-visible:ring-2 focus-visible:ring-primary/40 focus-visible:ring-offset-2 focus-visible:ring-offset-base-100 md:self-auto"
        >
          View all articles
        </Link>
      </div>
      <p className="mt-5 max-w-[68ch] text-base leading-relaxed text-base-content/80 md:text-lg">
        Read straightforward guidance on Botox, Xeomin, dermal fillers, PRP treatments, hyperhidrosis care, and
        medical ear piercing from Williamsburg Med Spa. These articles are written to help you compare options,
        understand candidacy, and decide what to ask during consultation.
      </p>
      <BlogPostCollection articles={articles} tone="editorial" />
    </section>
  );
}
