import type { Totals, ByStatus } from "@/lib/types";
import { Card, CardContent } from "@/components/ui/card";

interface StatsGridProps {
  totals: Totals;
  byStatus: ByStatus;
}

const FAMILY_DEFS: Array<{ key: keyof Totals; label: string }> = [
  { key: "personaggio", label: "Personaggi" },
  { key: "luogo", label: "Luoghi" },
  { key: "oggetto", label: "Oggetti" },
  { key: "vento", label: "Venti" },
  { key: "visual_signature", label: "Visual signatures" },
];

export function StatsGrid({ totals, byStatus }: StatsGridProps) {
  return (
    <section
      aria-label="Totali catalogo"
      className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-7"
    >
      <StatBox label="Totale" value={totals.totale} accent />
      {FAMILY_DEFS.map((f) => (
        <StatBox key={f.key} label={f.label} value={totals[f.key]} />
      ))}
      <StatBox label="Canonici" value={byStatus.canonico ?? 0} variant="status" />
    </section>
  );
}

interface StatBoxProps {
  label: string;
  value: number;
  accent?: boolean;
  variant?: "default" | "status";
}

function StatBox({ label, value, accent, variant = "default" }: StatBoxProps) {
  return (
    <Card
      className={
        accent
          ? "border-accent/40 bg-paper-soft"
          : variant === "status"
            ? "border-rule-soft bg-paper-soft"
            : "border-rule-soft"
      }
    >
      <CardContent className="p-4">
        <div
          className={
            "font-serif text-3xl font-semibold leading-none " +
            (accent ? "text-accent" : "text-ink")
          }
        >
          {value}
        </div>
        <div className="mt-1.5 font-mono text-[10px] uppercase tracking-wider text-ink-faint">
          {label}
        </div>
      </CardContent>
    </Card>
  );
}
