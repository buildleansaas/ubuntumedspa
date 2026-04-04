import { NextRequest, NextResponse } from "next/server";

import { getAffiliateByCode, toAffiliateSnapshot } from "lib/affiliates.server";

export async function GET(req: NextRequest) {
  const code = req.nextUrl.searchParams.get("code");
  if (!code) {
    return NextResponse.json({ error: "Affiliate code is required." }, { status: 400 });
  }

  const affiliate = await getAffiliateByCode(code);
  if (!affiliate) {
    return NextResponse.json({ error: "Affiliate not found." }, { status: 404 });
  }

  return NextResponse.json({
    affiliate: toAffiliateSnapshot(affiliate),
  });
}
