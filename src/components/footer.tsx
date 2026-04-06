import Link from "next/link";

import FooterLocationCta from "components/footer-location-cta";
import FooterAffiliateCta from "components/footer-affiliate-cta";

const primaryLinks = [
  { href: "/consult", label: "Consult" },
  { href: "/procedures", label: "Procedures" },
  { href: "/products", label: "Products" },
  { href: "/locations", label: "Locations" },
  { href: "/blog", label: "Blog" },
  { href: "/affiliates", label: "Affiliates" },
] as const;

const treatmentLinks = [
  { href: "/procedures/botox", label: "Botox" },
  { href: "/procedures/xeomin", label: "Xeomin" },
  { href: "/procedures/filler", label: "Filler" },
  { href: "/procedures/o-shot", label: "O-Shot" },
  { href: "/procedures/p-shot", label: "P-Shot" },
  { href: "/procedures/blohmdahl-ear-piercing", label: "Blohmdahl Ear Piercing" },
] as const;

const locationLinks = [
  { href: "/locations/williamsburg-va", label: "Williamsburg" },
  { href: "/locations/james-city-county-va", label: "James City County" },
  { href: "/locations/yorktown-va", label: "Yorktown" },
  { href: "/locations/newport-news-va", label: "Newport News" },
] as const;

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="mt-20 w-full border-t border-base-300 text-base-content">
      <div className="mx-auto w-full max-w-7xl px-4 md:px-8">
        <div className="grid gap-12 py-12 lg:grid-cols-2 lg:gap-16">
          <FooterLocationCta />
          <FooterAffiliateCta />
        </div>

        <div className="grid gap-10 border-t border-base-300 py-12 md:grid-cols-2 xl:grid-cols-[1.2fr_1fr_1fr_1fr]">
          <div className="max-w-xl">
            <p className="text-[11px] uppercase tracking-[0.24em] text-base-content/60">Williamsburg Med Spa</p>
            <h3 className="mt-3 text-3xl/snug md:text-4xl/snug font-light tracking-tight text-base-content">
              Rejuvenate Your Life
            </h3>
            <p className="mt-4 text-base md:text-lg leading-relaxed text-base-content/80">
              Explore <strong>PRP services</strong> using <strong>your own blood components</strong> to support{" "}
              <strong>joint care</strong>, <strong>aesthetic goals</strong>, <strong>sexual wellness</strong>, and
              overall <strong>well-being</strong>.
            </p>
            <p className="mt-3 text-sm md:text-base leading-relaxed text-base-content/70">
              From intimate wellness and facial rejuvenation to hair restoration and joint-focused care, our PRP
              treatments are personalized, natural-looking, and grounded in clear guidance.
            </p>
            <div className="mt-5 space-y-2 text-sm leading-6 text-base-content/65">
              <p>3900 Powhatan Parkway, Williamsburg, VA 23188</p>
              <p>+1 (804) 738-9483</p>
            </div>
          </div>

          <div>
            <h4 className="text-sm font-semibold uppercase tracking-[0.16em] text-base-content/60">Navigate</h4>
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
            <h4 className="text-sm font-semibold uppercase tracking-[0.16em] text-base-content/60">
              Popular Treatments
            </h4>
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
            <h4 className="text-sm font-semibold uppercase tracking-[0.16em] text-base-content/60">Nearby Areas</h4>
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
            <Link className="transition-colors hover:text-base-content hover:underline" href="/sitemap.xml">
              Sitemap
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
