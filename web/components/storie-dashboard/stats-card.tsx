// Card stat compatta: numero grande + label sotto.
// Server component (puro stile).

import { cn } from "@/lib/utils";

interface StatsCardProps {
  /** Stringa già formattata (es. "4/6", "12"). */
  value: string;
  label: string;
  className?: string;
}

export function StatsCard({ value, label, className }: StatsCardProps) {
  return (
    <div
      className={cn(
        "rounded-md border border-rule-soft bg-paper-soft p-4 text-center",
        className,
      )}
    >
      <div className="font-serif text-3xl font-semibold text-ink leading-none">
        {value}
      </div>
      <div className="mt-2 font-mono text-[11px] uppercase tracking-wider text-ink-faint">
        {label}
      </div>
    </div>
  );
}
