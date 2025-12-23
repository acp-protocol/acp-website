/**
 * @acp:domain library
 * @acp:layer utility
 */
import fs from "fs";
import path from "path";
import matter from "gray-matter";
import { compileMDX } from "next-mdx-remote/rsc";
import { createHighlighter, type BundledLanguage } from "shiki";
import { extractToc, type TocEntry } from "./toc";

/**
 * @acp:domain library
 * @acp:layer utility
 * @acp:lock normal
 * @acp:summary "DocFrontmatter interface"
 * @acp:domain library
 * @acp:layer utility
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
 * @acp:domain library
 * @acp:layer utility
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
 * @acp:domain library
 * @acp:layer utility
 * @acp:summary "DocContent interface"
 */
export interface DocContent extends DocMeta {
  content: React.ReactElement;
}

/**
 * @acp:domain library
 * @acp:layer utility
 */
const CONTENT_DIR = path.join(process.cwd(), "content/docs");

/**
 * Get all doc slugs for static generation
 */
/**
 * @acp:domain library
 * @acp:layer utility
 * @acp:lock normal
 * @acp:summary "Gets all doc slugs"
 * @acp:domain library
 * @acp:layer utility
 * @acp:summary "Gets all doc slugs"
 */
export async function getAllDocSlugs(): Promise<string[][]> {
  /**
   * @acp:domain library
   * @acp:layer utility
   * @acp:domain library
   * @acp:layer utility
   */
  const slugs: string[][] = [];

  /**
   * @acp:domain library
   * @acp:layer utility
   * @acp:summary "Walks dir"
   */
  function walkDir(dir: string, basePath: string[] = []) {
    if (!fs.existsSync(dir)) return;

    /**
     * @acp:domain library
     * @acp:layer utility
     */
    const entries = fs.readdirSync(dir, { withFileTypes: true });

    for (const entry of entries) {
      if (entry.isDirectory()) {
        walkDir(path.join(dir, entry.name), [...basePath, entry.name]);
      } else if (entry.name.endsWith(".mdx") || entry.name.endsWith(".md")) {
        /**
         * @acp:domain library
         * @acp:layer utility
         */
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
/**
 * @acp:domain library
 * @acp:layer utility
 * @acp:lock normal
 * @acp:summary "Gets doc by slug"
 * @acp:domain library
 * @acp:layer utility
 * @acp:summary "Gets doc by slug"
 */
export async function getDocBySlug(slug: string[]): Promise<DocContent | null> {
  /**
   * @acp:domain library
   * @acp:layer utility
   * @acp:domain library
   * @acp:layer utility
   */
  const filePath = resolveDocPath(slug);

  if (!filePath || !fs.existsSync(filePath)) {
    return null;
  }

  /**
   * @acp:domain library
   * @acp:layer utility
   * @acp:domain library
   * @acp:layer utility
   */
  const source = fs.readFileSync(filePath, "utf8");
  /**
   * @acp:domain library
   * @acp:layer utility
   */
  const { data, content: rawContent } = matter(source);

  /**
   * @acp:domain library
   * @acp:layer utility
   */
  const frontmatter = data as DocFrontmatter;
  /**
   * @acp:domain library
   * @acp:layer utility
   */
  const toc = extractToc(rawContent);

  /**
   * @acp:domain library
   * @acp:layer utility
   */
  const highlighter = await createHighlighter({
    themes: ["github-dark", "github-light"],
    langs: [
      "typescript",
      "javascript",
      "json",
      "bash",
      "markdown",
      "yaml",
      "python",
      "rust",
      "go",
      "java",
      "csharp",
      "tsx",
      "jsx",
      "css",
      "html",
    ] as BundledLanguage[],
  });

  /**
   * @acp:domain library
   * @acp:layer utility
   */
  const { content } = await compileMDX({
    source: rawContent,
    options: {
      parseFrontmatter: false,
      mdxOptions: {
        remarkPlugins: [],
        rehypePlugins: [],
      },
    },
    components: {
      pre: ({ children, ...props }) => {
        return (
          <pre {...props} className="shiki-wrapper">
            {children}
          </pre>
        );
      },
      code: ({ children, className, ...props }) => {
        /**
         * @acp:domain library
         * @acp:layer utility
         */
        const match = /language-(\w+)/.exec(className || "");
        /**
         * @acp:domain library
         * @acp:layer utility
         */
        const lang = (match?.[1] || "text") as BundledLanguage;
        /**
         * @acp:domain library
         * @acp:layer utility
         */
        const code = String(children).replace(/\n$/, "");

        if (!match) {
          return (
            <code className={className} {...props}>
              {children}
            </code>
          );
        }

        /**
         * @acp:domain library
         * @acp:layer utility
         */
        const html = highlighter.codeToHtml(code, {
          lang,
          themes: {
            light: "github-light",
            dark: "github-dark",
          },
        });

        return <div dangerouslySetInnerHTML={{ __html: html }} />;
      },
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
  /**
   * @acp:domain library
   * @acp:layer utility
   */
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
  /**
   * @acp:domain library
   * @acp:layer utility
   */
  const indexMdx = path.join(basePath, "index.mdx");
  if (fs.existsSync(indexMdx)) {
    return indexMdx;
  }

  /**
   * @acp:domain library
   * @acp:layer utility
   */
  const indexMd = path.join(basePath, "index.md");
  if (fs.existsSync(indexMd)) {
    return indexMd;
  }

  return null;
}

/**
 * Get all doc metadata for navigation
 */
/**
 * @acp:domain library
 * @acp:layer utility
 * @acp:lock normal
 * @acp:summary "Gets all doc meta"
 * @acp:domain library
 * @acp:layer utility
 * @acp:summary "Gets all doc meta"
 */
export async function getAllDocMeta(): Promise<DocMeta[]> {
  const slugs = await getAllDocSlugs();
  /**
   * @acp:domain library
   * @acp:layer utility
   */
  const docs: DocMeta[] = [];

  for (const slug of slugs) {
    const filePath = resolveDocPath(slug);
    if (!filePath) continue;

    const source = fs.readFileSync(filePath, "utf8");
    /**
     * @acp:domain library
     * @acp:layer utility
     */
    const { data, content } = matter(source);

    docs.push({
      slug,
      frontmatter: data as DocFrontmatter,
      toc: extractToc(content),
    });
  }

  return docs;
}