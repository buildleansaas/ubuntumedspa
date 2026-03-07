import { MetadataRoute } from "next";

import { procedures, products } from "data";
import { getPublishedAilmentEntries } from "lib/ailments/get-ailment-page-data";

export const articles: string[] = [
  "revitalize-sexual-health-female-intimacy-prp-protocols-vaginal-dryness",
  "unleashing-the-power-of-the-prp-facelift-your-non-surgical-key-to-youthful-skin",
  "hair-loss-got-you-down-discover-prp-your-new-ally-in-hair-restoration",
  "beginners-guide-to-platelet-rich-plasma-therapy",
  "naturally-heal-joint-pain-prp-therapy",
];

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const ailmentPages = await getPublishedAilmentEntries();

  const urls = [
    {
      url: "https://www.williamsburgmedspa.com",
      lastModified: new Date(),
    },
    {
      url: "https://www.williamsburgmedspa.com/consult",
      lastModified: new Date(),
    },
    {
      url: "https://www.williamsburgmedspa.com/locations",
      lastModified: new Date(),
    },
    {
      url: "https://www.williamsburgmedspa.com/locations/williamsburg-va",
      lastModified: new Date(),
    },
    {
      url: "https://www.williamsburgmedspa.com/locations/james-city-county-va",
      lastModified: new Date(),
    },
    {
      url: "https://www.williamsburgmedspa.com/locations/yorktown-va",
      lastModified: new Date(),
    },
    {
      url: "https://www.williamsburgmedspa.com/locations/newport-news-va",
      lastModified: new Date(),
    },
    {
      url: "https://www.williamsburgmedspa.com/locations/toano-va",
      lastModified: new Date(),
    },
    {
      url: "https://www.williamsburgmedspa.com/locations/norge-va",
      lastModified: new Date(),
    },
    {
      url: "https://www.williamsburgmedspa.com/locations/lightfoot-va",
      lastModified: new Date(),
    },
    {
      url: "https://www.williamsburgmedspa.com/locations/new-town-va",
      lastModified: new Date(),
    },
    {
      url: "https://www.williamsburgmedspa.com/locations/kingsmill-va",
      lastModified: new Date(),
    },
    {
      url: "https://www.williamsburgmedspa.com/locations/fords-colony-va",
      lastModified: new Date(),
    },
    ...articles.map((slug) => ({
      url: `https://www.williamsburgmedspa.com/blog/${slug}`,
      lastModified: new Date(),
    })),
    ...procedures.map((procedure) => ({
      url: `https://www.williamsburgmedspa.com/procedures/${procedure.slug}`,
      lastModified: new Date(),
    })),
    ...ailmentPages.map(({ procedureSlug, ailmentSlug }) => ({
      url: `https://www.williamsburgmedspa.com/procedures/${procedureSlug}/for/${ailmentSlug}`,
      lastModified: new Date(),
    })),
    ...products.map((product) => ({
      url: `https://www.williamsburgmedspa.com/products/${product.slug}`,
      lastModified: new Date(),
    })),
  ];

  return urls;
}
