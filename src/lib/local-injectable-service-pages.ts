import { COMMERCE_CATALOG_BY_SLUG } from "config/commerce-catalog";
import { cardPriceLabel, formatUsdShort } from "lib/price";

// The clinic offers Botox® and Xeomin®, priced the same (Botox is back from 2026-11-20). The procedureSlug "botox" entry
// below is the Botox page (these /near/williamsburg-va URLs redirect to the main pages).
const xeominBlockCashCents = COMMERCE_CATALOG_BY_SLUG.xeomin.cashAmountCents;
const xeominBlock = formatUsdShort(xeominBlockCashCents);
const xeominBlockPrices = `${xeominBlock} cash, ${cardPriceLabel(xeominBlockCashCents)} online by card`;

export type LocalInjectableServicePage = {
  procedureSlug: "botox" | "xeomin";
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
  heroImage?: {
    src: string;
    alt: string;
    width: number;
    height: number;
  };
  heroChips?: string[];
  fitGuidance?: {
    goodFit: string[];
    considerInstead: string[];
  };
  treatmentAreas?: Array<{ title: string; body: string; href?: string }>;
  pricing?: {
    heading: string;
    body: string;
    note: string;
  };
  comparison?: {
    heading: string;
    body: string;
    links: Array<{ href: string; label: string }>;
    image?: {
      src: string;
      alt: string;
      width: number;
      height: number;
    };
  };
  consultationSteps?: Array<{ title: string; body: string }>;
  providerNote?: {
    heading: string;
    body: string;
    links: Array<{ href: string; label: string }>;
  };
};

export const localInjectableServicePages: LocalInjectableServicePage[] = [
  {
    procedureSlug: "botox",
    areaSlug: "williamsburg-va",
    serviceName: "Botox",
    shortName: "Botox",
    areaName: "Williamsburg, VA",
    title: "Botox in Williamsburg, VA",
    metaTitle: "Botox in Williamsburg, VA | Botox & Xeomin, Same Price",
    metaDescription:
      `Botox® in Williamsburg, VA for frown lines, forehead lines, and crow's feet. We also offer Xeomin®, priced the same. ${xeominBlock} cash per credit block.`,
    intro:
      "Williamsburg Med Spa offers Botox® and Xeomin®, priced the same, planned conservatively for frown lines, forehead lines, crow's feet, and natural-looking movement. Jenny helps you choose.",
    whyLocal:
      "Patients searching for Botox in Williamsburg often want a local injector who will explain dosing, timing, follow-up expectations, and pricing, and whether Botox or Xeomin suits them better.",
    treatmentPlanning:
      "Common Botox conversations include frown lines, forehead lines, crow's feet, neck bands, lip flip consults, brow balance, and selected lower-face concerns when anatomy and goals fit.",
    trustNote:
      "Jenny Brady, MSN, RN, CPNP, PMHS reviews your expression, goals, prior injectable history, timing, comfort level, and budget before recommending Botox, Xeomin, or another option.",
    consultNote:
      "During consultation, Jenny reviews your face at rest and with movement, prior injectable history, upcoming events, and medication history before planning Botox or Xeomin.",
    heroImage: {
      src: "/procedure/williamsburg-botox-jenny-ai-consultation.webp",
      alt: "Jenny Brady reviewing Botox and Xeomin planning at Williamsburg Med Spa",
      width: 1536,
      height: 1024,
    },
    heroChips: ["Forehead lines", "Frown lines / 11s", "Crow's feet", "Neck bands", "Botox or Xeomin guidance", `${xeominBlock} credit blocks (${xeominBlock} cash, ${cardPriceLabel(xeominBlockCashCents)} card)`],
    fitGuidance: {
      goodFit: [
        "You want to soften frown lines, forehead lines, or crow's feet without losing natural expression.",
        "You are planning around a wedding, reunion, photo session, or other event and want realistic timing guidance.",
        "You have had Botox® or Xeomin® elsewhere and want to continue, or want to understand how the two compare for your movement pattern.",
        "You prefer conservative treatment planning before committing to a dose.",
      ],
      considerInstead: [
        "If the concern is volume loss rather than movement lines, a wrinkle relaxer is not the right tool, and Jenny can explain what may fit better.",
        "If the concern is skin texture, Jenny may discuss skincare, PRP, or facial treatments instead of a wrinkle relaxer alone.",
        "If you are pregnant, nursing, or have a medical contraindication, treatment may need to wait or change.",
        "If you want a permanent result or a promised outcome, Xeomin is not that kind of treatment.",
      ],
    },
    treatmentAreas: [
      {
        title: "Frown lines / 11 lines",
        body: "Between-the-brows lines from repeated expression. Treatment planning looks at muscle strength, brow position, and how much movement you want to keep.",
      },
      {
        title: "Forehead lines",
        body: "Horizontal forehead movement lines where conservative dosing matters because over-treatment can affect brow heaviness.",
      },
      {
        title: "Crow's feet",
        body: "Smile lines around the eyes where the goal is often softening, not removing every sign of expression.",
      },
      {
        title: "Lip flip consults",
        body: "A small neuromodulator plan may be discussed for selected patients. It relaxes the lip muscle rather than adding volume, and it needs the right anatomy.",
      },
      {
        title: "Brow balance and lower-face questions",
        body: "Some advanced areas can be discussed when anatomy, goals, and risk profile make them appropriate.",
      },
    ],
    pricing: {
      heading: "Botox pricing at Williamsburg Med Spa",
      body:
        `Botox is prepaid online in ${xeominBlock} treatment-credit blocks (${xeominBlockPrices}), the same as Xeomin. The credit is applied to your visit, and any unused value remains as account credit. Jenny reviews treatment areas and likely dosing range before confirming the plan.`,
      note: "Final treatment cost depends on treatment areas, dose strategy, and candidacy. Xeomin and Botox® units are not interchangeable, so compare full treatment plans, not unit prices.",
    },
    comparison: {
      heading: "Botox or Xeomin? How they compare",
      body:
        "Xeomin and Botox® are both neuromodulators, but they are not interchangeable products and their units do not convert one to one. Williamsburg Med Spa offers both. If you have had either one elsewhere, Jenny can review your history and goals during consultation.",
      links: [
        { href: "/blog/botox-vs-xeomin-williamsburg-va", label: "Read the Botox vs Xeomin guide" },
        { href: "/procedures/xeomin", label: "Main Xeomin service page" },
      ],
      image: {
        src: "/procedure/botox-xeomin-consultation-planning.webp",
        alt: "Botox and Xeomin consultation planning in Williamsburg",
        width: 1400,
        height: 933,
      },
    },
    consultationSteps: [
      { title: "Movement review", body: "Jenny reviews your face at rest and with expression so the plan matches how your muscles actually move." },
      { title: "Goal setting", body: "You discuss subtle softening, stronger smoothing, event timing, and how much natural movement you want to keep." },
      { title: "Prior treatment history", body: "If you have had Botox®, Xeomin®, or another wrinkle relaxer elsewhere, that history is reviewed before a dose is planned." },
      { title: "Treatment plan and pricing", body: "Areas, dose strategy, timing, and treatment-credit expectations are explained before treatment." },
      { title: "Aftercare and follow-up expectations", body: "Jenny reviews aftercare, onset timing, and the typical settling window so you know what to watch for." },
    ],
    providerNote: {
      heading: "Nurse-led Botox and Xeomin planning in Williamsburg",
      body:
        "Botox and Xeomin planning at Williamsburg Med Spa is consultation-first. Jenny Brady, MSN, RN, CPNP, PMHS focuses on conservative, movement-aware treatment decisions so patients can ask questions before choosing a dose plan.",
      links: [
        { href: "/staff/jenny-brady", label: "Meet Jenny Brady" },
        { href: "/locations/williamsburg-va", label: "Williamsburg clinic details" },
      ],
    },
    faqs: [
      {
        question: "Do you offer Botox®?",
        answer:
          "Yes. Williamsburg Med Spa offers Botox® Cosmetic and Xeomin®, priced the same, for frown lines, forehead lines, and crow's feet. Units are not interchangeable, so compare the full treatment plan, not a unit price.",
      },
      {
        question: "How long does Xeomin usually last?",
        answer:
          "Many patients notice Xeomin results for about three to four months, but timing varies by dose, treatment area, metabolism, and muscle activity.",
      },
      {
        question: "How much does Xeomin cost in Williamsburg?",
        answer:
          `Williamsburg Med Spa lists Xeomin in ${xeominBlock} treatment-credit blocks (${xeominBlockPrices}). The credit is applied to your visit, and Jenny reviews areas and dosing before confirming the plan.`,
      },
      {
        question: "When should I book Xeomin before an event?",
        answer:
          "Plan ahead when possible. Xeomin can begin showing within a few days, but full settling often takes about two weeks, so event planning should leave enough time for assessment.",
      },
      {
        question: "Can a wrinkle relaxer look natural?",
        answer:
          "Yes. The goal at Williamsburg Med Spa is conservative, movement-aware Xeomin planning that softens lines while preserving natural expression.",
      },
      {
        question: "Is Xeomin the same as Botox®?",
        answer:
          "Xeomin and Botox® are both neuromodulators, but they are different products and their units are not interchangeable. Williamsburg Med Spa offers both, and Jenny helps you choose.",
      },
      {
        question: "What should I avoid after Xeomin?",
        answer:
          "Jenny reviews aftercare at your visit. General guidance often includes avoiding rubbing the treated area, strenuous exercise, and certain heat or facial treatments for a short window after injection.",
      },
    ],
    relatedLinks: [
      { href: "/procedures/botox", label: "Botox in Williamsburg" },
      { href: "/procedures/xeomin", label: "Main Xeomin service page" },
      { href: "/blog/botox-vs-xeomin-williamsburg-va", label: "Xeomin vs Botox guide" },
      { href: "/staff/jenny-brady", label: "Meet Jenny Brady" },
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
    metaTitle: "Xeomin in Williamsburg, VA | Botox Also Offered, Same Price",
    metaDescription:
      "Xeomin in Williamsburg, VA with Williamsburg Med Spa for frown lines, forehead lines, crow's feet, lip flip conversations, and natural-looking movement.",
    intro:
      "Xeomin® is one of the clinic's two wrinkle relaxers, alongside Botox®, planned for patients who want to soften expression lines while keeping natural facial movement.",
    whyLocal:
      "Patients researching Xeomin in Williamsburg often compare it with Botox and want a clear explanation of onset, dosing, treatment areas, and whether it fits their prior injectable history.",
    treatmentPlanning:
      "Xeomin may be considered for frown lines, forehead lines, crow's feet, bunny lines, lip flip conversations, and selected lower-face areas when anatomy and goals fit.",
    trustNote:
      "Jenny Brady uses a conservative consultation-first approach so neuromodulator treatment is matched to your expression pattern, comfort level, and natural-looking goals.",
    consultNote:
      "During consultation, Jenny reviews your past response to neuromodulators, desired movement, timeline, medical history, and how Xeomin compares with any treatment you have had elsewhere.",
    faqs: [
      {
        question: "Is Xeomin different from Botox®?",
        answer:
          "Yes. Xeomin and Botox® are both neuromodulators, but they are different products and their units are not interchangeable. Williamsburg Med Spa offers both, priced the same.",
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
      { href: "/procedures/botox", label: "Botox in Williamsburg" },
      { href: "/locations/williamsburg-va", label: "Williamsburg clinic details" },
    ],
  },
];

export function getLocalInjectableServicePage(procedureSlug: string, areaSlug: string) {
  return localInjectableServicePages.find((page) => page.procedureSlug === procedureSlug && page.areaSlug === areaSlug);
}
