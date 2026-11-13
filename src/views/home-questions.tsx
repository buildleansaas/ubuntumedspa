import React from "react";
import Link from "next/link";

import { getSearchAnswers } from "views/search-answers";

// The homepage's own questions (unchanged copy).
export const homeFaqs = [
  {
    question: "What medical spa services are available in Williamsburg, VA?",
    answer:
      "Williamsburg Med Spa offers Xeomin® (our wrinkle relaxer and a Botox® alternative), PRP treatments, hyperhidrosis care, OH-Shot services, and Blomdahl medical ear piercing in Williamsburg, VA. We do not offer Botox® brand.",
  },
  {
    question: "Who provides treatments at Williamsburg Med Spa?",
    answer:
      "Treatments are provided by Jenny Brady, MSN, RN, CPNP, PMHS, a Cellular Medicine Association-certified OH-Shot provider and certified Blomdahl provider, with a focus on conservative planning, patient education, and natural-looking goals.",
  },
  {
    question: "Does Williamsburg Med Spa serve nearby areas?",
    answer:
      "Yes. Patients visit from Williamsburg, James City County, Kingsmill, New Town, Yorktown, Newport News, Toano, Norge, Lightfoot, and Ford's Colony.",
  },
];

/** Every question shown on the homepage, in order. The FAQPage schema and the visible list both come from here. */
export const getHomeFaqs = (xeominCash: string, xeominCard: string) => [
  ...getSearchAnswers(xeominCash, xeominCard).map(({ question, answer }) => ({ question, answer })),
  ...homeFaqs,
];

const inlineList = (links: Array<{ href: string; label: string }>) =>
  links.map((link, index) => (
    <React.Fragment key={link.href}>
      {index > 0 ? (index === links.length - 1 ? " and " : ", ") : null}
      <Link href={link.href} className="link link-primary">
        {link.label}
      </Link>
    </React.Fragment>
  ));

function Question({ question, children }: { question: string; children: React.ReactNode }) {
  return (
    <details className="group border-b border-base-300">
      <summary className="flex cursor-pointer list-none items-start justify-between gap-6 rounded-sm py-6 [&::-webkit-details-marker]:hidden">
        <h3 className="font-display text-xl leading-snug text-base-content md:text-[1.4rem]">{question}</h3>
        <span
          aria-hidden="true"
          className="mt-1 inline-flex h-7 w-7 shrink-0 items-center justify-center rounded-full border border-base-300 text-base-content/60 transition-transform group-open:rotate-45"
        >
          +
        </span>
      </summary>
      <div className="max-w-[65ch] pb-7 text-base leading-relaxed text-base-content/80">{children}</div>
    </details>
  );
}

// The three search answers (wrinkle relaxer, Hydrafacial, dermal fillers) keep their exact text; their links stay inline.
export default function HomeQuestions({ xeominCash, xeominCard }: { xeominCash: string; xeominCard: string }) {
  return (
    <section className="w-full py-16 md:py-24" aria-labelledby="home-faq-heading" data-search-answers>
      <div className="grid gap-10 lg:grid-cols-[minmax(0,0.8fr)_minmax(0,1.6fr)] lg:gap-20">
        <h2 id="home-faq-heading" className="font-display text-3xl leading-tight tracking-tight text-base-content md:text-[2.6rem]">
          Questions
        </h2>
        <div className="border-t border-base-300">
          {getSearchAnswers(xeominCash, xeominCard).map((item) => (
            <Question key={item.id} question={item.question}>
              <p>{item.answer}</p>
              {item.more ? <p className="mt-3">{item.more}</p> : null}
              {item.links.length ? <p className="mt-3">More: {inlineList(item.links)}.</p> : null}
            </Question>
          ))}
          {homeFaqs.map((faq) => (
            <Question key={faq.question} question={faq.question}>
              <p>{faq.answer}</p>
            </Question>
          ))}
        </div>
      </div>
    </section>
  );
}
