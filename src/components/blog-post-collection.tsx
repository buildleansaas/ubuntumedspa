import BlogPostCard from "components/blog-post-card";
import type { PostMetadata } from "lib/blog";
import { cn } from "lib/utils";

interface BlogPostCollectionProps {
  articles: PostMetadata[];
  featuredFirst?: boolean;
  className?: string;
  tone?: "default" | "editorial";
}

export default function BlogPostCollection({
  articles,
  featuredFirst = false,
  className,
  tone = "default",
}: BlogPostCollectionProps) {
  const [featuredArticle, ...remainingArticles] = articles;
  const gridArticles = featuredFirst ? remainingArticles : articles;

  // One responsive render (Tidewater): the old version drew every card twice, a list for phones and a grid for
  // desktop, so each post's text was in the HTML two times.
  return (
    <div className={cn("mt-12 text-left", className)}>
      {featuredFirst && featuredArticle && (
        <BlogPostCard article={featuredArticle} variant="featured" priority tone={tone} />
      )}

      <div
        className={cn(
          "grid gap-x-6 gap-y-10 lg:gap-x-8",
          featuredFirst && featuredArticle ? "mt-12" : undefined,
          "md:grid-cols-2 xl:grid-cols-3"
        )}
      >
        {gridArticles.map((article) => (
          <BlogPostCard key={article.routeSlug} article={article} tone={tone} />
        ))}
      </div>
    </div>
  );
}
