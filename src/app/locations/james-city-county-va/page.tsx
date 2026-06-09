import type { Metadata } from "next";
import StructuredData from "components/structured-data";
import Link from "next/link";
import DirectionsButton from "components/directions-button";
import { Button } from "components/ui/button";
import { buildPageMetadata } from "lib/metadata";

export const metadata: Metadata = buildPageMetadata({
  title: "Med Spa Near James City County, VA | Fillers, Botox, PRP & Piercing",
  description:
    "Williamsburg Med Spa serves James City County with Botox, Xeomin, dermal fillers, PRP, hyperhidrosis care, and Blomdahl medical ear piercing near New Town.",
  canonical: "/locations/james-city-county-va",
});

const neighborhoods = ["Norge", "Toano", "Lightfoot", "Greensprings", "New Town", "Kingsmill", "Ford's Colony"];

const serviceLinks = [
  { href: "/procedures/filler/near/james-city-county-va", label: "Dermal fillers near James City County", note: "Natural contouring for lips, cheeks, under-eyes, and facial balance." },
  { href: "/procedures/botox/near/james-city-county-va", label: "Botox near James City County", note: "Consultation-led wrinkle treatment for movement-related lines." },
  { href: "/procedures/xeomin/near/james-city-county-va", label: "Xeomin near James City County", note: "A purified neuromodulator option for frown lines and facial movement." },
  { href: "/procedures/blomdahl-ear-piercing/near/james-city-county-va", label: "Medical ear piercing near James City County", note: "Sterile Blomdahl piercing with hypoallergenic starter jewelry." },
];

export default function JamesCityCountyPage() {
  return (
    <div className="max-w-xl md:max-w-6xl mx-auto md:px-8 py-12 md:py-16">
      <StructuredData type="Breadcrumb" breadCrumbs={["Home", "Locations", "James City County"]} />
      <header className="mb-8 md:mb-10 text-center max-w-3xl mx-auto">
        <p className="text-sm uppercase tracking-[0.22em] text-primary mb-3">James City County service area</p>
        <h1 className="text-3xl md:text-5xl font-light">Med Spa Near James City County, VA</h1>
        <p className="text-base md:text-lg text-base-content/70 mt-3">
          A short, practical drive to Williamsburg Med Spa for injectables, PRP, hyperhidrosis treatment, and medical ear
          piercing near New Town, William & Mary, and surrounding James City County neighborhoods.
        </p>
      </header>

      <section className="grid gap-5 md:grid-cols-[1.2fr_0.8fr] mb-10 md:mb-12">
        <div className="prose prose-neutral max-w-none text-base-content/90">
          <p>
            If you live in James City County and search for a med spa near me, the nearest useful page should answer more
            than where the clinic is. It should help you decide whether you need an injectable consultation, PRP
            discussion, ear-piercing appointment, or a visit focused on sweating, skin texture, or facial balance.
          </p>
          <p>
            Williamsburg Med Spa is located at 3900 Powhatan Parkway, close to New Town and easy to reach from Route 199.
            Jenny Coleman keeps visits consultation-led, with clear explanations of risks, benefits, timing, aftercare,
            and whether a treatment is a reasonable fit.
          </p>
        </div>
        <aside className="rounded-2xl border border-base-300 bg-base-100 p-5 shadow-sm">
          <h2 className="text-xl font-light mb-3">Nearby communities served</h2>
          <div className="flex flex-wrap gap-2">
            {neighborhoods.map((name) => (
              <span key={name} className="rounded-full border border-base-300 px-3 py-1 text-sm text-base-content/75">
                {name}
              </span>
            ))}
          </div>
          <p className="mt-4 text-sm text-base-content/70">
            Patients usually come via Monticello Avenue, Route 199, or Richmond Road depending on where they are starting.
          </p>
        </aside>
      </section>

      <section className="mb-10 md:mb-12">
        <h2 className="text-2xl md:text-3xl font-light mb-4">Procedure-Specific Local Starting Points</h2>
        <div className="grid gap-4 md:grid-cols-2">
          {serviceLinks.map((service) => (
            <Link key={service.href} href={service.href} className="rounded-2xl border border-base-300 p-5 transition hover:border-primary/50 hover:bg-base-200/40">
              <span className="font-medium text-base-content">{service.label}</span>
              <p className="mt-2 text-sm text-base-content/70">{service.note}</p>
            </Link>
          ))}
        </div>
      </section>

      <section className="mb-10 md:mb-12 grid gap-5 md:grid-cols-2">
        <div className="rounded-2xl border border-base-300 p-5">
          <h2 className="text-2xl md:text-3xl font-light mb-3">Good Reasons to Visit</h2>
          <ul className="space-y-2 text-base-content/80">
            <li>You want subtle injectable work that starts with a medical consultation.</li>
            <li>You want PRP questions answered before committing to a treatment path.</li>
            <li>You want Blomdahl medical ear piercing instead of a mall-style piercing visit.</li>
            <li>You want a Williamsburg clinic with clear parking and appointment-based care.</li>
          </ul>
        </div>
        <div>
          <h2 className="text-2xl md:text-3xl font-light mb-3">Getting Here</h2>
          <ol className="space-y-3 text-base-content/80 list-decimal pl-5">
            <li>Take Route 199, Monticello Avenue, or Richmond Road toward New Town.</li>
            <li>Turn onto Powhatan Parkway near the clinic complex.</li>
            <li>Park in the main lot outside Williamsburg Med Spa.</li>
          </ol>
        </div>
      </section>

      <section className="mb-10 md:mb-12 rounded-2xl border border-base-300 p-5 md:p-6">
        <h2 className="text-2xl md:text-3xl font-light mb-3">Plan the Right First Visit</h2>
        <p className="text-base md:text-lg text-base-content/80 mb-4">
          For injectable questions, start with Botox, Xeomin, or filler pages tied to James City County intent. For family
          ear-piercing questions, use the medical ear-piercing local page. If you mainly need hours, parking, and clinic
          details, open the Williamsburg location page before booking.
        </p>
        <div className="flex flex-wrap gap-3">
          <Button asChild size="sm"><Link href="/consult">Book a Consultation</Link></Button>
          <Button asChild size="sm" variant="secondary"><Link href="/locations/williamsburg-va">Williamsburg Location Details</Link></Button>
          <DirectionsButton size="sm" address="3900 Powhatan Parkway, Williamsburg, VA 23188" latitude={37.2707} longitude={-76.7075} />
        </div>
      </section>
    </div>
  );
}
