import { NextRequest, NextResponse } from "next/server";
import nodemailer from "nodemailer";

export async function POST(req: NextRequest) {
  const { name, email, phone, interests, referral, comments } = await req.json();

  try {
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

    await transporter.sendMail({
      from: "au.witherow@gmail.com",
      to: process.env.NODE_ENV === "development" ? "au.witherow@gmail.com" : process.env.LEADS_TO_EMAIL || "jennylingcoleman@icloud.com",
      subject: `[MED SPA LEAD] ${name}, ${interests.join(", ")}`,
      text: `
        Name: ${name}
        Email: ${email}
        Phone: ${phone}
        interests: ${interests.join(", ")}
        comments: ${comments}
        referral: ${referral}
      `,
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ success: false, error });
  }
}
