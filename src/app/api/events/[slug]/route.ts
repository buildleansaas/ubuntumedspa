import { NextRequest, NextResponse } from "next/server";
import nodemailer from "nodemailer";
import * as yup from "yup";

import { createEventRequest, updateEventRequestNotificationStatus } from "lib/event-requests";
import { buildEventSubmissionSchema, coerceEventSubmission } from "lib/event-form";
import {
  buildEventNotificationLines,
  getEventBySlug,
  isCoreEventFieldId,
  type EventFieldValue,
} from "lib/events";

const getRequiredString = (value: EventFieldValue) => (typeof value === "string" ? value : "");

export async function POST(req: NextRequest, { params }: { params: { slug: string } }) {
  const event = getEventBySlug(params.slug);

  if (!event) {
    return NextResponse.json({ success: false, error: "Event not found." }, { status: 404 });
  }

  try {
    const body = await req.json();
    const submission = coerceEventSubmission(event, body);
    const validated = await buildEventSubmissionSchema(event).validate(submission, {
      abortEarly: false,
      stripUnknown: true,
    });

    const responses = Object.fromEntries(
      Object.entries(validated).filter(([fieldId]) => !isCoreEventFieldId(fieldId))
    ) as Record<string, EventFieldValue>;

    const eventRequest = await createEventRequest({
      eventSlug: event.slug,
      name: getRequiredString(validated.name),
      email: getRequiredString(validated.email),
      phone: getRequiredString(validated.phone),
      responses,
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
        to:
          process.env.NODE_ENV === "development"
            ? "au.witherow@gmail.com"
            : process.env.LEADS_TO_EMAIL || "jennylingcoleman@icloud.com",
        subject: `[MED SPA ${event.leadSubjectLabel}] ${getRequiredString(validated.name)}`,
        text: buildEventNotificationLines(event, validated).join("\n"),
      });

      await updateEventRequestNotificationStatus({
        eventRequestId: eventRequest.eventRequestId,
        notificationStatus: "sent",
      });
    } catch (emailError) {
      notificationStatus = "failed";
      await updateEventRequestNotificationStatus({
        eventRequestId: eventRequest.eventRequestId,
        notificationStatus: "failed",
        notificationError: emailError instanceof Error ? emailError.message : "Unknown email error",
      });
    }

    return NextResponse.json({
      success: true,
      scheduleUrl: `${req.nextUrl.origin}/events/${event.slug}/schedule/${eventRequest.token}`,
      accountId: eventRequest.accountId,
      notificationStatus,
    });
  } catch (error) {
    const message =
      error instanceof yup.ValidationError
        ? error.errors[0] || "Invalid event submission."
        : error instanceof Error && error.message
        ? error.message
        : "Unable to submit event request.";

    return NextResponse.json({ success: false, error: message }, { status: 400 });
  }
}
