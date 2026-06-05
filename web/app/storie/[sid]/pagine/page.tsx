// Vista alternativa "pagine libro" (prosa subhook + immagine-scena).
// Spostata da `/storie/[sid]` (ora dashboard di lavoro) a
// `/storie/[sid]/pagine` come sub-route. Generata SSG su tutti i sid.
//
// Mantiene esattamente la struttura precedente: HookList + FrontmatterBlock +
// StoriaPages, alimentata da `lib/storie.ts` (output di build-storie.mjs).

import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, LayoutDashboard } from "lucide-react";

import { getAllSids, getStoriaBySid } from "@/lib/storie";
import { Badge } from "@/components/ui/badge";
import { FrontmatterBlock } from "@/components/catalogo/frontmatter-block";
import { StoriaPages } from "@/components/storie/storia-pages";
import { HookList } from "@/components/storie/hook-list";

interface PageProps {
  params: Promise<{ sid: string }>;
}

export async function generateStaticParams() {
  const sids = await getAllSids();
  return sids.map((sid) => ({ sid }));
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { sid } = await params;
  const story = await getStoriaBySid(sid);
  if (!story) return { title: "Storia non trovata — Cruscotto" };
  return {
    title: `${story.title} — pagine libro · ${story.sid.toUpperCase()}`,
    description: `Prosa e immagini-scena della storia ${story.sid} (${story.pages.length} pagine libro).`,
  };
}

function asStr(v: unknown): string | null {
  return typeof v === "string" && v.trim() ? v : null;
}

export default async function StoriaPaginePage({ params }: PageProps) {
  const { sid } = await params;
  const story = await getStoriaBySid(sid);
  if (!story) notFound();

  const cycle = asStr(story.frontmatter.cycle);
  const status = asStr(story.frontmatter.status);
  const season = asStr(story.frontmatter.season);
  const wind = asStr(story.frontmatter.wind);
  const block = asStr(story.frontmatter.block);

  return (
    <main className="mx-auto max-w-5xl px-6 py-10 space-y-8">
      <header className="space-y-3 border-b border-rule-soft pb-6">
        <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
          <Link
            href={`/storie/${sid}`}
            className="inline-flex items-center gap-1.5 font-mono text-[11px] uppercase tracking-wider text-ink-faint hover:text-accent"
          >
            <ArrowLeft className="h-3 w-3" aria-hidden />
            Dashboard {story.sid.toUpperCase()}
          </Link>
          <Link
            href="/storie"
            className="inline-flex items-center gap-1.5 font-mono text-[11px] uppercase tracking-wider text-ink-faint hover:text-accent"
          >
            <LayoutDashboard className="h-3 w-3" aria-hidden />
            Tutte le storie
          </Link>
        </div>
        <div className="flex items-center gap-2 font-mono text-[10px] uppercase tracking-wider text-ink-faint">
          <span>{story.sid.toUpperCase()}</span>
          {cycle && (
            <>
              <span aria-hidden>·</span>
              <span>Ciclo {cycle}</span>
            </>
          )}
          <span aria-hidden>·</span>
          <span>vista pagine libro</span>
        </div>
        <h1 className="font-serif text-4xl font-semibold tracking-tight text-ink">
          {story.title}
        </h1>
        <div className="flex flex-wrap items-center gap-1.5">
          {status && (
            <Badge
              variant={status === "definitiva" ? "canonico" : "provvisorio"}
            >
              {status}
            </Badge>
          )}
          {season && <Badge variant="warm">{season}</Badge>}
          {wind && <Badge variant="accent">{wind}</Badge>}
          {block && <Badge variant="outline">{block}</Badge>}
          <Badge variant="secondary" className="font-mono">
            {story.hooks.length} hook · {story.pages.length} pagine
          </Badge>
        </div>
      </header>

      <HookList story={story} />

      <FrontmatterBlock frontmatter={story.frontmatter} />

      <StoriaPages story={story} />
    </main>
  );
}
