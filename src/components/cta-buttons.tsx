"use client";

import Link from "next/link";
import { Button } from "./ui/button";
import useCopyToClipBoard from "hooks/use-copy-to-clipboard";
import { trackPhoneClick } from "lib/analytics";

function isMobileUserAgent() {
  if (typeof window === "undefined") return false;
  return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(window.navigator.userAgent);
}

export default function CtaButtons({
  consultHref = "/consult",
  align = "center",
}: {
  consultHref?: string;
  align?: "center" | "start";
}) {
  const { handleCopy } = useCopyToClipBoard();

  const handleAction = () => {
    trackPhoneClick("site_cta");
    if (isMobileUserAgent()) window.location.href = `tel:${8047389483}`;
    else handleCopy("8047389483");
  };
  const alignedStart = align === "start";
  return (
    <div
      className={
        alignedStart
          ? "flex flex-col items-stretch gap-3 sm:flex-row sm:flex-wrap sm:items-center"
          : "flex flex-wrap items-center justify-center gap-2"
      }
    >
      <Button asChild size={alignedStart ? "lg" : "default"} className={alignedStart ? "w-full sm:w-auto" : undefined}>
        <Link href={consultHref}>Book a Consultation</Link>
      </Button>
      <Button
        variant="secondary"
        size={alignedStart ? "lg" : "default"}
        className={alignedStart ? "w-full sm:w-auto" : undefined}
        onClick={handleAction}
      >
        +1 (804) 738-9483
      </Button>
    </div>
  );
}
