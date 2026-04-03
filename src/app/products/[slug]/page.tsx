import type { Metadata } from "next";
import { products } from "data";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";

import { Badge } from "components/ui/badge";
import { Button } from "components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "components/ui/card";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "components/ui/accordion";

import CtaFooter from "components/cta-footer";
import CatalogPurchasePanel from "components/catalog-purchase-panel";
import OpenCartButton from "components/open-cart-button";
import StructuredData from "components/structured-data";
import CtaButtons from "components/cta-buttons";
import { getPublishedBlogPosts } from "lib/blog";
import { buildPageMetadata } from "lib/metadata";
import { getCatalogConfigBySlug } from "config/commerce-catalog";
import { humanizeMedicalCopy } from "lib/humanize";

type Params = { params: { slug: string } };

export async function generateMetadata({ params: { slug } }: Params): Promise<Metadata> {
  const product = products.find((entry) => entry.slug === slug);

  if (!product) {
    return {
      title: "Product",
      description: "",
    };
  }

  return buildPageMetadata({
    title: `${product.name} in Williamsburg, VA | Williamsburg Med Spa`,
    description: humanizeMedicalCopy(product.description),
    canonical: `/products/${product.slug}`,
    image: product.image,
    robots: "published" in product && product.published === false ? { index: false, follow: false } : undefined,
  });
}

export default async function ProductPage({ params: { slug } }: Params) {
  const product = products.find((entry) => entry.slug === slug);
  if (!product) return notFound();
  const catalogItem = getCatalogConfigBySlug(slug);

  const articles = (await getPublishedBlogPosts())
    .filter(({ tags }) => tags?.includes(product.name))
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  return (
    <>
      <StructuredData
        type="Breadcrumb"
        breadcrumbItems={[
          { name: "Home", item: "https://www.williamsburgmedspa.com/" },
          { name: "Products", item: "https://www.williamsburgmedspa.com/products" },
          { name: product.name, item: `https://www.williamsburgmedspa.com/products/${product.slug}` },
        ]}
      />
      <StructuredData
        type="Product"
        product={{
          name: product.name,
          description: humanizeMedicalCopy(product.description),
          imageUrls: [product.image],
          price: catalogItem ? String(catalogItem.unitAmountCents / 100) : undefined,
          priceCurrency: "USD",
          url: `https://www.williamsburgmedspa.com/products/${product.slug}`,
        }}
      />
      <StructuredData type="FAQ" faqs={product.faqs} />
      <div className="max-w-7xl mx-auto py-16">
        <div className="text-center">
          <h1 className="text-4xl/snug sm:text-5xl/snug md:text-6xl/snug mx-auto leading-tight pb-4">{product.name}</h1>
          <p className="text-xl lg:text-2xl mb-8 max-w-5xl mx-auto font-light">{humanizeMedicalCopy(product.headline)}</p>
          <p className="text-lg max-w-4xl mx-auto mb-8">{humanizeMedicalCopy(product.description)}</p>
          <p className="text-xs md:text-sm text-base-content/60 max-w-3xl mx-auto mb-8">
            Product information is educational and does not replace medical guidance. Ask your provider whether a
            product is appropriate for your skin type and goals.
          </p>
          {catalogItem ? (
            <CatalogPurchasePanel
              slug={catalogItem.slug}
              kind={catalogItem.kind}
              name={catalogItem.name}
              displayPrice={catalogItem.displayPrice}
              pricingMode={catalogItem.pricingMode}
              unitAmountCents={catalogItem.unitAmountCents}
              quantityLabel={catalogItem.quantityLabel}
              minQuantity={catalogItem.minQuantity}
              maxQuantity={catalogItem.maxQuantity}
              fulfillment={catalogItem.fulfillment}
              customerNote={catalogItem.customerNote}
            />
          ) : (
            <CtaButtons />
          )}
        </div>

        <div className="my-32 text-center max-w-5xl mx-auto" id="benefits">
          <h2 className="text-2xl md:text-4xl mx-auto leading-tight pb-4 text-center font-light">
            <span className="font-bold">{product.name}</span> Benefits
          </h2>
          <h2 className="text-xl lg:text-2xl mb-8 font-light">{humanizeMedicalCopy(product.benefitsHeadline)}</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
            {product.benefits.map(({ emoji, benefit, description }) => (
              <Card key={benefit} className="border-4 border-primary bg-primary text-left text-primary-content">
                <CardHeader>
                  <CardTitle>
                    {emoji} {benefit}
                  </CardTitle>
                </CardHeader>
                <CardContent>{humanizeMedicalCopy(description)}</CardContent>
              </Card>
            ))}
          </div>
          <CtaButtons />
        </div>

        <div className="my-32 text-center max-w-5xl mx-auto" id="faqs">
          <h2 className="text-2xl md:text-4xl mx-auto leading-tight pb-4 text-center font-light">
            Frequently Asked Questions about <span className="font-bold">{product.name}</span>
          </h2>
          <h2 className="text-xl lg:text-2xl mb-8 font-light">{humanizeMedicalCopy(product.faqHeadline)}</h2>
          <Accordion type="single" collapsible className="text-left">
            {product.faqs.map(({ question, answer }) => (
              <AccordionItem key={question} value={question}>
                <AccordionTrigger>{question}</AccordionTrigger>
                <AccordionContent>{answer}</AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
          <div className="flex flex-col lg:flex-row lg:justify-center xl:items-center mt-12 space-x-4">
            {Boolean(articles.length) && (
              <>
                <OpenCartButton>View Cart</OpenCartButton>

                <Button asChild variant="secondary">
                  <Link href="#posts">Learn More</Link>
                </Button>
              </>
            )}
          </div>
        </div>

        {Boolean(articles.length) && (
          <div className="my-32" id="posts">
            <div className="mb-16">
              <h2 className="text-2xl md:text-4xl mx-auto leading-tight pb-4 text-center font-light">
                More About <span className="font-semibold">{product.name}</span>
              </h2>
              <p className="text-lg lg:text-xl max-w-5xl mx-auto text-center">{humanizeMedicalCopy(product.blogHeadline)}</p>
            </div>
            <div className="max-w-3xl mx-auto">
              {articles.map((article) => (
                <article key={article.slug} className="relative isolate flex flex-col gap-8 lg:flex-row">
                  <div className="relative aspect-[16/9] bg-base-200 sm:aspect-[2/1] lg:aspect-square lg:w-64 lg:shrink-0">
                    <Image
                      src={article.image}
                      alt={article.imageAlt ?? article.title}
                      fill
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 80vw, 256px"
                      className="object-cover"
                    />
                    <div className="absolute inset-0 shadow-inner bg-gradient-to-br from-white/20" />
                  </div>
                  <div className="py-4">
                    <div className="flex flex-wrap items-center text-xs gap-2">
                      <Badge className="bg-purple-500 hover:bg-purple-600">
                        {new Date(article.date).toLocaleDateString("en-GB", {
                          dateStyle: "long",
                        })}
                      </Badge>
                      {article.tags.map((tag) => (
                        <Badge key={tag} className="bg-blue-500 hover:bg-blue-600">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                    <div className="group relative max-w-xl">
                      <h2 className="mt-3 text-lg/snug sm:text-xl/snug md:text-2xl/snug font-semibold text-base-content hover:text-primary">
                        <Link href={`/blog/${article.slug}`}>{article.title}</Link>
                      </h2>
                      <p className="mt-2 text-sm leading-6 text-base-content/70">
                        {humanizeMedicalCopy(article.description)}
                      </p>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          </div>
        )}
        <CtaFooter />
      </div>
    </>
  );
}
