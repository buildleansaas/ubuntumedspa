import client from ".";
import groq from "groq";

const GET_PROCEDURES = `
  *[_type == "procedure"]{
    ...
  }
`;

export const getProcedures = async () =>
  await client.fetch(groq`${GET_PROCEDURES}`);
