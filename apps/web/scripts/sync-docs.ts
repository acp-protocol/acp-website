#!/usr/bin/env tsx
/**
 * Sync Documentation Script
 *
 * Converts Markdown files from acp-spec/acp-docs to MDX format
 * for the website. Handles:
 * - Frontmatter generation
 * - JSX escaping
 * - Symlink resolution for spec/schemas
 * - Directory structure preservation
 */

import * as fs from "fs";
import * as path from "path";
import { glob } from "glob";

// Configuration
// Paths are relative to apps/web/ directory
const CONFIG = {
  // Source directories (submodule at repo root)
  acpDocsDir: "../../acp-spec/acp-docs",
  specDir: "../../acp-spec/spec",
  schemasDir: "../../acp-spec/schemas",
  // Output directory
  outputDir: "./content/docs",
  // Directories to process from acp-docs
  acpDocsDirs: ["concepts", "getting-started", "guides", "tooling"],
};

// Resolve paths relative to script location
const scriptDir = path.dirname(new URL(import.meta.url).pathname);
const webAppDir = path.resolve(scriptDir, "..");

function resolvePath(relativePath: string): string {
  return path.resolve(webAppDir, relativePath);
}

interface FrontmatterData {
  title: string;
  description?: string;
  order?: number;
}

/**
 * Extract title from markdown content
 */
function extractTitle(content: string, filename: string): string {
  // Try to find first # heading
  const match = content.match(/^#\s+(.+)$/m);
  if (match && match[1]) {
    return match[1].trim();
  }
  // Fall back to filename
  return filename
    .replace(/^\d+-/, "") // Remove numeric prefix
    .replace(/[-_]/g, " ")
    .replace(/\.(md|mdx)$/, "")
    .split(" ")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}

/**
 * Extract description from markdown content
 */
function extractDescription(content: string): string | undefined {
  // Try to find **Document Type** or first paragraph after title
  const docTypeMatch = content.match(
    /\*\*Document Type\*\*:\s*(.+?)(?:\n|$)/i
  );
  if (docTypeMatch && docTypeMatch[1]) {
    const audienceMatch = content.match(/\*\*Audience\*\*:\s*(.+?)(?:\n|$)/i);
    if (audienceMatch && audienceMatch[1]) {
      return `${docTypeMatch[1].trim()} for ${audienceMatch[1].trim().toLowerCase()}`;
    }
    return docTypeMatch[1].trim();
  }

  // Try to get first paragraph after the title
  const paragraphMatch = content.match(/^#.+\n+([^#\n][^\n]+)/m);
  if (paragraphMatch && paragraphMatch[1]) {
    const para = paragraphMatch[1].trim();
    if (para.length > 20 && para.length < 200 && !para.startsWith("**")) {
      return para;
    }
  }

  return undefined;
}

/**
 * Extract order from filename (e.g., "01-introduction.md" -> 1)
 */
function extractOrder(filename: string): number | undefined {
  const match = filename.match(/^(\d+)-/);
  if (match && match[1]) {
    return parseInt(match[1], 10);
  }
  return undefined;
}

/**
 * Escape JSX-problematic characters outside of code blocks
 */
function escapeJsxInContent(content: string): string {
  const lines = content.split("\n");
  let inCodeBlock = false;
  let inFrontmatter = false;
  let frontmatterCount = 0;

  return lines
    .map((line) => {
      // Track frontmatter
      if (line.trim() === "---") {
        frontmatterCount++;
        if (frontmatterCount === 1) {
          inFrontmatter = true;
        } else if (frontmatterCount === 2) {
          inFrontmatter = false;
        }
        return line;
      }

      // Skip processing inside frontmatter
      if (inFrontmatter) {
        return line;
      }

      // Track code blocks
      if (line.trim().startsWith("```")) {
        inCodeBlock = !inCodeBlock;
        return line;
      }

      // Skip processing inside code blocks
      if (inCodeBlock) {
        return line;
      }

      // Escape angle brackets that look like JSX/generics (not in inline code)
      // Pattern: <Word> or <Word | Word> outside of backticks
      let result = "";
      let inInlineCode = false;

      for (let i = 0; i < line.length; i++) {
        const char = line[i];

        if (char === "`") {
          inInlineCode = !inInlineCode;
          result += char;
          continue;
        }

        if (!inInlineCode && char === "<") {
          // Check if this looks like a JSX/generic pattern, comparison, or placeholder
          const restOfLine = line.slice(i);
          // Matches: <Word>, <Word|Word>, <digit..., or <PLACEHOLDER>
          const jsxPattern = /^<[A-Z][a-zA-Z_]*[>\s|]/;
          const comparisonPattern = /^<\d/; // <100, <1000, etc.
          if (jsxPattern.test(restOfLine) || comparisonPattern.test(restOfLine)) {
            result += "&lt;";
            continue;
          }
        }

        if (!inInlineCode && char === ">") {
          // Check if preceded by uppercase word that looks like a closing placeholder
          const beforeChar = result.slice(-20);
          const closingPattern = /[A-Z][A-Z_]*$/;
          if (closingPattern.test(beforeChar)) {
            result += "&gt;";
            continue;
          }
        }

        result += char;
      }

      return result;
    })
    .join("\n");
}

/**
 * Generate frontmatter YAML
 */
function generateFrontmatter(data: FrontmatterData): string {
  const lines = ["---"];
  lines.push(`title: "${data.title.replace(/"/g, '\\"')}"`);
  if (data.description) {
    lines.push(`description: "${data.description.replace(/"/g, '\\"')}"`);
  }
  if (data.order !== undefined) {
    lines.push(`order: ${data.order}`);
  }
  lines.push("---");
  return lines.join("\n");
}

/**
 * Strip the first H1 heading from content (since title is in frontmatter)
 */
function stripFirstHeading(content: string): string {
  // Match first # heading at the start (allowing for leading whitespace/newlines)
  const headingMatch = content.match(/^(\s*)(#\s+.+)(\n+)/m);
  if (headingMatch && headingMatch[2]) {
    const headingIndex = content.indexOf(headingMatch[2]);
    if (headingIndex !== -1) {
      // Remove the heading and any trailing newlines
      const before = content.slice(0, headingIndex);
      const after = content.slice(headingIndex + headingMatch[2].length);
      return (before + after).replace(/^\n+/, "");
    }
  }
  return content;
}

/**
 * Convert markdown file to MDX
 */
function convertMdToMdx(
  sourcePath: string,
  outputPath: string,
  orderOverride?: number
): void {
  let content = fs.readFileSync(sourcePath, "utf-8");
  const filename = path.basename(sourcePath);

  // Extract metadata
  const title = extractTitle(content, filename);
  const description = extractDescription(content);
  const order = orderOverride ?? extractOrder(filename);

  // Check if content already has frontmatter
  const hasFrontmatter = content.trim().startsWith("---");

  let processedContent: string;

  if (hasFrontmatter) {
    // Update existing frontmatter if needed
    processedContent = content;
  } else {
    // Strip the first heading since it will be in frontmatter
    content = stripFirstHeading(content);
    // Add frontmatter
    const frontmatter = generateFrontmatter({ title, description, order });
    processedContent = frontmatter + "\n\n" + content;
  }

  // Escape JSX-problematic content
  processedContent = escapeJsxInContent(processedContent);

  // Ensure output directory exists
  const outputDir = path.dirname(outputPath);
  fs.mkdirSync(outputDir, { recursive: true });

  // Write output file
  fs.writeFileSync(outputPath, processedContent, "utf-8");
  console.log(`  ✓ ${path.relative(resolvePath(CONFIG.outputDir), outputPath)}`);
}

/**
 * Process acp-docs directory
 */
async function processAcpDocs(): Promise<void> {
  console.log("\n📚 Processing acp-docs...");

  const sourceBase = resolvePath(CONFIG.acpDocsDir);
  const outputBase = resolvePath(CONFIG.outputDir);

  // Process index.md
  const indexPath = path.join(sourceBase, "index.md");
  if (fs.existsSync(indexPath)) {
    convertMdToMdx(indexPath, path.join(outputBase, "index.mdx"), 0);
  }

  // Process each configured directory
  for (const dir of CONFIG.acpDocsDirs) {
    const sourceDir = path.join(sourceBase, dir);
    if (!fs.existsSync(sourceDir)) {
      console.log(`  ⚠ Directory not found: ${dir}`);
      continue;
    }

    const files = await glob("**/*.md", { cwd: sourceDir });

    for (const file of files) {
      const sourcePath = path.join(sourceDir, file);
      const outputPath = path.join(
        outputBase,
        dir,
        file.replace(/\.md$/, ".mdx")
      );
      convertMdToMdx(sourcePath, outputPath);
    }
  }
}

/**
 * Process spec chapters
 */
async function processSpecChapters(): Promise<void> {
  console.log("\n📖 Processing spec chapters...");

  const sourceDir = path.join(resolvePath(CONFIG.specDir), "chapters");
  const outputDir = path.join(
    resolvePath(CONFIG.outputDir),
    "reference",
    "specification"
  );

  if (!fs.existsSync(sourceDir)) {
    console.log("  ⚠ Spec chapters directory not found");
    return;
  }

  const files = await glob("*.md", { cwd: sourceDir });

  // Sort by numeric prefix
  files.sort((a, b) => {
    const numA = parseInt(a.match(/^(\d+)/)?.[1] || "0", 10);
    const numB = parseInt(b.match(/^(\d+)/)?.[1] || "0", 10);
    return numA - numB;
  });

  // Create index file for specification
  const indexContent = `---
title: "ACP Specification"
description: "Complete ACP Protocol Specification"
order: 1
---

# ACP Specification

The complete technical specification for the AI Context Protocol.

## Chapters

${files
  .map((file) => {
    const name = file
      .replace(/^\d+-/, "")
      .replace(/\.md$/, "")
      .split("-")
      .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
      .join(" ");
    const slug = file.replace(/^\d+-/, "").replace(/\.md$/, "");
    return `- [${name}](/docs/reference/specification/${slug})`;
  })
  .join("\n")}
`;

  fs.mkdirSync(outputDir, { recursive: true });
  fs.writeFileSync(path.join(outputDir, "index.mdx"), indexContent);
  console.log("  ✓ reference/specification/index.mdx");

  // Process each chapter
  for (const file of files) {
    const sourcePath = path.join(sourceDir, file);
    const order = extractOrder(file);
    const outputFilename = file.replace(/^\d+-/, "").replace(/\.md$/, ".mdx");
    const outputPath = path.join(outputDir, outputFilename);
    convertMdToMdx(sourcePath, outputPath, order);
  }
}

/**
 * Process JSON schemas
 */
async function processSchemas(): Promise<void> {
  console.log("\n📋 Processing schemas...");

  const sourceDir = path.join(resolvePath(CONFIG.schemasDir), "v1");
  const outputDir = path.join(
    resolvePath(CONFIG.outputDir),
    "reference",
    "schemas"
  );

  if (!fs.existsSync(sourceDir)) {
    console.log("  ⚠ Schemas directory not found");
    return;
  }

  const files = await glob("*.schema.json", { cwd: sourceDir });

  // Create index file for schemas
  const indexContent = `---
title: "JSON Schemas"
description: "ACP JSON Schema definitions for validation"
order: 2
---

# JSON Schemas

ACP uses JSON Schema for validating configuration and cache files.

## Available Schemas

${files
  .map((file) => {
    const name = file
      .replace(/\.schema\.json$/, "")
      .split("-")
      .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
      .join(" ");
    const slug = file.replace(/\.schema\.json$/, "");
    return `- [${name} Schema](/docs/reference/schemas/${slug})`;
  })
  .join("\n")}

## Usage

Add schema validation to your files:

\`\`\`json
{
  "$schema": "https://raw.githubusercontent.com/acp-protocol/acp-spec/main/schemas/v1/cache.schema.json"
}
\`\`\`
`;

  fs.mkdirSync(outputDir, { recursive: true });
  fs.writeFileSync(path.join(outputDir, "index.mdx"), indexContent);
  console.log("  ✓ reference/schemas/index.mdx");

  // Process each schema
  for (const file of files) {
    const sourcePath = path.join(sourceDir, file);
    const schemaContent = JSON.parse(fs.readFileSync(sourcePath, "utf-8"));
    const name = file
      .replace(/\.schema\.json$/, "")
      .split("-")
      .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
      .join(" ");

    const mdxContent = generateSchemaMdx(name, schemaContent, file);
    const outputPath = path.join(
      outputDir,
      file.replace(/\.schema\.json$/, ".mdx")
    );

    fs.writeFileSync(outputPath, mdxContent);
    console.log(
      `  ✓ reference/schemas/${file.replace(/\.schema\.json$/, ".mdx")}`
    );
  }
}

/**
 * Generate MDX documentation for a JSON schema
 */
function generateSchemaMdx(
  name: string,
  schema: Record<string, unknown>,
  filename: string
): string {
  const lines: string[] = [
    "---",
    `title: "${name} Schema"`,
    `description: "${(schema.description as string) || `JSON Schema for ${name}`}"`,
    "---",
    "",
    `# ${name} Schema`,
    "",
  ];

  if (schema.description) {
    lines.push(schema.description as string, "");
  }

  lines.push("## Schema URL", "");
  lines.push("```text");
  lines.push(
    `https://raw.githubusercontent.com/acp-protocol/acp-spec/main/schemas/v1/${filename}`
  );
  lines.push("```", "");

  if (schema.properties) {
    lines.push("## Properties", "");
    lines.push("| Property | Type | Required | Description |");
    lines.push("|----------|------|----------|-------------|");

    const required = (schema.required as string[]) || [];
    const properties = schema.properties as Record<
      string,
      { type?: string; description?: string }
    >;

    for (const [propName, propDef] of Object.entries(properties)) {
      const isRequired = required.includes(propName) ? "Yes" : "No";
      const type = propDef.type || "any";
      const desc = propDef.description || "-";
      lines.push(`| \`${propName}\` | ${type} | ${isRequired} | ${desc} |`);
    }
    lines.push("");
  }

  lines.push("## Full Schema", "");
  lines.push("```json");
  lines.push(JSON.stringify(schema, null, 2));
  lines.push("```");

  return lines.join("\n");
}

/**
 * Generate _meta.json files for navigation structure
 */
function generateMetaFiles(): void {
  console.log("\n📁 Generating navigation metadata...");

  const outputDir = resolvePath(CONFIG.outputDir);

  // Diataxis-organized section metadata
  const sections: Record<string, { title: string; order: number }> = {
    "getting-started": { title: "Getting Started", order: 1 },
    concepts: { title: "Concepts", order: 2 },
    guides: { title: "Guides", order: 3 },
    tooling: { title: "Tooling", order: 4 },
    reference: { title: "Reference", order: 5 },
  };

  const nestedSections: Record<string, { title: string; order: number }> = {
    "reference/specification": { title: "Specification", order: 1 },
    "reference/schemas": { title: "Schemas", order: 2 },
  };

  // Create section _meta.json files
  for (const [dir, meta] of Object.entries(sections)) {
    const dirPath = path.join(outputDir, dir);
    if (fs.existsSync(dirPath)) {
      const metaPath = path.join(dirPath, "_meta.json");
      fs.writeFileSync(metaPath, JSON.stringify(meta, null, 2));
      console.log(`  ✓ ${dir}/_meta.json`);
    }
  }

  // Create nested section _meta.json files
  for (const [dir, meta] of Object.entries(nestedSections)) {
    const dirPath = path.join(outputDir, dir);
    if (fs.existsSync(dirPath)) {
      const metaPath = path.join(dirPath, "_meta.json");
      fs.writeFileSync(metaPath, JSON.stringify(meta, null, 2));
      console.log(`  ✓ ${dir}/_meta.json`);
    }
  }
}

/**
 * Copy schema files to public directory for direct access
 * This ensures https://acp-protocol.dev/schemas/v1/*.schema.json works
 */
function copySchemasToPubic(): void {
  console.log("\n📦 Copying schemas to public directory...");

  const sourceDir = path.join(resolvePath(CONFIG.schemasDir), "v1");
  const publicDir = path.join(resolvePath("."), "public", "schemas", "v1");

  if (!fs.existsSync(sourceDir)) {
    console.log("  ⚠ Schemas source directory not found");
    return;
  }

  // Create public schemas directory
  fs.mkdirSync(publicDir, { recursive: true });

  // Copy all schema files
  const files = fs.readdirSync(sourceDir).filter((f) => f.endsWith(".json"));
  for (const file of files) {
    const sourcePath = path.join(sourceDir, file);
    const destPath = path.join(publicDir, file);
    fs.copyFileSync(sourcePath, destPath);
    console.log(`  ✓ schemas/v1/${file}`);
  }
}

/**
 * Clean output directory
 */
function cleanOutputDir(): void {
  const outputDir = resolvePath(CONFIG.outputDir);
  if (fs.existsSync(outputDir)) {
    console.log("🧹 Cleaning output directory...");
    fs.rmSync(outputDir, { recursive: true });
  }
  fs.mkdirSync(outputDir, { recursive: true });
}

/**
 * Main entry point
 */
async function main(): Promise<void> {
  console.log("🚀 Syncing documentation from acp-spec...\n");

  const startTime = Date.now();

  // Clean and recreate output directory
  cleanOutputDir();

  // Process all content
  await processAcpDocs();
  await processSpecChapters();
  await processSchemas();

  // Generate navigation metadata
  generateMetaFiles();

  // Copy schemas to public for direct URL access
  copySchemasToPubic();

  const elapsed = ((Date.now() - startTime) / 1000).toFixed(2);
  console.log(`\n✅ Documentation sync complete in ${elapsed}s`);
}

main().catch((error) => {
  console.error("❌ Error syncing documentation:", error);
  process.exit(1);
});
