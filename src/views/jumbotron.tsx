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
        Nurse Practitioner Led Medical Spa in Williamsburg, VA
      </h1>
      <p className="text-base-content text-xl lg:text-2xl mb-3 max-w-2xl mx-auto">
        A local med spa with Jenny Coleman, MSN, RN, CPNP, PMHS, a Cellular Medicine Association-certified
        O-Shot provider and certified Blomdahl medical ear piercing provider.
      </p>
      <div className="mb-4 flex flex-wrap justify-center gap-2 text-xs md:text-sm text-base-content/75">
        {[
          "MSN",
          "RN",
          "CPNP",
          "PMHS",
          "CMA-certified O-Shot provider",
          "Certified Blomdahl provider",
        ].map((credential) => (
          <span key={credential} className="rounded-full bg-base-200 px-3 py-1">
            {credential}
          </span>
        ))}
      </div>
      <p className="text-base-content/70 text-base md:text-lg mb-8 max-w-3xl mx-auto">
        Compare treatment options, check Williamsburg clinic details, or request a consultation for conservative planning,
        clear education, and natural-looking goals.
      </p>
      <div className="mb-6 flex flex-wrap justify-center gap-2 text-sm">
        {[
          ["Botox", "/procedures/botox"],
          ["Xeomin", "/procedures/xeomin"],
          ["Dermal Fillers", "/procedures/filler"],
          ["O-Shot", "/procedures/o-shot"],
          ["Blomdahl Ear Piercing", "/procedures/blomdahl-ear-piercing"],
          ["Williamsburg Location", "/locations/williamsburg-va"],
        ].map(([label, href]) => (
          <Link key={href} href={href} className="rounded-full border border-base-300 px-3 py-1 hover:border-primary">
            {label}
          </Link>
        ))}
      </div>
      <div className="mb-32">
        <div className="flex flex-wrap justify-center items-center gap-2">
          <Button asChild>
            <Link href="/consult">Book a Williamsburg Consultation</Link>
          </Button>
          <Button variant="secondary" onClick={handleAction}>
            +1 (804) 738-9483
          </Button>
        </div>
      </div>
    </div>
  );
}
