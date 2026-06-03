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
      <p className="mb-4 text-xs font-semibold uppercase tracking-[0.28em] text-primary/80">
        Nurse Practitioner Led Medical Spa
      </p>
      <h1 className="text-base-content text-4xl/snug sm:text-5xl/snug md:text-6xl/snug font-light mx-auto leading-tight pb-4 max-w-4xl">
        Natural-Looking Aesthetic Care in Williamsburg, VA
      </h1>
      <p className="text-base-content text-lg md:text-xl lg:text-2xl mb-6 max-w-3xl mx-auto">
        Jenny Coleman, MSN, RN, CPNP, PMHS provides Botox, Xeomin, fillers, PRP, O-Shot care,
        and medical ear piercing in a calm Williamsburg clinic.
      </p>
      <div className="mb-8 mx-auto grid max-w-4xl grid-cols-1 gap-3 text-left sm:grid-cols-2 lg:grid-cols-4">
        {[
          ["Nurse Practitioner Led", "Clinical aesthetic planning"],
          ["26 Years in Medicine", "Experienced provider care"],
          ["CMA-Certified O-Shot", "Cellular Medicine Association"],
          ["Certified Blomdahl Provider", "Medical ear piercing"],
        ].map(([credential, detail]) => (
          <div key={credential} className="rounded-2xl border border-primary/15 bg-base-100/80 px-4 py-3 shadow-sm">
            <p className="text-sm font-semibold text-base-content">{credential}</p>
            <p className="mt-1 text-xs text-base-content/60">{detail}</p>
          </div>
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
