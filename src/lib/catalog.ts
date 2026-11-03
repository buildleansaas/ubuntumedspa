import {
  COMMERCE_CATALOG,
  type CatalogItemConfig,
  type CatalogKind,
} from "config/commerce-catalog";
import { resolveCartItemPricing, resolveSyncedStripePriceId } from "lib/cart-pricing";
import { normalizeIntimacyProcedureSlug } from "lib/intimacy-aliases";
import { ensureMongoIndexes, getDb } from "lib/mongodb";

export type CartItemInput = {
  slug: string;
  kind: CatalogKind;
  quantity: number;
};

export type CatalogItemRecord = {
  slug: string;
  active?: boolean;
  kind?: CatalogKind;
  name?: string;
  pricingMode?: CatalogItemConfig["pricingMode"];
  unitAmountCents?: number;
  quantityPriceBreaks?: CatalogItemConfig["quantityPriceBreaks"];
  currency?: CatalogItemConfig["currency"];
  displayPrice?: string;
  quantityLabel?: string;
  minQuantity?: number;
  maxQuantity?: number;
  requiresScheduling?: boolean;
  fulfillment?: CatalogItemConfig["fulfillment"];
  stripeProductKey?: string;
  stripePriceLookupKey?: string;
  stripeProductId?: string;
  stripePriceId?: string;
  syncedAt?: Date;
  updatedAt: Date;
};

export type ResolvedCartItem = CatalogItemConfig & {
  quantity: number;
  unitLabel: string;
  /** Card / online unit price charged by Stripe. */
  unitAmountCents: number;
  /** Card / online line total charged by Stripe. */
  lineTotalCents: number;
  /** Listed cash unit price. Optional because orders created before card pricing lack it. */
  cashUnitAmountCents?: number;
  /** Listed cash line total; increment-credit items credit this amount. Optional for older orders. */
  cashLineTotalCents?: number;
  usesQuantityPriceBreak?: boolean;
  stripeProductId?: string;
  stripePriceId?: string;
};

export type ResolvedCart = {
  items: ResolvedCartItem[];
  /** Card / online subtotal charged by Stripe. */
  subtotalCents: number;
  /** Listed cash subtotal (what the same items cost paid in cash at the office). */
  cashSubtotalCents: number;
  requiresScheduling: boolean;
};

const sanitizeQuantity = (quantity: number) => {
  if (!Number.isFinite(quantity)) return Number.NaN;
  return quantity;
};

const validateQuantity = (catalogItem: CatalogItemConfig, quantity: number) => {
  if (!Number.isInteger(quantity)) {
    throw new Error(`Invalid quantity for ${catalogItem.slug}: quantity must be a whole number.`);
  }

  if (quantity < catalogItem.minQuantity || quantity > catalogItem.maxQuantity) {
    throw new Error(
      `Invalid quantity for ${catalogItem.slug}: must be between ${catalogItem.minQuantity} and ${catalogItem.maxQuantity}.`
    );
  }

  return quantity;
};

export const getCatalogRecords = async () => {
  await ensureMongoIndexes();
  const db = await getDb();
  const records = await db.collection<CatalogItemRecord>("catalog_items").find({}).toArray();
  return Object.fromEntries(records.map((record) => [record.slug, record])) as Record<string, CatalogItemRecord>;
};

export const upsertCatalogRecord = async (record: CatalogItemRecord) => {
  await ensureMongoIndexes();
  const db = await getDb();
  await db.collection<CatalogItemRecord>("catalog_items").updateOne(
    { slug: record.slug },
    {
      $set: {
        ...record,
        updatedAt: new Date(),
      },
      $setOnInsert: {
        syncedAt: new Date(),
      },
    },
    { upsert: true }
  );
};

export const resolveCart = async (rawItems: CartItemInput[]): Promise<ResolvedCart> => {
  const deduped = new Map<string, CartItemInput>();

  for (const item of rawItems || []) {
    const normalizedSlug = normalizeIntimacyProcedureSlug(item.slug);
    const quantity = sanitizeQuantity(item.quantity);
    if (!Number.isFinite(quantity)) {
      throw new Error(`Invalid quantity for ${normalizedSlug}: quantity must be a whole number.`);
    }

    const existing = deduped.get(normalizedSlug);
    if (existing) {
      existing.quantity += quantity;
    } else {
      deduped.set(normalizedSlug, {
        slug: normalizedSlug,
        kind: item.kind,
        quantity,
      });
    }
  }

  // Validate every item against the catalog before touching the database, so a stale cart (for example one
  // still holding "filler", removed 2026-11-03) fails fast with a message the cart page can show.
  const validated = Array.from(deduped.values()).map((item) => {
    const catalogItem = COMMERCE_CATALOG.find((entry) => entry.slug === item.slug);

    if (!catalogItem) {
      throw new Error(`"${item.slug}" is no longer available online. Remove it from your cart to continue.`);
    }
    if (catalogItem.kind !== item.kind) throw new Error(`Item kind mismatch for ${item.slug}.`);

    return { catalogItem, quantity: validateQuantity(catalogItem, item.quantity) };
  });

  const stripeRecords = await getCatalogRecords();
  const items: ResolvedCartItem[] = [];
  const legacyStripeRecordSlugs: Record<string, string> = {
    "oh-shot": "o-shot",
    "pe-shot": "p-shot",
  };

  for (const { catalogItem, quantity } of validated) {
    const pricing = resolveCartItemPricing(catalogItem, quantity);

    const legacySlug = legacyStripeRecordSlugs[catalogItem.slug];
    const stripeRecord = stripeRecords[catalogItem.slug] ?? (legacySlug ? stripeRecords[legacySlug] : undefined);

    items.push({
      ...catalogItem,
      quantity,
      unitLabel: catalogItem.quantityLabel,
      ...pricing,
      stripeProductId: stripeRecord?.stripeProductId,
      // Never reuse a synced Stripe price created for an older amount; checkout falls back to price_data.
      stripePriceId: resolveSyncedStripePriceId(catalogItem, stripeRecord),
    });
  }

  const subtotalCents = items.reduce((sum, item) => sum + item.lineTotalCents, 0);
  const cashSubtotalCents = items.reduce((sum, item) => sum + (item.cashLineTotalCents ?? item.lineTotalCents), 0);

  return {
    items,
    subtotalCents,
    cashSubtotalCents,
    requiresScheduling: items.some((item) => item.requiresScheduling),
  };
};
