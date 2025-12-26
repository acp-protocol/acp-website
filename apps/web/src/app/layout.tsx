/**
 * @fileoverview Root layout component for the ACP Protocol web application.
 * Sets up fonts, metadata, and theme provider for the entire application.
 * @module @acp-website/web/app/layout
 */

import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { ThemeProvider } from "@acp-website/ui/providers";
import "./globals.css";

/**
 * Geist Sans font configuration.
 * @description Primary sans-serif font for the application.
 */
const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

/**
 * Geist Mono font configuration.
 * @description Monospace font for code and technical content.
 */
const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

/**
 * Application metadata for SEO and browser display.
 * @see https://nextjs.org/docs/app/api-reference/functions/generate-metadata
 */
/**
 * @acp:lock normal
 */
export const metadata: Metadata = {
  title: "ACP Protocol",
  description: "AI Context Protocol - A machine-readable context protocol for AI-assisted development",
  icons: {
    icon: "/Favicon.svg",
  },
};

/**
 * Root layout component that wraps all pages in the application.
 *
 * @description Provides the HTML document structure, font configuration,
 * and theme context for the entire application. Includes an inline script
 * to prevent flash of unstyled content (FOUC) during initial page load.
 *
 * @param props - Component props
 * @param props.children - Child page content to render
 * @returns Root HTML document structure
 *
 * @example
 * ```tsx
 * // This is automatically used by Next.js for all pages
 * // in the app directory
 * ```
 *
 * @see ThemeProvider
 */
/**
 * @acp:lock normal
 * @acp:summary "Roots layout"
 * @acp:summary "Roots layout"
 */
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        {/* Prevent FOUC by setting initial theme before hydration */}
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                try {
                  var variant = localStorage.getItem('acp-theme-variant') || 'acp';
                  document.documentElement.setAttribute('data-theme', variant);
                  var link = document.createElement('link');
                  link.id = 'theme-variant-css';
                  link.rel = 'stylesheet';
                  link.href = '/themes/' + variant + '.css';
                  document.head.appendChild(link);
                } catch (e) {}
              })();
            `,
          }}
        />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <ThemeProvider defaultVariant="acp" defaultColorMode="system">
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}