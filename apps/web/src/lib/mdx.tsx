/**
 * @acp:domain library
 * @acp:layer utility
 */
import fs from "fs";
import path from "path";
import matter from "gray-matter";
import { compileMDX } from "next-mdx-remote/rsc";
import remarkGfm from "remark-gfm";
import rehypePrettyCode from "rehype-pretty-code";
import { visit } from "unist-util-visit";
import type { Root, Code } from "mdast";
import { extractToc, type TocEntry } from "./toc";

/**
 * Remark plugin that adds 'text' language to code blocks without a language
 */
function remarkDefaultCodeLanguage() {
  return (tree: Root) => {
    visit(tree, "code", (node: Code) => {
      if (!node.lang) {
        node.lang = "text";
      }
    });
  };
}

/**
 * @acp:domain library
 * @acp:layer utility
 * @acp:lock normal
 * @acp:summary "DocFrontmatter interface"
 */
export interface DocFrontmatter {
  title: string;
  description?: string;
  order?: number;
}

/**
 * @acp:domain library
 * @acp:layer utility
 * @acp:lock normal
 * @acp:summary "DocMeta interface"
 */
export interface DocMeta {
  slug: string[];
  frontmatter: DocFrontmatter;
  toc: TocEntry[];
}

/**
 * @acp:domain library
 * @acp:layer utility
 * @acp:lock normal
 * @acp:summary "DocContent interface"
 */
export interface DocContent extends DocMeta {
  content: React.ReactElement;
}

const CONTENT_DIR = path.join(process.cwd(), "content/docs");

/**
 * Get all doc slugs for static generation
 */
export async function getAllDocSlugs(): Promise<string[][]> {
  const slugs: string[][] = [];

  function walkDir(dir: string, basePath: string[] = []) {
    if (!fs.existsSync(dir)) return;

    const entries = fs.readdirSync(dir, { withFileTypes: true });

    for (const entry of entries) {
      if (entry.isDirectory()) {
        walkDir(path.join(dir, entry.name), [...basePath, entry.name]);
      } else if (entry.name.endsWith(".mdx") || entry.name.endsWith(".md")) {
        const slug = entry.name.replace(/\.(mdx|md)$/, "");
        if (slug === "index") {
          slugs.push(basePath);
        } else {
          slugs.push([...basePath, slug]);
        }
      }
    }
  }

  walkDir(CONTENT_DIR);
  return slugs;
}

/**
 * Get doc content by slug
 */
export async function getDocBySlug(slug: string[]): Promise<DocContent | null> {
  const filePath = resolveDocPath(slug);

  if (!filePath || !fs.existsSync(filePath)) {
    return null;
  }

  const source = fs.readFileSync(filePath, "utf8");
  const { data, content: rawContent } = matter(source);

  const frontmatter = data as DocFrontmatter;
  const toc = extractToc(rawContent);

  const { content } = await compileMDX({
    source: rawContent,
    options: {
      parseFrontmatter: false,
      mdxOptions: {
        remarkPlugins: [remarkGfm, remarkDefaultCodeLanguage],
        rehypePlugins: [
          [
            rehypePrettyCode,
            {
              theme: {
                dark: "github-dark",
                light: "github-light",
              },
              keepBackground: false,
            },
          ],
        ],
      },
    },
    components: {
      // Let CSS handle all code styling - see globals.css
    },
  });

  return {
    slug,
    frontmatter,
    toc,
    content,
  };
}

/**
 * Resolve doc file path from slug
 */
function resolveDocPath(slug: string[]): string | null {
  const basePath = path.join(CONTENT_DIR, ...slug);

  // Try direct .mdx file
  if (fs.existsSync(`${basePath}.mdx`)) {
    return `${basePath}.mdx`;
  }

  // Try direct .md file
  if (fs.existsSync(`${basePath}.md`)) {
    return `${basePath}.md`;
  }

  // Try index file in directory
  const indexMdx = path.join(basePath, "index.mdx");
  if (fs.existsSync(indexMdx)) {
    return indexMdx;
  }

  const indexMd = path.join(basePath, "index.md");
  if (fs.existsSync(indexMd)) {
    return indexMd;
  }

  return null;
}

/**
 * Get all doc metadata for navigation
 */
export async function getAllDocMeta(): Promise<DocMeta[]> {
  const slugs = await getAllDocSlugs();
  const docs: DocMeta[] = [];

  for (const slug of slugs) {
    const filePath = resolveDocPath(slug);
    if (!filePath) continue;

    const source = fs.readFileSync(filePath, "utf8");
    const { data, content } = matter(source);

    docs.push({
      slug,
      frontmatter: data as DocFrontmatter,
      toc: extractToc(content),
    });
  }

  return docs;
}
