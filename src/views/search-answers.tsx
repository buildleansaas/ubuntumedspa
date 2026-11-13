import React from "react";
import Link from "next/link";

// Searches the homepage shows up for, each answered under its own H2 (ScaleSleek f_vh33afabed, 2026-11-06).
// The clinic uses only Xeomin, and does not offer Hydrafacial or dermal fillers: each answer says so plainly.
export type SearchAnswer = {
  id: string;
  heading: string;
  question: string;
  answer: string;
  links: Array<{ href: string; label: string }>;
  more?: React.ReactNode;
};

export const getSearchAnswers = (xeominCash: string, xeominCard: string): SearchAnswer[] => [
  {
    id: "home-botox-alternative",
    heading: "A Botox alternative in Williamsburg, VA: we use Xeomin®",
    question: "Do you offer Botox® in Williamsburg?",
    answer: `No. We use Xeomin®, a wrinkle relaxer in the same category as Botox®, for frown lines, forehead lines, and crow's feet. Xeomin starts at ${xeominCash} cash (${xeominCard} by card or online), and Jenny Brady, MSN, RN, CPNP, PMHS plans every treatment.`,
    links: [
      { href: "/procedures/botox", label: "Botox alternative in Williamsburg, VA" },
      { href: "/procedures/xeomin", label: "Xeomin in Williamsburg" },
      { href: "/blog/botox-vs-xeomin-williamsburg-va", label: "Xeomin vs. Botox®" },
    ],
  },
  {
    id: "home-hydrafacial",
    heading: "Hydrafacial in Williamsburg, VA? We offer PRP Facial instead",
    question: "Do you offer Hydrafacial in Williamsburg?",
    answer:
      "No. Williamsburg Med Spa does not offer Hydrafacial. For glow, texture, and skin quality, ask about PRP Facial.",
    links: [],
    more: (
      <>
        <Link href="/procedures/prp-facial" className="link link-primary">
          PRP Facial
        </Link>{" "}
        is the in-office option to discuss. The{" "}
        <Link href="/blog/hydrafacial-alternatives-in-williamsburg-va" className="link link-primary">
          Hydrafacial alternatives guide
        </Link>{" "}
        explains the difference.
      </>
    ),
  },
  {
    id: "home-dermal-fillers",
    heading: "Dermal fillers in Williamsburg, VA: not offered here",
    question: "Do you offer dermal fillers in Williamsburg?",
    answer:
      "No. Williamsburg Med Spa does not offer dermal fillers, including lip filler. For lines that show when you frown, raise your brows, or squint, ask about Xeomin. For skin texture and glow, ask about PRP Facial.",
    links: [
      { href: "/procedures/xeomin", label: "Xeomin" },
      { href: "/procedures/prp-facial", label: "PRP Facial" },
    ],
  },
];

export default function SearchAnswers({ xeominCash, xeominCard }: { xeominCash: string; xeominCard: string }) {
  return (
    <section className="scroll-mt-28 border-t border-base-300 py-16 md:py-20" aria-label="Botox alternative, Hydrafacial, and dermal fillers in Williamsburg" data-search-answers>
      <div className="grid max-w-3xl gap-10">
        {getSearchAnswers(xeominCash, xeominCard).map((item) => (
          <article key={item.id} aria-labelledby={item.id}>
            <h2 id={item.id} className="font-display text-3xl font-medium leading-[1.15] tracking-tight text-base-content md:text-4xl">
              {item.heading}
            </h2>
            <p className="mt-4 max-w-[65ch] text-base leading-relaxed text-base-content/85 md:text-lg">
              <strong className="font-medium text-base-content">{item.question}</strong> {item.answer}
            </p>
            {item.more ? (
              <p className="mt-3 max-w-[65ch] text-base leading-relaxed text-base-content/85">{item.more}</p>
            ) : null}
            {item.links.length ? (
              <ul className="mt-3 flex flex-wrap gap-x-5 gap-y-2">
                {item.links.map((link) => (
                  <li key={link.href}>
                    <Link href={link.href} className="link link-primary text-sm">
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            ) : null}
          </article>
        ))}
      </div>
    </section>
  );
}
