import type { Metadata } from "next";
import Link from "next/link";
import StructuredData from "components/structured-data";
import { Button } from "components/ui/button";
import { buildPageMetadata } from "lib/metadata";
import HomeOwnerLink from "components/home-owner-link";
import {
  AFTER_HEADER,
  BUTTON_ROW,
  CARD,
  CARD_GRID,
  CARD_GRID_2,
  CARD_LINK,
  CARD_TITLE,
  H1,
  INTRO,
  ROWS,
  SPLIT,
  SPLIT_MEDIA,
  SPLIT_TEXT,
  Section,
  SectionHeader,
} from "components/layout";

export const metadata: Metadata = buildPageMetadata({
  title: "Med Spa Locations Near Williamsburg, VA | Williamsburg Med Spa",
  description:
    "Explore Williamsburg Med Spa's primary Williamsburg clinic, nearby service areas, typical drive times from surrounding communities, and Mobile Med Spa availability across Virginia.",
  canonical: "/locations",
});

const locations = [
  {
    name: "Williamsburg, VA (Primary Clinic)",
    slug: "williamsburg-va",
    summary: "Our primary clinic with full PRP, injectable, and aesthetic services in one destination visit.",
  },
  {
    name: "James City County",
    slug: "james-city-county-va",
    summary: "A convenient visit for neighborhoods across James City County and nearby Williamsburg routes.",
  },
  {
    name: "Yorktown",
    slug: "yorktown-va",
    summary: "A worthwhile trip for patients coming over from Yorktown by Colonial Parkway or I-64.",
  },
  {
    name: "Newport News",
    slug: "newport-news-va",
    summary: "A practical destination for Newport News residents seeking regenerative PRP and aesthetic care.",
  },
];

const travelGroups = [
  {
    title: "Yorktown and Newport News",
    time: "Typically 25–35 minutes",
    route: "Many guests come by Colonial Parkway or take I-64 to Route 199 before heading toward Powhatan Parkway.",
  },
  {
    title: "James City County, Toano, Norge, and Lightfoot",
    time: "Typically 10–25 minutes",
    route: "Common routes include Route 199, Richmond Road, and I-64 depending on where you are starting.",
  },
  {
    title: "New Town, Kingsmill, and Ford's Colony",
    time: "Typically 5–15 minutes",
    route: "Most patients use local roads toward Monticello Avenue and Powhatan Parkway for a short, direct trip.",
  },
];

const localIntentLinks = [
  { label: "Med spa near Yorktown", href: "/locations/yorktown-va" },
  { label: "Med spa near James City County", href: "/locations/james-city-county-va" },
  { label: "Med spa near Newport News", href: "/locations/newport-news-va" },
];

const locationFaqs = [
  {
    question: "Is Williamsburg Med Spa worth the drive from nearby cities?",
    answer:
      "Many patients travel in from nearby communities because they want a thoughtful consultation, natural-looking results, and a visit that feels personal rather than rushed.",
  },
  {
    question: "How long does it usually take to get to the Williamsburg clinic?",
    answer:
      "Typical drive times range from about 5 to 35 minutes from nearby service areas depending on the starting point, route, and traffic. Common routes include Colonial Parkway, I-64, Route 199, Richmond Road, Monticello Avenue, and Powhatan Parkway.",
  },
  {
    question: "Does Williamsburg Med Spa travel to patients?",
    answer:
      "Yes. Mobile Med Spa availability extends beyond these listed locations and can be arranged across Virginia. For parties, private events, and select special opportunities, destination travel may also be available worldwide by request.",
  },
];

export default function LocationsIndexPage() {
  return (
    <>
      <StructuredData type="Breadcrumb" breadCrumbs={["Home", "Locations"]} />
      <StructuredData type="FAQ" faqs={locationFaqs} />

      <Section tight labelledBy="locations-heading">
        <div className="max-w-3xl">
          <h1 id="locations-heading" className={H1}>Areas We Serve</h1>
          <p className={`mt-6 ${INTRO}`}>
            Our primary clinic is in Williamsburg, VA. Many patients visit us from nearby communities across James City
            County, the Peninsula, and surrounding neighborhoods because the trip feels worth it for thoughtful care,
            natural-looking results, and a visit planned around them.
          </p>
        </div>
      </Section>

      <Section labelledBy="why-make-the-trip">
        <SectionHeader
          id="why-make-the-trip"
          title="Why patients make the trip"
          intro={
            <>
              Williamsburg Med Spa is set up as a destination clinic, not a rushed stop. Patients often come in from
              nearby cities because they want clear recommendations, gentle aesthetic care, and enough time to make the
              visit feel intentional.
            </>
          }
        >
          <p className="mt-4 max-w-[62ch] text-base leading-relaxed text-base-content/75">
            If you would rather have us come to you, Mobile Med Spa is available not only in these locations, but across
            Virginia as well.
          </p>
        </SectionHeader>
      </Section>

      <Section labelledBy="travel-times">
        <SectionHeader
          id="travel-times"
          title="Typical travel times and routes"
          intro={
            <>
              Here are the routes many patients use when planning a visit to Williamsburg. Travel times are typical
              estimates and can vary with traffic.
            </>
          }
        />
        <div className={`${AFTER_HEADER} ${CARD_GRID}`}>
          {travelGroups.map((group) => (
            <div key={group.title} className={CARD}>
              <h3 className={CARD_TITLE}>{group.title}</h3>
              <p className="mt-3 text-sm font-medium text-secondary">{group.time}</p>
              <p className="mt-3 text-base leading-relaxed text-base-content/75">{group.route}</p>
            </div>
          ))}
        </div>
      </Section>

      <Section labelledBy="travel-to-you">
        <SectionHeader id="travel-to-you" title="If you want us to travel to you" />
        <div className="mt-6 max-w-[62ch] space-y-4 text-lg leading-relaxed text-base-content/80">
          <p>
            Mobile Med Spa is available well beyond the communities listed below. If traveling to Williamsburg is not the
            best fit, we can discuss appointments across Virginia.
          </p>
          <p>
            For parties, private events, and special opportunities, destination travel may also be available worldwide by
            request.
          </p>
        </div>
        <div className={`${AFTER_HEADER} ${BUTTON_ROW}`}>
          <Button asChild size="lg">
            <Link href="/consult">Ask About Mobile or Event Travel</Link>
          </Button>
          <Button asChild size="lg" variant="outline">
            <Link href="/locations/williamsburg-va">View Williamsburg Clinic Details</Link>
          </Button>
        </div>
      </Section>

      <Section labelledBy="closest-area">
        <SectionHeader
          id="closest-area"
          title="Start with the area closest to your route"
          intro="If you searched for a med spa near me, these local pages explain the practical route, visit timing, and treatment starting points before you book."
        />
        <div className={`${AFTER_HEADER} ${BUTTON_ROW}`}>
          {localIntentLinks.map((link) => (
            <Button key={link.href} asChild size="lg" variant="outline">
              <Link href={link.href}>{link.label}</Link>
            </Button>
          ))}
        </div>
      </Section>

      <Section labelledBy="nearby-communities">
        <SectionHeader
          id="nearby-communities"
          title="Nearby communities we regularly serve"
          intro={
            <>
              These are some of the local areas patients most often travel from when booking a visit to Williamsburg Med
              Spa.
            </>
          }
        />
        <div className={`${AFTER_HEADER} ${CARD_GRID_2}`}>
          {locations.map((location) => (
            <Link key={location.slug} href={`/locations/${location.slug}`} className={`${CARD} ${CARD_LINK}`}>
              <h2 className={CARD_TITLE}>{location.name}</h2>
              <p className="mt-3 text-base leading-relaxed text-base-content/75">{location.summary}</p>
            </Link>
          ))}
        </div>
      </Section>

      {/* The same locationFaqs array feeds the FAQPage schema above, so the visible answers and the schema stay identical. */}
      <Section labelledBy="location-faqs">
        <SectionHeader id="location-faqs" title="Questions" />
        <dl className={`${AFTER_HEADER} ${ROWS}`}>
          {locationFaqs.map(({ question, answer }) => (
            <div key={question} data-faq-question className={`${SPLIT} gap-y-3 border-b border-base-300 py-8`}>
              <dt className={`font-display text-2xl leading-snug text-base-content ${SPLIT_TEXT.wide}`}>{question}</dt>
              <dd className={`max-w-[62ch] text-base leading-relaxed text-base-content/85 ${SPLIT_MEDIA.wide}`}>{answer}</dd>
            </div>
          ))}
        </dl>
        <HomeOwnerLink className="mt-8" />
      </Section>
    </>
  );
}
