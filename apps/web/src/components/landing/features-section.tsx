import { Shield, Zap, Globe, Wrench } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@acp-website/ui/components";

const features = [
  {
    icon: Shield,
    title: "Protect Critical Code",
    description:
      "Use graduated lock levels to prevent AI from modifying sensitive or critical code sections.",
  },
  {
    icon: Zap,
    title: "Token Efficient",
    description:
      "Reduce AI token usage by 50-90% with compact, structured context through variables and caching.",
  },
  {
    icon: Globe,
    title: "Language Agnostic",
    description:
      "Works with any programming language through standard comment syntax. TypeScript, Python, Rust, and more.",
  },
  {
    icon: Wrench,
    title: "Tool Agnostic",
    description:
      "Compatible with Claude, GPT, Copilot, Cursor, and any AI development tool through the primer system.",
  },
];

/**
 * @acp:lock normal
 * @acp:summary "Featureses section"
 * @acp:summary "Featureses section"
 */
export function FeaturesSection() {
  return (
    <section className="py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-6">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
            Why ACP Protocol?
          </h2>
          <p className="mt-4 text-lg text-muted-foreground">
            Bridge the gap between developers and AI coding assistants with
            structured, machine-readable context.
          </p>
        </div>

        <div className="mx-auto mt-16 grid max-w-5xl grid-cols-1 gap-8 sm:grid-cols-2">
          {features.map((feature) => (
            <Card
              key={feature.title}
              className="relative bg-card rounded-xl shadow-[inset_0px_0px_0.5px_1px_rgba(255,255,255,0.2),0_4px_12px_rgba(0,0,0,0.08)] dark:shadow-[inset_0px_0px_0.5px_1px_rgba(255,255,255,0.05),0_4px_12px_rgba(0,0,0,0.3)] border border-border/50"
            >
              <CardHeader>
                <div
                  className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10"
                  style={{ backgroundColor: "rgba(124, 58, 237, 0.1)" }}
                >
                  <feature.icon
                    className="h-6 w-6 text-primary"
                    style={{ color: "#7c3aed" }}
                  />
                </div>
                <CardTitle className="text-xl">{feature.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">{feature.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}