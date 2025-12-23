import Link from "next/link";
import { ChevronRight } from "lucide-react";

/**
 * @acp:summary "BreadcrumbItem interface"
 */
interface BreadcrumbItem {
  title: string;
  href: string;
}

/**
 * @acp:summary "DocsBreadcrumbsProps interface"
 */
interface DocsBreadcrumbsProps {
  items: BreadcrumbItem[];
}

export function DocsBreadcrumbs({ items }: DocsBreadcrumbsProps) {
  if (items.length <= 1) {
    return null;
  }

  return (
    <nav className="mb-4 flex items-center space-x-1 text-sm text-muted-foreground">
      {items.map((item, index) => (
        <span key={item.href} className="flex items-center">
          {index > 0 && <ChevronRight className="mx-1 h-4 w-4" />}
          {index === items.length - 1 ? (
            <span className="text-foreground">{item.title}</span>
          ) : (
            <Link
              href={item.href}
              className="transition-colors hover:text-foreground"
            >
              {item.title}
            </Link>
          )}
        </span>
      ))}
    </nav>
  );
}