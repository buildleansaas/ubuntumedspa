import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";

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
          <div className="mt-6 max-w-[65ch] space-y-4 text-base leading-relaxed text-base-content/85 md:text-lg">
            <p>
              Jenny Coleman, MSN, RN, CPNP, PMHS, is the nurse practitioner at Williamsburg Med Spa, 3900 Powhatan
              Parkway, Williamsburg, VA 23188. She has 26 years in medicine and six years dedicated to aesthetics. That
              background includes a Master of Science in Nursing, registered nursing, certified pediatric nurse
              practitioner practice, and pediatric mental health.
            </p>
            <p>
              Jenny is a Cellular Medicine Association-certified OH-Shot provider and a certified Blomdahl provider. At
              the Williamsburg clinic she plans Botox, Xeomin, dermal fillers, PRP treatments, hyperhidrosis care, and
              Blomdahl medical ear piercing.{" "}
              <Link href="/procedures/oh-shot" className="link link-primary">
                OH-Shot
              </Link>{" "}
              visits stay on the OH-Shot page. Ear piercing visits, including babies generally 6 months or older with
              pediatrician guidance, stay on the{" "}
              <Link href="/procedures/blomdahl-ear-piercing" className="link link-primary">
                Blomdahl ear piercing page
              </Link>
              .
            </p>
            <p>
              Patients visit from Williamsburg, James City County, Yorktown, Newport News, Toano, Norge, Lightfoot, New
              Town, Kingsmill, and Ford&apos;s Colony. Appointments start with a consultation so the plan matches the
              concern, the medical history, and a conservative, natural-looking goal. The clinic phone number is (804)
              738-9483, and the{" "}
              <Link href="/consult" className="link link-primary">
                consultation form
              </Link>{" "}
              is the way to request a time. Hours and parking are on the{" "}
              <Link href="/locations/williamsburg-va" className="link link-primary">
                Williamsburg location page
              </Link>
              .
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
