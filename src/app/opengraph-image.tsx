import { createOpenGraphImage } from "lib/createOpenGraphImage";
import { DEFAULT_DESCRIPTION, DEFAULT_TITLE } from "lib/seo";

export const alt = `The Opengraph 1200x630 image for the ${DEFAULT_TITLE} page : Williamsburg Med Spa share card with the disco pineapple logo. ${DEFAULT_DESCRIPTION}`;

export default async function Image() {
  return createOpenGraphImage({
    title: DEFAULT_TITLE,
    description: DEFAULT_DESCRIPTION,
  });
}
