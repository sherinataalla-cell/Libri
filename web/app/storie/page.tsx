// Index dashboard "Storie del libro" — cards per ciclo con progress bar
// hooks_image_ready/hooks_total + mini-stats inline.
// Server Component, dati da `lib/storie-dashboard.ts`.

import type { Metadata } from "next";
import Link from "next/link";
import {
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  AlertTriangle,
  LayoutDashboard,
} from "lucide-react";

import { getAllStorieDashboard } from "@/lib/storie-dashboard";
import { CYCLE_LABEL } from "@/lib/types-storie";
import { Badge } from "@/components/ui/badge";
import { ProgressBar } from "@/components/storie-dashboard/progress-bar";

export const metadata: Metadata = {
  title: "Storie del libro — dashboard illustrazioni",
  description:
    "Stato di avanzamento delle 12 storie illustrate: hook composti, personaggi e luoghi con immagini canoniche, annotazioni manuali.",
};

export default async function StorieIndexPage() {
  const storie = await getAllStorieDashboard();

  // Raggruppa per ciclo (A/B/C/D), conservando ordine sNN.
  const byCycle = new Map<string, typeof storie>();
  for (const s of storie) {
    const cycle = s.cycle || "?";
    if (!byCycle.has(cycle)) byCycle.set(cycle, []);
    byCycle.get(cycle)!.push(s);
  }
  const cycleOrder = ["A", "B", "C", "D"].filter((c) => byCycle.has(c));
  for (const c of byCycle.keys()) if (!cycleOrder.includes(c)) cycleOrder.push(c);

  // Aggregato saga.
  const totHooks = storie.reduce((acc, s) => acc + (s.stats?.hooks_total ?? 0), 0);
  const totReady = storie.reduce(
    (acc, s) => acc + (s.stats?.hooks_image_ready ?? 0),
    0,
  );

  return (
    <main className="mx-auto max-w-6xl px-6 py-10 space-y-10">
      <header className="space-y-3 border-b border-rule-soft pb-6">
        <Link
          href="/"
          className="inline-flex items-center gap-1.5 font-mono text-[11px] uppercase tracking-wider text-ink-faint hover:text-accent"
        >
          <ArrowLeft className="h-3 w-3" aria-hidden />
          Home cruscotto
        </Link>
        <div className="flex items-center gap-2 text-accent-warm">
          <LayoutDashboard className="h-5 w-5" aria-hidden />
          <span className="font-mono text-xs uppercase tracking-wider">
            Storie del libro · dashboard illustrazioni
          </span>
        </div>
        <h1 className="font-serif text-4xl font-semibold tracking-tight text-ink">
          Le 12 storie della saga
        </h1>
        <p className="max-w-2xl font-serif text-lg italic text-ink-soft">
          Stato di avanzamento per la composizione finale (testo + illustrazione).
          {storie.length} storie · {totReady}/{totHooks} hook con immagine
          composta.
        </p>
        <ProgressBar
          current={totReady}
          total={totHooks}
          label="hook saga composti"
          size="lg"
          className="max-w-xl pt-1"
        />
      </header>

      {cycleOrder.map((cycle) => (
        <section key={cycle} aria-label={`Ciclo ${cycle}`} className="space-y-4">
          <h2 className="font-serif text-2xl font-semibold text-ink">
            {CYCLE_LABEL[cycle] ?? `Ciclo ${cycle}`}
          </h2>
          <ul className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {byCycle.get(cycle)!.map((s) => {
              const stats = s.stats;
              const ready = stats.hooks_image_ready ?? 0;
              const total = stats.hooks_total ?? 10;
              return (
                <li key={s.sid}>
                  <Link
                    href={`/storie/${s.sid}`}
                    className="group block h-full rounded-lg border border-rule-soft bg-paper-soft p-4 transition-colors hover:border-accent/40"
                  >
                    <div className="flex items-center justify-between gap-2">
                      <span className="font-mono text-[10px] uppercase tracking-wider text-ink-faint">
                        {s.sid.toUpperCase()}
                      </span>
                      <Badge variant="secondary" className="font-mono">
                        Ciclo {s.cycle || "?"}
                      </Badge>
                    </div>
                    <h3 className="mt-2 font-serif text-lg font-semibold leading-snug text-ink group-hover:text-accent">
                      {s.title}
                    </h3>
                    <div className="mt-3">
                      <ProgressBar
                        current={ready}
                        total={total}
                        label={`${ready}/${total} hook composti`}
                        size="sm"
                      />
                    </div>
                    <dl className="mt-3 grid grid-cols-3 gap-2 text-center font-mono text-[11px] text-ink-soft">
                      <div
                        title="Personaggi con immagini canoniche"
                        className="rounded-md bg-paper px-1 py-1.5"
                      >
                        <dt className="text-ink-faint">char img</dt>
                        <dd>
                          {stats.chars_with_imgs}/{stats.chars_distinct}
                        </dd>
                      </div>
                      <div
                        title="Luoghi con prompt grok"
                        className="rounded-md bg-paper px-1 py-1.5"
                      >
                        <dt className="text-ink-faint">loc prompt</dt>
                        <dd>
                          {stats.locs_with_prompt}/{stats.locs_distinct}
                        </dd>
                      </div>
                      <div
                        title={
                          s.annotations_present
                            ? "Annotazioni manuali presenti"
                            : "Annotazioni mancanti (NER auto)"
                        }
                        className="flex items-center justify-center gap-1 rounded-md bg-paper px-1 py-1.5"
                      >
                        {s.annotations_present ? (
                          <>
                            <CheckCircle2
                              className="h-3.5 w-3.5 text-accent"
                              aria-hidden
                            />
                            <span className="text-accent">ann</span>
                          </>
                        ) : (
                          <>
                            <AlertTriangle
                              className="h-3.5 w-3.5 text-accent-warm"
                              aria-hidden
                            />
                            <span className="text-accent-warm">auto</span>
                          </>
                        )}
                      </div>
                    </dl>
                    <div className="mt-3 inline-flex items-center gap-1 font-mono text-[11px] text-ink-faint group-hover:text-accent">
                      apri dashboard{" "}
                      <ArrowRight className="h-3 w-3" aria-hidden />
                    </div>
                  </Link>
                </li>
              );
            })}
          </ul>
        </section>
      ))}
    </main>
  );
}
