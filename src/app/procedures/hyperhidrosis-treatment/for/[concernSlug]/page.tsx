import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { buildPageMetadata } from "lib/metadata";
import { getSatellitesForHub, getServiceSatellitePage, satellitePath } from "lib/service-satellites";
import ServiceSatellitePageView from "views/service-satellite-page";

// Underarm, palms, and feet. Other /for/ slugs keep redirecting to the hub (next.config.mjs).
type Params = { params: Promise<{ concernSlug: string }> };

export const dynamicParams = false;

export function generateStaticParams() {
  return getSatellitesForHub("hyperhidrosis-treatment").map((page) => ({ concernSlug: page.slug }));
}

export async function generateMetadata(props: Params): Promise<Metadata> {
  const { concernSlug } = await props.params;
  const page = getServiceSatellitePage("hyperhidrosis-treatment", "concern", concernSlug);
  if (!page) return {};
  return buildPageMetadata({ title: page.metaTitle, description: page.metaDescription, canonical: satellitePath(page) });
}

export default async function HyperhidrosisConcernPage(props: Params) {
  const { concernSlug } = await props.params;
  const page = getServiceSatellitePage("hyperhidrosis-treatment", "concern", concernSlug);
  if (!page) return notFound();
  return <ServiceSatellitePageView page={page} />;
}
