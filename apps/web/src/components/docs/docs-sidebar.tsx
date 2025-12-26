"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { ChevronRight } from "lucide-react";
import type { NavSection } from "@/lib/docs-utils";
import { cn } from "@acp-website/ui/lib/utils";
import { ThemeSwitcher } from "@/components/theme-switcher";

/**
 * @acp:summary "DocsSidebarProps interface"
 */
interface DocsSidebarProps {
  navigation: NavSection[];
}

export function DocsSidebar({ navigation }: DocsSidebarProps) {
  const pathname = usePathname();

  // Initialize collapsed by default, only expand section containing current page
  const [expandedSections, setExpandedSections] = useState<Set<string>>(() => {
    const expanded = new Set<string>();
    navigation.forEach((section) => {
      if (section.items.some((item) => item.href === pathname)) {
        expanded.add(section.slug);
      }
    });
    return expanded;
  });

  // Update expanded sections when pathname changes
  useEffect(() => {
    navigation.forEach((section) => {
      if (section.items.some((item) => item.href === pathname)) {
        setExpandedSections((prev) => new Set(prev).add(section.slug));
      }
    });
  }, [pathname, navigation]);

  const toggleSection = (slug: string) => {
    setExpandedSections((prev) => {
      const next = new Set(prev);
      if (next.has(slug)) {
        next.delete(slug);
      } else {
        next.add(slug);
      }
      return next;
    });
  };

  return (
    <aside className="fixed left-0 top-0 z-40 hidden h-screen w-64 overflow-y-auto border-r border-border bg-card/50 px-4 py-6 lg:block">
      <div className="mb-6 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2 text-xl font-bold">
          <Image
            src="/ACP-Logo-Dark.svg"
            alt="ACP Logo"
            width={72}
            height={72}
            className="hidden dark:block"
          />
          <Image
            src="/ACP-Logo-Light.svg"
            alt="ACP Logo"
            width={72}
            height={72}
            className="block dark:hidden"
          />
          ACP Protocol
        </Link>
        <ThemeSwitcher />
      </div>

      <nav className="space-y-2">
        {navigation.map((section) => {
          const isExpanded = expandedSections.has(section.slug);
          const hasActiveItem = section.items.some(
            (item) => item.href === pathname
          );

          return (
            <div key={section.slug}>
              <button
                onClick={() => toggleSection(section.slug)}
                className={cn(
                  "flex w-full items-center justify-between rounded-md px-2 py-2 text-sm font-semibold transition-colors hover:bg-accent",
                  hasActiveItem ? "text-foreground" : "text-muted-foreground"
                )}
              >
                <span>{section.title}</span>
                <ChevronRight
                  className={cn(
                    "h-4 w-4 transition-transform duration-200",
                    isExpanded && "rotate-90"
                  )}
                />
              </button>
              <ul
                className={cn(
                  "mt-1 space-y-1 overflow-hidden transition-all duration-200",
                  isExpanded ? "max-h-96 opacity-100" : "max-h-0 opacity-0"
                )}
              >
                {section.items.map((item) => (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      className={cn(
                        "block rounded-md px-3 py-2 pl-4 text-sm transition-colors",
                        pathname === item.href
                          ? "bg-primary/10 font-medium text-primary"
                          : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
                      )}
                    >
                      {item.title}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          );
        })}
      </nav>
    </aside>
  );
}