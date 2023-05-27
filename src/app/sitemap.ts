import { MetadataRoute } from "next";

export const articles: string[] = [
  "unleashing-the-power-of-the-vampire-facelift-your-non-surgical-key-to-youthful-skin",
];

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
