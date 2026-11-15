import test from "node:test";
import assert from "node:assert/strict";
import { inspectQuestionSet, normalizeQuestionStem } from "./audit-question-bank.mjs";

function question(id, english, telugu = "తెలుగు ప్రశ్న", options = ["A", "B", "C", "D"]) {
  return {
    id,
    subject: "General Studies",
    topic: "Sample",
    sourceReference: "https://example.gov.in/source",
    languages: {
      en: { question: english, options, explanation: "Explanation" },
      te: { question: telugu, options, explanation: "వివరణ" }
    }
  };
}

test("question stem normalization ignores case, punctuation and repeated spacing", () => {
  assert.equal(
    normalizeQuestionStem("  What IS  15% of 800? "),
    normalizeQuestionStem("what is 15% of 800")
  );
});

test("quality audit blocks duplicate English stems within one set", () => {
  const report = inspectQuestionSet({
    setId: "sample-set",
    workflowStatus: "preview",
    examTags: [],
    questions: [
      question("q-1", "What is 15% of 800?"),
      question("q-2", "WHAT IS 15% OF 800")
    ]
  }, "sample.json");

  assert.equal(report.errors.length, 1);
  assert.match(report.errors[0], /duplicate English question stem/);
});

test("quality audit blocks repeated option text in either language", () => {
  const report = inspectQuestionSet({
    setId: "sample-set",
    workflowStatus: "preview",
    examTags: [],
    questions: [
      question("q-1", "What is 15% of 800?", "తెలుగు ప్రశ్న", ["A", "B", "A", "D"])
    ]
  }, "sample.json");

  assert.equal(report.errors.length, 1);
  assert.match(report.errors[0], /duplicate option text in en/);
});

test("current-affairs questions require question-level source URLs", () => {
  const item = question("q-1", "Who announced the scheme?");
  item.sourceReference = "Official information was checked.";
  const report = inspectQuestionSet({
    setId: "telangana-police-si-current-affairs-sample",
    workflowStatus: "preview",
    examTags: ["police-si", "current-affairs"],
    questions: [item]
  }, "current-affairs.json");

  assert.equal(report.errors.length, 1);
  assert.match(report.errors[0], /question-level HTTP\(S\) source URL/);
});

test("a valid bilingual current-affairs item with a source URL passes", () => {
  const report = inspectQuestionSet({
    setId: "telangana-police-si-current-affairs-sample",
    workflowStatus: "preview",
    examTags: ["police-si", "current-affairs"],
    questions: [question("q-1", "Who announced the scheme?")]
  }, "current-affairs.json");

  assert.deepEqual(report.errors, []);
  assert.equal(report.sourceCoverage, 1);
});
