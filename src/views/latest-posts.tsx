import Link from "next/link";

import BlogPostCollection from "components/blog-post-collection";
import { getPublishedBlogPosts } from "lib/blog";

export default async function LatestPosts() {
  const articles = (await getPublishedBlogPosts()).slice(0, 6);

  return (
    <section className="mx-auto max-w-6xl px-6 md:px-0" aria-labelledby="latest-posts-heading">
      <div className="my-16 sm:my-24 lg:my-28">
        <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
          <div className="max-w-3xl">
            <p className="text-xs uppercase tracking-[0.22em] text-base-content/60">Latest Guidance</p>
            <h2
              id="latest-posts-heading"
              className="mt-3 text-4xl/snug sm:text-5xl/snug md:text-6xl/snug font-light tracking-tight text-base-content text-balance"
            >
              Williamsburg Med Spa Blog
            </h2>
          </div>
          <Link
            href="/blog"
            className="self-start rounded-md border border-base-300 px-4 py-2 text-sm font-medium text-base-content transition-colors hover:border-primary/40 hover:bg-base-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary/30 focus-visible:ring-offset-2 focus-visible:ring-offset-base-100 md:self-auto"
          >
            View all articles
          </Link>
        </div>
        <p className="mt-5 max-w-4xl text-base leading-relaxed text-base-content/70 md:text-lg">
          Read straightforward guidance on Botox, Xeomin, dermal fillers, PRP treatments, hyperhidrosis care, and
          medical ear piercing from Williamsburg Med Spa. These articles are written to help you compare options,
          understand candidacy, and decide what to ask during consultation.
        </p>
        <BlogPostCollection articles={articles} />
      </div>
    </section>
  );
}
