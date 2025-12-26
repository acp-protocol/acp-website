/**
 * @acp:domain library
 * @acp:layer utility
 */
import fs from "fs";
import path from "path";
import matter from "gray-matter";
import type { DocFrontmatter } from "./mdx";

/**
 * @acp:domain library
 * @acp:layer utility
 * @acp:lock normal
 * @acp:summary "NavItem interface"
 * @acp:domain library
 * @acp:layer utility
 * @acp:summary "NavItem interface"
 */
export interface NavItem {
  title: string;
  slug: string[];
  href: string;
  order: number;
  children?: NavItem[];
}

/**
 * @acp:domain library
 * @acp:layer utility
 * @acp:lock normal
 * @acp:summary "NavSection interface"
 * @acp:domain library
 * @acp:layer utility
 * @acp:summary "NavSection interface"
 */
export interface NavSection {
  title: string;
  slug: string;
  items: NavItem[];
}

/**
 * @acp:domain library
 * @acp:layer utility
 */
const CONTENT_DIR = path.join(process.cwd(), "content/docs");

/**
 * Build navigation tree from docs directory
 */
/**
 * @acp:domain library
 * @acp:layer utility
 * @acp:lock normal
 * @acp:summary "Builds navigation"
 * @acp:domain library
 * @acp:layer utility
 * @acp:summary "Builds navigation"
 */
export async function buildNavigation(): Promise<NavSection[]> {
  if (!fs.existsSync(CONTENT_DIR)) {
    return [];
  }

  /**
   * @acp:domain library
   * @acp:layer utility
   * @acp:domain library
   * @acp:layer utility
   */
  const sections: NavSection[] = [];
  /**
   * @acp:domain library
   * @acp:layer utility
   * @acp:domain library
   * @acp:layer utility
   * @acp:domain library
   * @acp:layer utility
   */
  const entries = fs.readdirSync(CONTENT_DIR, { withFileTypes: true });

  // Get root-level items first
  /**
   * @acp:domain library
   * @acp:layer utility
   */
  const rootItems: NavItem[] = [];

  for (const entry of entries) {
    if (entry.isDirectory()) {
      /**
       * @acp:domain library
       * @acp:layer utility
       */
      const section = await buildSection(entry.name);
      if (section) {
        sections.push(section);
      }
    } else if (
      entry.name.endsWith(".mdx") ||
      entry.name.endsWith(".md")
    ) {
      /**
       * @acp:domain library
       * @acp:layer utility
       * @acp:domain library
       * @acp:layer utility
       * @acp:domain library
       * @acp:layer utility
       */
      const slug = entry.name.replace(/\.(mdx|md)$/, "");
      if (slug !== "index") {
        /**
         * @acp:domain library
         * @acp:layer utility
         * @acp:domain library
         * @acp:layer utility
         * @acp:domain library
         * @acp:layer utility
         */
        const item = await buildNavItem([slug]);
        if (item) {
          rootItems.push(item);
        }
      }
    }
  }

  // Add root items as a section if there are any
  if (rootItems.length > 0) {
    sections.unshift({
      title: "Overview",
      slug: "",
      items: rootItems.sort((a, b) => a.order - b.order),
    });
  }

  // Sort sections by their order
  return sections.sort((a, b) => {
    const orderA = getSectionOrder(a.slug);
    const orderB = getSectionOrder(b.slug);
    return orderA - orderB;
  });
}

/**
 * Get section order from _meta.json
 */
function getSectionOrder(sectionSlug: string): number {
  if (!sectionSlug) return 0; // Overview section first
  const metaPath = path.join(CONTENT_DIR, sectionSlug, "_meta.json");
  if (fs.existsSync(metaPath)) {
    try {
      const meta = JSON.parse(fs.readFileSync(metaPath, "utf8"));
      return meta.order ?? 999;
    } catch {
      return 999;
    }
  }
  return 999;
}

/**
 * Build a navigation section from a directory
 */
async function buildSection(dirName: string): Promise<NavSection | null> {
  /**
   * @acp:domain library
   * @acp:layer utility
   * @acp:domain library
   * @acp:layer utility
   */
  const dirPath = path.join(CONTENT_DIR, dirName);
  const entries = fs.readdirSync(dirPath, { withFileTypes: true });

  /**
   * @acp:domain library
   * @acp:layer utility
   * @acp:domain library
   * @acp:layer utility
   */
  const items: NavItem[] = [];
  /**
   * @acp:domain library
   * @acp:layer utility
   */
  let sectionTitle = formatTitle(dirName);

  // Check for _meta.json for section configuration
  /**
   * @acp:domain library
   * @acp:layer utility
   */
  const metaPath = path.join(dirPath, "_meta.json");
  if (fs.existsSync(metaPath)) {
    try {
      /**
       * @acp:domain library
       * @acp:layer utility
       */
      const meta = JSON.parse(fs.readFileSync(metaPath, "utf8"));
      if (meta.title) sectionTitle = meta.title;
    } catch {
      // Ignore meta file errors
    }
  }

  for (const entry of entries) {
    if (entry.name.startsWith("_")) continue;

    if (entry.isDirectory()) {
      // Nested directories become nested items
      /**
       * @acp:domain library
       * @acp:layer utility
       */
      const nestedItems = await buildNestedItems(dirName, entry.name);
      items.push(...nestedItems);
    } else if (
      entry.name.endsWith(".mdx") ||
      entry.name.endsWith(".md")
    ) {
      const slug = entry.name.replace(/\.(mdx|md)$/, "");
      if (slug !== "index") {
        const item = await buildNavItem([dirName, slug]);
        if (item) {
          items.push(item);
        }
      }
    }
  }

  if (items.length === 0) {
    return null;
  }

  return {
    title: sectionTitle,
    slug: dirName,
    items: items.sort((a, b) => a.order - b.order),
  };
}

/**
 * Build nested navigation items
 */
async function buildNestedItems(
  parentDir: string,
  dirName: string,
): Promise<NavItem[]> {
  const dirPath = path.join(CONTENT_DIR, parentDir, dirName);
  const entries = fs.readdirSync(dirPath, { withFileTypes: true });

  const items: NavItem[] = [];

  for (const entry of entries) {
    if (entry.name.startsWith("_")) continue;

    if (
      entry.name.endsWith(".mdx") ||
      entry.name.endsWith(".md")
    ) {
      const slug = entry.name.replace(/\.(mdx|md)$/, "");
      if (slug !== "index") {
        const item = await buildNavItem([parentDir, dirName, slug]);
        if (item) {
          items.push(item);
        }
      }
    }
  }

  return items;
}

/**
 * Build a single navigation item from a file
 */
async function buildNavItem(slug: string[]): Promise<NavItem | null> {
  /**
   * @acp:domain library
   * @acp:layer utility
   */
  const filePath = resolveFilePath(slug);
  if (!filePath) return null;

  /**
   * @acp:domain library
   * @acp:layer utility
   */
  const source = fs.readFileSync(filePath, "utf8");
  /**
   * @acp:domain library
   * @acp:layer utility
   */
  const { data } = matter(source);
  /**
   * @acp:domain library
   * @acp:layer utility
   */
  const frontmatter = data as DocFrontmatter;

  /**
   * @acp:domain library
   * @acp:layer utility
   * @acp:domain library
   * @acp:layer utility
   */
  const lastSlug = slug[slug.length - 1] ?? "";
  return {
    title: frontmatter.title || formatTitle(lastSlug),
    slug,
    href: `/docs/${slug.join("/")}`,
    order: frontmatter.order ?? 999,
  };
}

/**
 * Resolve file path from slug
 */
function resolveFilePath(slug: string[]): string | null {
  /**
   * @acp:domain library
   * @acp:layer utility
   */
  const basePath = path.join(CONTENT_DIR, ...slug);

  if (fs.existsSync(`${basePath}.mdx`)) {
    return `${basePath}.mdx`;
  }

  if (fs.existsSync(`${basePath}.md`)) {
    return `${basePath}.md`;
  }

  return null;
}

/**
 * Format a slug segment as a title
 */
function formatTitle(slug: string): string {
  return slug
    .split("-")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}

/**
 * Get previous and next docs for pagination
 */
/**
 * @acp:domain library
 * @acp:layer utility
 * @acp:lock normal
 * @acp:summary "Gets doc pagination"
 * @acp:domain library
 * @acp:layer utility
 * @acp:summary "Gets doc pagination"
 */
export async function getDocPagination(
  currentSlug: string[],
): Promise<{ prev: NavItem | null; next: NavItem | null }> {
  const sections = await buildNavigation();
  /**
   * @acp:domain library
   * @acp:layer utility
   */
  const allItems: NavItem[] = [];

  for (const section of sections) {
    allItems.push(...section.items);
  }

  /**
   * @acp:domain library
   * @acp:layer utility
   */
  const currentHref = `/docs/${currentSlug.join("/")}`;
  /**
   * @acp:domain library
   * @acp:layer utility
   */
  const currentIndex = allItems.findIndex((item) => item.href === currentHref);

  if (currentIndex === -1) {
    return { prev: null, next: null };
  }

  return {
    prev: currentIndex > 0 ? (allItems[currentIndex - 1] ?? null) : null,
    next: currentIndex < allItems.length - 1 ? (allItems[currentIndex + 1] ?? null) : null,
  };
}

/**
 * Get breadcrumb trail for a doc
 */
/**
 * @acp:domain library
 * @acp:layer utility
 * @acp:lock normal
 * @acp:summary "Gets breadcrumbs"
 * @acp:domain library
 * @acp:layer utility
 * @acp:summary "Gets breadcrumbs"
 */
export function getBreadcrumbs(
  slug: string[],
  frontmatter: DocFrontmatter,
): Array<{ title: string; href: string }> {
  /**
   * @acp:domain library
   * @acp:layer utility
   */
  const breadcrumbs: Array<{ title: string; href: string }> = [
    { title: "Docs", href: "/docs" },
  ];

  /**
   * @acp:domain library
   * @acp:layer utility
   */
  let currentPath = "/docs";

  /**
   * @acp:domain library
   * @acp:layer utility
   */
  for (let i = 0; i < slug.length - 1; i++) {
    /**
     * @acp:domain library
     * @acp:layer utility
     */
    const segment = slug[i];
    if (segment) {
      currentPath += `/${segment}`;
      breadcrumbs.push({
        title: formatTitle(segment),
        href: currentPath,
      });
    }
  }

  // Add current page
  const lastSlug = slug[slug.length - 1] ?? "";
  breadcrumbs.push({
    title: frontmatter.title || formatTitle(lastSlug),
    href: `/docs/${slug.join("/")}`,
  });

  return breadcrumbs;
}