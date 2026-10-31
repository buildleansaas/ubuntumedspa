import type { Metadata } from "next";
import Image from "next/image";

import StructuredData from "components/structured-data";
import { buildPageMetadata } from "lib/metadata";

export const metadata: Metadata = buildPageMetadata({
  title: "Jenny Coleman — Aesthetic Nurse Practitioner | Williamsburg Med Spa",
  description: "Learn about Jenny Coleman, MSN, RN, CPNP, PMHS — blending regenerative PRP therapies and evidence-based aesthetic care in Williamsburg, VA.",
  canonical: "/staff/jenny-coleman",
});

const CREDENTIALS = [
  "Master of Science in Nursing",
  "Registered Nurse",
  "Certified Pediatric Nurse Practitioner",
  "Pediatric Mental Health Specialist",
  "CMA-certified OH-Shot provider",
  "Certified Blomdahl provider",
] as const;

export default function JennyColemanPage() {
  return (
    <div className="mx-auto max-w-5xl py-14 md:py-20">
      <StructuredData type="Person" />
      <div className="grid items-start gap-8 md:grid-cols-[minmax(12rem,16rem)_minmax(0,1fr)] md:gap-14">
        <figure className="mx-auto w-full max-w-[16rem] md:mx-0">
          <div className="relative aspect-[4/5] overflow-hidden border border-base-300 bg-base-200">
            <Image
              src="/jenny.jpg"
              alt="Our aesthetic nurse practitioner"
              fill
              priority
              sizes="(max-width: 768px) 70vw, 256px"
              className="object-cover object-[center_18%]"
            />
          </div>
        </figure>
        <div className="max-w-2xl">
          <p className="eyebrow">Provider</p>
          <h1 className="mt-4 text-4xl leading-[1.1] tracking-tight text-base-content md:text-6xl">Jenny Coleman</h1>
          <p className="mt-4 text-lg text-base-content/85">MSN, RN, CPNP, PMHS</p>
          <ul className="mt-5 flex flex-wrap gap-2" aria-label="Jenny Coleman credentials and certifications">
            {CREDENTIALS.map((credential) => (
              <li key={credential} className="border border-base-300 px-3 py-1 text-sm text-base-content/85">
                {credential}
              </li>
            ))}
          </ul>
          <p className="mt-6 max-w-[65ch] text-base leading-relaxed text-base-content/85 md:text-lg">
            With over two decades in medicine and a specialized focus on aesthetics, Jenny blends primary care and mental
            health expertise with a holistic, patient‑first approach. She provides regenerative PRP therapies, advanced
            injection techniques, and practical wellness counseling to help patients look and feel their best — naturally.
          </p>
        </div>
      </div>
    </div>
  );
}
