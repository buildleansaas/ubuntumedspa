import Link from "next/link";

import DateTag from "components/date-tag";
import { getPublishedBlogPosts } from "lib/blog";
import { humanizeMedicalCopy } from "lib/humanize";

// Tidewater: same heading, intro and six latest posts, as quiet text links (no images or tag chips).
export default async function LatestPosts() {
  const articles = (await getPublishedBlogPosts()).slice(0, 6);

  return (
    <section className="w-full scroll-mt-28 py-16 md:py-24" aria-labelledby="latest-posts-heading">
      <div className="flex flex-col gap-5 md:flex-row md:items-end md:justify-between">
        <div className="max-w-3xl">
          <p className="text-sm text-base-content/65">Latest Guidance</p>
          <h2
            id="latest-posts-heading"
            className="font-display mt-3 text-3xl leading-tight tracking-tight text-base-content text-balance md:text-[2.6rem]"
          >
            Williamsburg Med Spa Blog
          </h2>
        </div>
        <Link
          href="/blog"
          className="self-start rounded-sm text-[0.95rem] text-secondary underline decoration-secondary/30 underline-offset-[6px] transition-colors hover:decoration-secondary md:self-auto"
        >
          View all articles
        </Link>
      </div>
      <p className="mt-5 max-w-[68ch] text-base leading-relaxed text-base-content/75">
        Read straightforward guidance on Xeomin (and how it compares with Botox), PRP treatments, hyperhidrosis care, and
        medical ear piercing from Williamsburg Med Spa. These articles are written to help you compare options,
        understand candidacy, and decide what to ask during consultation.
      </p>
      <ul className="mt-10 grid gap-x-12 border-t border-base-300 md:grid-cols-2 xl:grid-cols-3">
        {articles.map((article) => (
          <li key={article.routeSlug} className="border-b border-base-300 py-6">
            <DateTag date={article.date} className="border-0 bg-transparent px-0 py-0 text-xs font-normal text-base-content/55" />
            <h3 className="font-display mt-2 text-xl leading-snug text-base-content">
              <Link href={article.href} className="rounded-sm transition-colors hover:text-secondary">
                {article.title}
              </Link>
            </h3>
            <p className="mt-2 text-sm leading-relaxed text-base-content/65">{humanizeMedicalCopy(article.description)}</p>
          </li>
        ))}
      </ul>
    </section>
  );
}
