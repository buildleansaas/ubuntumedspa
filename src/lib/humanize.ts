const REPLACEMENTS: Array<[RegExp, string]> = [
  [/\bgroundbreaking\b/gi, "advanced"],
  [/\brevolutionary\b/gi, "modern"],
  [/\btransformative\b/gi, "meaningful"],
  [/\blife-changing\b/gi, "meaningful"],
  [/\bultimate cure\b/gi, "supportive option"],
  [/\bgame-changer\b/gi, "helpful option"],
  [/\bboasts\b/gi, "offers"],
  [/\bmiracle\b/gi, "option"],
  [/\bepitome\b/gi, "example"],
  [/\breverse aging\b/gi, "address visible aging concerns"],
  [/\bfor good\b/gi, "over time"],
  [/\berase\b/gi, "soften"],
  [/\beliminate\b/gi, "reduce"],
  [/\bcure\b/gi, "support"],
];

export const humanizeMedicalCopy = (text: string) => {
  if (!text) return text;

  return REPLACEMENTS.reduce((value, [pattern, replacement]) => value.replace(pattern, replacement), text).replace(
    /\s{2,}/g,
    " "
  );
};
