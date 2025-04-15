import Script from "next/script";

const SITE_NAME = "Ubuntu Med Spa";
const DEFAULT_DESCRIPTION = "";
const ORIGIN = "https://ubuntumedspa.com";

interface StructuredDataProps {
  type: "WebPage" | "Article" | "Breadcrumb" | "Organization" | "FAQ";
  url?: string;
  headline?: string;
  imageUrls?: string[];
  dateModified?: string;
  date?: string;
  breadCrumbs?: string[];
  faqs?: { question: string; answer: string | JSX.Element }[];
}

const author = [
  {
    "@type": "Person",
    name: "Jenny Coleman",
    url: `${ORIGIN}/staff/jenny-coleman`,
  },
];

const getImageUrl = (url: string) => `${ORIGIN}/${url}`;

const getMarkup = ({
  type = "WebPage",
  headline = "Title of a News Article",
  imageUrls = [],
  date = new Date().toISOString(),
  dateModified = new Date().toISOString(),
  faqs = [],
}: StructuredDataProps) => {
  switch (type) {
    case "Organization": {
      return {
        "@context": "https://schema.org",
        "@type": "Organization",
        url: ORIGIN,
        logo: `${ORIGIN}/logo.webp`,
      };
    }
    case "WebPage": {
      return {
        "@context": "https://schema.org",
        "@type": "WebPage",
        name: SITE_NAME,
        description: DEFAULT_DESCRIPTION,
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
  }
};

const StructuredData = (props: StructuredDataProps) => (
  <Script id={`StructureData-${props.type}`} type="application/ld+json">
    {JSON.stringify(getMarkup(props))}
  </Script>
);

export default StructuredData;
