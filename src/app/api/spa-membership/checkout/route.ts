import { NextRequest, NextResponse } from "next/server";
import type Stripe from "stripe";

import {
  SPA_MEMBERSHIP_METADATA_PRODUCT_LINE,
  calculateProcessingFeeCents,
  formatCurrency,
  membershipPeriodLabel,
  normalizeMembershipAmountCents,
} from "lib/spa-membership";
import { getStripe } from "lib/stripe";

const parsePeriod = (value: unknown) => (value === "yearly" ? "yearly" : "monthly");

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const period = parsePeriod(body.period);
    const creditCents = normalizeMembershipAmountCents(body.amountDollars);

    if (!creditCents) {
      return NextResponse.json({ error: "Choose a membership credit amount of at least $100." }, { status: 400 });
    }

    const stripe = getStripe();
    const interval = period === "yearly" ? "year" : "month";
    const periodLabel = membershipPeriodLabel(period);
    const processingFeeCents = calculateProcessingFeeCents(creditCents);
    const totalCents = creditCents + processingFeeCents;
    const creditLabel = formatCurrency(creditCents);

    const metadata = {
      product_line: SPA_MEMBERSHIP_METADATA_PRODUCT_LINE,
      membership_amount_cents: String(creditCents),
      treatment_credit_cents: String(creditCents),
      processing_fee_cents: String(processingFeeCents),
      checkout_total_cents: String(totalCents),
      billing_period: period,
      processing_fee_policy: "added_to_checkout",
      terms_version: "2026-06-20-stored-value-treatment-credit",
    };

    const lineItems: Stripe.Checkout.SessionCreateParams.LineItem[] = [
      {
        quantity: 1,
        price_data: {
          currency: "usd",
          unit_amount: creditCents,
          recurring: { interval },
          product_data: {
            name: `Williamsburg Med Spa Treatment Credit - ${creditLabel}/${periodLabel}`,
            description:
              "Stored-value Spa Membership treatment credit toward eligible Williamsburg Med Spa procedures at current listed prices, subject to change.",
            metadata,
          },
        },
      },
    ];

    if (processingFeeCents > 0) {
      lineItems.push({
        quantity: 1,
        price_data: {
          currency: "usd",
          unit_amount: processingFeeCents,
          recurring: { interval },
          product_data: {
            name: `Estimated card processing fee - ${creditLabel}/${periodLabel} Spa Membership`,
            description: "Added separately so the selected membership amount remains available as treatment credit.",
            metadata: { ...metadata, fee_component: "processing_fee" },
          },
        },
      });
    }

    const session = await stripe.checkout.sessions.create({
      mode: "subscription",
      customer_creation: "always",
      phone_number_collection: { enabled: true },
      line_items: lineItems,
      success_url: `${request.nextUrl.origin}/membership/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${request.nextUrl.origin}/membership?amount=${creditCents / 100}&period=${period}`,
      metadata,
      subscription_data: { metadata },
      allow_promotion_codes: false,
    });

    return NextResponse.json({
      url: session.url,
      sessionId: session.id,
      creditCents,
      processingFeeCents,
      totalCents,
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unable to create Spa Membership checkout.";
    const status = message.includes("STRIPE_PRIVATE_KEY") ? 503 : 400;

    return NextResponse.json({ error: message }, { status });
  }
}
