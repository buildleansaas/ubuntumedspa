import type { Metadata } from "next";
import CtaFooter from "components/cta-footer";
import StructuredData from "components/structured-data";
import ProductsView from "views/products";
import { buildPageMetadata } from "lib/metadata";
import HomeOwnerLink from "components/home-owner-link";

export const metadata: Metadata = buildPageMetadata({
  title: "Skincare Products in Williamsburg, VA | Williamsburg Med Spa",
  description:
    "Products available for pickup at Williamsburg Med Spa. Ask Jenny which fits your routine.",
  canonical: "/products",
});

export default function Products() {
  return (
    <div className="max-w-7xl mx-auto">
      <StructuredData type="Breadcrumb" breadCrumbs={["Home", "Products"]} />
      <ProductsView headingTag="h1" variant="editorial" />
      <HomeOwnerLink className="mt-10" />
      <CtaFooter />
    </div>
  );
}
