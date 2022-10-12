import { createClient } from "next-sanity";
import createImageUrlBuilder from "@sanity/image-url";

export const config = {
  dataset: "production",
  projectId: "bfayeq8g",
  useCdn: process.env.NODE_ENV === "production",
  apiVersion: "2022-01-31",
};

export const imageBuilder = (source) =>
  createImageUrlBuilder(config).image(source);
export const client = createClient(config);
export default client;
