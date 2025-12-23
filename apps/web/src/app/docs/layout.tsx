import { buildNavigation } from "@/lib/docs-utils";
import { DocsSidebar } from "@/components/docs/docs-sidebar";

/**
 * Docs layout with fixed sidebar and scrollable content area.
 * TOC is handled at the page level and positioned fixed to the right.
 */
export default async function DocsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const navigation = await buildNavigation();

  return (
    <div className="relative min-h-screen">
      {/* Fixed left sidebar */}
      <DocsSidebar navigation={navigation} />

      {/* Main content area - offset by sidebar width */}
      <div className="lg:pl-64">
        <main className="min-h-screen">
          {children}
        </main>
      </div>
    </div>
  );
}
