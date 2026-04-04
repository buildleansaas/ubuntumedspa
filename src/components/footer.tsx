import Link from "next/link";
import FooterLocationCta from "components/footer-location-cta";
import FooterAffiliateCta from "components/footer-affiliate-cta";

export default function Footer() {
  return (
    <footer className="text-center text-base-content mt-16">
      <div className="px-4 mb-4">
        <FooterLocationCta />
      </div>
      <div className="px-4 mb-4">
        <FooterAffiliateCta />
      </div>
      <div className="p-4 text-center space-x-2">
        <span>© 2025</span>
        <Link className="text-base-content hover:underline" href="/">
          Williamsburg Med Spa
        </Link>
        <span>·</span>
        <Link className="text-base-content hover:underline" href="/locations/williamsburg-va">
          Williamsburg, VA
        </Link>
      </div>
    </footer>
  );
}
