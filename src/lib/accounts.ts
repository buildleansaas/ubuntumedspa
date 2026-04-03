import { randomUUID } from "crypto";

import { ensureMongoIndexes, getDb } from "lib/mongodb";

export const normalizeEmail = (email: string) => email.trim().toLowerCase();

export type AccountRecord = {
  accountId: string;
  email: string;
  normalizedEmail: string;
  name?: string;
  phone?: string;
  stripeCustomerId?: string;
  creditBalanceCents: number;
  sources: string[];
  createdAt: Date;
  updatedAt: Date;
};

type UpsertAccountInput = {
  email: string;
  name?: string;
  phone?: string;
  stripeCustomerId?: string;
  source: string;
};

export const upsertAccountByEmail = async ({ email, name, phone, stripeCustomerId, source }: UpsertAccountInput) => {
  await ensureMongoIndexes();
  const db = await getDb();
  const normalizedEmail = normalizeEmail(email);
  const now = new Date();

  await db.collection<AccountRecord>("accounts").updateOne(
    { normalizedEmail },
    {
      $setOnInsert: {
        accountId: randomUUID(),
        email,
        normalizedEmail,
        creditBalanceCents: 0,
        createdAt: now,
      },
      $set: {
        updatedAt: now,
        ...(name ? { name } : {}),
        ...(phone ? { phone } : {}),
        ...(stripeCustomerId ? { stripeCustomerId } : {}),
      },
      $addToSet: { sources: source },
    },
    { upsert: true }
  );

  return db.collection<AccountRecord>("accounts").findOne({ normalizedEmail });
};

export const getAccountById = async (accountId: string) => {
  await ensureMongoIndexes();
  const db = await getDb();
  return db.collection<AccountRecord>("accounts").findOne({ accountId });
};

export const addAccountCredit = async (accountId: string, amountCents: number) => {
  await ensureMongoIndexes();
  const db = await getDb();
  await db.collection<AccountRecord>("accounts").updateOne(
    { accountId },
    {
      $inc: { creditBalanceCents: amountCents },
      $set: { updatedAt: new Date() },
    }
  );
};
