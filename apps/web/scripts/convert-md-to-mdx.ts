#!/usr/bin/env npx ts-node
/**
 * MD to MDX Conversion Script
 *
 * Converts ACP specification markdown files to MDX format with proper
 * frontmatter for the documentation site.
 *
 * Usage: npx ts-node scripts/convert-md-to-mdx.ts
 */

import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

// ES module compatibility
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Configuration
const ACP_SPEC_DIR = path.resolve(process.env.HOME || "~", "projects/acp-spec/spec");
const OUTPUT_DIR = path.resolve(__dirname, "../content/docs");

// Mapping of source files to output structure
interface FileMapping {
  source: string;
  output: string;
  title: string;
  description: string;
  order: number;
}

// Chapter mappings based on the plan
const CHAPTER_MAPPINGS: FileMapping[] = [
  // Getting Started section
  {
    source: "chapters/01-introduction.md",
    output: "getting-started/introduction.mdx",
    title: "Introduction",
    description: "An overview of the ACP Protocol and its purpose",
    order: 1,
  },
  {
    source: "chapters/02-terminology.md",
    output: "getting-started/terminology.mdx",
    title: "Terminology",
    description: "Key terms and definitions used throughout the ACP specification",
    order: 2,
  },

  // Core Concepts section
  {
    source: "chapters/05-annotations.md",
    output: "core-concepts/annotations.mdx",
    title: "Annotations",
    description: "How to use ACP annotations to mark up your code",
    order: 1,
  },
  {
    source: "chapters/06-constraints.md",
    output: "core-concepts/constraints.mdx",
    title: "Constraints",
    description: "Defining access constraints and security policies",
    order: 2,
  },
  {
    source: "chapters/07-variables.md",
    output: "core-concepts/variables.mdx",
    title: "Variables",
    description: "Using variables for dynamic content in annotations",
    order: 3,
  },
  {
    source: "chapters/03-cache-format.md",
    output: "core-concepts/cache-format.mdx",
    title: "Cache Format",
    description: "Understanding the ACP cache file format",
    order: 4,
  },
  {
    source: "chapters/08-inheritance.md",
    output: "core-concepts/inheritance.mdx",
    title: "Inheritance",
    description: "How annotations inherit from parent scopes",
    order: 5,
  },

  // CLI Reference section
  {
    source: "chapters/04-config-format.md",
    output: "cli-reference/configuration.mdx",
    title: "Configuration",
    description: "ACP CLI configuration file format and options",
    order: 1,
  },

  // Tool Integration section
  {
    source: "chapters/11-tool-integration.md",
    output: "tool-integration/primers.mdx",
    title: "Primers & Tool Integration",
    description: "How to integrate ACP with AI coding assistants",
    order: 1,
  },
  {
    source: "chapters/13-debug-sessions.md",
    output: "tool-integration/debug-sessions.mdx",
    title: "Debug Sessions",
    description: "Using ACP for debugging and troubleshooting",
    order: 2,
  },

  // API Reference section
  {
    source: "ACP-1.0.md",
    output: "api-reference/specification.mdx",
    title: "Full Specification",
    description: "Complete ACP 1.0 protocol specification",
    order: 1,
  },
  {
    source: "chapters/09-discovery.md",
    output: "api-reference/discovery.mdx",
    title: "Discovery",
    description: "How tools discover ACP annotations in a codebase",
    order: 2,
  },
  {
    source: "chapters/10-querying.md",
    output: "api-reference/querying.mdx",
    title: "Querying",
    description: "Querying and filtering ACP cache data",
    order: 3,
  },
  {
    source: "chapters/12-versioning.md",
    output: "api-reference/versioning.mdx",
    title: "Versioning",
    description: "ACP versioning and compatibility guidelines",
    order: 4,
  },

  // Examples section
  {
    source: "examples/minimal.md",
    output: "examples/minimal.mdx",
    title: "Minimal Example",
    description: "A minimal ACP setup example",
    order: 1,
  },
  {
    source: "examples/complete.md",
    output: "examples/complete.mdx",
    title: "Complete Example",
    description: "A comprehensive ACP implementation example",
    order: 2,
  },
  {
    source: "examples/edge-cases.md",
    output: "examples/edge-cases.mdx",
    title: "Edge Cases",
    description: "Handling edge cases and special scenarios",
    order: 3,
  },
];

// Section metadata for _meta.json files
const SECTION_METADATA: Record<string, { title: string; order: number }> = {
  "getting-started": { title: "Getting Started", order: 1 },
  "core-concepts": { title: "Core Concepts", order: 2 },
  "cli-reference": { title: "CLI Reference", order: 3 },
  "tool-integration": { title: "Tool Integration", order: 4 },
  "api-reference": { title: "API Reference", order: 5 },
  examples: { title: "Examples", order: 6 },
};

/**
 * Convert markdown content to MDX with frontmatter
 */
function convertToMdx(
  content: string,
  frontmatter: { title: string; description: string; order: number }
): string {
  // Add frontmatter
  const frontmatterYaml = `---
title: "${frontmatter.title}"
description: "${frontmatter.description}"
order: ${frontmatter.order}
---

`;

  // Process content
  let processed = content;

  // Remove any existing H1 if it matches the title (we use frontmatter for title)
  const h1Match = processed.match(/^#\s+(.+)\n/);
  if (h1Match && h1Match[1]?.trim().toLowerCase() === frontmatter.title.toLowerCase()) {
    processed = processed.replace(/^#\s+.+\n/, "");
  }

  // Convert internal links from .md to docs paths
  // e.g., [link](../chapters/05-annotations.md) -> [link](/docs/core-concepts/annotations)
  processed = processed.replace(
    /\[([^\]]+)\]\((?:\.\.\/)?(?:chapters\/)?(\d+-[\w-]+)\.md\)/g,
    (match, text, filename) => {
      const mapping = CHAPTER_MAPPINGS.find((m) => m.source.includes(filename));
      if (mapping) {
        const href = `/docs/${mapping.output.replace(".mdx", "")}`;
        return `[${text}](${href})`;
      }
      return match;
    }
  );

  // Convert example links
  processed = processed.replace(
    /\[([^\]]+)\]\((?:\.\.\/)?examples\/([\w-]+)\.md\)/g,
    (match, text, filename) => {
      return `[${text}](/docs/examples/${filename})`;
    }
  );

  // Remove inline Table of Contents sections (we have a fixed sidebar TOC)
  // Pattern: "## Table of Contents" followed by numbered links, ending with "---"
  processed = processed.replace(
    /## Table of Contents\n\n(?:[\s\S]*?)(?:\n---\n)/g,
    ""
  );

  // Convert HTML comments to MDX comments
  // MDX uses {/* */} instead of <!-- -->
  processed = processed.replace(/<!--([\s\S]*?)-->/g, "{/* $1 */}");

  // Ensure code blocks have language specifiers
  // If a code block doesn't have a language, try to detect it
  processed = processed.replace(/```\n/g, "```text\n");

  // Convert admonitions/callouts if present
  // > **Note:** -> <Callout type="note">
  processed = processed.replace(
    /> \*\*Note:\*\*\s*(.+)/g,
    '<Callout type="note">\n$1\n</Callout>'
  );
  processed = processed.replace(
    /> \*\*Warning:\*\*\s*(.+)/g,
    '<Callout type="warning">\n$1\n</Callout>'
  );
  processed = processed.replace(
    /> \*\*Important:\*\*\s*(.+)/g,
    '<Callout type="important">\n$1\n</Callout>'
  );

  return frontmatterYaml + processed.trim() + "\n";
}

/**
 * Create section _meta.json files
 */
function createSectionMeta(section: string): void {
  const metaPath = path.join(OUTPUT_DIR, section, "_meta.json");
  const metadata = SECTION_METADATA[section];

  if (metadata) {
    const content = JSON.stringify(metadata, null, 2) + "\n";
    fs.writeFileSync(metaPath, content);
    console.log(`  Created: ${section}/_meta.json`);
  }
}

/**
 * Main conversion function
 */
async function main() {
  console.log("ACP Spec → MDX Conversion\n");
  console.log(`Source: ${ACP_SPEC_DIR}`);
  console.log(`Output: ${OUTPUT_DIR}\n`);

  // Check if source directory exists
  if (!fs.existsSync(ACP_SPEC_DIR)) {
    console.error(`Error: Source directory not found: ${ACP_SPEC_DIR}`);
    console.error("Please ensure the acp-spec repository is cloned at ~/projects/acp-spec/");
    process.exit(1);
  }

  // Create output directory structure
  const sections = Object.keys(SECTION_METADATA);
  for (const section of sections) {
    const sectionDir = path.join(OUTPUT_DIR, section);
    fs.mkdirSync(sectionDir, { recursive: true });
  }

  console.log("Converting files...\n");

  let successCount = 0;
  let errorCount = 0;

  for (const mapping of CHAPTER_MAPPINGS) {
    const sourcePath = path.join(ACP_SPEC_DIR, mapping.source);
    const outputPath = path.join(OUTPUT_DIR, mapping.output);

    try {
      if (!fs.existsSync(sourcePath)) {
        console.warn(`  Skipped (not found): ${mapping.source}`);
        errorCount++;
        continue;
      }

      // Read source file
      const content = fs.readFileSync(sourcePath, "utf8");

      // Convert to MDX
      const mdxContent = convertToMdx(content, {
        title: mapping.title,
        description: mapping.description,
        order: mapping.order,
      });

      // Ensure output directory exists
      fs.mkdirSync(path.dirname(outputPath), { recursive: true });

      // Write output file
      fs.writeFileSync(outputPath, mdxContent);
      console.log(`  Converted: ${mapping.source} → ${mapping.output}`);
      successCount++;
    } catch (error) {
      console.error(`  Error converting ${mapping.source}:`, error);
      errorCount++;
    }
  }

  // Create section metadata files
  console.log("\nCreating section metadata...\n");
  for (const section of sections) {
    createSectionMeta(section);
  }

  // Create root index.mdx
  const indexContent = `---
title: "ACP Protocol Documentation"
description: "Learn how to use the AI Context Protocol to protect your code while enabling AI-assisted development"
order: 0
---

# Welcome to ACP

The **AI Context Protocol (ACP)** is an open standard for controlling how AI coding assistants interact with your codebase. It enables you to:

- **Protect sensitive code** from being shared with AI models
- **Provide context efficiently** without overwhelming token limits
- **Maintain security** while leveraging AI development tools

## Quick Start

Get started with ACP in minutes:

1. [Introduction](/docs/getting-started/introduction) - Learn what ACP is and why you need it
2. [Terminology](/docs/getting-started/terminology) - Understand key concepts
3. [Annotations](/docs/core-concepts/annotations) - Add ACP annotations to your code

## Core Concepts

- [Annotations](/docs/core-concepts/annotations) - Mark up your code with ACP directives
- [Constraints](/docs/core-concepts/constraints) - Define access policies
- [Variables](/docs/core-concepts/variables) - Dynamic content in annotations
- [Inheritance](/docs/core-concepts/inheritance) - How annotations propagate

## Examples

Check out practical examples to see ACP in action:

- [Minimal Example](/docs/examples/minimal) - A basic ACP setup
- [Complete Example](/docs/examples/complete) - Full-featured implementation
- [Edge Cases](/docs/examples/edge-cases) - Handling special scenarios
`;

  fs.writeFileSync(path.join(OUTPUT_DIR, "index.mdx"), indexContent);
  console.log("  Created: index.mdx\n");

  // Summary
  console.log("Conversion complete!");
  console.log(`  Success: ${successCount} files`);
  console.log(`  Errors: ${errorCount} files`);
}

main().catch(console.error);
