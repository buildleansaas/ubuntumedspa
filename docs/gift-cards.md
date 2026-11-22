# Gift cards: how they work and how to theme the next holiday

## What's live
- Page: `/gift-cards` (one evergreen URL; the look changes with the active theme).
- Amounts online: $25, $50, $100, $250, $500, $1,000 (catalog: `GIFT_CARD_FACE_VALUES_CENTS` in
  `src/config/commerce-catalog.ts`). The buyer pays the card price (`cardPriceCents`), the card is worth the face value.
  At most $1,000 of gift cards per order; $2,500 and up are sold by text after Jenny talks to the buyer.
- After payment, every unit gets its own code (`WMS-XXXXX-XXXXX`) and a private card page
  `/gift-cards/card/<viewToken>` with a 1080x1350 PNG at `.../image`. The buyer's receipt links each card; Jenny's
  order email lists every code. She redeems by hand: note the code and date when it's used.
- A full refund or a dispute voids the order's cards and emails Jenny. A partial refund emails her the codes so she can
  decide which one to stop honoring.
- Safety design and review: `docs/gift-cards-plan.md`.

## Theme the next holiday (about 15 minutes)
1. Add one entry to `GIFT_CARD_THEMES` in `src/config/gift-card-themes.ts`:
   ```ts
   {
     slug: "valentines",
     name: "Valentine's Day",
     startsOn: "01-20", // MM-DD, clinic time, inclusive; windows may wrap the new year
     endsOn: "02-14",
     kicker: "FOR VALENTINE'S DAY",
     headlineLead: "Give the gift\nof a",
     headlineAccent: "glow-up",   // no outcome promises; check with the copy rules
     intro: "…",
     cardKicker: "VALENTINE'S GIFT CARD",
     colors: { ...TIDEWATER_NIGHT, accent: "#d9a0a8", ribbon: "#b0353f" },
   },
   ```
   Windows must not overlap (first match wins). Outside every window the evergreen theme shows.
2. Run `pnpm test` (the theme test checks the date format) and `pnpm content-dates`.
3. Look at `/gift-cards` locally at phone and desktop widths.
4. Cards already sold keep the theme they were bought under (`themeSlug` is saved on each card).
5. Social post images: render the Facebook set from the same design (the 2026-11-22 Christmas set lives in
   `~/Desktop/holiday-botox/card.html`; copy it, change the words and colors to match the new theme).

## Rules
- Never type a price in the page or theme; prices come from the catalog helpers.
- No outcome promises in theme copy (same rules as gbp-posts).
- Changing amounts, the per-order limit, the card fee or the terms is a money change: it needs Austin's OK.
