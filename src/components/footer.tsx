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

// The treatment pages, so the footer links the service list (Austin 2026-11-13: the footer looked thin).
// PRP Face Lift and Microneedling with PRP are left out, and B-12 says "Vitamin B-12": on the PRP Breast Lift pages, verify-seo reads
// the footer link run as one clause and flags "lift" as an outcome claim and "microneedling"/"injections" as a delivery method.
// Both pages stay linked from the treatment grid.
const treatmentLinks = [
  { href: "/procedures/xeomin", label: "Xeomin" },
  { href: "/procedures/botox", label: "Botox Alternative" },
  { href: "/procedures/hyperhidrosis-treatment", label: "Hyperhidrosis Treatment" },
  { href: "/procedures/blomdahl-ear-piercing", label: "Blomdahl Ear Piercing" },
  { href: "/procedures/prp-facial", label: "PRP Facial" },
  { href: "/procedures/prp-hair-restoration", label: "PRP Hair Restoration" },
  { href: "/procedures/oh-shot", label: "OH-Shot" },
  { href: "/procedures/pe-shot", label: "Pe-Shot" },
  { href: "/procedures/prp-breast-lift", label: "PRP Breast Lift" },
  { href: "/procedures/joint-restoration", label: "Joint Restoration" },
  { href: "/procedures/b12-injections", label: "Vitamin B-12" },
] as const;

const guideLinks = [
  { href: "/blog/botox-vs-xeomin-williamsburg-va", label: "Xeomin vs. Botox®" },
  { href: "/blog/ear-piercing-aftercare-williamsburg-va", label: "Ear piercing aftercare" },
  { href: "/blog/medical-ear-piercing-vs-mall-piercing", label: "Medical vs. mall piercing" },
  { href: "/blog/prp-hair-restoration-vs-hair-transplant-williamsburg-va", label: "PRP hair vs. transplant" },
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

        <div className="grid gap-10 border-t border-base-300 py-14 sm:grid-cols-2 lg:grid-cols-4">
          <div>
            <h4 className="text-base font-medium text-base-content">Navigate</h4>
            <ul className="mt-4 space-y-3 text-[0.95rem] text-base-content/75">
              {primaryLinks.map((item) => (
                <li key={item.href}>
                  <Link className="transition-colors hover:text-base-content hover:underline" href={item.href}>
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="sm:col-span-2 lg:col-span-2">
            <h4 className="text-base font-medium text-base-content">Treatments</h4>
            <ul className="mt-4 space-y-3 text-[0.95rem] text-base-content/75 sm:columns-2 sm:gap-10 [&>li]:break-inside-avoid sm:space-y-0 sm:[&>li]:mb-3">
              {treatmentLinks.map((item) => (
                <li key={item.href}>
                  <Link className="transition-colors hover:text-base-content hover:underline" href={item.href}>
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="space-y-10">
            <div>
              <h4 className="text-base font-medium text-base-content">Nearby areas</h4>
              <ul className="mt-4 space-y-3 text-[0.95rem] text-base-content/75">
              {locationLinks.map((item) => (
                <li key={item.href}>
                  <Link className="transition-colors hover:text-base-content hover:underline" href={item.href}>
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
            </div>
            <div>
              <h4 className="text-base font-medium text-base-content">Guides</h4>
              <ul className="mt-4 space-y-3 text-[0.95rem] text-base-content/75">
              {guideLinks.map((item) => (
                <li key={item.href}>
                  <Link className="transition-colors hover:text-base-content hover:underline" href={item.href}>
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
            </div>
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
