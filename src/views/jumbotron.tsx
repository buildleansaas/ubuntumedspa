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
  ["Botox Alternative", "/procedures/botox"],
  ["Xeomin", "/procedures/xeomin"],
  ["OH-Shot", "/procedures/oh-shot"],
  ["Blomdahl Ear Piercing", "/procedures/blomdahl-ear-piercing"],
  ["Williamsburg Location", "/locations/williamsburg-va"],
] as const;

// Answers the Botox-alternative search in the first screen (ScaleSleek f_vh33afabed). The clinic uses only Xeomin.
// Prices come from the server page as props, so the catalog stays out of this client chunk.
// Tidewater: main's words, credential chips and links in the new palette; one filled button.
export default function Jumbotron({ xeominCash, xeominCard }: { xeominCash: string; xeominCard: string }) {
  const { handleCopy } = useCopyToClipBoard();

  const handleAction = () => {
    trackPhoneClick("jumbotron");
    if (isMobileUserAgent()) window.location.href = `tel:${8047389483}`;
    else handleCopy("8047389483");
  };

  return (
    <section className="pb-16 pt-4 md:pb-24 md:pt-10" id="procedures" aria-labelledby="home-hero-heading">
      <div className="grid items-center gap-12 lg:grid-cols-[minmax(0,1.3fr)_minmax(16rem,22rem)] lg:gap-20">
        <div className="max-w-2xl">
          <p className="text-sm text-base-content/65">Williamsburg, Virginia</p>
          <h1
            id="home-hero-heading"
            className="font-display mt-4 text-[2.4rem] leading-[1.08] tracking-tight text-base-content sm:text-5xl lg:text-[3.6rem]"
          >
            Nurse Practitioner Led Medical Spa in Williamsburg, VA
          </h1>
          <p className="mt-7 max-w-[60ch] text-lg leading-relaxed text-base-content/85 md:text-xl">
            Looking for Botox in Williamsburg, VA? We use{" "}
            <Link href="/procedures/xeomin" className="link link-primary no-underline hover:underline">
              Xeomin®
            </Link>
            , a wrinkle relaxer in the same category as Botox®, for frown lines, forehead lines, and crow&apos;s feet.
            From {xeominCash} cash ({xeominCard} by card or online).
          </p>
          <p className="mt-4 max-w-[60ch] text-base leading-relaxed text-base-content/75 md:text-lg">
            A local med spa with Jenny Brady, MSN, RN, CPNP, PMHS, a Cellular Medicine Association-certified
            OH-Shot provider and certified Blomdahl medical ear piercing provider.
          </p>
          <ul className="mt-5 flex max-w-[64ch] flex-wrap gap-1.5" aria-label="Jenny Brady credentials and certifications">
            {CREDENTIALS.map((credential) => (
              <li key={credential} className="rounded-full border border-base-300 px-2.5 py-0.5 text-xs text-base-content/70">
                {credential}
              </li>
            ))}
          </ul>
          <p className="mt-6 max-w-[60ch] text-base leading-relaxed text-base-content/75">
            Compare treatment options, check Williamsburg clinic details, or request a consultation for conservative planning,
            clear education, and natural-looking goals.
          </p>
          <div className="mt-9 flex flex-wrap items-center gap-x-7 gap-y-4">
            <Link
              href="/consult"
              className="inline-flex h-12 items-center rounded-full bg-primary px-7 text-[0.95rem] font-medium text-primary-content transition-colors hover:bg-primary/90"
            >
              Book a visit
            </Link>
            <Link
              href="/prices"
              className="rounded-sm text-[0.95rem] text-secondary underline decoration-secondary/30 underline-offset-[6px] transition-colors hover:decoration-secondary"
            >
              See prices
            </Link>
            <Button variant="secondary" size="lg" onClick={handleAction}>
              +1 (804) 738-9483
            </Button>
          </div>
          <nav className="mt-8" aria-label="Featured treatments and location">
            <ul className="flex max-w-3xl flex-wrap gap-x-5 gap-y-2">
              {FEATURED_LINKS.map(([label, href]) => (
                <li key={href}>
                  <Link
                    href={href}
                    className="text-sm text-base-content underline decoration-base-300 underline-offset-[5px] transition-colors hover:text-secondary hover:decoration-secondary"
                  >
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        </div>

        <figure className="mx-auto w-full max-w-[17rem] sm:max-w-[19rem] lg:mx-0 lg:max-w-none lg:justify-self-end">
          <div className="relative aspect-[4/5] overflow-hidden rounded-b-[1.75rem] rounded-t-[999px] bg-base-200">
            <Image
              src="/jenny.jpg"
              alt="Our aesthetic nurse practitioner"
              fill
              priority
              sizes="(max-width: 640px) 272px, (max-width: 1024px) 304px, 352px"
              className="object-cover object-[center_18%]"
            />
          </div>
          <figcaption className="mt-4 text-center lg:text-left">
            <p className="font-display text-xl leading-none text-base-content">Jenny Brady</p>
            <p className="mt-2 text-sm text-base-content/60">MSN, RN, CPNP, PMHS</p>
          </figcaption>
        </figure>
      </div>
    </section>
  );
}
