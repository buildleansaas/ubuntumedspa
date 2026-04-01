import { ProductCard } from "components/product-card";
import { products } from "data";

type HeadingTag = "h1" | "h2";

export default function Products({ headingTag = "h2" }: { headingTag?: HeadingTag }) {
  const Heading = headingTag;
  const visibleProducts = products.filter((product) => !("published" in product) || product.published !== false);

  return (
    <>
      <div className="text-center" id="services">
        <Heading className="text-4xl/snug sm:text-5xl/snug md:text-6xl/snug font-light mx-auto leading-tight pb-4">
          Medical Grade Beauty Products
        </Heading>
        <p className="text-lg lg:text-xl mb-8 max-w-5xl mx-auto">
          Williamsburg Med Spa offers curated medical-grade products selected for ingredient quality, tolerability, and
          practical at-home support between visits.
        </p>
      </div>

      <div className="grid gap-8 lg:gap-10 mt-8 lg:my-12 xl:my-16 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
        {visibleProducts.map((product, i) => (
          <ProductCard key={i} {...product} slug={product.slug} />
        ))}
      </div>
    </>
  );
}
