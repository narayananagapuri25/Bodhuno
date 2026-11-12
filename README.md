# Bodhuno — Learn. Practice. Rise.

A mobile-first, bilingual (English/Telugu), guest-first static preview for a free exam-preparation and career-readiness platform.

## Current preview
- Responsive landing page and Telangana exam-category discovery.
- English/Telugu interface and question switching.
- Guest practice flow loads its five demonstration questions from a version-controlled JSON question set.
- Question selection, navigation, countdown timer, scoring and bilingual answer explanations.
- Guest attempt history stored locally in the browser.
- Clearly marked advertisement placeholders outside active tests.
- No registration, payment, database or live advertising integration required for this phase.

## Question updates

Question content is stored under `question-bank/sets/`; the website does not require its HTML to be edited when a question set is updated. See [the question-bank workflow](question-bank/README.md) for the draft, review, validation and publishing steps.

Validate a question set locally with Node.js (no npm install):

```bash
node scripts/validate-question-bank.mjs question-bank/sets/telangana-foundation-demo.json
```

The current five questions are original demonstrations marked `preview`. They are not official previous-year questions or a verified full-length exam mock. Only human-reviewed, explicitly approved content should be marked `published`.

## Run locally

Open `index.html` through a local static server (the question set is fetched as a JSON asset):

```bash
python -m http.server 8080
```

Then visit http://localhost:8080.

## Deploy to Cloudflare Pages

Connect this GitHub repository to Cloudflare Pages:
- Production branch: `main`
- Framework preset: None
- Build command: leave blank
- Build output directory: `/`
- Root directory: leave blank

A commit to the connected production branch should trigger the Pages deployment. Verify the deployment in Cloudflare before announcing a live update.

## Product principles
1. Core learning, practice tests, explanations and performance insights remain free.
2. Guest users can begin immediately without mandatory registration.
3. The optional Ad-Free Pass, if introduced, only removes ads; it does not unlock educational advantages.
4. Never show ads during an active examination.
5. Clearly distinguish official previous-year material from original or syllabus-inspired practice.
6. Human review is required before publishing factual exam questions.

Bodhuno is a working brand name. Formal trademark clearance is pending.
