"use client";

import { useTheme } from "@acp-website/ui/providers";
import { Sun, Moon, Monitor } from "lucide-react";
import type { ColorMode } from "@acp-website/ui/providers";

const modeOrder: ColorMode[] = ["system", "dark", "light"];

const modeConfig: Record<ColorMode, { icon: typeof Sun; label: string }> = {
  system: { icon: Monitor, label: "System theme" },
  dark: { icon: Moon, label: "Dark theme" },
  light: { icon: Sun, label: "Light theme" },
};

export function ThemeSwitcher() {
  const { colorMode, setColorMode, mounted } = useTheme();

  if (!mounted) {
    return (
      <button className="flex h-8 w-8 items-center justify-center rounded-full bg-muted/50">
        <div className="h-4 w-4 animate-pulse rounded-full bg-muted" />
      </button>
    );
  }

  const currentMode = colorMode ?? "system";

  const cycleTheme = () => {
    const currentIndex = modeOrder.indexOf(currentMode);
    const nextIndex = (currentIndex + 1) % modeOrder.length;
    const nextMode = modeOrder[nextIndex] ?? "system";
    setColorMode(nextMode);
  };

  const { icon: Icon, label } = modeConfig[currentMode];

  return (
    <button
      onClick={cycleTheme}
      className="flex h-8 w-8 items-center justify-center rounded-full bg-muted/50 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
      aria-label={label}
      title={label}
    >
      <Icon className="h-4 w-4" />
    </button>
  );
}