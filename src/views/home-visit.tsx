import Link from "next/link";

import DirectionsButton from "components/directions-button";
import TrackedPhoneLink from "components/tracked-phone-link";
import { Button } from "components/ui/button";

const ADDRESS = "3900 Powhatan Parkway, Williamsburg, VA 23188";
const PHONE_HREF = "tel:+18047389483" as const;

const LOCATION_LINKS = [
  { href: "/locations/williamsburg-va", label: "Hours & directions" },
  { href: "/locations", label: "Areas we serve" },
  { href: "/locations/james-city-county-va", label: "James City County" },
  { href: "/locations/yorktown-va", label: "Yorktown" },
  { href: "/locations/newport-news-va", label: "Newport News" },
] as const;

export default function HomeVisit() {
  return (
    <section className="scroll-mt-28 border-t border-base-300 py-16 md:py-24" aria-labelledby="home-visit-heading">
      <div className="grid gap-10 lg:grid-cols-[minmax(0,1.15fr)_minmax(16rem,0.7fr)] lg:gap-16">
        <div className="max-w-xl">
          <p className="text-xs font-medium uppercase tracking-[0.22em] text-base-content/80">Visit The Clinic</p>
          <h2
            id="home-visit-heading"
            className="font-display mt-4 text-4xl font-medium leading-[1.12] tracking-tight text-base-content md:text-5xl"
          >
            Williamsburg Med Spa
          </h2>
          <address className="mt-6 text-lg not-italic leading-relaxed text-base-content/90">{ADDRESS}</address>
          <p className="mt-3 text-base leading-relaxed text-base-content/80">Hours: Mon–Fri 6–8pm; Sat–Sun 10am–6pm</p>
          <p className="mt-5 max-w-[62ch] text-base leading-relaxed text-base-content/80">
            Patients visit from Williamsburg, James City County, Kingsmill, New Town, Yorktown, Newport News, Toano,
            Norge, Lightfoot, and Ford&apos;s Colony.
          </p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
            <Button asChild size="lg" className="w-full sm:w-auto">
              <TrackedPhoneLink href={PHONE_HREF} location="location_nap">
                +1 (804) 738-9483
              </TrackedPhoneLink>
            </Button>
            <DirectionsButton
              address={ADDRESS}
              latitude={37.2729739}
              longitude={-76.7635887}
              variant="secondary"
              size="lg"
              className="w-full sm:w-auto"
            >
              Get Directions
            </DirectionsButton>
          </div>
        </div>

        <div className="border-t border-base-300 pt-8 lg:border-l lg:border-t-0 lg:pl-12 lg:pt-2">
          <p className="text-xs font-medium uppercase tracking-[0.22em] text-base-content/80">Williamsburg and nearby</p>
          <ul className="mt-5 divide-y divide-base-300 border-y border-base-300">
            {LOCATION_LINKS.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className="flex items-center justify-between py-3.5 text-base text-base-content transition-colors hover:text-primary focus:outline-none focus-visible:ring-2 focus-visible:ring-primary/40 focus-visible:ring-offset-4"
                >
                  {item.label}
                  <span aria-hidden className="text-base-content/40">
                    →
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
