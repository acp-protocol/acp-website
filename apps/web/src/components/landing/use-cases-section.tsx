import { Lock, Clock, Users, FileCheck } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@acp-website/ui/components";

const useCases = [
  {
    icon: Lock,
    title: "Security-Critical Code",
    description:
      "Lock authentication, encryption, and payment processing logic to prevent unintended modifications.",
  },
  {
    icon: Clock,
    title: "Legacy System Integration",
    description:
      "Document complex integration points with rich context for AI assistants navigating legacy code.",
  },
  {
    icon: Users,
    title: "Team Collaboration",
    description:
      "Share context about design decisions, technical debt, and implementation rationale across the team.",
  },
  {
    icon: FileCheck,
    title: "Regulatory Compliance",
    description:
      "Mark compliance-critical sections and document requirements that must be preserved.",
  },
];

/**
 * @acp:lock normal
 * @acp:summary "Uses cases section"
 * @acp:summary "Uses cases section"
 */
export function UseCasesSection() {
  return (
    <section className="py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-6">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
            Common Use Cases
          </h2>
          <p className="mt-4 text-lg text-muted-foreground">
            ACP Protocol helps teams maintain code quality and safety across
            various scenarios.
          </p>
        </div>

        <div className="mx-auto mt-16 grid max-w-5xl grid-cols-1 gap-6 sm:grid-cols-2">
          {useCases.map((useCase) => (
            <Card
              key={useCase.title}
              className="bg-gradient-to-b from-white via-gray-50 to-gray-100 rounded-xl shadow-[inset_0px_0px_0.5px_1px_rgba(255,255,255,0.9),inset_3px_5px_2px_-4.75px_white,inset_0px_4.5px_0.25px_-2.5px_rgba(255,255,255,0.8),inset_0px_-3px_3px_1px_rgba(0,0,0,0.03),0_4px_12px_rgba(0,0,0,0.08)] border border-white/50"
            >
              <CardHeader>
                <div className="flex items-center gap-4">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-secondary">
                    <useCase.icon className="h-5 w-5 text-secondary-foreground" />
                  </div>
                  <CardTitle className="text-lg">{useCase.title}</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">{useCase.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}