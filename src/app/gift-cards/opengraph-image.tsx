import { activeGiftCardTheme } from "config/gift-card-themes";
import { renderGiftCardSocialImage } from "lib/gift-card-social-image";

// Re-skins with the active gift card theme; rendered per request so a new theme shows on its first day.
export const dynamic = "force-dynamic";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";
export const alt = "Williamsburg Med Spa gift card in this season's design, with the disco pineapple logo";

export default function Image() {
  return renderGiftCardSocialImage(activeGiftCardTheme());
}
