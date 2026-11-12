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
