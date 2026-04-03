"use client";

import { ToastAction } from "components/ui/toast";
import { useToast } from "components/ui/use-toast";
import { Button, type ButtonProps } from "components/ui/button";
import { useCart } from "components/cart-provider";
import { getCatalogConfigBySlug } from "config/commerce-catalog";

type Props = ButtonProps & {
  slug: string;
  kind: "product" | "procedure";
  quantity?: number;
  label?: string;
};

export default function AddToCartButton({
  slug,
  kind,
  quantity = 1,
  label = "Add to Cart",
  onClick,
  ...props
}: Props) {
  const { addItem, openCart } = useCart();
  const { toast } = useToast();

  return (
    <Button
      {...props}
      onClick={(event) => {
        onClick?.(event);
        if (event.defaultPrevented) return;

        addItem({ slug, kind, quantity });
        const catalogItem = getCatalogConfigBySlug(slug);
        const itemName = catalogItem?.name ?? slug;
        const itemSummary = quantity > 1 ? `${itemName} · Qty ${quantity}` : itemName;

        toast({
          title: "Added to cart",
          description: itemSummary,
          duration: 2600,
          action: (
            <ToastAction
              altText="View cart"
              onClick={openCart}
              className="border-primary bg-primary text-primary-content hover:bg-primary-focus hover:text-primary-content"
            >
              View Cart
            </ToastAction>
          ),
        });
      }}
    >
      {label}
    </Button>
  );
}
