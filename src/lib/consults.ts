import { randomUUID } from "crypto";

import { upsertAccountByEmail } from "lib/accounts";
import { ensureMongoIndexes, getDb } from "lib/mongodb";

export type ConsultSubmissionInput = {
  name: string;
  email: string;
  phone: string;
  comments: string;
  interests: string[];
  referral: string;
  affiliateId?: string;
  affiliateCode?: string;
  affiliateName?: string;
};

export type ConsultRequestRecord = ConsultSubmissionInput & {
  consultRequestId: string;
  token: string;
  accountId: string;
  notificationStatus: "pending" | "sent" | "failed";
  notificationError?: string;
  notifiedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
};

export const createConsultRequest = async (input: ConsultSubmissionInput) => {
  const account = await upsertAccountByEmail({
    email: input.email,
    name: input.name,
    phone: input.phone,
    source: "consult_form",
  });

  if (!account) throw new Error("Unable to create account for consult request.");

  await ensureMongoIndexes();
  const db = await getDb();
  const record: ConsultRequestRecord = {
    ...input,
    consultRequestId: randomUUID(),
    token: randomUUID(),
    accountId: account.accountId,
    notificationStatus: "pending",
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  await db.collection<ConsultRequestRecord>("consult_requests").insertOne(record);
  return record;
};

export const updateConsultNotificationStatus = async ({
  consultRequestId,
  notificationStatus,
  notificationError,
}: {
  consultRequestId: string;
  notificationStatus: "sent" | "failed";
  notificationError?: string;
}) => {
  await ensureMongoIndexes();
  const db = await getDb();

  await db.collection<ConsultRequestRecord>("consult_requests").updateOne(
    { consultRequestId },
    {
      $set: {
        notificationStatus,
        notificationError,
        notifiedAt: new Date(),
        updatedAt: new Date(),
      },
    }
  );
};

export const getConsultRequestByToken = async (token: string) => {
  await ensureMongoIndexes();
  const db = await getDb();
  return db.collection<ConsultRequestRecord>("consult_requests").findOne({ token });
};
