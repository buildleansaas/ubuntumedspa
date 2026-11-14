import { normalizeIntimacyProcedureSlug } from "lib/intimacy-aliases";
import {
  cashCardLabel,
  cardPriceCents,
  cardQuantityBreakLineCents,
  cardQuantityBreakUnitCents,
  formatUsdShort,
} from "lib/price";

export type CatalogKind = "product" | "procedure";
export type PricingMode = "fixed" | "quantity" | "increment_credit";
export type FulfillmentMode = "pickup" | "appointment";

export type CatalogItemConfig = {
  slug: string;
  kind: CatalogKind;
  name: string;
  shortDescription: string;
  pricingMode: PricingMode;
  /** Listed cash price per unit (the source of truth). Increment-credit items credit this amount per block. */
  cashAmountCents: number;
  /** Cash per-unit price for a quantity, e.g. { 2: 4000 } = $80 cash for both ears. */
  cashQuantityPriceBreaks?: Record<number, number>;
  /** Card / online price per unit (what Stripe checkout charges). Derived from cashAmountCents. */
  unitAmountCents: number;
  /** Card / online per-unit price for a quantity. Derived from cashQuantityPriceBreaks. */
  quantityPriceBreaks?: Record<number, number>;
  currency: "usd";
  displayPrice: string;
  quantityLabel: string;
  minQuantity: number;
  maxQuantity: number;
  requiresScheduling: boolean;
  fulfillment: FulfillmentMode;
  imagePath?: string;
  stripeProductKey: string;
  stripePriceLookupKey: string;
  schedulingCategory?: "consult" | "paid_procedure";
  purchaseLabel?: string;
  customerNote?: string;
};

type CatalogItemSource = Omit<CatalogItemConfig, "unitAmountCents" | "quantityPriceBreaks" | "displayPrice"> & {
  /** Unit wording placed after the cash price, e.g. "per treatment". */
  displayUnit?: string;
  /** Wording for a quantity price break, e.g. { 2: "for both ears" }. */
  quantityBreakLabels?: Record<number, string>;
};

const CREDIT_BLOCK_CASH_CENTS = 25000;
const creditBlockCash = formatUsdShort(CREDIT_BLOCK_CASH_CENTS);
const creditBlockCard = formatUsdShort(cardPriceCents(CREDIT_BLOCK_CASH_CENTS));

/** How a credit block works, without its price. Shared by the catalog note and the purchase panel. */
export const CREDIT_BLOCK_CREDIT_SENTENCE = `Each block adds ${creditBlockCash} of treatment credit, and any unused value remains as account credit.`;

const deriveCardQuantityPriceBreaks = (cashBreaks: Record<number, number> | undefined) => {
  if (!cashBreaks) return undefined;
  return Object.fromEntries(
    Object.entries(cashBreaks).map(([quantity, cashUnitCents]) => [
      Number(quantity),
      cardQuantityBreakUnitCents(cashUnitCents, Number(quantity)),
    ])
  ) as Record<number, number>;
};

const buildDisplayPrice = (source: CatalogItemSource) => {
  if (source.pricingMode === "increment_credit") {
    return `${formatUsdShort(source.cashAmountCents)} credit blocks · ${cashCardLabel(source.cashAmountCents)}`;
  }

  const breaks = Object.entries(source.cashQuantityPriceBreaks ?? {}).map(([quantity, cashUnitCents]) => ({
    quantity: Number(quantity),
    cashLineCents: cashUnitCents * Number(quantity),
    // Exactly what checkout charges for this quantity: per-unit card break x quantity.
    cardLineCents: cardQuantityBreakLineCents(cashUnitCents, Number(quantity)),
  }));

  if (breaks.length) {
    const cashParts = [
      `${formatUsdShort(source.cashAmountCents)}${source.displayUnit ? ` ${source.displayUnit}` : ""}`,
      ...breaks.map(
        ({ quantity, cashLineCents }) =>
          `${formatUsdShort(cashLineCents)} ${source.quantityBreakLabels?.[quantity] ?? `for ${quantity}`}`
      ),
    ];
    const cardParts = [formatUsdShort(cardPriceCents(source.cashAmountCents)), ...breaks.map(({ cardLineCents }) => formatUsdShort(cardLineCents))];
    return `${cashParts.join(" or ")} cash · ${cardParts.join(" or ")} card/online`;
  }

  return cashCardLabel(source.cashAmountCents, source.displayUnit);
};

const toCatalogItem = (source: CatalogItemSource): CatalogItemConfig => {
  const { displayUnit: _displayUnit, quantityBreakLabels: _quantityBreakLabels, ...config } = source;
  const quantityPriceBreaks = deriveCardQuantityPriceBreaks(source.cashQuantityPriceBreaks);

  return {
    ...config,
    unitAmountCents: cardPriceCents(source.cashAmountCents),
    ...(quantityPriceBreaks ? { quantityPriceBreaks } : {}),
    displayPrice: buildDisplayPrice(source),
  };
};

const COMMERCE_CATALOG_SOURCE: CatalogItemSource[] = [
  {
    slug: "oh-shot",
    kind: "procedure",
    name: "OH-Shot",
    shortDescription: "Full upfront payment for one treatment visit.",
    pricingMode: "fixed",
    cashAmountCents: 120000,
    currency: "usd",
    quantityLabel: "treatment",
    minQuantity: 1,
    maxQuantity: 10,
    requiresScheduling: true,
    fulfillment: "appointment",
    imagePath: "/procedure/oh-shot/womens-intimate-wellness-lifestyle.webp",
    stripeProductKey: "wms_procedure_o_shot",
    stripePriceLookupKey: "wms_procedure_o_shot_1200_v1",
  },
  {
    slug: "pe-shot",
    kind: "procedure",
    name: "Pe-Shot",
    shortDescription: "Full upfront payment for one treatment visit.",
    pricingMode: "fixed",
    cashAmountCents: 190000,
    currency: "usd",
    quantityLabel: "treatment",
    minQuantity: 1,
    maxQuantity: 10,
    requiresScheduling: true,
    fulfillment: "appointment",
    imagePath: "/procedure/pe-shot-consultation-confidence.webp",
    stripeProductKey: "wms_procedure_p_shot",
    stripePriceLookupKey: "wms_procedure_p_shot_1900_v1",
  },
  {
    slug: "prp-breast-lift",
    kind: "procedure",
    name: "PRP Breast Lift",
    shortDescription: "Full upfront payment for one treatment visit.",
    pricingMode: "fixed",
    cashAmountCents: 180000,
    currency: "usd",
    quantityLabel: "treatment",
    minQuantity: 1,
    maxQuantity: 1,
    requiresScheduling: true,
    fulfillment: "appointment",
    imagePath: "/procedure/prp-breast-lift-consultation-confidence.webp",
    stripeProductKey: "wms_procedure_prp_breast_lift",
    stripePriceLookupKey: "wms_procedure_prp_breast_lift_1800_v1",
    customerNote:
      "Checkout is for one treatment visit. Contact the clinic before purchasing if you need the current service details or written purchase terms.",
  },
  {
    slug: "prp-hair-restoration",
    kind: "procedure",
    name: "PRP Hair Restoration",
    shortDescription: "Charged per treatment session.",
    pricingMode: "fixed",
    cashAmountCents: 60000,
    currency: "usd",
    displayUnit: "per treatment",
    quantityLabel: "treatment",
    minQuantity: 1,
    maxQuantity: 1,
    requiresScheduling: true,
    fulfillment: "appointment",
    imagePath: "/procedure/hair-restoration/prp-hair-restoration-consultation.webp",
    stripeProductKey: "wms_procedure_prp_hair_restoration",
    stripePriceLookupKey: "wms_procedure_prp_hair_restoration_600_v1",
    purchaseLabel: "For patients cleared to proceed",
    customerNote:
      "If you have not completed a hair-loss consultation, book that first. Purchase one session only after Jenny confirms PRP is a reasonable fit and discusses your next-step plan.",
  },
  {
    slug: "prp-facial",
    kind: "procedure",
    name: "PRP Facial",
    shortDescription: "Full upfront payment for one treatment visit.",
    pricingMode: "fixed",
    cashAmountCents: 60000,
    currency: "usd",
    quantityLabel: "treatment",
    minQuantity: 1,
    maxQuantity: 10,
    requiresScheduling: true,
    fulfillment: "appointment",
    imagePath: "/procedure/prp-facial-consultation-glow.webp",
    stripeProductKey: "wms_procedure_prp_facial",
    stripePriceLookupKey: "wms_procedure_prp_facial_600_v1",
  },
  {
    slug: "prp-face-lift",
    kind: "procedure",
    name: "PRP Face Lift",
    shortDescription: "Full upfront payment for one treatment visit.",
    pricingMode: "fixed",
    cashAmountCents: 150000,
    currency: "usd",
    quantityLabel: "treatment",
    minQuantity: 1,
    maxQuantity: 10,
    requiresScheduling: true,
    fulfillment: "appointment",
    imagePath: "/procedure/prp-face-lift-consultation-refresh.webp",
    stripeProductKey: "wms_procedure_prp_face_lift",
    stripePriceLookupKey: "wms_procedure_prp_face_lift_1500_v1",
  },
  {
    slug: "joint-restoration",
    kind: "procedure",
    name: "Joint Restoration",
    shortDescription: "Full upfront payment for one treatment visit.",
    pricingMode: "fixed",
    cashAmountCents: 80000,
    currency: "usd",
    quantityLabel: "treatment",
    minQuantity: 1,
    maxQuantity: 10,
    requiresScheduling: true,
    fulfillment: "appointment",
    imagePath: "/procedure/prp-joint-restoration-consultation.webp",
    stripeProductKey: "wms_procedure_joint_restoration",
    stripePriceLookupKey: "wms_procedure_joint_restoration_800_v1",
  },
  {
    slug: "xeomin",
    kind: "procedure",
    name: "Xeomin",
    shortDescription: `Each block adds ${creditBlockCash} of treatment credit.`,
    pricingMode: "increment_credit",
    cashAmountCents: CREDIT_BLOCK_CASH_CENTS,
    currency: "usd",
    quantityLabel: `${creditBlockCash} block`,
    minQuantity: 1,
    maxQuantity: 4,
    requiresScheduling: true,
    fulfillment: "appointment",
    imagePath: "/procedure/xeomin-brow-expression-closeup.webp",
    stripeProductKey: "wms_procedure_xeomin",
    stripePriceLookupKey: "wms_procedure_xeomin_block_250_v1",
    customerNote:
      `Xeomin is prepaid online in ${creditBlockCash} credit blocks (${creditBlockCash} per block in cash or ${creditBlockCard} online by card). ${CREDIT_BLOCK_CREDIT_SENTENCE}`,
  },
  {
    slug: "hyperhidrosis-treatment",
    kind: "procedure",
    name: "Hyperhidrosis Treatment",
    shortDescription: "Full upfront payment for one treatment visit.",
    pricingMode: "fixed",
    cashAmountCents: 100000,
    currency: "usd",
    quantityLabel: "treatment",
    minQuantity: 1,
    maxQuantity: 10,
    requiresScheduling: true,
    fulfillment: "appointment",
    imagePath: "/procedure/hyperhidrosis/hyperhidrosis-confidence-lifestyle.webp",
    stripeProductKey: "wms_procedure_hyperhidrosis_treatment",
    stripePriceLookupKey: "wms_procedure_hyperhidrosis_treatment_1000_v1",
  },
  {
    slug: "blomdahl-ear-piercing",
    kind: "procedure",
    name: "Blomdahl Ear Piercing",
    shortDescription: "Charged per ear.",
    pricingMode: "quantity",
    cashAmountCents: 4500,
    cashQuantityPriceBreaks: {
      2: 4000,
    },
    currency: "usd",
    displayUnit: "per ear",
    quantityBreakLabels: {
      2: "for both ears",
    },
    quantityLabel: "ear",
    minQuantity: 1,
    maxQuantity: 2,
    requiresScheduling: true,
    fulfillment: "appointment",
    imagePath: "/clinic/blomdahl-jenny-triplets-first-earrings.webp",
    stripeProductKey: "wms_procedure_blomdahl_ear_piercing",
    stripePriceLookupKey: "wms_procedure_blomdahl_ear_piercing_45_v1",
  },
  {
    slug: "b12-injections",
    kind: "procedure",
    name: "Vitamin B-12 Injections",
    shortDescription: "Charged per injection.",
    pricingMode: "fixed",
    cashAmountCents: 2500,
    currency: "usd",
    displayUnit: "per injection",
    quantityLabel: "injection",
    // One at a time: Jenny reviews health history before the first injection and sets any schedule after.
    minQuantity: 1,
    maxQuantity: 1,
    requiresScheduling: true,
    fulfillment: "appointment",
    imagePath: "/procedure/prp-joint-restoration-consultation.webp",
    stripeProductKey: "wms_procedure_b12_injections",
    stripePriceLookupKey: "wms_procedure_b12_injections_25_v1",
    customerNote:
      "After you pay, text or call Jenny at (804) 738-9483 to set up your visit. Jenny reviews your health history and medications before giving an injection. If she decides it is not right for you, your payment is refunded.",
  },
  {
    slug: "co2-lift",
    kind: "product",
    name: "Co2 Lift",
    shortDescription: "Pickup-only cosmetic skincare gel.",
    pricingMode: "fixed",
    cashAmountCents: 10000,
    currency: "usd",
    quantityLabel: "item",
    minQuantity: 1,
    maxQuantity: 10,
    requiresScheduling: false,
    fulfillment: "pickup",
    imagePath: "/product/c02-lift-pro.webp",
    stripeProductKey: "wms_product_co2_lift",
    stripePriceLookupKey: "wms_product_co2_lift_100_v1",
  },
  {
    slug: "co2-v-lift-for-women",
    kind: "product",
    name: "Co2 V Lift for Women",
    shortDescription: "Pickup-only cosmetic gel.",
    pricingMode: "fixed",
    cashAmountCents: 50000,
    currency: "usd",
    quantityLabel: "item",
    minQuantity: 1,
    maxQuantity: 10,
    requiresScheduling: false,
    fulfillment: "pickup",
    imagePath: "/product/c02-v-lift.webp",
    stripeProductKey: "wms_product_co2_v_lift_for_women",
    stripePriceLookupKey: "wms_product_co2_v_lift_for_women_500_v1",
  },
  {
    slug: "definage-clinical-power-trio-pro",
    kind: "product",
    name: "Definage Clinical Power Trio Pro",
    shortDescription: "Pickup-only medical-grade skincare product.",
    pricingMode: "fixed",
    cashAmountCents: 37000,
    currency: "usd",
    quantityLabel: "item",
    minQuantity: 1,
    maxQuantity: 10,
    requiresScheduling: false,
    fulfillment: "pickup",
    imagePath: "/product/defenage-power-pro.jpg",
    stripeProductKey: "wms_product_definage_clinical_power_trio_pro",
    stripePriceLookupKey: "wms_product_definage_clinical_power_trio_pro_370_v1",
  },
];

export const COMMERCE_CATALOG: CatalogItemConfig[] = COMMERCE_CATALOG_SOURCE.map(toCatalogItem);

export const COMMERCE_CATALOG_BY_SLUG = Object.fromEntries(COMMERCE_CATALOG.map((item) => [item.slug, item])) as Record<
  string,
  CatalogItemConfig
>;

export const getCatalogConfigBySlug = (slug: string) =>
  COMMERCE_CATALOG_BY_SLUG[normalizeIntimacyProcedureSlug(slug)] || null;

/** Formatted ear-piercing prices for copy, derived from the catalog (exactly what checkout charges). */
export const EAR_PIERCING_PRICES = (() => {
  const piercing = COMMERCE_CATALOG_BY_SLUG["blomdahl-ear-piercing"];
  const bothEarsCashUnit = piercing.cashQuantityPriceBreaks?.[2];
  const bothEarsCardUnit = piercing.quantityPriceBreaks?.[2];
  if (bothEarsCashUnit === undefined || bothEarsCardUnit === undefined) {
    throw new Error("Blomdahl ear piercing is missing its two-ear price break.");
  }

  return {
    oneEarCard: formatUsdShort(piercing.unitAmountCents),
    oneEarCash: formatUsdShort(piercing.cashAmountCents),
    bothEarsCard: formatUsdShort(bothEarsCardUnit * 2),
    bothEarsCash: formatUsdShort(bothEarsCashUnit * 2),
  };
})();
