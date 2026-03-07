import Link from "next/link";
import DirectionsButton from "components/directions-button";
import { Button } from "components/ui/button";

export default function FooterLocationCta() {
  const address = "3900 Powhatan Parkway, Williamsburg, VA 23188";
  return (
    <div className="mx-auto max-w-4xl rounded-xl border border-base-300 px-4 py-3 md:px-6 md:py-4 flex flex-col md:flex-row items-center justify-between gap-3 text-sm">
      <div className="text-center md:text-left text-base-content/80">
        <div className="font-medium text-base-content">Williamsburg Med Spa</div>
        <div>{address}</div>
        <div>Hours: Mon–Fri 6–8pm; Sat–Sun 10am–6pm</div>
      </div>
      <div className="flex items-center gap-2">
        <Button asChild size="sm" variant="secondary">
          <Link href={`tel:${"+1 (804) 738-9483".replace(/[^0-9+]/g, "")}`}>+1 (804) 738-9483</Link>
        </Button>
        <DirectionsButton size="sm" address={address} latitude={37.2707} longitude={-76.7075}>
          Get Directions
        </DirectionsButton>
      </div>
    </div>
  );
}
