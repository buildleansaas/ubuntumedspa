import { NextRequest, NextResponse } from "next/server";

import { resolveCart } from "lib/catalog";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const cart = await resolveCart(body.items || []);
    return NextResponse.json(cart);
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Unable to resolve cart." },
      { status: 400 }
    );
  }
}
