import * as React from "react";
import Image from "next/image";
import Link from "next/link";
import AddToCartButton from "components/add-to-cart-button";
import { Button } from "components/ui/button";
import { getCatalogConfigBySlug } from "config/commerce-catalog";
import { humanizeMedicalCopy } from "lib/humanize";

const CMA_CERTIFIED_PROCEDURE_SLUGS = new Set([
  "o-shot",
  "p-shot",
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
}

export const ProcedureCard = ({ product }: Props) => {
  const catalogItem = getCatalogConfigBySlug(product.slug);
  const showCmaCertifiedTag = CMA_CERTIFIED_PROCEDURE_SLUGS.has(product.slug);

  return (
    <div className="space-y-3">
      <Link href={`/procedures/${product.slug}`} passHref className="relative group block">
        <div className="aspect-w-1 aspect-h-1">
          <Image
            height={500}
            width={500}
            src={product.image}
            alt={product.name}
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
            className="object-cover w-full h-full rounded-md"
            draggable="false"
          />
        </div>
      </Link>
      <div className="space-y-1">
        <div className="flex items-start justify-between gap-3">
          <h2 className="min-w-0 text-xl font-bold">{product.name}</h2>
          {showCmaCertifiedTag ? (
            <span className="inline-flex shrink-0 items-center gap-1.5 rounded-full border border-base-300 bg-base-100 px-2.5 py-1 text-[10px] font-medium uppercase tracking-[0.18em] text-base-content/70">
              <Image
                src="/brand/cma-logo.png"
                alt=""
                aria-hidden="true"
                width={300}
                height={132}
                className="h-[0.7rem] w-auto shrink-0"
              />
              Certified
            </span>
          ) : null}
        </div>
        <h3 className="text-lg">{humanizeMedicalCopy(product.headline)}</h3>
        <p className="text-sm">{humanizeMedicalCopy(product.subline)}</p>
      </div>
      <div className="flex flex-wrap items-end gap-2">
        {catalogItem && <AddToCartButton slug={catalogItem.slug} kind={catalogItem.kind} quantity={catalogItem.minQuantity} />}
        <Button asChild variant="secondary">
          <Link href={`/procedures/${product.slug}`}>Learn More</Link>
        </Button>
      </div>
    </div>
  );
};
