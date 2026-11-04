import { COMMERCE_CATALOG_BY_SLUG } from "config/commerce-catalog";
import { formatUsdShort } from "lib/price";

/**
 * Xeomin hub-and-satellite cluster (mirrors the Blomdahl ear-piercing /for/ intent pages).
 *
 * The clinic's only wrinkle relaxer is Xeomin® (incobotulinumtoxinA). It does not offer Botox® brand.
 * - Hub: /procedures/botox, the honest Botox-alternative page for people searching for Botox in Williamsburg.
 * - Product page: /procedures/xeomin.
 * - Satellites: /procedures/xeomin/for/<concern> and the /procedures/xeomin/cost page.
 *
 * Every fact here comes from existing site copy: src/data.ts (the Botox-alternative and Xeomin entries), the Xeomin catalog item,
 * src/lib/local-injectable-service-pages.ts, src/markdown/botox-vs-xeomin-williamsburg-va.mdx, and the retired
 * src/markdown/ailments/botox/*.mdx pages (already rewritten to Xeomin). No outcome promises, no before/after.
 */

export const XEOMIN_HUB_PATH = "/procedures/botox";
export const XEOMIN_HUB_ANCHOR = "Botox alternative in Williamsburg";
export const XEOMIN_PRODUCT_PATH = "/procedures/xeomin";
export const XEOMIN_PRODUCT_ANCHOR = "Xeomin in Williamsburg, VA";
export const XEOMIN_COMPARISON_PATH = "/blog/botox-vs-xeomin-williamsburg-va";
export const XEOMIN_COST_PATH = "/procedures/xeomin/cost";
export const xeominConcernPath = (slug: string) => `/procedures/xeomin/for/${slug}`;

/** Formatted Xeomin credit-block prices for copy, derived from the catalog (exactly what checkout charges). */
export const XEOMIN_PRICES = (() => {
  const xeomin = COMMERCE_CATALOG_BY_SLUG.xeomin;
  if (!xeomin || xeomin.pricingMode !== "increment_credit") {
    throw new Error("The Xeomin catalog item is missing or is no longer sold in credit blocks.");
  }
  return {
    blockCash: formatUsdShort(xeomin.cashAmountCents),
    blockCard: formatUsdShort(xeomin.unitAmountCents),
    maxBlocksOnline: xeomin.maxQuantity,
  };
})();

const { blockCash, blockCard } = XEOMIN_PRICES;

/** The side-effects line already used on the site (comparison guide and GBP posts). */
export const XEOMIN_SIDE_EFFECTS =
  "Temporary side effects can include redness, bruising, tenderness, or swelling at injection sites. Rare but serious risks should be discussed directly with your provider before treatment.";

export const XEOMIN_TRADEMARK_NOTE =
  "Botox® is a registered trademark of Allergan, Inc., an AbbVie company. Williamsburg Med Spa is not affiliated with Allergan and does not offer Botox® brand.";

export type XeominClusterSection = {
  heading: string;
  paragraphs?: string[];
  bullets?: string[];
};

export type XeominClusterPage = {
  slug: string;
  /** Path the page is served at (canonical). */
  path: string;
  /** Short label for link blocks, e.g. "Frown lines (11s)". */
  label: string;
  /** One line for link cards. */
  summary: string;
  metaTitle: string;
  metaDescription: string;
  h1: string;
  /** The "Looking for Botox® for …? We use Xeomin®." line. */
  botoxLine: string;
  intro: string;
  /** "common" areas vs the "Less Common Area" tag the site gives the lip flip. */
  areaTag: "common" | "uncommon";
  sections: XeominClusterSection[];
  expectations: { title: string; description: string }[];
  faqs: { question: string; answer: string }[];
  /** Prefilled text to Jenny; the patient adds days and times. */
  textMessage: string;
};

const textJenny = (topic: string) =>
  `Hi Jenny. I'm interested in ${topic} and would like to book a Xeomin visit. Days and times that work for me:`;

const pricingFaq = (area: string) => ({
  question: `How much does Xeomin for ${area} cost?`,
  answer: `Xeomin is prepaid in ${blockCash} credit blocks (${blockCash} per block in cash or ${blockCard} online by card). Your total depends on the areas treated, muscle strength, and your dosing plan, and any unused value remains as account credit.`,
});

export const xeominConcernPages: XeominClusterPage[] = [
  {
    slug: "frown-lines",
    path: xeominConcernPath("frown-lines"),
    label: "Frown lines (11s)",
    summary: "Vertical 11 lines between the brows from frowning, squinting, or concentrating.",
    metaTitle: `Xeomin for Frown Lines in Williamsburg, VA | From ${blockCash} Cash`,
    metaDescription: `Looking for Botox® for frown lines (11s)? We use Xeomin® in Williamsburg, VA. ${blockCash} cash per credit block (${blockCard} card). Nurse-led, conservative dosing.`,
    h1: "Xeomin for Frown Lines (11s) in Williamsburg, VA",
    botoxLine: "Looking for Botox® for frown lines? We use Xeomin®.",
    intro:
      "Frown lines, often called 11 lines, form between the brows from repeated squinting, concentrating, or pulling the brows together. Xeomin is commonly used to temporarily improve the look of moderate to severe glabellar lines in appropriate adult candidates.",
    areaTag: "common",
    sections: [
      {
        heading: "When frown lines make you look tense or tired",
        paragraphs: [
          "Some patients notice they look upset or tired even when they feel relaxed. Because this area influences the whole upper face, Xeomin planning should account for line depth, brow shape, forehead movement, and how much expression you want to preserve.",
        ],
      },
      {
        heading: "How Xeomin is used for frown lines",
        paragraphs: [
          "Jenny Brady, MSN, RN, CPNP, PMHS maps the muscles between the brows and plans dosing around your movement pattern. The goal is to soften the repeated pull that makes frown lines look more pronounced.",
          "Xeomin can reduce the movement that contributes to frown lines. Deeper etched lines may soften gradually or may need a broader plan depending on skin quality and anatomy.",
          "Frown-line treatment may be discussed alone or as part of a balanced upper-face plan with forehead lines or crow's feet, depending on anatomy and goals.",
        ],
      },
    ],
    expectations: [
      {
        title: "Expression check",
        description:
          "Jenny reviews how strongly the muscles between your brows contract and whether nearby forehead movement should be considered.",
      },
      {
        title: "Risk and goal review",
        description:
          "Consultation covers expected timing, temporary side effects, contraindications, and what degree of softening you want.",
      },
      {
        title: "Precise placement",
        description:
          "Xeomin is placed in selected points based on anatomy and treatment goals, using product-specific dosing that is not interchangeable with Botox® units.",
      },
      {
        title: "Maintenance planning",
        description:
          "Visible change often develops over days and is commonly reassessed around the two-week mark before future maintenance is planned.",
      },
    ],
    faqs: [
      {
        question: "Do you offer Botox® for frown lines?",
        answer:
          "No. Williamsburg Med Spa uses Xeomin, a wrinkle relaxer in the same category as Botox®, and does not offer Botox® brand. Units are not interchangeable, so if you have had Botox® elsewhere, Jenny plans your Xeomin dose from your treatment history, anatomy, and goals.",
      },
      {
        question: "Are frown lines the same as 11 lines?",
        answer:
          "Yes. Many people use 11 lines to describe the vertical lines between the brows that appear with frowning, squinting, or concentrating.",
      },
      {
        question: "Can Xeomin help deep frown lines?",
        answer:
          "Xeomin can reduce the movement that contributes to frown lines. Deeper etched lines may soften gradually or may need a broader plan depending on skin quality and anatomy.",
      },
      {
        question: "How soon does Xeomin work for frown lines?",
        answer: "Many patients notice early change within several days, with fuller visible effect often around two weeks.",
      },
      pricingFaq("frown lines"),
    ],
    textMessage: textJenny("Xeomin for frown lines (11s)"),
  },
  {
    slug: "forehead-lines",
    path: xeominConcernPath("forehead-lines"),
    label: "Forehead lines",
    summary: "Horizontal lines from lifting the brows, planned around brow position.",
    metaTitle: `Xeomin for Forehead Lines in Williamsburg, VA | From ${blockCash} Cash`,
    metaDescription: `Looking for Botox® for forehead lines? We use Xeomin® in Williamsburg, VA. ${blockCash} cash per credit block (${blockCard} card). Planned around your brows.`,
    h1: "Xeomin for Forehead Lines in Williamsburg, VA",
    botoxLine: "Looking for Botox® for forehead lines? We use Xeomin®.",
    intro:
      "Forehead lines usually form from repeated lifting of the brows. Over time, those movement lines can become more visible in photos, video calls, and everyday expression. Xeomin is commonly used to temporarily improve the look of forehead lines in appropriate adult candidates.",
    areaTag: "common",
    sections: [
      {
        heading: "Why forehead treatment is planned around your brows",
        paragraphs: [
          "The forehead is connected to brow position, so treatment should not focus only on smoothing lines. A good plan considers how much movement you want to keep, how your brows sit at rest, and whether nearby areas such as frown lines also need attention.",
          "Forehead treatment can affect brow position if it is not planned carefully. That is why consultation includes brow movement, frown lines, and your desired amount of expression.",
        ],
      },
      {
        heading: "How Xeomin is planned for forehead movement",
        paragraphs: [
          "Xeomin is used to temporarily reduce selected muscle activity in appropriate adult candidates. For forehead lines, placement and dosing are planned around the frontalis muscle and the way your brows naturally move.",
          "The goal is not a frozen forehead. Jenny Brady, MSN, RN, CPNP, PMHS uses a conservative, movement-aware approach so treatment can soften visible lines while respecting natural expression.",
        ],
      },
    ],
    expectations: [
      {
        title: "Movement assessment",
        description: "Jenny watches how your forehead and brows move so dosing can be matched to your natural expression pattern.",
      },
      {
        title: "Area-by-area discussion",
        description:
          "Consultation covers whether forehead lines alone should be treated or whether frown lines and brow balance should be reviewed together.",
      },
      {
        title: "Conservative treatment",
        description:
          "Xeomin placement is planned to soften the targeted movement while avoiding an over-treated look whenever anatomy allows.",
      },
      {
        title: "Follow-up timing",
        description:
          "Results usually develop over several days, with fuller effect around two weeks. Maintenance timing depends on your response and goals.",
      },
    ],
    faqs: [
      {
        question: "Do you offer Botox® for forehead lines?",
        answer:
          "No. Williamsburg Med Spa uses Xeomin, a wrinkle relaxer in the same category as Botox®, and does not offer Botox® brand. Xeomin and Botox® units are not interchangeable, so Jenny plans your Xeomin dose from your anatomy, goals, and prior treatment history.",
      },
      {
        question: "Will forehead Xeomin make my brows feel heavy?",
        answer:
          "Forehead treatment can affect brow position if it is not planned carefully. That is why consultation should include brow movement, frown lines, and your desired amount of expression.",
      },
      {
        question: "Can I still move my forehead after Xeomin?",
        answer:
          "The amount of movement depends on dosing and your goals. Many patients prefer a conservative plan that softens lines without removing all expression.",
      },
      {
        question: "How long does forehead Xeomin last?",
        answer: "Many patients plan maintenance around 3 to 4 months, but duration varies by person, area, and treatment plan.",
      },
      pricingFaq("forehead lines"),
    ],
    textMessage: textJenny("Xeomin for forehead lines"),
  },
  {
    slug: "crows-feet",
    path: xeominConcernPath("crows-feet"),
    label: "Crow's feet",
    summary: "Smile lines at the outer corners of the eyes, softened without stiffening the smile.",
    metaTitle: `Xeomin for Crow's Feet in Williamsburg, VA | From ${blockCash} Cash`,
    metaDescription: `Looking for Botox® for crow's feet? We use Xeomin® in Williamsburg, VA. ${blockCash} cash per credit block (${blockCard} card). Planned to keep a natural smile.`,
    h1: "Xeomin for Crow's Feet in Williamsburg, VA",
    botoxLine: "Looking for Botox® for crow's feet? We use Xeomin®.",
    intro:
      "Crow's feet are the lines that fan out from the outer corners of the eyes when you smile, squint, or spend time in bright light. Xeomin is commonly used to temporarily improve the look of crow's feet in appropriate adult candidates.",
    areaTag: "common",
    sections: [
      {
        heading: "Treating this area takes restraint",
        paragraphs: [
          "For some patients, crow's feet become visible even when the face is relaxed. The goal is usually to soften excessive crinkling while keeping the smile warm and natural, not to remove every sign of expression.",
        ],
      },
      {
        heading: "How Xeomin is planned around the eyes",
        paragraphs: [
          "Jenny Brady, MSN, RN, CPNP, PMHS evaluates how your eyes, cheeks, and smile move together before planning treatment. Placement is customized so the result supports a refreshed look without making the smile appear stiff.",
          "Crow's feet may be treated alone or reviewed with forehead lines and frown lines as part of a full upper-face consultation.",
        ],
      },
    ],
    expectations: [
      {
        title: "Smile and squint review",
        description:
          "Jenny reviews the eye-area movement that appears during smiling and squinting so treatment can match the actual pattern.",
      },
      {
        title: "Conservative eye-area planning",
        description:
          "The treatment plan considers line softening, smile balance, and whether your anatomy is a good fit for this area.",
      },
      {
        title: "Targeted treatment",
        description: "Xeomin is placed in selected lateral eye-area points with aftercare instructions reviewed before you leave.",
      },
      {
        title: "Results and maintenance",
        description:
          "Results are temporary and usually build over days. Maintenance timing is based on how your movement and lines return.",
      },
    ],
    faqs: [
      {
        question: "Do you offer Botox® for crow's feet?",
        answer:
          "No. Williamsburg Med Spa uses Xeomin, a wrinkle relaxer in the same category as Botox®, and does not offer Botox® brand. If you have had Botox® elsewhere, bring your treatment history: a Xeomin dose is planned for you rather than converted unit for unit.",
      },
      {
        question: "Will Xeomin change my smile?",
        answer:
          "Treatment around the eyes should be planned carefully because the eyes and cheeks move with the smile. Conservative dosing can help preserve a natural look.",
      },
      {
        question: "Can crow's feet and forehead lines be treated together?",
        answer:
          "Often, yes. Jenny can review the upper face as a whole and decide whether one area or multiple areas should be treated in the same visit.",
      },
      {
        question: "How long does Xeomin last around the eyes?",
        answer:
          "Duration varies, but many patients plan maintenance around 3 to 4 months depending on movement pattern and treatment goals.",
      },
      pricingFaq("crow's feet"),
    ],
    textMessage: textJenny("Xeomin for crow's feet"),
  },
  {
    slug: "lip-flip",
    path: xeominConcernPath("lip-flip"),
    label: "Lip flip",
    summary: "A less common, consult-led option for a little more upper-lip show. It does not add volume.",
    metaTitle: `Xeomin Lip Flip in Williamsburg, VA | From ${blockCash} Cash`,
    metaDescription: `Looking for Botox® for a lip flip? We use Xeomin® in Williamsburg, VA. Consult first: it does not add volume. ${blockCash} cash per credit block (${blockCard} card).`,
    h1: "Xeomin Lip Flip in Williamsburg, VA",
    botoxLine: "Looking for Botox® for a lip flip? We use Xeomin®, and a lip flip starts with a consultation.",
    intro:
      "A lip flip is a less common area and a consult-led decision. It does not add volume. It uses small, carefully placed Xeomin doses to relax selected upper-lip movement when anatomy and goals are appropriate, which in the right candidate can allow a little more upper-lip show.",
    areaTag: "uncommon",
    sections: [
      {
        heading: "When you want a subtle lip change without adding volume",
        paragraphs: [
          "Some patients like their lip volume but want the upper lip to show a little more, especially when smiling. Others want to understand what a lip flip can and cannot change before booking.",
          "If your goal is fullness, shape, or hydration, a lip flip is not designed for that. If your goal is a subtle upper-lip reveal, a lip flip may be worth discussing.",
        ],
      },
      {
        heading: "Why candidacy matters around the lip",
        paragraphs: [
          "Because this area affects speech, drinking, smiling, and lip control, candidacy matters. Jenny Brady, MSN, RN, CPNP, PMHS reviews your smile pattern, lip anatomy, and whether a lip flip or no treatment is the better match.",
          "If a lip flip is not the right fit, Jenny will say so and talk through whether another option, or no treatment, better matches the actual goal.",
        ],
      },
    ],
    expectations: [
      {
        title: "Goal clarification",
        description:
          "Jenny helps separate whether you want more upper-lip show, more volume, better shape, or a different smile balance.",
      },
      {
        title: "Candidacy review",
        description:
          "Consultation covers anatomy, speech and drinking considerations, expected subtlety, and whether Xeomin is appropriate around the lip.",
      },
      {
        title: "Conservative placement",
        description:
          "When appropriate, small Xeomin doses are placed with a restrained plan because the lip area is functional and sensitive to overtreatment.",
      },
      {
        title: "Compare alternatives",
        description:
          "If a lip flip is not the right fit, Jenny will say so and talk through whether another option, or no treatment, better matches the actual goal.",
      },
    ],
    faqs: [
      {
        question: "Do you offer Botox® for a lip flip?",
        answer:
          "We use Xeomin, a wrinkle relaxer in the same category as Botox®, and Williamsburg Med Spa does not offer Botox® brand. A Xeomin lip flip is a less common area, so it starts with a consultation to confirm whether it fits your anatomy and goal.",
      },
      {
        question: "Does a Xeomin lip flip add volume?",
        answer:
          "No. A lip flip does not add volume. It uses Xeomin to subtly affect upper-lip movement so the lip may show a little more when you smile.",
      },
      {
        question: "Who is a good candidate for a lip flip?",
        answer:
          "A good candidate usually wants a subtle upper-lip reveal rather than added volume. Jenny reviews anatomy, smile pattern, and functional risks before recommending treatment.",
      },
      {
        question: "Can a lip flip affect drinking or speech?",
        answer:
          "Because Xeomin near the lip affects a functional area, temporary changes are possible. This is why conservative planning and candidacy screening matter.",
      },
      pricingFaq("a lip flip"),
    ],
    textMessage: textJenny("a Xeomin lip flip consultation"),
  },
];

export const xeominCostPage: XeominClusterPage = {
  slug: "cost",
  path: XEOMIN_COST_PATH,
  label: "Xeomin cost",
  summary: `How ${blockCash} credit blocks work and why unit prices don't compare.`,
  metaTitle: `Xeomin Cost in Williamsburg, VA | ${blockCash} Cash per Credit Block`,
  metaDescription: `Xeomin cost in Williamsburg, VA: ${blockCash} cash per credit block (${blockCard} card). Your total depends on areas and dosing. Unused credit stays on your account.`,
  h1: "Xeomin Cost in Williamsburg, VA",
  botoxLine: "Looking for Botox® prices? We use Xeomin®, and units are not interchangeable, so compare full treatment plans.",
  intro: `At Williamsburg Med Spa, Xeomin is ${blockCash} cash per credit block (${blockCard} online or by card). A block is treatment credit, not a fixed number of units or areas. Your total depends on the areas treated, muscle strength, and your dosing plan.`,
  areaTag: "common",
  sections: [
    {
      heading: "How Xeomin credit blocks work",
      bullets: [
        `Each block adds ${blockCash} of treatment credit to your account.`,
        `Pay ${blockCash} per block in cash at the office, or ${blockCard} per block online or by card.`,
        "The credit is applied to your Xeomin visit, and any unused value remains as account credit.",
        "Jenny reviews treatment areas and likely dosing range before confirming the plan.",
      ],
    },
    {
      heading: "What changes your total",
      paragraphs: [
        "Final treatment cost depends on treatment areas, dose strategy, and candidacy. Treating one area such as frown lines is a different plan from treating frown lines, forehead lines, and crow's feet together.",
        "Muscle strength and how much movement you want to keep also shape the dose. That is why Xeomin is sold as treatment credit, and Jenny confirms the plan with you at the visit.",
      ],
    },
    {
      heading: "Why per-unit prices don't compare",
      paragraphs: [
        "Xeomin and Botox® units are not interchangeable, so a unit price quoted for one product does not tell you what a plan with the other will cost. Compare whole treatment plans, not unit prices.",
        "If you have had Botox® elsewhere, bring your treatment history. A Xeomin dose is planned for you rather than converted unit for unit.",
      ],
    },
  ],
  expectations: [
    {
      title: "Prepay or ask first",
      description: `Prepay Xeomin online in ${blockCash} credit blocks, or text or call Jenny first if you want to talk through areas before paying.`,
    },
    {
      title: "Consultation at the visit",
      description:
        "Jenny reviews your face at rest and with movement, prior injectable history, upcoming events, and medication history before planning Xeomin.",
    },
    {
      title: "Plan and price confirmed",
      description: "Jenny reviews treatment areas and likely dosing range before confirming the plan.",
    },
    {
      title: "Credit applied",
      description: "Your credit is applied to the Xeomin visit, and any unused value remains as account credit.",
    },
  ],
  faqs: [
    {
      question: "How much does Xeomin cost in Williamsburg?",
      answer: `Williamsburg Med Spa prices Xeomin in ${blockCash} credit blocks (${blockCash} per block in cash or ${blockCard} online by card). Your total depends on the areas treated, muscle strength, and your dosing plan.`,
    },
    {
      question: "What is a Xeomin credit block?",
      answer: `A credit block is ${blockCash} of treatment credit applied to your Xeomin visit. It is not a set number of units or a set area, and any unused value remains as account credit.`,
    },
    {
      question: "What happens to credit I don't use?",
      answer: "Any unused value remains as account credit.",
    },
    {
      question: "I have had Botox® elsewhere. How do I compare prices?",
      answer:
        "Compare the full treatment plan, not a unit price. Xeomin and Botox® units are not interchangeable. Ask which areas will be treated, how much movement you will keep, and what the full Xeomin plan costs, and bring your treatment history so Jenny can plan your Xeomin dose.",
    },
    {
      question: "Is the price different if I pay by card?",
      answer: `The listed cash price is ${blockCash} per block. Paying cash in the office, you pay the cash price. The card price (${blockCard} per block) applies online and to card payments in the office.`,
    },
  ],
  textMessage: textJenny("Xeomin pricing for my treatment areas"),
};

/** Every page in the cluster, in link-block order (concerns first, then cost). */
export const xeominClusterPages: XeominClusterPage[] = [...xeominConcernPages, xeominCostPage];

export const getXeominConcernPage = (slug: string) => xeominConcernPages.find((page) => page.slug === slug);

/** Old URLs folded into the new cluster. /procedures/botox/for/* was the retired MDX ailment route. */
export const XEOMIN_CLUSTER_REDIRECTS: Array<[string, string]> = [
  ...xeominConcernPages.map(({ slug, path }): [string, string] => [`/procedures/botox/for/${slug}`, path]),
  ["/procedures/xeomin/for/glabellar-lines", xeominConcernPath("frown-lines")],
  ["/procedures/xeomin/for/forehead-wrinkles", xeominConcernPath("forehead-lines")],
];
