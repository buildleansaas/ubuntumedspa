import { NextRequest, NextResponse } from "next/server";

import { upsertAppointmentFromCalWebhook } from "lib/appointments";
import { requireCalWebhookConfiguration, verifyCalWebhookSignature } from "lib/cal";

export async function POST(request: NextRequest) {
  const rawBody = await request.text();

  try {
    requireCalWebhookConfiguration();
    const signature = request.headers.get("x-cal-signature-256");

    if (!verifyCalWebhookSignature(rawBody, signature)) {
      return NextResponse.json({ error: "Invalid Cal.com webhook signature." }, { status: 401 });
    }

    const body = JSON.parse(rawBody);
    await upsertAppointmentFromCalWebhook(body);

    return NextResponse.json({ received: true });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Unable to process Cal.com webhook." },
      { status: 400 }
    );
  }
}
