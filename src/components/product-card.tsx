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
}

export const ProductCard = ({ name, image, headline, subline, slug }: Props) => {
  const catalogItem = getCatalogConfigBySlug(slug);

  return (
    <div className="space-y-3">
      <Link href={`/products/${slug}`} passHref className="relative group block">
        <div className="aspect-w-1 aspect-h-1">
          <Image
            height={500}
            width={500}
            src={image}
            alt={name}
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
            className="object-cover w-full h-full rounded-md"
            draggable="false"
          />
        </div>
      </Link>
      <div className="space-y-1">
        <h2 className="text-xl font-bold">{name}</h2>
        <h3 className="text-lg">{humanizeMedicalCopy(headline)}</h3>
        <p className="text-sm">{humanizeMedicalCopy(subline)}</p>
      </div>
      <div className="flex flex-wrap items-end gap-2">
        {catalogItem && <AddToCartButton slug={catalogItem.slug} kind={catalogItem.kind} quantity={catalogItem.minQuantity} />}
        <Button asChild variant="secondary">
          <Link href={`/products/${slug}`}>Learn More</Link>
        </Button>
      </div>
    </div>
  );
};
