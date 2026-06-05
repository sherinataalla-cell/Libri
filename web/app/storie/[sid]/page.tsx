// Dashboard di lavoro per una singola storia.
// Server Component, SSG su tutti gli sid (12 storie). Sostituisce la
// precedente vista "pagine libro" che è stata spostata su `/storie/[sid]/pagine`.

import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, BookOpen, ExternalLink } from "lucide-react";

import {
  getAllDashboardSids,
  getSagaStyleReference,
  getStoriaDashboardBySid,
} from "@/lib/storie-dashboard";
import { Badge } from "@/components/ui/badge";
import { ProgressBar } from "@/components/storie-dashboard/progress-bar";
import { StatsCard } from "@/components/storie-dashboard/stats-card";
import { StyleReferenceBlock } from "@/components/storie-dashboard/style-reference-block";
import { AnnotationsBanner } from "@/components/storie-dashboard/annotations-banner";
import { HookAccordion } from "@/components/storie-dashboard/hook-accordion";
import { CanonTodoBlock } from "@/components/storie-dashboard/canon-todo-block";

interface PageProps {
  params: Promise<{ sid: string }>;
}

export async function generateStaticParams() {
  const sids = await getAllDashboardSids();
  return sids.map((sid) => ({ sid }));
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { sid } = await params;
  const story = await getStoriaDashboardBySid(sid);
  if (!story) return { title: "Storia non trovata — Cruscotto" };
  return {
    title: `${story.title} — dashboard ${story.sid.toUpperCase()}`,
    description: `Stato di avanzamento illustrazioni della storia ${story.sid}: hook visivi, audit personaggi/luoghi/oggetti, annotazioni e todo canone.`,
  };
}

export default async function StoriaDashboardPage({ params }: PageProps) {
  const { sid } = await params;
  const [story, sagaStyle] = await Promise.all([
    getStoriaDashboardBySid(sid),
    getSagaStyleReference(),
  ]);
  if (!story) notFound();

  const stats = story.stats;
  const ready = stats.hooks_image_ready ?? 0;
  const total = stats.hooks_total ?? story.hooks.length ?? 10;

  return (
    <main className="mx-auto max-w-6xl px-6 py-10 space-y-8">
      {/* Header */}
      <header className="space-y-3 border-b border-rule-soft pb-6">
        <Link
          href="/storie"
          className="inline-flex items-center gap-1.5 font-mono text-[11px] uppercase tracking-wider text-ink-faint hover:text-accent"
        >
          <ArrowLeft className="h-3 w-3" aria-hidden />
          Tutte le storie
        </Link>
        <div className="flex flex-wrap items-center gap-2 font-mono text-[10px] uppercase tracking-wider text-ink-faint">
          <span>{story.sid.toUpperCase()}</span>
          {story.cycle && (
            <>
              <span aria-hidden>·</span>
              <span>Ciclo {story.cycle}</span>
            </>
          )}
          <span aria-hidden>·</span>
          <span>{total} hook</span>
          {story.status && (
            <>
              <span aria-hidden>·</span>
              <span>status {story.status}</span>
            </>
          )}
          {story.github_url && (
            <>
              <span aria-hidden>·</span>
              <a
                href={story.github_url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 hover:text-accent"
              >
                testo su GitHub
                <ExternalLink className="h-3 w-3" aria-hidden />
              </a>
            </>
          )}
        </div>
        <h1 className="font-serif text-4xl font-semibold tracking-tight text-ink">
          {story.title}
        </h1>
        <div className="flex flex-wrap items-center gap-2">
          <Link
            href={`/storie/${story.sid}/pagine`}
            className="inline-flex items-center gap-1.5 rounded-md border border-rule bg-paper px-3 py-1.5 font-mono text-xs uppercase tracking-wider text-ink-soft hover:border-accent/40 hover:text-accent"
          >
            <BookOpen className="h-3.5 w-3.5" aria-hidden />
            Vista pagine libro
          </Link>
          {story.status && (
            <Badge
              variant={
                story.status === "definitiva" ? "canonico" : "provvisorio"
              }
            >
              {story.status}
            </Badge>
          )}
        </div>
      </header>

      {/* Saga style reference */}
      <StyleReferenceBlock text={sagaStyle} />

      {/* Overview: progress + stats grid */}
      <section aria-label="Overview" className="space-y-4">
        <ProgressBar
          current={ready}
          total={total}
          label={`${ready}/${total} hook con immagine composta`}
          size="lg"
        />
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          <StatsCard
            value={`${stats.chars_with_imgs}/${stats.chars_distinct}`}
            label="Personaggi con img"
          />
          <StatsCard
            value={`${stats.locs_with_prompt}/${stats.locs_distinct}`}
            label="Luoghi con prompt"
          />
          <StatsCard
            value={`${stats.locs_with_imgs}/${stats.locs_distinct}`}
            label="Luoghi con img"
          />
          <StatsCard
            value={String(stats.objs_distinct)}
            label="Oggetti in scena"
          />
        </div>
      </section>

      {/* Annotations banner */}
      <AnnotationsBanner
        present={story.annotations_present}
        path={story.annotations_path}
        githubUrl={story.annotations_github_url}
      />

      {/* Hook accordion */}
      <section aria-label="Hook visivi" className="space-y-3">
        <h2 className="font-serif text-2xl font-semibold text-ink">
          Hook visivi ({story.hooks.length})
        </h2>
        <HookAccordion
          hooks={story.hooks}
          audited={story.audited_entities}
          sagaStyle={sagaStyle}
        />
      </section>

      {/* Canon todo */}
      <CanonTodoBlock todos={story.canon_additions_todo ?? []} />

      <footer className="border-t border-rule-soft pt-6">
        <Link
          href="/storie"
          className="inline-flex items-center gap-1.5 font-mono text-[11px] uppercase tracking-wider text-ink-faint hover:text-accent"
        >
          <ArrowLeft className="h-3 w-3" aria-hidden />
          tutte le storie
        </Link>
      </footer>
    </main>
  );
}
