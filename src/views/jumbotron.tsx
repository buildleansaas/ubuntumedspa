"use client";

import { Button } from "components/ui/button";
import useCopyToClipBoard from "hooks/use-copy-to-clipboard";
import Link from "next/link";

function isMobileUserAgent() {
  if (typeof window === "undefined") return false;
  return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(window.navigator.userAgent);
}

const serviceLinks = [
  ["Botox", "/procedures/botox"],
  ["Xeomin", "/procedures/xeomin"],
  ["Dermal Fillers", "/procedures/filler"],
  ["PRP Hair Restoration", "/procedures/prp-hair-restoration"],
  ["O-Shot", "/procedures/o-shot"],
  ["Blomdahl Ear Piercing", "/procedures/blomdahl-ear-piercing"],
] as const;

export default function Jumbotron() {
  const { handleCopy } = useCopyToClipBoard();

  const handleAction = () => {
    try {
      // @ts-ignore
      window.gtag && window.gtag("event", "phone_click", { label: "jumbotron", value: "8047389483" });
    } catch {}
    if (isMobileUserAgent()) window.location.href = `tel:${8047389483}`;
    else handleCopy("8047389483");
  };

  return (
    <section className="border-t border-base-300 bg-[#111c18] text-[#dbe0dc]" id="procedures">
      <div className="mx-auto max-w-7xl px-6 py-16 md:px-10 md:py-24 lg:py-28">
        <div className="max-w-4xl">
          <p className="text-[12px] uppercase tracking-[0.32em] text-[#a9b0ac] md:text-sm">Williamsburg Med Spa</p>
          <h1 className="mt-5 max-w-5xl text-5xl font-light tracking-[-0.06em] text-[#edf1ee] sm:text-6xl md:text-7xl lg:text-8xl">
            Rejuvenate Your Life
          </h1>
          <p className="mt-8 max-w-3xl text-2xl font-light leading-relaxed text-[#c8ceca] md:text-3xl md:leading-relaxed">
            A <strong className="font-semibold text-[#edf1ee]">medical spa in Williamsburg, VA</strong> for{" "}
            <strong className="font-semibold text-[#edf1ee]">Botox and Xeomin</strong>, dermal fillers, PRP treatments,
            O-Shot services, sweating treatment, and Blomdahl medical ear piercing.
          </p>
          <p className="mt-6 max-w-2xl text-lg leading-8 text-[#aeb6b1] md:text-xl md:leading-9">
            Work with Jenny Coleman, MSN, RN, CPNP, PMHS for conservative planning, clear education, and
            natural-looking aesthetic goals from a local Williamsburg clinic.
          </p>

          <div className="mt-8 flex flex-wrap gap-2 text-sm text-[#b9c0bc]">
            {serviceLinks.map(([label, href]) => (
              <Link
                key={href}
                href={href}
                className="rounded-full border border-[#dbe0dc]/20 px-3 py-1.5 transition hover:border-[#dbe0dc]/60 hover:text-[#edf1ee]"
              >
                {label}
              </Link>
            ))}
          </div>

          <div className="mt-10 flex flex-wrap items-center gap-3">
            <Button asChild className="bg-[#edf1ee] text-[#111c18] hover:bg-white">
              <Link href="/consult">Book a Williamsburg Consultation</Link>
            </Button>
            <Button
              variant="secondary"
              onClick={handleAction}
              className="border border-[#dbe0dc]/20 bg-transparent text-[#edf1ee] hover:bg-[#dbe0dc]/10"
            >
              +1 (804) 738-9483
            </Button>
          </div>

          <div className="mt-9 space-y-2 text-base leading-7 text-[#a9b0ac]">
            <p>3900 Powhatan Parkway, Williamsburg, VA 23188</p>
            <p>Botox, Xeomin, fillers, PRP, intimate wellness, and medical ear piercing in Williamsburg.</p>
          </div>
        </div>
      </div>
    </section>
  );
}
