import { GIFT_CARD_MAX_ORDER_CASH_CENTS } from "config/commerce-catalog";
import { formatUsdShort } from "lib/price";

/**
 * Pure gift card rules (no Mongo or Stripe), so they are unit-tested in gift-cards.test.ts.
 */

export type GiftCardStatus = "active" | "void";

export type GiftCardRecord = {
  entryKey: string;
  code: string;
  /** Random token for the recipient's card page. The page shows the code, so the link is as good as the code. */
  viewToken: string;
  orderId: string;
  slug: string;
  faceValueCents: number;
  recipientName?: string;
  message?: string;
  themeSlug: string;
  status: GiftCardStatus;
  voidReason?: string;
  voidedAt?: Date;
  createdAt: Date;
};

/** 31 letters and digits with 0/O, 1/I/L left out so codes survive being read aloud or handwritten. */
export const GIFT_CARD_CODE_ALPHABET = "23456789ABCDEFGHJKMNPQRSTUVWXYZ";
export const GIFT_CARD_CODE_PATTERN = /^WMS-[23456789ABCDEFGHJKMNPQRSTUVWXYZ]{5}-[23456789ABCDEFGHJKMNPQRSTUVWXYZ]{5}$/;

/** "WMS-ABCDE-FGHJK" from 10 alphabet characters. */
export const formatGiftCardCode = (chars: string) => {
  if (chars.length !== 10) throw new Error("A gift card code needs 10 characters.");
  return `WMS-${chars.slice(0, 5)}-${chars.slice(5)}`;
};

type GiftLine = { slug: string; fulfillment?: string; quantity: number; cashUnitAmountCents?: number; cashAmountCents: number; cashLineTotalCents?: number };

export const isGiftCardItem = (item: { fulfillment?: string }) => item.fulfillment === "email";

/** Face value of one unit: the listed cash amount. */
export const giftCardFaceValueCents = (item: GiftLine) => item.cashUnitAmountCents ?? item.cashAmountCents;

export const giftCardUnitsForItems = (items: GiftLine[]) =>
  items.filter(isGiftCardItem).reduce((sum, item) => sum + item.quantity, 0);

/** Total gift card face value in a cart, across every gift card amount. */
export const giftCardCashTotalCents = (items: GiftLine[]) =>
  items.filter(isGiftCardItem).reduce((sum, item) => sum + giftCardFaceValueCents(item) * item.quantity, 0);

/** Throws when a cart's gift cards add up to more than the online limit. */
export const assertGiftCardOrderCap = (items: GiftLine[]) => {
  const total = giftCardCashTotalCents(items);
  if (total > GIFT_CARD_MAX_ORDER_CASH_CENTS) {
    throw new Error(
      `Gift cards are limited to ${formatUsdShort(GIFT_CARD_MAX_ORDER_CASH_CENTS)} per online order. For more, text Jenny.`
    );
  }
};

/** One entry per gift card unit: `${orderId}:${slug}:${i}`. The unique key that makes issuing idempotent. */
export const giftCardEntryKeys = (orderId: string, items: GiftLine[]) =>
  items.filter(isGiftCardItem).flatMap((item) =>
    Array.from({ length: item.quantity }, (_, index) => ({
      entryKey: `${orderId}:${item.slug}:${index}`,
      slug: item.slug,
      faceValueCents: giftCardFaceValueCents(item),
    }))
  );

/** Recipient name and message from Stripe custom fields, trimmed and length-capped. */
export const cleanGiftText = (value: string | null | undefined, max: number) => {
  const cleaned = (value ?? "").replace(/\s+/g, " ").trim().slice(0, max);
  return cleaned || undefined;
};

// Wording marked for Austin's OK on PR #192: balance across visits, refunds, in-office sales.
export const GIFT_CARD_TERMS = [
  "Never expires. No monthly or inactivity fees.",
  "Use it toward any treatment or product at Williamsburg Med Spa. Each $1 on the card covers $1 at the cash price.",
  "Any value left after a visit stays on the code as credit, and Jenny keeps track of the balance.",
  "Treatments still need Jenny's assessment. If no treatment or product suits the recipient, the buyer can get a refund.",
  "Not redeemable for cash. A lost code is re-sent only to the buyer's email address.",
];
