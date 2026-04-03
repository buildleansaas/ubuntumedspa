"use client";

import Link from "next/link";

import CartTrigger from "components/cart-trigger";

export default function Header() {
  return (
    <div className="flex w-full flex-col gap-4 py-4 md:flex-row md:items-center md:justify-between">
      <Link href="/" passHref>
        <div className="flex items-center justify-start">
          <picture className="hidden shrink-0 md:block">
            <source media="(prefers-color-scheme: dark)" srcSet="/logo.png" />
            <img
              width={50}
              height={50}
              src="/logo-black.png"
              alt="Williamsburg Med Spa logo"
              className="h-[50px] w-[50px]"
            />
          </picture>
          <div className="flex flex-col items-start justify-center ml-2">
            <h1 className="text-md sm:text-lg md:text-xl text-base-content font-bold">Williamsburg Med Spa</h1>
            <h2 className="hidden md:block mt-0 text-sm md:text-base text-base-content font-light">
              Restorative Wellness & Natural Healing
            </h2>
          </div>
        </div>
      </Link>

      <div className="flex flex-wrap items-center gap-y-2">
        <Link href="/locations" className="mx-2 text-base-content hover:text-base-content">
          Locations
        </Link>
        <Link href="/products" className="mx-2 text-base-content hover:text-base-content">
          Products
        </Link>
        <Link href="/procedures" className="mx-2 text-base-content hover:text-base-content">
          Procedures
        </Link>
        <Link href="/blog" passHref className="mx-2 text-base-content hover:text-base-content">
          Blog
        </Link>
        <CartTrigger />
      </div>
    </div>
  );
}
