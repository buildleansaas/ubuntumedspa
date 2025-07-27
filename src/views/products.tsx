import { ProductCard } from "components/product-card";
import { products } from "data";

export default function Products() {
  return (
    <>
      <div className="text-center" id="services">
        <h2 className="text-4xl/snug sm:text-5xl/snug md:text-6xl/snug font-light mx-auto leading-tight pb-4">
          Medical Grade Beauty Products
        </h2>
        <p className="text-lg lg:text-xl mb-8 max-w-5xl mx-auto">
          At Williamsburg Med Spa, we offer carefully curated medical-grade wellness products to support your restorative journey.
          Our professional-grade products are selected for their healing properties and effectiveness, available exclusively
          through our licensed medical professionals.
        </p>
      </div>

      <div className="grid gap-8 lg:gap-10 mt-8 lg:my-12 xl:my-16 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
        {products.map((product, i) => (
          <ProductCard key={i} {...product} slug={product.name.replaceAll(" ", "-").toLowerCase()} />
        ))}
      </div>
    </>
  );
}
