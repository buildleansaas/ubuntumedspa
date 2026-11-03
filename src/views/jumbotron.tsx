"use client";

import Image from "next/image";
import { Button } from "components/ui/button";
import useCopyToClipBoard from "hooks/use-copy-to-clipboard";
import { trackPhoneClick } from "lib/analytics";
import Link from "next/link";

function isMobileUserAgent() {
  if (typeof window === "undefined") return false;
  return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(window.navigator.userAgent);
}

const CREDENTIALS = [
  "MSN",
  "RN",
  "CPNP",
  "PMHS",
  "CMA-certified OH-Shot provider",
  "Certified Blomdahl provider",
] as const;

const FEATURED_LINKS = [
  ["Botox", "/procedures/botox"],
  ["Xeomin", "/procedures/xeomin"],
  ["Dermal Fillers", "/procedures/filler"],
  ["OH-Shot", "/procedures/oh-shot"],
  ["Blomdahl Ear Piercing", "/procedures/blomdahl-ear-piercing"],
  ["Williamsburg Location", "/locations/williamsburg-va"],
] as const;

export default function Jumbotron() {
  const { handleCopy } = useCopyToClipBoard();

  const handleAction = () => {
    trackPhoneClick("jumbotron");
    if (isMobileUserAgent()) window.location.href = `tel:${8047389483}`;
    else handleCopy("8047389483");
  };

  return (
    <section className="py-12 md:py-16 lg:py-20" id="procedures" aria-labelledby="home-hero-heading">
      <div className="grid items-center gap-10 lg:grid-cols-[minmax(0,1.2fr)_minmax(16rem,22rem)] lg:gap-16">
        <div className="max-w-3xl">
          <p className="text-xs font-medium uppercase tracking-[0.22em] text-base-content/80">Williamsburg, Virginia</p>
          <h1
            id="home-hero-heading"
            className="font-display mt-4 text-[2.45rem] font-medium leading-[1.08] tracking-tight text-base-content sm:text-5xl md:text-6xl lg:text-[4.15rem]"
          >
            Nurse Practitioner Led Medical Spa in Williamsburg, VA
          </h1>
          <p className="mt-6 max-w-[62ch] text-lg leading-relaxed text-base-content/90 md:text-xl">
            A local med spa with Jenny Coleman, MSN, RN, CPNP, PMHS, a Cellular Medicine Association-certified
            OH-Shot provider and certified Blomdahl medical ear piercing provider.
          </p>
          <ul className="mt-6 flex max-w-[68ch] flex-wrap gap-2" aria-label="Jenny Coleman credentials and certifications">
            {CREDENTIALS.map((credential) => (
              <li key={credential} className="border border-base-300 px-3 py-1 text-sm text-base-content/85">
                {credential}
              </li>
            ))}
          </ul>
          <p className="mt-6 max-w-[65ch] text-base leading-relaxed text-base-content/80 md:text-lg">
            Compare treatment options, check Williamsburg clinic details, or request a consultation for conservative planning,
            clear education, and natural-looking goals.
          </p>
          <nav className="mt-6" aria-label="Featured treatments and location">
            <ul className="flex max-w-3xl flex-wrap gap-x-5 gap-y-2">
              {FEATURED_LINKS.map(([label, href]) => (
                <li key={href}>
                  <Link
                    href={href}
                    className="text-sm text-base-content underline decoration-base-300 underline-offset-[5px] transition-colors hover:text-primary hover:decoration-primary focus:outline-none focus-visible:ring-2 focus-visible:ring-primary/40 focus-visible:ring-offset-4"
                  >
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
            <Button asChild size="lg" className="w-full sm:w-auto">
              <Link href="/consult">Book a Williamsburg Consultation</Link>
            </Button>
            <Button variant="secondary" size="lg" className="w-full sm:w-auto" onClick={handleAction}>
              +1 (804) 738-9483
            </Button>
          </div>
        </div>

        <figure className="mx-auto w-full max-w-[20rem] lg:mx-0 lg:max-w-none lg:justify-self-end">
          <div className="relative aspect-[4/5] overflow-hidden border border-base-300 bg-base-200">
            <Image
              src="/jenny.jpg"
              alt="Our aesthetic nurse practitioner"
              fill
              priority
              sizes="(max-width: 1024px) 70vw, 352px"
              className="object-cover object-[center_18%]"
            />
          </div>
          <figcaption className="mt-4 border-t border-base-300 pt-3">
            <p className="font-display text-2xl font-medium leading-none text-base-content">Jenny Coleman</p>
            <p className="mt-2 text-sm leading-6 text-base-content/80">MSN, RN, CPNP, PMHS</p>
          </figcaption>
        </figure>
      </div>
    </section>
  );
}
