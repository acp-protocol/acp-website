"use client";

import Link from "next/link";
import { GithubIcon } from "@/components/icons/github-icon";
import { ThemeSwitcher } from "@/components/theme-switcher";
import { Button } from "@acp-website/ui/components";

/**
 * @acp:lock normal
 * @acp:summary "Headers"
 * @acp:summary "Headers"
 */
export function Header() {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/80 backdrop-blur-sm">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6">
        <Link href="/" className="flex items-center gap-2">
          <span className="text-xl font-bold">ACP Protocol</span>
        </Link>

        <nav className="flex items-center gap-6">
          <Link
            href="/docs"
            className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
          >
            Documentation
          </Link>
          <a
            href="https://github.com/your-org/acp-spec"
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
          >
            GitHub
          </a>
          <Button
            asChild
            size="sm"
            className="bg-gradient-to-b from-primary via-primary/90 to-primary/80 rounded-full shadow-[inset_0px_0px_0.25px_1.25px_rgba(38,37,36,0.5),inset_3px_5px_2px_-4.75px_white,inset_1.25px_1.5px_0px_0px_rgba(0,0,0,0.75),inset_0px_4.5px_0.25px_-2.5px_#fbfbfb,inset_1px_1px_3px_3px_rgba(26,24,24,0.3),inset_0px_-3px_1px_0px_rgba(0,0,0,0.5),inset_2.5px_-2px_3px_0px_rgba(124,108,94,0.75),inset_0px_-3px_3px_1px_rgba(255,245,221,0.1)] text-primary-foreground [text-shadow:_0px_0px_2px_rgba(241,237,238,0.4)] hover:brightness-110 transition-all duration-300"
          >
            <Link href="/docs">Get Started</Link>
          </Button>
          <ThemeSwitcher />
        </nav>
      </div>
    </header>
  );
}