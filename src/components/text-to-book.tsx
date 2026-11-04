"use client";

import { useEffect, useState } from "react";

import { Button } from "components/ui/button";
import { trackPhoneClick, trackTextClick, type PhoneCtaLocation } from "lib/analytics";
import { BOOKING_PHONE_DISPLAY, bookingSmsHref, bookingTelHref } from "lib/text-to-book";

type TextToBookProps = {
  heading: string;
  intro: string;
  /** Prefilled text message; the patient adds their days and times before sending. */
  message: string;
  location: PhoneCtaLocation;
};

export default function TextToBook({ heading, intro, message, location }: TextToBookProps) {
  const [canShare, setCanShare] = useState(false);
  const [copyState, setCopyState] = useState<"idle" | "copied" | "failed">("idle");

  useEffect(() => {
    setCanShare(typeof navigator !== "undefined" && typeof navigator.share === "function");
  }, []);

  const copyMessage = async () => {
    try {
      await navigator.clipboard.writeText(message);
      setCopyState("copied");
    } catch {
      setCopyState("failed");
    }
  };

  const shareMessage = async () => {
    try {
      await navigator.share({ text: message });
    } catch {
      // The patient closed the share sheet; nothing to do.
    }
  };

  return (
    <div className="border border-base-300 bg-base-100 p-6">
      <h2 className="text-2xl font-semibold mb-3">{heading}</h2>
      <p className="text-base-content/70 mb-5">{intro}</p>

      <div className="flex flex-wrap gap-3">
        <Button asChild>
          <a href={bookingSmsHref(message)} onClick={() => trackTextClick(location)}>
            Text Jenny
          </a>
        </Button>
        <Button asChild variant="secondary">
          <a href={bookingTelHref} onClick={() => trackPhoneClick(location)}>
            Call {BOOKING_PHONE_DISPLAY}
          </a>
        </Button>
        {canShare ? (
          <Button type="button" variant="secondary" onClick={shareMessage}>
            Share details
          </Button>
        ) : (
          <Button type="button" variant="secondary" onClick={copyMessage}>
            {copyState === "copied" ? "Copied" : copyState === "failed" ? "Select the message below to copy" : "Copy message"}
          </Button>
        )}
      </div>

      <p className="mt-5 text-xs uppercase tracking-[0.18em] text-base-content/60">Your message</p>
      <p className="mt-2 border border-base-300 bg-base-200 p-4 text-sm leading-relaxed text-base-content/80">{message}</p>
      <p className="mt-3 text-sm text-base-content/60">
        Add a few days and times that work for you, then send. Jenny will text back to confirm. On a computer, text{" "}
        {BOOKING_PHONE_DISPLAY} from your phone with the message above.
      </p>
    </div>
  );
}
