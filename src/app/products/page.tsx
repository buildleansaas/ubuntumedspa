import CtaFooter from "components/cta-footer";
import ProductsView from "views/products";

export default function Products() {
  return (
    <div className="max-w-7xl mx-auto">
      <ProductsView />
      <CtaFooter />
    </div>
  );
}
