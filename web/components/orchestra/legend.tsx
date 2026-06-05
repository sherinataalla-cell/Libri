// Legenda compatta sotto l'atlante.
// Server component: pura presentazione.

import { LOCATION_TYPE_LABEL, SEASON_LABEL } from "@/lib/types-orchestra";

export function OrchestraLegend() {
  return (
    <section className="rounded-lg border border-rule-soft bg-paper-soft/60 p-4 space-y-4 text-xs">
      <div className="flex flex-wrap gap-x-6 gap-y-3">
        <LegendGroup title="Stagioni">
          <SeasonSwatch season="inverno" />
          <SeasonSwatch season="primavera" />
          <SeasonSwatch season="estate" />
          <SeasonSwatch season="autunno" />
        </LegendGroup>

        <LegendGroup title="Tipi luogo">
          <LocSwatch type="abitato" cssVar="--loc-abitato" />
          <LocSwatch type="alto" cssVar="--loc-alto" />
          <LocSwatch type="costa" cssVar="--loc-costa" />
          <LocSwatch type="acqua" cssVar="--loc-acqua" />
          <LocSwatch type="selvatico" cssVar="--loc-selvatico" />
        </LegendGroup>

        <LegendGroup title="Semi">
          <SeedSwatch label="piantato" cssVar="--seed-planted" />
          <SeedSwatch label="fiorito" cssVar="--seed-bloomed" />
          <SeedArc />
        </LegendGroup>
      </div>

      <div className="border-t border-rule-soft pt-3 font-mono text-[10px] uppercase tracking-wider text-ink-faint">
        Click su una storia, un personaggio, un luogo o un arco-seme per il
        dettaglio. Hover su una storia per evidenziare cast e luogo.
      </div>
    </section>
  );
}

function LegendGroup({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="space-y-1.5">
      <p className="font-mono text-[10px] uppercase tracking-wider text-ink-faint">{title}</p>
      <div className="flex flex-wrap items-center gap-3">{children}</div>
    </div>
  );
}

function SeasonSwatch({ season }: { season: "inverno" | "primavera" | "estate" | "autunno" }) {
  return (
    <span
      className={`season-${season} inline-flex items-center gap-1.5`}
      style={{ ["--season-ink"]: `var(--season-${season}-ink)` } as React.CSSProperties}
    >
      <span
        aria-hidden
        className="inline-block h-3 w-3 rounded-sm border border-rule"
        style={{
          background: `var(--season-${season}-wash)`,
          borderColor: `var(--season-${season}-ink)`,
        }}
      />
      <span className="text-ink-soft">{SEASON_LABEL[season]}</span>
    </span>
  );
}

function LocSwatch({ type, cssVar }: { type: "abitato" | "alto" | "costa" | "acqua" | "selvatico"; cssVar: string }) {
  return (
    <span className="inline-flex items-center gap-1.5">
      <span aria-hidden className="inline-block h-2.5 w-2.5 rounded-full" style={{ background: `var(${cssVar})` }} />
      <span className="text-ink-soft">{LOCATION_TYPE_LABEL[type]}</span>
    </span>
  );
}

function SeedSwatch({ label, cssVar }: { label: string; cssVar: string }) {
  return (
    <span className="inline-flex items-center gap-1.5">
      <span aria-hidden className="inline-block h-2.5 w-2.5 rounded-full" style={{ background: `var(${cssVar})` }} />
      <span className="text-ink-soft">{label}</span>
    </span>
  );
}

function SeedArc() {
  return (
    <span className="inline-flex items-center gap-1.5">
      <svg width="32" height="14" viewBox="0 0 32 14" aria-hidden className="overflow-visible">
        <path d="M 2 12 Q 16 -2 30 12" fill="none" stroke="var(--seed-bloomed)" strokeWidth="1.2" />
        <circle cx="2" cy="12" r="2" fill="var(--seed-planted)" />
        <circle cx="30" cy="12" r="2" fill="var(--seed-bloomed)" />
      </svg>
      <span className="text-ink-soft">arco seme</span>
    </span>
  );
}
