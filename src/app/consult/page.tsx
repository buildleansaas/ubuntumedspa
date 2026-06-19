import type { Metadata } from "next";
import Link from "next/link";

import StructuredData from "components/structured-data";
import ConsultationForm from "./consult-form";
import { buildPageMetadata } from "lib/metadata";

export const metadata: Metadata = buildPageMetadata({
  title: "Book a Med Spa Consultation in Williamsburg, VA",
  description:
    "Request a consultation with Williamsburg Med Spa for Botox, Xeomin, fillers, PRP, hyperhidrosis care, or Blomdahl ear piercing in Williamsburg, VA.",
  canonical: "/consult",
});

const consultationPaths = [
  "Botox, Xeomin, and subtle wrinkle-relaxer planning",
  "Dermal filler conversations for lips, cheeks, smile lines, or facial balance",
  "PRP facial, PRP Face Lift, PRP hair restoration, and other regenerative options",
  "Hyperhidrosis care for underarm, palm, foot, or localized sweating patterns",
  "Blomdahl medical ear piercing for children, teens, adults, and re-piercing",
];

const nearbyAreas = ["Williamsburg", "James City County", "Yorktown", "Newport News", "Toano", "Norge"];

export default function ConsultationPage() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 md:py-16 lg:px-8">
      <StructuredData type="Breadcrumb" breadCrumbs={["Home", "Consult"]} />
      <section className="grid gap-8 border-b border-base-300 pb-10 lg:grid-cols-[minmax(0,0.95fr)_minmax(360px,1.05fr)] lg:items-start">
        <div>
          <p className="mb-3 text-sm font-semibold uppercase tracking-[0.18em] text-primary">Williamsburg consultation</p>
          <h1 className="max-w-4xl text-4xl font-light leading-tight tracking-tight text-base-content sm:text-5xl md:text-6xl">
            Book a med spa consultation in Williamsburg, VA
          </h1>
          <p className="mt-5 max-w-3xl text-lg leading-relaxed text-base-content/75 md:text-xl">
            Start here if you want help choosing between injectables, PRP, hyperhidrosis care, intimate wellness,
            or medical ear piercing with Williamsburg Med Spa.
          </p>
          <p className="mt-4 max-w-3xl text-base leading-relaxed text-base-content/65">
            Jenny Coleman reviews your goals, medical history, candidacy, risk factors, timing, and next steps before
            recommending a treatment plan. If a service is not the right fit, the consultation should make that clear too.
          </p>

          <div className="mt-7 grid gap-3 sm:grid-cols-2">
            {[
              ["Consult-first", "No one-size-fits-all treatment plan."],
              ["Local", "Serving Williamsburg, JCC, Yorktown, Newport News, and nearby areas."],
              ["Clear next step", "Submit the form, then choose a scheduling time when prompted."],
              ["Private intake", "Share the concerns you want Jenny to review before the visit."],
            ].map(([title, copy]) => (
              <div key={title} className="rounded-2xl border border-base-300 bg-base-100 p-4">
                <p className="font-semibold text-base-content">{title}</p>
                <p className="mt-1 text-sm leading-6 text-base-content/65">{copy}</p>
              </div>
            ))}
          </div>
        </div>

        <ConsultationForm />
      </section>

      <section className="grid gap-8 border-b border-base-300 py-10 lg:grid-cols-[0.9fr_1.1fr]">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.18em] text-base-content/55">What this visit helps with</p>
          <h2 className="mt-3 text-3xl font-light leading-tight text-base-content md:text-4xl">
            Use the consult to pick the right first step, not to guess from a menu.
          </h2>
          <p className="mt-4 text-base leading-relaxed text-base-content/70">
            Many patients arrive comparing multiple options. The goal is to match your concern to the safest useful path,
            whether that is treatment at Williamsburg Med Spa, staged planning, home care, or referral.
          </p>
        </div>
        <div className="grid gap-3">
          {consultationPaths.map((path) => (
            <div key={path} className="flex gap-3 rounded-2xl border border-base-300 bg-base-100 p-4">
              <span className="mt-1 h-2.5 w-2.5 shrink-0 rounded-full bg-primary" />
              <p className="text-base leading-7 text-base-content/75">{path}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="grid gap-8 py-10 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <h2 className="text-3xl font-light text-base-content">Before you submit</h2>
          <div className="mt-5 grid gap-4 md:grid-cols-3">
            {[
              ["1", "Choose interests", "Pick every service family you want to discuss so the team can prepare."],
              ["2", "Add context", "Mention goals, timing, prior treatment, sensitivities, or what you are unsure about."],
              ["3", "Schedule", "After submission, you will be routed toward scheduling or follow-up next steps."],
            ].map(([step, title, copy]) => (
              <div key={step} className="rounded-2xl border border-base-300 bg-base-100 p-5">
                <p className="text-sm font-semibold text-primary">Step {step}</p>
                <h3 className="mt-2 text-lg font-semibold text-base-content">{title}</h3>
                <p className="mt-2 text-sm leading-6 text-base-content/65">{copy}</p>
              </div>
            ))}
          </div>
        </div>
        <aside className="rounded-2xl border border-base-300 bg-base-100 p-5">
          <p className="font-semibold text-base-content">Nearby patients commonly visit from:</p>
          <div className="mt-4 flex flex-wrap gap-2">
            {nearbyAreas.map((area) => (
              <span key={area} className="rounded-full border border-base-300 px-3 py-1.5 text-sm text-base-content/70">
                {area}
              </span>
            ))}
          </div>
          <p className="mt-5 text-sm leading-6 text-base-content/65">
            Want to compare service pages first? Start with <Link href="/procedures" className="font-medium text-primary hover:underline">all procedures</Link> or the <Link href="/locations/williamsburg-va" className="font-medium text-primary hover:underline">Williamsburg location guide</Link>.
          </p>
        </aside>
      </section>

      <p className="border-t border-base-300 pt-6 text-center text-sm text-base-content/60">
        Treatment recommendations depend on your history, examination, and goals. Outcomes vary by patient.
      </p>
    </div>
  );
}
