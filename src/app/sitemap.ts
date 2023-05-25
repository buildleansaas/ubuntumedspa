import { MetadataRoute } from "next";

export const articles: string[] = []; // TODO: generate by reading files in /markdown

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  return [
    {
      url: "https://www.ubuntumedspa.com",
      lastModified: new Date(),
    },
    ...articles.map((slug) => ({
      url: `https://www.ubuntumedspa.com/blog/${slug}`,
      lastModified: new Date(),
    })),
  ];
}
