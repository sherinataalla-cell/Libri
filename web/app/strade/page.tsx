import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft, Map as MapIcon } from "lucide-react";

import { getEntitiesData } from "@/lib/data";
import { renderInlineHtml } from "@/lib/markdown";
import { PROJECT_CONFIG } from "@/lib/project-config";
import { notFound } from "next/navigation";

export const metadata: Metadata = {
  title: "Indice strade",
  description:
    "Indice dei percorsi del progetto: strade secondarie, sentieri, viottoli — per quartiere/area.",
};

/**
 * Trasforma i link markdown alle schede del catalogo in link interni
 * `/catalogo/<id>`. Pattern sorgente generico:
 *   `[label](./<categoria>/<...>/<id>/scheda.md)`
 */
function rewriteSchedaLinks(md: string): string {
  return md.replace(
    /\(\.\/[^()\s]*?\/([^/()\s]+)\/scheda\.md\)/g,
    (_match, id) => `(/catalogo/${id})`,
  );
}

export default async function StradeIndexPage() {
  if (!PROJECT_CONFIG.hasStrade) notFound();

  const data = await getEntitiesData();
  const md = data.aux?.strade_index_md ?? "";

  if (!md.trim()) {
    return (
      <main className="mx-auto max-w-4xl px-6 py-10 space-y-6">
        <h1 className="font-serif text-3xl font-semibold text-ink">
          Indice strade
        </h1>
        <p className="font-serif italic text-ink-soft">
          Indice non disponibile (campo <code>aux.strade_index_md</code> vuoto).
        </p>
      </main>
    );
  }

  const html = renderInlineHtml(rewriteSchedaLinks(md));

  return (
    <main className="mx-auto max-w-5xl px-6 py-10 space-y-8">
      <header className="space-y-3 border-b border-rule-soft pb-6">
        <Link
          href="/"
          className="inline-flex items-center gap-1.5 font-mono text-[11px] uppercase tracking-wider text-ink-faint hover:text-accent"
        >
          <ArrowLeft className="h-3 w-3" aria-hidden />
          Home cruscotto
        </Link>
        <div className="flex items-center gap-2 text-accent">
          <MapIcon className="h-5 w-5" aria-hidden />
          <span className="font-mono text-xs uppercase tracking-wider">
            Indice strade
          </span>
        </div>
        <h1 className="font-serif text-4xl font-semibold tracking-tight text-ink">
          Indice dei percorsi
        </h1>
        <p className="font-serif text-lg italic text-ink-soft max-w-2xl">
          Vicoli, sentieri e percorsi del mondo del progetto — derivati dal
          grafo. I link aprono la scheda corrispondente nel catalogo.
        </p>
      </header>
      <div
        className="prose-saga"
        dangerouslySetInnerHTML={{ __html: html }}
      />
    </main>
  );
}
