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

interface StructuredDataProps {
  type:
    | "WebPage"
    | "Article"
    | "Breadcrumb"
    | "Organization"
    | "FAQ"
    | "LocalBusiness"
    | "Service"
    | "Person";
  url?: string;
  headline?: string;
  description?: string;
  imageUrls?: string[];
  dateModified?: string;
  date?: string;
  breadCrumbs?: string[];
  faqs?: FAQ;
  business?: LocalBusinessProps;
  service?: ServiceProps;
}

const author = [
  {
    "@type": "Person",
    name: "Jenny Brady",
    url: `${ORIGIN}/staff/jenny-brady`,
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
  founderName: "Jenny Brady",
  founderUrl: `${ORIGIN}/staff/jenny-brady`,
};

const getImageUrl = (url: string) => `${ORIGIN}/${url}`;

const getMarkup = ({
  type = "WebPage",
  headline = "Title of a News Article",
  description = DEFAULT_DESCRIPTION,
  imageUrls = [],
  date = new Date().toISOString(),
  dateModified = new Date().toISOString(),
  faqs = [],
  breadCrumbs = [],
  business,
  service,
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
        "@type": "NewsArticle",
        headline,
        image: imageUrls.map(getImageUrl),
        datePublished: date,
        dateModified,
        author,
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
      // Treat as BreadcrumbList; build incremental URLs if possible
      let path = "";
      const itemListElement = breadCrumbs.map((name, index) => {
        if (index > 0) {
          const slug = name
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
    case "Person": {
      return {
        "@context": "https://schema.org",
        "@type": "Person",
        name: author[0].name,
        url: author[0].url,
        jobTitle: "Aesthetic Nurse Practitioner",
        image: `${ORIGIN}/jenny.jpg`,
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
