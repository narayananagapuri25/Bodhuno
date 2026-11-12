# Bodhuno question bank workflow

This repository is the source of truth for question content during the database-free launch. The website loads the published/preview set from a static JSON file. No admin app, database, paid service or manual website-code edit is required for ordinary question additions.

## Where questions live

- `question-bank/sets/telangana-foundation-demo.json` — the five questions currently used by the preview.
- `question-bank/schema.json` — machine-readable structure.
- `scripts/validate-question-bank.mjs` — no-dependency Node.js validator.

Keep one set per exam or coherent subject group. Give every question a permanent, unique kebab-case ID. Do not recycle IDs when correcting a question.

## Publishing workflow

1. **Draft:** prepare the question in English and Telugu. Add subject, topic, difficulty, exam tags, four options, the zero-based correct option index (A=0, B=1, C=2, D=3), explanations in both languages, and provenance.
2. **Verify:** independently solve it; verify facts, calculations, answer key, syllabus fit and Telugu meaning. Check duplicates and ambiguous options. For official previous-year material, record the exact paper/year/shift/source and confirm reuse rights. Never label generated practice as an official previous-year question.
3. **Review:** set the set and question statuses to `review`. A human subject reviewer should check the answer and a Telugu reviewer should check the translation. AI drafting is not a substitute for review.
4. **Approve and publish:** only after the checks pass, set all question statuses and `workflowStatus` to `published`, fill `reviewedBy` and an ISO-8601 `reviewedAt`, increment `version`, then validate.
5. **Deploy:** commit the JSON change to the connected production branch only after approval. Cloudflare Pages deploys the static file with the site. Verify the live set and try at least one question in both languages.

## Validate locally

Requires Node.js; no npm install is needed:

```bash
node scripts/validate-question-bank.mjs question-bank/sets/telangana-foundation-demo.json
```

The current five items intentionally remain marked `preview`. They are original demonstrations, not officially sourced previous-year questions or an approved full exam mock.

## Question record rules

- `correctOptionIndex` is zero-based: A=0, B=1, C=2, D=3.
- Both `en` and `te` question, all four options and explanation are required.
- `sourceType` is one of `original_practice`, `original_demo`, `official_previous_year`, or `syllabus_inspired`.
- An `official_previous_year` question requires a precise `sourceReference`. Check copyright/permission before republishing.
- Keep question wording neutral and self-contained. Avoid current-affairs questions without an as-of date and a source.
- For corrections, keep the same ID, increment set version, document the correction in the commit message, and retest affected attempts if/when server-side history is introduced.

## Who does what

- **ChatGPT:** may draft sets, translate, categorise, check structure, run the validator and prepare repository changes when asked.
- **Human reviewer / publisher:** verifies subject correctness and language, confirms provenance and rights, and explicitly approves publication.
- **GitHub + Cloudflare Pages:** store the reviewed source and serve the static update.

Nothing is published automatically just because a question was drafted. Ask for a defined set (for example, "draft 30 SI arithmetic questions") and review the result before asking to publish it.

## First Telangana Police review collection

`sets/telangana-police-foundation-01.json` contains 24 original bilingual practice questions for selected overlapping Telangana Police SI/Constable preliminary topics. It is intentionally marked `workflowStatus: review`, and each question is `status: review`; the live practice loader will not serve it. This is not a previous-year paper and is not a complete mock or a complete syllabus coverage. It requires a human subject-matter review and Telugu language review before publication.

Syllabus alignment checked against TGPRB 2026 SI Notification Rc No. 225/Rect./Rect-1/2026, Annexure II, and PC Notification Rc No. 189/Rect./Rect-2/2026, Annexure II. The official portal is https://www.tgprb.in/. Question-level source references identify primary references used for stable factual items. Arithmetic and reasoning are original items with worked solutions.

## Published pilot set

The Telangana Police foundation collection is now marked `published` and the Police SI and Police Constable guest-practice cards load it. It contains 24 original bilingual practice questions, not an official previous-year paper or a full-length mock. The user/owner approved pilot publication and AI-assisted structural, answer-key and bilingual checks are recorded in the set metadata; independent subject-expert certification is **not** claimed. A qualified subject reviewer and Telugu language reviewer should still inspect it, and reported corrections should be fixed promptly. The Telangana geography questions are supplementary general-awareness practice, not claimed as exact subheadings in the SI notification syllabus.
