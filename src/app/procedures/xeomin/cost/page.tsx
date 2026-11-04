import type { Metadata } from "next";

import { buildPageMetadata } from "lib/metadata";
import { xeominCostPage } from "lib/xeomin-concerns";
import XeominClusterPageView from "views/xeomin-cluster-page";

export const metadata: Metadata = buildPageMetadata({
  title: xeominCostPage.metaTitle,
  description: xeominCostPage.metaDescription,
  canonical: xeominCostPage.path,
});

export default function XeominCostPage() {
  return <XeominClusterPageView page={xeominCostPage} />;
}
