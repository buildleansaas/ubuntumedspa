import { NextRequest, NextResponse } from "next/server";
import * as yup from "yup";

import { AFFILIATE_REFERRAL_COOKIE, parseAffiliateCodeCookie } from "lib/affiliates";
import { getAffiliateByCode } from "lib/affiliates.server";
import { resolveConsultSelections } from "lib/consult-concerns";
import { getMailConfig, sendMail } from "lib/mailer";
import { createConsultRequest, updateConsultNotificationStatus } from "lib/consults";

const schema = yup.object({
  name: yup.string().required(),
  email: yup.string().email().required(),
  phone: yup.string().required(),
  concerns: yup.array().of(yup.string().required()).max(20).default([]),
  interests: yup.array().of(yup.string().required()).max(20).default([]),
  referral: yup.string().required(),
  comments: yup.string().required(),
  affiliateId: yup.string().optional(),
  affiliateCode: yup.string().optional(),
  affiliateName: yup.string().optional(),
  utmSource: yup.string().max(120).optional(),
  utmMedium: yup.string().max(120).optional(),
  utmCampaign: yup.string().max(120).optional(),
});

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      name,
      email,
      phone,
      concerns,
      interests,
      referral,
      comments,
      affiliateId,
      affiliateCode,
      affiliateName,
      utmSource,
      utmMedium,
      utmCampaign,
    } = await schema.validate(body, {
      abortEarly: false,
      stripUnknown: true,
    });
    const selections = resolveConsultSelections({ concerns, interests });
    if ("error" in selections) {
      return NextResponse.json({ success: false, error: selections.error }, { status: 400 });
    }
    const { concerns: normalizedConcerns, interests: normalizedInterests } = selections;
    const affiliateCodeFromCookie = parseAffiliateCodeCookie(req.cookies.get(AFFILIATE_REFERRAL_COOKIE)?.value);
    const resolvedAffiliate =
      affiliateCode || affiliateCodeFromCookie ? await getAffiliateByCode(affiliateCode || affiliateCodeFromCookie || "") : null;
    const finalAffiliateId = resolvedAffiliate?.affiliateId || affiliateId;
    const finalAffiliateCode = resolvedAffiliate?.affiliateCode || affiliateCode;
    const finalAffiliateName = resolvedAffiliate?.name || affiliateName;

    const consultRequest = await createConsultRequest({
      name,
      email,
      phone,
      concerns: normalizedConcerns,
      interests: normalizedInterests,
      referral,
      comments,
      affiliateId: finalAffiliateId,
      affiliateCode: finalAffiliateCode,
      affiliateName: finalAffiliateName,
      utmSource,
      utmMedium,
      utmCampaign,
    });

    let notificationStatus: "sent" | "failed" = "sent";

    try {
      await sendMail({
        to: getMailConfig().leadsTo,
        replyTo: email,
        subject: `[MED SPA LEAD] ${name}, ${(normalizedInterests.length ? normalizedInterests : normalizedConcerns).join(", ")}`,
        text: `
          Name: ${name}
          Email: ${email}
          Phone: ${phone}
          wants help with: ${normalizedConcerns.join(", ") || "Not given"}
          interests: ${normalizedInterests.join(", ") || "Not sure yet"}
          comments: ${comments}
          referral: ${referral}
          affiliateId: ${finalAffiliateId || "None"}
          affiliateCode: ${finalAffiliateCode || "None"}
          affiliateName: ${finalAffiliateName || "None"}
          landing campaign: ${utmCampaign || "None"}
          landing source: ${utmSource || "None"}
          landing medium: ${utmMedium || "None"}
        `,
      });

      await updateConsultNotificationStatus({
        consultRequestId: consultRequest.consultRequestId,
        notificationStatus: "sent",
      });
    } catch (emailError) {
      notificationStatus = "failed";
      await updateConsultNotificationStatus({
        consultRequestId: consultRequest.consultRequestId,
        notificationStatus: "failed",
        notificationError: emailError instanceof Error ? emailError.message : "Unknown email error",
      });
    }

    return NextResponse.json({
      success: true,
      scheduleUrl: `${req.nextUrl.origin}/consult/schedule/${consultRequest.token}`,
      accountId: consultRequest.accountId,
      notificationStatus,
    });
  } catch (error) {
    if (error instanceof yup.ValidationError) {
      return NextResponse.json({ success: false, error: error.errors[0] || "Invalid consult submission." }, { status: 400 });
    }

    return NextResponse.json({ success: false, error: "Unable to submit consult request." }, { status: 500 });
  }
}
