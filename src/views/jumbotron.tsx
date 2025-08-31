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
    if (isMobileUserAgent()) window.location.href = `tel:${8047389483}`;
    else handleCopy("8047389483");
  };

  return (
    <div className="text-center py-16 md:py-32 lg:py-48" id="procedures">
      <h2 className="text-base-content text-4xl/snug sm:text-5xl/snug md:text-6xl/snug font-light mx-auto leading-tight pb-4">
        Rejuvenate Your Life
      </h2>
      <p className="text-base-content text-xl lg:text-2xl mb-8 max-w-2xl mx-auto">
        Experience the amazing effects of <strong>PRP Services</strong> using <strong>Your Own Blood</strong> to enjoy{" "}
        <strong>Natural Healing</strong>, for <strong>Joints</strong>, <strong>Aesthetics</strong>,{" "}
        <strong>Sexual Health</strong> and overall <strong>Wellness</strong>.
      </p>
      <div className="mb-32">
        <div className="flex flex-wrap justify-center items-center gap-2">
          <Button className="bg-primary hover:bg-primary-focus">
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
