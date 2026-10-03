import { MetadataRoute } from "next";

import { procedures, products } from "data";
import { getPublishedBlogPosts } from "lib/blog";
import { getPublishedEvents } from "lib/events";
import { publishedEarPiercingIntentPages } from "lib/ear-piercing-intents";
import { publishedEarPiercingAreas } from "lib/local-service-areas";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const articles = await getPublishedBlogPosts();
  const publishedProcedures = procedures.filter((procedure) => !("published" in procedure) || procedure.published !== false);
  const publishedProducts = products.filter((product) => !("published" in product) || product.published !== false);
  const publishedEvents = getPublishedEvents();

  const urls = [
    {
      url: "https://www.williamsburgmedspa.com",
    },
    {
      url: "https://www.williamsburgmedspa.com/consult",
    },
    {
      url: "https://www.williamsburgmedspa.com/blog",
    },
    {
      url: "https://www.williamsburgmedspa.com/procedures",
    },
    {
      url: "https://www.williamsburgmedspa.com/products",
    },
    {
      url: "https://www.williamsburgmedspa.com/staff/jenny-coleman",
    },
    {
      url: "https://www.williamsburgmedspa.com/locations",
    },
    {
      url: "https://www.williamsburgmedspa.com/locations/williamsburg-va",
    },
    {
      url: "https://www.williamsburgmedspa.com/locations/james-city-county-va",
    },
    {
      url: "https://www.williamsburgmedspa.com/locations/yorktown-va",
    },
    {
      url: "https://www.williamsburgmedspa.com/locations/newport-news-va",
    },
    ...articles.map((article) => ({
      url: `https://www.williamsburgmedspa.com${article.href}`,
      lastModified: new Date(article.dateModified ?? article.date),
    })),
    ...publishedProcedures.map((procedure) => ({
      url: `https://www.williamsburgmedspa.com/procedures/${procedure.slug}`,
    })),
    ...publishedEarPiercingAreas.map((area) => ({
      url: `https://www.williamsburgmedspa.com/procedures/blomdahl-ear-piercing/near/${area.slug}`,
    })),
    ...publishedEarPiercingIntentPages.map((page) => ({
      url: `https://www.williamsburgmedspa.com/procedures/blomdahl-ear-piercing/for/${page.slug}`,
    })),
    ...publishedProducts.map((product) => ({
      url: `https://www.williamsburgmedspa.com/products/${product.slug}`,
    })),
    {
      url: "https://www.williamsburgmedspa.com/events",
    },
    ...publishedEvents.map((event) => ({
      url: `https://www.williamsburgmedspa.com${event.canonicalPath}`,
    })),
  ];

  return urls;
}
