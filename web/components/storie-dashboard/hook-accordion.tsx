// Lista degli hook visivi (10 per storia) come accordion native (<details>).
// Server component: non serve state interno, gli <details> nativi gestiscono
// l'espansione senza JS. Mantiene l'API "accordion" per coerenza con il brief.

import type {
  AuditedEntities,
  DashboardHook,
} from "@/lib/types-storie-dashboard";
import { HookItem } from "@/components/storie-dashboard/hook-item";

interface HookAccordionProps {
  hooks: DashboardHook[];
  audited: AuditedEntities;
  /** Reference stile saga: passato a ogni HookItem per costruire il prompt. */
  sagaStyle: string;
}

export function HookAccordion({
  hooks,
  audited,
  sagaStyle,
}: HookAccordionProps) {
  if (hooks.length === 0) {
    return (
      <p className="font-serif italic text-ink-faint">
        Nessun hook visivo per questa storia.
      </p>
    );
  }
  return (
    <div className="space-y-2">
      {hooks.map((h) => (
        <HookItem
          key={h.hook_id}
          hook={h}
          audited={audited}
          sagaStyle={sagaStyle}
        />
      ))}
    </div>
  );
}
