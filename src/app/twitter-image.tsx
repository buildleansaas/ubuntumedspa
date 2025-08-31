import { createTwitterImage } from "lib/createTwitterImage";
import { DEFAULT_DESCRIPTION, DEFAULT_TITLE } from "lib/seo";

export const alt = `The Twitter 1200x630 image for the ${DEFAULT_TITLE} page with a blue background suitable for a med spa theme, and the description: ${DEFAULT_DESCRIPTION}`;

export default async function Image() {
  return createTwitterImage({
    title: DEFAULT_TITLE,
    description: DEFAULT_DESCRIPTION,
  });
}
