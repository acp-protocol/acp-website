import Link from "next/link";
import Image from "next/image";
import { GithubIcon } from "@/components/icons/github-icon";

/**
 * @acp:lock normal
 * @acp:summary "Footers"
 * @acp:summary "Footers"
 */
export function Footer() {
  return (
    <footer className="border-t border-border bg-background py-12">
      <div className="mx-auto max-w-7xl px-6">
        <div className="flex flex-col items-center justify-between gap-6 sm:flex-row">
          <div className="flex items-center gap-3">
            <div className="relative h-8 w-32">
              <Image
                src="/ACP-Logo-Dark.svg"
                alt="ACP Protocol"
                fill
                className="object-contain hidden dark:block"
              />
              <Image
                src="/ACP-Logo-Light.svg"
                alt="ACP Protocol"
                fill
                className="object-contain block dark:hidden"
              />
            </div>
            <span className="text-muted-foreground">
              {new Date().getFullYear()}
            </span>
          </div>

          <nav className="flex items-center gap-6">
            <Link
              href="/docs"
              className="text-sm text-muted-foreground transition-colors hover:text-foreground"
            >
              Documentation
            </Link>
            <a
              href="https://github.com/your-org/acp-spec"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-foreground"
            >
              <GithubIcon className="h-4 w-4" />
              GitHub
            </a>
          </nav>
        </div>
      </div>
    </footer>
  );
}