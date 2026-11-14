import { Navigation } from "lucide-react";

import { buttonVariants } from "components/ui/button";
import { cn } from "lib/utils";

/** Driving directions to the clinic in both map apps (Austin 2026-11-13: offer Apple Maps and Google Maps). */
export default function DirectionsLinks({
  googleHref,
  appleHref,
  className,
}: {
  googleHref: string;
  appleHref: string;
  className?: string;
}) {
  const link = cn(buttonVariants({ variant: "outline", size: "sm" }), "relative z-10 gap-2");
  return (
    <div className={cn("flex flex-wrap gap-2", className)}>
      <a href={appleHref} target="_blank" rel="noopener" className={link}>
        <Navigation aria-hidden className="size-3.5" />
        Apple Maps
      </a>
      <a href={googleHref} target="_blank" rel="noopener" className={link}>
        <Navigation aria-hidden className="size-3.5" />
        Google Maps
      </a>
    </div>
  );
}
