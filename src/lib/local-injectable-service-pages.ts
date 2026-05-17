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
  {
    procedureSlug: "filler",
    areaSlug: "williamsburg-va",
    serviceName: "Dermal Fillers",
    shortName: "Filler",
    areaName: "Williamsburg, VA",
    title: "Dermal Fillers in Williamsburg, VA",
    metaTitle: "Dermal Fillers in Williamsburg, VA | Lips, Cheeks & Facial Contour",
    metaDescription:
      "Dermal fillers in Williamsburg, VA with Williamsburg Med Spa for lips, cheeks, under-eyes, facial balancing, and conservative natural-looking volume.",
    intro:
      "Williamsburg Med Spa plans dermal filler visits around facial balance, proportion, and natural-looking volume rather than one-size-fits-all enhancement.",
    whyLocal:
      "Patients comparing dermal fillers in Williamsburg often want careful guidance on lips, cheeks, under-eyes, folds, facial contour, longevity, and what should or should not be treated.",
    treatmentPlanning:
      "Filler planning may include lip enhancement, cheek support, nasolabial folds, marionette lines, under-eye conversations, and facial balancing when appropriate.",
    trustNote:
      "Jenny Coleman reviews anatomy, prior filler history, medical considerations, and realistic expectations before recommending product choice or treatment timing.",
    consultNote:
      "During consultation, Jenny reviews your goals, facial movement, prior injectables, event timing, swelling expectations, and whether filler, Botox/Xeomin, PRP, or skincare would better match the concern.",
    faqs: [
      {
        question: "How long do dermal fillers usually last?",
        answer:
          "Longevity varies by product, treatment area, metabolism, and amount used. Many hyaluronic acid fillers last months to over a year depending on location and plan.",
      },
      {
        question: "Can filler look natural?",
        answer:
          "Yes. Conservative filler planning focuses on proportion, balance, and subtle support instead of changing the face dramatically.",
      },
      {
        question: "What areas can filler treat?",
        answer:
          "Common conversations include lips, cheeks, folds, marionette lines, under-eye support, and contour. Not every area is right for every patient.",
      },
      {
        question: "Is there downtime after filler?",
        answer:
          "Swelling, tenderness, and bruising can happen. Jenny reviews expected timing and aftercare before treatment, especially if you have an event coming up.",
      },
    ],
    relatedLinks: [
      { href: "/procedures/filler", label: "Main dermal filler service page" },
      { href: "/procedures/botox/near/williamsburg-va", label: "Botox in Williamsburg" },
      { href: "/locations/williamsburg-va", label: "Williamsburg clinic details" },
    ],
  },
  {
    procedureSlug: "xeomin",
    areaSlug: "williamsburg-va",
    serviceName: "Xeomin",
    shortName: "Xeomin",
    areaName: "Williamsburg, VA",
    title: "Xeomin in Williamsburg, VA",
    metaTitle: "Xeomin in Williamsburg, VA | Botox Alternative for Natural Movement",
    metaDescription:
      "Xeomin in Williamsburg, VA with Williamsburg Med Spa for frown lines, forehead lines, crow's feet, lip flip conversations, and natural-looking movement.",
    intro:
      "Williamsburg Med Spa offers Xeomin treatment planning for patients who want to soften expression lines while keeping natural facial movement.",
    whyLocal:
      "Patients researching Xeomin in Williamsburg often compare it with Botox and want a clear explanation of onset, dosing, treatment areas, and whether it fits their prior injectable history.",
    treatmentPlanning:
      "Xeomin may be considered for frown lines, forehead lines, crow's feet, bunny lines, lip flip conversations, and selected lower-face areas when anatomy and goals fit.",
    trustNote:
      "Jenny Coleman uses a conservative consultation-first approach so neuromodulator treatment is matched to your expression pattern, comfort level, and natural-looking goals.",
    consultNote:
      "During consultation, Jenny reviews your past response to neuromodulators, desired movement, timeline, medical history, and whether Xeomin or Botox is the better fit.",
    faqs: [
      {
        question: "Is Xeomin different from Botox?",
        answer:
          "Yes. Xeomin and Botox are both neuromodulators, but they are different products. Jenny can help compare options based on goals, treatment history, and response.",
      },
      {
        question: "How long does Xeomin last?",
        answer:
          "Many patients see results for about three to four months, but duration varies by dose, treatment area, metabolism, and muscle activity.",
      },
      {
        question: "Can Xeomin be used for a natural-looking result?",
        answer:
          "Yes. Conservative dosing and movement-aware planning can soften lines while preserving natural expression.",
      },
      {
        question: "What areas can Xeomin treat?",
        answer:
          "Common conversations include frown lines, forehead lines, crow's feet, bunny lines, lip flip, and selected lower-face areas when appropriate.",
      },
    ],
    relatedLinks: [
      { href: "/procedures/xeomin", label: "Main Xeomin service page" },
      { href: "/procedures/botox/near/williamsburg-va", label: "Botox in Williamsburg" },
      { href: "/locations/williamsburg-va", label: "Williamsburg clinic details" },
    ],
  },
];

export function getLocalInjectableServicePage(procedureSlug: string, areaSlug: string) {
  return localInjectableServicePages.find((page) => page.procedureSlug === procedureSlug && page.areaSlug === areaSlug);
}
