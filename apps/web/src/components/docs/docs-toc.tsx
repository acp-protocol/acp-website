"use client";

import { useEffect, useState } from "react";
import type { TocEntry } from "@/lib/toc";
import { cn } from "@acp-website/ui/lib/utils";

interface DocsTocProps {
  items: TocEntry[];
}

export function DocsToc({ items }: DocsTocProps) {
  const [activeId, setActiveId] = useState<string>("");

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        // Find the first visible heading
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setActiveId(entry.target.id);
            break;
          }
        }
      },
      {
        // Trigger when heading is near top of viewport
        rootMargin: "-80px 0px -80% 0px",
        threshold: 0,
      },
    );

    // Observe all h2 and h3 headings with IDs
    const headings = document.querySelectorAll("h2[id], h3[id]");
    headings.forEach((heading) => observer.observe(heading));

    // Set initial active heading based on URL hash
    if (window.location.hash) {
      setActiveId(window.location.hash.slice(1));
    } else if (headings.length > 0 && headings[0]?.id) {
      setActiveId(headings[0].id);
    }

    return () => observer.disconnect();
  }, []);

  if (items.length === 0) {
    return null;
  }

  return (
    <div className="relative">
      <h4 className="mb-3 text-sm font-semibold text-foreground">On this page</h4>
      <nav className="relative">
        {/* Active indicator line */}
        <div className="absolute left-0 top-0 h-full w-px bg-border" />

        <ul className="space-y-1 text-sm">
          {items.map((item) => (
            <li key={item.id} className="relative">
              <a
                href={`#${item.id}`}
                onClick={() => setActiveId(item.id)}
                className={cn(
                  "block border-l py-1.5 pl-4 transition-colors",
                  activeId === item.id
                    ? "border-primary font-medium text-foreground"
                    : "border-transparent text-muted-foreground hover:border-muted-foreground/50 hover:text-foreground",
                )}
              >
                {item.text}
              </a>
              {item.children && item.children.length > 0 && (
                <ul className="space-y-1">
                  {item.children.map((child) => (
                    <li key={child.id}>
                      <a
                        href={`#${child.id}`}
                        onClick={() => setActiveId(child.id)}
                        className={cn(
                          "block border-l py-1.5 pl-8 transition-colors",
                          activeId === child.id
                            ? "border-primary font-medium text-foreground"
                            : "border-transparent text-muted-foreground hover:border-muted-foreground/50 hover:text-foreground",
                        )}
                      >
                        {child.text}
                      </a>
                    </li>
                  ))}
                </ul>
              )}
            </li>
          ))}
        </ul>
      </nav>
    </div>
  );
}
