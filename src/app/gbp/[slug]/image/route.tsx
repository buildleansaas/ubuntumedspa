import { GBP_POSTS, getGbpPost } from "config/gbp-posts";
import { createGbpPostImage } from "lib/gbp-post-image";

// Every post image is rendered once at build time; unknown slugs 404.
export const dynamic = "force-static";
export const dynamicParams = false;

export function generateStaticParams() {
  return GBP_POSTS.map((post) => ({ slug: post.slug }));
}

export async function GET(_request: Request, { params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const post = getGbpPost(slug);
  if (!post) {
    return new Response("Not found", { status: 404 });
  }

  return createGbpPostImage({
    template: post.template,
    holiday: post.holiday,
    kicker: post.kicker,
    title: post.title,
    subtitle: post.subtitle,
    priceLine: post.priceLine,
    art: post.art,
  });
}
