import { NextRequest, NextResponse } from "next/server";
import * as yup from "yup";

import { buildAffiliateLink, buildAffiliateShareMessage } from "lib/affiliates";
import { registerAffiliate, toAffiliateSnapshot } from "lib/affiliates.server";

const schema = yup.object({
  name: yup.string().required(),
  email: yup.string().email().required(),
});

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { name, email } = await schema.validate(body, {
      abortEarly: false,
      stripUnknown: true,
    });

    const { affiliate, created } = await registerAffiliate({ name, email });
    const snapshot = {
      ...toAffiliateSnapshot(affiliate),
      email: affiliate.email,
    };
    const referralUrl = buildAffiliateLink(`${req.nextUrl.origin}/`, affiliate.affiliateCode);

    return NextResponse.json({
      success: true,
      created,
      affiliate: snapshot,
      referralUrl,
      shareMessage: buildAffiliateShareMessage(referralUrl),
    });
  } catch (error) {
    if (error instanceof yup.ValidationError) {
      return NextResponse.json({ success: false, error: error.errors[0] || "Invalid affiliate registration." }, { status: 400 });
    }

    return NextResponse.json({ success: false, error: error instanceof Error ? error.message : "Unable to create affiliate link." }, { status: 400 });
  }
}
