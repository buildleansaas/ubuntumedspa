"use client";

import dynamic from "next/dynamic";

import { useCart } from "components/cart-provider";

const CartDrawer = dynamic(() => import("components/cart-drawer"), {
  ssr: false,
  loading: () => null,
});

export default function CartDrawerLoader() {
  const { isCartOpen, totalCount } = useCart();

  if (!isCartOpen && totalCount === 0) {
    return null;
  }

  return <CartDrawer />;
}
