import type { ReactNode } from "react";
import Link from "next/link";

import { ProcedureCard } from "components/procedure-card";
import { procedures } from "data";
import { humanizeMedicalCopy } from "lib/humanize";

// Same set as the procedure cards' CMA "Certified" tag.
const CMA_CERTIFIED_PROCEDURE_SLUGS = new Set([
  "oh-shot",
  "pe-shot",
  "prp-breast-lift",
  "prp-hair-restoration",
  "prp-facial",
  "prp-face-lift",
  "joint-restoration",
]);

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
    // Tidewater: same heading, intro and every procedure link, as a quiet two/three-column list (no images, no buttons).
    return (
      <section className="w-full scroll-mt-28 py-16 md:py-24" id="services" aria-labelledby="home-procedures-heading">
        <div className="grid gap-6 lg:grid-cols-2 lg:items-end lg:gap-20">
          <div>
            <p className="text-sm text-base-content/65">{kicker}</p>
            <Heading
              id="home-procedures-heading"
              className="font-display mt-3 text-3xl leading-tight tracking-tight text-base-content md:text-[2.6rem]"
            >
              Medical Spa Treatments in Williamsburg, VA
            </Heading>
          </div>
          <div>
            <p className="max-w-[65ch] text-base leading-relaxed text-base-content/75">
              Compare Xeomin® (our wrinkle relaxer and a Botox® alternative), PRP treatments, microneedling with PRP, hyperhidrosis care, Blomdahl medical ear piercing for babies, children, teens, and adults, and vitamin B-12 injections. Each service page explains who the treatment may fit (including infants with pediatrician guidance), which goals it is commonly used for, and what to review during consultation.
            </p>
            {showBotoxAlternativeLink ? (
              <p className="mt-4 max-w-[65ch] text-base leading-relaxed text-base-content/75">
                Looking for Botox in Williamsburg? We use Xeomin®, a wrinkle relaxer in the same category. See our{" "}
                <Link href="/procedures/botox" className="link link-primary">
                  Botox alternative in Williamsburg
                </Link>
                .
              </p>
            ) : null}
          </div>
        </div>

        {featured ? <div className="mt-14">{featured}</div> : null}

        <ul className="mt-16 grid grid-cols-1 gap-x-12 border-t border-base-300 sm:grid-cols-2 xl:grid-cols-3" data-home-procedure-list>
          {visibleProcedures.map((procedure) => (
            <li key={procedure.slug} className="border-b border-base-300 py-6">
              <h3 className="font-display text-xl leading-snug text-base-content md:text-[1.35rem]">
                <Link href={`/procedures/${procedure.slug}`} className="rounded-sm transition-colors hover:text-secondary">
                  {procedure.name}
                </Link>
                {CMA_CERTIFIED_PROCEDURE_SLUGS.has(procedure.slug) ? (
                  <span className="ml-2 align-middle font-sans text-xs text-base-content/55">CMA Certified</span>
                ) : null}
              </h3>
              <p className="mt-2 text-[0.95rem] leading-relaxed text-base-content/75">{humanizeMedicalCopy(procedure.headline)}</p>
              <p className="mt-1.5 text-sm leading-relaxed text-base-content/60">{humanizeMedicalCopy(procedure.subline)}</p>
              <Link
                href={`/procedures/${procedure.slug}`}
                className="mt-3 inline-block rounded-sm text-sm text-secondary transition-colors hover:text-base-content"
              >
                Learn More<span className="sr-only"> about {humanizeMedicalCopy(procedure.headline)}</span>
              </Link>
            </li>
          ))}
        </ul>
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
