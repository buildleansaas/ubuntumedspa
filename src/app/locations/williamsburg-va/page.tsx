import type { Metadata } from "next";
import NAP from "components/nap";
import StructuredData from "components/structured-data";
import Link from "next/link";
import DirectionsButton from "components/directions-button";
import { Button } from "components/ui/button";
import { buildPageMetadata } from "lib/metadata";

export const metadata: Metadata = buildPageMetadata({
  title: "Medical Spa in Williamsburg, VA | Hours, Directions & Services",
  description:
    "Visit Williamsburg Med Spa for Botox, Xeomin, dermal fillers, PRP treatments, hyperhidrosis care, and Blomdahl medical ear piercing at 3900 Powhatan Parkway.",
  canonical: "/locations/williamsburg-va",
});

export default function WilliamsburgLocationPage() {
  return (
    <div className="max-w-xl md:max-w-7xl mx-auto md:px-8 py-12 md:py-16">
      <StructuredData type="LocalBusiness" />
      <StructuredData type="Breadcrumb" breadCrumbs={["Home", "Locations", "Williamsburg, VA"]} />
      <header className="mb-8 md:mb-12 text-center">
        <h1 className="text-3xl md:text-5xl font-light">Visit Our Williamsburg Clinic</h1>
        <p className="text-base md:text-lg text-base-content/70 mt-2">
          Use this page for clinic hours, parking, directions, and nearby neighborhoods served. Patients visit Jenny
          Coleman for Botox, Xeomin, dermal fillers, PRP treatments, hyperhidrosis care, and Blomdahl medical ear
          piercing. If you&apos;re comparing treatments, start with our{" "}
          <Link href="/" className="link link-primary">
            medical spa homepage
          </Link>
          {" "}and procedure pages.
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
          We&apos;re located near New Town and William & Mary with convenient on-site parking. From Richmond Road, take
          Monticello Avenue toward New Town, then turn onto Powhatan Parkway. Our entrance is clearly marked, and the
          main lot sits directly outside the clinic.
        </p>
        <p className="text-base md:text-lg text-base-content/80">
          If you need accessibility assistance, call when you arrive and we&apos;ll help you into the clinic.
        </p>
      </section>

      <section className="mb-10 md:mb-14">
        <h2 className="text-2xl md:text-3xl font-light mb-2">Popular Treatment Pages</h2>
        <p className="text-base md:text-lg text-base-content/80 mb-4">
          Review the services Williamsburg patients most often ask about before scheduling with Jenny.
        </p>
        <div className="flex flex-wrap gap-3">
          <Button asChild size="sm">
            <Link href="/procedures/botox">Botox</Link>
          </Button>
          <Button asChild size="sm">
            <Link href="/procedures/xeomin">Xeomin</Link>
          </Button>
          <Button asChild size="sm">
            <Link href="/procedures/filler">Dermal Fillers</Link>
          </Button>
          <Button asChild size="sm">
            <Link href="/procedures/prp-facial">PRP Facial</Link>
          </Button>
          <Button asChild size="sm">
            <Link href="/procedures/prp-hair-restoration">PRP Hair Restoration</Link>
          </Button>
          <Button asChild size="sm">
            <Link href="/procedures/blomdahl-ear-piercing">Medical Ear Piercing</Link>
          </Button>
          <Button asChild size="sm" variant="secondary">
            <Link href="/procedures/blomdahl-ear-piercing/near/williamsburg-va">Ear Piercing Near Williamsburg</Link>
          </Button>
          <Button asChild size="sm">
            <Link href="/procedures/hyperhidrosis-treatment">Hyperhidrosis Treatment</Link>
          </Button>
          <Button asChild size="sm">
            <Link href="/consult">Book a Consultation</Link>
          </Button>
        </div>
      </section>

      <section className="mb-10 md:mb-14">
        <h2 className="text-2xl md:text-3xl font-light mb-2">Before Your Visit</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-base md:text-lg text-base-content/80">
          <div className="rounded-xl border border-base-300 p-4">
            Plan to arrive a few minutes early so we can review your goals, medical history, and any questions before the
            appointment starts.
          </div>
          <div className="rounded-xl border border-base-300 p-4">
            For ear-piercing visits or family appointments, feel free to call ahead if you want help choosing timing,
            aftercare supplies, or what to bring.
          </div>
        </div>
      </section>

      <section className="mb-10 md:mb-14">
        <h2 className="text-2xl md:text-3xl font-light mb-2">Neighborhoods We Serve</h2>
        <p className="text-base md:text-lg text-base-content/80 mb-2">
          Williamsburg, James City County, Yorktown, Newport News, Toano, Norge, Lightfoot, New Town, Kingsmill,
          Ford&apos;s Colony
        </p>
        <p className="text-sm md:text-base text-base-content/70 mb-2">
          If you searched for a medical spa near Williamsburg, VA, the most relevant starting points are{" "}
          <Link href="/procedures/filler" className="link link-primary">
            dermal fillers
          </Link>
          ,{" "}
          <Link href="/procedures/botox" className="link link-primary">
            Botox
          </Link>
          , and{" "}
          <Link href="/procedures/blomdahl-ear-piercing" className="link link-primary">
            Blomdahl ear piercing
          </Link>
          .
        </p>
        <p className="text-sm md:text-base text-base-content/70">
          View all service areas on our{" "}
          <Link href="/locations" className="link link-primary">
            locations page
          </Link>
          .
        </p>
      </section>

      <section className="mb-10 md:mb-14">
        <h2 className="text-2xl md:text-3xl font-light mb-2">Ready to Book?</h2>
        <p className="text-base md:text-lg text-base-content/80 mb-4">
          Book a consultation if you want help choosing the right treatment, or open directions if you already have an
          appointment scheduled.
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
            question: "Where is Williamsburg Med Spa located?",
            answer:
              "Our clinic is located at 3900 Powhatan Parkway, Williamsburg, VA 23188, with on-site parking directly outside the entrance.",
          },
          {
            question: "Where do I park?",
            answer:
              "Free on-site parking is available directly in front of the clinic entrance on Powhatan Parkway.",
          },
          {
            question: "What are your clinic hours?",
            answer:
              "Current hours are Monday through Friday from 6:00pm to 8:00pm and Saturday through Sunday from 10:00am to 6:00pm.",
          },
          {
            question: "Do you accept walk-ins?",
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
