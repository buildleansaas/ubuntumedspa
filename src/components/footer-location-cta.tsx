import Link from "next/link";

import DirectionsButton from "components/directions-button";
import { Button } from "components/ui/button";

export default function FooterLocationCta() {
  const address = "3900 Powhatan Parkway, Williamsburg, VA 23188";
  return (
    <section className="w-full text-left">
      <p className="text-[11px] uppercase tracking-[0.24em] text-base-content/60">Visit The Clinic</p>
      <h3 className="mt-3 text-2xl/snug md:text-3xl/snug font-light tracking-tight text-base-content">
        Williamsburg Med Spa
      </h3>
      <p className="mt-4 max-w-xl text-base md:text-lg leading-relaxed text-base-content/80">{address}</p>
      <p className="mt-2 text-sm md:text-base leading-relaxed text-base-content/70">
        Hours: Mon–Fri 6–8pm; Sat–Sun 10am–6pm
      </p>

      <div className="mt-6 flex flex-wrap gap-3">
        <Button asChild variant="secondary">
          <Link href={`tel:${"+1 (804) 738-9483".replace(/[^0-9+]/g, "")}`}>+1 (804) 738-9483</Link>
        </Button>
        <DirectionsButton address={address} latitude={37.2707} longitude={-76.7075}>
          Get Directions
        </DirectionsButton>
      </div>
    </section>
  );
}
