import type { Metadata } from "next";
import CtaFooter from "components/cta-footer";
import StructuredData from "components/structured-data";
import ProductsView from "views/products";
import { buildPageMetadata } from "lib/metadata";

export const metadata: Metadata = buildPageMetadata({
  title: "Medical Grade Skin Products in Williamsburg, VA | Williamsburg Med Spa",
  description:
    "Shop medical-grade skincare and wellness products offered by Williamsburg Med Spa, including curated formulations for skin and intimate care.",
  canonical: "/products",
});

export default function Products() {
  return (
    <div className="max-w-7xl mx-auto">
      <StructuredData type="Breadcrumb" breadCrumbs={["Home", "Products"]} />
      <ProductsView headingTag="h1" />
      <CtaFooter />
    </div>
  );
}
