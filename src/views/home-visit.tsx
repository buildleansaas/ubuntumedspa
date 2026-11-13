import Link from "next/link";

import DirectionsButton from "components/directions-button";
import TrackedPhoneLink from "components/tracked-phone-link";
import { BUTTON_ROW_CENTER, BandCta } from "components/layout";
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
    <BandCta headingId="home-visit-heading" eyebrow="Visit The Clinic" title="Williamsburg Med Spa">
      <address className="mt-6 text-lg not-italic leading-relaxed text-base-content/90">{ADDRESS}</address>
      <p className="mt-2 text-base leading-relaxed text-base-content/80">Hours: Mon–Fri 6–8pm; Sat–Sun 10am–6pm</p>
      <p className="mx-auto mt-4 max-w-[62ch] text-base leading-relaxed text-base-content/75">
        Patients visit from Williamsburg, James City County, Kingsmill, New Town, Yorktown, Newport News, Toano,
        Norge, Lightfoot, and Ford&apos;s Colony.
      </p>
      <div className={`mt-8 ${BUTTON_ROW_CENTER}`}>
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

      <nav className="mt-10" aria-labelledby="home-visit-nearby">
        <p id="home-visit-nearby" className="eyebrow">
          Williamsburg and nearby
        </p>
        <ul className="mt-4 flex flex-wrap justify-center gap-x-6 gap-y-2">
          {LOCATION_LINKS.map((item) => (
            <li key={item.href}>
              <Link
                href={item.href}
                className="text-base text-base-content underline decoration-base-300 underline-offset-4 transition-colors hover:text-primary hover:decoration-primary"
              >
                {item.label}
              </Link>
            </li>
          ))}
        </ul>
      </nav>
    </BandCta>
  );
}
