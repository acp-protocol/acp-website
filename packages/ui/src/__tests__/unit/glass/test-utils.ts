/**
 * @acp:domain tests
 * @acp:layer utility
 */
/**
 * @file Shared test utilities for Glass UI components. Provides helpers for
 *   rendering, assertions, and common test patterns.
 */

import { render, type RenderResult } from "@testing-library/react";
import type { ReactElement } from "react";

/** Glass-specific CSS class patterns used across components. */
/**
 * @acp:domain testing
 * @acp:layer utility
 * @acp:lock normal
 * @acp:domain testing
 * @acp:layer utility
 */
export const GLASS_CLASSES = {
  base: [
    "bg-glass-bg",
    "backdrop-blur-md",
    "border-glass-border",
    "shadow-glass",
  ],
  subtle: ["bg-glass-bg/50", "backdrop-blur-sm", "border-glass-border/50"],
  frosted: [
    "bg-[var(--glass-frosted-bg)]",
    "backdrop-blur-[var(--blur-frosted)]",
  ],
  crystal: [
    "bg-[var(--glass-crystal-bg)]",
    "border-[var(--glass-crystal-border)]",
  ],
  overflow: "overflow-hidden",
  relative: "relative",
} as const;

/** Hover effect class patterns mapped by effect name. */
/**
 * @acp:domain testing
 * @acp:layer utility
 * @acp:lock normal
 * @acp:domain testing
 * @acp:layer utility
 */
export const HOVER_EFFECT_CLASSES = {
  none: "",
  glow: "shadow-purple-500/50",
  shimmer: "before:via-white/20",
  ripple: "after:bg-white/30",
  lift: "hover:-translate-y-1",
  scale: "hover:scale-105",
} as const;

/** Glow-related CSS classes for components with glow prop. */
/**
 * @acp:domain testing
 * @acp:layer utility
 * @acp:lock normal
 * @acp:domain testing
 * @acp:layer utility
 */
export const GLOW_CLASSES = {
  alert: "shadow-lg shadow-purple-500/20",
  accordion:
    "data-[state=open]:shadow-md data-[state=open]:shadow-purple-500/20",
} as const;

/** Animated backdrop blur class. */
/**
 * @acp:domain testing
 * @acp:layer utility
 * @acp:lock normal
 * @acp:domain testing
 * @acp:layer utility
 */
export const ANIMATED_CLASS = "backdrop-blur-[var(--blur-lg)]";

/** Sample glass customization for testing custom glass styles. */
/**
 * @acp:domain testing
 * @acp:layer utility
 * @acp:lock normal
 * @acp:domain testing
 * @acp:layer utility
 */
export const SAMPLE_GLASS_CUSTOMIZATION = {
  color: "rgba(59, 130, 246, 0.2)",
  blur: 25,
  outline: "rgba(59, 130, 246, 0.4)",
};

/**
 * Renders a glass component and returns the result with helper methods.
 *
 * @param ui - The React element to render
 * @returns RenderResult with the rendered component
 */
/**
 * @acp:domain testing
 * @acp:layer utility
 * @acp:lock normal
 * @acp:summary "Renders glass component"
 * @acp:domain testing
 * @acp:layer utility
 * @acp:summary "Renders glass component"
 */
export function renderGlassComponent(ui: ReactElement): RenderResult {
  return render(ui);
}

/**
 * Checks if an element has glass base styling classes.
 *
 * @param element - The HTML element to check
 * @returns True if element has any glass base class
 */
/**
 * @acp:domain testing
 * @acp:layer utility
 * @acp:lock normal
 * @acp:summary "Checks if has glass base styles"
 * @acp:domain testing
 * @acp:layer utility
 * @acp:summary "Checks if has glass base styles"
 */
export function hasGlassBaseStyles(element: HTMLElement | null): boolean {
  if (!element) return false;
  return GLASS_CLASSES.base.some((cls) => element.className.includes(cls));
}

/**
 * Checks if an element has the expected hover effect class.
 *
 * @param element - The HTML element to check
 * @param effect - The hover effect to check for
 * @returns True if element has the hover effect class
 */
/**
 * @acp:domain security
 * @acp:layer utility
 * @acp:lock restricted
 * @acp:summary "Checks if has hover effect"
 * @acp:domain security
 * @acp:layer utility
 * @acp:lock restricted
 * @acp:summary "Checks if has hover effect"
 */
export function hasHoverEffect(
  element: HTMLElement | null,
  effect: keyof typeof HOVER_EFFECT_CLASSES
): boolean {
  if (!element) return false;
  if (effect === "none") return true; // "none" is always valid
  return element.className.includes(HOVER_EFFECT_CLASSES[effect]);
}

/**
 * Checks if an element has inline styles from glass customization.
 *
 * @param element - The HTML element to check
 * @returns True if element has custom glass inline styles
 */
/**
 * @acp:domain testing
 * @acp:layer utility
 * @acp:lock normal
 * @acp:summary "Checks if has custom glass styles"
 * @acp:domain testing
 * @acp:layer utility
 * @acp:summary "Checks if has custom glass styles"
 */
export function hasCustomGlassStyles(element: HTMLElement | null): boolean {
  if (!element) return false;
  /**
   * @acp:domain testing
   * @acp:layer utility
   */
  const style = element.getAttribute("style") || "";
  return (
    style.includes("background-color") ||
    style.includes("backdrop-filter") ||
    style.includes("border-color")
  );
}

/**
 * Creates a standard test suite structure for glass components. This helper
 * provides consistent test organization.
 *
 * @param componentName - Name of the component being tested
 * @returns Object with test category names
 */
/**
 * @acp:domain tests
 * @acp:layer utility
 * @acp:lock normal
 * @acp:summary "Gets test categories"
 * @acp:domain tests
 * @acp:layer utility
 * @acp:summary "Gets test categories"
 */
export function getTestCategories(componentName: string) {
  return {
    rendering: `${componentName} Rendering`,
    props: `${componentName} Props`,
    styling: `${componentName} Styling`,
    reexports: `${componentName} Re-exports`,
    integration: `${componentName} Integration`,
  };
}

/**
 * Asserts that all expected classes are present on an element.
 *
 * @param element - The HTML element to check
 * @param expectedClasses - Array of class names to verify
 * @throws If any expected class is missing
 */
/**
 * @acp:domain testing
 * @acp:layer utility
 * @acp:lock normal
 * @acp:summary "Expects classes"
 * @acp:domain testing
 * @acp:layer utility
 * @acp:summary "Expects classes"
 */
export function expectClasses(
  element: HTMLElement | null,
  expectedClasses: string[]
): void {
  if (!element) {
    throw new Error("Element is null");
  }
  expectedClasses.forEach((cls) => {
    if (!element.className.includes(cls)) {
      throw new Error(
        `Expected class "${cls}" not found. Actual: ${element.className}`
      );
    }
  });
}

/** Common props for testing disabled state. */
/**
 * @acp:domain testing
 * @acp:layer utility
 * @acp:lock normal
 * @acp:domain testing
 * @acp:layer utility
 */
export const DISABLED_PROPS = {
  disabled: true,
};

/** Common props for testing click handlers. */
/**
 * @acp:domain testing
 * @acp:layer handler
 * @acp:lock normal
 * @acp:summary "Gets click handler props"
 * @acp:domain testing
 * @acp:layer handler
 * @acp:summary "Gets click handler props"
 */
export function getClickHandlerProps(handler: () => void) {
  return {
    onClick: handler,
  };
}