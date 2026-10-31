# Ear piercing booking attribution

Three landing paths use distinct consult URLs. Austin can read which page started the request from the lead email line `landing campaign`, and from GA4 session campaign when the browser keeps the query string.

| Landing | Campaign | URL |
|---|---|---|
| Blomdahl hub hero | `ear_piercing` | `/consult?procedure=blomdahl-ear-piercing&utm_source=website&utm_medium=procedure_page&utm_campaign=ear_piercing` |
| Infant section on the hub | `ear_piercing_infant` | `/consult?procedure=blomdahl-ear-piercing&intent=children&utm_source=website&utm_medium=procedure_page&utm_campaign=ear_piercing_infant` |
| `/for/children` | `ear_piercing_children` | `/consult?procedure=blomdahl-ear-piercing&intent=children&utm_source=website&utm_medium=intent_page&utm_campaign=ear_piercing_children` |
| Homepage `#blomdahl-callout` | `ear_piercing_homepage` | `/consult?procedure=blomdahl-ear-piercing&utm_source=website&utm_medium=homepage_callout&utm_campaign=ear_piercing_homepage` |

The consult form copies `utm_source`, `utm_medium`, and `utm_campaign` into the lead email. In GA4, use Traffic acquisition and filter Session campaign to the values above. The consult form also pre-selects the Blomdahl Ear Piercing interest when `procedure=blomdahl-ear-piercing`.
