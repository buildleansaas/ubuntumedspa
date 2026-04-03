import { createHmac, timingSafeEqual } from "crypto";

export const getCalLinks = () => ({
  consult: process.env.NEXT_PUBLIC_CAL_COM_CONSULT_LINK || "",
  paidProcedure: process.env.NEXT_PUBLIC_CAL_COM_PROCEDURE_LINK || "",
});

const allowInsecureLocalWebhooks =
  process.env.NODE_ENV !== "production" && process.env.ALLOW_INSECURE_LOCAL_WEBHOOKS === "true";

export const verifyCalWebhookSignature = (payload: string, signature: string | null) => {
  const secret = process.env.CAL_WEBHOOK_SECRET;
  if (!secret || !signature) {
    return allowInsecureLocalWebhooks;
  }

  const expected = createHmac("sha256", secret).update(payload).digest("hex");
  const actual = signature.replace(/^sha256=/, "");

  try {
    return timingSafeEqual(Buffer.from(expected), Buffer.from(actual));
  } catch {
    return false;
  }
};

export const requireCalWebhookConfiguration = () => {
  if (!process.env.CAL_WEBHOOK_SECRET && !allowInsecureLocalWebhooks) {
    throw new Error("CAL_WEBHOOK_SECRET is required for Cal.com webhook verification.");
  }
};
