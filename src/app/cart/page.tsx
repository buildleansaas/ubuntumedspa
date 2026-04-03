import type { Metadata } from "next";

import CartPageClient from "components/cart-page-client";
import { buildPageMetadata } from "lib/metadata";

export const metadata: Metadata = buildPageMetadata({
  title: "Cart | Williamsburg Med Spa",
  description: "Review your selected procedures and products before checkout.",
  canonical: "/cart",
});

export default function CartPage() {
  return <CartPageClient />;
}
