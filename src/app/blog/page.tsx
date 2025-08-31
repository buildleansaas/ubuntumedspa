import { articles as slugs } from "app/sitemap";
import Image from "next/image";
import Link from "next/link";
import CtaFooter from "components/cta-footer";

export default async function BlogPage() {
  const articles = (await Promise.all(slugs.map((slug) => import(`markdown/${slug}.mdx`))))
    .map(({ metadata }, index) => ({ ...metadata, slug: slugs[index] }))
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  return (
    <div className="mx-auto max-w-2xl lg:max-w-4xl">
      <h2 className="sm:text-center text-4xl/snug sm:text-5xl/snug md:text-6xl/snug font-bold tracking-tight text-primary-content mb-16 sm:mb-24 lg:mb-32">
        Williamsburg Med Spa Blog
      </h2>
      <div className="mt-16 space-y-20 lg:mt-20 lg:space-y-20">
        {articles.map((article) => (
          <article key={article.slug} className="relative isolate flex flex-col gap-8 lg:flex-row">
            <div className="relative aspect-[16/9] sm:aspect-[2/1] lg:aspect-square lg:w-64 lg:shrink-0 bg-base-200">
              <Image src={article.image} alt="" fill className="object-cover" />
              <div className="absolute inset-0 shadow-inner bg-gradient-to-br from-white/20" />
            </div>
            <div className="py-4">
              <div className="flex flex-wrap items-center text-xs">
                <time dateTime={new Date(article.date).toISOString()} className="w-full sm:w-auto text-primary-content mr-6 mb-2">
                  {new Date(article.date).toLocaleDateString("en-GB", {
                    dateStyle: "long",
                  })}
                </time>
                {article.tags.map((tag) => (
                  <div key={tag} className="rounded-lg px-2 py-1 bg-white text-black -ml-1 mr-3 mb-2">
                    {tag}
                  </div>
                ))}
              </div>
              <div className="group relative max-w-xl">
                <h2 className="mt-3 text-lg/snug sm:text-xl/snug md:text-2xl/snug font-semibold text-base-content group-hover:text-base-content/80">
                  <Link
                    href={`/blog/${article.slug}`}
                    className="rounded-lg focus:outline-none focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-gray-200"
                  >
                    <span className="absolute inset-0" />
                    {article.title}
                  </Link>
                </h2>
                <p className="mt-5 text-sm leading-6 text-primary-content">{article.description}</p>
              </div>
            </div>
          </article>
        ))}
      </div>
      <CtaFooter />
    </div>
  );
}
