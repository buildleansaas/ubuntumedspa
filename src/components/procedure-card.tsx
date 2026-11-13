import * as React from "react";
import Image from "next/image";
import Link from "next/link";
import AddToCartButton from "components/add-to-cart-button";
import { Button } from "components/ui/button";
import { getCatalogConfigBySlug } from "config/commerce-catalog";
import { humanizeMedicalCopy } from "lib/humanize";

const CMA_CERTIFIED_PROCEDURE_SLUGS = new Set([
  "oh-shot",
  "pe-shot",
  "prp-breast-lift",
  "prp-hair-restoration",
  "prp-facial",
  "prp-face-lift",
  "joint-restoration",
]);

interface Props {
  product: {
    name: string;
    description: string;
    image: string;
    slug: string;
    headline: string;
    subline: string;
  };
  tone?: "default" | "editorial";
}

export const ProcedureCard = ({ product, tone = "default" }: Props) => {
  const catalogItem = getCatalogConfigBySlug(product.slug);
  const showCmaCertifiedTag = CMA_CERTIFIED_PROCEDURE_SLUGS.has(product.slug);
  const editorial = tone === "editorial";
  const TitleTag = editorial ? "h3" : "h2";

  return (
    <article className={editorial ? "flex h-full flex-col" : "space-y-3"}>
      <Link href={`/procedures/${product.slug}`} passHref className="group block">
        <div
          className={
            editorial
              ? "relative aspect-[3/2] w-full overflow-hidden rounded-xl bg-base-200"
              : "relative aspect-[3/2] w-full overflow-hidden rounded-md bg-base-200"
          }
        >
          <Image
            fill
            src={product.image}
            alt={product.name}
            sizes="(min-width: 1280px) 22rem, (min-width: 1024px) 30vw, (min-width: 640px) 45vw, 92vw"
            quality={70}
            className={
              editorial
                ? "object-cover transition-transform duration-500 ease-out group-hover:scale-[1.03] motion-reduce:transition-none motion-reduce:group-hover:scale-100"
                : "object-cover"
            }
            draggable="false"
          />
        </div>
      </Link>
      <div className={editorial ? "mt-4 flex flex-1 flex-col" : "space-y-1"}>
        <div className={editorial ? "space-y-3" : "flex items-start justify-between gap-3"}>
          <TitleTag className={editorial ? "font-display text-[1.5rem] leading-tight text-base-content" : "min-w-0 text-xl font-bold"}>
            {product.name}
          </TitleTag>
          {showCmaCertifiedTag ? (
            <span
              className={
                editorial
                  ? "inline-flex w-fit shrink-0 items-center gap-1.5 rounded-full border border-base-300 bg-base-100 px-2.5 py-0.5 text-[11px] text-base-content/70"
                  : "inline-flex shrink-0 items-center gap-1.5 rounded-full border border-base-300 bg-base-100 px-2.5 py-1 text-[10px] font-medium uppercase tracking-[0.18em] text-base-content/70"
              }
            >
              <Image
                src="/brand/cma-logo.png"
                alt=""
                aria-hidden="true"
                width={300}
                height={132}
                sizes="40px"
                className="h-[0.7rem] w-auto shrink-0"
              />
              Certified
            </span>
          ) : null}
        </div>
        {editorial ? (
          <p className="mt-2 text-[0.95rem] leading-6 text-base-content/80">{humanizeMedicalCopy(product.headline)}</p>
        ) : (
          <h3 className="text-lg">{humanizeMedicalCopy(product.headline)}</h3>
        )}
        <p className={editorial ? "mt-2 text-sm leading-6 text-base-content/65" : "text-sm"}>
          {humanizeMedicalCopy(product.subline)}
        </p>
      </div>
      <div className={editorial ? "mt-4 flex flex-wrap items-center gap-x-5 gap-y-2" : "flex flex-wrap items-end gap-2"}>
        {catalogItem && (
          <AddToCartButton
            slug={catalogItem.slug}
            kind={catalogItem.kind}
            quantity={catalogItem.minQuantity}
            variant={editorial ? "outline" : undefined}
            size={editorial ? "sm" : undefined}
          />
        )}
        {editorial ? (
          <Link
            href={`/procedures/${product.slug}`}
            className="rounded-sm text-sm text-secondary underline decoration-secondary/30 underline-offset-[6px] transition-colors hover:decoration-secondary"
          >
            Learn More<span className="sr-only"> about {humanizeMedicalCopy(product.headline)}</span>
          </Link>
        ) : (
          <Button asChild variant="secondary">
            <Link href={`/procedures/${product.slug}`}>
              Learn More<span className="sr-only"> about {humanizeMedicalCopy(product.headline)}</span>
            </Link>
          </Button>
        )}
      </div>
    </article>
  );
};
