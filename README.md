# Bodhuno — Learn. Practice. Rise.

Bodhuno is a mobile-first, bilingual (English/Telugu), guest-first exam-practice preview hosted on Cloudflare Pages.

## Current pilot

- Police SI has 127 questions across six short practice collections, plus a separate 200-question full mock preview. Police Constable has 128 questions across six short practice collections, plus a separate 200-question full mock preview. The short collections include foundation, syllabus expansion and two dated November 2026 current-affairs batches.
- Set 01 is the owner-approved pilot publication. Sets 02, 03 and 04 remain `preview` pending independent subject-expert and Telugu-language review. All are original bilingual practice questions, not official previous-year papers or full-length mocks.
- The available question collections do not constitute complete syllabus coverage. Both Police tracks now have a separate 200-question / 180-minute full-length practice mock preview, with +1 / −0.20 / 0 scoring. The mocks are original practice simulations, not official TGPRB papers, and remain pending independent subject-expert and Telugu-language review. Current-affairs coverage is limited to a dated November 2026 preview and is not comprehensive or automatically updated.
- Both sets follow the TGPRB 2026 PWT marking rule: +1 for correct, −0.20 for incorrect, 0 for unanswered.
- The official SI and PC PWT notifications specify 200 questions, 200 marks and three hours. Each Bodhuno Police module is a shorter practice set of 24 or 25 questions, with a one-minute-per-question practice timer. The sets remain separate and are not a 200-question simulation.
- TGPSC, TET/DSC, aptitude and placement cards still use the five-question demonstration set, not complete exam collections.
- Guest attempt history is stored only in the current browser's local storage (last 30 attempts), including subject/topic answer breakdowns for completed attempts. The progress dashboard shows overall accuracy, subject accuracy and focus areas; it flags a subject after at least five answers below 60% accuracy and a topic after at least three answers below 60%. Clearing browser data clears this history.
- Topic-wise practice combines available questions from the selected Police track, removes identical English question stems, and lets learners practise one subject/topic at a time. Topic practice and the dashboard work without sign-in, a server-side profile or a database.
- After a completed attempt, learners can launch a wrong-answer revision containing only questions they answered incorrectly (unanswered questions are excluded). Revision sessions retain the original English/Telugu content, options, explanations and scoring, and are saved as separate attempts in the same on-device progress history.
- Learners can bookmark up to 200 questions during a live practice or from the result explanations. Saved questions, correct answers and explanations are stored in browser local storage, can be removed at any time, and can be practised in a separate English/Telugu session. Saved-question practice uses +1 for correct answers and no penalty for wrong or unanswered questions; the saved list does not sync across devices.
- No registration, payment, database or live advertising integration is required for this phase.

## Question updates

Question content lives in `question-bank/sets/`, and `question-bank/catalog.json` controls which Police sets appear on the home screen. To add a new set, add its JSON file and one catalogue entry; the app discovers the card and opens the matching set without editing `index.html`. No separate admin app or database is required for this static pilot. Read [the question-bank workflow](question-bank/README.md).

Validate the question sets locally with Node.js:

```bash
find question-bank/sets -type f -name '*.json' -print0 | xargs -0 -n 1 node scripts/validate-question-bank.mjs
```

GitHub Actions validates every question set, checks catalogue-to-file references and runs the live guest Playwright suite on relevant commits. New content is deployed by the existing Cloudflare Pages main-branch deployment after its change is reviewed and merged.

For regular updates, I can prepare bilingual draft batches using current official sources and the exam syllabus. A qualified subject reviewer must verify facts and answer keys, and a Telugu-language reviewer must verify translations before a set is marked `published`. AI drafting is assistance, not the final academic approval.

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
