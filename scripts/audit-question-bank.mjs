#!/usr/bin/env node
import { readdir, readFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = process.cwd();
const setsDirectory = path.join(root, "question-bank", "sets");

export function normalizeQuestionStem(value) {
  return String(value ?? "")
    .normalize("NFKC")
    .toLocaleLowerCase("en-IN")
    .replace(/[\u200B-\u200D\uFEFF]/g, "")
    .replace(/[^\p{L}\p{N}]+/gu, " ")
    .trim()
    .replace(/\s+/g, " ");
}

function containsHttpUrl(value) {
  const candidates = String(value ?? "").match(/https?:\/\/[^\s)\]}>]+/gi) ?? [];
  return candidates.some(candidate => {
    try {
      const url = new URL(candidate.replace(/[.,;:!?]+$/, ""));
      return url.protocol === "https:" || url.protocol === "http:";
    } catch {
      return false;
    }
  });
}

export function inspectQuestionSet(set, file = "<memory>") {
  const errors = [];
  const warnings = [];
  const questions = Array.isArray(set?.questions) ? set.questions : [];
  const ids = new Set();
  const stems = new Map();
  const subjects = new Set();
  const topics = new Set();
  let questionsWithSource = 0;

  for (const [index, question] of questions.entries()) {
    const label = `${file}: questions[${index}] (${question?.id ?? "no-id"})`;

    if (question?.id) {
      if (ids.has(question.id)) errors.push(`${label}: duplicate question id within this set`);
      ids.add(question.id);
    }

    if (question?.subject?.trim()) subjects.add(question.subject.trim());
    if (question?.topic?.trim()) topics.add(question.topic.trim());

    if (question?.sourceReference?.trim()) questionsWithSource += 1;

    const englishStem = normalizeQuestionStem(question?.languages?.en?.question);
    if (englishStem) {
      const previous = stems.get(englishStem);
      if (previous) {
        errors.push(`${label}: duplicate English question stem; first used by ${previous}`);
      } else {
        stems.set(englishStem, label);
      }
    }

    for (const language of ["en", "te"]) {
      const copy = question?.languages?.[language];
      const options = Array.isArray(copy?.options) ? copy.options : [];
      const normalizedOptions = options.map(option => normalizeQuestionStem(option));
      if (normalizedOptions.some((option, optionIndex) =>
        option && normalizedOptions.indexOf(option) !== optionIndex
      )) {
        errors.push(`${label}: duplicate option text in ${language}`);
      }
    }

    const teluguStem = normalizeQuestionStem(question?.languages?.te?.question);
    if (englishStem && teluguStem && englishStem === teluguStem) {
      warnings.push(`${label}: English and Telugu question stems are identical after normalization`);
    }
  }

  const isCurrentAffairs =
    String(set?.setId ?? "").includes("current-affairs") ||
    (Array.isArray(set?.examTags) && set.examTags.includes("current-affairs"));

  if (isCurrentAffairs) {
    for (const [index, question] of questions.entries()) {
      if (!containsHttpUrl(question?.sourceReference)) {
        errors.push(`${file}: current-affairs question ${question?.id ?? index} must have a question-level HTTP(S) source URL`);
      }
    }
  }

  const isFullMock = String(set?.setId ?? "").includes("full-mock");
  if (isFullMock) {
    if (questions.length !== 200) {
      errors.push(`${file}: full mock must contain exactly 200 questions (found ${questions.length})`);
    }

    const scoring = set?.scoring ?? {};
    if (scoring.correctPoints !== 1 || scoring.incorrectPenalty !== 0.2 || scoring.unansweredPoints !== 0) {
      errors.push(`${file}: full mock scoring must be +1 correct, -0.20 incorrect and 0 unanswered`);
    }
    if (scoring.practiceTimerSecondsPerQuestion !== 54 ||
        questions.length * (scoring.practiceTimerSecondsPerQuestion ?? 0) !== 10_800) {
      errors.push(`${file}: 200-question full mock must provide a 180-minute timer (54 seconds per question)`);
    }

    const subjectsLower = [...subjects].map(subject => subject.toLocaleLowerCase("en-IN"));
    const isSiMock = String(set.setId).includes("police-si-full-mock");
    const isConstableMock = String(set.setId).includes("constable-full-mock");

    if (isSiMock && subjectsLower.some(subject => subject === "english")) {
      errors.push(`${file}: Police SI full mock must not contain an English subject section`);
    }
    if (isConstableMock && !subjectsLower.some(subject => subject === "english")) {
      errors.push(`${file}: Police Constable full mock must include its English subject section`);
    }
    if (set.workflowStatus === "published" && (!set.reviewedBy?.trim() || !set.reviewedAt)) {
      errors.push(`${file}: full mock cannot be published without recorded review metadata`);
    }
  }

  return {
    file,
    setId: set?.setId ?? path.basename(file, ".json"),
    workflowStatus: set?.workflowStatus ?? "unknown",
    questionCount: questions.length,
    sourceCoverage: questions.length ? questionsWithSource / questions.length : 0,
    subjects: [...subjects].sort(),
    topicCount: topics.size,
    errors,
    warnings
  };
}

async function run() {
  const fileNames = (await readdir(setsDirectory))
    .filter(name => name.endsWith(".json"))
    .sort();

  if (fileNames.length === 0) {
    console.error("No question-set JSON files found.");
    process.exitCode = 1;
    return;
  }

  const reports = [];
  const crossSetStems = new Map();

  for (const fileName of fileNames) {
    const file = path.join("question-bank", "sets", fileName);
    let set;
    try {
      set = JSON.parse(await readFile(path.join(setsDirectory, fileName), "utf8"));
    } catch (error) {
      reports.push({
        file,
        setId: fileName,
        workflowStatus: "invalid",
        questionCount: 0,
        sourceCoverage: 0,
        subjects: [],
        topicCount: 0,
        errors: [`Cannot read valid JSON: ${error.message}`],
        warnings: []
      });
      continue;
    }

    const report = inspectQuestionSet(set, file);
    reports.push(report);

    for (const question of set.questions ?? []) {
      const stem = normalizeQuestionStem(question?.languages?.en?.question);
      if (!stem) continue;
      const entries = crossSetStems.get(stem) ?? [];
      entries.push({ setId: set.setId, file: fileName, questionId: question.id });
      crossSetStems.set(stem, entries);
    }
  }

  const crossSetReuse = [...crossSetStems.entries()]
    .filter(([, entries]) => new Set(entries.map(entry => entry.setId)).size > 1);
  const errorCount = reports.reduce((count, report) => count + report.errors.length, 0);
  const warningCount = reports.reduce((count, report) => count + report.warnings.length, 0);
  const totalQuestions = reports.reduce((count, report) => count + report.questionCount, 0);

  console.log("# Bodhuno question-bank quality audit");
  console.log("");
  console.log(`Audited **${reports.length} sets** and **${totalQuestions} question records**.`);
  console.log("");
  console.log("| Set | Status | Questions | Subjects | Topics | Source coverage |");
  console.log("|---|---|---:|---:|---:|---:|");
  for (const report of reports) {
    console.log(`| ${report.setId} | ${report.workflowStatus} | ${report.questionCount} | ${report.subjects.length} | ${report.topicCount} | ${Math.round(report.sourceCoverage * 100)}% |`);
  }

  console.log("");
  console.log(`- Blocking issues: **${errorCount}**`);
  console.log(`- Review warnings: **${warningCount}**`);
  console.log(`- Exact English stems reused across different sets: **${crossSetReuse.length} groups** (reported for review, not automatically blocked; full mocks may intentionally reuse practice-bank items).`);

  const errors = reports.flatMap(report => report.errors);
  const warnings = reports.flatMap(report => report.warnings);

  if (errors.length) {
    console.log("");
    console.log("## Blocking issues");
    for (const error of errors) console.log(`- ${error}`);
  }
  if (warnings.length) {
    console.log("");
    console.log("## Review warnings");
    for (const warning of warnings.slice(0, 50)) console.log(`- ${warning}`);
    if (warnings.length > 50) console.log(`- …and ${warnings.length - 50} additional warning(s).`);
  }

  if (errorCount > 0) process.exitCode = 1;
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  await run();
}
