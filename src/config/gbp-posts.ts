import { COMMERCE_CATALOG_BY_SLUG, EAR_PIERCING_PRICES } from "config/commerce-catalog";
import { cardPriceLabel, formatUsdShort } from "lib/price";
import { GOOGLE_REVIEW_URL } from "lib/seo";

/**
 * Weekly Google Business Profile posts (one per Monday), previewed at /gbp.
 * Copy rules: facts only from existing site pages, prices only from COMMERCE_CATALOG (cash price first,
 * card/online price second), Botox® and Xeomin® with the ®, no outcome promises, no phone numbers in the
 * text (the Call button and the image footer carry the number), and no product named for hyperhidrosis.
 * Checked by src/config/gbp-posts.test.ts.
 */
export const GBP_TEMPLATES = ["spotlight", "question", "trust", "holiday"] as const;
export type GbpTemplate = (typeof GBP_TEMPLATES)[number];

export const GBP_HOLIDAYS = ["thanksgiving", "christmas", "newyear", "valentines"] as const;
export type GbpHoliday = (typeof GBP_HOLIDAYS)[number];

export type GbpPostType = "update" | "offer" | "event";
export type GbpCta = "BOOK" | "LEARN_MORE" | "CALL" | "ORDER";

export type GbpPost = {
  slug: string;
  /** Monday the post goes live, YYYY-MM-DD (America/New_York). */
  publishOn: string;
  type: GbpPostType;
  template: GbpTemplate;
  holiday?: GbpHoliday;
  /** Small line above the image title; the template default is used when omitted. */
  kicker?: string;
  title: string;
  subtitle: string;
  /** Price chip on the image, built from the catalog. */
  priceLine?: string;
  body: string;
  cta: GbpCta;
  url: string;
};

const SITE = "https://www.williamsburgmedspa.com";
const JENNY = "Jenny Brady, MSN, RN, CPNP, PMHS";

const cashCents = (slug: string) => {
  const item = COMMERCE_CATALOG_BY_SLUG[slug];
  if (!item) throw new Error(`Unknown catalog slug ${slug}`);
  return item.cashAmountCents;
};

/** Card and cash prices for one catalog item, e.g. { card: "$618.23", cash: "$600" }. */
const pricesFor = (slug: string) => ({
  card: cardPriceLabel(cashCents(slug)),
  cash: formatUsdShort(cashCents(slug)),
});

/** Image price chip: "$45 cash · $46.66 card" (cash first). */
const chip = (cash: string, card: string, suffix = "") => `${cash} cash · ${card} card${suffix ? ` ${suffix}` : ""}`;

const botox = pricesFor("botox");
const prpFacial = pricesFor("prp-facial");
const hyperhidrosis = pricesFor("hyperhidrosis-treatment");
const prpHair = pricesFor("prp-hair-restoration");
const ear = EAR_PIERCING_PRICES;

const paragraphs = (...parts: string[]) => parts.join("\n\n");

export const GBP_POSTS: GbpPost[] = [
  {
    slug: "holiday-ear-piercing-planning",
    publishOn: "2026-11-09",
    type: "update",
    template: "spotlight",
    kicker: "Plan ahead for the holidays",
    title: "Holiday ear piercing",
    subtitle: "Book early and leave room for aftercare before the gatherings start.",
    priceLine: chip(ear.oneEarCash, ear.oneEarCard, "per ear"),
    body: paragraphs(
      `Winter gatherings are a common time for families to ask about a first ear piercing. At Williamsburg Med Spa in Williamsburg, VA, Blomdahl ear piercing is an appointment with ${JENNY}, a certified pediatric nurse practitioner and certified Blomdahl provider.`,
      `Each visit uses a sterile single-use cassette and hypoallergenic Medical Plastic or Medical Grade Titanium starter earrings. The price is ${ear.oneEarCash} for one ear or ${ear.bothEarsCash} for both ears in cash, or ${ear.oneEarCard} and ${ear.bothEarsCard} online or by card. That includes the appointment, the cassette, the starter earrings, and aftercare support.`,
      `Plan the date around aftercare, not just the party. Starter earrings stay in through the early healing window, so if a holiday dinner, travel day, or sport falls on the same day, pick another appointment. Jenny generally pierces babies at 6 months or older with pediatrician guidance, and she will not pierce if she has a safety concern. Older children, teens, and adults book the same way.`,
      `A holiday does not change the piercing system, the price, or the age guidance. It is a reason to choose the date with healing in mind.`,
      `Our holiday planning guide covers who the visit fits and aftercare timing. Tap Learn more to read it.`
    ),
    cta: "LEARN_MORE",
    url: `${SITE}/blog/planning-holiday-ear-piercing-williamsburg-va`,
  },
  {
    slug: "botox-xeomin-before-holiday-photos",
    publishOn: "2026-11-16",
    type: "update",
    template: "spotlight",
    kicker: "Before holiday photos",
    title: "Botox® or Xeomin® for the holidays",
    subtitle: "The fuller effect is commonly seen around two weeks, so plan ahead.",
    priceLine: chip(botox.cash, botox.card, `per ${botox.cash} credit block`),
    body: paragraphs(
      `Holiday parties and family photos are coming up in Williamsburg, VA. If you are thinking about Botox® or Xeomin® for forehead lines, frown lines, or crow's feet, timing matters more than the product name.`,
      `Both are botulinum toxin type A treatments used to temporarily soften expression lines in appropriate adult candidates. Change often starts to show within several days, and the fuller visible effect is commonly seen around two weeks. If you have a photo date in mind, tell Jenny at your consultation so the plan fits your calendar.`,
      `At Williamsburg Med Spa, ${JENNY} plans each treatment around your facial movement and how much expression you want to keep. The consultation covers your health history, medications, prior treatment response, and possible side effects. Temporary side effects can include redness, bruising, tenderness, or swelling at injection sites, and rare but serious risks are discussed before treatment.`,
      `Botox® and Xeomin® are prepaid online in ${botox.cash} credit blocks: ${botox.cash} per block in cash, or ${botox.card} online or by card. Each block adds ${botox.cash} of treatment credit, and any unused value stays on your account. Your total depends on the areas treated and your dosing plan.`,
      `Tap Book to request a time before the holidays.`
    ),
    cta: "BOOK",
    url: `${SITE}/procedures/botox`,
  },
  {
    slug: "happy-thanksgiving",
    publishOn: "2026-11-23",
    type: "update",
    template: "holiday",
    holiday: "thanksgiving",
    title: "Happy Thanksgiving",
    subtitle: "Thank you for letting us be part of your year.",
    body: paragraphs(
      `Happy Thanksgiving from all of us at Williamsburg Med Spa.`,
      `This week is a good moment to say thank you. Thank you to the families who trusted us with a child's first earrings, to the patients who came in with questions and left with a plan, and to everyone in Williamsburg, VA, James City County, Yorktown, and Newport News who has sent a friend our way. A local clinic depends on its neighbors, and we are grateful for ours.`,
      `We hope your table is full this week, whether that means a big family dinner, a quiet meal at home, or a Friendsgiving with the people who feel like family. We hope the drive is easy, the pie is good, and there is time to rest.`,
      `If you are traveling, safe travels. If you are hosting, we hope someone else offers to do the dishes.`,
      `When you are ready to plan something after the holiday, tap Call and we will help with any questions.`
    ),
    cta: "CALL",
    url: `${SITE}/`,
  },
  {
    slug: "meet-jenny-brady",
    publishOn: "2026-11-30",
    type: "update",
    template: "trust",
    title: "Jenny Brady",
    subtitle: "Certified pediatric nurse practitioner with 26 years in medicine, and a certified Blomdahl provider.",
    body: paragraphs(
      `If you are planning a baby's first earrings in Williamsburg, VA, it helps to know who will be doing the piercing.`,
      `${JENNY}, is the nurse practitioner at Williamsburg Med Spa, 3900 Powhatan Parkway. She has 26 years in medicine and six years dedicated to aesthetics. Her background includes a Master of Science in Nursing, registered nursing, certified pediatric nurse practitioner practice, and pediatric mental health. She is also a certified Blomdahl provider.`,
      `That pediatric background shapes how ear piercing visits run. A child's appointment is calm and pediatric-aware, with careful placement and clear aftercare for parents. Jenny generally pierces babies at 6 months or older with pediatrician guidance. She reviews health history at the visit and will not pierce if she has a safety concern.`,
      `Every piercing uses a sterile single-use Blomdahl cassette and hypoallergenic Medical Plastic or Medical Grade Titanium starter earrings. Teens and adults are welcome too, including sensitive ears and re-piercing.`,
      `Jenny also plans Botox®, Xeomin®, PRP treatments, and hyperhidrosis care at the clinic, starting with a consultation.`,
      `Tap Learn more to read Jenny's full background.`
    ),
    cta: "LEARN_MORE",
    url: `${SITE}/staff/jenny-brady`,
  },
  {
    slug: "blomdahl-medical-plastic-vs-titanium",
    publishOn: "2026-12-07",
    type: "update",
    template: "question",
    title: "Medical Plastic or titanium starter earrings?",
    subtitle: "How the two Blomdahl starter options compare for sensitive ears.",
    body: paragraphs(
      `A common question before a first piercing in Williamsburg, VA: should the starter earrings be Blomdahl Medical Plastic or Medical Grade Titanium?`,
      `Starter earrings stay in while the piercing begins to heal, so the material matters. Both are hypoallergenic options in the Blomdahl medical ear-piercing system used at Williamsburg Med Spa.`,
      `Medical Plastic is the cleanest choice when nickel is the main concern, because Blomdahl describes it as 0% nickel. It is lightweight and low-profile, and parents often consider it for a child's first earrings or after a past jewelry reaction.`,
      `Medical Grade Titanium suits patients who prefer a more traditional metal earring, such as teens and adults who already know titanium works for them. If you have a known metal allergy, tell Jenny before choosing.`,
      `Initial piercings use Blomdahl starter earrings rather than outside jewelry, so the piercing, the earrings, and the aftercare plan follow the same sterile system, with a single-use cassette for each visit.`,
      `Before you book, ask which starter options are available, how long they should stay in, and when to call if an ear looks irritated.`,
      `Our full comparison walks through both materials. Tap Learn more to read it.`
    ),
    cta: "LEARN_MORE",
    url: `${SITE}/blog/blomdahl-medical-plastic-vs-titanium-earrings`,
  },
  {
    slug: "botox-vs-xeomin",
    publishOn: "2026-12-14",
    type: "update",
    template: "question",
    title: "Botox® or Xeomin®: what is the difference?",
    subtitle: "Same category, different formulations. The plan matters more than the name.",
    body: paragraphs(
      `One of the most common questions at our Williamsburg, VA clinic: what is the difference between Botox® and Xeomin®?`,
      `Both are prescription botulinum toxin type A treatments. In cosmetic care, both temporarily reduce activity in selected muscles, which can soften lines from repeated expression such as frown lines, forehead lines, and crow's feet.`,
      `They are distinct products. Botox® is onabotulinumtoxinA and Xeomin® is incobotulinumtoxinA. They are manufactured differently and their dose units are not interchangeable, so compare quotes on the full treatment plan, not a unit price.`,
      `Timing is similar for many patients: change often shows within several days, with a fuller effect around two weeks, and smoothing commonly lasts about 3 to 4 months. Individual response, area, and dosing can change that.`,
      `A natural look is mostly a planning question, not a brand question. It comes from careful muscle mapping, balanced dosing, and a clear talk about how much movement you want to keep.`,
      `Temporary side effects can include redness, bruising, tenderness, or swelling at injection sites. Rare but serious risks should be discussed directly with your provider before treatment. At Williamsburg Med Spa, ${JENNY} reviews your history, prior response, and goals before recommending either one.`,
      `Our Botox® vs Xeomin® guide has the details. Tap Learn more to read it.`
    ),
    cta: "LEARN_MORE",
    url: `${SITE}/blog/botox-vs-xeomin-williamsburg-va`,
  },
  {
    slug: "merry-christmas",
    publishOn: "2026-12-21",
    type: "update",
    template: "holiday",
    holiday: "christmas",
    title: "Merry Christmas",
    subtitle: "Wishing you a warm and peaceful holiday season.",
    body: paragraphs(
      `Merry Christmas from all of us at Williamsburg Med Spa.`,
      `We hope this season gives you time with the people you love, whether you are home in Williamsburg, VA or traveling to see family. We hope there are a few slow mornings, a good meal or two, and at least one moment where nothing needs to be done.`,
      `To every patient and family who came through our door this year: thank you. Thank you for your questions, your trust, and the kind words you have shared with friends and neighbors. Being part of your milestones, from a child's first earrings to a long-planned appointment of your own, is the part of this work we enjoy the most.`,
      `Whether your holiday is busy and loud or quiet and simple, we hope it brings rest and something to smile about.`,
      `When you are ready to plan for the new year, tap Call and we will help with any questions. Merry Christmas and happy holidays.`
    ),
    cta: "CALL",
    url: `${SITE}/`,
  },
  {
    slug: "prp-facial-new-year",
    publishOn: "2026-12-28",
    type: "update",
    template: "holiday",
    holiday: "newyear",
    kicker: "New year skin",
    title: "Start the year with a PRP Facial",
    subtitle: "A facial that uses platelet-rich plasma from your own blood.",
    priceLine: chip(prpFacial.cash, prpFacial.card),
    body: paragraphs(
      `A new year is a natural time to book the skin appointment you have been putting off. At Williamsburg Med Spa in Williamsburg, VA, one option is the PRP Facial.`,
      `PRP stands for platelet-rich plasma. During the visit, a small sample of your blood is drawn and spun in a centrifuge to separate the PRP from the red blood cells. That PRP is then applied to the skin as part of the facial.`,
      `Patients ask about the PRP Facial for skin texture, tone, fine lines, or the look of acne scars. Whether it fits your skin is a consultation question. ${JENNY}, reviews your concerns, your health history, and whether a series of visits makes sense.`,
      `A numbing cream is applied first, and you may feel tingling or a slight pricking sensation. Mild redness and swelling for 1 to 3 days afterward is common, so plan on sunscreen and avoiding direct sun while the skin heals.`,
      `The PRP Facial is ${prpFacial.cash} in cash, or ${prpFacial.card} online or by card.`,
      `Tap Book to start the year with a plan.`
    ),
    cta: "BOOK",
    url: `${SITE}/procedures/prp-facial`,
  },
  {
    slug: "hyperhidrosis-treatment",
    publishOn: "2027-01-04",
    type: "update",
    template: "spotlight",
    title: "Hyperhidrosis treatment",
    subtitle: "Localized treatment for underarms, palms, feet, and other sweat-prone areas.",
    priceLine: chip(`${hyperhidrosis.cash}+`, `${hyperhidrosis.card}+`),
    body: paragraphs(
      `If excessive sweating affects your clothing choices, handshakes, workouts, or work days, hyperhidrosis treatment is worth a conversation at Williamsburg Med Spa in Williamsburg, VA.`,
      `Hyperhidrosis treatment uses localized injections to reduce excessive sweating in targeted areas. Underarms, palms, and feet are the most common places patients ask about, and the face, scalp, back, and other localized zones can also be discussed.`,
      `Planning starts with the area that disrupts your day the most, whether that is visible sweat marks, clammy hands, damp shoes, or facial sweating that topical antiperspirants have not controlled well. ${JENNY}, maps the highest-impact area, reviews your candidacy and health history, and plans localized treatment there.`,
      `The effect builds over days and is temporary, so Jenny also reviews expected timing and when a maintenance visit may make sense for your sweating pattern. Temporary side effects can include redness, bruising, tenderness, or swelling at injection sites, and possible risks are reviewed before treatment.`,
      `Hyperhidrosis treatment starts at ${hyperhidrosis.cash} in cash, or ${hyperhidrosis.card} online or by card, and your total depends on the areas treated.`,
      `Tap Book to request a hyperhidrosis visit.`
    ),
    cta: "BOOK",
    url: `${SITE}/procedures/hyperhidrosis-treatment`,
  },
  {
    slug: "ear-piercing-aftercare",
    publishOn: "2027-01-11",
    type: "update",
    template: "question",
    title: "What does ear piercing aftercare look like?",
    subtitle: "Keep it clean, leave the starter earrings in, and know when to call.",
    body: paragraphs(
      `Parents in Williamsburg, VA often ask what happens after a first ear piercing. The short answer: keep the area clean, keep hands away, and leave the starter earrings in place.`,
      `Before you leave a Blomdahl visit at Williamsburg Med Spa, ${JENNY} walks through how to clean the piercing, what not to touch, how long the starter earrings should stay in, what is normal early on, and what should prompt a call. For a child's first piercing, it helps to repeat those steps in simple language before the ride home.`,
      `Starter earrings stay in through the early healing window unless Jenny gives different instructions. For earlobes, families commonly plan around several weeks before switching. Do not change earrings early just because the ear looks calm, because the inside of the piercing can still be healing.`,
      `Children may need reminders not to twist, pull, or play with new earrings. Clean only the way Jenny instructed, then leave the earrings alone. If swimming, sports, travel, or a big event is coming up, mention it before you schedule.`,
      `Call the clinic or seek medical care for redness that keeps spreading, swelling that gets worse, warmth, drainage, fever, increasing pain, or an earring that feels embedded or too tight.`,
      `Our aftercare guide has the full checklist. Tap Learn more to read it.`
    ),
    cta: "LEARN_MORE",
    url: `${SITE}/blog/ear-piercing-aftercare-williamsburg-va`,
  },
  {
    slug: "thank-you-for-your-reviews",
    publishOn: "2027-01-18",
    type: "update",
    template: "trust",
    kicker: "Thank you, Williamsburg",
    title: "Thank you for your reviews",
    subtitle: "Every honest review helps a neighbor decide where to book.",
    body: paragraphs(
      `Thank you to everyone who has taken a minute to leave Williamsburg Med Spa a Google review.`,
      `When someone in Williamsburg, VA is deciding where to take a child for a first piercing, or who to talk with about Botox®, Xeomin®, or PRP, reviews from other patients are often where they start. Every review you write helps a neighbor make that decision with more information. We read each one, and they mean a great deal to Jenny and to everyone at the clinic.`,
      `If you have visited us and have not left a review yet, we would be grateful if you did. Share what your visit was like in your own words: what you came in for, how the appointment felt, and anything that would help the next person. Short or long, honest feedback is what makes reviews useful, and it helps us too.`,
      `There is no discount or reward for leaving a review, only our thanks.`,
      `If you have been in, tap Learn more to open our Google review form.`
    ),
    cta: "LEARN_MORE",
    url: GOOGLE_REVIEW_URL,
  },
  {
    slug: "prp-hair-restoration",
    publishOn: "2027-01-25",
    type: "update",
    template: "spotlight",
    kicker: "Thinning hair?",
    title: "PRP hair restoration",
    subtitle: "A non-surgical, consult-led option for select men and women.",
    priceLine: chip(prpHair.cash, prpHair.card, "per treatment"),
    body: paragraphs(
      `If you are noticing thinning hair, more shedding, a widening part, or early pattern changes, PRP hair restoration is worth a conversation at Williamsburg Med Spa in Williamsburg, VA.`,
      `PRP stands for platelet-rich plasma. It is prepared from a small sample of your own blood and placed in the scalp during the visit. It is not surgery, and it does not move follicles the way a hair transplant does.`,
      `Because hair loss has many possible causes, the visit starts with a conservative consultation. ${JENNY} reviews your timeline, scalp concerns, health history, medications, and goals. Sometimes the right next step is medical evaluation first, or a specialist if a transplant fits your goal better, and Jenny will say so.`,
      `If PRP does fit, the consultation covers what a visit involves and what to expect afterward. Response varies from person to person, so the plan is set around your pattern rather than a promise.`,
      `PRP hair restoration is ${prpHair.cash} per treatment in cash, or ${prpHair.card} online or by card.`,
      `Tap Book to request a consultation.`
    ),
    cta: "BOOK",
    url: `${SITE}/procedures/prp-hair-restoration`,
  },
];

export const GBP_POSTS_BY_SLUG = Object.fromEntries(GBP_POSTS.map((post) => [post.slug, post])) as Record<
  string,
  GbpPost
>;

export const getGbpPost = (slug: string) => GBP_POSTS_BY_SLUG[slug] ?? null;
