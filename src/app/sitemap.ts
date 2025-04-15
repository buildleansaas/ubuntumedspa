import { MetadataRoute } from "next";

import { procedures, products } from "data";

export const articles: string[] = [
  "revitalize-sexual-health-female-intimacy-prp-protocols-vaginal-dryness",
  "unleashing-the-power-of-the-prp-facelift-your-non-surgical-key-to-youthful-skin",
  "hair-loss-got-you-down-discover-prp-your-new-ally-in-hair-restoration",
  "beginners-guide-to-platelet-rich-plasma-therapy",
  "naturally-heal-joint-pain-prp-therapy",
];

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const urls = [
    {
      url: "https://www.ubuntumedspa.com",
      lastModified: new Date(),
    },
    {
      url: "https://www.ubuntumedspa.com/consult",
      lastModified: new Date(),
    },
    ...articles.map((slug) => ({
      url: `https://www.ubuntumedspa.com/blog/${slug}`,
      lastModified: new Date(),
    })),
    ...procedures.map((procedure) => ({
      url: `https://www.ubuntumedspa.com/procedures/${procedure.slug}`,
      lastModified: new Date(),
    })),
    ...products.map((product) => ({
      url: `https://www.ubuntumedspa.com/products/${product.slug}`,
      lastModified: new Date(),
    })),
  ];

  console.log(urls.map((url) => url.url));

  return urls;
}
