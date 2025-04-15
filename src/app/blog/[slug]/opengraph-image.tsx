import { createOpenGraphImage } from "lib/createOpenGraphImage";
import { getPostData } from "./getPostData";

export const alt = async ({ params }: { params: { slug: string } }) => {
  const { metadata } = await getPostData(params);
  const { title, description } = metadata;
  return `The Opengraph 1200x630 image for the ${title}page with a blue background suitable for a med spa theme, and the description:${description}`;
};

export default async function Image({ params }: { params: { slug: string } }) {
  const { metadata } = await getPostData(params);
  const { title, description } = metadata;

  return createOpenGraphImage({
    title,
    description,
  });
}
