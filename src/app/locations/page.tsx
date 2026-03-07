import type { Metadata } from "next";
import Link from "next/link";
import StructuredData from "components/structured-data";
import { buildPageMetadata } from "lib/metadata";

export const metadata: Metadata = buildPageMetadata({
  title: "Med Spa Locations Near Williamsburg, VA | Williamsburg Med Spa",
  description: "Explore Williamsburg Med Spa's primary Williamsburg location and nearby areas served, including James City County, Yorktown, Newport News, Toano, Norge, Lightfoot, New Town, Kingsmill, and Ford's Colony.",
  canonical: "/locations",
});

const locations = [
  {
    name: "Williamsburg, VA (Primary Clinic)",
    slug: "williamsburg-va",
    summary: "Our main clinic with full PRP, filler, and aesthetic services.",
  },
  {
    name: "James City County",
    slug: "james-city-county-va",
    summary: "Serving neighborhoods across James City County.",
  },
  {
    name: "Yorktown",
    slug: "yorktown-va",
    summary: "Convenient for patients traveling over the river from Yorktown.",
  },
  {
    name: "Newport News",
    slug: "newport-news-va",
    summary: "A nearby option for Newport News residents seeking regenerative PRP and aesthetic care.",
  },
  {
    name: "Toano",
    slug: "toano-va",
    summary: "Short drive from upper James City County and Toano.",
  },
  {
    name: "Norge",
    slug: "norge-va",
    summary: "Easy access along Richmond Road from Norge.",
  },
  {
    name: "Lightfoot",
    slug: "lightfoot-va",
    summary: "Serving Lightfoot shopping and residential areas.",
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

export default function LocationsIndexPage() {
  return (
    <div className="max-w-xl md:max-w-6xl mx-auto md:px-8 py-12 md:py-16">
      <StructuredData type="Breadcrumb" breadCrumbs={["Home", "Locations"]} />
      <header className="mb-8 md:mb-10 text-center">
        <h1 className="text-3xl md:text-5xl font-light">Areas We Serve</h1>
        <p className="text-base md:text-lg text-base-content/70 mt-2 max-w-2xl mx-auto">
          Our primary clinic is in Williamsburg, VA. Many patients visit us from nearby communities across James City
          County, the Peninsula, and surrounding neighborhoods.
        </p>
      </header>

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
    </div>
  );
}

