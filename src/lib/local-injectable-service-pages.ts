export type LocalInjectableServicePage = {
  procedureSlug: "botox" | "filler" | "xeomin";
  areaSlug: "williamsburg-va";
  serviceName: string;
  shortName: string;
  areaName: string;
  title: string;
  metaTitle: string;
  metaDescription: string;
  intro: string;
  whyLocal: string;
  treatmentPlanning: string;
  trustNote: string;
  consultNote: string;
  faqs: Array<{ question: string; answer: string }>;
  relatedLinks: Array<{ href: string; label: string }>;
};

export const localInjectableServicePages: LocalInjectableServicePage[] = [
  {
    procedureSlug: "botox",
    areaSlug: "williamsburg-va",
    serviceName: "Botox",
    shortName: "Botox",
    areaName: "Williamsburg, VA",
    title: "Botox in Williamsburg, VA",
    metaTitle: "Botox in Williamsburg, VA | Natural-Looking Treatment Planning",
    metaDescription:
      "Botox in Williamsburg, VA with Jenny Coleman at Williamsburg Med Spa for frown lines, forehead lines, crow's feet, and conservative natural-looking results.",
    intro:
      "Williamsburg Med Spa plans Botox treatments around your expression, goals, anatomy, and comfort level so the result looks refreshed rather than overdone.",
    whyLocal:
      "Patients searching for Botox in Williamsburg often want a local injector who will explain dosing, timing, follow-up expectations, and how to avoid a frozen look.",
    treatmentPlanning:
      "Common Botox areas include frown lines, forehead lines, crow's feet, brow shaping support, lip flip conversations, and selected lower-face concerns when appropriate.",
    trustNote:
      "Jenny Coleman, MSN, RN, CPNP, PMHS brings a medical background and conservative planning style to injectable visits, with education before treatment decisions.",
    consultNote:
      "During consultation, Jenny reviews your expression at rest and with movement, prior injectable history, upcoming events, medication history, and whether Botox or Xeomin is the better fit.",
    faqs: [
      {
        question: "How long does Botox usually last?",
        answer:
          "Many patients notice Botox results for about three to four months, but timing varies by dose, treatment area, metabolism, and muscle activity.",
      },
      {
        question: "When should I book Botox before an event?",
        answer:
          "Plan ahead when possible. Botox can begin showing within a few days, but full settling often takes about two weeks, so event planning should leave enough time for assessment.",
      },
      {
        question: "Can Botox look natural?",
        answer:
          "Yes. The goal at Williamsburg Med Spa is conservative, movement-aware treatment planning that softens lines while preserving a natural expression.",
      },
      {
        question: "Is Botox the same as Xeomin?",
        answer:
          "Botox and Xeomin are both neuromodulators, but they are different products. Jenny can review which option fits your goals, prior response, and treatment history.",
      },
    ],
    relatedLinks: [
      { href: "/procedures/botox", label: "Main Botox service page" },
      { href: "/procedures/xeomin/near/williamsburg-va", label: "Xeomin in Williamsburg" },
      { href: "/locations/williamsburg-va", label: "Williamsburg clinic details" },
    ],
  },
];

export function getLocalInjectableServicePage(procedureSlug: string, areaSlug: string) {
  return localInjectableServicePages.find((page) => page.procedureSlug === procedureSlug && page.areaSlug === areaSlug);
}
