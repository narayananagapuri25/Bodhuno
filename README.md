# Bodhuno — Learn. Practice. Rise.

A mobile-first, bilingual (English/Telugu), guest-first static website preview for a free exam-preparation and career-readiness platform.

## Current preview
- Responsive landing page and Telangana exam-category discovery.
- English/Telugu interface toggle.
- Guest-first interactive practice flow with five original demonstration questions.
- Question selection, navigation, countdown timer, scoring and answer explanations.
- Guest attempt history stored locally in the browser.
- Clearly marked advertisement placeholders outside active tests.
- No registration or payment required for the preview.
- No live advertising integrations.

## Run locally
Open `index.html` in a modern browser, or run:

```bash
python -m http.server 8080
```

Then visit http://localhost:8080.

## Deploy to Cloudflare Pages (free static hosting)
Connect this GitHub repository to Cloudflare Pages and use:

- Production branch: `main`
- Framework preset: None
- Build command: leave blank
- Build output directory: `/`
- Root directory: leave blank

Cloudflare Pages will provide a `*.pages.dev` address.

## Important scope and content notice
This is an initial front-end preview, not a complete production examination platform. The five sample questions are original demonstrations; they are not official previous-year questions or verified exam-pattern mock questions.

The following still need to be built and reviewed:
- API and database-backed question bank.
- Admin CMS and reviewer/publisher workflow.
- Official exam-pattern and syllabus configuration.
- Full-length exam simulations and robust attempt recovery.
- Server-side scoring and answer-key protection.
- Candidate accounts and cross-device sync (guest access remains the default).
- Privacy, consent and data-retention controls.
- Advertising integration and optional Ad-Free Pass.
- Production security, accessibility and end-to-end testing.

## Product principles
1. Core learning, practice tests, explanations and performance insights remain free.
2. Guest users can begin immediately without mandatory registration.
3. The optional Ad-Free Pass, if introduced, only removes ads; it does not unlock educational advantages.
4. Never show ads during an active examination.
5. Human-reviewed content and clearly labelled official vs original practice material.

Bodhuno is a working brand name. Formal trademark clearance is pending.
