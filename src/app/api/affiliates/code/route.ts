import { NextRequest, NextResponse } from "next/server";
import * as yup from "yup";

import { buildAffiliateLink, buildAffiliateShareMessage } from "lib/affiliates";
import { toAffiliateSnapshot, updateAffiliateCodeByEmail } from "lib/affiliates.server";

const schema = yup.object({
  email: yup.string().email().required(),
  affiliateCode: yup.string().required(),
});

export async function PATCH(req: NextRequest) {
  try {
    const body = await req.json();
    const { email, affiliateCode } = await schema.validate(body, {
      abortEarly: false,
      stripUnknown: true,
    });

    const { affiliate, updated } = await updateAffiliateCodeByEmail({ email, affiliateCode });
    const snapshot = {
      ...toAffiliateSnapshot(affiliate),
      email: affiliate.email,
    };
    const referralUrl = buildAffiliateLink(`${req.nextUrl.origin}/`, affiliate.affiliateCode);

    return NextResponse.json({
      success: true,
      updated,
      affiliate: snapshot,
      referralUrl,
      shareMessage: buildAffiliateShareMessage(referralUrl),
    });
  } catch (error) {
    if (error instanceof yup.ValidationError) {
      return NextResponse.json(
        { success: false, error: error.errors[0] || "Invalid referral code update." },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { success: false, error: error instanceof Error ? error.message : "Unable to update referral code." },
      { status: 400 }
    );
  }
}
