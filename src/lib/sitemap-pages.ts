import { procedures, products } from "data";
import { getPublishedEvents } from "lib/events";
import { publishedEarPiercingIntentPages } from "lib/ear-piercing-intents";
import { publishedEarPiercingAreas } from "lib/local-service-areas";
import { serviceSatellitePaths } from "lib/service-satellites";
import { xeominClusterPages } from "lib/xeomin-concerns";
import { getActiveOffers } from "config/offers";

// Every sitemap path except the blog posts, in sitemap order. Blog posts go between `beforeArticles` and
// `afterArticles`. Shared by src/app/sitemap.ts and scripts/content-dates.ts (which cannot load the MDX posts).
export function sitemapPagePaths({ includeOffers = getActiveOffers().length > 0 } = {}) {
  const publishedProcedures = procedures.filter((procedure) => !("published" in procedure) || procedure.published !== false);
  const publishedProducts = products.filter((product) => !("published" in product) || product.published !== false);

  const beforeArticles = [
    "/",
    "/consult",
    "/blog",
    "/procedures",
    "/products",
    "/prices",
    ...(includeOffers ? ["/offers"] : []),
    "/staff/jenny-brady",
    "/locations",
    "/locations/williamsburg-va",
    "/locations/james-city-county-va",
    "/locations/yorktown-va",
    "/locations/newport-news-va",
  ];
  const afterArticles = [
    ...publishedProcedures.map((procedure) => `/procedures/${procedure.slug}`),
    ...publishedEarPiercingAreas.map((area) => `/procedures/blomdahl-ear-piercing/near/${area.slug}`),
    ...publishedEarPiercingIntentPages.map((page) => `/procedures/blomdahl-ear-piercing/for/${page.slug}`),
    ...serviceSatellitePaths,
    ...xeominClusterPages.map((page) => page.path),
    ...publishedProducts.map((product) => `/products/${product.slug}`),
    "/privacy",
    "/terms",
    "/cookies",
    "/html-sitemap",
    "/events",
    ...getPublishedEvents().map((event) => event.canonicalPath),
  ];
  return { beforeArticles, afterArticles };
}
