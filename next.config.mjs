import addMDX from "@next/mdx";
import rehypeSlug from "rehype-slug";
import remarkGfm from "remark-gfm";

/** @type {import("next").NextConfig} */
const nextConfig = {
  async redirects() {
    return [
      {
        source: "/:path*",
        has: [{ type: "host", value: "williamsburgmedspa.com" }],
        destination: "https://www.williamsburgmedspa.com/:path*",
        statusCode: 308,
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
        destination: "/procedures/o-shot",
        permanent: true,
      },
      {
        source: "/procedures/feminine-intimacy-prp-protocols/for/dyspareunia",
        destination: "/procedures/o-shot",
        permanent: true,
      },
      {
        source: "/procedures/feminine-intimacy-prp-protocols/for/low-libido",
        destination: "/procedures/o-shot",
        permanent: true,
      },
      {
        source: "/procedures/feminine-intimacy-prp-protocols/for/sexual-dysfunction",
        destination: "/procedures/o-shot",
        permanent: true,
      },
      {
        source: "/procedures/feminine-intimacy-prp-protocols/for/lichen-sclerosus",
        destination: "/procedures/o-shot",
        permanent: true,
      },
      {
        source: "/procedures/feminine-intimacy-prp-protocols/treating-vaginal-dryness",
        destination: "/blog/o-shot-for-vaginal-dryness-what-to-know",
        permanent: true,
      },
      {
        source: "/procedures/feminine-intimacy-prp-protocols/treating-urinary-incontinence",
        destination: "/procedures/o-shot",
        permanent: true,
      },
      {
        source: "/procedures/feminine-intimacy-prp-protocols/treating-dyspareunia",
        destination: "/procedures/o-shot",
        permanent: true,
      },
      {
        source: "/procedures/feminine-intimacy-prp-protocols/treating-low-libido",
        destination: "/procedures/o-shot",
        permanent: true,
      },
      {
        source: "/procedures/feminine-intimacy-prp-protocols/treating-sexual-dysfunction",
        destination: "/procedures/o-shot",
        permanent: true,
      },
      {
        source: "/procedures/feminine-intimacy-prp-protocols/treating-lichen-sclerosus",
        destination: "/procedures/o-shot",
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
      // 2026-10 consolidation: fold thin or duplicate pages into one owner per intent.
      // See docs/seo/piercing-consolidation-2026-10.md.
      ...[
        ["/blog/medical-ear-piercing-in-williamsburg-va-blohmdahl", "/procedures/blomdahl-ear-piercing"],
        ["/blog/blomdahl-ear-piercing-williamsburg-va", "/procedures/blomdahl-ear-piercing"],
        ["/blog/ear-piercing-cost-williamsburg-va", "/procedures/blomdahl-ear-piercing"],
        ["/blog/baby-ear-piercing-williamsburg-va", "/procedures/blomdahl-ear-piercing/for/children"],
        ["/blog/childrens-first-ear-piercing-williamsburg-va", "/procedures/blomdahl-ear-piercing/for/children"],
        ["/blog/pediatric-nurse-ear-piercing-williamsburg-va", "/procedures/blomdahl-ear-piercing/for/children"],
        ["/procedures/blomdahl-ear-piercing/for/babies", "/procedures/blomdahl-ear-piercing/for/children"],
        ["/blog/hypoallergenic-ear-piercing-sensitive-skin", "/procedures/blomdahl-ear-piercing/for/sensitive-ears"],
        ["/blog/ear-re-piercing-williamsburg-va", "/procedures/blomdahl-ear-piercing/for/re-piercing"],
        ["/procedures/blomdahl-ear-piercing/near/james-city-county-va", "/procedures/blomdahl-ear-piercing/near/williamsburg-va"],
        ["/procedures/blomdahl-ear-piercing/near/toano-va", "/procedures/blomdahl-ear-piercing/near/williamsburg-va"],
        ["/procedures/blomdahl-ear-piercing/near/norge-va", "/procedures/blomdahl-ear-piercing/near/williamsburg-va"],
        ["/procedures/blomdahl-ear-piercing/near/lightfoot-va", "/procedures/blomdahl-ear-piercing/near/williamsburg-va"],
        ["/procedures/blomdahl-ear-piercing/near/new-town-va", "/procedures/blomdahl-ear-piercing/near/williamsburg-va"],
        ["/procedures/blomdahl-ear-piercing/near/kingsmill-va", "/procedures/blomdahl-ear-piercing/near/williamsburg-va"],
        ["/procedures/blomdahl-ear-piercing/near/fords-colony-va", "/procedures/blomdahl-ear-piercing/near/williamsburg-va"],
        ["/locations/toano-va", "/locations/williamsburg-va"],
        ["/locations/norge-va", "/locations/williamsburg-va"],
        ["/locations/lightfoot-va", "/locations/williamsburg-va"],
        ["/locations/new-town-va", "/locations/williamsburg-va"],
        ["/locations/kingsmill-va", "/locations/williamsburg-va"],
        ["/locations/fords-colony-va", "/locations/williamsburg-va"],
        ["/procedures/botox/near/williamsburg-va", "/procedures/botox"],
        ["/procedures/filler/near/williamsburg-va", "/procedures/filler"],
        ["/procedures/xeomin/near/williamsburg-va", "/procedures/xeomin"],
        ["/procedures/botox/for/:ailmentSlug", "/procedures/botox"],
        ["/procedures/filler/for/:ailmentSlug", "/procedures/filler"],
        ["/procedures/o-shot/for/:ailmentSlug", "/procedures/o-shot"],
        ["/procedures/hyperhidrosis-treatment/for/:ailmentSlug", "/procedures/hyperhidrosis-treatment"],
        ["/blog/beginners-guide-to-platelet-rich-plasma-therapy", "/procedures"],
        ["/blog/naturally-heal-joint-pain-prp-therapy", "/procedures/joint-restoration"],
        ["/blog/hair-loss-got-you-down-discover-prp-your-new-ally-in-hair-restoration", "/procedures/prp-hair-restoration"],
        ["/blog/unleashing-the-power-of-the-prp-facelift-your-non-surgical-key-to-youthful-skin", "/procedures/prp-face-lift"],
      ].map(([source, destination]) => ({ source, destination, permanent: true })),
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
    remarkPlugins: [remarkGfm],
    rehypePlugins: [rehypeSlug],
  },
})(nextConfig);
