import Script from "next/script";

const SITE_NAME = "Williamsburg Med Spa";
const DEFAULT_DESCRIPTION = "";
const ORIGIN = "https://www.williamsburgmedspa.com";

type FAQ = { question: string; answer: string | JSX.Element }[];

interface LocalBusinessProps {
  name?: string;
  telephone?: string;
  streetAddress?: string;
  addressLocality?: string;
  addressRegion?: string;
  postalCode?: string;
  addressCountry?: string;
  latitude?: number;
  longitude?: number;
  openingHours?: string[];
  sameAs?: string[];
  url?: string;
  image?: string;
  founderName?: string;
  founderUrl?: string;
}

interface ServiceProps {
  name?: string;
  description?: string;
  areaServed?: string;
  providerName?: string;
  providerUrl?: string;
  price?: string;
  priceCurrency?: string;
}

interface ProductProps {
  name?: string;
  description?: string;
  imageUrls?: string[];
  brandName?: string;
  price?: string;
  priceCurrency?: string;
  url?: string;
  availability?: string;
}

interface StructuredDataProps {
  type:
    | "WebPage"
    | "Article"
    | "Breadcrumb"
    | "Organization"
    | "FAQ"
    | "LocalBusiness"
    | "Service"
    | "Person"
    | "Product";
  url?: string;
  headline?: string;
  description?: string;
  imageUrls?: string[];
  dateModified?: string;
  date?: string;
  breadCrumbs?: string[];
  breadcrumbItems?: { name: string; item: string }[];
  faqs?: FAQ;
  business?: LocalBusinessProps;
  service?: ServiceProps;
  product?: ProductProps;
}

const author = [
  {
    "@type": "Person",
    name: "Jenny Coleman",
    url: `${ORIGIN}/staff/jenny-coleman`,
    sameAs: ["https://pedscalc.com", "https://dearpediatrician.com"],
  },
];

const DEFAULT_BUSINESS: Required<LocalBusinessProps> = {
  name: "Williamsburg Med Spa",
  telephone: "+1-804-738-9483",
  streetAddress: "3900 Powhatan Parkway",
  addressLocality: "Williamsburg",
  addressRegion: "VA",
  postalCode: "23188",
  addressCountry: "US",
  latitude: 37.2707,
  longitude: -76.7075,
  openingHours: [
    "Mo-Fr 18:00-20:00",
    "Sa-Su 10:00-18:00",
  ],
  sameAs: [],
  url: ORIGIN,
  image: `${ORIGIN}/logo.png`,
  founderName: "Jenny Coleman",
  founderUrl: `${ORIGIN}/staff/jenny-coleman`,
};

const getImageUrl = (url: string) => (url.startsWith("http://") || url.startsWith("https://") ? url : `${ORIGIN}${url}`);

const getMarkup = ({
  type = "WebPage",
  url = ORIGIN,
  headline = "Title of a News Article",
  description = DEFAULT_DESCRIPTION,
  imageUrls = [],
  date = new Date().toISOString(),
  dateModified = new Date().toISOString(),
  faqs = [],
  breadCrumbs = [],
  breadcrumbItems = [],
  business,
  service,
  product,
}: StructuredDataProps) => {
  switch (type) {
    case "Organization": {
      return {
        "@context": "https://schema.org",
        "@type": "Organization",
        url: ORIGIN,
        logo: `${ORIGIN}/logo.png`,
        name: SITE_NAME,
      };
    }
    case "WebPage": {
      return {
        "@context": "https://schema.org",
        "@type": "WebPage",
        name: SITE_NAME,
        description,
        url: ORIGIN,
      };
    }
    case "Article": {
      return {
        "@context": "https://schema.org",
        "@type": "BlogPosting",
        headline,
        image: imageUrls.map(getImageUrl),
        datePublished: date,
        dateModified,
        author,
        publisher: {
          "@type": "Organization",
          name: SITE_NAME,
          logo: {
            "@type": "ImageObject",
            url: `${ORIGIN}/logo.png`,
          },
        },
        mainEntityOfPage: {
          "@type": "WebPage",
          "@id": url.startsWith("http://") || url.startsWith("https://") ? url : `${ORIGIN}${url}`,
        },
        description,
      };
    }
    case "FAQ": {
      return {
        "@context": "https://schema.org",
        "@type": "FAQPage",
        mainEntity: faqs.map(({ question, answer }) => ({
          "@type": "Question",
          name: question,
          acceptedAnswer: {
            "@type": "Answer",
            text: answer,
          },
        })),
      };
    }
    case "Breadcrumb": {
      const itemListElement = breadcrumbItems.length
        ? breadcrumbItems.map(({ name, item }, index) => ({
            "@type": "ListItem",
            position: index + 1,
            name,
            item,
          }))
        : breadCrumbs.map((name, index) => {
            let path = "";
            for (let i = 1; i <= index; i += 1) {
              const slug = breadCrumbs[i]
                .toLowerCase()
                .replace(/[^a-z0-9]+/g, "-")
                .replace(/(^-|-$)/g, "");
              path += `/${slug}`;
            }
            return {
              "@type": "ListItem",
              position: index + 1,
              name,
              item: `${ORIGIN}${index === 0 ? "" : path}`,
            };
          });
      return {
        "@context": "https://schema.org",
        "@type": "BreadcrumbList",
        itemListElement,
      };
    }
    case "LocalBusiness": {
      const b = { ...DEFAULT_BUSINESS, ...(business || {}) };
      return {
        "@context": "https://schema.org",
        "@type": "MedicalBusiness",
        name: b.name,
        url: b.url,
        image: b.image,
        telephone: b.telephone,
        address: {
          "@type": "PostalAddress",
          streetAddress: b.streetAddress,
          addressLocality: b.addressLocality,
          addressRegion: b.addressRegion,
          postalCode: b.postalCode,
          addressCountry: b.addressCountry,
        },
        geo: {
          "@type": "GeoCoordinates",
          latitude: b.latitude,
          longitude: b.longitude,
        },
        openingHours: b.openingHours,
        sameAs: b.sameAs,
        founder: {
          "@type": "Person",
          name: b.founderName,
          url: b.founderUrl,
        },
      };
    }
    case "Service": {
      const s = service || {};
      return {
        "@context": "https://schema.org",
        "@type": "Service",
        name: s.name || headline,
        description: s.description || description,
        areaServed: s.areaServed || "Williamsburg, VA",
        provider: {
          "@type": "MedicalBusiness",
          name: s.providerName || DEFAULT_BUSINESS.name,
          url: s.providerUrl || DEFAULT_BUSINESS.url,
        },
        offers:
          s.price && s.priceCurrency
            ? {
                "@type": "Offer",
                price: s.price,
                priceCurrency: s.priceCurrency,
              }
            : undefined,
      };
    }
    case "Product": {
      const p = product || {};
      const productImages = (p.imageUrls || imageUrls).map(getImageUrl);

      return {
        "@context": "https://schema.org",
        "@type": "Product",
        name: p.name || headline,
        description: p.description || description,
        image: productImages,
        brand: {
          "@type": "Brand",
          name: p.brandName || SITE_NAME,
        },
        offers:
          p.price && p.priceCurrency
            ? {
                "@type": "Offer",
                price: p.price,
                priceCurrency: p.priceCurrency,
                url: p.url ? getImageUrl(p.url) : undefined,
                availability: p.availability || "https://schema.org/InStock",
              }
            : undefined,
      };
    }
    case "Person": {
      return {
        "@context": "https://schema.org",
        "@type": "Person",
        name: author[0].name,
        url: author[0].url,
        jobTitle: "Aesthetic Nurse Practitioner",
        image: `${ORIGIN}/jenny.jpg`,
        sameAs: author[0].sameAs,
        affiliation: {
          "@type": "MedicalBusiness",
          name: DEFAULT_BUSINESS.name,
          url: DEFAULT_BUSINESS.url,
        },
      };
    }
  }
};

const StructuredData = (props: StructuredDataProps) => (
  <Script id={`StructureData-${props.type}`} type="application/ld+json">
    {JSON.stringify(getMarkup(props))}
  </Script>
);

export default StructuredData;
