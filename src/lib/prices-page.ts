import { COMMERCE_CATALOG, COMMERCE_CATALOG_BY_SLUG, type CatalogItemConfig } from "../config/commerce-catalog";
import { cardPriceSchemaValue, formatUsdShort } from "./price";
import { BOOKING_PHONE_DISPLAY } from "./text-to-book";

// Every price on /prices comes from COMMERCE_CATALOG (cash is the base price; card/online is derived from it).
// Nothing in this file or the page types a dollar amount by hand.

const CANONICAL_ORIGIN = "https://www.williamsburgmedspa.com";
export const PRICES_PATH = "/prices";

export const PRICE_GROUPS = [
  { id: "wrinkle-relaxer", name: "Wrinkle relaxer", slugs: ["xeomin"] },
  {
    id: "prp-treatments",
    name: "PRP treatments",
    slugs: ["prp-facial", "prp-face-lift", "prp-hair-restoration", "prp-breast-lift", "joint-restoration"],
  },
  { id: "intimate-wellness", name: "Intimate wellness", slugs: ["oh-shot", "pe-shot", "co2-v-lift-for-women"] },
  { id: "ear-piercing", name: "Ear piercing", slugs: ["blomdahl-ear-piercing"] },
  { id: "injections", name: "Injections", slugs: ["b12-injections", "hyperhidrosis-treatment"] },
  { id: "skincare-products", name: "Skincare products", slugs: ["co2-lift", "definage-clinical-power-trio-pro"] },
] as const;

export type PriceRow = {
  slug: string;
  name: string;
  href: string;
  displayPrice: string;
  unitNote: string;
  item: CatalogItemConfig;
};

export type PriceGroup = { id: string; name: string; rows: PriceRow[] };

export const catalogItemHref = (item: CatalogItemConfig) =>
  item.kind === "product" ? `/products/${item.slug}` : `/procedures/${item.slug}`;

const toRow = (item: CatalogItemConfig): PriceRow => ({
  slug: item.slug,
  name: item.name,
  href: catalogItemHref(item),
  displayPrice: item.displayPrice,
  unitNote: item.shortDescription,
  item,
});

/** Catalog items grouped for /prices. Any catalog item not assigned to a group still shows, under "Other". */
export const getPriceGroups = (catalog: CatalogItemConfig[] = COMMERCE_CATALOG): PriceGroup[] => {
  const bySlug = new Map(catalog.map((item) => [item.slug, item]));
  const assigned = new Set<string>();
  const groups: PriceGroup[] = PRICE_GROUPS.map((group) => ({
    id: group.id,
    name: group.name,
    rows: group.slugs.flatMap((slug) => {
      const item = bySlug.get(slug);
      if (!item) return [];
      assigned.add(slug);
      return [toRow(item)];
    }),
  })).filter((group) => group.rows.length > 0);

  const unassigned = catalog.filter((item) => !assigned.has(item.slug));
  if (unassigned.length) groups.push({ id: "other", name: "Other", rows: unassigned.map(toRow) });
  return groups;
};

const cash = (slug: string) => formatUsdShort(COMMERCE_CATALOG_BY_SLUG[slug].cashAmountCents);

export const PRICES_TITLE = "Med Spa Prices in Williamsburg, VA | Cash and Card Prices";
export const PRICES_DESCRIPTION = `Every price posted: Xeomin® ${cash("xeomin")} cash per credit block, ear piercing ${cash(
  "blomdahl-ear-piercing"
)}, B-12 ${cash("b12-injections")}, PRP facial ${cash("prp-facial")}. Cash price first, card/online price shown.`;
export const PRICES_H1 = "Williamsburg Med Spa Prices";

export const PRICES_FAQS = [
  {
    question: "Why are card prices higher?",
    answer:
      "The cash price is the base price. The card/online price covers card processing, so it is a little higher. If you pay cash in the office, you pay the cash price. Online checkout and card payments in the office are charged the card price.",
  },
  {
    question: "Do you take insurance?",
    answer:
      "Williamsburg Med Spa is self-pay: the prices on this page are what you pay the clinic, in cash or by card. If you plan to ask an insurer, HSA, or FSA about reimbursement, ask Jenny for a receipt when you book.",
  },
  {
    question: "How do I book?",
    answer: `Pay online for the service, then text or call Jenny at ${BOOKING_PHONE_DISPLAY} to pick a time. Not sure which service fits? Request a consultation first and Jenny will follow up.`,
  },
];

/** OfferCatalog JSON-LD. Offer price is the card / online price, which is what checkout charges (as on service pages). */
export const buildPricesOfferCatalog = (groups: PriceGroup[] = getPriceGroups()) => ({
  "@context": "https://schema.org",
  "@type": "OfferCatalog",
  name: "Williamsburg Med Spa prices",
  url: `${CANONICAL_ORIGIN}${PRICES_PATH}`,
  itemListElement: groups.map((group) => ({
    "@type": "OfferCatalog",
    name: group.name,
    itemListElement: group.rows.map((row) => ({
      "@type": "Offer",
      name: row.name,
      url: `${CANONICAL_ORIGIN}${row.href}`,
      price: cardPriceSchemaValue(row.item.cashAmountCents),
      priceCurrency: "USD",
      availability: "https://schema.org/InStock",
      itemOffered: {
        "@type": row.item.kind === "product" ? "Product" : "Service",
        name: row.name,
        url: `${CANONICAL_ORIGIN}${row.href}`,
      },
      seller: { "@type": "MedicalBusiness", name: "Williamsburg Med Spa", url: CANONICAL_ORIGIN },
    })),
  })),
});
