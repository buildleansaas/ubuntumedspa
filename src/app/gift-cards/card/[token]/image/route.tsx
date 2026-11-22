import { giftCardThemeBySlug } from "config/gift-card-themes";
import { getGiftCardByViewToken } from "lib/gift-cards";
import { renderGiftCardImage } from "lib/gift-card-image";

export const dynamic = "force-dynamic";

export async function GET(_request: Request, props: { params: Promise<{ token: string }> }) {
  const { token } = await props.params;
  const card = await getGiftCardByViewToken(token);
  if (!card || card.status !== "active") return new Response("Not found", { status: 404 });

  const image = renderGiftCardImage({
    theme: giftCardThemeBySlug(card.themeSlug),
    faceValueCents: card.faceValueCents,
    code: card.code,
    recipientName: card.recipientName,
    message: card.message,
  });
  image.headers.set("Cache-Control", "private, no-store");
  image.headers.set("X-Robots-Tag", "noindex");
  return image;
}
