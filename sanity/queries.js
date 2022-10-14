import client from ".";
import groq from "groq";

const GET_PROCEDURES = `
  *[_type == "procedure"]{
    ...
  }
`;

const GET_PROCEDURE_BY_SLUG = `
  *[_type == "procedure" && slug.current == $slug ][0]{
    ...
  }
`;

export const getProcedures = async () =>
  await client.fetch(groq`${GET_PROCEDURES}`);

export const getProcedure = async (slug) =>
  await client.fetch(groq`${GET_PROCEDURE_BY_SLUG}`, { slug });
