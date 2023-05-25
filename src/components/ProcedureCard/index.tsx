import * as React from "react";
import Image from "next/image";
import Link from "next/link";

interface Props {
  product: {
    name: string;
    description: string;
    image: string;
    slug: string;
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
          className="object-cover w-full h-full"
          draggable="false"
        />
      </div>
    </Link>
    <div className="space-y-1">
      <h2 className="text-xl font-bold">{product.name}</h2>
      <p className="text-lg">{product.description}</p>
    </div>
    <div className="flex space-x-2">
      <Link
        href={`/consultation`}
        passHref
        className="px-4 py-2 bg-white bg-opacity-10 hover:bg-opacity-20 text-gray-700 rounded-md"
      >
        Schedule
      </Link>
      <Link
        href={`/procedures/${product.slug}`}
        passHref
        className="px-4 py-2 bg-white bg-opacity-10 hover:bg-opacity-20 text-gray-700 rounded-md"
      >
        Information
      </Link>
    </div>
  </div>
);
