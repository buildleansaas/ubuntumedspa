"use client";

import { Button } from "components/ui/button";
import useCopyToClipBoard from "hooks/use-copy-to-clipboard";
import Link from "next/link";

function isMobileUserAgent() {
  if (typeof window === "undefined") return false;
  return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(window.navigator.userAgent);
}

export default function CtaFooter() {
  const { handleCopy } = useCopyToClipBoard();

  const handleAction = () => {
    if (isMobileUserAgent()) window.location.href = `tel:${8047389483}`;
    else handleCopy("8047389483");
  };

  return (
    <div className="max-w-7xl mx-auto px-6 md:px-8 z-10">
      <div className="text-center pt-16 sm:pt-20" id="cta">
        <h2 className="text-white text-2xl md:text-3xl lg:text-4xl font-bold mx-auto leading-tight pb-4">
          Achieve Natural Results that Last
        </h2>
        <h3 className="text-white text-xl lg:text-2xl max-w-2xl mb-8 mx-auto">
          Discover the transformative power of Platelet-Rich Plasma treatments and our other treatments at Ubuntu Med
          Spa.
        </h3>
        <p className="mb-8 max-w-xl mx-auto">
          Book a consultation below and let us know what questions you have and Jenny Coleman will be back to you within
          the next 2 business days.
        </p>
        <div className="mb-32">
          <div className="flex justify-center items-center gap-2">
            <Button className="bg-blue-500 hover:bg-blue-600">
              <Link href="/consult">Book a Consultation</Link>
            </Button>{" "}
            <Button variant="secondary" onClick={handleAction}>
              +1 (804) 738-9483
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
