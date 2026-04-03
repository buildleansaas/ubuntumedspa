"use client";

import { Button, type ButtonProps } from "components/ui/button";
import { useCart } from "components/cart-provider";

type Props = ButtonProps;

export default function OpenCartButton({ onClick, children, ...props }: Props) {
  const { openCart } = useCart();

  return (
    <Button
      {...props}
      onClick={(event) => {
        onClick?.(event);
        if (event.defaultPrevented) return;
        openCart();
      }}
    >
      {children}
    </Button>
  );
}
