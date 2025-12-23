import { notFound } from "next/navigation";
import { getDocBySlug, getAllDocSlugs } from "@/lib/mdx";
import { getDocPagination, getBreadcrumbs } from "@/lib/docs-utils";
import { DocsToc } from "@/components/docs/docs-toc";
import { DocsBreadcrumbs } from "@/components/docs/docs-breadcrumbs";
import { DocsPagination } from "@/components/docs/docs-pagination";

interface PageProps {
  params: Promise<{
    slug?: string[];
  }>;
}

export async function generateStaticParams() {
  const slugs = await getAllDocSlugs();
  return slugs.map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: PageProps) {
  const { slug = [] } = await params;
  const doc = await getDocBySlug(slug);

  if (!doc) {
    return {
      title: "Not Found",
    };
  }

  return {
    title: `${doc.frontmatter.title} | ACP Protocol`,
    description: doc.frontmatter.description,
  };
}

export default async function DocPage({ params }: PageProps) {
  const { slug = [] } = await params;
  const doc = await getDocBySlug(slug);

  if (!doc) {
    notFound();
  }

  const pagination = await getDocPagination(slug);
  const breadcrumbs = getBreadcrumbs(slug, doc.frontmatter);

  return (
    <>
      {/* Fixed TOC on the right - only visible on xl screens */}
      {doc.toc.length > 0 && (
        <aside className="fixed right-8 top-24 hidden w-56 xl:block">
          <DocsToc items={doc.toc} />
        </aside>
      )}

      {/* Main content - centered with max-width */}
      <div className="mx-auto max-w-[850px] px-8 py-12 xl:mr-64">
        <article>
          <DocsBreadcrumbs items={breadcrumbs} />

          <header className="mb-8">
            <h1 className="text-4xl font-bold tracking-tight">
              {doc.frontmatter.title}
            </h1>
            {doc.frontmatter.description && (
              <p className="mt-3 text-lg text-muted-foreground">
                {doc.frontmatter.description}
              </p>
            )}
          </header>

          <div className="prose prose-neutral dark:prose-invert max-w-none">
            {doc.content}
          </div>

          <DocsPagination prev={pagination.prev} next={pagination.next} />
        </article>
      </div>
    </>
  );
}
