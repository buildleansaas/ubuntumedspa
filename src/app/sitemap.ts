import { MetadataRoute } from "next";

import { procedures, products } from "data";
import { getPublishedAilmentEntries } from "lib/ailments/get-ailment-page-data";
import { getPublishedBlogPosts } from "lib/blog";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const articles = await getPublishedBlogPosts();
  const ailmentPages = await getPublishedAilmentEntries();
  const publishedProcedures = procedures.filter((procedure) => !("published" in procedure) || procedure.published !== false);
  const publishedProducts = products.filter((product) => !("published" in product) || product.published !== false);

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
      url: "https://www.williamsburgmedspa.com/blog",
      lastModified: new Date(),
    },
    {
      url: "https://www.williamsburgmedspa.com/procedures",
      lastModified: new Date(),
    },
    {
      url: "https://www.williamsburgmedspa.com/products",
      lastModified: new Date(),
    },
    {
      url: "https://www.williamsburgmedspa.com/staff/jenny-coleman",
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
    ...articles.map((article) => ({
      url: `https://www.williamsburgmedspa.com/blog/${article.slug}`,
      lastModified: new Date(article.dateModified ?? article.date),
    })),
    ...publishedProcedures.map((procedure) => ({
      url: `https://www.williamsburgmedspa.com/procedures/${procedure.slug}`,
      lastModified: new Date(),
    })),
    ...ailmentPages.map(({ procedureSlug, ailmentSlug }) => ({
      url: `https://www.williamsburgmedspa.com/procedures/${procedureSlug}/for/${ailmentSlug}`,
      lastModified: new Date(),
    })),
    ...publishedProducts.map((product) => ({
      url: `https://www.williamsburgmedspa.com/products/${product.slug}`,
      lastModified: new Date(),
    })),
  ];

  return urls;
}
