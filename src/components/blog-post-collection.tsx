import BlogPostCard from "components/blog-post-card";
import type { PostMetadata } from "lib/blog";
import { cn } from "lib/utils";

interface BlogPostCollectionProps {
  articles: PostMetadata[];
  featuredFirst?: boolean;
  className?: string;
}

export default function BlogPostCollection({ articles, featuredFirst = false, className }: BlogPostCollectionProps) {
  const [featuredArticle, ...remainingArticles] = articles;
  const gridArticles = featuredFirst ? remainingArticles : articles;

  return (
    <div className={cn("mt-12", className)}>
      <div className="space-y-6 md:hidden">
        {articles.map((article) => (
          <BlogPostCard key={article.routeSlug} article={article} variant="list" />
        ))}
      </div>

      <div className="hidden md:block">
        {featuredFirst && featuredArticle && (
          <BlogPostCard article={featuredArticle} variant="featured" priority />
        )}

        <div
          className={cn(
            "grid gap-x-6 gap-y-10 lg:gap-x-8",
            featuredFirst && featuredArticle ? "mt-12" : undefined,
            "md:grid-cols-2 xl:grid-cols-3"
          )}
        >
          {gridArticles.map((article) => (
            <BlogPostCard key={article.routeSlug} article={article} />
          ))}
        </div>
      </div>
    </div>
  );
}
