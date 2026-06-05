// Barra di progresso saga (server component, no JS).
// Usata sia inline nelle card index (size="sm") sia grande nell'overview ([sid]).

import { cn } from "@/lib/utils";

interface ProgressBarProps {
  /** Numerico: passi completati. */
  current: number;
  /** Numerico: passi totali (>0). Se 0, mostra una barra vuota a 0%. */
  total: number;
  /** Etichetta testuale opzionale sotto/accanto alla barra. */
  label?: string;
  /** Variante taglia. `lg` per overview pagina dettaglio. */
  size?: "sm" | "lg";
  className?: string;
}

export function ProgressBar({
  current,
  total,
  label,
  size = "sm",
  className,
}: ProgressBarProps) {
  const safeTotal = total > 0 ? total : 0;
  const pct =
    safeTotal > 0 ? Math.round((current / safeTotal) * 100) : 0;
  const widthStyle = { width: `${Math.min(100, Math.max(0, pct))}%` };

  return (
    <div className={cn("space-y-1.5", className)}>
      <div
        role="progressbar"
        aria-valuenow={current}
        aria-valuemin={0}
        aria-valuemax={safeTotal || 1}
        aria-label={label ?? `${current} su ${safeTotal}`}
        className={cn(
          "w-full overflow-hidden rounded-full bg-rule-soft",
          size === "lg" ? "h-3" : "h-1.5",
        )}
      >
        <div
          className="h-full rounded-full bg-accent transition-[width] duration-300 ease-out"
          style={widthStyle}
        />
      </div>
      {label && (
        <p
          className={cn(
            "font-mono text-ink-faint",
            size === "lg" ? "text-sm" : "text-[11px]",
          )}
        >
          {label} <span className="text-ink-soft">({pct}%)</span>
        </p>
      )}
    </div>
  );
}
