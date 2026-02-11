import { procedures } from "data";
import { createTwitterImage } from "lib/createTwitterImage";
import { generateParagraph } from "./get-seo";

export const alt = async ({ params }: { params: { slug: string } }) => {
  const SEO = procedures.find((med) => med.slug === params.slug)?.seo ?? { title: "Procedure" };
  return `Twitter image for the ${SEO.title} page. ${generateParagraph(SEO.title)}`;
};

export default async function Image({ params }: { params: { slug: string } }) {
  const { title, description } = procedures.find((med) => med.slug === params.slug)?.seo ?? {
    title: "Procedure",
  };

  return createTwitterImage({
    title,
    description,
  });
}
