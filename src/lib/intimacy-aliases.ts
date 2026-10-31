const LEGACY_INTIMACY_PROCEDURE_SLUG_ALIASES = {
  "feminine-intimacy-prp-protocols": "oh-shot",
  "o-shot": "oh-shot",
  "male-intimacy-prp-protocols": "p-shot",
} as const;

const LEGACY_INTIMACY_PROCEDURE_NAME_ALIASES = {
  "Feminine Intimacy PRP Protocols": "OH-Shot",
  "Male Intimacy PRP Protocols": "P-Shot",
  "O Shot": "OH-Shot",
  "O-Shot": "OH-Shot",
  "O-Shot®": "OH-Shot",
  "Oshot": "OH-Shot",
  "OSHOT": "OH-Shot",
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
