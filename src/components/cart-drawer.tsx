"use client";

import CartContent from "components/cart-content";
import { useCart } from "components/cart-provider";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "components/ui/sheet";

export default function CartDrawer() {
  const { isCartOpen, openCart, closeCart } = useCart();

  return (
    <Sheet open={isCartOpen} onOpenChange={(open) => (open ? openCart() : closeCart())}>
      <SheetContent side="right" className="flex h-full flex-col p-0">
        <div className="border-b border-base-300 bg-base-100 px-4 py-3.5 sm:px-6 sm:py-5">
          <SheetHeader className="pr-10 sm:pr-12">
            <SheetTitle className="text-[1.75rem] font-light tracking-tight text-base-content sm:text-3xl">
              <span className="font-semibold">Cart</span>
            </SheetTitle>
          </SheetHeader>
        </div>
        <div className="min-h-0 flex-1 px-4 py-3.5 sm:px-6 sm:py-5">
          <CartContent mode="drawer" onNavigate={closeCart} />
        </div>
      </SheetContent>
    </Sheet>
  );
}
