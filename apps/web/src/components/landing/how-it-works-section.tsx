"use client";

import { Code2, Search, Sparkles, FileCode2 } from "lucide-react";
import { Code, CodeHeader, CodeBlock } from "@acp-website/ui/components";

const steps = [
  {
    icon: Code2,
    number: "1",
    title: "Add ACP Annotations",
    description:
      "Insert structured ACP directives using standard comment syntax in your code.",
  },
  {
    icon: Search,
    number: "2",
    title: "AI Reads Context",
    description:
      "AI assistants parse the .acp.cache.json to understand constraints and context.",
  },
  {
    icon: Sparkles,
    number: "3",
    title: "Better Assistance",
    description:
      "Get more accurate, context-aware suggestions while protecting critical code.",
  },
];

const codeExample = `// @acp-lock:3 - Security-critical authentication
// @acp-context: JWT tokens, validates against Redis
export async function validateToken(token: string) {
  const decoded = jwt.verify(token, SECRET);
  const session = await redis.get(\`session:\${decoded.id}\`);
  return session ? JSON.parse(session) : null;
}`;

/**
 * @acp:lock normal
 * @acp:summary "Hows it works section"
 * @acp:summary "Hows it works section"
 */
export function HowItWorksSection() {
  return (
    <section className="border-y border-border bg-muted/30 py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-6">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
            How It Works
          </h2>
          <p className="mt-4 text-lg text-muted-foreground">
            Three simple steps to enhance your AI-assisted development workflow.
          </p>
        </div>

        <div className="mx-auto mt-16 grid max-w-5xl grid-cols-1 gap-8 lg:grid-cols-3">
          {steps.map((step) => (
            <div key={step.number} className="relative text-center">
              <div
                className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-primary bg-gradient-to-b from-primary via-primary/90 to-primary/80 shadow-[inset_0px_0px_0.25px_1.25px_rgba(38,37,36,0.5),inset_3px_5px_2px_-4.75px_white,inset_1.25px_1.5px_0px_0px_rgba(0,0,0,0.75),inset_0px_4.5px_0.25px_-2.5px_#fbfbfb,inset_1px_1px_3px_3px_rgba(26,24,24,0.3),inset_0px_-3px_1px_0px_rgba(0,0,0,0.5),inset_2.5px_-2px_3px_0px_rgba(124,108,94,0.75),inset_0px_-3px_3px_1px_rgba(255,245,221,0.1)] text-2xl font-bold text-primary-foreground [text-shadow:_0px_0px_2px_rgba(241,237,238,0.4)]"
                style={{ backgroundColor: "#7c3aed" }}
              >
                {step.number}
              </div>
              <h3 className="text-xl font-semibold">{step.title}</h3>
              <p className="mt-2 text-muted-foreground">{step.description}</p>
            </div>
          ))}
        </div>

        <div className="mx-auto mt-16 max-w-3xl">
          <Code code={codeExample}>
            <CodeHeader icon={FileCode2} copyButton>
              auth.ts
            </CodeHeader>
            <CodeBlock lang="typescript" writing duration={3000} cursor inView />
          </Code>
        </div>
      </div>
    </section>
  );
}