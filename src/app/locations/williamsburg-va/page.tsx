import type { Metadata } from "next";
import NAP from "components/nap";
import StructuredData from "components/structured-data";
import Link from "next/link";
import DirectionsButton from "components/directions-button";
import { Button } from "components/ui/button";

export const metadata: Metadata = {
  title: "Med Spa in Williamsburg, VA | Williamsburg Med Spa",
  description:
    "Williamsburg Med Spa — PRP therapies, fillers, and regenerative treatments in Williamsburg, VA. Full address, hours, directions, and services.",
  alternates: { canonical: "/locations/williamsburg-va" },
};

export default function WilliamsburgLocationPage() {
  return (
    <div className="max-w-xl md:max-w-7xl mx-auto md:px-8 py-12 md:py-16">
      <StructuredData type="LocalBusiness" />
      <StructuredData type="Breadcrumb" breadCrumbs={["Home", "Locations", "Williamsburg, VA"]} />
      <header className="mb-8 md:mb-12 text-center">
        <h1 className="text-3xl md:text-5xl font-light">Med Spa in Williamsburg, VA</h1>
        <p className="text-base md:text-lg text-base-content/70 mt-2">
          Visit our clinic for PRP therapies, fillers, and holistic aesthetic care.
        </p>
      </header>

      <section className="mb-10 md:mb-14">
        <NAP
          name="Williamsburg Med Spa"
          addressLines={["3900 Powhatan Parkway", "Williamsburg, VA 23188"]}
          phone={"+1 (804) 738-9483"}
          hours={["Mon–Fri 6:00pm–8:00pm", "Sat–Sun 10:00am–6:00pm"]}
          showMap={true}
          mapsQuery="3900 Powhatan Parkway, Williamsburg, VA 23188"
          latitude={37.2707}
          longitude={-76.7075}
        />
      </section>

      <section className="mb-10 md:mb-14">
        <h2 className="text-2xl md:text-3xl font-light mb-2">Parking & Directions</h2>
        <p className="text-base md:text-lg text-base-content/80 mb-3">
          We’re located near William & Mary and New Town with convenient on‑site parking. From Richmond Road, take
          Monticello Avenue toward New Town, then turn onto Powhatan Parkway. Our entrance is clearly marked; look for
          the Williamsburg Med Spa sign by the main lot.
        </p>
        <p className="text-base md:text-lg text-base-content/80">
          If you need accessibility assistance, call us when you arrive and we’ll be happy to help you into the clinic.
        </p>
      </section>

      <section className="mb-10 md:mb-14">
        <h2 className="text-2xl md:text-3xl font-light mb-2">Services</h2>
        <p className="text-base md:text-lg text-base-content/80 mb-4">
          Explore our core procedures and book a consultation.
        </p>
        <div className="flex flex-wrap gap-3">
          <Button asChild size="sm">
            <Link href="/procedures/filler">Fillers</Link>
          </Button>
          <Button asChild size="sm">
            <Link href="/procedures/joint-restoration">PRP for Joints</Link>
          </Button>
          <Button asChild size="sm">
            <Link href="/procedures/feminine-intimacy-prp-protocols">Feminine PRP</Link>
          </Button>
          <Button asChild size="sm">
            <Link href="/procedures/male-intimacy-prp-protocols">Male PRP</Link>
          </Button>
          <Button asChild size="sm">
            <Link href="/procedures/prp-facial">PRP Facial</Link>
          </Button>
          <Button asChild size="sm">
            <Link href="/procedures/blohmdahl-ear-piercing">Blohmdahl Ear Piercing</Link>
          </Button>
        </div>
      </section>

      <section className="mb-10 md:mb-14">
          <h2 className="text-2xl md:text-3xl font-light mb-2">Reviews</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <blockquote className="rounded-xl border border-base-300 p-4 text-base-content/90">
              + I felt heard and cared for. The PRP treatment was explained clearly and my results have been fantastic.
              <div className="mt-2 text-sm text-base-content/60">— Patient in Williamsburg</div>
            </blockquote>
            <blockquote className="rounded-xl border border-base-300 p-4 text-base-content/90">
              + Gentle and professional. My consultation was thorough and I love my natural‑looking outcome.
              <div className="mt-2 text-sm text-base-content/60">— PRP Facial Patient</div>
            </blockquote>
          </div>
        </section>

      <section className="mb-10 md:mb-14">
        <h2 className="text-2xl md:text-3xl font-light mb-2">Neighborhoods We Serve</h2>
        <p className="text-base md:text-lg text-base-content/80 mb-2">
          Williamsburg, James City County, Yorktown, Newport News, Toano, Norge, Lightfoot, New Town, Kingsmill, Ford’s Colony
        </p>
        <p className="text-sm md:text-base text-base-content/70">
          View all service areas on our <Link href="/locations" className="link link-primary">locations page</Link>.
        </p>
      </section>

      <section className="mb-10 md:mb-14">
        <h2 className="text-2xl md:text-3xl font-light mb-2">Questions</h2>
        <p className="text-base md:text-lg text-base-content/80 mb-4">
          Ready to get started? Book a consultation and we’ll help you choose the right treatment.
        </p>
        <div className="flex gap-3">
          <Button asChild>
            <Link href="/consult">Book a Consultation</Link>
          </Button>
          <DirectionsButton address="3900 Powhatan Parkway, Williamsburg, VA 23188" latitude={37.2707} longitude={-76.7075} />
        </div>
      </section>

      <StructuredData
        type="FAQ"
        faqs={[
          {
            question: "Where do I park?",
            answer:
              "Free on‑site parking is available directly in front of the clinic entrance on Powhatan Parkway.",
          },
          {
            question: "Do you accept walk‑ins?",
            answer:
              "Please book a consultation online or call ahead so we can prepare the right time and resources for your visit.",
          },
          {
            question: "What areas do you serve?",
            answer:
              "We serve Williamsburg, James City County, Yorktown, Newport News, Toano, Norge, Lightfoot, New Town, Kingsmill, and Ford’s Colony.",
          },
        ]}
      />
    </div>
  );
}
