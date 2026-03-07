import type { Metadata } from "next";

const SITE_NAME = "Williamsburg Med Spa";

const toPath = (value: string) => (value.startsWith("/") ? value : `/${value}`);

export const buildPageMetadata = ({
  title,
  description,
  canonical,
  image = "/opengraph-image",
}: {
  title: string;
  description: string;
  canonical: string;
  image?: string;
}): Metadata => {
  const canonicalPath = toPath(canonical);

  return {
    title,
    description,
    alternates: { canonical: canonicalPath },
    openGraph: {
      title,
      description,
      siteName: SITE_NAME,
      url: canonicalPath,
      images: [{ url: image, alt: title }],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [image],
    },
  };
};
