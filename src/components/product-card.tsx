import * as React from "react";
import Image from "next/image";
import Link from "next/link";
import { Button } from "components/ui/button";

interface Props {
  name: string;
  description: string;
  image: string;
  slug: string;
  headline: string;
  subline: string;
  link: string;
}

export const ProductCard = ({ name, image, headline, subline, link, slug }: Props) => (
  <div className="space-y-3">
    <Link href={`/products/${slug}`} passHref className="relative group block">
      <div className="aspect-w-1 aspect-h-1">
        <Image
          height={500}
          width={500}
          src={image}
          alt={name}
          className="object-cover w-full h-full rounded-md"
          draggable="false"
        />
      </div>
    </Link>
    <div className="space-y-1">
      <h2 className="text-xl font-bold">{name}</h2>
      <h3 className="text-lg">{headline}</h3>
      <p className="text-sm">{subline}</p>
    </div>
    <div className="flex space-x-2">
      <Button className="bg-primary hover:bg-primary">
        <Link href={link}>Buy Now</Link>
      </Button>
      <Button variant="secondary">
        <Link href={`/products/${slug}`} passHref>
          Learn More
        </Link>
      </Button>
    </div>
  </div>
);
