import { createOpenGraphImage } from "lib/createOpenGraphImage";
import { getPostData } from "./getPostData";

export const alt = async ({ params }: { params: { slug: string } }) => {
  const { metadata } = await getPostData(params.slug);
  const { title } = metadata;
  return `${title}: Williamsburg Med Spa share card with the disco pineapple logo`;
};

export default async function Image({ params }: { params: { slug: string } }) {
  const { metadata } = await getPostData(params.slug);
  const { title, description } = metadata;

  return createOpenGraphImage({
    title,
    description,
  });
}
