# Bodhuno question bank workflow

The question bank is the source of truth for static content during the database-free pilot. No separate admin application or database is needed for ordinary content updates.

## Where questions live

- `sets/telangana-foundation-demo.json`: five original demonstration questions used by the non-Police preview cards.
- `sets/telangana-police-foundation-01.json`: 24 original English/Telugu SI foundation questions covering selected SI PWT subjects.
- `sets/telangana-police-constable-foundation-01.json`: 24 original English/Telugu Constable foundation questions, including English practice.
- `sets/telangana-police-si-expansion-preview-02.json`: 24 additional SI preview questions across arithmetic, reasoning, polity, history, geography, science, economy and Telangana history.
- `sets/telangana-police-constable-expansion-preview-02.json`: 24 additional Constable preview questions across arithmetic, reasoning, science, history, geography, polity, economy, Telangana and English.
- `sets/telangana-police-si-expansion-preview-03.json`: 24 additional SI preview questions across arithmetic, reasoning, polity, economy, history, geography and Telangana heritage.
- `sets/telangana-police-constable-expansion-preview-03.json`: 25 additional Constable preview questions across arithmetic, reasoning, science, history, geography, polity, Telangana and English.
- `sets/telangana-police-si-expansion-preview-04.json`: 24 additional SI preview questions covering arithmetic, reasoning, polity, science and Telangana culture.
- `sets/telangana-police-constable-expansion-preview-04.json`: 24 additional Constable preview questions covering arithmetic, reasoning, science, history, geography, polity, Telangana and English.
- `sets/telangana-police-si-current-affairs-november-2026-preview-01.json`: 16 bilingual SI current-affairs questions based on official PIB releases through 12 November 2026.
- `sets/telangana-police-constable-current-affairs-november-2026-preview-01.json`: 16 bilingual Constable current-affairs questions based on official PIB releases through 12 November 2026.
- `schema.json`: question-set data contract.
- `catalog.json`: home-screen registry for the Police SI and Constable sets. The app creates these cards from the catalogue, so new sets do not require editing `index.html`.
- `scripts/validate-question-bank.mjs`: Node.js structural and publishing-rule validator.

## Draft, review and publish

The public app remains one app: it reads static question-set JSON files and a small catalogue file. No database or separate admin app is needed for the current pilot. To add a set, add its JSON file under `sets/` and register its display name, exam name, file path, question count, status and card description in `catalog.json`. The home screen and practice launcher then pick it up automatically. GitHub Actions checks that every catalogue entry points to a real set with the expected count and status.


1. Prepare English and Telugu stems, four options in each language, a zero-based correct option index (A=0 to D=3), explanations in both languages, subject, topic, difficulty, exam tags and provenance.
2. Independently solve every item. Verify facts, calculations, answer key, syllabus relevance, ambiguity and Telugu meaning.
3. For official previous-year items, record the exact paper/year/shift and verify reuse rights. Never label AI-generated practice as official past-paper content.
4. Keep new questions at `draft` or `review`. A human subject reviewer and Telugu reviewer should inspect them.
5. Publish only after approval. Set every question and the set to `published`, fill review metadata, increment the version and validate.
6. Commit, wait for GitHub Actions, confirm the matching Cloudflare Pages deployment and smoke-test both languages.
7. The question content is prepared as a draft batch, independently reviewed for subject accuracy and Telugu quality, then added to the catalogue. Only owner-approved, reviewer-checked sets should be changed to `published`; preview sets remain clearly labelled.

## Official 2026 Police scoring and scope

The 2026 TGPRB SI and PC Preliminary Written Test notifications specify:
- 200 questions, 200 marks and three hours.
- Full marks for a correct response, zero for an unanswered response, and a penalty equal to 20% of the question's marks for an incorrect response.

Both Bodhuno Police foundation collections apply +1, −0.20 and 0 scoring respectively. Each is a 24-question practice module, not a full examination simulation. The practice timer is one minute per question, not the official three-hour timer.

Official documents:
- [SI notification](https://doc.tgprb.in/SI+(Civil+et+al)+2026+Notification+dated+29-07-2026.pdf), PWT pages 19–20; syllabus Annexure I, page 40.
- [PC notification](https://doc.tgprb.in/PC+(Civil+et+al)+2026+Notification+dated+29-07-2026.pdf), PWT pages 25–26; syllabus Annexure II, page 44.
- [TGPRB official portal](https://www.tgprb.in/).

The SI and PC syllabi differ, so the site serves different sets. The SI set covers selected SI PWT topics, including Arithmetic, Reasoning/Mental Ability and General Studies with the Telangana Movement. The Constable set includes English practice and selected PC topics such as Arithmetic, General Science, Indian History, Geography/Polity/Economy, Reasoning and Telangana awareness. Neither set is complete syllabus coverage.

## Current published pilot set

The 24-question Police set is marked `published` and loaded by the Police SI and Police Constable cards. It contains original practice questions, not official previous-year questions. Owner-approved pilot publication and AI-assisted checks are recorded in its metadata; independent subject-expert certification is not claimed. A qualified subject reviewer and Telugu reviewer should still inspect it.

## Syllabus expansion preview — Set 02

Two additional 24-question bilingual collections are available as preview sets on the Police SI and Police Constable cards. They are separate from Foundation Set 01, use the same +1 / −0.20 / 0 scoring metadata, and retain a one-minute-per-question practice timer. The new material broadens static-topic coverage; it is not a 200-question mock and it does not yet cover current affairs. The collections remain in `preview` status because independent subject-expert and Telugu-language review has not been completed. Do not relabel them as published or official previous-year papers until that review is recorded.

## Syllabus expansion preview — Set 03

Set 03 adds 24 SI questions and 25 Constable questions. They remain separate, bilingual preview collections and continue to use +1 / −0.20 / 0 scoring with a one-minute-per-question practice timer. The new batch adds more arithmetic, reasoning, Indian polity/economy/history/geography, science, Telangana heritage and a small amount of English in the Constable collection. The batch is not a full mock and contains no dedicated current-affairs section. Keep the sets in `preview` status until a qualified subject reviewer and Telugu-language reviewer have checked each item and answer key.

## Syllabus expansion preview — Set 04

Set 04 adds 24 additional bilingual questions to each Police track. Both continue using the TGPRB marking metadata (+1 / −0.20 / 0) and a short one-minute-per-question practice timer. The SI set adds arithmetic, reasoning, polity, general science and Telangana culture. The Constable set adds arithmetic, reasoning, science, history, geography, polity, Telangana awareness and English. These remain preview-only until independent subject-expert and Telugu-language review is recorded. They are not full-length examinations and do not provide current-affairs coverage.


## Current-affairs preview — November 2026

The SI and Constable tracks now include separate 16-question bilingual current-affairs previews, based on official Government of India Press Information Bureau releases published in 2026 and available through 12 November 2026. Topics include the continuation of Stand-Up India and the Credit Guarantee Fund for Micro Units, the VISTAR statistical transformation scheme, grid-scale energy storage support, the Union Budget 2026–27 and Bharat-VISTAAR. Each question records its source URL. These are dated snapshots, not comprehensive current-affairs digests, and they can become stale; refresh the content against authoritative updates before an examination. Both sets remain in `preview` pending independent subject-expert and Telugu-language review.

Key official sources include [Stand-Up India continuation](https://www.pib.gov.in/PressReleseDetailm.aspx?PRID=2334979&lang=1&reg=1), [Credit Guarantee Fund for Micro Units](https://www.pib.gov.in/PressReleseDetailm.aspx?PRID=2334976&lang=1&reg=1), [VISTAR](https://www.pib.gov.in/PressReleasePage.aspx?PRID=2332480&lang=1&reg=3), [grid-scale energy storage](https://www.pib.gov.in/PressReleaseIframePage.aspx?PRID=2332486&lang=1&reg=48), [Union Budget 2026–27 highlights](https://www.pib.gov.in/PressReleasePage.aspx?PRID=2221455&lang=3&reg=3), and [Bharat-VISTAAR budget document](https://static.pib.gov.in/WriteReadData/specificdocs/documents/2026/feb/doc202621776101.pdf).


## Full-length mock preview collections

- `sets/telangana-police-si-full-mock-01-preview.json`: 200 bilingual SI practice questions, with SI English-subject exclusion preserved.
- `sets/telangana-police-constable-full-mock-01-preview.json`: 200 bilingual Constable practice questions, including English practice.

Both simulations use a 180-minute timer (54 seconds per question) and +1 / −0.20 / 0 marking. They are original Bodhuno practice simulations, not official TGPRB papers. Both remain `preview` pending independent subject-expert and Telugu-language review. See [FULL-MOCKS.md](FULL-MOCKS.md) for the validation checklist.


## Current-affairs preview — November 2026, Set 02

Two additional 15-question bilingual previews have been prepared for SI and Constable. This dated batch uses official PIB releases published 10–12 November 2026 and covers IMNEX-26, Sea Vigil-26, lithium-ion battery black mass export policy, Swachh Survekshan Awards, CGFMU/PMJDY, India's 100th Chess Grandmaster, and Nutrient Based Subsidy rates for Rabi 2026–27. Each question records its official source URL. These sets are preview-only and must receive independent subject-matter and Telugu-language review before any publication decision. They are not official previous-year questions and do not constitute a comprehensive current-affairs digest.

Official source releases: [IMNEX-26](https://www.pib.gov.in/PressReleseDetailm.aspx?PRID=2335191&lang=1&reg=1); [Sea Vigil-26](https://www.pib.gov.in/PressReleseDetailm.aspx?PRID=2335093&lang=1&reg=3); [black mass export policy](https://www.pib.gov.in/PressReleseDetailm.aspx?PRID=2335019&lang=1&reg=3); [Swachh Survekshan Awards](https://www.pib.gov.in/PressReleseDetailm.aspx?PRID=2335207&lang=1&reg=1); [CGFMU continuation](https://www.pib.gov.in/PressReleseDetailm.aspx?PRID=2334977&lang=1&reg=3); [India's 100th Chess Grandmaster](https://www.pib.gov.in/PressReleseDetailm.aspx?PRID=2334594&lang=1&reg=48); [NBS rates for Rabi 2026–27](https://www.pib.gov.in/PressReleasePage.aspx?PRID=2334974&lang=1&reg=48).
