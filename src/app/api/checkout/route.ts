import { NextRequest, NextResponse } from "next/server";

import { createCheckoutSession } from "lib/checkout";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { session, order } = await createCheckoutSession({
      items: body.items || [],
      origin: request.nextUrl.origin,
    });

    return NextResponse.json({
      url: session.url,
      orderId: order.orderId,
      publicToken: order.publicToken,
    });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Unable to create checkout session." },
      { status: 400 }
    );
  }
}
