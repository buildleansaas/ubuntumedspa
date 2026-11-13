import BlogPostCard from "components/blog-post-card";
import { CARD_GRID } from "components/layout";
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
          CARD_GRID,
          featuredFirst && featuredArticle ? "mt-12" : undefined
        )}
      >
        {gridArticles.map((article) => (
          <BlogPostCard key={article.routeSlug} article={article} tone={tone} />
        ))}
      </div>
    </div>
  );
}
