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
          At Ubuntu Med Spa, we offer a wide range of medical grade beauty products to help you look and feel your best.
          Our products are only available through a licensed medical professional, so you can rest assured that you are
          getting the best quality.
        </p>
      </div>

      <div className="grid gap-8 lg:gap-10 mt-8 lg:my-12 xl:my-16 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
        {products.map((product, i) => (
          <ProductCard key={i} {...product} slug={product.name.replaceAll(" ", "-").toLowerCase()} />
        ))}
      </div>
    </>
  );
}
