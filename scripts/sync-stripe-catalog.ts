import "dotenv/config";

import Stripe from "stripe";

import { COMMERCE_CATALOG, type CatalogItemConfig } from "../src/config/commerce-catalog";
import { type CatalogItemRecord } from "../src/lib/catalog";
import { ensureMongoIndexes, getDb } from "../src/lib/mongodb";
import { getStripe } from "../src/lib/stripe";

const isDryRun = process.argv.includes("--dry-run");
const catalogBaseUrl = "https://www.williamsburgmedspa.com";

type SyncStats = {
  productsCreated: number;
  productsUpdated: number;
  productsArchived: number;
  pricesCreated: number;
  pricesReactivated: number;
  pricesArchived: number;
  mongoUpserts: number;
  mongoArchives: number;
};

const stats: SyncStats = {
  productsCreated: 0,
  productsUpdated: 0,
  productsArchived: 0,
  pricesCreated: 0,
  pricesReactivated: 0,
  pricesArchived: 0,
  mongoUpserts: 0,
  mongoArchives: 0,
};

const now = () => new Date();

const logAction = (message: string) => {
  const prefix = isDryRun ? "[dry-run]" : "[sync]";
  console.log(`${prefix} ${message}`);
};

const isStripeMissingResourceError = (error: unknown) =>
  error instanceof Stripe.errors.StripeInvalidRequestError &&
  error.code === "resource_missing";

const getPriceProductId = (price: Stripe.Price) =>
  typeof price.product === "string" ? price.product : price.product?.id;

const safeRetrieveProduct = async (stripe: Stripe, productId: string): Promise<Stripe.Product | null> => {
  try {
    const product = await stripe.products.retrieve(productId);
    if ("deleted" in product && product.deleted) return null;
    return product;
  } catch (error) {
    if (isStripeMissingResourceError(error)) return null;
    throw error;
  }
};

const safeRetrievePrice = async (stripe: Stripe, priceId: string): Promise<Stripe.Price | null> => {
  try {
    return await stripe.prices.retrieve(priceId);
  } catch (error) {
    if (isStripeMissingResourceError(error)) return null;
    throw error;
  }
};

const buildProductPayload = (item: CatalogItemConfig): Stripe.ProductCreateParams | Stripe.ProductUpdateParams => ({
  active: true,
  name: item.name,
  description: item.shortDescription,
  images: item.imagePath ? [`${catalogBaseUrl}${item.imagePath}`] : undefined,
  metadata: {
    slug: item.slug,
    kind: item.kind,
    pricingMode: item.pricingMode,
    fulfillment: item.fulfillment,
    internalKey: item.stripeProductKey,
  },
});

const archivePrice = async (stripe: Stripe, priceId: string, reason: string) => {
  const price = await safeRetrievePrice(stripe, priceId);
  if (!price || !price.active) return;

  logAction(`${reason}: archive price ${priceId}`);
  stats.pricesArchived += 1;

  if (!isDryRun) {
    await stripe.prices.update(priceId, { active: false });
  }
};

const archiveAllProductPrices = async (stripe: Stripe, productId: string, reason: string) => {
  const prices = await stripe.prices.list({ product: productId, active: true, limit: 100 });

  for (const price of prices.data) {
    await archivePrice(stripe, price.id, reason);
  }
};

const archiveProduct = async (stripe: Stripe, productId: string, reason: string) => {
  const product = await safeRetrieveProduct(stripe, productId);
  if (!product || !product.active) return;

  logAction(`${reason}: archive product ${productId}`);
  stats.productsArchived += 1;

  if (!isDryRun) {
    await stripe.products.update(productId, { active: false });
  }
};

const reactivateExistingPriceIfReusable = async ({
  stripe,
  price,
  item,
  productId,
}: {
  stripe: Stripe;
  price: Stripe.Price;
  item: CatalogItemConfig;
  productId: string;
}) => {
  const matchesExpectedPrice =
    price.unit_amount === item.unitAmountCents &&
    price.currency === item.currency &&
    price.lookup_key === item.stripePriceLookupKey &&
    getPriceProductId(price) === productId;

  if (!matchesExpectedPrice) return false;

  if (!price.active) {
    logAction(`reactivate price ${price.id} for ${item.slug}`);
    stats.pricesReactivated += 1;

    if (!isDryRun) {
      await stripe.prices.update(price.id, { active: true });
    }
  }

  return true;
};

const syncCatalogItem = async ({
  stripe,
  existingRecord,
  item,
}: {
  stripe: Stripe;
  existingRecord?: CatalogItemRecord;
  item: CatalogItemConfig;
}) => {
  let stripeProductId = existingRecord?.stripeProductId;
  let stripePriceId = existingRecord?.stripePriceId;

  let existingPrice = stripePriceId ? await safeRetrievePrice(stripe, stripePriceId) : null;

  if (!stripeProductId && existingPrice) {
    stripeProductId = getPriceProductId(existingPrice);
  }

  if (!stripePriceId && item.stripePriceLookupKey) {
    const prices = await stripe.prices.list({
      lookup_keys: [item.stripePriceLookupKey],
      limit: 1,
    });

    const matchedPrice = prices.data[0] ?? null;
    if (matchedPrice) {
      existingPrice = matchedPrice;
      stripePriceId = matchedPrice.id;
      stripeProductId = stripeProductId || getPriceProductId(matchedPrice);
    }
  }

  if (!stripeProductId) {
    logAction(`create product for ${item.slug}`);
    stats.productsCreated += 1;

    if (!isDryRun) {
      const product = await stripe.products.create(buildProductPayload(item) as Stripe.ProductCreateParams);
      stripeProductId = product.id;
    } else {
      stripeProductId = `dry-run-${item.slug}`;
    }
  } else {
    logAction(`update product ${stripeProductId} for ${item.slug}`);
    stats.productsUpdated += 1;

    if (!isDryRun) {
      await stripe.products.update(stripeProductId, buildProductPayload(item) as Stripe.ProductUpdateParams);
    }
  }

  if (stripeProductId) {
    if (!existingPrice && stripePriceId) {
      existingPrice = await safeRetrievePrice(stripe, stripePriceId);
    }

    const reusablePrice = existingPrice
      ? await reactivateExistingPriceIfReusable({
          stripe,
          price: existingPrice,
          item,
          productId: stripeProductId,
        })
      : false;

    if (reusablePrice) {
      stripePriceId = existingPrice?.id;
    } else {
      if (stripePriceId) {
        await archivePrice(stripe, stripePriceId, `${item.slug}`);
      }

      logAction(`create price for ${item.slug} (${item.displayPrice})`);
      stats.pricesCreated += 1;

      if (!isDryRun) {
        const price = await stripe.prices.create({
          product: stripeProductId,
          currency: item.currency,
          unit_amount: item.unitAmountCents,
          lookup_key: item.stripePriceLookupKey,
          transfer_lookup_key: true,
          metadata: {
            slug: item.slug,
            kind: item.kind,
            pricingMode: item.pricingMode,
            internalKey: item.stripeProductKey,
          },
        });

        stripePriceId = price.id;
      }
    }
  }

  logAction(`upsert Mongo catalog record for ${item.slug}`);
  stats.mongoUpserts += 1;

  if (!isDryRun) {
    const db = await getDb();
    await db.collection<CatalogItemRecord>("catalog_items").updateOne(
      { slug: item.slug },
      {
        $set: {
          active: true,
          slug: item.slug,
          kind: item.kind,
          name: item.name,
          pricingMode: item.pricingMode,
          unitAmountCents: item.unitAmountCents,
          currency: item.currency,
          displayPrice: item.displayPrice,
          quantityLabel: item.quantityLabel,
          minQuantity: item.minQuantity,
          maxQuantity: item.maxQuantity,
          requiresScheduling: item.requiresScheduling,
          fulfillment: item.fulfillment,
          stripeProductKey: item.stripeProductKey,
          stripePriceLookupKey: item.stripePriceLookupKey,
          stripeProductId,
          stripePriceId,
          syncedAt: now(),
          updatedAt: now(),
        },
      },
      { upsert: true }
    );
  }
};

const archiveStaleCatalogRecords = async ({
  stripe,
  records,
  activeSlugs,
}: {
  stripe: Stripe;
  records: CatalogItemRecord[];
  activeSlugs: Set<string>;
}) => {
  const staleRecords = records.filter((record) => !activeSlugs.has(record.slug) && record.active !== false);

  for (const record of staleRecords) {
    if (record.stripePriceId) {
      await archivePrice(stripe, record.stripePriceId, `${record.slug} removed from config`);
    } else if (record.stripeProductId) {
      await archiveAllProductPrices(stripe, record.stripeProductId, `${record.slug} removed from config`);
    }

    if (record.stripeProductId) {
      await archiveProduct(stripe, record.stripeProductId, `${record.slug} removed from config`);
    }

    logAction(`archive Mongo catalog record for ${record.slug}`);
    stats.mongoArchives += 1;

    if (!isDryRun) {
      const db = await getDb();
      await db.collection<CatalogItemRecord>("catalog_items").updateOne(
        { slug: record.slug },
        {
          $set: {
            active: false,
            syncedAt: now(),
            updatedAt: now(),
          },
        }
      );
    }
  }
};

const sync = async () => {
  const stripe = getStripe();
  await ensureMongoIndexes();
  const db = await getDb();
  const catalogCollection = db.collection<CatalogItemRecord>("catalog_items");
  const existingRecords = await catalogCollection.find({}).toArray();
  const existingRecordsBySlug = new Map(existingRecords.map((record) => [record.slug, record]));
  const activeSlugs = new Set(COMMERCE_CATALOG.map((item) => item.slug));

  for (const item of COMMERCE_CATALOG) {
    await syncCatalogItem({
      stripe,
      existingRecord: existingRecordsBySlug.get(item.slug),
      item,
    });
  }

  await archiveStaleCatalogRecords({
    stripe,
    records: existingRecords,
    activeSlugs,
  });
};

sync()
  .then(() => {
    console.log(
      [
        `productsCreated=${stats.productsCreated}`,
        `productsUpdated=${stats.productsUpdated}`,
        `productsArchived=${stats.productsArchived}`,
        `pricesCreated=${stats.pricesCreated}`,
        `pricesReactivated=${stats.pricesReactivated}`,
        `pricesArchived=${stats.pricesArchived}`,
        `mongoUpserts=${stats.mongoUpserts}`,
        `mongoArchives=${stats.mongoArchives}`,
      ].join(" ")
    );
    console.log(isDryRun ? "Stripe catalog dry-run complete." : "Stripe catalog sync complete.");
    process.exit(0);
  })
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
