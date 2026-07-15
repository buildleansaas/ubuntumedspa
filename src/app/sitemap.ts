import { MetadataRoute } from "next";

import { procedures, products } from "data";
import { getPublishedAilmentEntries } from "lib/ailments/get-ailment-page-data";
import { getPublishedBlogPosts } from "lib/blog";
import { getPublishedEvents } from "lib/events";
import { publishedEarPiercingIntentPages } from "lib/ear-piercing-intents";
import { localInjectableServicePages } from "lib/local-injectable-service-pages";
import { publishedEarPiercingAreas } from "lib/local-service-areas";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const articles = await getPublishedBlogPosts();
  const ailmentPages = await getPublishedAilmentEntries();
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
    {
      url: "https://www.williamsburgmedspa.com/locations/toano-va",
    },
    {
      url: "https://www.williamsburgmedspa.com/locations/norge-va",
    },
    {
      url: "https://www.williamsburgmedspa.com/locations/lightfoot-va",
    },
    {
      url: "https://www.williamsburgmedspa.com/locations/new-town-va",
    },
    {
      url: "https://www.williamsburgmedspa.com/locations/kingsmill-va",
    },
    {
      url: "https://www.williamsburgmedspa.com/locations/fords-colony-va",
    },
    ...articles.map((article) => ({
      url: `https://www.williamsburgmedspa.com${article.href}`,
      lastModified: new Date(article.dateModified ?? article.date),
    })),
    ...publishedProcedures.map((procedure) => ({
      url: `https://www.williamsburgmedspa.com/procedures/${procedure.slug}`,
    })),
    ...localInjectableServicePages.map((page) => ({
      url: `https://www.williamsburgmedspa.com/procedures/${page.procedureSlug}/near/${page.areaSlug}`,
    })),
    ...publishedEarPiercingAreas.map((area) => ({
      url: `https://www.williamsburgmedspa.com/procedures/blomdahl-ear-piercing/near/${area.slug}`,
    })),
    ...publishedEarPiercingIntentPages.map((page) => ({
      url: `https://www.williamsburgmedspa.com/procedures/blomdahl-ear-piercing/for/${page.slug}`,
    })),
    ...ailmentPages.map(({ procedureSlug, ailmentSlug }) => ({
      url: `https://www.williamsburgmedspa.com/procedures/${procedureSlug}/for/${ailmentSlug}`,
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
