import * as React from "react";
import Image from "next/image";
import Link from "next/link";
import { Button } from "components/ui/button";

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

export const ProcedureCard = ({ product }: Props) => (
  <div className="space-y-3">
    <Link href={`/procedures/${product.slug}`} passHref className="relative group block">
      <div className="aspect-w-1 aspect-h-1">
        <Image
          height={500}
          width={500}
          src={product.image}
          alt={product.name}
          className="object-cover w-full h-full rounded-md"
          draggable="false"
        />
      </div>
    </Link>
    <div className="space-y-1">
      <h2 className="text-xl font-bold">{product.name}</h2>
      <h3 className="text-lg">{product.headline}</h3>
      <p className="text-sm">{product.subline}</p>
    </div>
    <div className="flex space-x-2">
      <Button className="bg-primary hover:bg-primary">
        <Link href="/consult">Schedule</Link>
      </Button>
      <Button variant="secondary">
        <Link href={`/procedures/${product.slug}`} passHref>
          Learn More
        </Link>
      </Button>
    </div>
  </div>
);
