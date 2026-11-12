import { test, expect } from "@playwright/test";

async function openExam(page, examName) {
  const card = page.locator("article.card").filter({
    has: page.getByRole("heading", { name: examName, exact: true })
  });
  await expect(card).toHaveCount(1);
  await card.locator("button").click();
}

test("Police SI guest attempt: 24 questions, navigation, scoring and bilingual review", async ({ page }) => {
  await page.goto("/");
  await expect(page.getByRole("button", { name: "Guest access" })).toBeVisible();

  await openExam(page, "Police SI");
  await expect(page.getByRole("heading", { name: "Police SI · Quick practice" })).toBeVisible();
  await expect(page.locator("#counter")).toHaveText("Question 1 of 24");
  await expect(page.locator("#palette button")).toHaveCount(24);
  await expect(page.locator("#q")).toHaveText("What is 15% of 800?");

  await page.getByRole("button", { name: "C ₹120" }).click();
  await expect(page.locator("#answered")).toHaveText("1 answered");
  await expect(page.locator("#palette button").nth(0)).toHaveClass(/answered/);
  await page.getByRole("button", { name: "Mark for review" }).click();
  await expect(page.locator("#palette button").nth(0)).toHaveClass(/marked/);

  await page.locator("#palette button").nth(1).click();
  await page.getByRole("button", { name: "A 20", exact: true }).click();
  await expect(page.locator("#answered")).toHaveText("2 answered");

  await page.locator("#palette button").last().click();
  await expect(page.locator("#counter")).toHaveText("Question 24 of 24");
  await expect(page.locator("#q")).toContainText("mobilisation phase");

  await page.locator("#palette button").first().click();
  await expect(page.locator("#counter")).toHaveText("Question 1 of 24");
  await expect(page.getByRole("button", { name: "C ₹120" })).toHaveClass(/selected/);
  await expect(page.getByRole("button", { name: "Remove review mark" })).toHaveAttribute("aria-pressed", "true");

  page.once("dialog", dialog => dialog.accept());
  await page.getByRole("button", { name: "Submit practice" }).click();
  await expect(page.locator("#score")).toHaveText("0.80 / 24");
  await expect(page.locator("#summary")).toContainText("1 correct · 1 wrong · 22 unanswered");
  await expect(page.locator("#summary")).toContainText("50%");
  await expect(page.locator("#review")).toContainText("15% of 800 =");
  await expect(page.locator("#review")).toContainText("Correct · Your answer: ₹120 · Correct answer: ₹120");
  await expect(page.locator("#review")).toContainText("Incorrect · Your answer: 20 · Correct answer: 24");
  await expect(page.locator("#review")).toContainText("Not attempted");

  await page.locator("#lang").click();
  await expect(page.locator("#review")).toContainText("అసలు విలువ ₹800");
  await expect(page.locator("#review")).toContainText("800లో 15%");
  await expect(page.locator("#review")).toContainText("తప్పు సమాధానం");
});

test("Police Constable uses the published 24-question set; TGPSC retains its demo set", async ({ page }) => {
  await page.goto("/");
  await openExam(page, "Police Constable");
  await expect(page.locator("#counter")).toHaveText("Question 1 of 24");
  await expect(page.locator("#palette button")).toHaveCount(24);
  await expect(page.locator("#q")).toHaveText("What is 15% of 800?");
  await page.locator("#palette button").last().click();
  await expect(page.locator("#counter")).toHaveText("Question 24 of 24");
  await expect(page.locator("#q")).toHaveText("Choose the grammatically correct sentence.");

  await page.getByRole("button", { name: "← Exit practice" }).click();
  page.once("dialog", dialog => dialog.accept());
  await openExam(page, "TGPSC Groups");
  await expect(page.locator("#counter")).toHaveText("Question 1 of 5");
  await expect(page.locator("#palette button")).toHaveCount(5);
});


test("Guest attempt resumes after refresh with answers, position and review flags", async ({ page }) => {
  await page.goto("/");
  await openExam(page, "Police SI");
  await page.getByRole("button", { name: "C ₹120" }).click();
  await page.getByRole("button", { name: "Mark for review" }).click();
  await page.locator("#palette button").nth(1).click();
  await expect(page.locator("#counter")).toHaveText("Question 2 of 24");

  await page.reload();
  page.once("dialog", dialog => dialog.accept());
  await openExam(page, "Police SI");

  await expect(page.locator("#counter")).toHaveText("Question 2 of 24");
  await expect(page.locator("#answered")).toHaveText("1 answered");
  await expect(page.locator("#palette button").first()).toHaveClass(/answered/);
  await expect(page.locator("#palette button").first()).toHaveClass(/marked/);
  await page.locator("#palette button").first().click();
  await expect(page.getByRole("button", { name: "C ₹120" })).toHaveClass(/selected/);
  await expect(page.getByRole("button", { name: "Remove review mark" })).toHaveAttribute("aria-pressed", "true");
  page.once("dialog", dialog => dialog.accept());
  await page.getByRole("button", { name: "Submit practice" }).click();
  await expect(page.locator("#score")).toHaveText("1.00 / 24");
});

test("Submitting a blank Police practice attempt awards zero and no penalty", async ({ page }) => {
  await page.goto("/");
  await openExam(page, "Police SI");
  page.once("dialog", dialog => dialog.accept());
  await page.getByRole("button", { name: "Submit practice" }).click();
  await expect(page.locator("#score")).toHaveText("0.00 / 24");
  await expect(page.locator("#summary")).toContainText("0 correct · 0 wrong · 24 unanswered");
  await expect(page.locator("#review")).toContainText("Not attempted");
});


test("SI and Constable syllabus expansion preview sets load separately", async ({ page }) => {
  await page.goto("/");

  await openExam(page, "Police SI · Set 02");
  await expect(page.getByRole("heading", { name: "Police SI · Set 02 · Quick practice" })).toBeVisible();
  await expect(page.locator("#counter")).toHaveText("Question 1 of 24");
  await expect(page.locator("#palette button")).toHaveCount(24);
  await expect(page.locator("#q")).toHaveText("A can complete a job in 10 days and B in 15 days. How many days will they take working together?");
  await page.locator("#palette button").nth(20).click();
  await expect(page.locator("#options")).toContainText("Godavari");
  await page.getByRole("button", { name: "← Exit practice" }).click();

  page.once("dialog", dialog => dialog.accept());
  await openExam(page, "Police Constable · Set 02");
  await expect(page.getByRole("heading", { name: "Police Constable · Set 02 · Quick practice" })).toBeVisible();
  await expect(page.locator("#counter")).toHaveText("Question 1 of 24");
  await expect(page.locator("#palette button")).toHaveCount(24);
  await page.locator("#palette button").last().click();
  await expect(page.locator("#q")).toContainText("ancient");
});


test("SI and Constable syllabus expansion Set 03 loads bilingual question banks", async ({ page }) => {
  await page.goto("/");

  await openExam(page, "Police SI · Set 03");
  await expect(page.getByRole("heading", { name: "Police SI · Set 03 · Quick practice" })).toBeVisible();
  await expect(page.locator("#counter")).toHaveText("Question 1 of 24");
  await expect(page.locator("#palette button")).toHaveCount(24);
  await expect(page.locator("#q")).toHaveText("What is the least common multiple of 12 and 15?");
  await page.locator("#palette button").last().click();
  await expect(page.locator("#q")).toContainText("Charminar");

  await page.getByRole("button", { name: "← Exit practice" }).click();
  page.once("dialog", dialog => dialog.accept());
  await openExam(page, "Police Constable · Set 03");
  await expect(page.getByRole("heading", { name: "Police Constable · Set 03 · Quick practice" })).toBeVisible();
  await expect(page.locator("#counter")).toHaveText("Question 1 of 25");
  await expect(page.locator("#palette button")).toHaveCount(25);
  await expect(page.locator("#q")).toHaveText("What is the least common multiple of 12 and 15?");
  await page.locator("#palette button").nth(19).click();
  await expect(page.locator("#q")).toContainText("largest Indian state");
  await expect(page.locator("#options")).toContainText("Rajasthan");
  await page.locator("#lang").click();
  await expect(page.locator("#q")).toContainText("విస్తీర్ణం ప్రకారం భారతదేశంలో అతిపెద్ద రాష్ట్రం");
});


test("SI and Constable Set 04 preview collections load and retain bilingual rendering", async ({ page }) => {
  await page.goto("/");
  await openExam(page, "Police SI · Set 04");
  await expect(page.getByRole("heading", { name: "Police SI · Set 04 · Quick practice" })).toBeVisible();
  await expect(page.locator("#counter")).toHaveText("Question 1 of 24");
  await expect(page.locator("#q")).toContainText("father is 40 years old");
  await page.locator("#palette button").nth(21).click();
  await expect(page.locator("#q")).toContainText("Pochampally");
  await page.getByRole("button", { name: "← Exit practice" }).click();

  page.once("dialog", dialog => dialog.accept());
  await openExam(page, "Police Constable · Set 04");
  await expect(page.getByRole("heading", { name: "Police Constable · Set 04 · Quick practice" })).toBeVisible();
  await expect(page.locator("#counter")).toHaveText("Question 1 of 24");
  await expect(page.locator("#palette button")).toHaveCount(24);
  await page.locator("#palette button").last().click();
  await expect(page.locator("#q")).toContainText("Neither of the boys");
  await page.locator("#lang").click();
  await expect(page.locator("#q")).toContainText("Neither of the boys");
});


test("SI and Constable November 2026 current-affairs previews load bilingual questions and TGPRB scoring", async ({ page }) => {
  await page.goto("/");
  // Normalize the shared language control so this test is independent of saved guest state.
  if ((await page.locator("#lang").innerText()).trim() === "English") {
    await page.locator("#lang").click();
  }
  await openExam(page, "Police SI · Current Affairs");
  await expect(page.getByRole("heading", { name: "Police SI · Current Affairs Nov 2026 · Quick practice" })).toBeVisible();
  await expect(page.locator("#counter")).toHaveText("Question 1 of 16");
  await expect(page.locator("#palette button")).toHaveCount(16);
  await expect(page.locator("#q")).toContainText("Stand-Up India Scheme");
  await expect(page.locator("#mockDescription")).toContainText("−0.2 for incorrect");
  await page.locator("#lang").click();
  await expect(page.locator("#q")).toContainText("స్టాండ్-అప్ ఇండియా పథకం");
  await page.getByRole("button", { name: /మహిళలు/ }).click();
  await expect(page.locator("#answered")).toHaveText("1 answered");
  page.once("dialog", dialog => dialog.accept());
  await page.getByRole("button", { name: "Submit practice" }).click();
  await expect(page.locator("#score")).toHaveText("1.00 / 16");
  await expect(page.locator("#review")).toContainText("31 మార్చి 2031");

  await page.getByRole("button", { name: "Back to home" }).click();
  if ((await page.locator("#lang").innerText()).trim() === "English") {
    await page.locator("#lang").click();
  }
  await openExam(page, "Police Constable · Current Affairs");
  await expect(page.getByRole("heading", { name: "Police Constable · Current Affairs Nov 2026 · Quick practice" })).toBeVisible();
  await expect(page.locator("#counter")).toHaveText("Question 1 of 16");
  await expect(page.locator("#palette button")).toHaveCount(16);
  await expect(page.locator("#q")).toContainText("Stand-Up India Scheme");
  await page.locator("#palette button").nth(15).click();
  await expect(page.locator("#q")).toContainText("Bharat-VISTAAR");
  await page.locator("#lang").click();
  await expect(page.locator("#q")).toContainText("భారత్-విస్తార్");
});


test("SI and Constable full-length mock previews load 200 questions with a 180-minute timer", async ({ page }) => {
  await page.goto("/");
  if ((await page.locator("#lang").innerText()).trim() === "English") {
    await page.locator("#lang").click();
  }

  await openExam(page, "Police SI · Full Mock 01");
  await expect(page.getByRole("heading", { name: "Police SI · Full Mock 01 · Full-length mock" })).toBeVisible();
  await expect(page.locator("#counter")).toHaveText("Question 1 of 200");
  await expect(page.locator("#palette button")).toHaveCount(200);
  await expect(page.locator("#clock")).toHaveText("03:00:00");
  await expect(page.locator("#mockDescription")).toContainText("180-minute full-length simulation");
  await page.locator("#palette button").last().click();
  await expect(page.locator("#counter")).toHaveText("Question 200 of 200");
  await expect(page.locator("#q")).toContainText("tank contains 180 litres");
  await page.locator("#lang").click();
  await expect(page.locator("#q")).toContainText("180 లీటర్ల");
  await page.locator("#palette button").first().click();
  page.once("dialog", dialog => dialog.accept());
  await page.getByRole("button", { name: "Submit practice" }).click();
  await expect(page.locator("#score")).toHaveText("0.00 / 200");
  await expect(page.locator("#summary")).toContainText("0 correct · 0 wrong · 200 unanswered");

  await page.getByRole("button", { name: "Back to home" }).click();
  if ((await page.locator("#lang").innerText()).trim() === "English") {
    await page.locator("#lang").click();
  }
  await openExam(page, "Police Constable · Full Mock 01");
  await expect(page.getByRole("heading", { name: "Police Constable · Full Mock 01 · Full-length mock" })).toBeVisible();
  await expect(page.locator("#counter")).toHaveText("Question 1 of 200");
  await expect(page.locator("#palette button")).toHaveCount(200);
  await expect(page.locator("#clock")).toHaveText("03:00:00");
  await page.locator("#palette button").last().click();
  await expect(page.locator("#counter")).toHaveText("Question 200 of 200");
  await page.locator("#lang").click();
  await expect(page.locator("#q")).toContainText("తదుపరి సంఖ్యను కనుగొనండి");
  page.once("dialog", dialog => dialog.accept());
  await page.getByRole("button", { name: "Submit practice" }).click();
  await expect(page.locator("#score")).toHaveText("0.00 / 200");
});



test("Police question cards are generated from the question catalogue", async ({ page }) => {
  await page.goto("/");
  const response = await page.request.get("/question-bank/catalog.json");
  expect(response.ok()).toBeTruthy();
  const catalog = await response.json();
  expect(catalog.format).toBe("bodhuno-question-catalog/v1");
  expect(catalog.sets.length).toBeGreaterThan(0);

  for (const entry of catalog.sets) {
    const card = page.locator("article.card").filter({
      has: page.getByRole("heading", { name: entry.title, exact: true })
    });
    await expect(card).toHaveCount(1);
    await expect(card.locator("button")).toBeVisible();
  }
});

test("SI and Constable November 2026 current-affairs Set 02 loads the new bilingual batch", async ({ page }) => {
  await page.goto("/");
  if ((await page.locator("#lang").innerText()).trim() === "English") {
    await page.locator("#lang").click();
  }

  await openExam(page, "Police SI · Current Affairs Set 02");
  await expect(page.locator("#mockTitle")).toHaveText("Police SI · Current Affairs Set 02 · Quick practice");
  await expect(page.locator("#counter")).toHaveText("Question 1 of 15");
  await expect(page.locator("#palette button")).toHaveCount(15);
  await expect(page.locator("#q")).toContainText("Which city hosted the 8th edition");
  await page.locator("#lang").click();
  await expect(page.locator("#q")).toContainText("భారతదేశం–మయన్మార్ నౌకాదళ విన్యాసం");
  await expect(page.locator("#options")).toContainText("విశాఖపట్నం");

  await page.getByRole("button", { name: "← Exit practice" }).click();
  if ((await page.locator("#lang").innerText()).trim() === "English") {
    await page.locator("#lang").click();
  }
  page.once("dialog", dialog => dialog.accept());
  await openExam(page, "Police Constable · Current Affairs Set 02");
  await expect(page.locator("#mockTitle")).toHaveText("Police Constable · Current Affairs Set 02 · Quick practice");
  await expect(page.locator("#counter")).toHaveText("Question 1 of 15");
  await expect(page.locator("#palette button")).toHaveCount(15);
  await expect(page.locator("#q")).toContainText("Which city hosted the 8th edition");
  await page.locator("#lang").click();
  await expect(page.locator("#q")).toContainText("భారతదేశం–మయన్మార్ నౌకాదళ విన్యాసం");
  await page.locator("#palette button").last().click();
  await expect(page.locator("#counter")).toHaveText("Question 15 of 15");
  await expect(page.locator("#q")).toContainText("పోషక ఆధారిత సబ్సిడీ");
});

