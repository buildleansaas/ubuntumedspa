import React from "react";
import type { Metadata } from "next";
import Link from "next/link";

import CtaFooter from "components/cta-footer";
import Jumbotron from "views/jumbotron";
import BlomdahlCallout from "views/blomdahl-callout";
import OhShotCallout from "views/oh-shot-callout";

import ProviderCallout from "views/provider-callout";
import Procedures from "views/procedures";
import LatestPosts from "views/latest-posts";
import Products from "views/products";
import BotoxPartyCallout from "views/botox-party-callout";
import HomeVisit from "views/home-visit";
import { buildPageMetadata } from "lib/metadata";
import StructuredData from "components/structured-data";

export const metadata: Metadata = buildPageMetadata({
  title: "Williamsburg Med Spa: Botox, Fillers, PRP & Ear Piercing",
  description:
    "Jenny Coleman, MSN, RN, CPNP, PMHS, CMA-certified OH-Shot provider, offers Botox, Xeomin, fillers, PRP, and Blomdahl ear piercing in Williamsburg, VA.",
  canonical: "/",
});

const homeFaqs = [
  {
    question: "What medical spa services are available in Williamsburg, VA?",
    answer:
      "Williamsburg Med Spa offers Botox, Xeomin, dermal fillers, PRP treatments, hyperhidrosis care, OH-Shot services, and Blomdahl medical ear piercing in Williamsburg, VA.",
  },
  {
    question: "Who provides treatments at Williamsburg Med Spa?",
    answer:
      "Treatments are provided by Jenny Coleman, MSN, RN, CPNP, PMHS, a Cellular Medicine Association-certified OH-Shot provider and certified Blomdahl provider, with a focus on conservative planning, patient education, and natural-looking goals.",
  },
  {
    question: "Does Williamsburg Med Spa serve nearby areas?",
    answer:
      "Yes. Patients visit from Williamsburg, James City County, Kingsmill, New Town, Yorktown, Newport News, Toano, Norge, Lightfoot, and Ford's Colony.",
  },
];

const localLinks = [
  { href: "/procedures/botox", label: "Botox in Williamsburg" },
  { href: "/procedures/filler", label: "Fillers in Williamsburg" },
  { href: "/procedures/xeomin", label: "Xeomin in Williamsburg" },
  { href: "/locations/williamsburg-va", label: "Hours & directions" },
  { href: "/locations", label: "Areas we serve" },
  { href: "/locations/yorktown-va", label: "Yorktown med spa" },
  { href: "/procedures/blomdahl-ear-piercing", label: "Ear piercing in Williamsburg" },
] as const;

export default async function Page() {
  return (
    <div className="w-full">
      <StructuredData type="FAQ" faqs={homeFaqs} />
      <Jumbotron />
      <section className="scroll-mt-28 border-t border-base-300 py-16 md:py-20" aria-labelledby="home-local-intro-heading">
        <div className="max-w-3xl">
          <p className="text-xs font-medium uppercase tracking-[0.22em] text-base-content/80">
            Nurse Practitioner led medical spa in Williamsburg, VA
          </p>
          <h2
            id="home-local-intro-heading"
            className="font-display mt-4 text-3xl font-medium leading-[1.15] tracking-tight text-base-content md:text-4xl"
          >
            Local care with Jenny Coleman, MSN, RN, CPNP, PMHS for Botox, Xeomin, dermal fillers, PRP, sweating treatment, and medical ear piercing.
          </h2>
          <p className="mt-5 max-w-[65ch] text-base leading-relaxed text-base-content/85 md:text-lg">
            Williamsburg Med Spa is a Nurse Practitioner led medical spa in Williamsburg, VA. Jenny Coleman brings
            MSN, RN, CPNP, PMHS, Cellular Medicine Association-certified OH-Shot provider training, and
            certified Blomdahl provider training for medical ear piercing, so care starts with medical screening,
            calm education, and treatment planning shaped around realistic goals.
          </p>
          <nav className="mt-6" aria-label="Williamsburg services and nearby areas">
            <ul className="flex max-w-3xl flex-wrap gap-x-5 gap-y-2">
              {localLinks.map((item) => (
                <li key={item.href}>
                  <Link
                    className="text-sm text-base-content underline decoration-base-300 underline-offset-[5px] transition-colors hover:text-primary hover:decoration-primary focus:outline-none focus-visible:ring-2 focus-visible:ring-primary/40 focus-visible:ring-offset-4"
                    href={item.href}
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        </div>
      </section>
      <Procedures
        variant="editorial"
        featured={
          <div className="grid gap-8">
            <OhShotCallout />
            <BlomdahlCallout />
          </div>
        }
      />
      <ProviderCallout />
      <Products variant="editorial" />
      <LatestPosts />
      <BotoxPartyCallout />
      <section className="scroll-mt-28 border-t border-base-300 py-16 md:py-24" aria-labelledby="home-faq-heading">
        <div className="max-w-3xl">
          <p className="text-xs font-medium uppercase tracking-[0.22em] text-base-content/80">Williamsburg med spa FAQ</p>
          <h2
            id="home-faq-heading"
            className="font-display mt-4 text-4xl font-medium leading-[1.12] tracking-tight text-base-content md:text-5xl"
          >
            Quick answers before you book
          </h2>
          <div className="mt-8 divide-y divide-base-300 border-y border-base-300">
            {homeFaqs.map((faq) => (
              <article key={faq.question} className="py-6 md:py-8">
                <h3 className="font-display text-2xl font-medium leading-tight text-base-content md:text-3xl">{faq.question}</h3>
                <p className="mt-3 max-w-[65ch] text-base leading-relaxed text-base-content/85">{faq.answer}</p>
              </article>
            ))}
          </div>
        </div>
      </section>
      <HomeVisit />
      <CtaFooter variant="editorial" />
    </div>
  );
}
