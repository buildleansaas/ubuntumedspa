import React from "react";
import type { Metadata } from "next";

import CtaFooter from "components/cta-footer";
import Jumbotron from "views/jumbotron";
import OShotCallout from "views/o-shot-callout";
import AffiliateProgramCallout from "views/affiliate-program-callout";
import ProviderCallout from "views/provider-callout";
import Procedures from "views/procedures";
import LatestPosts from "views/latest-posts";
import Products from "views/products";
import BotoxPartyCallout from "views/botox-party-callout";
import { buildPageMetadata } from "lib/metadata";

export const metadata: Metadata = buildPageMetadata({
  title: "Williamsburg Med Spa | PRP, Botox, Xeomin & Aesthetic Care in Williamsburg, VA",
  description:
    "Williamsburg Med Spa provides PRP therapies, Botox, Xeomin, fillers, and medical-grade aesthetic care in Williamsburg, Virginia.",
  canonical: "/",
});

export default async function Page() {
  return (
    <div className="max-w-xl md:max-w-7xl mx-auto md:px-8 z-10">
      <Jumbotron />
      <ProviderCallout />
      <OShotCallout />
      <Procedures />
      <AffiliateProgramCallout />
      <Products />
      <BotoxPartyCallout />
      <LatestPosts />
      <CtaFooter />
    </div>
  );
}
