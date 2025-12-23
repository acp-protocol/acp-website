/**
 * @acp:domain configuration
 * @acp:layer config
 */
import type { NextConfig } from "next";
import path from "path";

/**
 * @acp:domain configuration
 * @acp:layer config
 */
const uiPackagePath = path.resolve(__dirname, "../../packages/ui/src");

/**
 * @acp:domain configuration
 * @acp:layer config
 */
const nextConfig: NextConfig = {
  // Transpile workspace packages
  transpilePackages: ["@acp-website/ui", "@acp-website/tailwind-config"],

  // Configure Turbopack to resolve UI package's internal path aliases
  turbopack: {
    resolveAlias: {
      "@/lib/utils": path.join(uiPackagePath, "lib/utils.ts"),
      "@/lib/get-strict-context": path.join(
        uiPackagePath,
        "lib/get-strict-context.ts",
      ),
      "@/lib/hover-effects": path.join(uiPackagePath, "lib/hover-effects.ts"),
      "@/lib/glass-utils": path.join(uiPackagePath, "lib/glass-utils.ts"),
      "@/components/ui/button": path.join(
        uiPackagePath,
        "components/ui/button.tsx",
      ),
      "@/components/ui/accordion": path.join(
        uiPackagePath,
        "components/ui/accordion.tsx",
      ),
      "@/components/ui/alert": path.join(
        uiPackagePath,
        "components/ui/alert.tsx",
      ),
      "@/components/ui/alert-dialog": path.join(
        uiPackagePath,
        "components/ui/alert-dialog.tsx",
      ),
      "@/components/ui/avatar": path.join(
        uiPackagePath,
        "components/ui/avatar.tsx",
      ),
      "@/components/ui/badge": path.join(
        uiPackagePath,
        "components/ui/badge.tsx",
      ),
      "@/components/ui/breadcrumb": path.join(
        uiPackagePath,
        "components/ui/breadcrumb.tsx",
      ),
      "@/components/ui/button-group": path.join(
        uiPackagePath,
        "components/ui/button-group.tsx",
      ),
      "@/components/ui/calendar": path.join(
        uiPackagePath,
        "components/ui/calendar.tsx",
      ),
      "@/components/ui/card": path.join(
        uiPackagePath,
        "components/ui/card.tsx",
      ),
      "@/components/ui/carousel": path.join(
        uiPackagePath,
        "components/ui/carousel.tsx",
      ),
      "@/components/ui/dialog": path.join(
        uiPackagePath,
        "components/ui/dialog.tsx",
      ),
      "@/components/ui/table": path.join(
        uiPackagePath,
        "components/ui/table.tsx",
      ),
      "@/components/animate-ui/primitives/animate/code-block": path.join(
        uiPackagePath,
        "components/animate-ui/primitives/animate/code-block.tsx",
      ),
      "@/components/animate-ui/components/buttons/copy": path.join(
        uiPackagePath,
        "components/animate-ui/components/buttons/copy.tsx",
      ),
    },
  },
};

export default nextConfig;