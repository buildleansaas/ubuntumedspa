import type { Metadata } from "next";
import StructuredData from "components/structured-data";
import Link from "next/link";
import DirectionsButton from "components/directions-button";
import { Button } from "components/ui/button";
import { buildPageMetadata } from "lib/metadata";
import HomeOwnerLink, { XeominHubLink } from "components/home-owner-link";
import { AFTER_HEADER, BUTTON_ROW, CARD, CARD_GRID, CARD_LINK, cardGridFor, CARD_TITLE, H1, H2, INTRO, ROW, ROWS, Section, SectionHeader, Split } from "components/layout";

export const metadata: Metadata = buildPageMetadata({
  title: "Med Spa Near Yorktown, VA | Xeomin, a Botox Alternative",
  description:
    "Visit Williamsburg Med Spa from Yorktown for Xeomin® (a Botox® alternative), PRP therapies, hyperhidrosis care, and Blomdahl medical ear piercing.",
  canonical: "/locations/yorktown-va",
});

const serviceLinks = [
  {
    label: "Botox alternative in Williamsburg",
    href: "/procedures/botox",
    copy: "Searching for Botox? We use Xeomin®, a wrinkle relaxer in the same category, with a consult-first plan.",
  },
  {
    label: "Xeomin treatment planning",
    href: "/procedures/xeomin",
    copy: "For expression lines, dosing questions, and how Xeomin compares with other wrinkle relaxers.",
  },
  {
    label: "Blomdahl ear piercing",
    href: "/procedures/blomdahl-ear-piercing",
    copy: "Sterile single-use cassettes and hypoallergenic starter earrings at the Williamsburg clinic.",
  },
  {
    label: "Infant and kids ear piercing",
    href: "/procedures/blomdahl-ear-piercing/for/children",
    copy: "For parents planning a baby's or child's first earrings with a pediatric nurse practitioner.",
  },
  {
    label: "Yorktown visit notes",
    href: "/procedures/blomdahl-ear-piercing/near/yorktown-va",
    copy: "Driving notes for a Williamsburg piercing appointment. The service details stay on the Blomdahl page.",
  },
];

export default function YorktownPage() {
  return (
    <>
      <StructuredData type="Breadcrumb" breadCrumbs={["Home", "Locations", "Yorktown"]} />

      <Section tight labelledBy="yorktown-heading">
        <div className="max-w-3xl">
          <h1 id="yorktown-heading" className={H1}>Med Spa Near Yorktown, VA</h1>
          <p className={`mt-6 ${INTRO}`}>
            Consult-led aesthetic, regenerative, and medical ear piercing care for Yorktown patients willing to make a planned Williamsburg visit.
          </p>
          <div className="mt-6 max-w-[62ch] space-y-4 text-base leading-relaxed text-base-content/80">
            <p>
              If you are in Yorktown searching for a med spa near me, Williamsburg Med Spa is a nearby option for natural-looking injectables, PRP therapies, hyperhidrosis care, and appointment-based Blomdahl medical ear piercing.
            </p>
            <p>
              This page is built for Yorktown patients comparing a calm clinical visit against retail or rushed alternatives. Expect a provider-led consultation, clear discussion of risks and aftercare, and treatment planning based on your goals rather than a one-size-fits-all package.
            </p>
          </div>
        </div>
      </Section>

      <Section labelledBy="yorktown-quick-read">
        <SectionHeader id="yorktown-quick-read" title="Quick read for Yorktown patients" />
        <ul className={`${AFTER_HEADER} ${CARD_GRID}`}>
          <li className={`${CARD} text-base leading-relaxed text-base-content/80`}>Best for Yorktown patients who want a quieter Williamsburg clinic visit rather than a high-volume retail setting.</li>
          <li className={`${CARD} text-base leading-relaxed text-base-content/80`}>Useful starting point for Xeomin (our wrinkle relaxer), PRP, hyperhidrosis, and medical ear piercing questions.</li>
          <li className={`${CARD} text-base leading-relaxed text-base-content/80`}>Families planning first earrings can review sterile equipment, hypoallergenic starter jewelry, placement, and aftercare before booking.</li>
        </ul>
      </Section>

      <Section labelledBy="yorktown-starting-points">
        <SectionHeader
          id="yorktown-starting-points"
          title="Procedure-specific local starting points"
          intro="If you searched for a med spa near me, start with the treatment family that matches your goal, then schedule a consultation if you want help choosing."
        />
        <div className={`${AFTER_HEADER} ${cardGridFor(serviceLinks.length)}`}>
          {serviceLinks.map((link) => (
            <Link key={link.label} href={link.href} className={`${CARD} ${CARD_LINK}`}>
              <span className={`block ${CARD_TITLE}`}>{link.label}</span>
              <span className="mt-3 block text-base leading-relaxed text-base-content/75">{link.copy}</span>
            </Link>
          ))}
        </div>
      </Section>

      <Section labelledBy="yorktown-getting-here">
        <Split
          align="start"
          text={
            <div>
              <h2 id="yorktown-getting-here" className={H2}>Getting here from Yorktown</h2>
              <p className="mt-6 text-lg leading-relaxed text-base-content/80">
                From Yorktown, many patients use the Colonial Parkway or I-64 toward Williamsburg, then connect through Route 199 and Monticello Avenue toward Powhatan Parkway. Build in traffic buffer around school, bridge, and commuter times.
              </p>
              <h2 className={`mt-12 ${H2}`}>How to plan the visit</h2>
              <ul className={`mt-6 ${ROWS}`}>
                <li className={`${ROW} py-4 text-base text-base-content/80`}>Bring current medications, skin history, and prior injectable history if relevant.</li>
                <li className={`${ROW} py-4 text-base text-base-content/80`}>Avoid scheduling a first piercing immediately before swimming, sports, or a rushed evening.</li>
                <li className={`${ROW} py-4 text-base text-base-content/80`}>If you are unsure which treatment fits, book the consultation first rather than guessing from a menu.</li>
              </ul>
              <div className={`${AFTER_HEADER} ${BUTTON_ROW}`}>
                <Button asChild size="lg"><Link href="/consult">Book a Consultation</Link></Button>
                <Button asChild size="lg" variant="outline"><Link href="/locations/williamsburg-va">Williamsburg Location Details</Link></Button>
                <DirectionsButton size="lg" variant="outline" address="3900 Powhatan Parkway, Williamsburg, VA 23188" latitude={37.2729739} longitude={-76.7635887} />
              </div>
              <HomeOwnerLink className="mt-8" />
              <XeominHubLink className="mt-2" />
            </div>
          }
          media={
            <aside className={CARD}>
              <h2 className={CARD_TITLE}>Nearby areas this page helps</h2>
              <ul className={`mt-4 ${ROWS}`}>
                <li className={`${ROW} py-3 text-base text-base-content/80`}>Yorktown</li>
                <li className={`${ROW} py-3 text-base text-base-content/80`}>Tabb</li>
                <li className={`${ROW} py-3 text-base text-base-content/80`}>Grafton</li>
                <li className={`${ROW} py-3 text-base text-base-content/80`}>Lower Peninsula</li>
              </ul>
            </aside>
          }
        />
      </Section>

    </>
  );
}
