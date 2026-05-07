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
  title: "Medical Spa in Williamsburg, VA | Botox, Fillers, PRP & Ear Piercing",
  description:
    "Williamsburg Med Spa is a medical spa in Williamsburg, VA offering Botox, Xeomin, dermal fillers, PRP treatments, hyperhidrosis care, and medical ear piercing.",
  canonical: "/",
});

export default async function Page() {
  return (
    <div className="max-w-xl md:max-w-7xl mx-auto md:px-8 z-10">
      <Jumbotron />
      <section className="mb-14 px-6 md:mb-20 md:px-0" aria-labelledby="home-local-intro-heading">
        <div className="mx-auto max-w-4xl text-center">
          <p className="text-[11px] uppercase tracking-[0.24em] text-base-content/60">Medical Spa in Williamsburg, VA</p>
          <h2
            id="home-local-intro-heading"
            className="mt-4 text-3xl/snug md:text-4xl/snug font-light tracking-tight text-base-content"
          >
            Local care for injectables, PRP, hyperhidrosis treatment, and medical ear piercing.
          </h2>
          <p className="mt-4 text-base md:text-lg leading-relaxed text-base-content/80">
            Williamsburg Med Spa is a medical spa in Williamsburg, VA offering Botox, Xeomin, dermal fillers, PRP
            treatments, hyperhidrosis care, and Blomdahl medical ear piercing with calm conversations, clear
            guidance, and treatment planning shaped around realistic goals.
          </p>
        </div>
      </section>
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
