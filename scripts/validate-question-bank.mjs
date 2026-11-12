#!/usr/bin/env node
import { readFile } from "node:fs/promises";

const file = process.argv[2];
if (!file) {
  console.error("Usage: node scripts/validate-question-bank.mjs <question-set.json>");
  process.exit(2);
}

let set;
try {
  set = JSON.parse(await readFile(file, "utf8"));
} catch (error) {
  console.error(`Cannot read valid JSON from ${file}: ${error.message}`);
  process.exit(1);
}

const errors = [];
const allowedSetStatuses = ["draft", "review", "preview", "published"];
const allowedQuestionStatuses = ["draft", "review", "preview", "published", "retired"];
const allowedSources = ["original_practice", "original_demo", "official_previous_year", "syllabus_inspired"];
const languages = ["en", "te"];

if (set.format !== "bodhuno-question-set/v1") errors.push("format must be bodhuno-question-set/v1");
if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(set.setId ?? "")) errors.push("setId must be lowercase kebab-case");
if (!set.title?.trim()) errors.push("title is required");
if (!Number.isInteger(set.version) || set.version < 1) errors.push("version must be a positive integer");
if (!allowedSetStatuses.includes(set.workflowStatus)) errors.push("workflowStatus is invalid");
if (!allowedSources.includes(set.sourceType)) errors.push("sourceType is invalid");
if (!Array.isArray(set.languages) || !set.languages.includes("en") || !set.languages.includes("te")) errors.push("Both en and te must be declared in languages");
if (!Array.isArray(set.examTags) || set.examTags.length === 0) errors.push("At least one examTag is required");
if (!Array.isArray(set.questions) || set.questions.length === 0) errors.push("At least one question is required");
if (set.scoring !== undefined) {
  const scoring = set.scoring;
  for (const key of ["correctPoints", "incorrectPenalty", "unansweredPoints"]) {
    if (typeof scoring[key] !== "number" || !Number.isFinite(scoring[key]) || scoring[key] < 0) errors.push(`scoring.${key} must be a finite non-negative number`);
  }
  if (!scoring.ruleLabel?.trim()) errors.push("scoring.ruleLabel is required");
  if (!scoring.officialExamFormat?.trim()) errors.push("scoring.officialExamFormat is required");
  if (!Number.isInteger(scoring.practiceTimerSecondsPerQuestion) || scoring.practiceTimerSecondsPerQuestion < 1) errors.push("scoring.practiceTimerSecondsPerQuestion must be a positive integer");
  if (!Array.isArray(scoring.sourceReferences) || scoring.sourceReferences.length === 0 || scoring.sourceReferences.some(x => typeof x !== "string" || !x.trim())) errors.push("scoring.sourceReferences must contain at least one non-empty source");
  if (!scoring.practiceNote?.trim()) errors.push("scoring.practiceNote is required");
}

const ids = new Set();
for (const [index, q] of (Array.isArray(set.questions) ? set.questions : []).entries()) {
  const label = `questions[${index}]`;
  if (!q.id?.trim()) errors.push(`${label}: id is required`);
  if (ids.has(q.id)) errors.push(`${label}: duplicate id "${q.id}"`);
  ids.add(q.id);
  if (!q.subject?.trim() || !q.topic?.trim()) errors.push(`${label}: subject and topic are required`);
  if (!["easy", "medium", "hard"].includes(q.difficulty)) errors.push(`${label}: difficulty must be easy, medium or hard`);
  if (!allowedQuestionStatuses.includes(q.status)) errors.push(`${label}: invalid status`);
  if (!allowedSources.includes(q.sourceType)) errors.push(`${label}: invalid sourceType`);
  if (!Number.isInteger(q.correctOptionIndex) || q.correctOptionIndex < 0 || q.correctOptionIndex > 3) errors.push(`${label}: correctOptionIndex must be 0–3`);
  for (const lang of languages) {
    const copy = q.languages?.[lang];
    if (!copy?.question?.trim()) errors.push(`${label}: missing ${lang} question`);
    if (!Array.isArray(copy?.options) || copy.options.length !== 4 || copy.options.some(x => typeof x !== "string" || !x.trim())) errors.push(`${label}: ${lang} must have exactly four non-empty options`);
    if (!copy?.explanation?.trim()) errors.push(`${label}: missing ${lang} explanation`);
  }
  if (q.sourceType === "official_previous_year" && !q.sourceReference?.trim()) errors.push(`${label}: official previous-year questions require a sourceReference`);
}
if (set.workflowStatus === "published" && set.questions.some(q => q.status !== "published")) errors.push("Every question must have status=published before the set can be published");
if (set.workflowStatus === "published" && (!set.reviewedBy?.trim() || !set.reviewedAt)) errors.push("Published sets require reviewedBy and reviewedAt");

if (errors.length) {
  console.error(`Question set validation failed (${errors.length} issue(s)):`);
  for (const error of errors) console.error(` - ${error}`);
  process.exit(1);
}
console.log(`OK: ${set.setId} · ${set.questions.length} questions · status=${set.workflowStatus}`);
