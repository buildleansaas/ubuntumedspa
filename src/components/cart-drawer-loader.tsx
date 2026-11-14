"use client";

import dynamic from "next/dynamic";
import { useEffect, useState } from "react";

import { useCart } from "components/cart-provider";

const CartDrawer = dynamic(() => import("components/cart-drawer"), {
  ssr: false,
  loading: () => null,
});

export default function CartDrawerLoader() {
  const { isCartOpen, totalCount } = useCart();
  // Once the drawer has been needed, keep it mounted so closing it plays the exit animation instead of unmounting
  // mid-slide (an empty cart used to drop the drawer the moment it closed).
  const [needed, setNeeded] = useState(false);

  useEffect(() => {
    if (isCartOpen || totalCount > 0) setNeeded(true);
  }, [isCartOpen, totalCount]);

  if (!needed && !isCartOpen && totalCount === 0) {
    return null;
  }

  return <CartDrawer />;
}
