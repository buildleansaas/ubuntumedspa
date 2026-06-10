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
    metaTitle: "Botox in Williamsburg, VA for Forehead Lines, Frown Lines & Crow's Feet",
    metaDescription:
      "Botox in Williamsburg, VA for forehead lines, frown lines, crow's feet, lip flip consults, pricing guidance, and natural-looking treatment planning with Jenny Coleman.",
    intro:
      "Conservative Botox treatment planning for frown lines, forehead lines, crow's feet, and natural-looking movement with Williamsburg Med Spa.",
    whyLocal:
      "Patients searching for Botox in Williamsburg often want a local injector who will explain dosing, timing, follow-up expectations, pricing, and how to avoid a frozen look.",
    treatmentPlanning:
      "Common Botox conversations include frown lines, forehead lines, crow's feet, lip flip consults, brow balance, and selected lower-face concerns when anatomy and goals fit.",
    trustNote:
      "Jenny Coleman, MSN, RN, CPNP, PMHS reviews your expression, goals, prior injectable history, timing, comfort level, and budget before recommending Botox, Xeomin, or another option.",
    consultNote:
      "During consultation, Jenny reviews your face at rest and with movement, prior injectable history, upcoming events, medication history, and whether Botox or Xeomin is the better fit.",
    heroImage: {
      src: "/procedure/williamsburg-botox-jenny-source.webp",
      alt: "Jenny Coleman at Williamsburg Med Spa",
      width: 540,
      height: 720,
    },
    heroChips: ["Forehead lines", "Frown lines / 11s", "Crow's feet", "Lip flip consults", "Botox vs Xeomin guidance", "$250 treatment-credit increments"],
    fitGuidance: {
      goodFit: [
        "You want to soften frown lines, forehead lines, or crow's feet without losing natural expression.",
        "You are planning around a wedding, reunion, photo session, or other event and want realistic timing guidance.",
        "You want help deciding whether Botox or Xeomin makes more sense for your movement pattern and prior treatment history.",
        "You prefer conservative treatment planning before committing to a dose or product.",
      ],
      considerInstead: [
        "If the concern is volume loss, dermal filler may be part of the conversation instead.",
        "If the concern is skin texture, Jenny may discuss skincare, PRP, or facial treatments instead of Botox alone.",
        "If you are pregnant, nursing, or have a medical contraindication, treatment may need to wait or change.",
        "If you want a permanent result or a promised outcome, Botox is not that kind of treatment.",
      ],
    },
    treatmentAreas: [
      {
        title: "Frown lines / 11 lines",
        body: "Between-the-brows lines from repeated expression. Treatment planning looks at muscle strength, brow position, and how much movement you want to keep.",
        href: "/procedures/botox/for/frown-lines",
      },
      {
        title: "Forehead lines",
        body: "Horizontal forehead movement lines where conservative dosing matters because over-treatment can affect brow heaviness.",
        href: "/procedures/botox/for/forehead-lines",
      },
      {
        title: "Crow's feet",
        body: "Smile lines around the eyes where the goal is often softening, not removing every sign of expression.",
        href: "/procedures/botox/for/crows-feet",
      },
      {
        title: "Lip flip consults",
        body: "A small neuromodulator plan may be discussed for selected patients, but it is different from lip filler and needs the right anatomy.",
        href: "/procedures/botox/for/lip-flip",
      },
      {
        title: "Brow balance and lower-face questions",
        body: "Some advanced areas can be discussed when anatomy, goals, and risk profile make them appropriate.",
      },
    ],
    pricing: {
      heading: "Botox pricing at Williamsburg Med Spa",
      body:
        "Botox is prepaid online in $250 treatment-credit blocks. The credit is applied to your Botox visit, and any unused value remains as account credit. Jenny reviews treatment areas, likely dosing range, and whether Botox or Xeomin is the better fit before confirming the plan.",
      note: "Final treatment cost depends on treatment areas, dose strategy, product choice, and candidacy.",
    },
    comparison: {
      heading: "Not sure whether Botox or Xeomin is better?",
      body:
        "Botox and Xeomin are both neuromodulators, but they are not interchangeable products. If you have used one before, want a natural-looking result, or are comparing options, Jenny can review your history and goals during consultation.",
      links: [
        { href: "/blog/botox-vs-xeomin-williamsburg-va", label: "Read the Botox vs Xeomin guide" },
        { href: "/procedures/xeomin/near/williamsburg-va", label: "View Xeomin in Williamsburg" },
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
      { title: "Product discussion", body: "Botox versus Xeomin is reviewed if your history, goals, or prior response make that comparison useful." },
      { title: "Treatment plan and pricing", body: "Areas, dose strategy, timing, and treatment-credit expectations are explained before treatment." },
      { title: "Aftercare and follow-up expectations", body: "Jenny reviews aftercare, onset timing, and the typical settling window so you know what to watch for." },
    ],
    providerNote: {
      heading: "Nurse-led Botox planning in Williamsburg",
      body:
        "Botox planning at Williamsburg Med Spa is consultation-first. Jenny Coleman, MSN, RN, CPNP, PMHS focuses on conservative, movement-aware treatment decisions so patients can ask questions before choosing a product or dose plan.",
      links: [
        { href: "/staff/jenny-coleman", label: "Meet Jenny Coleman" },
        { href: "/locations/williamsburg-va", label: "Williamsburg clinic details" },
      ],
    },
    faqs: [
      {
        question: "How long does Botox usually last?",
        answer:
          "Many patients notice Botox results for about three to four months, but timing varies by dose, treatment area, metabolism, and muscle activity.",
      },
      {
        question: "How much does Botox cost in Williamsburg?",
        answer:
          "Williamsburg Med Spa lists Botox in $250 treatment-credit increments. The credit is applied to your visit, and Jenny reviews areas, dosing, and whether Botox or Xeomin best fits your goals before confirming the plan.",
      },
      {
        question: "When should I book Botox before an event?",
        answer:
          "Plan ahead when possible. Botox can begin showing within a few days, but full settling often takes about two weeks, so event planning should leave enough time for assessment.",
      },
      {
        question: "Can Botox look natural?",
        answer:
          "Yes. The goal at Williamsburg Med Spa is conservative, movement-aware treatment planning that softens lines while preserving natural expression.",
      },
      {
        question: "What areas can Botox treat?",
        answer:
          "Common cosmetic conversations include frown lines, forehead lines, crow's feet, lip flip consults, brow balance, and selected lower-face areas when appropriate.",
      },
      {
        question: "Is Botox the same as Xeomin?",
        answer:
          "Botox and Xeomin are both neuromodulators, but they are different products. Jenny can review which option fits your goals, prior response, and treatment history.",
      },
      {
        question: "Am I a good candidate for Botox?",
        answer:
          "Candidacy depends on your health history, medications, pregnancy or nursing status, prior injectable history, and whether Botox or Xeomin better fits your movement pattern.",
      },
      {
        question: "Can Botox help with forehead lines?",
        answer:
          "Botox can be discussed for forehead movement lines, but dosing should be conservative and anatomy-aware because forehead treatment can affect brow position.",
      },
      {
        question: "Can Botox help with crow's feet?",
        answer:
          "Botox is commonly discussed for crow's feet around the eyes. The plan should account for smile movement and the level of softening you want.",
      },
      {
        question: "What should I avoid after Botox?",
        answer:
          "Jenny reviews aftercare at your visit. General guidance often includes avoiding rubbing the treated area, strenuous exercise, and certain heat or facial treatments for a short window after injection.",
      },
    ],
    relatedLinks: [
      { href: "/procedures/botox", label: "Main Botox service page" },
      { href: "/procedures/xeomin/near/williamsburg-va", label: "Xeomin in Williamsburg" },
      { href: "/blog/botox-vs-xeomin-williamsburg-va", label: "Botox vs Xeomin guide" },
      { href: "/procedures/filler/near/williamsburg-va", label: "Dermal fillers in Williamsburg" },
      { href: "/staff/jenny-coleman", label: "Meet Jenny Coleman" },
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
      "Dermal fillers in Williamsburg, VA with Jenny Coleman for lips, cheeks, under-eyes, facial balancing, pricing guidance, and natural-looking volume.",
    intro:
      "Williamsburg Med Spa plans dermal filler visits around facial balance, proportion, safety screening, and natural-looking volume rather than one-size-fits-all enhancement.",
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
        question: "How much do dermal fillers cost in Williamsburg?",
        answer:
          "Williamsburg Med Spa lists dermal filler at $700 per syringe. Jenny reviews the area, likely product amount, swelling expectations, and maintenance plan before treatment.",
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
      {
        question: "What safety questions should I ask before filler?",
        answer:
          "Ask about anatomy, product choice, swelling and bruising, vascular risk, reversibility for hyaluronic acid fillers, and what symptoms should prompt a call after treatment.",
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
