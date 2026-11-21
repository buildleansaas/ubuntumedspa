# Med Spa Jenny: post cards + site touch-up (plan, 2026-11-17)

**Goal:** one look across Jenny's posts and her site, built from the approved cartoon (`refs/approved-j4-room.png`): her treatment room's warm walls, black scrubs, rose towel, orchids and walnut desk.

Source for the posts: Austin's email to Jenny, "June Social Media Post Ideas" (2026-06-03): a 30-day plan plus a weekly rhythm (Mon education, Tue FAQ/myth, Wed treatment spotlight, Thu behind the scenes, Fri booking reminder, Sat tip/Reel, Sun self-care).

## 1. Palette: "Treatment room" (sampled from j4)

| Token | Hex | From the shot | Use | Contrast on linen |
|---|---|---|---|---|
| linen | `#f6f2ee` | white trim, warmed | page background (base-100) | n/a |
| wall | `#ede7e1` | gray walls, warmed | bands (base-200) | n/a |
| line | `#d9d2cb` | wall shadow | borders (base-300) | n/a |
| ink | `#2a2423` | black scrubs | text, the one filled button (primary) | 13.7 |
| rose | `#b43c48` | towel | accents, italic emphasis, large text | 5.1 |
| rose-deep | `#9e3340` | towel shadow | links and small text (secondary) | 6.3 |
| walnut | `#4a3530` | desk | quiet labels, footer | 10.2 |
| orchid | `#e484a8` | orchids | decoration only, never text (2.3) | 2.3 |
| peach | `#efd9cb` | skin, lightened | soft highlight panels | n/a |

Today the site is "Tidewater": slate `#24313a`, oyster `#f4f3ef`, James River blue `#436379`, sage `#6f8470`. The change warms it: the slate becomes the scrubs' warm ink, the blue links become rose, and the sage goes.

## 2. Post cards (draft done)

- `postcards/card.html` + `postcards/render.sh CARDS.json OUTDIR`: one template, three sizes, text from JSON, PNG out via headless Chrome. `*word*` in a headline renders as rose italic.
  - feed 1080x1350 (Instagram/Facebook portrait, the default)
  - story 1080x1920 (Stories, Reels cover; bottom ~250 px kept clear for the app UI)
  - square 1080x1080 (Facebook, Google Business Profile posts)
- Drafts: `postcards/drafts.json` (Days 1, 2 and 9 from the email). The PNGs are in `~/dev/buildleansaas/ai-avatars/out/jenny/postcards/`.
- Next:
  1. Fill `cards-30.json` with all 30 days from the email (copy from the email, shortened to fit the card).
  2. New Jenny scenes per theme with `brand.py --scene`, e.g. "pointing at a small skincare bottle" (product education), "holding a clipboard, consultation" (consult), "waving" (welcome). One render each, ~25 s, once the media lane and swap allow.
  3. A carousel variant (Day 26 "What to expect"): 3–5 slides, same template, `slide=1/3` label.
  4. Batch render the month; Jenny posts by hand or in her scheduler (posting is hers).

## 3. Site touch-up (plan, not built)

Everything on the site already goes through the DaisyUI theme tokens (174 `border-base-300`, 71 `bg-base-200`, 51 `text-primary`, 12 `text-secondary`, no hard-coded hex in components), so the change is small:

1. **Theme swap** in `src/app/globals.css` (`wms-editorial`): set the tokens from the table above. Keep Newsreader + Hanken Grotesk, light heading weights, one filled button per screen. Accent = rose; drop sage. Dark theme (`wms-dark`): warm the slate the same way.
2. **Put Jenny on the site, tastefully** (illustration, not a mascot):
   - Homepage "Meet your provider" block: the cartoon next to her real photo, with the line "Illustrated by us, in her real treatment room." Her real headshot stays the trust image.
   - "What to expect at your first visit": one illustration per step (arrive, consult, treatment, aftercare), rendered from the brand kit.
   - The 404 page: Jenny waving, "This page moved."
   - Not on procedure pages next to medical results, and never as a before/after.
3. **Orchid detail:** the small orchid pill used in the cards as the section-label mark (replacing nothing, since tracked uppercase labels are already off).
4. **Proof per the rules:** phone 390 px + desktop 1280 px screenshots of home, a procedure page and the staff page, before and after, on local dev. Contrast checked (table above).

## Open: needs Jenny or Austin

- **Jenny's OK** to use the cartoon publicly (posts and site). Nothing ships before that.
- Whether the site keeps "Tidewater" for the whole site and uses the treatment-room palette only on posts. My recommendation: switch the site; the posts and site should match, and the warm palette fits a home med spa better than slate blue.
