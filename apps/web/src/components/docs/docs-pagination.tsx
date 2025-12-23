import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";
import type { NavItem } from "@/lib/docs-utils";

/**
 * @acp:summary "DocsPaginationProps interface"
 */
interface DocsPaginationProps {
  prev: NavItem | null;
  next: NavItem | null;
}

export function DocsPagination({ prev, next }: DocsPaginationProps) {
  if (!prev && !next) {
    return null;
  }

  return (
    <nav className="mt-12 flex items-center justify-between border-t border-border pt-6">
      {prev ? (
        <Link
          href={prev.href}
          className="group flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-foreground"
        >
          <ChevronLeft className="h-4 w-4 transition-transform group-hover:-translate-x-1" />
          <div className="flex flex-col">
            <span className="text-xs uppercase tracking-wide">Previous</span>
            <span className="font-medium text-foreground">{prev.title}</span>
          </div>
        </Link>
      ) : (
        <div />
      )}

      {next ? (
        <Link
          href={next.href}
          className="group flex items-center gap-2 text-right text-sm text-muted-foreground transition-colors hover:text-foreground"
        >
          <div className="flex flex-col">
            <span className="text-xs uppercase tracking-wide">Next</span>
            <span className="font-medium text-foreground">{next.title}</span>
          </div>
          <ChevronRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
        </Link>
      ) : (
        <div />
      )}
    </nav>
  );
}