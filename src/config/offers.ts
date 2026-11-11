import { COMMERCE_CATALOG_BY_SLUG } from "config/commerce-catalog";
import { cardPriceLabel, formatUsdShort } from "lib/price";
import { TIMES_PROMPT } from "lib/text-to-book";

/**
 * Clinic offers (Austin, 2026-11-05). Every offer here is real and honored at the clinic: online checkout always charges the
 * regular catalog price, so each offer is booked by text or call (Austin, 2026-11-05: online purchases stay at the regular price). Prices are cash first; the card price comes from the
 * same formula as checkout (lib/price cardPriceCents). An offer disappears from /offers and the header on the day after `endsOn`.
 *
 * Financing is NOT an offer: the clinic has no financing provider. Do not add one here until a provider is live.
 */
export type ClinicOffer = {
  slug: string;
  title: string;
  /** One line for the header badge's page and cards. */
  summary: string;
  offerCashCents: number;
  regularCashCents: number;
  /** First day the offer is honored, YYYY-MM-DD in America/New_York. */
  startsOn: string;
  /** Last day the offer is honored, YYYY-MM-DD in America/New_York. */
  endsOn: string;
  details: string[];
  terms: string;
  learnMoreHref: string;
  learnMoreLabel: string;
  /** Prefilled text to Jenny; the patient adds days and times. */
  textMessage: string;
  /**
   * Search snippet for the `learnMoreHref` page while the offer runs (offer first, cash then card, 160 characters max). The page
   * goes back to its own description after `endsOn` (static pages: on the next deploy).
   */
  metaDescription?: string;
};

const piercing = COMMERCE_CATALOG_BY_SLUG["blomdahl-ear-piercing"];
const bothEarsCashPerEar = piercing?.cashQuantityPriceBreaks?.[2];
if (!piercing || bothEarsCashPerEar === undefined) {
  throw new Error("Blomdahl ear piercing is missing its two-ear cash price break.");
}
/** Two kids, both ears each, at the regular both-ears cash price. */
const SIBLING_REGULAR_CASH_CENTS = bothEarsCashPerEar * 2 * 2;
const SIBLING_OFFER_CASH_CENTS = 14000;

export const OFFERS: ClinicOffer[] = [
  {
    slug: "sibling-ear-piercing",
    title: `Sibling Ear Piercing: 2 Kids, Both Ears, ${formatUsdShort(SIBLING_OFFER_CASH_CENTS)}`,
    summary: `Bring two kids for Blomdahl medical ear piercing, both ears each, for ${formatUsdShort(
      SIBLING_OFFER_CASH_CENTS
    )} cash instead of ${formatUsdShort(SIBLING_REGULAR_CASH_CENTS)}.`,
    offerCashCents: SIBLING_OFFER_CASH_CENTS,
    regularCashCents: SIBLING_REGULAR_CASH_CENTS,
    startsOn: "2026-11-05",
    endsOn: "2026-12-31",
    details: [
      "Piercing is done by Jenny Brady, a pediatric nurse practitioner, with sterile single-use cassettes and medical plastic or titanium starter earrings.",
      "Babies are generally pierced at 6 months or older with pediatrician guidance.",
    ],
    terms: `Two children from the same family, both ears each, pierced at the same visit. ${formatUsdShort(
      SIBLING_OFFER_CASH_CENTS
    )} cash or ${cardPriceLabel(
      SIBLING_OFFER_CASH_CENTS
    )} by card. Book by text or call to get the sibling price; online purchases are at the regular price. Not combined with other offers. Ends December 31, 2026.`,
    learnMoreHref: "/procedures/blomdahl-ear-piercing",
    learnMoreLabel: "Blomdahl ear piercing details",
    textMessage: `Hi Jenny. I'd like to book the sibling ear piercing offer for two kids. ${TIMES_PROMPT}`,
    metaDescription: `Holiday sibling offer through Dec 31: 2 kids, both ears, ${formatUsdShort(
      SIBLING_OFFER_CASH_CENTS
    )} cash (${cardPriceLabel(SIBLING_OFFER_CASH_CENTS)} card). Sterile Blomdahl ear piercing in Williamsburg, VA by a pediatric NP.`,
  },
];

/** Today's date (YYYY-MM-DD) in the clinic's time zone. */
export const clinicToday = (now: Date = new Date()) => {
  const parts = new Intl.DateTimeFormat("en-US", {
    timeZone: "America/New_York",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).formatToParts(now);
  const part = (type: "year" | "month" | "day") => parts.find((item) => item.type === type)?.value ?? "";
  return `${part("year")}-${part("month")}-${part("day")}`;
};

export const isOfferActive = (offer: Pick<ClinicOffer, "startsOn" | "endsOn">, today: string = clinicToday()) =>
  offer.startsOn <= today && today <= offer.endsOn;

export const getActiveOffers = (today: string = clinicToday()) => OFFERS.filter((offer) => isOfferActive(offer, today));

/** The running offer's snippet for a page, if an active offer points to it. */
export const activeOfferMetaDescription = (path: string, today: string = clinicToday()) =>
  getActiveOffers(today).find((offer) => offer.learnMoreHref === path && offer.metaDescription)?.metaDescription;

export const OFFERS_PATH = "/offers";
export const OFFERS_TITLE = "Med Spa Offers in Williamsburg, VA | Current Deals";
export const OFFERS_DESCRIPTION =
  "Current offers at Williamsburg Med Spa, with the cash price first and the card price shown. Book by text or call to get an offer price.";
export const OFFERS_H1 = "Current Offers";
