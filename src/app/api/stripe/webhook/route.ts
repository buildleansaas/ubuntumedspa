import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";

import { syncOrderFromStripeSession } from "lib/orders";
import { getStripe } from "lib/stripe";

const allowInsecureLocalWebhooks =
  process.env.NODE_ENV !== "production" && process.env.ALLOW_INSECURE_LOCAL_WEBHOOKS === "true";

const buildStripeEvent = (payload: string, signature: string | null) => {
  if (!process.env.STRIPE_WEBHOOK_SECRET || !signature) {
    if (allowInsecureLocalWebhooks) {
      return JSON.parse(payload) as Stripe.Event;
    }

    throw new Error("STRIPE_WEBHOOK_SECRET and Stripe-Signature are required.");
  }

  return getStripe().webhooks.constructEvent(payload, signature, process.env.STRIPE_WEBHOOK_SECRET);
};

export async function POST(request: NextRequest) {
  const payload = await request.text();

  try {
    const event = buildStripeEvent(payload, request.headers.get("stripe-signature"));

    if (
      event.type === "checkout.session.completed" ||
      event.type === "checkout.session.expired" ||
      event.type === "checkout.session.async_payment_succeeded"
    ) {
      const session = event.data.object as Stripe.Checkout.Session;
      await syncOrderFromStripeSession(session.id);
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Unable to process Stripe webhook." },
      { status: 400 }
    );
  }
}
