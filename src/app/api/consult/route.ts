import { NextRequest, NextResponse } from "next/server";
import nodemailer from "nodemailer";

export async function POST(req: NextRequest) {
  const { name, email, phone, interests, referral, comments } = await req.json();

  try {
    const transporter = nodemailer.createTransport({
      port: 465,
      host: "smtp.gmail.com",
      auth: {
        user: "au.witherow@gmail.com",
        pass: "fbtworxdlosrowse",
      },
      secure: true,
    });

    await transporter.sendMail({
      from: "au.witherow@gmail.com",
      to: process.env.NODE_ENV === "development" ? "au.witherow@gmail.com" : "jennylingcoleman@icloud.com",
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
