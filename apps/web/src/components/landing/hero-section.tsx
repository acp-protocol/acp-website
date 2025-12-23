"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { GithubIcon } from "@/components/icons/github-icon";
import { Button } from "@acp-website/ui/components";

/**
 * @acp:lock normal
 * @acp:summary "Heros section"
 * @acp:summary "Heros section"
 */
export function HeroSection() {
  return (
    <section className="relative overflow-hidden py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-6">
        <div className="mx-auto max-w-2xl text-center">
          <h1 className="text-4xl font-bold tracking-tight sm:text-6xl">
            AI Context Protocol
          </h1>
          <p className="mt-6 text-lg leading-8 text-muted-foreground">
            A machine-readable context protocol for AI-assisted development.
            Enhance your codebase with structured comments that AI models
            understand.
          </p>
          <div className="mt-10 flex items-center justify-center gap-4">
            <Button
              asChild
              size="lg"
              className="bg-gradient-to-b from-primary via-primary/90 to-primary/80 rounded-full shadow-[inset_0px_0px_0.25px_1.25px_rgba(38,37,36,0.5),inset_3px_5px_2px_-4.75px_white,inset_1.25px_1.5px_0px_0px_rgba(0,0,0,0.75),inset_0px_4.5px_0.25px_-2.5px_#fbfbfb,inset_1px_1px_3px_3px_rgba(26,24,24,0.3),inset_0px_-3px_1px_0px_rgba(0,0,0,0.5),inset_2.5px_-2px_3px_0px_rgba(124,108,94,0.75),inset_0px_-3px_3px_1px_rgba(255,245,221,0.1)] text-primary-foreground [text-shadow:_0px_0px_2px_rgba(241,237,238,0.4)] hover:brightness-110 transition-all duration-300"
            >
              <Link href="/docs">
                Get Started
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
            <Button
              asChild
              size="lg"
              variant="outline"
              className="bg-gradient-to-b from-[#3a3836] via-[#2d2b29] to-[#262524] rounded-full shadow-[inset_0px_0px_0.25px_1.25px_#262524,inset_3px_5px_2px_-4.75px_white,inset_1.25px_1.5px_0px_0px_rgba(0,0,0,0.75),inset_0px_4.5px_0.25px_-2.5px_#fbfbfb,inset_1px_1px_3px_3px_#1a1818,inset_0px_-3px_1px_0px_rgba(0,0,0,0.5),inset_2.5px_-2px_3px_0px_rgba(124,108,94,0.75),inset_0px_-3px_3px_1px_rgba(255,245,221,0.1)] border-0 text-[#f1edee] [text-shadow:_0px_0px_2px_rgba(241,237,238,0.4)] hover:brightness-110 transition-all duration-300"
            >
              <a
                href="https://github.com/your-org/acp-spec"
                target="_blank"
                rel="noopener noreferrer"
              >
                <GithubIcon className="mr-2 h-4 w-4" />
                GitHub
              </a>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}