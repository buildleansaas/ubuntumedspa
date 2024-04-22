import { articles as slugs } from "app/sitemap";

import Link from "next/link";
import Image from "next/image";
import { Badge } from "components/ui/badge";

export default async function LatestPosts() {
  const articles = (await Promise.all(slugs.map((slug) => import(`markdown/${slug}.mdx`))))
    .map(({ metadata }, index) => ({ ...metadata, slug: slugs[index] }))
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, 3);

  return (
    <div className="mx-auto max-w-2xl lg:max-w-4xl">
      <div className="my-16 sm:my-24 lg:my-32">
        <h2 className="sm:text-center text-4xl/snug sm:text-5xl/snug md:text-6xl/snug font-light tracking-tight text-white">
          Ubuntu Med Spa Blog
        </h2>
        <p className="text-lg lg:text-xl mb-8 max-w-5xl mx-auto text-center">
          Explore the Ubuntu Med Spa Blog to unravel the science behind Plasma Rich Platelet (PRP) therapy. Our
          insightful posts are here to help you understand PRP benefits and procedures, guiding you on your journey to
          improved health and wellness.
        </p>
      </div>
      <div className="mt-16 space-y-20 lg:mt-20 lg:space-y-20">
        {articles.map((article) => (
          <article key={article.slug} className="relative isolate flex flex-col gap-8 lg:flex-row">
            <div className="relative aspect-[16/9] sm:aspect-[2/1] lg:aspect-square lg:w-64 lg:shrink-0 bg-gray-50">
              <Image src={article.image} alt="" fill className="object-cover" />
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
                <h2 className="mt-3 text-lg/snug sm:text-xl/snug md:text-2xl/snug font-semibold text-white-900 hover:text-blue-200">
                  <Link href={`/blog/${article.slug}`}>{article.title}</Link>
                </h2>
                <p className="mt-2 text-sm leading-6 text-white">{article.description}</p>
              </div>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}
