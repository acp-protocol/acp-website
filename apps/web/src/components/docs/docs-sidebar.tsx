"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import type { NavSection } from "@/lib/docs-utils";
import { cn } from "@acp-website/ui/lib/utils";

/**
 * @acp:summary "DocsSidebarProps interface"
 */
interface DocsSidebarProps {
  navigation: NavSection[];
}

export function DocsSidebar({ navigation }: DocsSidebarProps) {
  const pathname = usePathname();

  return (
    <aside className="fixed left-0 top-0 z-40 hidden h-screen w-64 overflow-y-auto border-r border-border bg-card/50 px-4 py-6 lg:block">
      <div className="mb-6">
        <Link href="/" className="text-xl font-bold">
          ACP Protocol
        </Link>
      </div>

      <nav className="space-y-6">
        {navigation.map((section) => (
          <div key={section.slug}>
            <h4 className="mb-2 text-sm font-semibold text-foreground">
              {section.title}
            </h4>
            <ul className="space-y-1">
              {section.items.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className={cn(
                      "block rounded-md px-3 py-2 text-sm transition-colors",
                      pathname === item.href
                        ? "bg-primary/10 font-medium text-primary"
                        : "text-muted-foreground hover:bg-accent hover:text-accent-foreground",
                    )}
                  >
                    {item.title}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </nav>
    </aside>
  );
}