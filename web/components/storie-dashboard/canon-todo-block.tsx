// Blocco "Aggiunte da prosa al canone" — todo collassabile.
// Server component (<details>). Una <li> per voce con marker priorità a sx.

import { ClipboardList } from "lucide-react";

import { cn } from "@/lib/utils";
import type { CanonAddition } from "@/lib/types-storie-dashboard";

interface CanonTodoBlockProps {
  todos: CanonAddition[];
}

const PRIO_LABEL: Record<string, string> = {
  high: "high",
  medium: "med",
  low: "low",
};

export function CanonTodoBlock({ todos }: CanonTodoBlockProps) {
  if (todos.length === 0) return null;
  return (
    <details className="rounded-md border border-rule-soft bg-paper-soft">
      <summary className="flex cursor-pointer list-none items-center gap-2 px-4 py-3 text-ink hover:text-accent">
        <ClipboardList className="h-4 w-4 text-accent-warm" aria-hidden />
        <span className="font-mono text-xs uppercase tracking-wider">
          Aggiunte da prosa al canone ({todos.length})
        </span>
        <span className="font-serif text-sm italic text-ink-faint">
          — todo per Ray
        </span>
      </summary>
      <ul className="space-y-2 border-t border-rule-soft p-4">
        {todos.map((t, i) => {
          const prio = (t.priority ?? "low").toLowerCase();
          const target = t.location
            ? { kind: "luogo", id: t.location }
            : t.object
              ? { kind: "oggetto", id: t.object }
              : t.character
                ? { kind: "personaggio", id: t.character }
                : null;
          return (
            <li
              key={`${i}-${t.note.slice(0, 16)}`}
              className={cn(
                "flex flex-wrap items-start gap-x-3 gap-y-1 rounded-md border-l-4 bg-paper px-3 py-2",
                prio === "high" && "border-l-destructive/70",
                prio === "medium" && "border-l-accent-warm",
                (prio === "low" || !["high", "medium"].includes(prio)) &&
                  "border-l-rule",
              )}
            >
              <span
                className={cn(
                  "shrink-0 rounded-full px-2 py-0.5 font-mono text-[10px] uppercase tracking-wider",
                  prio === "high" && "bg-destructive/15 text-destructive",
                  prio === "medium" && "bg-accent-warm/15 text-accent-warm",
                  (prio === "low" || !["high", "medium"].includes(prio)) &&
                    "bg-rule-soft text-ink-soft",
                )}
              >
                {PRIO_LABEL[prio] ?? prio}
              </span>
              {target && (
                <span className="shrink-0 font-mono text-xs text-ink-soft">
                  {target.kind}: <code className="text-ink">{target.id}</code>
                </span>
              )}
              <span className="basis-full font-serif text-sm text-ink">
                {t.note}
              </span>
            </li>
          );
        })}
      </ul>
    </details>
  );
}
