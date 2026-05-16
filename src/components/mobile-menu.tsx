"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu } from "lucide-react";

import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "components/ui/sheet";

interface MobileMenuProps {
  items: readonly {
    href: string;
    label: string;
  }[];
}

export default function MobileMenu({ items }: MobileMenuProps) {
  const pathname = usePathname();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  useEffect(() => {
    setIsMenuOpen(false);
  }, [pathname]);

  return (
    <Sheet open={isMenuOpen} onOpenChange={setIsMenuOpen}>
      <SheetTrigger asChild>
        <button
          type="button"
          aria-label="Open navigation menu"
          className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-base-300 bg-base-100 text-base-content shadow-sm transition-all duration-150 ease-out hover:border-primary/35 hover:bg-base-200 focus:outline-none focus:ring-2 focus:ring-primary/30 focus:ring-offset-2 motion-reduce:transition-none"
        >
          <Menu className="h-[1.05rem] w-[1.05rem]" />
        </button>
      </SheetTrigger>

      <SheetContent side="left" className="flex h-full w-[18.5rem] max-w-[85vw] flex-col p-0 shadow-xl sm:max-w-[20rem]">
        <div className="border-b border-base-300 bg-base-100 px-5 py-5">
          <SheetHeader className="pr-12">
            <p className="text-[11px] uppercase tracking-[0.24em] text-base-content/60">Menu</p>
            <SheetTitle className="text-xl font-semibold tracking-tight text-base-content">Williamsburg Med Spa</SheetTitle>
          </SheetHeader>
        </div>

        <nav className="flex flex-1 flex-col gap-1 px-3 py-4">
          {items.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => setIsMenuOpen(false)}
              className="rounded-full px-4 py-3 text-lg tracking-tight text-base-content transition-colors hover:bg-base-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary/30 focus-visible:ring-offset-2"
            >
              {item.label}
            </Link>
          ))}
        </nav>
      </SheetContent>
    </Sheet>
  );
}
