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

  await page.locator("#palette button").last().click();
  await expect(page.locator("#counter")).toHaveText("Question 24 of 24");
  await expect(page.locator("#q")).toContainText("mobilisation phase");

  await page.locator("#palette button").first().click();
  await expect(page.locator("#counter")).toHaveText("Question 1 of 24");
  await expect(page.getByRole("button", { name: "C ₹120" })).toHaveClass(/selected/);

  page.once("dialog", dialog => dialog.accept());
  await page.getByRole("button", { name: "Submit practice" }).click();
  await expect(page.locator("#score")).toHaveText("1 / 24");
  await expect(page.locator("#summary")).toContainText("1 answered");
  await expect(page.locator("#review")).toContainText("15% of 800 =");
  await expect(page.locator("#review")).toContainText("Correct answer: ₹120");

  await page.locator("#lang").click();
  await expect(page.locator("#review")).toContainText("అసలు విలువ ₹800");
  await expect(page.locator("#review")).toContainText("800లో 15%");
});

test("Police Constable uses the published 24-question set; TGPSC retains its demo set", async ({ page }) => {
  await page.goto("/");
  await openExam(page, "Police Constable");
  await expect(page.locator("#counter")).toHaveText("Question 1 of 24");
  await expect(page.locator("#palette button")).toHaveCount(24);
  await expect(page.locator("#q")).toHaveText("What is 15% of 800?");

  await page.getByRole("button", { name: "← Exit practice" }).click();
  await openExam(page, "TGPSC Groups");
  await expect(page.locator("#counter")).toHaveText("Question 1 of 5");
  await expect(page.locator("#palette button")).toHaveCount(5);
});
