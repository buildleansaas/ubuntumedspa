import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";

import StructuredData from "components/structured-data";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "components/ui/accordion";
import { Button } from "components/ui/button";
import { buildPageMetadata } from "lib/metadata";

import AffiliateRegistrationForm from "./affiliate-registration-form";

export const metadata: Metadata = buildPageMetadata({
  title: "Affiliate Program | Williamsburg Med Spa",
  description:
    "Get your Williamsburg Med Spa referral link, learn what to say, and share Jenny Coleman’s services across the site.",
  canonical: "/affiliates",
});

const programHighlights = [
  "20% on qualifying referrals",
  "Instant referral link",
  "Share any page on the site",
  "Copy-ready text and scripts",
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
    title: "Injectables that feel approachable",
    description:
      "Botox, Xeomin, filler, and hyperhidrosis treatment are strong referral categories because people already ask their friends who they trust for injectables.",
    bestFor: "Friends asking about wrinkles, sweat control, lip filler, or natural-looking refreshes.",
    href: "/procedures",
    cta: "View procedures",
  },
  {
    title: "Intimate wellness and PRP care",
    description:
      "O-Shot, P-Shot, PRP Facial, PRP Face Lift, Hair Restoration, and Joint Restoration work well when your audience wants a discreet, regenerative option from someone gentle.",
    bestFor: "Private conversations, DMs, and one-to-one referrals where trust matters most.",
    href: "/procedures",
    cta: "Browse PRP treatments",
  },
  {
    title: "Products people can buy now",
    description:
      "The skincare and wellness shelf gives affiliates an easier entry point for people who want to start with a product before committing to an appointment.",
    bestFor: "Followers who want recommendations they can act on quickly from home.",
    href: "/products",
    cta: "See products",
  },
  {
    title: "Gentle specialty care",
    description:
      "Blohmdahl ear piercing and other comfort-first services give you a family-friendly, low-pressure way to introduce people to the practice.",
    bestFor: "Parents, local families, and people who value safety and a calm experience.",
    href: "/procedures/blohmdahl-ear-piercing",
    cta: "See ear piercing",
  },
];

const messagingPillars = [
  {
    title: "Lead with trust",
    description:
      "Talk about Jenny as someone who is calm, medically grounded, and easy to recommend to people who want to feel taken care of.",
  },
  {
    title: "Lead with the patient’s actual problem",
    description:
      "Dryness, reduced sensitivity, wrinkle prevention, excessive sweating, skincare frustration, or wanting a softer approach all convert better than generic beauty language.",
  },
  {
    title: "Lead with realistic outcomes",
    description:
      "Williamsburg Med Spa is a strong fit for people who want honest guidance, not hype, and a plan that feels personal instead of salesy.",
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

const shareScripts = [
  {
    title: "Text message to a friend",
    note: "Best for warm, personal referrals.",
    body:
      "If you’ve been thinking about Botox, filler, PRP, or even just getting a real opinion about what would help, I’d look at Williamsburg Med Spa. Jenny is incredibly gentle and really easy to trust. If you want, I can send you the link I use when I refer people there.",
  },
  {
    title: "Instagram story or short caption",
    note: "Best for casual social promotion.",
    body:
      "If you’re local and want aesthetic care that feels calm, honest, and not overdone, Williamsburg Med Spa is worth a look. Jenny is one of those providers people feel comfortable recommending to friends. PRP, injectables, products, and more.",
  },
  {
    title: "DM reply when someone asks who you trust",
    note: "Best for one-to-one conversations.",
    body:
      "I usually send people to Jenny at Williamsburg Med Spa. She has a very gentle approach, explains things clearly, and doesn’t make the whole experience feel intimidating. It’s a good option if you want someone thoughtful, especially for injectables or PRP.",
  },
  {
    title: "Neighborhood Facebook post",
    note: "Best for local community groups.",
    body:
      "For anyone in the Williamsburg area looking for a gentle med spa provider, Williamsburg Med Spa is a great local option. Jenny is known for calm, patient-focused care and natural-looking plans instead of a hard sell. They offer injectables, PRP treatments, and curated products.",
  },
  {
    title: "Email intro",
    note: "Best for private, higher-intent referrals.",
    body:
      "Wanted to share a local recommendation in case this is useful. Williamsburg Med Spa has become an easy place for me to send people because Jenny is experienced, gentle, and thoughtful about treatment planning. If you’ve been wanting a consult for injectables, PRP, or products, their site is a good place to start.",
  },
];

const howItWorks = [
  {
    step: "1",
    title: "Enter your name and email",
    description:
      "We generate your personal affiliate code instantly so you can start sharing without any extra setup.",
  },
  {
    step: "2",
    title: "Copy your link",
    description:
      "Start with your homepage link, then use the Share With Your Friends utility in the footer to turn any page into a referral link.",
  },
  {
    step: "3",
    title: "Share with confidence",
    description:
      "Use the scripts, talking points, and copy-ready text on this page to introduce Williamsburg Med Spa without overthinking it.",
  },
  {
    step: "4",
    title: "Earn on qualifying referrals",
    description:
      "When people book through your referral links, we can tie that activity back to your code across consults and paid orders.",
  },
];

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
        <section className="px-6 py-12 md:px-0 md:py-16 lg:py-20" aria-labelledby="affiliate-hero-heading">
          <div className="grid gap-10 lg:grid-cols-[minmax(0,1fr)_22rem] lg:items-start">
            <div className="max-w-4xl">
              <p className="text-[11px] uppercase tracking-[0.24em] text-base-content/60">
                Williamsburg Med Spa Affiliate Program
              </p>
              <h1
                id="affiliate-hero-heading"
                className="mt-4 text-4xl/snug sm:text-5xl/snug md:text-6xl/snug font-light tracking-tight text-base-content"
              >
                Refer the right people to <span className="font-semibold">Jenny</span> and earn 20%.
              </h1>
              <p className="mt-6 max-w-4xl text-lg md:text-xl leading-relaxed text-base-content/80">
                Enter your full name and email to get your referral link instantly. Then use the guide, scripts, and
                copy-ready text on this page to share Williamsburg Med Spa across the whole site.
              </p>

              <div className="mt-6 flex flex-wrap gap-2.5">
                {programHighlights.map((item) => (
                  <span
                    key={item}
                    className="rounded-full border border-base-300 bg-base-100 px-3.5 py-1.5 text-sm text-base-content/70"
                  >
                    {item}
                  </span>
                ))}
              </div>

              <div className="mt-8 flex flex-wrap gap-3">
                <Button asChild>
                  <a href="#apply">Get My Referral Link</a>
                </Button>
                <Button asChild variant="secondary">
                  <a href="#scripts">See Sample Scripts</a>
                </Button>
              </div>
            </div>

            <div className="rounded-[1.75rem] border border-base-300 bg-base-100 p-6 shadow-sm">
              <p className="text-sm uppercase tracking-[0.18em] text-base-content/60">How this can add up</p>
              <div className="mt-4 space-y-4 text-base leading-relaxed text-base-content/75">
                <p>
                  If you refer 2 or 3 friends in a month, it&apos;s easy to imagine an extra $500 or more. On stronger
                  months, a few high-ticket bookings can make the upside feel much bigger.
                </p>
                <p>
                  The simplest part: you don&apos;t have to invent the marketing yourself. We give you the guide, the
                  link, and a quick copy message. You just send people to the site.
                </p>
              </div>
            </div>
          </div>
        </section>

        <section className="px-6 py-6 md:px-0 md:py-8 lg:py-10" id="why-jenny">
          <div className="grid gap-10 lg:grid-cols-[19rem_minmax(0,1fr)] lg:items-center">
            <div className="relative aspect-square overflow-hidden rounded-[1.75rem] bg-base-200">
              <Image
                src="/jenny.jpg"
                alt="Jenny Coleman at Williamsburg Med Spa"
                fill
                sizes="(max-width: 1024px) 70vw, 304px"
                className="object-cover"
              />
            </div>

            <div>
              <p className="text-[11px] uppercase tracking-[0.24em] text-base-content/60">Why Jenny is easy to recommend</p>
              <h2 className="mt-4 text-3xl/snug md:text-4xl/snug font-light tracking-tight text-base-content">
                People market providers they feel good sending friends to.
              </h2>
              <p className="mt-4 max-w-3xl text-base md:text-lg leading-relaxed text-base-content/80">
                Jenny stands out because the experience feels calm, respectful, and human. Her pediatric nursing
                background shaped a gentle bedside manner, and her long clinical career gives patients the sense that
                they&apos;re being guided instead of sold to.
              </p>
              <p className="mt-4 max-w-3xl text-base md:text-lg leading-relaxed text-base-content/80">
                That combination matters. It makes Williamsburg Med Spa easier to recommend for first-time injectable
                patients, people exploring intimate wellness topics privately, and anyone who wants a thoughtful provider
                for PRP, products, or a quieter kind of aesthetic care.
              </p>

              <div className="mt-8 grid gap-4 md:grid-cols-3">
                {whyJenny.map((item) => (
                  <div key={item.title} className="rounded-2xl border border-base-300 bg-base-100 p-5 shadow-sm">
                    <h3 className="text-lg font-medium text-base-content">{item.title}</h3>
                    <p className="mt-2 text-sm leading-6 text-base-content/70">{item.description}</p>
                  </div>
                ))}
              </div>

              <div className="mt-6">
                <Button asChild variant="ghost" className="px-0 text-sm">
                  <Link href="/staff/jenny-coleman">Read Jenny&apos;s staff profile</Link>
                </Button>
              </div>
            </div>
          </div>
        </section>

        <section className="px-6 py-14 md:px-0 md:py-16" id="what-to-promote">
          <div className="max-w-4xl">
            <p className="text-[11px] uppercase tracking-[0.24em] text-base-content/60">What to promote</p>
            <h2 className="mt-4 text-3xl/snug md:text-4xl/snug font-light tracking-tight text-base-content">
              Start with offers people already ask their friends about.
            </h2>
            <p className="mt-4 text-base md:text-lg leading-relaxed text-base-content/80">
              The easiest affiliate referrals usually happen when someone already has the problem and just needs a name
              they can trust. These are the categories most likely to spark that kind of conversation.
            </p>
          </div>

          <div className="mt-10 grid gap-5 lg:grid-cols-2">
            {promotionIdeas.map((item) => (
              <article key={item.title} className="rounded-[1.5rem] border border-base-300 bg-base-100 p-6 shadow-sm">
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

        <section className="px-6 py-14 md:px-0 md:py-16" id="messaging">
          <div className="max-w-4xl">
            <p className="text-[11px] uppercase tracking-[0.24em] text-base-content/60">Messaging playbook</p>
            <h2 className="mt-4 text-3xl/snug md:text-4xl/snug font-light tracking-tight text-base-content">
              Market the trust, not just the treatment menu.
            </h2>
            <p className="mt-4 text-base md:text-lg leading-relaxed text-base-content/80">
              The strongest referrals make Williamsburg Med Spa feel like a safe recommendation. People respond better
              to “Jenny is thoughtful and gentle” than to generic med spa hype.
            </p>
          </div>

          <div className="mt-10 grid gap-5 lg:grid-cols-3">
            {messagingPillars.map((item) => (
              <div key={item.title} className="rounded-2xl border border-base-300 bg-base-100 p-6 shadow-sm">
                <h3 className="text-xl font-light text-base-content">{item.title}</h3>
                <p className="mt-3 text-sm leading-6 text-base-content/70">{item.description}</p>
              </div>
            ))}
          </div>

          <div className="mt-10 grid gap-5 lg:grid-cols-2">
            <div className="rounded-[1.5rem] border border-base-300 bg-base-100 p-6 shadow-sm">
              <p className="text-sm uppercase tracking-[0.18em] text-base-content/60">Do say</p>
              <ul className="mt-4 space-y-3 text-base leading-relaxed text-base-content/75">
                {guardrails.do.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </div>

            <div className="rounded-[1.5rem] border border-base-300 bg-base-100 p-6 shadow-sm">
              <p className="text-sm uppercase tracking-[0.18em] text-base-content/60">Avoid saying</p>
              <ul className="mt-4 space-y-3 text-base leading-relaxed text-base-content/75">
                {guardrails.avoid.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </div>
          </div>
        </section>

        <section className="px-6 py-14 md:px-0 md:py-16" id="scripts">
          <div className="max-w-4xl">
            <p className="text-[11px] uppercase tracking-[0.24em] text-base-content/60">Copy-and-paste scripts</p>
            <h2 className="mt-4 text-3xl/snug md:text-4xl/snug font-light tracking-tight text-base-content">
              Use these as starting points, then make them sound like you.
            </h2>
            <p className="mt-4 text-base md:text-lg leading-relaxed text-base-content/80">
              The best-performing referrals usually sound natural, local, and personal. Keep the tone helpful. Don’t
              oversell. Just point the right people toward the provider you trust.
            </p>
          </div>

          <div className="mt-10 grid gap-5 lg:grid-cols-2">
            {shareScripts.map((item) => (
              <article key={item.title} className="rounded-[1.5rem] border border-base-300 bg-base-100 p-6 shadow-sm">
                <p className="text-sm uppercase tracking-[0.18em] text-base-content/60">{item.title}</p>
                <p className="mt-2 text-sm leading-6 text-base-content/60">{item.note}</p>
                <div className="mt-5 rounded-2xl bg-base-200/70 px-5 py-5 text-base leading-relaxed text-base-content/80 whitespace-pre-wrap">
                  {item.body}
                </div>
              </article>
            ))}
          </div>
        </section>

        <section className="px-6 py-14 md:px-0 md:py-16" id="how-it-works">
          <div className="max-w-4xl">
            <p className="text-[11px] uppercase tracking-[0.24em] text-base-content/60">How it works</p>
            <h2 className="mt-4 text-3xl/snug md:text-4xl/snug font-light tracking-tight text-base-content">
              Start simple. Keep it high trust.
            </h2>
          </div>

          <div className="mt-10 grid gap-5 md:grid-cols-2 xl:grid-cols-4">
            {howItWorks.map((item) => (
              <div key={item.step} className="rounded-[1.5rem] border border-base-300 bg-base-100 p-6 shadow-sm">
                <p className="text-sm uppercase tracking-[0.18em] text-base-content/50">Step {item.step}</p>
                <h3 className="mt-3 text-2xl font-light text-base-content">{item.title}</h3>
                <p className="mt-3 text-sm leading-6 text-base-content/70">{item.description}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="px-6 py-14 md:px-0 md:py-16 scroll-mt-24" id="apply">
          <div className="max-w-4xl">
            <p className="text-[11px] uppercase tracking-[0.24em] text-base-content/60">Get your link</p>
            <h2 className="mt-4 text-3xl/snug md:text-4xl/snug font-light tracking-tight text-base-content">
              Get your referral code in under a minute.
            </h2>
            <p className="mt-4 text-base md:text-lg leading-relaxed text-base-content/80">
              Start with a homepage link, then use the footer share utility to create page-specific links anywhere on
              the site.
            </p>
          </div>

          <div className="mt-10">
            <AffiliateRegistrationForm />
          </div>
        </section>

        <section className="px-6 py-14 md:px-0 md:py-16 max-w-5xl mx-auto" id="faq">
          <p className="text-[11px] uppercase tracking-[0.24em] text-base-content/60 text-center">FAQ</p>
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
        </section>
      </div>
    </>
  );
}
