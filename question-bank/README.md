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
- `schema.json`: question-set data contract.
- `scripts/validate-question-bank.mjs`: Node.js structural and publishing-rule validator.

## Draft, review and publish

1. Prepare English and Telugu stems, four options in each language, a zero-based correct option index (A=0 to D=3), explanations in both languages, subject, topic, difficulty, exam tags and provenance.
2. Independently solve every item. Verify facts, calculations, answer key, syllabus relevance, ambiguity and Telugu meaning.
3. For official previous-year items, record the exact paper/year/shift and verify reuse rights. Never label AI-generated practice as official past-paper content.
4. Keep new questions at `draft` or `review`. A human subject reviewer and Telugu reviewer should inspect them.
5. Publish only after approval. Set every question and the set to `published`, fill review metadata, increment the version and validate.
6. Commit, wait for GitHub Actions, confirm the matching Cloudflare Pages deployment and smoke-test both languages.

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
