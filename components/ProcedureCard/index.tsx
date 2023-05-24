import * as React from "react";
import NextLink from "next/link";
import Image from "next/image";

interface Props {
  product: {
    name: string;
    description: any[];
    image: {
      src: string;
    };
    slug: {
      current: string;
    };
  };
  onClick: () => void;
}

export const ProcedureCard = ({ product, onClick }: Props) => {
  return (
    <div className="space-y-3">
      {/* <NextLink href={`/procedures/${product.slug.current}`} passHref> */}
      <a className="relative group block">
        <div className="aspect-w-1.2 aspect-h-1">
          <Image
            height={275}
            width={275}
            src={product.image.src}
            alt={product.name}
            className="object-cover w-full h-full"
            draggable="false"
          />
        </div>
      </a>
      {/* </NextLink> */}
      <div className="space-y-1">
        <h2 className="text-xl font-semibold">{product.name}</h2>
        <p className="text-lg">{product.description}</p>
      </div>
      <div className="flex justify-between">
        <button className="px-4 py-2 text-white bg-blue-500 rounded-md hover:bg-blue-600" onClick={onClick}>
          Schedule
        </button>
        {/* <NextLink href={`/procedures/${product.slug.current}`} passHref>
          <button className="px-4 py-2 text-gray-800 bg-white border border-gray-400 rounded-md hover:text-gray-700">
            Information
          </button>
        </NextLink> */}
      </div>
    </div>
  );
};
