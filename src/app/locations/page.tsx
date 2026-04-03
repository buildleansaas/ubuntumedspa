import type { Metadata } from "next";
import Link from "next/link";
import StructuredData from "components/structured-data";
import { Button } from "components/ui/button";
import { buildPageMetadata } from "lib/metadata";

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
    summary: "Our primary clinic with full PRP, filler, and aesthetic services in one destination visit.",
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
  {
    name: "Toano",
    slug: "toano-va",
    summary: "An easy trip from Toano for thoughtful consultations and restorative treatment planning.",
  },
  {
    name: "Norge",
    slug: "norge-va",
    summary: "Quick access along Richmond Road for nearby aesthetic and wellness visits.",
  },
  {
    name: "Lightfoot",
    slug: "lightfoot-va",
    summary: "Close for patients in Lightfoot who want a calm, destination-style appointment.",
  },
  {
    name: "New Town",
    slug: "new-town-va",
    summary: "A few minutes from New Town's shops and restaurants.",
  },
  {
    name: "Kingsmill",
    slug: "kingsmill-va",
    summary: "Close to Kingsmill's riverfront community.",
  },
  {
    name: "Ford's Colony",
    slug: "fords-colony-va",
    summary: "Nearby care for residents of Ford's Colony.",
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
    <div className="max-w-xl md:max-w-6xl mx-auto md:px-8 py-12 md:py-16">
      <StructuredData type="Breadcrumb" breadCrumbs={["Home", "Locations"]} />
      <StructuredData type="FAQ" faqs={locationFaqs} />
      <header className="mb-8 md:mb-10 text-center">
        <h1 className="text-3xl md:text-5xl font-light">Areas We Serve</h1>
        <p className="text-base md:text-lg text-base-content/70 mt-2 max-w-2xl mx-auto">
          Our primary clinic is in Williamsburg, VA. Many patients visit us from nearby communities across James City
          County, the Peninsula, and surrounding neighborhoods because the trip feels worth it for thoughtful care,
          natural-looking results, and a visit planned around them.
        </p>
      </header>

      <section className="rounded-2xl border border-base-300 bg-base-200 p-6 md:p-8 mb-8 md:mb-10">
        <h2 className="text-2xl md:text-3xl font-light">Why patients make the trip</h2>
        <p className="text-base md:text-lg text-base-content/80 mt-3 max-w-4xl">
          Williamsburg Med Spa is set up as a destination clinic, not a rushed stop. Patients often come in from nearby
          cities because they want clear recommendations, gentle aesthetic care, and enough time to make the visit feel
          intentional.
        </p>
        <p className="text-sm md:text-base text-base-content/70 mt-3 max-w-4xl">
          If you would rather have us come to you, Mobile Med Spa is available not only in these locations, but across
          Virginia as well.
        </p>
      </section>

      <section className="mb-10 md:mb-12">
        <div className="max-w-3xl">
          <h2 className="text-2xl md:text-3xl font-light">Typical travel times and routes</h2>
          <p className="text-base md:text-lg text-base-content/80 mt-2">
            Here are the routes many patients use when planning a visit to Williamsburg. Travel times are typical
            estimates and can vary with traffic.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6 mt-6">
          {travelGroups.map((group) => (
            <div key={group.title} className="rounded-xl border border-base-300 bg-base-100 p-5">
              <h3 className="text-lg font-semibold">{group.title}</h3>
              <p className="text-sm font-medium text-primary mt-2">{group.time}</p>
              <p className="text-sm text-base-content/80 mt-3">{group.route}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="rounded-2xl border border-base-300 p-6 md:p-8 mb-10 md:mb-12">
        <h2 className="text-2xl md:text-3xl font-light">If you want us to travel to you</h2>
        <p className="text-base md:text-lg text-base-content/80 mt-3 max-w-4xl">
          Mobile Med Spa is available well beyond the communities listed below. If traveling to Williamsburg is not the
          best fit, we can discuss appointments across Virginia.
        </p>
        <p className="text-base md:text-lg text-base-content/80 mt-3 max-w-4xl">
          For parties, private events, and special opportunities, destination travel may also be available worldwide by
          request.
        </p>
        <div className="flex flex-wrap gap-3 mt-6">
          <Button asChild>
            <Link href="/consult">Ask About Mobile or Event Travel</Link>
          </Button>
          <Button asChild variant="secondary">
            <Link href="/locations/williamsburg-va">View Williamsburg Clinic Details</Link>
          </Button>
        </div>
      </section>

      <section>
        <div className="max-w-3xl mb-4">
          <h2 className="text-2xl md:text-3xl font-light">Nearby communities we regularly serve</h2>
          <p className="text-base md:text-lg text-base-content/80 mt-2">
            These are some of the local areas patients most often travel from when booking a visit to Williamsburg Med
            Spa.
          </p>
        </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
        {locations.map((location) => (
          <Link
            key={location.slug}
            href={`/locations/${location.slug}`}
            className="block rounded-xl border border-base-300 p-4 hover:border-primary transition-colors text-left"
          >
            <h2 className="text-lg font-semibold mb-1">{location.name}</h2>
            <p className="text-sm text-base-content/80">{location.summary}</p>
          </Link>
        ))}
      </div>
      </section>
    </div>
  );
}
