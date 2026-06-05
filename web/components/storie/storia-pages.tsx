// Lista pagine libro fisiche per una storia.
// Server Component: render statico. Per ogni pagina: layout 2-col (immagine
// + prosa) o full-width per `double_spread`.

import Image from "next/image";

import type { Story, StoryPage } from "@/lib/types-storie";
import { imageUrl } from "@/lib/image-url";
import { renderInlineHtml } from "@/lib/markdown";
import { Badge } from "@/components/ui/badge";

interface StoriaPagesProps {
  story: Story;
}

export function StoriaPages({ story }: StoriaPagesProps) {
  // Indicizza hook per id → numero hook narrativo (1..10).
  const hookPageById = new Map<string, number>();
  for (const h of story.hooks) hookPageById.set(h.id, h.page);

  return (
    <section aria-label="Pagine libro" className="space-y-8">
      <div className="flex items-center justify-between border-b border-rule-soft pb-2">
        <h2 className="font-serif text-2xl font-semibold text-ink">
          Pagine libro
        </h2>
        <span className="font-mono text-[11px] text-ink-faint">
          {story.pages.length} pagin{story.pages.length === 1 ? "a" : "e"}
        </span>
      </div>
      <ol className="space-y-10">
        {story.pages.map((p, i) => (
          <li key={p.subhookId ?? `${p.hookId}-${i}`} id={`page-${p.subhookId ?? p.hookId}`}>
            <PageBlock
              page={p}
              hookPage={hookPageById.get(p.hookId) ?? null}
            />
          </li>
        ))}
      </ol>
    </section>
  );
}

function PageBlock({
  page,
  hookPage,
}: {
  page: StoryPage;
  hookPage: number | null;
}) {
  const isDoubleSpread = page.layout === "double_spread";
  const imgUrl = page.imagePath ? imageUrl(page.imagePath) : null;

  return (
    <article className="rounded-lg border border-rule-soft bg-paper-soft overflow-hidden">
      <header className="flex flex-wrap items-center gap-2 border-b border-rule-soft px-4 py-2 bg-rule-soft/30">
        <Badge variant="default" className="font-mono">
          Pagina {String(page.pageBook)}
        </Badge>
        <span className="font-mono text-[11px] text-ink-faint">
          hook {hookPage !== null ? hookPage : "?"} ·{" "}
          <code className="text-ink-soft">{page.hookId}</code>
          {page.subhookId && (
            <>
              {" · "}
              <code className="text-ink-soft">{page.subhookId}</code>
            </>
          )}
        </span>
        {isDoubleSpread && (
          <Badge variant="warm" className="ml-auto">
            double spread
          </Badge>
        )}
        {!page.imagePath && (
          <Badge variant="provvisorio" className="ml-auto">
            scena TBD
          </Badge>
        )}
      </header>

      {isDoubleSpread ? (
        <div className="space-y-4 p-4">
          {imgUrl && (
            <div className="relative w-full aspect-[2/1] bg-rule-soft/40 rounded-md overflow-hidden">
              <Image
                src={imgUrl}
                alt={`Scena pagina ${String(page.pageBook)}`}
                fill
                sizes="(max-width: 1024px) 100vw, 1024px"
                className="object-cover"
                loading="lazy"
                unoptimized
              />
            </div>
          )}
          <Prose md={page.prosaMd} />
        </div>
      ) : (
        <div className="grid gap-4 p-4 md:grid-cols-2 md:gap-6">
          <div className="md:order-1">
            {imgUrl ? (
              <div className="relative w-full aspect-[4/5] bg-rule-soft/40 rounded-md overflow-hidden">
                <Image
                  src={imgUrl}
                  alt={`Scena pagina ${String(page.pageBook)}`}
                  fill
                  sizes="(max-width: 768px) 100vw, 50vw"
                  className="object-cover"
                  loading="lazy"
                  unoptimized
                />
              </div>
            ) : (
              <div className="grid place-items-center w-full aspect-[4/5] bg-rule-soft/40 rounded-md font-mono text-xs text-ink-faint">
                immagine-scena non ancora composta
              </div>
            )}
          </div>
          <div className="md:order-2">
            <Prose md={page.prosaMd} />
          </div>
        </div>
      )}
    </article>
  );
}

function Prose({ md }: { md: string }) {
  if (!md.trim()) {
    return (
      <p className="font-serif italic text-ink-faint">(prosa vuota)</p>
    );
  }
  return (
    <div
      className="prose-saga"
      dangerouslySetInnerHTML={{ __html: renderInlineHtml(md) }}
    />
  );
}
