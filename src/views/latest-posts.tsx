import Link from "next/link";

import BlogPostCollection from "components/blog-post-collection";
import { AFTER_HEADER, BUTTON_ROW, Section, SectionHeader } from "components/layout";
import { Button } from "components/ui/button";
import { getPublishedBlogPosts } from "lib/blog";

export default async function LatestPosts() {
  const articles = (await getPublishedBlogPosts()).slice(0, 6);

  return (
    <Section labelledBy="latest-posts-heading">
      <SectionHeader
        id="latest-posts-heading"
        eyebrow="Latest Guidance"
        title="Williamsburg Med Spa Blog"
        intro={
          <>
            Read straightforward guidance on Xeomin (and how it compares with Botox), PRP treatments, hyperhidrosis care, and
            medical ear piercing from Williamsburg Med Spa. These articles are written to help you compare options,
            understand candidacy, and decide what to ask during consultation.
          </>
        }
      />
      <BlogPostCollection articles={articles} tone="editorial" className={AFTER_HEADER} />
      <div className={`${AFTER_HEADER} ${BUTTON_ROW}`}>
        <Button asChild variant="secondary" size="lg" className="w-full sm:w-auto">
          <Link href="/blog">View all articles</Link>
        </Button>
      </div>
    </Section>
  );
}
