import { MetadataRoute } from "next";

import { getPublishedBlogPosts } from "lib/blog";
import { sitemapPagePaths } from "lib/sitemap-pages";
import contentDates from "config/content-dates.json";

const ORIGIN = "https://www.williamsburgmedspa.com";
const pageDates: Record<string, string> = contentDates;

// Re-generated daily so /offers leaves the sitemap after its last offer ends.
export const revalidate = 86400;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const articles = await getPublishedBlogPosts();
  const { beforeArticles, afterArticles } = sitemapPagePaths();

  // lastmod is the real date each page's copy last changed: frontmatter for blog posts, git history for every other
  // page (src/config/content-dates.json, written by `pnpm content-dates`). The blog index moves with its newest post.
  const articleDates = articles.map((article) => new Date(article.dateModified ?? article.date));
  const newestArticle = articleDates.reduce<Date | undefined>((newest, date) => (!newest || date > newest ? date : newest), undefined);
  const page = (path: string) => {
    const committed = pageDates[path] ? new Date(`${pageDates[path]}T00:00:00Z`) : undefined;
    const lastModified = path === "/blog" && newestArticle && (!committed || newestArticle > committed) ? newestArticle : committed;
    return { url: path === "/" ? ORIGIN : `${ORIGIN}${path}`, ...(lastModified ? { lastModified } : {}) };
  };

  return [
    ...beforeArticles.map(page),
    ...articles.map((article, index) => ({
      url: `${ORIGIN}${article.href}`,
      lastModified: articleDates[index],
    })),
    ...afterArticles.map(page),
  ];
}
