import { procedures } from "data";
import { createOpenGraphImage } from "lib/createOpenGraphImage";
import { generateParagraph } from "./get-seo";

export const alt = ({ params }: { params: { slug: string } }) => {
  const { title } = procedures.find((med) => med.slug === params.slug)?.seo ?? { title: "Procedure" };
  return `The Opengraph 1200x630 image for the ${title}page with a blue background suitable for a med spa theme, and the description:${generateParagraph(
    title
  )}`;
};

export default async function Image({ params }: { params: { slug: string } }) {
  const { title, description } = procedures.find((med) => med.slug === params.slug)?.seo ?? {
    title: "Procedure",
  };
  return createOpenGraphImage({
    title,
    description,
  });
}
