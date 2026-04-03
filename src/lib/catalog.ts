import {
  COMMERCE_CATALOG,
  type CatalogItemConfig,
  type CatalogKind,
} from "config/commerce-catalog";
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
  unitAmountCents: number;
  lineTotalCents: number;
  stripeProductId?: string;
  stripePriceId?: string;
};

export type ResolvedCart = {
  items: ResolvedCartItem[];
  subtotalCents: number;
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

  const stripeRecords = await getCatalogRecords();
  const items: ResolvedCartItem[] = [];

  for (const item of deduped.values()) {
    const catalogItem = COMMERCE_CATALOG.find((entry) => entry.slug === item.slug);

    if (!catalogItem) throw new Error(`Unknown item: ${item.slug}`);
    if (catalogItem.kind !== item.kind) throw new Error(`Item kind mismatch for ${item.slug}.`);

    const quantity = validateQuantity(catalogItem, item.quantity);

    items.push({
      ...catalogItem,
      quantity,
      unitLabel: catalogItem.quantityLabel,
      unitAmountCents: catalogItem.unitAmountCents,
      lineTotalCents: quantity * catalogItem.unitAmountCents,
      stripeProductId: stripeRecords[item.slug]?.stripeProductId,
      stripePriceId: stripeRecords[item.slug]?.stripePriceId,
    });
  }

  const subtotalCents = items.reduce((sum, item) => sum + item.lineTotalCents, 0);

  return {
    items,
    subtotalCents,
    requiresScheduling: items.some((item) => item.requiresScheduling),
  };
};
