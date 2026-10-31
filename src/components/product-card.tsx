import * as React from "react";
import Image from "next/image";
import Link from "next/link";
import AddToCartButton from "components/add-to-cart-button";
import { Button } from "components/ui/button";
import { getCatalogConfigBySlug } from "config/commerce-catalog";
import { humanizeMedicalCopy } from "lib/humanize";

interface Props {
  name: string;
  description: string;
  image: string;
  slug: string;
  headline: string;
  subline: string;
  link: string;
  tone?: "default" | "editorial";
}

export const ProductCard = ({ name, image, headline, subline, slug, tone = "default" }: Props) => {
  const catalogItem = getCatalogConfigBySlug(slug);
  const editorial = tone === "editorial";
  const TitleTag = editorial ? "h3" : "h2";

  return (
    <article className={editorial ? "flex h-full flex-col" : "space-y-3"}>
      <Link href={`/products/${slug}`} passHref className="group relative block">
        {editorial ? (
          <div className="relative aspect-square overflow-hidden border border-base-300 bg-base-200">
            <Image
              fill
              src={image}
              alt={name}
              sizes="(min-width: 1280px) 22rem, (min-width: 1024px) 30vw, (min-width: 640px) 45vw, 92vw"
              quality={70}
              className="object-cover transition-transform duration-500 ease-out group-hover:scale-[1.03] motion-reduce:transition-none motion-reduce:group-hover:scale-100"
              draggable="false"
            />
          </div>
        ) : (
          <div className="aspect-w-1 aspect-h-1">
            <Image
              height={500}
              width={500}
              src={image}
              alt={name}
              sizes="(min-width: 1280px) 22rem, (min-width: 1024px) 30vw, (min-width: 640px) 45vw, 92vw"
              quality={70}
              className="object-cover w-full h-full rounded-md"
              draggable="false"
            />
          </div>
        )}
      </Link>
      <div className={editorial ? "mt-4 flex flex-1 flex-col" : "space-y-1"}>
        <TitleTag className={editorial ? "font-display text-[1.75rem] font-medium leading-tight text-base-content" : "text-xl font-bold"}>
          {name}
        </TitleTag>
        {editorial ? (
          <p className="mt-3 text-base leading-6 text-base-content/85">{humanizeMedicalCopy(headline)}</p>
        ) : (
          <h3 className="text-lg">{humanizeMedicalCopy(headline)}</h3>
        )}
        <p className={editorial ? "mt-2 text-sm leading-6 text-base-content/75" : "text-sm"}>{humanizeMedicalCopy(subline)}</p>
      </div>
      <div className={editorial ? "mt-5 flex flex-col gap-2 sm:flex-row sm:flex-wrap" : "flex flex-wrap items-end gap-2"}>
        {catalogItem && (
          <AddToCartButton
            slug={catalogItem.slug}
            kind={catalogItem.kind}
            quantity={catalogItem.minQuantity}
            className={editorial ? "w-full sm:w-auto" : undefined}
          />
        )}
        <Button asChild variant="secondary" className={editorial ? "w-full sm:w-auto" : undefined}>
          <Link href={`/products/${slug}`}>
            Learn More<span className="sr-only"> about {humanizeMedicalCopy(headline)}</span>
          </Link>
        </Button>
      </div>
    </article>
  );
};
