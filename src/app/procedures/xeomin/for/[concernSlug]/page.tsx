import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { buildPageMetadata } from "lib/metadata";
import { getXeominConcernPage, XEOMIN_PRODUCT_PATH, xeominConcernPages } from "lib/xeomin-concerns";
import XeominClusterPageView from "views/xeomin-cluster-page";

type Params = { params: Promise<{ concernSlug: string }> };

// Only the listed concerns exist; anything else is a 404 (old slugs redirect in next.config.mjs).
export const dynamicParams = false;

export function generateStaticParams() {
  return xeominConcernPages.map((page) => ({ concernSlug: page.slug }));
}

export async function generateMetadata(props: Params): Promise<Metadata> {
  const { concernSlug } = await props.params;
  const page = getXeominConcernPage(concernSlug);
  if (!page) {
    return buildPageMetadata({
      title: "Xeomin in Williamsburg, VA",
      description: "Xeomin wrinkle relaxer at Williamsburg Med Spa.",
      canonical: XEOMIN_PRODUCT_PATH,
    });
  }
  return buildPageMetadata({ title: page.metaTitle, description: page.metaDescription, canonical: page.path });
}

export default async function XeominConcernPage(props: Params) {
  const { concernSlug } = await props.params;
  const page = getXeominConcernPage(concernSlug);
  if (!page) return notFound();
  return <XeominClusterPageView page={page} />;
}
