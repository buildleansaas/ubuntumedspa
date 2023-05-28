import { MetadataRoute } from "next";

export const articles: string[] = [
  "unleashing-the-power-of-the-vampire-facelift-your-non-surgical-key-to-youthful-skin",
  "hair-loss-got-you-down-discover-prp-your-new-ally-in-hair-restoration",
  "beginners-guide-to-platelet-rich-plasma-therapy",
  "naturally-heal-joint-pain-prp-therapy",
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
