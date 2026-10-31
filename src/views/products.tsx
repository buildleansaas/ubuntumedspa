import { ProductCard } from "components/product-card";
import { products } from "data";

type HeadingTag = "h1" | "h2";

export default function Products({
  headingTag = "h2",
  variant = "default",
}: {
  headingTag?: HeadingTag;
  variant?: "default" | "editorial";
}) {
  const Heading = headingTag;
  const visibleProducts = products.filter((product) => !("published" in product) || product.published !== false);

  if (variant === "editorial") {
    return (
      <section className="scroll-mt-28 border-t border-base-300 py-16 md:py-24" id="home-products" aria-labelledby="home-products-heading">
        <div className="max-w-3xl">
          <p className="eyebrow">Between visits</p>
          <Heading
            id="home-products-heading"
            className="font-display mt-4 text-4xl font-medium leading-[1.12] tracking-tight text-base-content md:text-5xl"
          >
            Medical Grade Beauty Products
          </Heading>
          <p className="mt-5 max-w-[65ch] text-base leading-relaxed text-base-content/85 md:text-lg">
            Williamsburg Med Spa offers curated medical-grade products selected for ingredient quality, tolerability, and
            practical at-home support between visits.
          </p>
        </div>

        <div className="mt-12 grid grid-cols-1 gap-x-8 gap-y-14 sm:grid-cols-2 lg:grid-cols-3">
          {visibleProducts.map((product) => (
            <ProductCard key={product.slug} {...product} slug={product.slug} tone="editorial" />
          ))}
        </div>
      </section>
    );
  }

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
