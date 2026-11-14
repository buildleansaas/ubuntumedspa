import { COMMERCE_CATALOG_BY_SLUG, EAR_PIERCING_PRICES } from "config/commerce-catalog";
import { CONSULT_CONCERNS } from "lib/consult-concerns";
import { CARD_PRICE_SENTENCE, cardPriceLabel, formatUsdShort } from "lib/price";

import type { ChooserTile } from "./home-chooser";

// Homepage chooser tiles and "Prices, written out" rows. Every amount comes from the catalog; every tile label is a
// consult concern Jenny approved (2026-11-13), looked up by value so a renamed concern fails the type check.

export const XEOMIN_CASH = formatUsdShort(COMMERCE_CATALOG_BY_SLUG.xeomin.cashAmountCents);
export const XEOMIN_CARD = cardPriceLabel(COMMERCE_CATALOG_BY_SLUG.xeomin.cashAmountCents);

const cash = (slug: string) => formatUsdShort(COMMERCE_CATALOG_BY_SLUG[slug].cashAmountCents);
const card = (slug: string) => cardPriceLabel(COMMERCE_CATALOG_BY_SLUG[slug].cashAmountCents);

type ConsultConcernLabel = (typeof CONSULT_CONCERNS)[number]["label"];

const concern = (label: ConsultConcernLabel) => {
  const match = CONSULT_CONCERNS.find((item) => item.label === label);
  if (!match) throw new Error(`Unknown consult concern: ${label}`);
  return match.label;
};

// Hyperhidrosis is priced "from" the catalog amount: treatment areas vary (see the procedure page).
const HYPERHIDROSIS_CASH = `from ${cash("hyperhidrosis-treatment")}`;
const HYPERHIDROSIS_CARD = `from ${card("hyperhidrosis-treatment")}`;

export const CHOOSER_TILES: ChooserTile[] = [
  {
    concern: concern("Lines when I frown, raise my brows or smile"),
    treatment: "Xeomin",
    href: "/procedures/xeomin",
    price: `from ${XEOMIN_CASH} cash`,
  },
  {
    concern: concern("Heavy sweating (underarms, palms, feet)"),
    treatment: "Hyperhidrosis treatment",
    href: "/procedures/hyperhidrosis-treatment",
    price: `${HYPERHIDROSIS_CASH} cash`,
  },
  {
    concern: concern("My child's first earrings / ear piercing"),
    treatment: "Blomdahl ear piercing",
    href: "/procedures/blomdahl-ear-piercing",
    price: `${EAR_PIERCING_PRICES.oneEarCash} per ear, cash`,
  },
  {
    concern: concern("Tired or uneven skin"),
    treatment: "PRP Facial",
    href: "/procedures/prp-facial",
    price: `${cash("prp-facial")} cash`,
  },
  {
    concern: concern("Thinning hair"),
    treatment: "PRP hair restoration",
    href: "/procedures/prp-hair-restoration",
    price: `${cash("prp-hair-restoration")} per treatment, cash`,
  },
  {
    concern: concern("Intimate dryness or discomfort"),
    treatment: "OH-Shot",
    href: "/procedures/oh-shot",
    price: `${cash("oh-shot")} cash`,
  },
];

export type HomePriceRow = { name: string; href: string; cash: string; card: string; note: string };

// Cash first, card smaller. A Xeomin credit block is exactly the block price, so no "from".
export const HOME_PRICE_ROWS: HomePriceRow[] = [
  { name: "Xeomin", href: "/procedures/xeomin", cash: XEOMIN_CASH, card: XEOMIN_CARD, note: "per credit block" },
  {
    name: "Blomdahl ear piercing",
    href: "/procedures/blomdahl-ear-piercing",
    cash: EAR_PIERCING_PRICES.oneEarCash,
    card: EAR_PIERCING_PRICES.oneEarCard,
    note: "per ear",
  },
  { name: "PRP Facial", href: "/procedures/prp-facial", cash: cash("prp-facial"), card: card("prp-facial"), note: "per treatment" },
  {
    name: "Hyperhidrosis treatment",
    href: "/procedures/hyperhidrosis-treatment",
    cash: HYPERHIDROSIS_CASH,
    card: HYPERHIDROSIS_CARD,
    note: "per treatment",
  },
  { name: "OH-Shot", href: "/procedures/oh-shot", cash: cash("oh-shot"), card: card("oh-shot"), note: "per treatment" },
];

export const HOME_PRICE_INTRO = `Cash price first. ${CARD_PRICE_SENTENCE}`;
