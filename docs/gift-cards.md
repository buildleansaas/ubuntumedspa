# Gift cards: how they work and how to theme the next holiday

## What's live
- Page: `/gift-cards` (one evergreen URL; the look changes with the active theme).
- Amounts online: $25, $50, $100, $250, $500, $1,000 (catalog: `GIFT_CARD_FACE_VALUES_CENTS` in
  `src/config/commerce-catalog.ts`). The buyer pays the card price (`cardPriceCents`), the card is worth the face value.
  At most $1,000 of gift cards per order; $2,500 and up are sold by text after Jenny talks to the buyer.
- After payment, every unit gets its own code (`WMS-XXXXX-XXXXX`) and a private card page
  `/gift-cards/card/<viewToken>` with a 1080x1350 PNG at `.../image`. The buyer's receipt links each card; Jenny's
  order email lists every code with its card link. She redeems by hand: note the code, the date and any balance left.
  Each $1 on a card covers $1 at the cash price. A lost card is re-sent by forwarding its link to the buyer's email only.
- One recipient name and message per order (Stripe custom fields); buying for two people means two orders.
- Once the Stripe webhook endpoint has `charge.refunded`, `charge.dispute.created` and `charge.dispute.closed` turned on:
  a full refund or a dispute voids the order's cards and emails Jenny; a partial refund emails her the codes so she can
  decide which one to stop honoring (the card page stays active; voiding a single card is a database edit, so ask
  Austin). A won dispute only emails; cards stay void. Before the cards are issued, any refund (even partial) or
  dispute makes every card on the order issue as void (fail closed), and Jenny's refund email says so.
- If a paid order's cards can't be issued (amount mismatch, database error), Jenny gets one email and the site retries.
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
4. Cards already sold store their theme's slug (`themeSlug`) and render with that theme's current entry. So never
   delete or rename a theme slug once cards were sold under it (they would fall back to evergreen). For a new look
   next year, add a new entry (e.g. `christmas-2027`) with the dates, and delete only the dates (`startsOn`/`endsOn`)
   from the old entry: it stays for the cards already sold but no longer shows on the page.
5. Social post images: render the Facebook set from the same design. The 2026-11-22 Christmas set's source is
   `docs/social/christmas-2026-fb-card.html` (open with `?v=gift`, `?v=feed` or `?v=story`, logo.png beside it, and
   screenshot with headless Chrome at 1080x1350 / 1080x1920; copy `public/logo.png` next to it first). It was made
   before online gift cards existed ("Message us to order", one $250 credit, a typed card price), so rewrite the copy
   to match the live offer and take prices from the catalog before reusing it.

## Rules
- Never type a price in the page or theme; prices come from the catalog helpers.
- No outcome promises in theme copy. Use the ® on Botox® and Xeomin®.
- Never call the card price a fee or surcharge (lib/price.ts): the card price is the price online.
- Changing amounts, the per-order limit, the card price rule or the terms is a money change: it needs Austin's OK.
