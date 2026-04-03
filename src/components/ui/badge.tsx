import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "lib/utils";

const badgeVariants = cva(
  "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-primary/30 focus:ring-offset-2 focus:ring-offset-base-100",
  {
    variants: {
      variant: {
        default: "border-transparent bg-primary text-primary-content hover:bg-primary/90",
        secondary: "border-transparent bg-secondary text-secondary-content hover:bg-secondary/90",
        destructive: "border-transparent bg-error text-error-content hover:bg-error/90",
        outline: "border-base-300 bg-base-100 text-base-content",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
);

export interface BadgeProps extends React.HTMLAttributes<HTMLDivElement>, VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return <div className={cn(badgeVariants({ variant }), className)} {...props} />;
}

export { Badge, badgeVariants };
