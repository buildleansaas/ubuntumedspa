import type { Metadata } from "next";
import DirectionsButton from "components/directions-button";
import NAP from "components/nap";
import StructuredData from "components/structured-data";
import { Button } from "components/ui/button";
import { buildPageMetadata } from "lib/metadata";
import Link from "next/link";

export const metadata: Metadata = buildPageMetadata({
  title: "Med Spa Near James City County, VA | Fillers, Botox, PRP & Piercing",
  description:
    "Compare consultation-led Botox, Xeomin, fillers, PRP hair restoration, hyperhidrosis care, and Blomdahl ear piercing near James City County, VA.",
  canonical: "/locations/james-city-county-va",
});

const neighborhoods = ["Norge", "Toano", "Lightfoot", "Greensprings", "New Town", "Kingsmill", "Ford's Colony"];

const serviceLinks = [
  {
    href: "/procedures/botox",
    label: "Botox",
    note: "Start here for movement-related forehead lines, frown lines, and crow's-feet questions.",
  },
  {
    href: "/procedures/xeomin",
    label: "Xeomin",
    note: "Compare another consultation-led wrinkle-relaxer option for facial movement concerns.",
  },
  {
    href: "/procedures/filler",
    label: "Dermal fillers",
    note: "Review lip, cheek, under-eye, smile-line, and facial-balance starting points.",
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
    href: "/procedures/blomdahl-ear-piercing/near/james-city-county-va",
    label: "Blomdahl medical ear piercing",
    note: "Plan a nurse-led piercing visit with sterile single-use cassettes and aftercare guidance.",
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
      "Book a consultation first. Jenny Coleman reviews your goals, relevant health history, timing, and treatment options before recommending a reasonable next step.",
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
    <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6 md:py-16 lg:px-8">
      <StructuredData type="Breadcrumb" breadCrumbs={["Home", "Locations", "James City County"]} />
      <StructuredData type="FAQ" faqs={faqs} />

      <header className="grid gap-8 border-b border-base-300 pb-10 lg:grid-cols-[minmax(0,1.1fr)_minmax(320px,0.9fr)] lg:items-end">
        <div>
          <p className="mb-3 text-xs font-semibold uppercase tracking-[0.22em] text-primary">James City County service area</p>
          <h1 className="max-w-3xl text-4xl font-light leading-tight sm:text-5xl">Med Spa Near James City County, VA</h1>
          <p className="mt-5 max-w-3xl text-lg leading-relaxed text-base-content/75">
            Compare consultation-led Botox, Xeomin, dermal fillers, PRP hair restoration, hyperhidrosis care, and Blomdahl
            medical ear piercing at the Williamsburg clinic near New Town.
          </p>
          <p className="mt-4 max-w-3xl leading-relaxed text-base-content/75">
            Your best first visit depends on what you want to improve. Start with a specific treatment page when you know
            your concern, or book a consultation when you want Jenny Coleman to help you compare options.
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            <Button asChild>
              <Link href="/consult?utm_source=website&utm_medium=location_page&utm_campaign=james_city_county">Book a Consultation</Link>
            </Button>
            <DirectionsButton address="3900 Powhatan Parkway, Williamsburg, VA 23188" latitude={37.2707} longitude={-76.7075} />
          </div>
        </div>

        <aside className="border-y border-base-300 py-5" aria-label="Williamsburg clinic at a glance">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-primary">Williamsburg clinic at a glance</p>
          <dl className="mt-4 divide-y divide-base-300 text-sm">
            <div className="grid gap-1 py-3 sm:grid-cols-[6rem_1fr]">
              <dt className="font-medium text-base-content">Address</dt>
              <dd className="text-base-content/70">3900 Powhatan Parkway, Williamsburg, VA 23188</dd>
            </div>
            <div className="grid gap-1 py-3 sm:grid-cols-[6rem_1fr]">
              <dt className="font-medium text-base-content">Access</dt>
              <dd className="text-base-content/70">Near New Town, with approaches from Route 199, Monticello Avenue, and Richmond Road.</dd>
            </div>
            <div className="grid gap-1 py-3 sm:grid-cols-[6rem_1fr]">
              <dt className="font-medium text-base-content">Hours</dt>
              <dd className="text-base-content/70">Mon–Fri 6:00pm–8:00pm; Sat–Sun 10:00am–6:00pm</dd>
            </div>
          </dl>
        </aside>
      </header>

      <section className="border-b border-base-300 py-10" aria-labelledby="jcc-treatment-starting-points">
        <div className="max-w-3xl">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-primary">Treatment guide</p>
          <h2 id="jcc-treatment-starting-points" className="mt-2 text-3xl font-light sm:text-4xl">
            Choose the right treatment starting point
          </h2>
          <p className="mt-4 leading-relaxed text-base-content/75">
            Use these starting points to compare what each service may address, candidacy considerations, pricing where
            published, and the right next booking step for your concern.
          </p>
        </div>
        <div className="mt-7 grid border-y border-base-300 md:grid-cols-2">
          {serviceLinks.map((service, index) => (
            <Link
              key={service.href}
              href={service.href}
              className={`group block py-5 transition-colors hover:bg-base-200/35 md:px-5 ${index % 2 === 0 ? "md:border-r md:border-base-300" : ""} ${index < serviceLinks.length - 2 ? "border-b border-base-300" : ""}`}
            >
              <span className="font-medium text-base-content underline-offset-4 group-hover:underline">{service.label}</span>
              <p className="mt-2 text-sm leading-relaxed text-base-content/70">{service.note}</p>
            </Link>
          ))}
        </div>
        <Link href="/procedures" className="mt-5 inline-block text-sm font-medium text-primary underline underline-offset-4">
          View all procedures
        </Link>
      </section>

      <section className="border-b border-base-300 py-10" aria-labelledby="jcc-visit-reasons">
        <div className="max-w-3xl">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-primary">What to expect</p>
          <h2 id="jcc-visit-reasons" className="mt-2 text-3xl font-light sm:text-4xl">
            Consultation-led care close to James City County
          </h2>
        </div>
        <div className="mt-7 grid gap-7 md:grid-cols-3">
          <div>
            <h3 className="font-medium text-base-content">A clear first decision</h3>
            <p className="mt-2 text-sm leading-relaxed text-base-content/70">
              Jenny reviews your goal, health history, timing, alternatives, and aftercare before you commit to a treatment path.
            </p>
          </div>
          <div>
            <h3 className="font-medium text-base-content">Direct service guidance</h3>
            <p className="mt-2 text-sm leading-relaxed text-base-content/70">
              Treatment pages explain what each service may address, what it cannot promise, and whether consultation comes first.
            </p>
          </div>
          <div>
            <h3 className="font-medium text-base-content">Practical arrival</h3>
            <p className="mt-2 text-sm leading-relaxed text-base-content/70">
              The clinic is near New Town with on-site parking. Current routing is available through the directions button.
            </p>
          </div>
        </div>
        <p className="mt-7 text-sm leading-relaxed text-base-content/70">
          Nearby communities include {neighborhoods.join(", ")}. Visit times vary by starting point and traffic, so use current
          directions when planning your appointment.
        </p>
      </section>

      <section className="border-b border-base-300 py-10" aria-labelledby="jcc-plan-visit">
        <div className="mb-7 max-w-3xl">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-primary">Plan your visit</p>
          <h2 id="jcc-plan-visit" className="mt-2 text-3xl font-light sm:text-4xl">
            Williamsburg clinic details
          </h2>
          <p className="mt-4 leading-relaxed text-base-content/75">
            Confirm the address, hours, phone number, parking, and current route before leaving James City County.
          </p>
        </div>
        <NAP
          name="Williamsburg Med Spa"
          addressLines={["3900 Powhatan Parkway", "Williamsburg, VA 23188"]}
          phone="+1 (804) 738-9483"
          hours={["Mon–Fri 6:00pm–8:00pm", "Sat–Sun 10:00am–6:00pm"]}
          showMap={true}
          mapsQuery="3900 Powhatan Parkway, Williamsburg, VA 23188"
          latitude={37.2707}
          longitude={-76.7075}
        />
      </section>

      <section className="border-b border-base-300 py-10" aria-labelledby="jcc-faqs">
        <div className="max-w-3xl">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-primary">Common questions</p>
          <h2 id="jcc-faqs" className="mt-2 text-3xl font-light sm:text-4xl">
            James City County med spa visit FAQs
          </h2>
        </div>
        <div className="mt-6 divide-y divide-base-300 border-y border-base-300">
          {faqs.map((faq) => (
            <details key={faq.question} className="group py-5">
              <summary className="cursor-pointer list-none pr-8 font-medium text-base-content marker:content-none">
                {faq.question}
              </summary>
              <p className="mt-3 max-w-3xl leading-relaxed text-base-content/70">{faq.answer}</p>
            </details>
          ))}
        </div>
      </section>

      <section className="py-10 text-center" aria-labelledby="jcc-final-cta">
        <h2 id="jcc-final-cta" className="text-3xl font-light sm:text-4xl">
          Choose your next step
        </h2>
        <p className="mx-auto mt-4 max-w-2xl leading-relaxed text-base-content/75">
          Review the treatment page that matches your concern, or book a consultation when you want help comparing options.
        </p>
        <div className="mt-6 flex flex-wrap justify-center gap-3">
          <Button asChild>
            <Link href="/consult?utm_source=website&utm_medium=location_page&utm_campaign=james_city_county">Book a Consultation</Link>
          </Button>
          <Button asChild variant="secondary">
            <Link href="/locations/williamsburg-va">Williamsburg Location Details</Link>
          </Button>
        </div>
      </section>
    </div>
  );
}
