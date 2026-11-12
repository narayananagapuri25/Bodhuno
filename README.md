# Bodhuno — Learn. Practice. Rise.

Bodhuno is a mobile-first, bilingual (English/Telugu), guest-first exam-practice preview hosted on Cloudflare Pages.

## Current pilot

- Police SI has 72 questions across three separate sets (24 foundation, 24 Set 02 preview, 24 Set 03 preview). Police Constable has 73 questions (24 foundation, 24 Set 02 preview, 25 Set 03 preview).
- Set 01 is the owner-approved pilot publication. Sets 02 and 03 remain `preview` pending independent subject-expert and Telugu-language review. All are original bilingual practice questions, not official previous-year papers or full-length mocks.
- The available questions do not constitute complete syllabus coverage or the official 200-question examination; current affairs coverage remains outstanding.
- Both sets follow the TGPRB 2026 PWT marking rule: +1 for correct, −0.20 for incorrect, 0 for unanswered.
- The official SI and PC PWT notifications specify 200 questions, 200 marks and three hours. Each Bodhuno Police module is a shorter practice set of 24 or 25 questions, with a one-minute-per-question practice timer. The sets remain separate and are not a 200-question simulation.
- TGPSC, TET/DSC, aptitude and placement cards still use the five-question demonstration set, not complete exam collections.
- Guest attempt history is stored only in the current browser's local storage (last 30 attempts). Clearing browser data clears that history.
- No registration, payment, database or live advertising integration is required for this phase.

## Question updates

Question content lives in `question-bank/sets/`. Ordinary question additions do not require editing the website HTML. Read [the question-bank workflow](question-bank/README.md).

Validate the question sets locally with Node.js:

```bash
find question-bank/sets -type f -name '*.json' -print0 | xargs -0 -n 1 node scripts/validate-question-bank.mjs
```

GitHub Actions runs the question-bank validator and the live guest Playwright test suite on relevant commits.

## Run locally

```bash
npm install
npm run test:e2e
python -m http.server 8080
```

Visit http://localhost:8080. Playwright defaults to https://bodhuno.pages.dev; set `BODHUNO_BASE_URL` to test a different environment.

## Cloudflare Pages

Connect the repository's `main` branch with no framework preset, no build command and `/` as the output directory. Confirm the Pages deployment itself before announcing a live change.

## Product principles

1. Core learning, practice tests, explanations and performance insights remain free.
2. Guest users can begin immediately without mandatory registration.
3. An optional Ad-Free Pass, if introduced, only removes ads; it does not unlock educational advantages.
4. Never show ads during an active examination.
5. Clearly distinguish official previous-year material from original practice and check reuse rights before republishing.
6. AI drafting does not replace subject-matter and Telugu-language review.
7. Guest attempt history stays in local browser storage during this phase.

Bodhuno is a working brand name. Formal trademark clearance is pending.
