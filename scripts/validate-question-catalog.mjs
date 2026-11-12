#!/usr/bin/env node
import { readFile } from "node:fs/promises";
import path from "node:path";

const root = process.cwd();
const catalogPath = path.join(root, "question-bank", "catalog.json");
const errors = [];
const fail = message => errors.push(message);

let catalog;
try {
  catalog = JSON.parse(await readFile(catalogPath, "utf8"));
} catch (error) {
  console.error(`Cannot read question-bank/catalog.json: ${error.message}`);
  process.exit(1);
}

if (catalog.format !== "bodhuno-question-catalog/v1") fail("format must be bodhuno-question-catalog/v1");
if (!Array.isArray(catalog.sets) || catalog.sets.length === 0) fail("sets must be a non-empty array");

const examNames = new Set();
const titles = new Set();
const files = new Set();
const allowedStatuses = new Set(["preview", "published"]);
const sets = Array.isArray(catalog.sets) ? catalog.sets : [];

for (const [index, entry] of sets.entries()) {
  const label = `sets[${index}]`;
  if (!entry || typeof entry !== "object") {
    fail(`${label} must be an object`);
    continue;
  }
  for (const field of ["examName", "title", "description", "file", "icon", "tag", "footer", "actionLabel"]) {
    if (typeof entry[field] !== "string" || !entry[field].trim()) fail(`${label}.${field} is required`);
  }
  if (!Number.isInteger(entry.order) || entry.order < 1) fail(`${label}.order must be a positive integer`);
  if (!Number.isInteger(entry.questionCount) || entry.questionCount < 1) fail(`${label}.questionCount must be a positive integer`);
  if (!allowedStatuses.has(entry.workflowStatus)) fail(`${label}.workflowStatus must be preview or published`);
  if (examNames.has(entry.examName)) fail(`${label}: duplicate examName "${entry.examName}"`);
  if (titles.has(entry.title)) fail(`${label}: duplicate title "${entry.title}"`);
  if (files.has(entry.file)) fail(`${label}: duplicate file "${entry.file}"`);
  examNames.add(entry.examName);
  titles.add(entry.title);
  files.add(entry.file);

  if (typeof entry.file !== "string" || !/^question-bank\/sets\/[a-z0-9-]+\.json$/.test(entry.file)) {
    fail(`${label}.file must point to a JSON file directly inside question-bank/sets`);
    continue;
  }

  const setsRoot = path.resolve(root, "question-bank", "sets") + path.sep;
  const resolved = path.resolve(root, entry.file);
  if (!resolved.startsWith(setsRoot)) {
    fail(`${label}.file resolves outside question-bank/sets`);
    continue;
  }

  let set;
  try {
    set = JSON.parse(await readFile(resolved, "utf8"));
  } catch (error) {
    fail(`${label}: cannot read ${entry.file}: ${error.message}`);
    continue;
  }
  if (set.format !== "bodhuno-question-set/v1") fail(`${label}: referenced file has an invalid question-set format`);
  if (set.workflowStatus !== entry.workflowStatus) fail(`${label}: catalogue status does not match ${entry.file}`);
  if (!Array.isArray(set.questions) || set.questions.length !== entry.questionCount) fail(`${label}: questionCount does not match ${entry.file}`);
}

if (errors.length) {
  console.error(`Question catalogue validation failed (${errors.length} issue(s)):`);
  for (const error of errors) console.error(` - ${error}`);
  process.exit(1);
}

console.log(`OK: ${sets.length} catalogue entries reference matching question sets`);
