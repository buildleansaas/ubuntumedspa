"use client";

import { Button } from "components/ui/button";
import useCopyToClipBoard from "hooks/use-copy-to-clipboard";
import Link from "next/link";

function isMobileUserAgent() {
  if (typeof window === "undefined") return false;
  return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(window.navigator.userAgent);
}

export default function Jumbotron() {
  const { handleCopy } = useCopyToClipBoard();

  const handleAction = () => {
    try {
      // @ts-ignore
      window.gtag && window.gtag('event', 'phone_click', { label: 'jumbotron', value: '8047389483' });
    } catch {}
    if (isMobileUserAgent()) window.location.href = `tel:${8047389483}`;
    else handleCopy("8047389483");
  };

  return (
    <div className="text-center py-16 md:py-32 lg:py-48" id="procedures">
      <h1 className="text-base-content text-4xl/snug sm:text-5xl/snug md:text-6xl/snug font-light mx-auto leading-tight pb-4">
        Rejuvenate Your Life
      </h1>
      <p className="text-base-content text-xl lg:text-2xl mb-3 max-w-2xl mx-auto">
        Explore <strong>PRP services</strong> using <strong>your own blood components</strong> to support{" "}
        <strong>joint care</strong>, <strong>aesthetic goals</strong>, <strong>sexual wellness</strong>, and overall{" "}
        <strong>well-being</strong>.
      </p>
      <p className="text-base-content/70 text-base md:text-lg mb-8 max-w-3xl mx-auto">
        From intimate wellness and facial rejuvenation to hair restoration and joint-focused care, our PRP treatments
        are personalized, natural-looking, and grounded in clear guidance.
      </p>
      <div className="mb-32">
        <div className="flex flex-wrap justify-center items-center gap-2">
          <Button asChild>
            <Link href="/consult">Book a Consultation</Link>
          </Button>
          <Button variant="secondary" onClick={handleAction}>
            +1 (804) 738-9483
          </Button>
        </div>
      </div>
    </div>
  );
}
