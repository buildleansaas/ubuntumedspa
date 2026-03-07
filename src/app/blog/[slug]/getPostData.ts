import { stat } from "node:fs/promises";
import path from "node:path";

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
};

type PostMetadata = Omit<RawPostMetadata, "title" | "description" | "image" | "tags" | "date" | "slug"> & {
  title: string;
  description: string;
  image: string;
  tags: string[];
  slug: string;
  date: string;
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

export const getPostData = async ({ slug }: { slug: string }) => {
  const { default: Content, metadata } = await import(`markdown/${slug}.mdx`);

  const filePath = path.join(process.cwd(), "src", "markdown", `${slug}.mdx`);

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
    authorName: typedMetadata.authorName || "Jenny Brady",
    reviewedBy: typedMetadata.reviewedBy || "Jenny Brady",
  };

  return {
    Content,
    metadata: normalizedMetadata,
  };
};
