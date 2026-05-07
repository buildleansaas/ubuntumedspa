import BlogPostCard from "components/blog-post-card";
import { getPublishedBlogPosts } from "lib/blog";

export default async function LatestPosts() {
  const featuredSlugs = [
    "how-long-do-dermal-fillers-last-in-williamsburg-va",
    "dermal-fillers-in-williamsburg-va-lips-cheeks-under-eyes",
    "botox-vs-xeomin-williamsburg-va",
    "medical-ear-piercing-in-williamsburg-va-blomdahl",
    "hydrafacial-alternatives-in-williamsburg-va",
    "sculptra-alternatives-in-williamsburg-va",
  ];
  const publishedArticles = await getPublishedBlogPosts();
  const featuredArticles = featuredSlugs
    .map((slug) => publishedArticles.find((article) => article.slug === slug))
    .filter((article): article is NonNullable<typeof article> => Boolean(article));
  const featuredSlugSet = new Set(featuredArticles.map((article) => article.slug));
  const articles = [
    ...featuredArticles,
    ...publishedArticles.filter((article) => !featuredSlugSet.has(article.slug)),
  ].slice(0, 6);

  return (
    <div className="mx-auto max-w-2xl lg:max-w-4xl">
      <div className="my-16 sm:my-24 lg:my-32">
        <h2 className="sm:text-center text-4xl/snug sm:text-5xl/snug md:text-6xl/snug font-light tracking-tight text-base-content">
          Williamsburg Med Spa Blog
        </h2>
        <p className="mt-4 text-base md:text-lg lg:text-xl mb-8 max-w-4xl mx-auto text-center text-base-content/70">
          Read straightforward guidance on Botox, Xeomin, dermal fillers, PRP treatments, hyperhidrosis care, and
          medical ear piercing from Williamsburg Med Spa. These articles are written to help you compare options,
          understand candidacy, and decide what to ask during consultation.
        </p>
      </div>
      <div className="mt-16 space-y-20 lg:mt-20 lg:space-y-20">
        {articles.map((article) => <BlogPostCard key={article.slug} article={article} />)}
      </div>
    </div>
  );
}
