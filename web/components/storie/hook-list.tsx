// Mini-indice degli hook narrativi (1..10) di una storia.
// Server Component: anchor verso la prima pagina libro associata.

import type { Story } from "@/lib/types-storie";

interface HookListProps {
  story: Story;
}

export function HookList({ story }: HookListProps) {
  // Per ogni hook, prima pagina libro associata (per anchor).
  const firstPageByHook = new Map<string, string>();
  for (const p of story.pages) {
    if (!firstPageByHook.has(p.hookId)) {
      firstPageByHook.set(p.hookId, p.subhookId ?? p.hookId);
    }
  }

  return (
    <section
      aria-label="Tappe narrative"
      className="rounded-md border border-rule-soft bg-paper-soft p-4"
    >
      <h2 className="font-mono text-xs uppercase tracking-wider text-ink-soft mb-2">
        Tappe narrative ({story.hooks.length})
      </h2>
      <ol className="grid grid-cols-2 gap-x-4 gap-y-1 sm:grid-cols-5">
        {story.hooks.map((h) => {
          const anchor = firstPageByHook.get(h.id);
          const href = anchor ? `#page-${anchor}` : `#${h.id}`;
          return (
            <li key={h.id}>
              <a
                href={href}
                className="block font-mono text-xs text-ink-soft hover:text-accent"
                title={h.id}
              >
                <span className="text-ink-faint">{h.page}.</span>{" "}
                <span>{h.id}</span>
              </a>
            </li>
          );
        })}
      </ol>
    </section>
  );
}
