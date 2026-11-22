import { createOpenGraphImage } from "lib/createOpenGraphImage";

/** Twitter uses the same 1200x630 share card as Open Graph. */
export async function createTwitterImage(properties: { title?: string; description?: string }) {
  return createOpenGraphImage(properties);
}
