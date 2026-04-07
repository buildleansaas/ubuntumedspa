import ArticleHeader from "components/article-header";
import { procedures } from "data";
import Link from "next/link";
import { notFound } from "next/navigation";
import StructuredData from "components/structured-data";
import BlogCTA from "components/cta-footer";
import { getPostData } from "./getPostData";
import { getPublishedBlogPosts } from "lib/blog";
import { ORIGIN } from "lib/seo";

const GENERIC_TAGS = new Set(["Williamsburg Med Spa"]);
const TAG_ALIASES: Record<string, string> = {
  "Dermal Fillers": "Filler",
  "Lip Filler": "Filler",
  "Cheek Filler": "Filler",
  "Under-Eye Filler": "Filler",
  "Ear Piercing": "Blohmdahl Ear Piercing",
  "Sensitive Skin": "Blohmdahl Ear Piercing",
  "First-Time Piercings": "Blohmdahl Ear Piercing",
  Hyperhidrosis: "Hyperhidrosis Treatment",
};

const normalizeTag = (tag: string) => TAG_ALIASES[tag] ?? tag;
const getMeaningfulTags = (tags: string[]) => tags.map(normalizeTag).filter((tag) => !GENERIC_TAGS.has(tag));

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
    const normalizedTags = new Set(getMeaningfulTags(metadata.tags));
    const relatedProcedures = procedures
      .filter((procedure) => normalizedTags.has(procedure.name))
      .filter((procedure) => !("published" in procedure) || procedure.published !== false)
      .slice(0, 3);
    const relatedArticles = (await getPublishedBlogPosts())
      .filter((article) => article.slug !== metadata.slug)
      .map((article) => ({
        article,
        score: getMeaningfulTags(article.tags).filter((tag) => normalizedTags.has(tag)).length,
      }))
      .filter(({ score }) => score > 0)
      .sort((a, b) => b.score - a.score || new Date(b.article.date).getTime() - new Date(a.article.date).getTime())
      .slice(0, 3)
      .map(({ article }) => article);

    return (
      <div className="mx-auto max-w-5xl text-left text-base text-base-content">
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
        <article className="mx-auto mt-12 w-full max-w-3xl">
          <Content />
        </article>
        {(relatedProcedures.length > 0 || relatedArticles.length > 0) && (
          <div className="mx-auto mt-16 w-full max-w-3xl border-t border-base-300 pt-10">
            {relatedProcedures.length > 0 && (
              <section aria-labelledby="related-treatments-heading">
                <p className="text-xs uppercase tracking-[0.18em] text-base-content/60">Related Treatments</p>
                <h2 id="related-treatments-heading" className="mt-3 text-2xl font-light tracking-tight text-base-content">
                  Keep this research tied to the treatment page.
                </h2>
                <p className="mt-3 max-w-2xl text-base leading-relaxed text-base-content/75">
                  If this topic lines up with what you are actually considering, these service pages are the most relevant next step.
                </p>
                <div className="mt-5 flex flex-wrap gap-x-6 gap-y-3">
                  {relatedProcedures.map((procedure) => {
                    const label = procedure.seo?.title?.split("|")[0].trim() || procedure.name;

                    return (
                      <Link
                        key={procedure.slug}
                        href={`/procedures/${procedure.slug}`}
                        className="text-base font-medium text-base-content underline-offset-4 hover:underline"
                      >
                        {label}
                      </Link>
                    );
                  })}
                </div>
              </section>
            )}

            {relatedArticles.length > 0 && (
              <section
                aria-labelledby="keep-reading-heading"
                className={relatedProcedures.length > 0 ? "mt-10 border-t border-base-300 pt-10" : undefined}
              >
                <p className="text-xs uppercase tracking-[0.18em] text-base-content/60">Keep Reading</p>
                <h2 id="keep-reading-heading" className="mt-3 text-2xl font-light tracking-tight text-base-content">
                  More articles in the same treatment cluster.
                </h2>
                <div className="mt-6 space-y-6">
                  {relatedArticles.map((article) => (
                    <div key={article.slug}>
                      <h3 className="text-lg font-medium text-base-content">
                        <Link href={`/blog/${article.slug}`} className="underline-offset-4 hover:underline">
                          {article.title}
                        </Link>
                      </h3>
                      <p className="mt-2 text-sm leading-6 text-base-content/70">{article.description}</p>
                    </div>
                  ))}
                </div>
              </section>
            )}
          </div>
        )}
        <BlogCTA />
      </div>
    );
  } catch (error: any) {
    notFound();
  }
}
