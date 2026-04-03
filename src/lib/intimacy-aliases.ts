const LEGACY_INTIMACY_PROCEDURE_SLUG_ALIASES = {
  "feminine-intimacy-prp-protocols": "o-shot",
  "male-intimacy-prp-protocols": "p-shot",
} as const;

const LEGACY_INTIMACY_PROCEDURE_NAME_ALIASES = {
  "Feminine Intimacy PRP Protocols": "O-Shot",
  "Male Intimacy PRP Protocols": "P-Shot",
  "O Shot": "O-Shot",
  "P Shot": "P-Shot",
} as const;

export const normalizeIntimacyProcedureSlug = (slug: string) =>
  LEGACY_INTIMACY_PROCEDURE_SLUG_ALIASES[
    slug as keyof typeof LEGACY_INTIMACY_PROCEDURE_SLUG_ALIASES
  ] ?? slug;

export const normalizeIntimacyProcedureName = (name: string) =>
  LEGACY_INTIMACY_PROCEDURE_NAME_ALIASES[
    name as keyof typeof LEGACY_INTIMACY_PROCEDURE_NAME_ALIASES
  ] ?? name;

export const normalizeIntimacyProcedureNames = (names: string[]) =>
  Array.from(new Set(names.map((name) => normalizeIntimacyProcedureName(name))));
