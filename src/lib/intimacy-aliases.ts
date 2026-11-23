const LEGACY_INTIMACY_PROCEDURE_SLUG_ALIASES = {
  "feminine-intimacy-prp-protocols": "oh-shot",
  "o-shot": "oh-shot",
  "male-intimacy-prp-protocols": "pe-shot",
  "p-shot": "pe-shot",
} as const;

const LEGACY_INTIMACY_PROCEDURE_NAME_ALIASES = {
  "Feminine Intimacy PRP Protocols": "Feminine Intimacy Protocol",
  "Male Intimacy PRP Protocols": "Male Intimacy Protocol",
  "O Shot": "Feminine Intimacy Protocol",
  "O-Shot": "Feminine Intimacy Protocol",
  "O-Shot®": "Feminine Intimacy Protocol",
  "Oshot": "Feminine Intimacy Protocol",
  "OSHOT": "Feminine Intimacy Protocol",
  "P Shot": "Male Intimacy Protocol",
  "P-Shot": "Male Intimacy Protocol",
  "P-Shot®": "Male Intimacy Protocol",
  "Priapus Shot": "Male Intimacy Protocol",
  "Pshot": "Male Intimacy Protocol",
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
