/**
 * @acp:domain library
 * @acp:layer utility
 */
import GithubSlugger from "github-slugger";

/**
 * @acp:domain library
 * @acp:layer utility
 * @acp:lock normal
 * @acp:summary "TocEntry interface"
 * @acp:domain library
 * @acp:layer utility
 * @acp:summary "TocEntry interface"
 */
export interface TocEntry {
  id: string;
  text: string;
  level: number;
  children?: TocEntry[];
}

/**
 * Extract table of contents from markdown content
 * Parses H2 and H3 headings, creating a nested structure
 */
/**
 * @acp:domain library
 * @acp:layer utility
 * @acp:lock normal
 * @acp:summary "Extracts toc"
 * @acp:domain library
 * @acp:layer utility
 * @acp:summary "Extracts toc"
 */
export function extractToc(content: string): TocEntry[] {
  /**
   * @acp:domain library
   * @acp:layer utility
   */
  const slugger = new GithubSlugger();
  /**
   * @acp:domain library
   * @acp:layer utility
   */
  const headingRegex = /^(#{2,3})\s+(.+)$/gm;
  /**
   * @acp:domain library
   * @acp:layer utility
   */
  const entries: TocEntry[] = [];

  let match;
  while ((match = headingRegex.exec(content)) !== null) {
    /**
     * @acp:domain library
     * @acp:layer utility
     */
    const levelMatch = match[1];
    /**
     * @acp:domain library
     * @acp:layer utility
     */
    const textMatch = match[2];

    if (!levelMatch || !textMatch) continue;

    /**
     * @acp:domain library
     * @acp:layer utility
     */
    const level = levelMatch.length;
    /**
     * @acp:domain library
     * @acp:layer utility
     */
    const text = textMatch
      .replace(/\*\*(.+?)\*\*/g, "$1") // Remove bold
      .replace(/\*(.+?)\*/g, "$1") // Remove italic
      .replace(/`(.+?)`/g, "$1") // Remove inline code
      .replace(/\[(.+?)\]\(.+?\)/g, "$1") // Remove links
      .trim();

    /**
     * @acp:domain library
     * @acp:layer utility
     */
    const id = slugger.slug(text);

    /**
     * @acp:domain library
     * @acp:layer utility
     */
    const entry: TocEntry = { id, text, level };

    if (level === 2) {
      entries.push(entry);
    } else if (level === 3 && entries.length > 0) {
      /**
       * @acp:domain library
       * @acp:layer utility
       */
      const parent = entries[entries.length - 1];
      if (parent) {
        if (!parent.children) {
          parent.children = [];
        }
        parent.children.push(entry);
      }
    }
  }

  return entries;
}

/**
 * Flatten TOC entries for simpler iteration
 */
/**
 * @acp:domain library
 * @acp:layer utility
 * @acp:lock normal
 * @acp:summary "Flattens toc"
 * @acp:domain library
 * @acp:layer utility
 * @acp:summary "Flattens toc"
 */
export function flattenToc(entries: TocEntry[]): TocEntry[] {
  /**
   * @acp:domain library
   * @acp:layer utility
   */
  const flat: TocEntry[] = [];

  for (const entry of entries) {
    flat.push(entry);
    if (entry.children) {
      flat.push(...entry.children);
    }
  }

  return flat;
}