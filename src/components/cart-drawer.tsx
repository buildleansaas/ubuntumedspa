"use client";

import CartContent from "components/cart-content";
import { useCart } from "components/cart-provider";
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from "components/ui/sheet";

export default function CartDrawer() {
  const { isCartOpen, openCart, closeCart, totalCount } = useCart();

  return (
    <Sheet open={isCartOpen} onOpenChange={(open) => (open ? openCart() : closeCart())}>
      <SheetContent side="right" className="flex h-full flex-col p-0">
        <div className="border-b border-base-300 bg-base-100 px-6 py-5">
          <SheetHeader className="pr-12">
            <p className="text-[11px] uppercase tracking-[0.24em] text-base-content/60">
              {totalCount} {totalCount === 1 ? "item" : "items"} selected
            </p>
            <SheetTitle className="text-2xl font-light tracking-tight text-base-content sm:text-3xl">
              <span className="font-semibold">Cart</span>
            </SheetTitle>
            <SheetDescription className="max-w-sm leading-6 text-base-content/70">
              Products are pickup-only and procedures move to scheduling after payment.
            </SheetDescription>
          </SheetHeader>
        </div>
        <div className="min-h-0 flex-1 px-5 py-5 sm:px-6">
          <CartContent mode="drawer" onNavigate={closeCart} />
        </div>
      </SheetContent>
    </Sheet>
  );
}
