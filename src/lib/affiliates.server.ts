import "server-only";

import { randomUUID } from "crypto";

import { normalizeEmail, type AccountRecord, upsertAccountByEmail } from "lib/accounts";
import {
  AFFILIATE_CODE_MAX_LENGTH,
  AFFILIATE_CODE_MIN_LENGTH,
  isAffiliateCodeLengthValid,
  normalizeAffiliateCode,
  type AffiliateRecord,
  type AffiliateSnapshot,
} from "lib/affiliates";
import { ensureMongoIndexes, getDb } from "lib/mongodb";

export type AffiliateCodeAliasRecord = {
  aliasCode: string;
  affiliateId: string;
  createdAt: Date;
  updatedAt: Date;
};

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

const getAffiliateByAccountId = async (accountId: string) => {
  await ensureMongoIndexes();
  const db = await getDb();
  return db.collection<AffiliateRecord>("affiliates").findOne({ accountId });
};

const getAffiliateCodeOwner = async (code: string) => {
  const normalizedCode = normalizeAffiliateCode(code);
  if (!normalizedCode) return null;

  await ensureMongoIndexes();
  const db = await getDb();

  const affiliate = await db.collection<AffiliateRecord>("affiliates").findOne({ affiliateCode: normalizedCode });
  if (affiliate) {
    return { affiliate, source: "primary" as const };
  }

  const alias = await db.collection<AffiliateCodeAliasRecord>("affiliate_code_aliases").findOne({ aliasCode: normalizedCode });
  if (!alias) return null;

  const aliasAffiliate = await db.collection<AffiliateRecord>("affiliates").findOne({ affiliateId: alias.affiliateId });
  if (!aliasAffiliate) return null;

  return { affiliate: aliasAffiliate, source: "alias" as const };
};

export const toAffiliateSnapshot = (affiliate: AffiliateRecord): AffiliateSnapshot => ({
  affiliateId: affiliate.affiliateId,
  affiliateCode: affiliate.affiliateCode,
  affiliateName: affiliate.name,
});

export const registerAffiliate = async ({ name, email }: { name: string; email: string }) => {
  await ensureMongoIndexes();
  const db = await getDb();
  const normalizedEmail = normalizeEmail(email);
  const existingAccount = await db.collection<AccountRecord>("accounts").findOne({ normalizedEmail });

  if (existingAccount) {
    const existingAffiliate = await getAffiliateByAccountId(existingAccount.accountId);
    if (existingAffiliate) {
      if (existingAffiliate.status === "disabled") {
        throw new Error("This affiliate link is currently unavailable.");
      }

      return { affiliate: existingAffiliate, created: false, recovered: true };
    }
  }

  const account = await upsertAccountByEmail({
    email,
    name,
    source: "affiliate_signup",
  });

  if (!account) throw new Error("Unable to create affiliate account.");

  const now = new Date();

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
  return { affiliate, created: true, recovered: false };
};

export const updateAffiliateCodeByEmail = async ({
  email,
  affiliateCode,
}: {
  email: string;
  affiliateCode: string;
}) => {
  const normalizedEmail = normalizeEmail(email);
  const requestedCode = normalizeAffiliateCode(affiliateCode);

  if (!requestedCode) {
    throw new Error("Referral code is required.");
  }

  if (!isAffiliateCodeLengthValid(requestedCode)) {
    throw new Error(
      `Referral code must be between ${AFFILIATE_CODE_MIN_LENGTH} and ${AFFILIATE_CODE_MAX_LENGTH} characters.`
    );
  }

  await ensureMongoIndexes();
  const db = await getDb();
  const account = await db.collection<AccountRecord>("accounts").findOne({ normalizedEmail });
  if (!account) throw new Error("Affiliate not found.");

  const affiliate = await db.collection<AffiliateRecord>("affiliates").findOne({ accountId: account.accountId });
  if (!affiliate) throw new Error("Affiliate not found.");
  if (affiliate.status === "disabled") throw new Error("This affiliate link is currently unavailable.");

  if (affiliate.affiliateCode === requestedCode) {
    return { affiliate, updated: false };
  }

  const existingOwner = await getAffiliateCodeOwner(requestedCode);
  if (existingOwner && existingOwner.affiliate.affiliateId !== affiliate.affiliateId) {
    throw new Error("That referral code is already taken.");
  }

  const now = new Date();

  await db.collection<AffiliateCodeAliasRecord>("affiliate_code_aliases").updateOne(
    { aliasCode: affiliate.affiliateCode },
    {
      $set: {
        affiliateId: affiliate.affiliateId,
        updatedAt: now,
      },
      $setOnInsert: {
        createdAt: now,
      },
    },
    { upsert: true }
  );

  await db.collection<AffiliateRecord>("affiliates").updateOne(
    { affiliateId: affiliate.affiliateId },
    {
      $set: {
        affiliateCode: requestedCode,
        updatedAt: now,
      },
    }
  );

  await db.collection<AffiliateCodeAliasRecord>("affiliate_code_aliases").deleteOne({
    aliasCode: requestedCode,
    affiliateId: affiliate.affiliateId,
  });

  const updatedAffiliate = await db.collection<AffiliateRecord>("affiliates").findOne({ affiliateId: affiliate.affiliateId });
  if (!updatedAffiliate) throw new Error("Unable to load affiliate profile.");

  return { affiliate: updatedAffiliate, updated: true };
};

export const getAffiliateByCode = async (code: string) => {
  const normalizedCode = normalizeAffiliateCode(code);
  if (!normalizedCode) return null;

  await ensureMongoIndexes();
  const db = await getDb();
  const affiliate = await db.collection<AffiliateRecord>("affiliates").findOne({
    affiliateCode: normalizedCode,
    status: "active",
  });
  if (affiliate) return affiliate;

  const alias = await db.collection<AffiliateCodeAliasRecord>("affiliate_code_aliases").findOne({
    aliasCode: normalizedCode,
  });
  if (!alias) return null;

  return db.collection<AffiliateRecord>("affiliates").findOne({
    affiliateId: alias.affiliateId,
    status: "active",
  });
};
