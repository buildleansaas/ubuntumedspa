import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";

import StructuredData from "components/structured-data";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "components/ui/accordion";
import { Button } from "components/ui/button";
import { buildPageMetadata } from "lib/metadata";

import AffiliateRegistrationForm from "./affiliate-registration-form";
import AffiliateShareScripts from "./affiliate-share-scripts";

export const metadata: Metadata = buildPageMetadata({
  title: "Affiliate Program | Williamsburg Med Spa",
  description:
    "Get your Williamsburg Med Spa referral link, learn what to say, and share Jenny Coleman’s services across the site.",
  canonical: "/affiliates",
});

const sectionEyebrowClass = "text-[11px] uppercase tracking-[0.24em] text-base-content/60";
const sectionHeadingClass = "mt-4 text-3xl/snug md:text-4xl/snug font-light tracking-tight text-base-content";
const sectionBodyClass = "mt-4 text-base md:text-lg leading-relaxed text-base-content/80";
const surfaceCardClass = "rounded-2xl border border-base-300 bg-base-100 p-5 shadow-sm";

const programHighlights = [
  "20% on qualifying referrals",
  "Instant referral link",
  "Share any page on the site",
  "Copy-ready text and scripts",
];

const applyHighlights = [
  {
    title: "Earn on qualified referrals",
    description:
      "A few thoughtful introductions each month can add up quickly, especially when someone is already looking for a provider they can trust.",
  },
  {
    title: "Use the whole site as your toolkit",
    description:
      "Start with the homepage, then share procedure and product pages when someone asks about something specific.",
  },
  {
    title: "Attribution carries through the funnel",
    description:
      "Referral codes now flow into consult submissions and paid checkout so qualifying activity stays tied to your link.",
  },
];

const whyJenny = [
  {
    title: "Gentle with nervous patients",
    description:
      "Jenny’s pediatric nursing background shows up in how she explains, reassures, and helps first-time patients feel safe without rushing them.",
  },
  {
    title: "Trusted clinical judgment",
    description:
      "With more than 26 years in medicine, she brings a calm, medically grounded perspective to treatments that can feel intimidating to new patients.",
  },
  {
    title: "Natural, not overdone",
    description:
      "People who want realistic guidance, subtle injectables, or thoughtful PRP care are often looking for exactly the kind of provider Jenny is.",
  },
];

const promotionIdeas = [
  {
    title: "Injectables people already ask about",
    description:
      "Botox, Xeomin, filler, and hyperhidrosis treatment are easy referral categories because people naturally ask their friends who they trust for injectables.",
    bestFor: "Wrinkles, sweat control, lip filler, and natural-looking refreshes.",
    href: "/procedures",
    cta: "View procedures",
  },
  {
    title: "PRP and intimate wellness care",
    description:
      "O-Shot, P-Shot, PRP Facial, PRP Face Lift, Hair Restoration, and Joint Restoration work well when someone wants a discreet regenerative option from someone gentle.",
    bestFor: "Private conversations, DMs, and one-to-one referrals where trust matters most.",
    href: "/procedures",
    cta: "Browse PRP treatments",
  },
  {
    title: "Products people can buy now",
    description:
      "The skincare and wellness shelf gives affiliates an easier entry point for people who want to start with a product before they commit to an appointment.",
    bestFor: "Followers who want a recommendation they can act on quickly from home.",
    href: "/products",
    cta: "See products",
  },
];

const sharePrinciples = [
  {
    title: "Lead with trust",
    description:
      "Position Jenny as calm, medically grounded, and easy to recommend to someone who wants to feel taken care of.",
  },
  {
    title: "Lead with the real problem",
    description:
      "Dryness, reduced sensitivity, wrinkles, sweating, or skincare frustration convert better than generic beauty language.",
  },
  {
    title: "Lead with realistic outcomes",
    description:
      "Williamsburg Med Spa is a fit for people who want honest guidance, not hype, and a plan that feels personal.",
  },
];

const guardrails = {
  do: [
    "Say Jenny is gentle, experienced, and thoughtful.",
    "Say Williamsburg Med Spa is a strong fit for people who want realistic guidance and a calm experience.",
    "Speak from personal trust, local reputation, and who you think would genuinely benefit.",
    "Encourage people to book a consultation if they want individualized advice.",
  ],
  avoid: [
    "Don’t promise results, timelines, or guaranteed outcomes.",
    "Don’t say a treatment is right for everyone or replace medical advice.",
    "Don’t overstate before-and-after expectations.",
    "Don’t make claims you can’t personally stand behind or Jenny hasn’t confirmed.",
  ],
};

const affiliateFaqs = [
  {
    question: "Who is the affiliate program for?",
    answer:
      "It’s best for people who already like recommending great providers: friends, local connectors, creators, and anyone who wants a simple referral link they can share naturally.",
  },
  {
    question: "Do I need to be an existing patient to get a link?",
    answer:
      "No. You can generate your link right away with your name and email, then start sharing the pages and scripts that fit your audience.",
  },
  {
    question: "What can I promote?",
    answer:
      "You can promote qualifying procedures and products across the site, especially injectables, PRP treatments, intimate wellness care, and the product shelf.",
  },
  {
    question: "How are referrals tracked right now?",
    answer:
      "Your code is attached to the links you share. When someone visits with that link, we can carry that attribution into consult submissions and checkout activity.",
  },
  {
    question: "When do payouts happen?",
    answer:
      "Payout handling is still an early-stage manual process. The public-facing promise stays simple: 20% on qualifying referrals, with ops details handled behind the scenes.",
  },
  {
    question: "Can I make my own claims or before-and-after promises?",
    answer:
      "No. Affiliates should focus on trust, fit, and who Jenny helps well, while avoiding promises, guarantees, or medical claims that go beyond approved messaging.",
  },
];

export default function AffiliatesPage() {
  return (
    <>
      <StructuredData type="Breadcrumb" breadCrumbs={["Home", "Affiliates"]} />
      <StructuredData type="FAQ" faqs={affiliateFaqs} />

      <div className="max-w-xl md:max-w-7xl mx-auto md:px-8 z-10">
        <section className="px-6 py-16 md:px-0 md:py-24 lg:py-28" aria-labelledby="affiliate-hero-heading">
          <div className="text-center">
            <p className={sectionEyebrowClass}>Williamsburg Med Spa Affiliate Program</p>
            <h1
              id="affiliate-hero-heading"
              className="text-base-content mt-4 text-4xl/snug sm:text-5xl/snug md:text-6xl/snug font-light mx-auto max-w-5xl leading-tight"
            >
              Refer the right people to <span className="font-semibold">Jenny</span> and earn 20%.
            </h1>
            <p className="text-base-content text-xl lg:text-2xl mb-8 mt-6 max-w-3xl mx-auto">
              Get your referral link instantly, use the strongest scripts on the page, and share Williamsburg Med Spa
              in a way that feels personal, local, and high trust.
            </p>

            <div className="mx-auto flex max-w-3xl flex-wrap justify-center gap-2.5">
              {programHighlights.map((item) => (
                <span
                  key={item}
                  className="rounded-full border border-base-300 bg-base-100 px-3.5 py-1.5 text-sm text-base-content/70"
                >
                  {item}
                </span>
              ))}
            </div>

            <div className="mb-6 mt-8 flex flex-wrap justify-center gap-3 md:mb-0">
              <Button asChild>
                <a href="#apply">Get My Referral Link</a>
              </Button>
              <Button asChild variant="secondary">
                <a href="#share-guide">See Sample Scripts</a>
              </Button>
            </div>
          </div>
        </section>

        <section
          id="apply"
          className="mb-14 scroll-mt-24 px-6 py-6 md:mb-20 md:px-0 md:py-8 lg:py-10"
          aria-labelledby="affiliate-apply-heading"
        >
          <div className="mx-auto max-w-4xl text-center">
            <p className={sectionEyebrowClass}>Get your link</p>
            <h2 id="affiliate-apply-heading" className={sectionHeadingClass}>
              Start with one clean referral link and a simple sharing workflow.
            </h2>
            <p className={sectionBodyClass}>
              Create your code once, keep it tied to your name, and use the site as your referral toolkit whenever
              someone asks who you trust for injectables, PRP, or products.
            </p>
            <p className="mt-4 text-sm md:text-base leading-relaxed text-base-content/70">
              Your homepage link works immediately, and qualifying activity can stay attributed through consults and
              checkout once someone clicks through.
            </p>
          </div>

          <div className="mt-10 md:mt-12">
            <div className="mx-auto max-w-3xl">
              <AffiliateRegistrationForm variant="embedded" />
            </div>
          </div>

          <div className="mx-auto mt-10 max-w-5xl grid gap-4 md:grid-cols-3">
            {applyHighlights.map((item) => (
              <div key={item.title} className={surfaceCardClass}>
                <h3 className="text-lg font-medium text-base-content">{item.title}</h3>
                <p className="mt-2 text-sm leading-6 text-base-content/70">{item.description}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="mb-14 px-6 py-6 md:mb-20 md:px-0 md:py-8 lg:py-10" aria-labelledby="why-jenny-heading">
          <div className="mx-auto max-w-5xl">
            <article className="group relative isolate flex flex-col gap-8 md:flex-row-reverse md:items-center md:justify-between lg:gap-12">
              <div className="max-w-2xl flex-1">
                <p className={sectionEyebrowClass}>Why Jenny is easy to recommend</p>
                <h2 id="why-jenny-heading" className="mt-3 max-w-2xl text-3xl/snug md:text-4xl/snug font-light tracking-tight text-base-content text-balance">
                  People share providers they feel good sending friends to.
                </h2>
                <p className={sectionBodyClass}>
                  Jenny stands out because the experience feels calm, respectful, and human. Her pediatric nursing
                  background shaped a gentle bedside manner, and her long clinical career gives patients the sense that
                  they&apos;re being guided instead of sold to.
                </p>
                <p className="mt-4 text-sm md:text-base leading-relaxed text-base-content/70">
                  That combination matters. It makes Williamsburg Med Spa easier to recommend for first-time injectable
                  patients, people exploring intimate wellness topics privately, and anyone who wants a thoughtful
                  provider for PRP, products, or a quieter kind of aesthetic care.
                </p>

                <div className="mt-6">
                  <Button asChild variant="secondary">
                    <Link href="/staff/jenny-coleman">Read Jenny&apos;s staff profile</Link>
                  </Button>
                </div>
              </div>

              <div className="relative aspect-square w-full max-w-[18rem] overflow-hidden rounded-2xl bg-base-200 sm:max-w-[20rem] md:w-[17rem] lg:w-[19rem] md:shrink-0">
                <Image
                  src="/jenny.jpg"
                  alt="Jenny Coleman at Williamsburg Med Spa"
                  fill
                  sizes="(max-width: 640px) 70vw, (max-width: 1024px) 272px, 304px"
                  className="object-cover transition-transform duration-200 group-hover:scale-[1.02]"
                />
                <div className="absolute inset-0 bg-gradient-to-br from-white/10 via-transparent to-transparent" />
              </div>
            </article>

            <div className="mt-8 grid gap-4 md:grid-cols-3">
              {whyJenny.map((item) => (
                <div key={item.title} className={surfaceCardClass}>
                  <h3 className="text-lg font-medium text-base-content">{item.title}</h3>
                  <p className="mt-2 text-sm leading-6 text-base-content/70">{item.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="mb-14 px-6 py-6 md:mb-20 md:px-0 md:py-8 lg:py-10" id="what-to-promote">
          <div className="text-center">
            <p className={sectionEyebrowClass}>What to promote</p>
            <h2 className="text-base-content mt-4 text-4xl/snug sm:text-5xl/snug md:text-6xl/snug font-light mx-auto leading-tight pb-4">
              Start with the offers people already ask their friends about.
            </h2>
            <p className="text-lg lg:text-xl mb-8 max-w-5xl mx-auto">
              The easiest affiliate referrals usually happen when someone already has the problem and just needs a name
              they can trust. These are the three categories most likely to spark that kind of conversation.
            </p>
          </div>

          <div className="grid gap-8 lg:gap-10 mt-8 lg:my-12 xl:my-16 grid-cols-1 md:grid-cols-3">
            {promotionIdeas.map((item) => (
              <article key={item.title} className={surfaceCardClass}>
                <h3 className="text-2xl font-light text-base-content">{item.title}</h3>
                <p className="mt-3 text-base leading-relaxed text-base-content/75">{item.description}</p>
                <p className="mt-4 text-sm leading-6 text-base-content/60">
                  <span className="font-medium text-base-content/80">Best for:</span> {item.bestFor}
                </p>
                <div className="mt-5">
                  <Button asChild variant="secondary">
                    <Link href={item.href}>{item.cta}</Link>
                  </Button>
                </div>
              </article>
            ))}
          </div>
        </section>

        <section
          id="share-guide"
          className="mb-14 scroll-mt-24 px-6 py-6 md:mb-20 md:px-0 md:py-8 lg:py-10"
          aria-labelledby="share-guide-heading"
        >
          <div className="text-center">
            <p className={sectionEyebrowClass}>Share guide</p>
            <h2
              id="share-guide-heading"
              className="text-base-content mt-4 text-4xl/snug sm:text-5xl/snug md:text-6xl/snug font-light mx-auto leading-tight pb-4"
            >
              Keep the message personal, calm, and high trust.
            </h2>
            <p className="text-lg lg:text-xl mb-8 max-w-5xl mx-auto">
              The strongest referrals make Williamsburg Med Spa feel like a safe recommendation. Lead with trust, keep
              the problem specific, and let the page do the heavy lifting once someone clicks through.
            </p>
          </div>

          <div className="mt-8 grid gap-4 md:grid-cols-3">
            {sharePrinciples.map((item) => (
              <div key={item.title} className={surfaceCardClass}>
                <h3 className="text-xl font-light text-base-content">{item.title}</h3>
                <p className="mt-3 text-sm leading-6 text-base-content/70">{item.description}</p>
              </div>
            ))}
          </div>

          <div className="mt-10 grid gap-5 lg:grid-cols-2">
            <div className={`${surfaceCardClass} p-6`}>
              <p className="text-sm uppercase tracking-[0.18em] text-base-content/60">Do say</p>
              <ul className="mt-4 space-y-3 text-base leading-relaxed text-base-content/75">
                {guardrails.do.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </div>

            <div className={`${surfaceCardClass} p-6`}>
              <p className="text-sm uppercase tracking-[0.18em] text-base-content/60">Avoid saying</p>
              <ul className="mt-4 space-y-3 text-base leading-relaxed text-base-content/75">
                {guardrails.avoid.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </div>
          </div>

          <AffiliateShareScripts />
        </section>

        <section className="px-6 py-14 md:px-0 md:py-16" id="faq">
          <div className="mx-auto max-w-5xl">
            <p className={`${sectionEyebrowClass} text-center`}>FAQ</p>
            <h2 className="mt-4 text-3xl/snug md:text-4xl/snug font-light tracking-tight text-base-content text-center">
              Questions affiliates usually ask first
            </h2>

            <Accordion type="single" collapsible className="mt-10 text-left">
              {affiliateFaqs.map((faq) => (
                <AccordionItem key={faq.question} value={faq.question}>
                  <AccordionTrigger>{faq.question}</AccordionTrigger>
                  <AccordionContent>{faq.answer}</AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>
        </section>

        <section className="px-6 pb-16 pt-4 md:px-0 md:pb-20 md:pt-8">
          <div className="text-center">
            <h2 className="text-base-content text-4xl/snug sm:text-5xl/snug md:text-6xl/snug font-light mx-auto max-w-5xl leading-tight pb-4">
              Start sharing Williamsburg Med Spa with confidence.
            </h2>
            <h3 className="text-base-content text-xl lg:text-2xl max-w-2xl mb-8 mx-auto">
              Create your referral link in under a minute, then send people to the page that matches what they&apos;re
              actually asking about.
            </h3>
            <p className="mb-8 max-w-xl mx-auto">
              The affiliate page gives you the script. The site gives you the landing page. You just make the
              introduction.
            </p>
            <div className="flex flex-wrap justify-center gap-3">
              <Button asChild>
                <a href="#apply">Get My Referral Link</a>
              </Button>
              <Button asChild variant="secondary">
                <Link href="/procedures">Browse Procedures</Link>
              </Button>
            </div>
          </div>
        </section>
      </div>
    </>
  );
}
