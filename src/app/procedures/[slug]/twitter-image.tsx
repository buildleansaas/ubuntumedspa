import { procedures } from "data";
import { createTwitterImage } from "lib/createTwitterImage";
import { generateParagraph } from "./get-seo";

export const alt = async ({ params }: { params: { medication: string } }) => {
  const SEO = procedures.find((med) => med.slug === params.medication)?.seo ?? { title: "Procedure" };
  return `The Opengraph 1200x630 image for the ${
    SEO?.title
  } page with a blue background suitable for a med spa theme, and the description: ${generateParagraph(SEO?.title)}`;
};

export default async function Image({ params }: { params: { medication: string } }) {
  const { title, description } = procedures.find((med) => med.slug === params.medication)?.seo ?? {
    title: "Procedure",
  };

  return createTwitterImage({
    title,
    description,
  });
}
