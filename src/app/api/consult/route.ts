import { NextRequest, NextResponse } from "next/server";
import nodemailer from "nodemailer";
import * as yup from "yup";

import { AFFILIATE_REFERRAL_COOKIE, parseAffiliateCodeCookie } from "lib/affiliates";
import { getAffiliateByCode } from "lib/affiliates.server";
import { normalizeIntimacyProcedureNames } from "lib/intimacy-aliases";
import { createConsultRequest, updateConsultNotificationStatus } from "lib/consults";

const schema = yup.object({
  name: yup.string().required(),
  email: yup.string().email().required(),
  phone: yup.string().required(),
  interests: yup.array().of(yup.string().required()).min(1).required(),
  referral: yup.string().required(),
  comments: yup.string().required(),
  affiliateId: yup.string().optional(),
  affiliateCode: yup.string().optional(),
  affiliateName: yup.string().optional(),
});

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      name,
      email,
      phone,
      interests,
      referral,
      comments,
      affiliateId,
      affiliateCode,
      affiliateName,
    } = await schema.validate(body, {
      abortEarly: false,
      stripUnknown: true,
    });
    const normalizedInterests = normalizeIntimacyProcedureNames(interests);
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
      interests: normalizedInterests,
      referral,
      comments,
      affiliateId: finalAffiliateId,
      affiliateCode: finalAffiliateCode,
      affiliateName: finalAffiliateName,
    });

    const host = process.env.SMTP_HOST || "smtp.gmail.com";
    const port = Number(process.env.SMTP_PORT || 465);
    const secure = String(process.env.SMTP_SECURE || "true") !== "false";
    const user = process.env.SMTP_USER || (process.env.NODE_ENV === "development" ? "" : undefined);
    const pass = process.env.SMTP_PASS || (process.env.NODE_ENV === "development" ? "" : undefined);

    const transporter = nodemailer.createTransport({
      port,
      host,
      auth: user && pass ? { user, pass } : undefined,
      secure,
    });

    let notificationStatus: "sent" | "failed" = "sent";

    try {
      await transporter.sendMail({
        from: "au.witherow@gmail.com",
        to: process.env.NODE_ENV === "development" ? "au.witherow@gmail.com" : process.env.LEADS_TO_EMAIL || "jennylingcoleman@icloud.com",
        subject: `[MED SPA LEAD] ${name}, ${normalizedInterests.join(", ")}`,
        text: `
          Name: ${name}
          Email: ${email}
          Phone: ${phone}
          interests: ${normalizedInterests.join(", ")}
          comments: ${comments}
          referral: ${referral}
          affiliateId: ${finalAffiliateId || "None"}
          affiliateCode: ${finalAffiliateCode || "None"}
          affiliateName: ${finalAffiliateName || "None"}
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
