import { test, expect } from "@playwright/test";

async function openExam(page, examName) {
  const card = page.locator("article.card").filter({
    has: page.getByRole("heading", { name: examName, exact: true })
  });
  await expect(card).toHaveCount(1);
  await card.getByRole("button", { name: "Try now →" }).click();
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
  await page.locator("#palette button").nth(22).click();
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
