"use client";

import { useState } from "react";
import { Loader } from "lucide-react";

import { useCart } from "components/cart-provider";
import { Button, type ButtonProps } from "components/ui/button";
import { useToast } from "components/ui/use-toast";

type Props = ButtonProps & {
  slug: string;
  kind: "product" | "procedure";
  quantity?: number;
  label?: string;
};

export default function InstantCheckoutButton({
  slug,
  kind,
  quantity = 1,
  label = "Book Now",
  children,
  onClick,
  disabled,
  ...props
}: Props) {
  const [isLoading, setIsLoading] = useState(false);
  const { replaceItems } = useCart();
  const { toast } = useToast();

  return (
    <Button
      {...props}
      disabled={disabled || isLoading}
      onClick={async (event) => {
        onClick?.(event);
        if (event.defaultPrevented) return;

        setIsLoading(true);

        try {
          const items = [{ slug, kind, quantity }];
          replaceItems(items);

          const response = await fetch("/api/checkout", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ items }),
          });
          const body = await response.json();
          if (!response.ok) throw new Error(body.error || "Unable to start checkout.");

          window.location.href = body.url;
        } catch (error) {
          setIsLoading(false);
          toast({
            title: "Unable to start checkout",
            description: error instanceof Error ? error.message : "Please try again in a moment.",
          });
        }
      }}
    >
      {isLoading ? (
        <>
          <Loader className="mr-2 h-4 w-4 animate-spin" />
          Redirecting...
        </>
      ) : (
        children ?? label
      )}
    </Button>
  );
}
