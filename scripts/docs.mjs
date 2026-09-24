#!/usr/bin/env node
/**
 * Deterministic documentation contract for feature orchestration.
 * It creates one manifest per feature, keeps artifact paths stable, and
 * records machine-readable updates without replacing authored Markdown.
 *
 * Usage:
 *   node scripts/docs.mjs init --slug reminders --title "Task reminders" --requirement "..."
 *   node scripts/docs.mjs update --slug reminders --artifact architecture --status complete --summary "..." --files src/lib/reminders.ts
 *   node scripts/docs.mjs validate [--slug reminders]
 */
import { existsSync, mkdirSync, readdirSync, readFileSync, writeFileSync } from "node:fs";
import { join, relative } from "node:path";

const root = process.cwd();
const manifestDir = join(root, "docs", "manifests");
const manifestVersion = 1;
const artifactDefinitions = [
  ["planning", "docs/planning/plan-{slug}.md", "Plan projektu"],
  ["risk", "docs/risk/risk-register-{slug}.md", "Rejestr ryzyk"],
  ["architecture", "docs/architecture/adr-{slug}.md", "Architecture Decision Record"],
  ["implementation-review", "docs/reviews/review-implementation-{slug}.md", "Recenzja implementacji"],
  ["test-strategy", "docs/test-strategy/test-strategy.md", "Strategia testowania"],
  ["test-plan", "docs/test-plans/test-plan-{slug}.md", "Plan testów"],
  ["manual-tests", "docs/manual-tests/manual-cases-{slug}.md", "Testy manualne"],
  ["automation", "docs/automation/automation-plan-{slug}.md", "Plan automatyzacji"],
  ["final-review", "docs/reviews/review-final-{slug}.md", "Finalny code review"],
  ["documentation", "docs/reports/implementation-{slug}.md", "Dokumentacja implementacji"],
  ["retrospective", "docs/reports/retrospective-{slug}.md", "Retrospektywa"],
];
const validStatuses = new Set(["pending", "in-progress", "complete", "blocked"]);

function fail(message) {
  console.error(`docs: ${message}`);
  process.exitCode = 1;
}

function args() {
  const values = {};
  for (let index = 3; index < process.argv.length; index += 1) {
    const token = process.argv[index];
    if (!token.startsWith("--")) continue;
    const key = token.slice(2);
    values[key] = process.argv[index + 1]?.startsWith("--") ? true : process.argv[++index];
  }
  return values;
}

function requiredSlug(values) {
  const slug = values.slug;
  if (!slug || !/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug)) {
    throw new Error("--slug musi mieć format kebab-case, np. reminders");
  }
  return slug;
}

function manifestPath(slug) {
  return join(manifestDir, `manifest-${slug}.json`);
}

function artifactPath(template, slug) {
  return template.replace("{slug}", slug);
}

function createArtifactContent(slug, title, requirement, key, label) {
  return `# ${label}: ${title}\n\n<!-- docs-manifest: slug=${slug} artifact=${key} status=pending -->\n\n## Cel\n\n${requirement || "Do uzupełnienia przez właściwego agenta."}\n\n## Ustalenia\n\nDo uzupełnienia.\n\n## Aktualizacje automatyczne\n\n| Data | Status | Podsumowanie | Zmienione pliki |\n|---|---|---|---|\n`;
}

function buildManifest(slug, values, existing) {
  const now = new Date().toISOString();
  return {
    schemaVersion: manifestVersion,
    slug,
    title: values.title || existing?.title || slug,
    requirement: values.requirement || existing?.requirement || "",
    source: values.source || existing?.source || "hybrid",
    createdAt: existing?.createdAt || now,
    updatedAt: now,
    implementationFiles: existing?.implementationFiles || [],
    artifacts: artifactDefinitions.map(([key, template, label]) => {
      const previous = existing?.artifacts?.find((artifact) => artifact.key === key);
      return {
        key,
        label,
        path: artifactPath(template, slug),
        status: previous?.status || (existsSync(join(root, artifactPath(template, slug))) ? "complete" : "pending"),
      };
    }),
    history: existing?.history || [],
  };
}

function readManifest(slug) {
  const path = manifestPath(slug);
  if (!existsSync(path)) throw new Error(`brak manifestu ${relative(root, path)}`);
  return { path, manifest: JSON.parse(readFileSync(path, "utf8")) };
}

function init(values) {
  const slug = requiredSlug(values);
  mkdirSync(manifestDir, { recursive: true });
  const path = manifestPath(slug);
  const existing = existsSync(path) ? JSON.parse(readFileSync(path, "utf8")) : undefined;
  const manifest = buildManifest(slug, values, existing);
  for (const artifact of manifest.artifacts) {
    const pathToArtifact = join(root, artifact.path);
    mkdirSync(join(pathToArtifact, ".."), { recursive: true });
    if (!existsSync(pathToArtifact)) {
      const definition = artifactDefinitions.find(([key]) => key === artifact.key);
      writeFileSync(pathToArtifact, createArtifactContent(slug, manifest.title, manifest.requirement, artifact.key, definition[2]));
    }
  }
  writeFileSync(path, `${JSON.stringify(manifest, null, 2)}\n`);
  console.log(`docs: manifest ${relative(root, path)} gotowy (${existing ? "zaktualizowano" : "utworzono"})`);
}

function update(values) {
  const slug = requiredSlug(values);
  const { path, manifest } = readManifest(slug);
  const artifact = manifest.artifacts.find((item) => item.key === values.artifact);
  if (!artifact) throw new Error(`nieznany artefakt: ${values.artifact}`);
  if (!validStatuses.has(values.status)) throw new Error(`status musi być jednym z: ${[...validStatuses].join(", ")}`);
  const summary = values.summary || "Aktualizacja artefaktu przez orkiestrację.";
  const files = values.files ? values.files.split(",").map((file) => file.trim()).filter(Boolean) : [];
  const now = new Date().toISOString();
  artifact.status = values.status;
  manifest.updatedAt = now;
  manifest.source = values.source || manifest.source;
  manifest.implementationFiles = [...new Set([...manifest.implementationFiles, ...files])].sort();
  manifest.history.push({ date: now, artifact: artifact.key, status: artifact.status, summary, files });
  const targetPath = join(root, artifact.path);
  if (!existsSync(targetPath)) throw new Error(`brak pliku artefaktu ${artifact.path}; uruchom init ponownie`);
  let content = readFileSync(targetPath, "utf8");
  const marker = new RegExp(`(<!-- docs-manifest: slug=${slug} artifact=${artifact.key} status=)([^ ]+)( -->)`);
  content = marker.test(content)
    ? content.replace(marker, `$1${artifact.status}$3`)
    : `<!-- docs-manifest: slug=${slug} artifact=${artifact.key} status=${artifact.status} -->\n\n${content}`;
  const updateRow = `| ${now} | ${artifact.status} | ${summary.replaceAll("|", "\\|")} | ${files.join(", ") || "-"} |\n`;
  content = content.includes("## Aktualizacje automatyczne")
    ? `${content}${content.endsWith("\n") ? "" : "\n"}${updateRow}`
    : `${content.trimEnd()}\n\n## Aktualizacje automatyczne\n\n| Data | Status | Podsumowanie | Zmienione pliki |\n|---|---|---|---|\n${updateRow}`;
  writeFileSync(targetPath, content);
  writeFileSync(path, `${JSON.stringify(manifest, null, 2)}\n`);
  console.log(`docs: ${artifact.key} -> ${artifact.status}`);
}

function validate(values) {
  const slugs = values.slug ? [requiredSlug(values)] : (existsSync(manifestDir) ? readdirSync(manifestDir, { withFileTypes: true }) : [])
    .filter((entry) => entry.isFile() && entry.name.startsWith("manifest-") && entry.name.endsWith(".json"))
    .map((entry) => entry.name.slice("manifest-".length, -".json".length));
  if (slugs.length === 0) {
    console.log("docs: brak manifestów, pominięto walidację");
    return;
  }
  const errors = [];
  for (const slug of slugs) {
    try {
      const { manifest } = readManifest(slug);
      if (manifest.schemaVersion !== manifestVersion) errors.push(`${slug}: nieobsługiwana wersja schematu`);
      if (manifest.slug !== slug) errors.push(`${slug}: slug w manifeście nie pasuje do nazwy pliku`);
      const artifacts = manifest.artifacts || [];
      const artifactKeys = artifacts.map((artifact) => artifact.key);
      for (const [key] of artifactDefinitions) {
        if (!artifactKeys.includes(key)) errors.push(`${slug}: brak wpisu artefaktu ${key}`);
      }
      if (new Set(artifactKeys).size !== artifactKeys.length) errors.push(`${slug}: zduplikowane wpisy artefaktów`);
      for (const artifact of artifacts) {
        if (!validStatuses.has(artifact.status)) errors.push(`${slug}: ${artifact.key} ma nieprawidłowy status`);
        if (!existsSync(join(root, artifact.path))) errors.push(`${slug}: brak ${artifact.path}`);
      }
    } catch (error) {
      errors.push(`${slug}: ${error.message}`);
    }
  }
  if (errors.length) {
    errors.forEach((error) => console.error(`docs: ERROR ${error}`));
    process.exitCode = 1;
    return;
  }
  console.log(`docs: PASS (${slugs.length} manifest${slugs.length === 1 ? "" : "y"})`);
}

const command = process.argv[2];
const values = args();
try {
  if (command === "init") init(values);
  else if (command === "update") update(values);
  else if (command === "validate") validate(values);
  else throw new Error("użycie: init | update | validate");
} catch (error) {
  fail(error.message);
}