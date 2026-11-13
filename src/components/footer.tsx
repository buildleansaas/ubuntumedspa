import Link from "next/link";

import ClinicMapEmbed from "components/clinic-map-embed";
import DirectionsButton from "components/directions-button";
import TrackedPhoneLink from "components/tracked-phone-link";
import { Button } from "components/ui/button";
import FooterSocialLinks from "components/footer-social-links";


const primaryLinks = [
  { href: "/consult", label: "Consult" },
  { href: "/procedures", label: "Procedures" },
  { href: "/prices", label: "Prices" },
  { href: "/offers", label: "Offers" },
  { href: "/products", label: "Products" },
  { href: "/locations", label: "Locations" },
  { href: "/events", label: "Events" },
  { href: "/blog", label: "Blog" },
] as const;

const treatmentLinks = [
  { href: "/procedures/botox", label: "Botox Alternative" },
  { href: "/procedures/xeomin", label: "Xeomin" },
  { href: "/procedures/oh-shot", label: "OH-Shot" },
  { href: "/procedures/pe-shot", label: "Pe-Shot" },
  { href: "/procedures/blomdahl-ear-piercing", label: "Blomdahl Ear Piercing" },
] as const;

const locationLinks = [
  { href: "/locations/williamsburg-va", label: "Williamsburg" },
  { href: "/locations/james-city-county-va", label: "James City County" },
  { href: "/locations/yorktown-va", label: "Yorktown" },
  { href: "/locations/newport-news-va", label: "Newport News" },
] as const;

const ADDRESS = "3900 Powhatan Parkway, Williamsburg, VA 23188";

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="rule-top-bleed w-full text-base-content">
      {/* <main> already gives the footer the site container, so its text shares the sections' left edge.
          Austin 2026-11-13: the clinic details and the map share one row instead of a separate block above. */}
      <div className="w-full">
        <div className="grid gap-10 py-14 lg:grid-cols-2 lg:items-start lg:gap-16">
          <div className="max-w-xl">
            <h3 className="font-display text-3xl font-light leading-[1.15] tracking-tight text-base-content md:text-4xl">
              Williamsburg Med Spa
            </h3>
            <div className="mt-4 space-y-1.5 text-base leading-relaxed text-base-content/80">
              <p>{ADDRESS}</p>
              <p className="text-base-content/70">Hours: Mon–Fri 6–8pm; Sat–Sun 10am–6pm</p>
            </div>
            <div className="mt-6 flex flex-wrap gap-3">
              <DirectionsButton address={ADDRESS} latitude={37.2729739} longitude={-76.7635887}>
                Get Directions
              </DirectionsButton>
              <Button asChild variant="secondary">
                <TrackedPhoneLink href="tel:+18047389483" location="footer_location">
                  +1 (804) 738-9483
                </TrackedPhoneLink>
              </Button>
            </div>
            <h4 className="mt-10 font-display text-2xl font-light leading-[1.2] tracking-tight text-base-content">
              Rejuvenate Your Life
            </h4>
            {/* PRP_BREAST_SHARED_COPY_CONTRACT_START */}
            <p className="mt-4 text-base md:text-lg leading-relaxed text-base-content/80">
              Explore personalized services for <strong>joint concerns</strong>, <strong>aesthetic goals</strong>,{" "}
              <strong>sexual wellness</strong>, and overall <strong>well-being</strong>.
            </p>
            <p className="mt-3 text-sm md:text-base leading-relaxed text-base-content/70">
              From intimate wellness and facial rejuvenation to hair and joint-focused care, compare current service
              details, pricing, and next steps before you book.
            </p>
            {/* PRP_BREAST_SHARED_COPY_CONTRACT_END */}
            <FooterSocialLinks />
            {/* Local Biz Legends verified-profile badge (LBL issue 135). The image is a live SVG
                from LBL; it 404s if the profile stops qualifying. */}
            <a
              className="mt-6 inline-block"
              href="https://www.localbizlegends.com/businesses/williamsburg-med-spa-williamsburg-va"
            >
              {/* eslint-disable-next-line @next/next/no-img-element -- third-party SVG badge, served and sized by LBL */}
              <img
                src="https://www.localbizlegends.com/badge/williamsburg-med-spa-williamsburg-va"
                alt="Verified on Local Biz Legends"
                width={269}
                height={64}
                loading="lazy"
                style={{ border: 0, maxWidth: "100%", height: "auto" }}
              />
            </a>
          </div>

          <ClinicMapEmbed className="aspect-[4/3] rounded-2xl lg:aspect-auto lg:h-full lg:min-h-[420px]" />
        </div>

        <div className="grid gap-10 border-t border-base-300 py-12 sm:grid-cols-3">
          <div>
            <h4 className="text-sm font-medium text-base-content/60">Navigate</h4>
            <ul className="mt-4 space-y-3 text-sm text-base-content/75">
              {primaryLinks.map((item) => (
                <li key={item.href}>
                  <Link className="transition-colors hover:text-base-content hover:underline" href={item.href}>
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-sm font-medium text-base-content/60">Popular treatments</h4>
            <ul className="mt-4 space-y-3 text-sm text-base-content/75">
              {treatmentLinks.map((item) => (
                <li key={item.href}>
                  <Link className="transition-colors hover:text-base-content hover:underline" href={item.href}>
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-sm font-medium text-base-content/60">Nearby areas</h4>
            <ul className="mt-4 space-y-3 text-sm text-base-content/75">
              {locationLinks.map((item) => (
                <li key={item.href}>
                  <Link className="transition-colors hover:text-base-content hover:underline" href={item.href}>
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="flex flex-col gap-3 border-t border-base-300 py-5 text-sm text-base-content/60 md:flex-row md:items-center md:justify-between">
          <div className="flex flex-wrap items-center gap-2">
            <span>© {year}</span>
            <span>Williamsburg Med Spa</span>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <Link className="transition-colors hover:text-base-content hover:underline" href="/">
              Home
            </Link>
            <span aria-hidden>·</span>
            <Link className="transition-colors hover:text-base-content hover:underline" href="/html-sitemap">
              Sitemap
            </Link>
            <span aria-hidden>·</span>
            <Link className="transition-colors hover:text-base-content hover:underline" href="/privacy">
              Privacy
            </Link>
            <span aria-hidden>·</span>
            <Link className="transition-colors hover:text-base-content hover:underline" href="/terms">
              Terms
            </Link>
            <span aria-hidden>·</span>
            <Link className="transition-colors hover:text-base-content hover:underline" href="/cookies">
              Cookies
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
