"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu } from "lucide-react";

import CartTrigger from "components/cart-trigger";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "components/ui/sheet";

const NAV_ITEMS = [
  { href: "/locations", label: "Locations" },
  { href: "/products", label: "Products" },
  { href: "/procedures", label: "Procedures" },
  { href: "/blog", label: "Blog" },
] as const;

export default function Header() {
  const pathname = usePathname();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  useEffect(() => {
    setIsMenuOpen(false);
  }, [pathname]);

  return (
    <header className="flex w-full items-center justify-between gap-4 py-4 lg:py-5">
      <Link href="/" className="min-w-0">
        <div className="flex items-center justify-start">
          <picture className="hidden shrink-0 md:block">
            <source media="(prefers-color-scheme: dark)" srcSet="/logo.png" />
            <img
              width={548}
              height={747}
              src="/logo.png"
              alt="Williamsburg Med Spa logo"
              className="h-[50px] w-auto"
            />
          </picture>
          <div className="ml-2 flex min-w-0 flex-col items-start justify-center">
            <h1 className="text-lg font-bold tracking-tight text-base-content sm:text-xl md:text-2xl">
              Williamsburg Med Spa
            </h1>
            <h2 className="mt-0 hidden text-sm font-light text-base-content/75 lg:block">
              Restorative Wellness & Natural Healing
            </h2>
          </div>
        </div>
      </Link>

      <div className="hidden items-center lg:flex">
        <nav className="flex items-center">
          {NAV_ITEMS.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="mx-2 rounded-md px-1 py-1 text-base-content transition-colors hover:text-base-content/70 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary/30 focus-visible:ring-offset-2"
            >
              {item.label}
            </Link>
          ))}
        </nav>
        <CartTrigger className="ml-4" />
      </div>

      <div className="flex items-center gap-2 lg:hidden">
        <Sheet open={isMenuOpen} onOpenChange={setIsMenuOpen}>
          <SheetTrigger asChild>
            <button
              type="button"
              aria-label="Open navigation menu"
              className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-base-300 bg-base-100 text-base-content shadow-sm transition-colors duration-150 ease-out hover:border-base-content/15 hover:bg-base-200 focus:outline-none focus:ring-2 focus:ring-primary/30 focus:ring-offset-2 motion-reduce:transition-none"
            >
              <Menu className="h-[1.05rem] w-[1.05rem]" />
            </button>
          </SheetTrigger>

          <SheetContent
            side="left"
            className="flex h-full w-[18.5rem] max-w-[85vw] flex-col p-0 shadow-xl sm:max-w-[20rem]"
          >
            <div className="border-b border-base-300 bg-base-100 px-5 py-5">
              <SheetHeader className="pr-12">
                <p className="text-[11px] uppercase tracking-[0.24em] text-base-content/60">Menu</p>
                <SheetTitle className="text-xl font-semibold tracking-tight text-base-content">
                  Williamsburg Med Spa
                </SheetTitle>
              </SheetHeader>
            </div>

            <nav className="flex flex-1 flex-col gap-1 px-3 py-4">
              {NAV_ITEMS.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setIsMenuOpen(false)}
                  className="rounded-2xl px-4 py-3 text-lg tracking-tight text-base-content transition-colors hover:bg-base-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary/30 focus-visible:ring-offset-2"
                >
                  {item.label}
                </Link>
              ))}
            </nav>
          </SheetContent>
        </Sheet>

        <CartTrigger mode="compact" />
      </div>
    </header>
  );
}
