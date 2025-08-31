"use client";

import Link from "next/link";
import { Button } from "./ui/button";
import useCopyToClipBoard from "hooks/use-copy-to-clipboard";

function isMobileUserAgent() {
  if (typeof window === "undefined") return false;
  return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(window.navigator.userAgent);
}

export default function CtaButtons() {
  const { handleCopy } = useCopyToClipBoard();

  const handleAction = () => {
    if (isMobileUserAgent()) window.location.href = `tel:${8047389483}`;
    else handleCopy("8047389483");
  };
  return (
    <div className="flex flex-wrap justify-center items-center gap-2">
      <Button className="bg-primary hover:bg-primary">
        <Link href="/consult">Book a Consultation</Link>
      </Button>{" "}
      <Button variant="secondary" onClick={handleAction}>
        +1 (804) 738-9483
      </Button>
    </div>
  );
}
