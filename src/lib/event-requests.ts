import { randomUUID } from "crypto";

import { upsertAccountByEmail } from "lib/accounts";
import type { EventFieldValue } from "lib/events";
import { ensureMongoIndexes, getDb } from "lib/mongodb";

const EVENT_REQUESTS_COLLECTION = "event_requests";

export type EventRequestInput = {
  eventSlug: string;
  name: string;
  email: string;
  phone: string;
  responses: Record<string, EventFieldValue>;
};

export type EventRequestRecord = EventRequestInput & {
  eventRequestId: string;
  token: string;
  accountId: string;
  notificationStatus: "pending" | "sent" | "failed";
  notificationError?: string;
  notifiedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
};

export const createEventRequest = async (input: EventRequestInput) => {
  const account = await upsertAccountByEmail({
    email: input.email,
    name: input.name,
    phone: input.phone,
    source: `event_form:${input.eventSlug}`,
  });

  if (!account) throw new Error("Unable to create account for event request.");

  await ensureMongoIndexes();
  const db = await getDb();
  const record: EventRequestRecord = {
    ...input,
    eventRequestId: randomUUID(),
    token: randomUUID(),
    accountId: account.accountId,
    notificationStatus: "pending",
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  await db.collection<EventRequestRecord>(EVENT_REQUESTS_COLLECTION).insertOne(record);
  return record;
};

export const updateEventRequestNotificationStatus = async ({
  eventRequestId,
  notificationStatus,
  notificationError,
}: {
  eventRequestId: string;
  notificationStatus: "sent" | "failed";
  notificationError?: string;
}) => {
  await ensureMongoIndexes();
  const db = await getDb();

  await db.collection<EventRequestRecord>(EVENT_REQUESTS_COLLECTION).updateOne(
    { eventRequestId },
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

export const getEventRequestByToken = async (token: string) => {
  await ensureMongoIndexes();
  const db = await getDb();
  return db.collection<EventRequestRecord>(EVENT_REQUESTS_COLLECTION).findOne({ token });
};
