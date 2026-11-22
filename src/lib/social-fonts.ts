import { readFileSync } from "node:fs";
import { join } from "node:path";

/**
 * Brand fonts and logo for next/og images (share cards, gift card PNG). Static TTFs in src/assets/fonts, shipped
 * with every route by outputFileTracingIncludes in next.config.mjs.
 */
const asset = (...parts: string[]) => readFileSync(join(process.cwd(), ...parts));

export const socialFonts = () => [
  { name: "Newsreader", data: asset("src", "assets", "fonts", "Newsreader-Regular.ttf"), weight: 400 as const, style: "normal" as const },
  { name: "Newsreader", data: asset("src", "assets", "fonts", "Newsreader-Italic.ttf"), weight: 400 as const, style: "italic" as const },
  { name: "Hanken", data: asset("src", "assets", "fonts", "HankenGrotesk-Regular.ttf"), weight: 400 as const, style: "normal" as const },
  { name: "Hanken", data: asset("src", "assets", "fonts", "HankenGrotesk-Bold.ttf"), weight: 700 as const, style: "normal" as const },
];

export const logoDataUri = () => `data:image/png;base64,${asset("public", "logo.png").toString("base64")}`;
