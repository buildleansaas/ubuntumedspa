import { ProductCard } from "components/product-card";
import Image from "next/image";
import Link from "next/link";

import { products } from "data";
import { humanizeMedicalCopy } from "lib/humanize";

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
    // Tidewater: same heading, intro and product links, as a quiet list with small photos.
    return (
      <section className="w-full scroll-mt-28 py-16 md:py-24" id="home-products" aria-labelledby="home-products-heading">
        <div className="max-w-3xl">
          <p className="text-sm text-base-content/65">For pickup</p>
          <Heading
            id="home-products-heading"
            className="font-display mt-3 text-3xl leading-tight tracking-tight text-base-content md:text-[2.6rem]"
          >
            Skincare Products
          </Heading>
          <p className="mt-5 max-w-[65ch] text-base leading-relaxed text-base-content/75">
            Products available for pickup at Williamsburg Med Spa. Ask Jenny which fits your routine.
          </p>
        </div>

        <ul className="mt-10 grid grid-cols-1 gap-x-12 border-t border-base-300 md:grid-cols-2">
          {visibleProducts.map((product) => (
            <li key={product.slug} className="flex gap-5 border-b border-base-300 py-6">
              <Link href={`/products/${product.slug}`} className="relative h-20 w-20 shrink-0 overflow-hidden rounded-lg bg-base-200" tabIndex={-1} aria-hidden="true">
                <Image fill src={product.image} alt={product.name} sizes="80px" quality={70} className="object-cover" />
              </Link>
              <div className="min-w-0">
                <h3 className="font-display text-xl leading-snug text-base-content">
                  <Link href={`/products/${product.slug}`} className="rounded-sm transition-colors hover:text-secondary">
                    {product.name}
                  </Link>
                </h3>
                <p className="mt-1.5 text-[0.95rem] leading-relaxed text-base-content/75">{humanizeMedicalCopy(product.headline)}</p>
                <p className="mt-1 text-sm leading-relaxed text-base-content/60">{humanizeMedicalCopy(product.subline)}</p>
                <Link href={`/products/${product.slug}`} className="mt-2 inline-block rounded-sm text-sm text-secondary hover:text-base-content">
                  Learn More<span className="sr-only"> about {humanizeMedicalCopy(product.headline)}</span>
                </Link>
              </div>
            </li>
          ))}
        </ul>
      </section>
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
