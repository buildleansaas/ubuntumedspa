import React from "react";

// The homepage's own questions (unchanged copy). The search answers render as their own H2s (views/search-answers),
// so this list holds only these, and nothing shows twice.
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

// Native <details>: every answer is in the server HTML, so the visible FAQ matches the FAQPage schema.
export default function HomeQuestions() {
  return (
    <section className="w-full scroll-mt-28 py-16 md:py-24" aria-labelledby="home-faq-heading">
      <div className="grid gap-10 lg:grid-cols-[minmax(0,0.8fr)_minmax(0,1.6fr)] lg:gap-20">
        <div>
          <p className="text-sm text-base-content/65">Williamsburg med spa FAQ</p>
          <h2
            id="home-faq-heading"
            className="font-display mt-3 text-3xl leading-tight tracking-tight text-base-content md:text-[2.6rem]"
          >
            Quick answers before you book
          </h2>
        </div>
        <div className="border-t border-base-300">
          {homeFaqs.map((faq) => (
            <details key={faq.question} className="group border-b border-base-300">
              <summary className="flex cursor-pointer list-none items-start justify-between gap-6 rounded-sm py-6 [&::-webkit-details-marker]:hidden">
                <h3 className="font-display text-xl leading-snug text-base-content md:text-[1.4rem]">{faq.question}</h3>
                <span
                  aria-hidden="true"
                  className="inline-flex h-7 w-7 shrink-0 items-center justify-center rounded-full border border-base-300 text-base-content/60 transition-transform group-open:rotate-45"
                >
                  +
                </span>
              </summary>
              <p className="max-w-[65ch] pb-7 text-base leading-relaxed text-base-content/75">{faq.answer}</p>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}
