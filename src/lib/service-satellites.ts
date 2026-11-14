import { XEOMIN_HYPERHIDROSIS_OFF_LABEL } from "lib/xeomin-concerns";
import { COMMERCE_CATALOG_BY_SLUG } from "config/commerce-catalog";
import { procedures } from "data";
import { cardPriceLabel, cashCardLabel, cashCardProse, formatUsdShort } from "lib/price";
import { TIMES_PROMPT } from "lib/text-to-book";
import {
  XEOMIN_COMPARISON_PATH,
  XEOMIN_COST_PATH,
  XEOMIN_HUB_PATH,
  XEOMIN_LIP_FLIP_OFF_LABEL,
  XEOMIN_SEEK_HELP,
  XEOMIN_SIDE_EFFECTS,
  XEOMIN_TRADEMARK_NOTE,
  xeominConcernPages,
} from "lib/xeomin-concerns";

/**
 * Satellite pages around four service hubs (2026-11 Search Console gaps):
 * - hyperhidrosis concern pages: /procedures/hyperhidrosis-treatment/for/{underarm-sweating,sweaty-palms,sweaty-feet}
 * - PRP Breast Lift and PRP Face Lift area pages: /procedures/{prp-breast-lift,prp-face-lift}/near/{newport-news-va,yorktown-va}
 * - Xeomin area pages for Peninsula searchers: /procedures/xeomin/near/{newport-news-va,yorktown-va}
 *
 * Every fact here comes from existing site copy (src/data.ts, /locations, the hub pages, lib/xeomin-concerns.ts). Prices come from the catalog,
 * cash first. PRP Breast Lift copy reuses the hub's reviewed wording and is scanned by the same unsupported-claim
 * detectors as the hub (scripts/lib/prp-breast-claims.mjs).
 */

export type SatelliteHubSlug = "hyperhidrosis-treatment" | "prp-breast-lift" | "prp-face-lift" | "xeomin";
export type SatelliteFaq = { question: string; answer: string };
/** The two Peninsula drives the route map draws (components/peninsula-route-map.tsx). */
export type PeninsulaRoute = "newport-news" | "yorktown";
export type SatelliteSection = {
  heading: string;
  paragraphs?: string[];
  bullets?: string[];
  steps?: { title: string; description: string }[];
  /** Draw the Peninsula route map for this drive (the near pages' travel section). */
  routeMap?: PeninsulaRoute;
};
/** The drive summary a route card shows: the map, the drive time, the route steps, and a Google Maps link. */
export type SatelliteRoute = { map: PeninsulaRoute; driveTime: string; steps: string[]; directionsHref: string; appleDirectionsHref: string };
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
  /** Other related pages the area's /locations page already points to. */
  extraLinks?: SatelliteLink[];
  consultHref: string;
  ctaLabel: string;
  /** Prefilled text to Jenny (text-or-call booking). */
  textMessage: string;
  /** Small print at the end of the page (the Xeomin pages' trademark note). */
  footnote?: string;
};

const HUB_LABELS: Record<SatelliteHubSlug, string> = {
  "hyperhidrosis-treatment": "Hyperhidrosis Treatment",
  "prp-breast-lift": "PRP Breast Lift",
  "prp-face-lift": "PRP Face Lift",
  xeomin: "Xeomin",
};

export const hubPath = (hubSlug: SatelliteHubSlug) => `/procedures/${hubSlug}`;
export const satellitePath = (page: Pick<ServiceSatellitePage, "kind" | "hubSlug" | "slug">) =>
  `/procedures/${page.hubSlug}/${page.kind === "concern" ? "for" : "near"}/${page.slug}`;

const cashCents = (slug: SatelliteHubSlug) => {
  const item = COMMERCE_CATALOG_BY_SLUG[slug];
  if (!item) throw new Error(`Unknown catalog slug ${slug}`);
  return item.cashAmountCents;
};

const hubFaqAnswer = (hubSlug: SatelliteHubSlug | "botox", question: string) => {
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
  body: `Hyperhidrosis treatment starts at ${cashCardProse(HYPERHIDROSIS_CASH_CENTS)}, paid in full for one treatment visit.`,
});

const hyperhidrosisSafety = { heading: "Side effects and safety", body: `${HYPERHIDROSIS_SIDE_EFFECTS} ${XEOMIN_HYPERHIDROSIS_OFF_LABEL}` };

/** Palms only: the hub's "localized weakness" in the hands. Source: onabotulinumtoxinA prescribing information §1.6 Limitations of Use (DailyMed setid 33d066a9-34ff-4a1a-b38b-d10983df3300), hand-muscle weakness with palmar use. */
export const PALM_WEAKNESS_NOTE =
  "For palm treatment, that localized weakness can be temporary weakness in the hand muscles, so ask Jenny about timing around work that needs a firm grip or fine hand control.";

const hyperhidrosisCostFaq = (area: string): SatelliteFaq => ({
  question: `How much does ${area} treatment cost?`,
  answer: `Hyperhidrosis treatment starts at ${hyperhidrosisCash} in cash, or ${hyperhidrosisCard} online or by card, for one treatment visit.`,
});

const hyperhidrosisLocalFaq: SatelliteFaq = {
  question: "Do you see patients from Newport News, Yorktown, and Hampton Roads?",
  answer: `Yes. ${SERVICE_AREA_LINE}`,
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
          "Treatment is localized to the underarm, so your body can still sweat normally in other areas.",
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
        answer: "Treatment is localized to the underarm area, so your body can still sweat normally in other areas for temperature regulation.",
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
          "Treatment is localized to the palms, so your body can still sweat normally in other areas.",
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
    safety: { ...hyperhidrosisSafety, body: `${HYPERHIDROSIS_SIDE_EFFECTS} ${PALM_WEAKNESS_NOTE} ${XEOMIN_HYPERHIDROSIS_OFF_LABEL}` },
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
      { question: "What are the side effects?", answer: `${HYPERHIDROSIS_SIDE_EFFECTS} ${PALM_WEAKNESS_NOTE}` },
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
  /** Sourced "not here" line: /locations/newport-news-va and the Yorktown area data (lib/local-service-areas.ts). */
  notLocalLine: string;
  /** Neighborhood and route intro from lib/local-service-areas.ts. */
  localIntro: string;
  /** Turn-by-turn or route wording from the area's /locations page. */
  routeSteps: string[];
  /** Timing notes from the area's /locations page and area data. */
  timingNotes: string[];
  /** Visit-planning lines from the area's /locations page (safe for the PRP Breast Lift claim rules). */
  planningNotes: string[];
  /** Other services the area's /locations page already highlights. */
  otherServices: string;
  /** Local angle and visit-planning lines from the area's /locations page and area data. */
  localNotes: string[];
  /** Extra links for the PRP Face Lift page, taken from the area's /locations page. */
  faceLiftLinks: SatelliteLink[];
  faceLiftLocalNote: string;
  /** Xeomin wording from the area's /locations page and the Xeomin hub FAQ. */
  xeominLocalNotes: string[];
  localFaq: SatelliteFaq;
  /** Which drive the route map highlights. */
  mapRoute: PeninsulaRoute;
};

const NEAR_AREAS: NearArea[] = [
  {
    slug: "newport-news-va",
    name: "Newport News",
    mapRoute: "newport-news",
    notLocalLine: "There is no Newport News street address.",
    localIntro:
      "Patients from Oyster Point, Denbigh, Kiln Creek, and City Center usually take I-64 west toward Williamsburg. From northern Newport News, I-64 is often the simplest route before local roads to Powhatan Parkway.",
    routeSteps: [
      "Take I-64 west toward Williamsburg.",
      "Use Route 199 toward Monticello Avenue and New Town.",
      "Turn onto Powhatan Parkway and look for the clinic entrance near the main lot.",
    ],
    timingNotes: [
      "Oyster Point, Denbigh, Kiln Creek, and City Center patients should account for bridge and commuter timing.",
      "Plan the appointment around traffic, and give yourself time for questions before heading back to Newport News.",
    ],
    planningNotes: [
      "Book a consultation first, explain the concern you want to discuss, and review the options before making a decision.",
      "Newport News patients often want a real medical conversation before treatment and a clinic that feels worth the drive.",
    ],
    otherServices:
      "Newport News patients also visit the clinic for Xeomin, PRP therapies, hyperhidrosis treatment, and medical ear piercing.",
    localNotes: [
      "The appointment is a planned Williamsburg clinic visit rather than a walk-in stop.",
      "Talk through your goals with Jenny Brady before choosing a treatment.",
      "PRP visits depend on the concern, medical history, and whether a specialist evaluation is needed first.",
      "Your consultation can focus on one option or compare more than one before you decide.",
      "The Newport News location page has the full driving notes and a directions button for 3900 Powhatan Parkway.",
    ],
    faceLiftLinks: [
      { href: "/procedures/prp-facial", label: "PRP Facial" },
      { href: "/procedures/microneedling-with-prp", label: "Microneedling with PRP" },
    ],
    faceLiftLocalNote:
      "The Newport News page compares Xeomin and PRP: Xeomin addresses lines caused by repeated muscle movement, while PRP treatments focus on skin quality, texture, and tone. The PRP Face Lift combines both in one visit, and your consultation can also look at the PRP Facial or microneedling with PRP on their own.",
    xeominLocalNotes: [
      "Common visit goals for Newport News patients include softening expression lines with Xeomin, asking about PRP for joints or skin, treating excessive sweating, and choosing a more clinical ear piercing appointment.",
      "The right choice depends on what you want to change. Xeomin, our wrinkle relaxer, addresses lines caused by repeated muscle movement, while PRP treatments focus on skin quality, texture, and tone.",
      "Williamsburg Med Spa serves Newport News patients from our Williamsburg location with conservative planning, clear timelines, and careful follow-up.",
    ],
    localFaq: {
      question: "Which route do Newport News patients take?",
      answer:
        "Take I-64 west toward Williamsburg, then Route 199 toward Monticello Avenue and New Town, and turn onto Powhatan Parkway. The clinic entrance is near the main lot.",
    },
  },
  {
    slug: "yorktown-va",
    name: "Yorktown",
    mapRoute: "yorktown",
    notLocalLine: "The clinic is in Williamsburg, not Yorktown.",
    localIntro:
      "Patients from Yorktown, Tabb, and Grafton plan this as a Williamsburg appointment, usually by the Colonial Parkway or I-64, then Route 199 and Powhatan Parkway.",
    routeSteps: [
      "Use the Colonial Parkway or I-64 toward Williamsburg.",
      "Connect through Route 199 and Monticello Avenue.",
      "Continue toward Powhatan Parkway.",
    ],
    timingNotes: [
      "From Yorktown, most routes head northwest toward Williamsburg before connecting into the Powhatan Parkway area.",
      "Patients coming from Tabb or Grafton should allow extra buffer during school and commuter traffic.",
    ],
    planningNotes: [
      "If you are unsure which treatment fits, book the consultation first rather than guessing from a menu.",
      "Yorktown patients often want a quieter Williamsburg clinic visit rather than a high-volume retail setting.",
    ],
    otherServices:
      "The Yorktown page is also a starting point for Xeomin (our wrinkle relaxer), PRP, hyperhidrosis, and medical ear piercing questions.",
    localNotes: [
      "The visit is a planned trip to the Williamsburg clinic, which helps avoid walk-in timing.",
      "Consult-led care suits Yorktown patients willing to make a planned Williamsburg visit.",
      "Expect a provider-led consultation and a clear discussion of risks before any decision.",
      "Yorktown patients comparing a calm clinical visit against retail or rushed alternatives can review the options at a consultation first.",
      "The Yorktown location page lists Tabb, Grafton, and the Lower Peninsula among the nearby areas it covers, with a directions button for 3900 Powhatan Parkway.",
    ],
    faceLiftLinks: [{ href: "/procedures/xeomin", label: "Xeomin treatment planning" }],
    faceLiftLocalNote:
      "Bring current medications, skin history, and prior injectable history to the visit. If the Xeomin half of the plan is your main question, the Xeomin page covers expression lines, dosing questions, and how Xeomin compares with other wrinkle relaxers.",
    xeominLocalNotes: [
      "For Yorktown patients, Xeomin starts with a consult-first plan that covers expression lines, dosing questions, and how Xeomin compares with other wrinkle relaxers.",
      `${hubFaqAnswer("xeomin", "How does Xeomin differ from Botox®?").split(". ").slice(-1)[0]}`,
      "Bring current medications, skin history, and prior injectable history to the visit.",
      "Expect a provider-led consultation, clear discussion of risks and aftercare, and treatment planning based on your goals rather than a one-size-fits-all package.",
    ],
    localFaq: {
      question: "Which route do Yorktown patients take?",
      answer:
        "Many patients use the Colonial Parkway or I-64 toward Williamsburg, then connect through Route 199 and Monticello Avenue toward Powhatan Parkway. Build in a traffic buffer around school, bridge, and commuter times.",
    },
  },
];

/** Drive time as stated on /locations ("Yorktown and Newport News: Typically 25–35 minutes"). */
export const PENINSULA_DRIVE_TIME = "typically 25–35 minutes";

/** Google Maps driving directions from the town to the clinic (opens in a new tab). */
export const peninsulaDirectionsHref = (townName: string) =>
  `https://www.google.com/maps/dir/?api=1&origin=${townName.replace(/ /g, "+")},+VA&destination=Williamsburg+Med+Spa,+3900+Powhatan+Parkway,+Williamsburg,+VA+23188`;

/** Apple Maps driving directions from the town to the clinic (opens Maps on iPhone and Mac, the web map elsewhere). */
export const peninsulaAppleDirectionsHref = (townName: string) =>
  `https://maps.apple.com/?saddr=${townName.replace(/ /g, "+")},+VA&daddr=Williamsburg+Med+Spa,+3900+Powhatan+Parkway,+Williamsburg,+VA+23188&dirflg=d`;

const nearAreaRoute = (area: NearArea): SatelliteRoute => ({
  map: area.mapRoute,
  driveTime: PENINSULA_DRIVE_TIME,
  steps: area.routeSteps,
  directionsHref: peninsulaDirectionsHref(area.name),
  appleDirectionsHref: peninsulaAppleDirectionsHref(area.name),
});

const BREAST_CASH_CENTS = cashCents("prp-breast-lift");
const FACE_LIFT_CASH_CENTS = cashCents("prp-face-lift");

const travelSection = (area: NearArea): SatelliteSection => ({
  heading: `Getting to Williamsburg from ${area.name}`,
  paragraphs: [
    `${area.localIntro} The drive is ${PENINSULA_DRIVE_TIME}, depending on your starting point, route, and traffic.`,
    ...area.timingNotes,
  ],
  steps: area.routeSteps.map((step, index) => ({ title: `Step ${index + 1}`, description: step })),
  routeMap: area.mapRoute,
});

const planningSection = (area: NearArea, extra: string[] = []): SatelliteSection => ({
  heading: `Planning the visit from ${area.name}`,
  bullets: [...area.planningNotes, ...area.localNotes, ...extra, area.otherServices],
});

const whereFaq = (area: NearArea): SatelliteFaq => ({
  question: `Is the clinic in ${area.name}?`,
  answer: `No. ${area.notLocalLine} Appointments are at ${CLINIC_ADDRESS}, ${PENINSULA_DRIVE_TIME} by car from ${area.name}.`,
});

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
    `${area.notLocalLine} Appointments are at Williamsburg Med Spa, ${CLINIC_ADDRESS}, ${PENINSULA_DRIVE_TIME} by car from ${area.name}.`,
  ],
  price: {
    heading: "One-visit price",
    label: cashCardLabel(BREAST_CASH_CENTS),
    body: `Full upfront payment for one treatment visit is ${cashCardProse(BREAST_CASH_CENTS)}. The checkout is for one visit. Contact the clinic before purchasing if you need the current service details or written purchase terms.`,
  },
  sections: [
    travelSection(area),
    planningSection(area),
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
          title: "Compare the alternatives",
          description: "If your goal involves removing skin, repositioning tissue, or adding volume, compare this service with an appropriate surgical consultation before deciding.",
        },
      ],
    },
  ],
  faqs: [
    whereFaq(area),
    area.localFaq,
    {
      question: "How much is the PRP Breast Lift?",
      answer: `${cashCardProse(BREAST_CASH_CENTS)} for one treatment visit. The checkout is for one visit.`,
    },
    {
      question: "Is a PRP Breast Lift the same as surgery?",
      answer:
        "No. The PRP visit is not mastopexy, implants, or fat transfer. Do not treat the service name as a promise of the skin removal, tissue repositioning, or volume change associated with those procedures.",
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
    `${area.notLocalLine} Appointments are at Williamsburg Med Spa, ${CLINIC_ADDRESS}, ${PENINSULA_DRIVE_TIME} by car from ${area.name}.`,
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
    travelSection(area),
    planningSection(area, [area.faceLiftLocalNote]),
  ],
  safety: {
    heading: "Side effects",
    body: hubFaqAnswer("prp-face-lift", "Are there any side effects?"),
  },
  faqs: [
    whereFaq(area),
    area.localFaq,
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
  ],
  locationHref: `/locations/${area.slug}`,
  extraLinks: area.faceLiftLinks,
  consultHref: `/consult?procedure=prp-face-lift&area=${area.slug}&utm_source=website&utm_medium=local_service_page&utm_campaign=prp_face_lift_${area.slug.replace(/-/g, "_")}`,
  ctaLabel: "Book a PRP Face Lift Consultation",
  textMessage: textMessage(`the PRP Face Lift. I'm coming from ${area.name}`),
});

// ---------------------------------------------------------------------------------------------------------------
// Xeomin area pages. Copy comes from the /procedures/botox and /procedures/xeomin FAQs and lib/xeomin-concerns.ts.
// ---------------------------------------------------------------------------------------------------------------

const XEOMIN_CASH_CENTS = cashCents("xeomin");

const xeominNearPage = (area: NearArea): ServiceSatellitePage => ({
  kind: "near",
  hubSlug: "xeomin",
  slug: area.slug,
  label: area.name,
  linkDescription: `${area.name} drive time, credit-block pricing, and which lines Xeomin is used for.`,
  metaTitle: `Xeomin near ${area.name} VA | Botox® Alternative, from ${formatUsdShort(XEOMIN_CASH_CENTS)}`,
  metaDescription: `Looking for Botox® near ${area.name}? We use Xeomin® in Williamsburg. ${formatUsdShort(XEOMIN_CASH_CENTS)} cash per credit block (${cardPriceLabel(XEOMIN_CASH_CENTS)} card). Nurse-led.`,
  h1: `Xeomin near ${area.name}, VA`,
  eyebrow: `${area.name} service area`,
  intro: [
    `Looking for Botox® near ${area.name}? ${hubFaqAnswer("botox", "Do you offer Botox®?").replace(/^No\. /, "Williamsburg Med Spa does not offer Botox® brand. ")}`,
    `${area.notLocalLine} Appointments are at Williamsburg Med Spa, ${CLINIC_ADDRESS}, ${PENINSULA_DRIVE_TIME} by car from ${area.name}.`,
  ],
  price: {
    heading: "Credit-block pricing",
    label: cashCardLabel(XEOMIN_CASH_CENTS, "per credit block"),
    body: `Xeomin is prepaid in credit blocks of ${cashCardProse(XEOMIN_CASH_CENTS)}. Your total depends on the areas treated, muscle strength, and your dosing plan, and Jenny reviews treatment areas and likely dosing range before confirming the plan.`,
  },
  sections: [
    {
      heading: "What Xeomin is used for",
      paragraphs: [
        hubFaqAnswer("botox", "What is Xeomin commonly used for?"),
        `Each area has its own page: ${xeominConcernPages.map((concern) => concern.label.toLowerCase()).join(", ")}. ${XEOMIN_LIP_FLIP_OFF_LABEL}`,
      ],
    },
    { heading: `Xeomin for ${area.name} patients`, paragraphs: area.xeominLocalNotes },
    travelSection(area),
    planningSection(area),
  ],
  safety: {
    heading: "Side effects",
    body: `${XEOMIN_SIDE_EFFECTS} ${XEOMIN_SEEK_HELP}`,
  },
  faqs: [
    whereFaq(area),
    area.localFaq,
    { question: "How much does Xeomin cost?", answer: hubFaqAnswer("botox", "How much does Xeomin cost in Williamsburg?") },
    { question: "How long can Xeomin results last?", answer: hubFaqAnswer("botox", "How long can Xeomin results last?") },
  ],
  locationHref: `/locations/${area.slug}`,
  extraLinks: [
    ...xeominConcernPages.map((concern) => ({ href: concern.path, label: `Xeomin for ${concern.label.toLowerCase()}` })),
    { href: XEOMIN_HUB_PATH, label: "Botox alternative in Williamsburg" },
    { href: XEOMIN_COST_PATH, label: "Xeomin cost in Williamsburg" },
    { href: XEOMIN_COMPARISON_PATH, label: "Botox vs Xeomin in Williamsburg, VA" },
  ],
  consultHref: `/consult?procedure=xeomin&area=${area.slug}&utm_source=website&utm_medium=local_service_page&utm_campaign=xeomin_${area.slug.replace(/-/g, "_")}`,
  ctaLabel: "Book a Xeomin Consultation",
  textMessage: textMessage(`Xeomin. I'm coming from ${area.name}`),
  footnote: XEOMIN_TRADEMARK_NOTE,
});

export const serviceSatellitePages: ServiceSatellitePage[] = [
  ...hyperhidrosisConcernPages,
  ...NEAR_AREAS.map(breastLiftNearPage),
  ...NEAR_AREAS.map(faceLiftNearPage),
  ...NEAR_AREAS.map(xeominNearPage),
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
  return [hub, ...siblings, ...location, ...(page.extraLinks ?? [])];
};

/** The link grid a hub page renders for its satellites (null when the hub has none). */
export const getHubSatelliteGroup = (hubSlug: string) => {
  // /procedures/botox is the Botox-alternative page for Xeomin, so it links the Xeomin area pages too.
  const pages = getSatellitesForHub(hubSlug === "botox" ? "xeomin" : hubSlug);
  if (!pages.length) return null;
  const isConcern = pages[0].kind === "concern";
  return {
    eyebrow: isConcern ? "Treatment areas" : "Nearby pages",
    heading: isConcern ? "Start with the area that bothers you most" : "Coming from the Peninsula?",
    intro: isConcern
      ? "Each page covers how treatment works for that area, what to expect, side effects, and pricing."
      : `Appointments are at ${CLINIC_ADDRESS}. These pages cover the drive (${PENINSULA_DRIVE_TIME}), ${pages[0].hubSlug === "xeomin" ? "credit-block pricing" : "the one-visit price"}, and how to book.`,
    links: pages.map((page) => {
      const area = page.kind === "near" ? NEAR_AREAS.find((item) => item.slug === page.slug) : undefined;
      return {
        href: satellitePath(page),
        label: page.kind === "concern" ? page.label : `${HUB_LABELS[page.hubSlug]} near ${page.label}`,
        description: page.linkDescription,
        route: area ? nearAreaRoute(area) : undefined,
      };
    }),
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
