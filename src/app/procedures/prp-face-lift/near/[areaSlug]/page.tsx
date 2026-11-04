import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { buildPageMetadata } from "lib/metadata";
import { getSatellitesForHub, getServiceSatellitePage, satellitePath } from "lib/service-satellites";
import ServiceSatellitePageView from "views/service-satellite-page";

// Newport News and Yorktown (lib/service-satellites.ts). The clinic has one location, in Williamsburg.
type Params = { params: Promise<{ areaSlug: string }> };

export const dynamicParams = false;

export function generateStaticParams() {
  return getSatellitesForHub("prp-face-lift").map((page) => ({ areaSlug: page.slug }));
}

export async function generateMetadata(props: Params): Promise<Metadata> {
  const { areaSlug } = await props.params;
  const page = getServiceSatellitePage("prp-face-lift", "near", areaSlug);
  if (!page) return {};
  return buildPageMetadata({ title: page.metaTitle, description: page.metaDescription, canonical: satellitePath(page) });
}

export default async function PrpFaceLiftAreaPage(props: Params) {
  const { areaSlug } = await props.params;
  const page = getServiceSatellitePage("prp-face-lift", "near", areaSlug);
  if (!page) return notFound();
  return <ServiceSatellitePageView page={page} />;
}
