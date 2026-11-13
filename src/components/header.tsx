import Link from "next/link";

import CartTrigger from "components/cart-trigger";
import MobileMenu from "components/mobile-menu";

// Tidewater header: four quiet links and one filled button. Offers, Events, Blog and Products live in the footer.
const NAV_ITEMS = [
  { href: "/procedures", label: "Treatments" },
  { href: "/prices", label: "Prices" },
  { href: "/staff/jenny-brady", label: "About Jenny" },
  { href: "/locations/williamsburg-va", label: "Visit" },
] as const;

// Same destination as the homepage's main consultation button.
export const BOOK_HREF = "/consult";

export default function Header() {
  return (
    <header className="flex w-full items-center justify-between gap-3 py-3 sm:gap-4 lg:py-4">
      <Link href="/" className="min-w-0 flex-1 rounded-md">
        <div className="flex items-center justify-start">
          <picture className="shrink-0">
            <source type="image/webp" srcSet="/logo-header.webp" />
            <img
              width={70}
              height={96}
              src="/logo-header.png"
              alt="Williamsburg Med Spa logo"
              className="h-9 w-auto sm:h-10 md:h-11"
            />
          </picture>
          <p className="ml-2.5 truncate font-display text-[1.3rem] font-normal leading-none tracking-tight text-base-content min-[380px]:text-[1.45rem] sm:ml-3 sm:text-[1.6rem]">
            Williamsburg Med Spa
          </p>
        </div>
      </Link>

      <div className="hidden items-center gap-1 lg:flex">
        <nav aria-label="Main" className="flex items-center">
          {NAV_ITEMS.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="mx-3 rounded-sm py-1 text-[0.95rem] text-base-content/85 transition-colors hover:text-base-content"
            >
              {item.label}
            </Link>
          ))}
        </nav>
        <Link
          href={BOOK_HREF}
          className="ml-4 inline-flex h-10 items-center rounded-full bg-primary px-5 text-sm font-medium text-primary-content transition-colors hover:bg-primary/90"
        >
          Book a visit
        </Link>
        <CartTrigger mode="compact" className="ml-3 h-10 w-10 border-transparent" />
      </div>

      <div className="flex items-center gap-1.5 lg:hidden">
        <CartTrigger mode="compact" className="border-transparent" />
        <MobileMenu items={NAV_ITEMS} bookHref={BOOK_HREF} />
      </div>
    </header>
  );
}
