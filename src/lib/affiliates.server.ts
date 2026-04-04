import "server-only";

import { randomUUID } from "crypto";

import { upsertAccountByEmail } from "lib/accounts";
import { normalizeAffiliateCode, type AffiliateRecord, type AffiliateSnapshot } from "lib/affiliates";
import { ensureMongoIndexes, getDb } from "lib/mongodb";

const slugifyName = (value: string) =>
  value
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/-{2,}/g, "-")
    .replace(/(^-|-$)/g, "")
    .slice(0, 18) || "friend";

const createAffiliateCodeCandidate = (name: string) => {
  const base = slugifyName(name);
  const suffix = randomUUID().replace(/-/g, "").slice(0, 4);
  return normalizeAffiliateCode(`${base}-${suffix}`);
};

const createUniqueAffiliateCode = async (name: string) => {
  await ensureMongoIndexes();
  const db = await getDb();

  for (let attempt = 0; attempt < 12; attempt += 1) {
    const candidate = createAffiliateCodeCandidate(name);
    const existing = await db.collection<AffiliateRecord>("affiliates").findOne({ affiliateCode: candidate });
    if (!existing) return candidate;
  }

  throw new Error("Unable to generate a unique affiliate code.");
};

export const toAffiliateSnapshot = (affiliate: AffiliateRecord): AffiliateSnapshot => ({
  affiliateId: affiliate.affiliateId,
  affiliateCode: affiliate.affiliateCode,
  affiliateName: affiliate.name,
});

export const registerAffiliate = async ({ name, email }: { name: string; email: string }) => {
  const account = await upsertAccountByEmail({
    email,
    name,
    source: "affiliate_signup",
  });

  if (!account) throw new Error("Unable to create affiliate account.");

  await ensureMongoIndexes();
  const db = await getDb();
  const now = new Date();
  const existing = await db.collection<AffiliateRecord>("affiliates").findOne({ accountId: account.accountId });

  if (existing) {
    if (existing.status === "disabled") {
      throw new Error("This affiliate link is currently unavailable.");
    }

    if (existing.name !== name || existing.email !== email) {
      await db.collection<AffiliateRecord>("affiliates").updateOne(
        { affiliateId: existing.affiliateId },
        {
          $set: {
            name,
            email,
            updatedAt: now,
          },
        }
      );
    }

    const refreshed = await db.collection<AffiliateRecord>("affiliates").findOne({ affiliateId: existing.affiliateId });
    if (!refreshed) throw new Error("Unable to load affiliate profile.");
    return { affiliate: refreshed, created: false };
  }

  const affiliate: AffiliateRecord = {
    affiliateId: randomUUID(),
    accountId: account.accountId,
    name,
    email,
    affiliateCode: await createUniqueAffiliateCode(name),
    status: "active",
    createdAt: now,
    updatedAt: now,
  };

  await db.collection<AffiliateRecord>("affiliates").insertOne(affiliate);
  return { affiliate, created: true };
};

export const getAffiliateByCode = async (code: string) => {
  const normalizedCode = normalizeAffiliateCode(code);
  if (!normalizedCode) return null;

  await ensureMongoIndexes();
  const db = await getDb();
  return db.collection<AffiliateRecord>("affiliates").findOne({
    affiliateCode: normalizedCode,
    status: "active",
  });
};
