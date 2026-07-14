import React from "react";
import type { Metadata } from "next";
import Link from "next/link";

import CtaFooter from "components/cta-footer";
import Jumbotron from "views/jumbotron";
import OShotCallout from "views/o-shot-callout";

import ProviderCallout from "views/provider-callout";
import Procedures from "views/procedures";
import LatestPosts from "views/latest-posts";
import Products from "views/products";
import BotoxPartyCallout from "views/botox-party-callout";
import { buildPageMetadata } from "lib/metadata";
import StructuredData from "components/structured-data";

export const metadata: Metadata = buildPageMetadata({
  title: "Williamsburg Med Spa: Botox, Fillers, PRP & Ear Piercing",
  description:
    "Nurse practitioner led med spa in Williamsburg, VA for Botox, Xeomin, fillers, PRP, O-Shot care, sweating treatment and medical ear piercing with Jenny Coleman.",
  canonical: "/",
});

export default async function Page() {
  return (
    <div className="max-w-xl md:max-w-7xl mx-auto md:px-8 z-10">
      <StructuredData
        type="FAQ"
        faqs={[
          {
            question: "What medical spa services are available in Williamsburg, VA?",
            answer:
              "Williamsburg Med Spa offers Botox, Xeomin, dermal fillers, PRP treatments, hyperhidrosis care, O-Shot services, and Blomdahl medical ear piercing in Williamsburg, VA.",
          },
          {
            question: "Who provides treatments at Williamsburg Med Spa?",
            answer:
              "Treatments are provided by Jenny Coleman, MSN, RN, CPNP, PMHS, a Cellular Medicine Association-certified O-Shot provider and certified Blomdahl provider, with a focus on conservative planning, patient education, and natural-looking goals.",
          },
          {
            question: "Does Williamsburg Med Spa serve nearby areas?",
            answer:
              "Yes. Patients visit from Williamsburg, James City County, Kingsmill, New Town, Yorktown, Newport News, Toano, Norge, Lightfoot, and Ford's Colony.",
          },
        ]}
      />
      <Jumbotron />
      <section className="mb-14 px-6 md:mb-20 md:px-0" aria-labelledby="home-local-intro-heading">
        <div className="mx-auto max-w-4xl text-center">
          <p className="text-[11px] uppercase tracking-[0.24em] text-base-content/60">Nurse Practitioner led medical spa in Williamsburg, VA</p>
          <h2
            id="home-local-intro-heading"
            className="mt-4 text-3xl/snug md:text-4xl/snug font-light tracking-tight text-base-content"
          >
            Local care with Jenny Coleman, MSN, RN, CPNP, PMHS for Botox, Xeomin, dermal fillers, PRP, sweating treatment, and medical ear piercing.
          </h2>
          <p className="mt-4 text-base md:text-lg leading-relaxed text-base-content/80">
            Williamsburg Med Spa is a Nurse Practitioner led medical spa in Williamsburg, VA. Jenny Coleman brings
            MSN, RN, CPNP, PMHS, Cellular Medicine Association-certified O-Shot provider training, and
            certified Blomdahl provider training for medical ear piercing, so care starts with medical screening,
            calm education, and treatment planning shaped around realistic goals.
          </p>
          <div className="mt-6 flex flex-wrap justify-center gap-2">
            <Link className="rounded-full border border-base-300 px-3 py-1 text-sm hover:border-primary" href="/procedures/botox/near/williamsburg-va">
              Botox in Williamsburg
            </Link>
            <Link className="rounded-full border border-base-300 px-3 py-1 text-sm hover:border-primary" href="/procedures/filler/near/williamsburg-va">
              Fillers in Williamsburg
            </Link>
            <Link className="rounded-full border border-base-300 px-3 py-1 text-sm hover:border-primary" href="/procedures/xeomin/near/williamsburg-va">
              Xeomin in Williamsburg
            </Link>
            <Link className="rounded-full border border-base-300 px-3 py-1 text-sm hover:border-primary" href="/locations/williamsburg-va">
              Hours & directions
            </Link>
            <Link className="rounded-full border border-base-300 px-3 py-1 text-sm hover:border-primary" href="/locations">
              Areas we serve
            </Link>
            <Link className="rounded-full border border-base-300 px-3 py-1 text-sm hover:border-primary" href="/locations/yorktown-va">
              Yorktown med spa
            </Link>
            <Link className="rounded-full border border-base-300 px-3 py-1 text-sm hover:border-primary" href="/locations/toano-va">
              Toano med spa
            </Link>
          </div>
        </div>
      </section>
      <ProviderCallout />
      <OShotCallout />
      <Procedures />

      <Products />
      <BotoxPartyCallout />
      <LatestPosts />
      <section className="mb-14 px-6 md:mb-20 md:px-0" aria-labelledby="home-faq-heading">
        <div className="mx-auto max-w-4xl">
          <p className="text-[11px] uppercase tracking-[0.24em] text-base-content/60">Williamsburg med spa FAQ</p>
          <h2 id="home-faq-heading" className="mt-4 text-3xl/snug md:text-4xl/snug font-light tracking-tight text-base-content">
            Quick answers before you book
          </h2>
          <div className="mt-8 space-y-5">
            <article className="rounded-3xl border border-base-300 bg-base-100 p-6">
              <h3 className="text-xl font-medium text-base-content">What medical spa services are available in Williamsburg, VA?</h3>
              <p className="mt-3 text-base leading-relaxed text-base-content/75">
                Williamsburg Med Spa offers Botox, Xeomin, dermal fillers, PRP treatments, hyperhidrosis care, O-Shot services, and Blomdahl medical ear piercing in Williamsburg, VA.
              </p>
            </article>
            <article className="rounded-3xl border border-base-300 bg-base-100 p-6">
              <h3 className="text-xl font-medium text-base-content">Who provides treatments at Williamsburg Med Spa?</h3>
              <p className="mt-3 text-base leading-relaxed text-base-content/75">
                Treatments are provided by Jenny Coleman, MSN, RN, CPNP, PMHS, a Cellular Medicine Association-certified O-Shot provider and certified Blomdahl provider, with a focus on conservative planning, patient education, and natural-looking goals.
              </p>
            </article>
            <article className="rounded-3xl border border-base-300 bg-base-100 p-6">
              <h3 className="text-xl font-medium text-base-content">Does Williamsburg Med Spa serve nearby areas?</h3>
              <p className="mt-3 text-base leading-relaxed text-base-content/75">
                Yes. Patients visit from Williamsburg, James City County, Kingsmill, New Town, Yorktown, Newport News, Toano, Norge, Lightfoot, and Ford&apos;s Colony.
              </p>
            </article>
          </div>
        </div>
      </section>
      <CtaFooter />
    </div>
  );
}
