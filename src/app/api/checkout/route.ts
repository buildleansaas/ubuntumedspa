import { NextRequest, NextResponse } from "next/server";

import { AFFILIATE_REFERRAL_COOKIE, parseAffiliateCodeCookie } from "lib/affiliates";
import { getAffiliateByCode } from "lib/affiliates.server";
import { createCheckoutSession } from "lib/checkout";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const affiliateCode = parseAffiliateCodeCookie(request.cookies.get(AFFILIATE_REFERRAL_COOKIE)?.value);
    const affiliate = affiliateCode ? await getAffiliateByCode(affiliateCode) : null;
    const { session, order } = await createCheckoutSession({
      items: body.items || [],
      origin: request.nextUrl.origin,
      affiliate: affiliate
        ? {
            affiliateId: affiliate.affiliateId,
            affiliateCode: affiliate.affiliateCode,
            affiliateName: affiliate.name,
          }
        : undefined,
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
