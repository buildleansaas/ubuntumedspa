import { readdir, stat } from "node:fs/promises";
import path from "node:path";
import { cache } from "react";

const MARKDOWN_DIR = path.join(process.cwd(), "src", "markdown");

type RawPostMetadata = {
  title?: string;
  description?: string;
  image?: string;
  imageAlt?: string;
  tags?: string[];
  slug?: string;
  date?: string;
  dateModified?: string;
  authorName?: string;
  reviewedBy?: string;
  faqs?: { question: string; answer: string }[];
  published?: boolean;
};

export type PostMetadata = Omit<RawPostMetadata, "title" | "description" | "image" | "tags" | "date" | "slug"> & {
  title: string;
  description: string;
  image: string;
  tags: string[];
  slug: string;
  date: string;
  published: boolean;
};

const toIsoDate = (value?: string) => {
  if (!value) return undefined;

  const directDate = new Date(value);
  if (!Number.isNaN(directDate.getTime())) return directDate.toISOString();

  const usDateMatch = value.match(/^(\d{1,2})-(\d{1,2})-(\d{4})$/);
  if (!usDateMatch) return undefined;

  const [, month, day, year] = usDateMatch;
  const normalizedDate = new Date(`${year}-${month.padStart(2, "0")}-${day.padStart(2, "0")}T00:00:00.000Z`);
  if (Number.isNaN(normalizedDate.getTime())) return undefined;

  return normalizedDate.toISOString();
};

const getBlogSlugs = cache(async () => {
  const entries = await readdir(MARKDOWN_DIR, { withFileTypes: true });

  return entries
    .filter((entry) => entry.isFile() && entry.name.endsWith(".mdx"))
    .map((entry) => entry.name.replace(/\.mdx$/, ""))
    .sort();
});

export const getPostData = cache(async (slug: string) => {
  const { default: Content, metadata } = await import(`markdown/${slug}.mdx`);
  const filePath = path.join(MARKDOWN_DIR, `${slug}.mdx`);

  let modifiedAt: string | undefined;
  try {
    const fileStats = await stat(filePath);
    modifiedAt = fileStats.mtime.toISOString();
  } catch {
    modifiedAt = undefined;
  }

  const typedMetadata = (metadata || {}) as RawPostMetadata;
  const normalizedDate = toIsoDate(typedMetadata.date) || new Date().toISOString();
  const normalizedDateModified = toIsoDate(typedMetadata.dateModified);

  const normalizedMetadata: PostMetadata = {
    ...typedMetadata,
    title: typedMetadata.title || "Williamsburg Med Spa Blog",
    description: typedMetadata.description || "Educational content from Williamsburg Med Spa.",
    image: typedMetadata.image || "/opengraph-image",
    tags: Array.isArray(typedMetadata.tags) ? typedMetadata.tags : [],
    slug: typedMetadata.slug || slug,
    date: normalizedDate,
    dateModified: normalizedDateModified || modifiedAt || normalizedDate,
    authorName: typedMetadata.authorName || "Jenny Coleman",
    reviewedBy: typedMetadata.reviewedBy || "Jenny Coleman",
    published: typedMetadata.published !== false,
  };

  return {
    Content,
    metadata: normalizedMetadata,
  };
});

export const getAllBlogPosts = cache(async () => {
  const slugs = await getBlogSlugs();
  const posts = await Promise.all(slugs.map(async (slug) => (await getPostData(slug)).metadata));

  return posts.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
});

export const getPublishedBlogPosts = cache(async () => {
  const posts = await getAllBlogPosts();

  return posts.filter((post) => post.published);
});
