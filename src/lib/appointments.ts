import { randomUUID } from "crypto";

import { upsertAccountByEmail } from "lib/accounts";
import { ensureMongoIndexes, getDb } from "lib/mongodb";

export type AppointmentRecord = {
  appointmentId: string;
  bookingUid: string;
  accountId?: string;
  orderId?: string;
  provider: "cal.com";
  status: "scheduled" | "cancelled" | "rescheduled";
  startsAt?: Date;
  endsAt?: Date;
  attendeeEmail?: string;
  attendeeName?: string;
  metadata?: Record<string, string>;
  rawPayload: unknown;
  updatedAt: Date;
  createdAt: Date;
};

type CalWebhookPayload = {
  triggerEvent: string;
  payload?: {
    uid?: string;
    startTime?: string;
    endTime?: string;
    metadata?: Record<string, string>;
    responses?: Record<string, { value?: string }>;
  };
};

const extractResponseValue = (payload: CalWebhookPayload["payload"], field: string) => payload?.responses?.[field]?.value;

export const upsertAppointmentFromCalWebhook = async (body: CalWebhookPayload) => {
  await ensureMongoIndexes();
  const db = await getDb();
  const payload = body.payload || {};
  const bookingUid = payload.uid;

  if (!bookingUid) throw new Error("Cal webhook payload is missing booking uid.");

  const email = extractResponseValue(payload, "email");
  const name = extractResponseValue(payload, "name");
  const metadata = payload.metadata || {};
  const orderId = metadata.orderId;
  const accountIdFromMetadata = metadata.accountId;

  let accountId: string | undefined = accountIdFromMetadata;
  if (!accountId && email) {
    const account = await upsertAccountByEmail({
      email,
      name,
      source: "cal_webhook",
    });
    accountId = account?.accountId;
  }

  const status =
    body.triggerEvent === "BOOKING_CANCELLED"
      ? "cancelled"
      : body.triggerEvent === "BOOKING_RESCHEDULED"
      ? "rescheduled"
      : "scheduled";

  const existing = await db.collection<AppointmentRecord>("appointments").findOne({ bookingUid });
  const appointmentId = existing?.appointmentId || randomUUID();
  const now = new Date();

  await db.collection<AppointmentRecord>("appointments").updateOne(
    { bookingUid },
    {
      $set: {
        appointmentId,
        bookingUid,
        accountId,
        orderId,
        provider: "cal.com",
        status,
        startsAt: payload.startTime ? new Date(payload.startTime) : undefined,
        endsAt: payload.endTime ? new Date(payload.endTime) : undefined,
        attendeeEmail: email,
        attendeeName: name,
        metadata,
        rawPayload: body,
        updatedAt: now,
      },
      $setOnInsert: {
        createdAt: now,
      },
    },
    { upsert: true }
  );

  if (orderId) {
    await db.collection("orders").updateOne(
      { orderId },
      {
        $set: {
          schedulingStatus: status === "cancelled" ? "pending" : "scheduled",
          updatedAt: now,
        },
      }
    );
  }
};
