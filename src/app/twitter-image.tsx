import { createTwitterImage } from "lib/createTwitterImage";
import { DEFAULT_DESCRIPTION, DEFAULT_TITLE } from "lib/seo";

export const alt = "Williamsburg Med Spa: medical spa in Williamsburg, VA, with the disco pineapple logo";

export default async function Image() {
  return createTwitterImage({
    title: DEFAULT_TITLE,
    description: DEFAULT_DESCRIPTION,
  });
}
