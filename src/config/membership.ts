import { COMMERCE_CATALOG_BY_SLUG } from "config/commerce-catalog";

/**
 * "Your Year with Jenny" prepaid yearly packages (Austin, 2026-11-05). v1 is a one-time yearly purchase: no auto-billing.
 * Every value comes from the catalog cash price, never typed by hand. Discount: 5% with one package, 10% with two or more.
 */

const cash = (slug: string) => {
  const item = COMMERCE_CATALOG_BY_SLUG[slug];
  if (!item) throw new Error(`Membership package refers to unknown catalog item ${slug}`);
  return item.cashAmountCents;
};

export type XeominLevel = "none" | "standard" | "plus";
export type XeominFrequency = 1 | 2 | 3;
export type AddOnSlug = "joints" | "aesthetic" | "pleasure" | "couples";

/** One Xeomin credit block per visit (standard) or two (Plus). */
export const XEOMIN_BLOCK_CASH_CENTS = cash("xeomin");
export const XEOMIN_BLOCKS_PER_VISIT: Record<Exclude<XeominLevel, "none">, number> = { standard: 1, plus: 2 };

export const ADD_ONS: Array<{ slug: AddOnSlug; name: string; includes: string; catalogSlug: string; cashCents: number }> = [
  { slug: "joints", name: "Joints", includes: "1 PRP joint visit a year", catalogSlug: "joint-restoration", cashCents: cash("joint-restoration") },
  { slug: "aesthetic", name: "Aesthetic", includes: "1 PRP Facial a year", catalogSlug: "prp-facial", cashCents: cash("prp-facial") },
  { slug: "pleasure", name: "Pleasure", includes: "1 OH-Shot a year", catalogSlug: "oh-shot", cashCents: cash("oh-shot") },
  { slug: "couples", name: "Couples", includes: "1 Pe-Shot a year for your partner", catalogSlug: "pe-shot", cashCents: cash("pe-shot") },
];

export type MembershipSelection = { xeomin: XeominLevel; frequency: XeominFrequency; addOns: AddOnSlug[] };

export type MembershipLine = { key: string; label: string; includes: string; regularCents: number };

export const membershipLines = (selection: MembershipSelection): MembershipLine[] => {
  const lines: MembershipLine[] = [];
  if (selection.xeomin !== "none") {
    const blocks = XEOMIN_BLOCKS_PER_VISIT[selection.xeomin] * selection.frequency;
    lines.push({
      key: `xeomin-${selection.xeomin}-${selection.frequency}`,
      label: selection.xeomin === "plus" ? "Xeomin Plus" : "Xeomin",
      includes: `${blocks} Xeomin credit ${blocks === 1 ? "block" : "blocks"} a year, ${selection.frequency === 1 ? "one visit" : `about every ${12 / selection.frequency} months`}`,
      regularCents: blocks * XEOMIN_BLOCK_CASH_CENTS,
    });
  }
  for (const addOn of ADD_ONS) {
    if (selection.addOns.includes(addOn.slug)) {
      lines.push({ key: addOn.slug, label: addOn.name, includes: addOn.includes, regularCents: addOn.cashCents });
    }
  }
  return lines;
};

/** 5% off with one package, 10% off with two or more. Never stacked. */
export const discountRate = (packageCount: number) => (packageCount >= 2 ? 0.1 : packageCount === 1 ? 0.05 : 0);

export const membershipTotals = (selection: MembershipSelection) => {
  const lines = membershipLines(selection);
  const regularCents = lines.reduce((sum, line) => sum + line.regularCents, 0);
  const rate = discountRate(lines.length);
  const memberCents = Math.round(regularCents * (1 - rate));
  return { lines, regularCents, rate, memberCents, savedCents: regularCents - memberCents };
};

/** The check-up: plain-language concerns that switch packages on. Nothing here is a diagnosis. */
export const CONCERNS: Array<{ id: string; label: string; detail: string; turnsOn: Partial<MembershipSelection> & { addOn?: AddOnSlug } }> = [
  { id: "lines", label: "Lines when I smile, frown, or raise my brows", detail: "Crow's feet, 11s, forehead lines", turnsOn: { xeomin: "standard" } },
  { id: "more", label: "Several areas, or extra help with summer sweating", detail: "More Xeomin at each visit", turnsOn: { xeomin: "plus" } },
  { id: "joints", label: "Achy knees, shoulders, hands, or wrists", detail: "PRP joint treatment", turnsOn: { addOn: "joints" } },
  { id: "skin", label: "Skin texture, tone, and glow", detail: "PRP Facial", turnsOn: { addOn: "aesthetic" } },
  { id: "intimate", label: "Intimate wellness", detail: "OH-Shot", turnsOn: { addOn: "pleasure" } },
  { id: "partner", label: "Something for my partner, too", detail: "Pe-Shot", turnsOn: { addOn: "couples" } },
];

export const MEMBERSHIP_NOTES = [
  "Jenny confirms every treatment is right for you at your first visit.",
  "Treating sweating is an off-label use of Xeomin.",
  "Prepaid visits never expire. If Jenny finds a treatment isn't medically right for you, the unused amount is refunded.",
];
