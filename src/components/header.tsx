import Link from "next/link";

import CartTrigger from "components/cart-trigger";
import MobileMenu from "components/mobile-menu";

const NAV_ITEMS = [
  { href: "/locations", label: "Locations" },
  { href: "/products", label: "Products" },
  { href: "/procedures", label: "Procedures" },
  { href: "/events", label: "Events" },
  { href: "/blog", label: "Blog" },

] as const;

export default function Header() {
  return (
    <header className="flex w-full items-center justify-between gap-3 py-3.5 sm:gap-4 lg:py-5">
      <Link href="/" className="min-w-0 flex-1">
        <div className="flex items-center justify-start">
          <picture className="shrink-0">
            <source type="image/webp" srcSet="/logo-header.webp" />
            <img
              width={70}
              height={96}
              src="/logo-header.png"
              alt="Williamsburg Med Spa logo"
              className="h-10 w-auto sm:h-11 md:h-[50px]"
            />
          </picture>
          <div className="ml-2 flex min-w-0 flex-col items-start justify-center sm:ml-3">
            <p className="truncate font-display text-[1.35rem] font-medium leading-none tracking-tight text-base-content min-[380px]:text-[1.55rem] sm:text-[1.75rem]">
              Williamsburg Med Spa
            </p>
            <p className="mt-1 hidden text-[0.7rem] font-medium uppercase tracking-[0.18em] text-base-content/75 lg:block">
              Restorative Wellness & Natural Healing
            </p>
          </div>
        </div>
      </Link>

      <div className="hidden items-center lg:flex">
        <nav className="flex items-center">
          {NAV_ITEMS.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="mx-2.5 px-0.5 py-1 text-sm tracking-wide text-base-content transition-colors hover:text-primary focus:outline-none focus-visible:ring-2 focus-visible:ring-primary/40 focus-visible:ring-offset-2"
            >
              {item.label}
            </Link>
          ))}
        </nav>
        <CartTrigger className="ml-4" />
      </div>

      <div className="flex items-center gap-2 lg:hidden">
        <MobileMenu items={NAV_ITEMS} />
        <CartTrigger mode="compact" />
      </div>
    </header>
  );
}
