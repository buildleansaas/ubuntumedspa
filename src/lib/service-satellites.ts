import { COMMERCE_CATALOG_BY_SLUG } from "config/commerce-catalog";
import { procedures } from "data";
import { cardPriceLabel, cashCardLabel, cashCardProse, formatUsdShort } from "lib/price";
import { TIMES_PROMPT } from "lib/text-to-book";

/**
 * Satellite pages around three service hubs (2026-11 Search Console gaps):
 * - hyperhidrosis concern pages: /procedures/hyperhidrosis-treatment/for/{underarm-sweating,sweaty-palms,sweaty-feet}
 * - PRP Breast Lift and PRP Face Lift area pages: /procedures/{prp-breast-lift,prp-face-lift}/near/{newport-news-va,yorktown-va}
 *
 * Every fact here comes from existing site copy (src/data.ts, /locations, the hub pages). Prices come from the catalog,
 * cash first. PRP Breast Lift copy reuses the hub's reviewed wording and is scanned by the same unsupported-claim
 * detectors as the hub (scripts/lib/prp-breast-claims.mjs).
 */

export type SatelliteHubSlug = "hyperhidrosis-treatment" | "prp-breast-lift" | "prp-face-lift";
export type SatelliteFaq = { question: string; answer: string };
export type SatelliteSection = {
  heading: string;
  paragraphs?: string[];
  bullets?: string[];
  steps?: { title: string; description: string }[];
};
export type SatelliteLink = { href: string; label: string };

export type ServiceSatellitePage = {
  kind: "concern" | "near";
  hubSlug: SatelliteHubSlug;
  /** Concern slug (for /for/) or area slug (for /near/). */
  slug: string;
  /** Short label used in hub and sibling links, e.g. "Sweaty palms" or "Newport News". */
  label: string;
  /** One line under the label in the hub's link grid. */
  linkDescription: string;
  metaTitle: string;
  metaDescription: string;
  h1: string;
  eyebrow: string;
  intro: string[];
  price: { heading: string; label: string; body: string };
  sections: SatelliteSection[];
  /** Risk wording, copied from the hub. */
  safety?: { heading: string; body: string };
  faqs: SatelliteFaq[];
  /** /locations/<area> for near pages. */
  locationHref?: string;
  consultHref: string;
  ctaLabel: string;
  /** Prefilled text to Jenny (text-or-call booking). */
  textMessage: string;
};

const HUB_LABELS: Record<SatelliteHubSlug, string> = {
  "hyperhidrosis-treatment": "Hyperhidrosis Treatment",
  "prp-breast-lift": "PRP Breast Lift",
  "prp-face-lift": "PRP Face Lift",
};

export const hubPath = (hubSlug: SatelliteHubSlug) => `/procedures/${hubSlug}`;
export const satellitePath = (page: Pick<ServiceSatellitePage, "kind" | "hubSlug" | "slug">) =>
  `/procedures/${page.hubSlug}/${page.kind === "concern" ? "for" : "near"}/${page.slug}`;

const cashCents = (slug: SatelliteHubSlug) => {
  const item = COMMERCE_CATALOG_BY_SLUG[slug];
  if (!item) throw new Error(`Unknown catalog slug ${slug}`);
  return item.cashAmountCents;
};

const hubFaqAnswer = (hubSlug: SatelliteHubSlug, question: string) => {
  const answer = procedures.find((procedure) => procedure.slug === hubSlug)?.faqs.find((faq) => faq.question === question)?.answer;
  if (!answer) throw new Error(`${hubSlug} hub is missing the FAQ "${question}"`);
  return answer;
};

const textMessage = (about: string) => `Hi Jenny. I'm interested in ${about}. ${TIMES_PROMPT}`;

const CLINIC_ADDRESS = "3900 Powhatan Parkway, Williamsburg, VA 23188";
const SERVICE_AREA_LINE =
  "Patients come from Williamsburg, James City County, Yorktown, Newport News, and nearby Hampton Roads communities to the clinic at 3900 Powhatan Parkway in Williamsburg.";

// ---------------------------------------------------------------------------------------------------------------
// Hyperhidrosis concern pages
// ---------------------------------------------------------------------------------------------------------------

const HYPERHIDROSIS_CASH_CENTS = cashCents("hyperhidrosis-treatment");
const hyperhidrosisCash = formatUsdShort(HYPERHIDROSIS_CASH_CENTS);
const hyperhidrosisCard = cardPriceLabel(HYPERHIDROSIS_CASH_CENTS);

/** The hub's side-effect wording ("Temporary injection-site tenderness, bruising, or localized weakness can happen..."). */
export const HYPERHIDROSIS_SIDE_EFFECTS = hubFaqAnswer("hyperhidrosis-treatment", "Are there any side effects?");
const HYPERHIDROSIS_RELIEF = hubFaqAnswer("hyperhidrosis-treatment", "How long can relief last?");
const HYPERHIDROSIS_ONSET = hubFaqAnswer("hyperhidrosis-treatment", "How soon can I see results?");
const HYPERHIDROSIS_CAUSES = hubFaqAnswer("hyperhidrosis-treatment", "What causes hyperhidrosis?");

const hyperhidrosisPrice = (area: string) => ({
  heading: `${area} treatment pricing`,
  label: `From ${cashCardLabel(HYPERHIDROSIS_CASH_CENTS)}`,
  body: `Hyperhidrosis treatment starts at ${cashCardProse(HYPERHIDROSIS_CASH_CENTS)}, paid in full for one treatment visit. Ask Jenny to confirm the price for your treatment plan before you book.`,
});

const hyperhidrosisSafety = { heading: "Side effects and safety", body: HYPERHIDROSIS_SIDE_EFFECTS };

const hyperhidrosisCostFaq = (area: string): SatelliteFaq => ({
  question: `How much does ${area} treatment cost?`,
  answer: `Hyperhidrosis treatment starts at ${hyperhidrosisCash} in cash, or ${hyperhidrosisCard} online or by card, for one treatment visit. Ask Jenny to confirm the price for your treatment plan.`,
});

const hyperhidrosisLocalFaq: SatelliteFaq = {
  question: "Do you see patients from Newport News, Yorktown, and Hampton Roads?",
  answer: `Yes. ${SERVICE_AREA_LINE} There is one clinic location.`,
};

const hyperhidrosisSurgeryFaq: SatelliteFaq = {
  question: "Is this treatment surgical?",
  answer: "No. Xeomin-based hyperhidrosis treatment is non-surgical and performed in-office.",
};

const hyperhidrosisConsultHref = (slug: string) =>
  `/consult?procedure=hyperhidrosis-treatment&intent=${slug}&utm_source=website&utm_medium=intent_page&utm_campaign=hyperhidrosis_${slug.replace(/-/g, "_")}`;

const hyperhidrosisConcernPages: ServiceSatellitePage[] = [
  {
    kind: "concern",
    hubSlug: "hyperhidrosis-treatment",
    slug: "underarm-sweating",
    label: "Underarm sweating",
    linkDescription: "Axillary hyperhidrosis: sweat marks, extra shirts, and outfits planned around sweat.",
    metaTitle: `Underarm Sweating Treatment Williamsburg VA | From ${hyperhidrosisCash}`,
    metaDescription: `Underarm sweating (axillary hyperhidrosis) treatment in Williamsburg, VA with Xeomin®. From ${hyperhidrosisCash} cash, ${hyperhidrosisCard} card. Text or call Jenny.`,
    h1: "Underarm Sweating Treatment in Williamsburg, VA",
    eyebrow: "Hyperhidrosis treatment area",
    intro: [
      "Underarm sweating treatment at Williamsburg Med Spa uses Xeomin® placed in a mapped pattern across the underarm to reduce the nerve signal that activates sweat glands in that area.",
      "Jenny Brady, MSN, RN, CPNP, PMHS reviews your sweating pattern, health history, and what you have already tried before recommending treatment.",
    ],
    price: hyperhidrosisPrice("Underarm sweating"),
    sections: [
      {
        heading: "When underarm sweating starts making decisions for you",
        paragraphs: [
          "Planning outfits around sweat marks, carrying extra shirts, or avoiding raised-arm moments at work and events are common reasons patients ask about underarm treatment.",
          "Stronger deodorants, powder, and layered clothing help some people. When they are not enough, localized treatment is worth a conversation.",
        ],
      },
      {
        heading: "How treatment works",
        paragraphs: [
          "Xeomin is placed in a mapped treatment pattern across the underarm. It reduces the nerve signal that tells sweat glands in that zone to produce sweat.",
          "Treatment is localized to the underarm, so your body still sweats normally in other areas.",
          HYPERHIDROSIS_ONSET,
        ],
      },
      {
        heading: "What to expect",
        steps: [
          {
            title: "Consultation and mapping",
            description: "Jenny assesses your sweat pattern, symptom severity, and goals so the treatment map matches your anatomy.",
          },
          {
            title: "In-office treatment",
            description: "Injections are done in a short appointment. There is no surgery.",
          },
          {
            title: "Response review",
            description: "Sweat reduction builds over days. Follow-up is based on your response.",
          },
          {
            title: "Maintenance planning",
            description: "Relief is temporary, so a maintenance schedule is set around your activity level and when sweating returns.",
          },
        ],
      },
    ],
    safety: hyperhidrosisSafety,
    faqs: [
      hyperhidrosisCostFaq("underarm sweating"),
      { question: "How long does relief last?", answer: HYPERHIDROSIS_RELIEF },
      {
        question: "Will I still sweat normally?",
        answer: "Yes. Treatment is localized to the underarm area, so your body still sweats normally in other areas for temperature regulation.",
      },
      { question: "What are the side effects?", answer: HYPERHIDROSIS_SIDE_EFFECTS },
      { question: "What causes excessive underarm sweating?", answer: HYPERHIDROSIS_CAUSES },
      hyperhidrosisSurgeryFaq,
      hyperhidrosisLocalFaq,
    ],
    consultHref: hyperhidrosisConsultHref("underarm-sweating"),
    ctaLabel: "Book an Underarm Sweating Consultation",
    textMessage: textMessage("hyperhidrosis treatment for underarm sweating"),
  },
  {
    kind: "concern",
    hubSlug: "hyperhidrosis-treatment",
    slug: "sweaty-palms",
    label: "Sweaty palms",
    linkDescription: "Palmar hyperhidrosis: sweaty hands during handshakes, writing, phone use, and workouts.",
    metaTitle: `Sweaty Palms Treatment Williamsburg VA | From ${hyperhidrosisCash}`,
    metaDescription: `Sweaty hands (palmar hyperhidrosis) treatment in Williamsburg, VA with Xeomin®. From ${hyperhidrosisCash} cash, ${hyperhidrosisCard} card. Text or call Jenny.`,
    h1: "Sweaty Palms Treatment in Williamsburg, VA",
    eyebrow: "Hyperhidrosis treatment area",
    intro: [
      "Sweaty palms treatment at Williamsburg Med Spa uses Xeomin® placed at mapped points across the palms to reduce the nerve signal that drives overactive sweating in the hands.",
      "Jenny Brady, MSN, RN, CPNP, PMHS reviews how sweaty hands affect your work and daily life, your health history, and what you have already tried before recommending treatment.",
    ],
    price: hyperhidrosisPrice("Sweaty palms"),
    sections: [
      {
        heading: "When sweaty hands affect work and social confidence",
        paragraphs: [
          "Sweaty palms can get in the way of handshakes, phone and keyboard use, writing, gym workouts, and precision work. For many patients the worry is as frustrating as the moisture.",
          "If antiperspirants and home strategies have not been enough, a targeted treatment plan for the palms is worth discussing.",
        ],
      },
      {
        heading: "How treatment works for palmar hyperhidrosis",
        paragraphs: [
          "The treatment map and injection pattern are adapted for palm anatomy and symptoms. Both palms are commonly treated in the same session when clinically appropriate.",
          "Treatment is localized, so it is aimed at the palms while your body keeps sweating normally elsewhere.",
          HYPERHIDROSIS_ONSET,
        ],
      },
      {
        heading: "What to expect",
        steps: [
          {
            title: "Symptom review",
            description: "Jenny reviews severity, triggers, daily impact, and prior therapies to decide whether palm treatment is a good fit.",
          },
          {
            title: "Mapped palm treatment",
            description: "Treatment is done in the clinic with a mapped approach for both palms.",
          },
          {
            title: "Follow-up",
            description: "Your response is reviewed after treatment so future sessions can be adjusted.",
          },
          {
            title: "Maintenance scheduling",
            description: "A maintenance interval is based on how long relief holds and how quickly sweating returns.",
          },
        ],
      },
    ],
    safety: hyperhidrosisSafety,
    faqs: [
      hyperhidrosisCostFaq("sweaty palms"),
      {
        question: "Is palm treatment different from underarm treatment?",
        answer: "Yes. The treatment map and injection pattern are adapted for palm anatomy and symptoms.",
      },
      {
        question: "Can both hands be treated in one visit?",
        answer: "Yes, both palms are commonly treated in the same session when clinically appropriate.",
      },
      { question: "How long does relief last?", answer: HYPERHIDROSIS_RELIEF },
      { question: "What are the side effects?", answer: HYPERHIDROSIS_SIDE_EFFECTS },
      hyperhidrosisSurgeryFaq,
      hyperhidrosisLocalFaq,
    ],
    consultHref: hyperhidrosisConsultHref("sweaty-palms"),
    ctaLabel: "Book a Sweaty Palms Consultation",
    textMessage: textMessage("hyperhidrosis treatment for sweaty palms"),
  },
  {
    kind: "concern",
    hubSlug: "hyperhidrosis-treatment",
    slug: "sweaty-feet",
    label: "Sweaty feet",
    linkDescription: "Plantar hyperhidrosis: slippery shoes, friction, and moisture through long shifts.",
    metaTitle: `Sweaty Feet Treatment Williamsburg VA | From ${hyperhidrosisCash}`,
    metaDescription: `Sweaty feet (plantar hyperhidrosis) treatment in Williamsburg, VA with Xeomin®. From ${hyperhidrosisCash} cash, ${hyperhidrosisCard} card. Text or call Jenny.`,
    h1: "Sweaty Feet Treatment in Williamsburg, VA",
    eyebrow: "Hyperhidrosis treatment area",
    intro: [
      "Sweaty feet treatment at Williamsburg Med Spa uses Xeomin® in a mapped pattern on the feet to reduce the nerve signal to overactive sweat glands in the treated area.",
      "Jenny Brady, MSN, RN, CPNP, PMHS reviews your symptom pattern, footwear, activity level, and health history before recommending treatment.",
    ],
    price: hyperhidrosisPrice("Sweaty feet"),
    sections: [
      {
        heading: "When moisture in your shoes becomes an everyday problem",
        paragraphs: [
          "Excess foot sweating can mean slippery footwear, skin irritation, odor concerns, and less confidence when shoes come off. It often gets worse with long shifts, workouts, and warm weather.",
          "If powders, moisture-wicking socks, or topical products have not given you enough control, treatment is a more direct way to discuss reducing sweat activity.",
        ],
      },
      {
        heading: "How Xeomin is used for plantar sweating",
        paragraphs: [
          "Treatment targets the nerve signals to overactive sweat glands in the feet. The plan is adjusted around your symptom pattern, footwear habits, and activity level.",
          HYPERHIDROSIS_ONSET,
        ],
      },
      {
        heading: "What to expect",
        steps: [
          {
            title: "Sweat-zone mapping",
            description: "Jenny maps the areas of the feet where moisture causes the most slipping, friction, or discomfort.",
          },
          {
            title: "In-office treatment",
            description: "Xeomin is used in a mapped approach on the high-impact sweat zones of the feet.",
          },
          {
            title: "Response check",
            description: "You watch how symptoms change over the following days and review your response at follow-up if needed.",
          },
          {
            title: "Long-term management",
            description: "Results are temporary, so maintenance timing is set around work, exercise, and seasonal changes.",
          },
        ],
      },
    ],
    safety: hyperhidrosisSafety,
    faqs: [
      hyperhidrosisCostFaq("sweaty feet"),
      {
        question: "Can this help with sweating that affects shoe comfort?",
        answer: "Many patients ask about treatment when moisture causes slipping, friction, or frequent shoe changes. Jenny reviews whether treatment fits your pattern at the consultation.",
      },
      {
        question: "Will I need repeated sessions?",
        answer: "Most patients need maintenance over time because results are temporary and vary by individual.",
      },
      { question: "What are the side effects?", answer: HYPERHIDROSIS_SIDE_EFFECTS },
      hyperhidrosisSurgeryFaq,
      hyperhidrosisLocalFaq,
    ],
    consultHref: hyperhidrosisConsultHref("sweaty-feet"),
    ctaLabel: "Book a Sweaty Feet Consultation",
    textMessage: textMessage("hyperhidrosis treatment for sweaty feet"),
  },
];

// ---------------------------------------------------------------------------------------------------------------
// PRP Breast Lift and PRP Face Lift area pages
// ---------------------------------------------------------------------------------------------------------------

type NearArea = {
  slug: "newport-news-va" | "yorktown-va";
  name: string;
  /** Route wording from /locations and the area's location page. */
  route: string;
};

const NEAR_AREAS: NearArea[] = [
  {
    slug: "newport-news-va",
    name: "Newport News",
    route: "Many patients take I-64 west toward Route 199 and New Town, then continue to Powhatan Parkway.",
  },
  {
    slug: "yorktown-va",
    name: "Yorktown",
    route: "Many patients come by the Colonial Parkway or take I-64 to Route 199 before heading toward Powhatan Parkway.",
  },
];

/** Drive time as stated on /locations ("Yorktown and Newport News: Typically 25–35 minutes"). */
export const PENINSULA_DRIVE_TIME = "typically 25–35 minutes";

const BREAST_CASH_CENTS = cashCents("prp-breast-lift");
const FACE_LIFT_CASH_CENTS = cashCents("prp-face-lift");

const breastLiftNearPage = (area: NearArea): ServiceSatellitePage => ({
  kind: "near",
  hubSlug: "prp-breast-lift",
  slug: area.slug,
  label: area.name,
  linkDescription: `${area.name} drive time, the one-visit price, and what to ask before you book.`,
  metaTitle: `PRP Breast Lift ${area.name} VA | Not Surgery, ${formatUsdShort(BREAST_CASH_CENTS)} Cash`,
  metaDescription: `PRP breast lift near ${area.name}, VA: the visit (${formatUsdShort(BREAST_CASH_CENTS)} cash, ${cardPriceLabel(BREAST_CASH_CENTS)} card) is in Williamsburg. It is not surgery and promises no result.`,
  h1: `PRP Breast Lift near ${area.name}, VA`,
  eyebrow: `${area.name} service area`,
  intro: [
    `If you are comparing a breast lift near ${area.name}, start here. The PRP visit (${cashCardProse(BREAST_CASH_CENTS)}) is not mastopexy, implants, or fat transfer, and this page does not promise a cosmetic result.`,
    `There is no ${area.name} office. The clinic is Williamsburg Med Spa at ${CLINIC_ADDRESS}, ${PENINSULA_DRIVE_TIME} by car from ${area.name}.`,
  ],
  price: {
    heading: "One-visit price",
    label: cashCardLabel(BREAST_CASH_CENTS),
    body: `Full upfront payment for one treatment visit is ${cashCardProse(BREAST_CASH_CENTS)}. The checkout is for one visit. Contact the clinic before purchasing if you need the current service details or written purchase terms.`,
  },
  sections: [
    {
      heading: `Getting to Williamsburg from ${area.name}`,
      paragraphs: [
        `The drive from ${area.name} is ${PENINSULA_DRIVE_TIME}, depending on your starting point, route, and traffic. ${area.route}`,
        "Build in a traffic buffer around school, bridge, and commuter times.",
      ],
    },
    {
      heading: "Questions to settle before you make the drive",
      steps: [
        {
          title: "Define the change you want",
          description: "Write down the appearance concern you want to discuss so you can compare this service with other cosmetic or surgical options.",
        },
        {
          title: "Request the current service details",
          description: "Ask the clinic what happens during the service, what the visit includes, and which written terms govern the purchase.",
        },
        {
          title: "Ask what is and is not promised",
          description: "Request a direct explanation of the intended cosmetic goal, the limits of that goal, and whether the clinic promises any result or timeline.",
        },
        {
          title: "Compare the alternatives",
          description: "If your goal involves removing skin, repositioning tissue, or adding volume, compare this service with an appropriate surgical consultation before deciding.",
        },
      ],
    },
  ],
  faqs: [
    {
      question: `Is there a ${area.name} office?`,
      answer: `No. There is no ${area.name} street address. Appointments are at ${CLINIC_ADDRESS}, ${PENINSULA_DRIVE_TIME} by car from ${area.name}.`,
    },
    {
      question: "How much is the PRP Breast Lift?",
      answer: `${cashCardProse(BREAST_CASH_CENTS)} for one treatment visit. The checkout is for one visit.`,
    },
    {
      question: "Is a PRP Breast Lift the same as surgery?",
      answer:
        "No. The PRP visit is not mastopexy, implants, or fat transfer. Do not treat the service name as a promise of the skin removal, tissue repositioning, or volume change associated with those procedures.",
    },
    {
      question: "Does this page promise a result or timeline?",
      answer:
        "No. This page does not promise a cosmetic result, degree of change, response timeline, or duration. Ask the clinic to identify any promise it makes before you purchase.",
    },
    {
      question: `How do I book from ${area.name}?`,
      answer: "Text or call Jenny at (804) 738-9483, or send a consultation request. Ask for the current service details and written purchase terms before you pay.",
    },
  ],
  locationHref: `/locations/${area.slug}`,
  consultHref: `/consult?procedure=prp-breast-lift&area=${area.slug}&utm_source=website&utm_medium=local_service_page&utm_campaign=prp_breast_lift_${area.slug.replace(/-/g, "_")}`,
  ctaLabel: "Book a Private PRP Breast Consultation",
  textMessage: textMessage(`the PRP Breast Lift. I'm coming from ${area.name}`),
});

const faceLiftNearPage = (area: NearArea): ServiceSatellitePage => ({
  kind: "near",
  hubSlug: "prp-face-lift",
  slug: area.slug,
  label: area.name,
  linkDescription: `${area.name} drive time, the one-visit price, and what the combined visit includes.`,
  metaTitle: `PRP Face Lift ${area.name} VA | ${formatUsdShort(FACE_LIFT_CASH_CENTS)} Cash, Non-Surgical`,
  metaDescription: `PRP Face Lift near ${area.name}, VA: Xeomin® and the PRP Facial in one non-surgical visit. ${formatUsdShort(FACE_LIFT_CASH_CENTS)} cash, ${cardPriceLabel(FACE_LIFT_CASH_CENTS)} card. Results vary.`,
  h1: `PRP Face Lift near ${area.name}, VA`,
  eyebrow: `${area.name} service area`,
  intro: [
    `The PRP Face Lift is a non-surgical visit that combines two treatments: Xeomin® for movement lines and the PRP Facial for skin texture and tone. It is not a surgical face lift, and results vary.`,
    `There is no ${area.name} office. The clinic is Williamsburg Med Spa at ${CLINIC_ADDRESS}, ${PENINSULA_DRIVE_TIME} by car from ${area.name}.`,
  ],
  price: {
    heading: "One-visit price",
    label: cashCardLabel(FACE_LIFT_CASH_CENTS),
    body: `The PRP Face Lift is ${cashCardProse(FACE_LIFT_CASH_CENTS)} for one treatment visit that includes both Xeomin and the PRP Facial. Before anything is done, Jenny reviews your goals, health history, and whether this combined visit, one treatment alone, or a referral is the better fit.`,
  },
  sections: [
    {
      heading: "What the visit combines",
      bullets: [
        "Xeomin®, the clinic's wrinkle relaxer (a Botox® alternative), temporarily relaxes the muscles behind movement lines such as frown lines, forehead lines, and crow's feet.",
        "The PRP Facial uses platelet-rich plasma from a small sample of your own blood to support skin texture and tone.",
        "It does not remove or tighten skin the way surgery does.",
        "The visit usually takes about an hour, including preparation and the treatment itself.",
      ],
    },
    {
      heading: `Getting to Williamsburg from ${area.name}`,
      paragraphs: [
        `The drive from ${area.name} is ${PENINSULA_DRIVE_TIME}, depending on your starting point, route, and traffic. ${area.route}`,
        "Build in a traffic buffer around school, bridge, and commuter times.",
      ],
    },
  ],
  safety: {
    heading: "Side effects",
    body: hubFaqAnswer("prp-face-lift", "Are there any side effects?"),
  },
  faqs: [
    {
      question: `Is there a ${area.name} office?`,
      answer: `No. There is no ${area.name} street address. Appointments are at ${CLINIC_ADDRESS}, ${PENINSULA_DRIVE_TIME} by car from ${area.name}.`,
    },
    {
      question: "How much is the PRP Face Lift?",
      answer: `${cashCardProse(FACE_LIFT_CASH_CENTS)} for one treatment visit with both Xeomin and the PRP Facial.`,
    },
    {
      question: "How is the PRP Face Lift different from a traditional face lift?",
      answer: hubFaqAnswer("prp-face-lift", "How is the PRP Face Lift different from a traditional face lift?"),
    },
    {
      question: "How long do the results last?",
      answer: hubFaqAnswer("prp-face-lift", "How long do the results last?"),
    },
    {
      question: `How do I book from ${area.name}?`,
      answer: "Text or call Jenny at (804) 738-9483, or send a consultation request. The plan is set at your consultation.",
    },
  ],
  locationHref: `/locations/${area.slug}`,
  consultHref: `/consult?procedure=prp-face-lift&area=${area.slug}&utm_source=website&utm_medium=local_service_page&utm_campaign=prp_face_lift_${area.slug.replace(/-/g, "_")}`,
  ctaLabel: "Book a PRP Face Lift Consultation",
  textMessage: textMessage(`the PRP Face Lift. I'm coming from ${area.name}`),
});

export const serviceSatellitePages: ServiceSatellitePage[] = [
  ...hyperhidrosisConcernPages,
  ...NEAR_AREAS.map(breastLiftNearPage),
  ...NEAR_AREAS.map(faceLiftNearPage),
];

export const getServiceSatellitePage = (hubSlug: SatelliteHubSlug, kind: ServiceSatellitePage["kind"], slug: string) =>
  serviceSatellitePages.find((page) => page.hubSlug === hubSlug && page.kind === kind && page.slug === slug);

export const getSatellitesForHub = (hubSlug: string) => serviceSatellitePages.filter((page) => page.hubSlug === hubSlug);

/** The links a satellite page renders: its hub, its siblings, and (near pages) the area's location page. */
export const getSatelliteLinks = (page: ServiceSatellitePage): SatelliteLink[] => {
  const hub = { href: hubPath(page.hubSlug), label: `${HUB_LABELS[page.hubSlug]} in Williamsburg` };
  const siblings = getSatellitesForHub(page.hubSlug)
    .filter((sibling) => sibling !== page)
    .map((sibling) => ({
      href: satellitePath(sibling),
      label:
        sibling.kind === "concern"
          ? `${sibling.label} treatment`
          : `${HUB_LABELS[sibling.hubSlug]} near ${sibling.label}`,
    }));
  const location = page.locationHref ? [{ href: page.locationHref, label: `Med spa near ${page.label}` }] : [];
  return [hub, ...siblings, ...location];
};

/** The link grid a hub page renders for its satellites (null when the hub has none). */
export const getHubSatelliteGroup = (hubSlug: string) => {
  const pages = getSatellitesForHub(hubSlug);
  if (!pages.length) return null;
  const isConcern = pages[0].kind === "concern";
  return {
    eyebrow: isConcern ? "Treatment areas" : "Nearby pages",
    heading: isConcern ? "Start with the area that bothers you most" : "Coming from the Peninsula?",
    intro: isConcern
      ? "Each page covers how treatment works for that area, what to expect, side effects, and pricing."
      : `There is one clinic, at ${CLINIC_ADDRESS}. These pages cover the drive (${PENINSULA_DRIVE_TIME}), the one-visit price, and how to book.`,
    links: pages.map((page) => ({
      href: satellitePath(page),
      label: page.kind === "concern" ? page.label : `${HUB_LABELS[page.hubSlug]} near ${page.label}`,
      description: page.linkDescription,
    })),
  };
};

export const serviceSatellitePaths = serviceSatellitePages.map(satellitePath);

/** Fixed template copy the satellite view renders around the page data (kept here so tests scan it too). */
export const SATELLITE_TEMPLATE_COPY = {
  pricingEyebrow: "Pricing",
  faqHeading: "Questions",
  relatedHeading: "Related pages",
  bookHeading: "Text or call Jenny to book",
  bookIntro: "Text Jenny with the days and times that work for you, or call (804) 738-9483. You can also send a consultation request.",
  hubButton: (hubSlug: SatelliteHubSlug) => `${HUB_LABELS[hubSlug]} Details`,
};

export const satelliteHubLabel = (hubSlug: SatelliteHubSlug) => HUB_LABELS[hubSlug];
