# OH-Shot redirect audit

Date: 2026-10-31

Preferred owner for OH-Shot terms: `/procedures/oh-shot`.

Legacy paths permanently redirect there:

- `/procedures/o-shot`
- `/procedures/o-shot/for/:ailmentSlug`
- `/blog/o-shot-for-vaginal-dryness-what-to-know`
- `/blog/o-shot-for-urinary-incontinence-williamsburg-va`
- `/procedures/feminine-intimacy-prp-protocols/for/urinary-incontinence`
- `/procedures/oh-shot/for/:ailmentSlug`

`scripts/verify-seo.mjs` checks those redirects. The sitemap includes `/procedures/oh-shot` and does not include `/procedures/o-shot`. The OH-Shot page still carries the Cellular Medicine Association credential copy. OH-Shot and Pe-Shot names stay as published.

`o shot warrenton va` and `o shot culpeper` are out-of-area rows. They are on the ignore list in `docs/seo/out-of-area-gsc-ignore-list.md`, not a reason to add new city pages.
