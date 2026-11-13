import { AFTER_HEADER, CARD_GRID, Section, SectionHeader } from "components/layout";
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
      <Section id="home-products" labelledBy="home-products-heading">
        <SectionHeader
          as={Heading}
          id="home-products-heading"
          eyebrow="For pickup"
          title="Skincare Products"
          intro="Products available for pickup at Williamsburg Med Spa. Ask Jenny which fits your routine."
        />

        <div className={`${AFTER_HEADER} ${CARD_GRID}`}>
          {visibleProducts.map((product) => (
            <ProductCard key={product.slug} {...product} slug={product.slug} tone="editorial" />
          ))}
        </div>
      </Section>
    );
  }

  return (
    <>
      <div className="text-center" id="services">
        <Heading className="text-4xl/snug sm:text-5xl/snug md:text-6xl/snug font-light mx-auto leading-tight pb-4">
          Skincare Products
        </Heading>
        <p className="text-lg lg:text-xl mb-8 max-w-5xl mx-auto">
          Products available for pickup at Williamsburg Med Spa. Ask Jenny which fits your routine.
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
