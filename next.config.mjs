import addMDX from "@next/mdx";
import rehypeSlug from "rehype-slug";

/** @type {import("next").NextConfig} */
const nextConfig = {
  async redirects() {
    return [
      {
        source: "/:path*",
        has: [{ type: "host", value: "williamsburgmedspa.com" }],
        destination: "https://www.williamsburgmedspa.com/:path*",
        permanent: true,
      },
      {
        source: "/procedures/feminine-intimacy-prp-protocols",
        destination: "/procedures/o-shot",
        permanent: true,
      },
      {
        source: "/procedures/male-intimacy-prp-protocols",
        destination: "/procedures/p-shot",
        permanent: true,
      },
      {
        source: "/blog/revitalize-sexual-health-female-intimacy-prp-protocols-vaginal-dryness",
        destination: "/blog/o-shot-for-vaginal-dryness-what-to-know",
        permanent: true,
      },
      {
        source: "/procedures/feminine-intimacy-prp-protocols/for/vaginal-dryness",
        destination: "/blog/o-shot-for-vaginal-dryness-what-to-know",
        permanent: true,
      },
      {
        source: "/procedures/feminine-intimacy-prp-protocols/for/urinary-incontinence",
        destination: "/procedures/o-shot/for/urinary-incontinence",
        permanent: true,
      },
      {
        source: "/procedures/feminine-intimacy-prp-protocols/for/dyspareunia",
        destination: "/procedures/o-shot/for/dyspareunia",
        permanent: true,
      },
      {
        source: "/procedures/feminine-intimacy-prp-protocols/for/low-libido",
        destination: "/procedures/o-shot/for/low-libido",
        permanent: true,
      },
      {
        source: "/procedures/feminine-intimacy-prp-protocols/for/sexual-dysfunction",
        destination: "/procedures/o-shot/for/sexual-dysfunction",
        permanent: true,
      },
      {
        source: "/procedures/feminine-intimacy-prp-protocols/for/lichen-sclerosus",
        destination: "/procedures/o-shot/for/lichen-sclerosus",
        permanent: true,
      },
      {
        source: "/procedures/feminine-intimacy-prp-protocols/treating-vaginal-dryness",
        destination: "/blog/o-shot-for-vaginal-dryness-what-to-know",
        permanent: true,
      },
      {
        source: "/procedures/feminine-intimacy-prp-protocols/treating-urinary-incontinence",
        destination: "/procedures/o-shot/for/urinary-incontinence",
        permanent: true,
      },
      {
        source: "/procedures/feminine-intimacy-prp-protocols/treating-dyspareunia",
        destination: "/procedures/o-shot/for/dyspareunia",
        permanent: true,
      },
      {
        source: "/procedures/feminine-intimacy-prp-protocols/treating-low-libido",
        destination: "/procedures/o-shot/for/low-libido",
        permanent: true,
      },
      {
        source: "/procedures/feminine-intimacy-prp-protocols/treating-sexual-dysfunction",
        destination: "/procedures/o-shot/for/sexual-dysfunction",
        permanent: true,
      },
      {
        source: "/procedures/feminine-intimacy-prp-protocols/treating-lichen-sclerosus",
        destination: "/procedures/o-shot/for/lichen-sclerosus",
        permanent: true,
      },
      {
        source: "/affiliates",
        destination: "/consult",
        permanent: true,
      },
      {
        source: "/affiliates/:path*",
        destination: "/consult",
        permanent: true,
      },
      {
        source: "/procedures/blohmdahl-ear-piercing",
        destination: "/procedures/blomdahl-ear-piercing",
        permanent: true,
      },
      {
        source: "/procedures/blohmdahl-ear-piercing/near/:areaSlug",
        destination: "/procedures/blomdahl-ear-piercing/near/:areaSlug",
        permanent: true,
      },
      {
        source: "/blog/medical-ear-piercing-in-williamsburg-va-blohmdahl",
        destination: "/blog/blomdahl-ear-piercing-williamsburg-va",
        permanent: true,
      },
    ];
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com",
        port: "",
        pathname: "/photo-*",
      },
    ],
  },
};

export default addMDX({
  options: {
    remarkPlugins: [],
    rehypePlugins: [rehypeSlug],
  },
})(nextConfig);
