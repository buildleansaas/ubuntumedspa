"use client";

import Image from "next/image";
import { Button } from "components/ui/button";
import useCopyToClipBoard from "hooks/use-copy-to-clipboard";
import { trackPhoneClick } from "lib/analytics";
import Link from "next/link";
import { BUTTON_ROW, SPLIT, SPLIT_TEXT, Section } from "components/layout";
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
// Tidewater: main's words, credential chips, links and buttons in the new palette.
export default function Jumbotron({ xeominCash, xeominCard }: { xeominCash: string; xeominCard: string }) {
  const { handleCopy } = useCopyToClipBoard();

  const handleAction = () => {
    trackPhoneClick("jumbotron");
    if (isMobileUserAgent()) window.location.href = `tel:${8047389483}`;
    else handleCopy("8047389483");
  };

  return (
    <Section tight id="procedures" labelledBy="home-hero-heading">
      <div className={`${SPLIT} items-center`}>
        <div className={SPLIT_TEXT.even}>
          <p className="text-sm text-base-content/65">Williamsburg, Virginia</p>
          <h1
            id="home-hero-heading"
            className="font-display mt-4 text-4xl leading-tight tracking-tight text-base-content sm:text-5xl lg:text-6xl"
          >
            Nurse Practitioner Led Medical Spa in Williamsburg, VA
          </h1>
          <p className="mt-6 max-w-[62ch] text-lg leading-relaxed text-base-content/85 md:text-xl">
            Looking for Botox in Williamsburg, VA? We use{" "}
            <Link href="/procedures/xeomin" className="link link-primary no-underline hover:underline">
              Xeomin®
            </Link>
            , a wrinkle relaxer in the same category as Botox®, for frown lines, forehead lines, and crow&apos;s feet.
            From {xeominCash} cash ({xeominCard} by card or online).
          </p>
          <p className="mt-4 max-w-[62ch] text-base leading-relaxed text-base-content/75 md:text-lg">
            A local med spa with Jenny Brady, MSN, RN, CPNP, PMHS, a Cellular Medicine Association-certified
            OH-Shot provider and certified Blomdahl medical ear piercing provider.
          </p>
          <ul className="mt-4 flex max-w-[62ch] flex-wrap gap-2" aria-label="Jenny Brady credentials and certifications">
            {CREDENTIALS.map((credential) => (
              <li key={credential} className="rounded-full border border-base-300 px-3 py-1 text-xs text-base-content/70">
                {credential}
              </li>
            ))}
          </ul>
          <p className="mt-4 max-w-[62ch] text-base leading-relaxed text-base-content/75">
            Compare treatment options, check Williamsburg clinic details, or request a consultation for conservative planning,
            clear education, and natural-looking goals.
          </p>
          <div className={`mt-8 ${BUTTON_ROW}`}>
            <Button asChild size="lg" className="w-full sm:w-auto">
              <Link href="/consult">Book a Williamsburg Consultation</Link>
            </Button>
            <Button asChild variant="secondary" size="lg" className="w-full sm:w-auto">
              <Link href="/prices">See prices</Link>
            </Button>
            <Button variant="secondary" size="lg" className="w-full sm:w-auto" onClick={handleAction}>
              +1 (804) 738-9483
            </Button>
          </div>
          <nav className="mt-8" aria-label="Featured treatments and location">
            <ul className="flex max-w-3xl flex-wrap gap-x-5 gap-y-2">
              {FEATURED_LINKS.map(([label, href]) => (
                <li key={href}>
                  <Link
                    href={href}
                    className="text-sm text-base-content underline decoration-base-300 underline-offset-4 transition-colors hover:text-secondary hover:decoration-secondary"
                  >
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        </div>

        <figure className="w-full max-w-sm lg:col-span-5 lg:col-start-8 lg:max-w-none">
          <div className="relative aspect-[4/5] overflow-hidden rounded-2xl bg-base-200">
            <Image
              src="/jenny.jpg"
              alt="Our aesthetic nurse practitioner"
              fill
              priority
              sizes="(max-width: 640px) 272px, (max-width: 1024px) 304px, 352px"
              className="object-cover object-[center_18%]"
            />
          </div>
          <figcaption className="mt-4">
            <p className="font-display text-xl leading-none text-base-content">Jenny Brady</p>
            <p className="mt-2 text-sm text-base-content/60">MSN, RN, CPNP, PMHS</p>
          </figcaption>
        </figure>
      </div>
    </Section>
  );
}
