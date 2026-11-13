import type { Metadata } from "next";
import DirectionsButton from "components/directions-button";
import NAP from "components/nap";
import StructuredData from "components/structured-data";
import { Button } from "components/ui/button";
import { buildPageMetadata } from "lib/metadata";
import Link from "next/link";
import HomeOwnerLink from "components/home-owner-link";
import {
  AFTER_HEADER,
  BandCta,
  BUTTON_ROW,
  BUTTON_ROW_CENTER,
  CARD,
  CARD_GRID,
  CARD_LINK,
  CARD_TITLE,
  cardGridFor,
  H1,
  INTRO,
  ROW,
  ROWS,
  SPLIT,
  SPLIT_MEDIA,
  SPLIT_TEXT,
  Section,
  SectionHeader,
  Split,
} from "components/layout";

export const metadata: Metadata = buildPageMetadata({
  title: "Med Spa Near James City County, VA | Xeomin, a Botox Alternative",
  description:
    "Consultation-led Xeomin® (a Botox® alternative), PRP hair restoration, hyperhidrosis care, and Blomdahl ear piercing near James City County, VA.",
  canonical: "/locations/james-city-county-va",
});

const neighborhoods = ["Norge", "Toano", "Lightfoot", "Greensprings", "New Town", "Kingsmill", "Ford's Colony"];

const serviceLinks = [
  {
    href: "/procedures/botox",
    label: "Botox alternative in Williamsburg",
    note: "Searching for Botox? We use Xeomin®, a wrinkle relaxer in the same category, for forehead lines, frown lines, and crow's feet.",
  },
  {
    href: "/procedures/xeomin",
    label: "Xeomin",
    note: "Our consultation-led wrinkle relaxer for movement-related facial lines.",
  },
  {
    href: "/procedures/prp-hair-restoration",
    label: "PRP hair restoration",
    note: "Discuss thinning patterns, candidacy, realistic expectations, and when medical evaluation comes first.",
  },
  {
    href: "/procedures/hyperhidrosis-treatment",
    label: "Hyperhidrosis care",
    note: "Explore consultation-led treatment for excessive sweating affecting daily comfort.",
  },
  {
    href: "/procedures/blomdahl-ear-piercing",
    label: "Blomdahl medical ear piercing",
    note: "Plan a nurse-led piercing visit with sterile single-use cassettes and aftercare guidance.",
  },
  {
    href: "/procedures/blomdahl-ear-piercing/for/children",
    label: "Infant and kids ear piercing",
    note: "For parents comparing a pediatric nurse practitioner visit with a retail counter.",
  },
];

const faqs = [
  {
    question: "Where is Williamsburg Med Spa relative to James City County?",
    answer:
      "The clinic is at 3900 Powhatan Parkway, Williamsburg, VA 23188, near New Town. Patients can approach from Route 199, Monticello Avenue, or Richmond Road depending on where they are starting.",
  },
  {
    question: "What should I book first if I am not sure which treatment fits?",
    answer:
      "Book a consultation first. Jenny Brady reviews your goals, relevant health history, timing, and treatment options before recommending a reasonable next step.",
  },
  {
    question: "Does Williamsburg Med Spa serve neighborhoods across James City County?",
    answer:
      "Yes. Patients visit from Norge, Toano, Lightfoot, Greensprings, New Town, Kingsmill, Ford's Colony, and other nearby communities.",
  },
  {
    question: "Is parking available at the Williamsburg clinic?",
    answer:
      "Yes. The clinic has on-site parking in the main lot outside the building. Use the directions link before leaving for current routing from your starting point.",
  },
];

export default function JamesCityCountyPage() {
  return (
    <>
      <StructuredData type="Breadcrumb" breadCrumbs={["Home", "Locations", "James City County"]} />
      <StructuredData type="FAQ" faqs={faqs} />

      <Section tight labelledBy="jcc-heading">
        <Split
          ratio="even"
          text={
            <div>
              <h1 id="jcc-heading" className={H1}>Med Spa Near James City County, VA</h1>
              <p className={`mt-6 ${INTRO}`}>
                Compare consultation-led Xeomin (our wrinkle relaxer), PRP hair restoration, hyperhidrosis care, and Blomdahl
                medical ear piercing at the Williamsburg clinic near New Town.
              </p>
              <p className="mt-4 max-w-[62ch] leading-relaxed text-base-content/75">
                Your best first visit depends on what you want to improve. Start with a specific treatment page when you know
                your concern, or book a consultation when you want Jenny Brady to help you compare options.
              </p>
              <div className={`mt-8 ${BUTTON_ROW}`}>
                <Button asChild size="lg">
                  <Link href="/consult?utm_source=website&utm_medium=location_page&utm_campaign=james_city_county">Book a Consultation</Link>
                </Button>
                <DirectionsButton size="lg" variant="outline" address="3900 Powhatan Parkway, Williamsburg, VA 23188" latitude={37.2729739} longitude={-76.7635887} />
              </div>
            </div>
          }
          media={
            <aside className={CARD} aria-label="Williamsburg clinic at a glance">
              <p className="text-xs font-medium uppercase tracking-[0.22em] text-base-content/80">Williamsburg clinic at a glance</p>
              <dl className={`mt-4 ${ROWS}`}>
                <div className={`${ROW} py-4`}>
                  <dt className="shrink-0 font-medium text-base-content sm:w-24">Address</dt>
                  <dd className="text-base-content/70 sm:flex-1">3900 Powhatan Parkway, Williamsburg, VA 23188</dd>
                </div>
                <div className={`${ROW} py-4`}>
                  <dt className="shrink-0 font-medium text-base-content sm:w-24">Access</dt>
                  <dd className="text-base-content/70 sm:flex-1">Near New Town, with approaches from Route 199, Monticello Avenue, and Richmond Road.</dd>
                </div>
                <div className={`${ROW} py-4`}>
                  <dt className="shrink-0 font-medium text-base-content sm:w-24">Hours</dt>
                  <dd className="text-base-content/70 sm:flex-1">Mon–Fri 6:00pm–8:00pm; Sat–Sun 10:00am–6:00pm</dd>
                </div>
              </dl>
            </aside>
          }
        />
      </Section>

      <Section labelledBy="jcc-treatment-starting-points">
        <SectionHeader
          id="jcc-treatment-starting-points"
          title="Choose the right treatment starting point"
          intro={
            <>
              Use these starting points to compare what each service may address, candidacy considerations, pricing where
              published, and the right next booking step for your concern.
            </>
          }
        />
        <div className={`${AFTER_HEADER} ${cardGridFor(serviceLinks.length)}`}>
          {serviceLinks.map((service) => (
            <Link key={service.href} href={service.href} className={`${CARD} ${CARD_LINK}`}>
              <span className={CARD_TITLE}>{service.label}</span>
              <p className="mt-3 text-base leading-relaxed text-base-content/75">{service.note}</p>
            </Link>
          ))}
        </div>
        <div className="mt-8">
          <Button asChild size="lg" variant="outline">
            <Link href="/procedures">View all procedures</Link>
          </Button>
        </div>
      </Section>

      <Section labelledBy="jcc-visit-reasons">
        <SectionHeader id="jcc-visit-reasons" title="Consultation-led care close to James City County" />
        <div className={`${AFTER_HEADER} ${CARD_GRID}`}>
          <div className={CARD}>
            <h3 className={CARD_TITLE}>A clear first decision</h3>
            <p className="mt-3 text-base leading-relaxed text-base-content/75">
              Jenny reviews your goal, health history, timing, alternatives, and aftercare before you commit to a treatment path.
            </p>
          </div>
          <div className={CARD}>
            <h3 className={CARD_TITLE}>Direct service guidance</h3>
            <p className="mt-3 text-base leading-relaxed text-base-content/75">
              Treatment pages explain what each service may address, what it cannot promise, and whether consultation comes first.
            </p>
          </div>
          <div className={CARD}>
            <h3 className={CARD_TITLE}>Practical arrival</h3>
            <p className="mt-3 text-base leading-relaxed text-base-content/75">
              The clinic is near New Town with on-site parking. Current routing is available through the directions button.
            </p>
          </div>
        </div>
        <p className="mt-8 max-w-[62ch] text-base leading-relaxed text-base-content/75">
          Nearby communities include {neighborhoods.join(", ")}. Visit times vary by starting point and traffic, so use current
          directions when planning your appointment.
        </p>
      </Section>

      <Section labelledBy="jcc-plan-visit">
        <SectionHeader
          id="jcc-plan-visit"
          title="Williamsburg clinic details"
          intro="Confirm the address, hours, phone number, parking, and current route before leaving James City County."
        />
        <div className={AFTER_HEADER}>
          <NAP
            name="Williamsburg Med Spa"
            addressLines={["3900 Powhatan Parkway", "Williamsburg, VA 23188"]}
            phone="+1 (804) 738-9483"
            hours={["Mon–Fri 6:00pm–8:00pm", "Sat–Sun 10:00am–6:00pm"]}
            showMap={true}
            mapsQuery="3900 Powhatan Parkway, Williamsburg, VA 23188"
            latitude={37.2729739}
            longitude={-76.7635887}
          />
        </div>
      </Section>

      <Section labelledBy="jcc-faqs">
        <SectionHeader id="jcc-faqs" title="James City County med spa visit FAQs" />
        <div className={`${AFTER_HEADER} ${ROWS}`}>
          {faqs.map((faq) => (
            <article key={faq.question} className={`${SPLIT} gap-y-3 border-b border-base-300 py-8`}>
              <h3 className={`font-display text-2xl leading-snug text-base-content ${SPLIT_TEXT.wide}`}>{faq.question}</h3>
              <p className={`max-w-[62ch] text-base leading-relaxed text-base-content/85 ${SPLIT_MEDIA.wide}`}>{faq.answer}</p>
            </article>
          ))}
        </div>
      </Section>

      <BandCta headingId="jcc-final-cta" title="Choose your next step">
        <p className={`mx-auto mt-4 ${INTRO}`}>
          Review the treatment page that matches your concern, or book a consultation when you want help comparing options.
        </p>
        <div className={`mt-8 ${BUTTON_ROW_CENTER}`}>
          <Button asChild size="lg">
            <Link href="/consult?utm_source=website&utm_medium=location_page&utm_campaign=james_city_county">Book a Consultation</Link>
          </Button>
          <Button asChild size="lg" variant="outline">
            <Link href="/locations/williamsburg-va">Williamsburg Location Details</Link>
          </Button>
        </div>
        <HomeOwnerLink className="mt-8" />
      </BandCta>
    </>
  );
}
