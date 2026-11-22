# Gift cards + holiday theme standard (plan, 2026-11-22)

> Historical record of the plan and its adversarial review. Where the original plan below differs from the code
> (field labels, code format, refund handling, Offer schema and /offers link not built, max 5 per amount because more
> overcharges the cash total), the "Changes after" sections and `docs/gift-cards.md` are current.

Goal: sell Williamsburg Med Spa gift cards online in six amounts, on one evergreen page whose look changes per holiday
(Christmas first), using the same card design as the 2026-11-22 Facebook post images.

## Decisions (Austin, 2026-11-22)
- Amounts online: $25, $50, $100, $250, $500, $1,000 (face value = cash value). $2,500 / $5,000 / $10,000: "text Jenny".
- Buyer pays the card price, same as the rest of the site: cardPriceCents(face) (e.g. $100 card costs $103.30; computed, never typed).
- Delivery: buyer gets an email with a link to the themed card (printable page + PNG) and a unique code. Jenny gets the
  order email listing the codes and redeems by hand. No recipient email, no balance/redeem UI in v1.

## Safety promises
1. A gift card is issued only for an order Stripe reports `payment_status === "paid"`.
2. Each paid unit gets exactly one card, even when the webhook and the success page sync the same order at once.
3. The face value is the cash amount of the line; checkout charges exactly cardPriceCents(face) per unit.
4. Gift card face value per order is at most $1,000 (server-enforced in resolveCart, not just the UI).
5. Codes are unique (unique index) and unguessable (crypto random, 40+ bits); the view link uses a separate random token,
   so a shared image link does not need to reveal the code in its URL.
6. The receipt never goes out without the codes: if issuing fails, no emails are sent and the sync throws, so Stripe
   redelivers the webhook.
7. A refund or dispute on the payment marks that order's gift cards `void` and emails the owner.

## Build
- `config/commerce-catalog.ts`: six items `gift-card-25` ... `gift-card-1000`, kind `product`, pricingMode `fixed`,
  new fulfillment `"email"`, requiresScheduling false, maxQuantity 5 (the $1,000 cap does the real limiting).
  `GIFT_CARD_MAX_ORDER_CASH_CENTS = 100000`.
- `lib/catalog.ts` resolveCart: throw when the sum of gift card cashLineTotalCents > cap.
- `lib/checkout.ts`: when the cart has a gift card, add Stripe `custom_fields`: "To (recipient name)" (text, optional,
  max 60) and "Gift message" (text, optional, max 200). Pickup wording must not show for email fulfillment
  (hasPickupItems / success page treat `"email"` separately).
- `lib/gift-cards.ts` (new): `GiftCardRecord { entryKey, code, viewToken, orderId, slug, faceValueCents,
  recipientName?, message?, themeSlug, status: "active" | "void", createdAt, voidedAt?, voidReason? }`.
  `ensureGiftCards(order, session)`: for each gift card item, for i in 0..quantity-1, upsert by
  `entryKey = ${orderId}:${slug}:${i}` with `$setOnInsert` (code generated before the upsert; on a duplicate-key error on
  `code`, retry with a new code). Theme = the theme active on the paid date, frozen on the record.
  Code format `WMS-XXXX-XXXX` from a 31-letter alphabet without 0/O/1/I/L (31^8 ≈ 8.5e11).
  `voidGiftCardsForOrder(orderId, reason)`.
- `lib/mongodb.ts`: unique indexes on gift_cards.entryKey, .code, .viewToken; index on orderId.
- `lib/orders.ts` syncOrderFromStripeSession: after ensureCreditEntries and before notifications, `ensureGiftCards`
  (errors propagate; no notifications). Store custom field values on the order (`giftRecipientName`, `giftMessage`).
- `api/stripe/webhook`: also handle `charge.refunded` (full refunds only: amount_refunded === amount) and
  `charge.dispute.created`: find the order by payment_intent metadata.orderId, void its cards, email the owner once.
  (The Stripe webhook endpoint must have these two events enabled.)
- Emails (`order-notifications.ts`): customer receipt lists each card: amount, code, link `/gift-cards/card/<viewToken>`,
  and the terms line. Owner email lists amount + code + recipient per card and "Redeem by hand: note the code when used."
- `config/gift-card-themes.ts` (new): the theme standard. `GiftCardTheme { slug, name, startsOn, endsOn (MM-DD, yearly),
  kicker, headline (with an italic accent word), intro, ribbon color, accent, background }`. Themes now: `christmas`
  (Nov 15 to Dec 31) and `evergreen` (default). `activeGiftCardTheme(date)` in America/New_York.
- `components/gift-card-art.tsx`: the card (cream card, ribbon, pineapple logo, amount, "Williamsburg Med Spa ·
  Jenny Brady, NP"), takes a theme + amount + optional recipient. Used on the page and the card view page.
- `app/gift-cards/page.tsx`: the themed sales page (dark slate + gold for Christmas, matching the FB images): hero
  headline, the card, the six amount buttons (add to cart, card price shown second after cash), "Larger amounts: text
  Jenny", how it works (3 steps), terms, FAQ, Offer schema. One evergreen URL; holidays change the skin, not the URL.
- `app/gift-cards/card/[token]/page.tsx` (noindex, robots-disallowed): the recipient's printable card with code.
  `.../image/route.tsx`: 1080x1350 PNG via next/og.
- Links: footer + /offers + /prices mention; sitemap entry for /gift-cards.
- Terms text (needs Austin's OK at merge): never expires; redeemable for any treatment or product at Williamsburg Med
  Spa; not redeemable for cash; treatments still need Jenny's assessment, and the value can go to another service if a
  treatment is not right for the recipient; lost codes can be looked up by the buyer's email.
- `docs/gift-cards.md`: how to add next holiday's theme (one config entry + optional FB images from the same card).
- Tests (`src/lib/gift-cards.test.ts`, added to `pnpm test`): card prices = cardPriceCents(face) for all six; cap
  rejects $1,000.01+; code alphabet/format; theme by date (Nov 14 evergreen, Nov 15 and Dec 31 christmas, Jan 1
  evergreen); entryKey per unit; emails include codes; no pickup line for gift-only orders.

## Out of scope (v1)
Recipient email delivery, scheduled send, balance tracking, redeem screen, partial redemption, physical cards.

## Changes after the plan attack (fresh Opus reviewer, 2026-11-22)
1. Blocker fixed: the order stores `giftCardUnits`; `sendOnce` only claims a gift card order once `giftCardsIssuedAt`
   is set, and the success page's already-paid branch issues cards before sending. Email builders throw if the card
   count is short.
2. A refund/dispute before issuance sets `giftCardsVoidedAt` on the order; later issuance inserts those cards as `void`.
3. Full refund voids all cards; every refund (partial too) emails the owner the order's codes and the refunded amount,
   once per refund id.
4. Orders store `stripePaymentIntentId` (indexed); refund/dispute events look orders up by it and return 200 when no
   order or no cards match. `charge.dispute.closed` emails the owner the outcome (no auto-reactivation).
5. Duplicate-key handling branches on `keyPattern`: code/viewToken clash -> new value; entryKey clash -> already issued.
6. Issuance requires `session.amount_total === order.subtotalCents` and currency usd.
7. Codes: `WMS-XXXXX-XXXXX`, 10 chars from a 31-letter alphabet via `crypto.randomInt` (~49.5 bits). The card link
   shows the code (said plainly). Lost codes are re-sent only to the buyer's email on file.
8. Cap sums all `fulfillment === "email"` lines. Gift card sessions accept cards only. The owner email warns when the
   buyer's email bought gift cards in the last 24 hours (velocity flag; Stripe Radar does card screening).
9. No pickup wording for email-fulfilled lines; recipient name and message are escaped everywhere.
10. Terms: never expires, no fees; refund to the buyer if no treatment or product suits the recipient (Austin to
    confirm at merge). Unclaimed-property and sales-tax treatment: Jenny's accountant.

## Changes after PR #192 review (attack + sweep, 2026-11-22)
- Refund/dispute lookup falls back to the PaymentIntent's `metadata.orderId`; before issuing, the sync checks the
  charge and issues every card void if it was already refunded (any amount, fail closed) or disputed.
- Card and success-page URLs are redacted in GA4 (page_location, page_referrer) and both pages send no referrer.
- A paid order whose cards can't be issued emails Jenny once (`giftCardIssueAlertedAt`), then keeps retrying.
- Over-cap carts show a "Remove gift cards" button instead of a dead end.
- Card page URLs are sent to GA4 without their token; success-page links do a full page load.
- Emails load cards inside each send (after the claim); issuing re-checks a void that landed mid-insert.
- Terms: balance stays on the code (Jenny tracks it), $1 covers $1 at the cash price, "no monthly or inactivity fees".
  Balance-across-visits, refund wording and in-office cash sales are flagged for Austin on the PR.
