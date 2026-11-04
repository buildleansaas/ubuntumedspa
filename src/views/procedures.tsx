import type { ReactNode } from "react";
import Link from "next/link";

import { ProcedureCard } from "components/procedure-card";
import { procedures } from "data";

type HeadingTag = "h1" | "h2";

const PROCEDURE_PRIORITY = [
  "botox",
  "xeomin",
  "blomdahl-ear-piercing",
  "prp-hair-restoration",
  "prp-facial",
  "microneedling-with-prp",
  "oh-shot",
  "pe-shot",
  "joint-restoration",
  "hyperhidrosis-treatment",
  "b12-injections",
];

function sortProcedures<T extends { slug: string }>(items: T[]) {
  return items.slice().sort((a, b) => {
    const ai = PROCEDURE_PRIORITY.indexOf(a.slug);
    const bi = PROCEDURE_PRIORITY.indexOf(b.slug);
    return (ai === -1 ? Number.MAX_SAFE_INTEGER : ai) - (bi === -1 ? Number.MAX_SAFE_INTEGER : bi);
  });
}

export default function Procedures({
  headingTag = "h2",
  variant = "default",
  featured = null,
  kicker = "Signature treatments",
  showBotoxAlternativeLink = false,
}: {
  headingTag?: HeadingTag;
  variant?: "default" | "editorial";
  featured?: ReactNode;
  kicker?: string;
  /** One internal link to the Botox-alternative page; off on the homepage, which already links it. */
  showBotoxAlternativeLink?: boolean;
}) {
  const Heading = headingTag;
  const visibleProcedures = sortProcedures(
    procedures.filter((procedure) => !("published" in procedure) || procedure.published !== false)
  );

  if (variant === "editorial") {
    return (
      <section className="scroll-mt-28 border-t border-base-300 py-16 md:py-24" id="services" aria-labelledby="home-procedures-heading">
        <div className="max-w-3xl">
          <p className="eyebrow">{kicker}</p>
          <Heading
            id="home-procedures-heading"
            className="font-display mt-4 text-4xl font-medium leading-[1.12] tracking-tight text-base-content md:text-5xl"
          >
            Medical Spa Treatments in Williamsburg, VA
          </Heading>
          <p className="mt-5 max-w-[65ch] text-base leading-relaxed text-base-content/85 md:text-lg">
            Compare Xeomin® (our wrinkle relaxer and a Botox® alternative), PRP treatments, microneedling with PRP, hyperhidrosis care, Blomdahl medical ear piercing for babies, children, teens, and adults, and vitamin B-12 injections. Each service page explains who the treatment may fit (including infants with pediatrician guidance), which goals it is commonly used for, and what to review during consultation.
          </p>
          {showBotoxAlternativeLink ? (
            <p className="mt-4 max-w-[65ch] text-base leading-relaxed text-base-content/85 md:text-lg">
              Looking for Botox in Williamsburg? We use Xeomin®, a wrinkle relaxer in the same category. See our{" "}
              <Link href="/procedures/botox" className="link link-primary">
                Botox alternative in Williamsburg
              </Link>
              .
            </p>
          ) : null}
        </div>

        {featured ? <div className="mt-12">{featured}</div> : null}

        <div className="mt-14 grid grid-cols-1 gap-x-8 gap-y-14 sm:grid-cols-2 xl:grid-cols-3">
          {visibleProcedures.map((procedure) => (
            <ProcedureCard key={procedure.slug} tone="editorial" product={{ ...procedure, slug: procedure.slug }} />
          ))}
        </div>
      </section>
    );
  }

  return (
    <>
      <div className="text-center" id="services">
        <Heading className="text-4xl/snug sm:text-5xl/snug md:text-6xl/snug font-light mx-auto leading-tight pb-4">
          Medical Spa Treatments in Williamsburg, VA
        </Heading>
        <p className="text-lg lg:text-xl mb-8 max-w-5xl mx-auto">
          Compare Xeomin® (our wrinkle relaxer and a Botox® alternative), PRP treatments, microneedling with PRP, hyperhidrosis care, Blomdahl medical ear piercing for babies, children, teens, and adults, and vitamin B-12 injections. Each service page explains who the treatment may fit (including infants with pediatrician guidance), which goals it is commonly used for, and what to review during consultation.
        </p>
      </div>

      <div className="grid gap-8 lg:gap-10 mt-8 lg:my-12 xl:my-16 grid-cols-1 sm:grid-cols-2  lg:grid-cols-4">
        {visibleProcedures.map((procedure) => (
          <ProcedureCard key={procedure.slug} product={{ ...procedure, slug: procedure.slug }} />
        ))}
      </div>
    </>
  );
}
