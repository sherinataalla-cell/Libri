// Singolo hook visivo come <details> espandibile.
// Server component: <details>/<summary> nativi gestiscono lo stato senza JS.
// Summary: P{n} · hook_id · location.id · status badges (loc dot, X/Y chars,
//   N sub, img ✓/TBD).
// Body: luogo, personaggi in scena, cammei offscreen, oggetti, note canoniche,
//   sotto-hook (con bottone copia prompt scena), testo (estratto).

import { ChevronRight } from "lucide-react";

import { cn } from "@/lib/utils";
import type {
  AuditedEntities,
  DashboardHook,
  HookLocation,
  SubhookAnnotated,
} from "@/lib/types-storie-dashboard";
import { EntityRow } from "@/components/storie-dashboard/entity-row";
import { CopyButton } from "@/components/storie-dashboard/copy-button";

interface HookItemProps {
  hook: DashboardHook;
  audited: AuditedEntities;
  /** Reference stile saga: appeso al prompt copiabile per ogni subhook. */
  sagaStyle: string;
}

export function HookItem({ hook, audited, sagaStyle }: HookItemProps) {
  const loc = hook.location ?? { id: "", variant: "" };
  const charsInScene = hook.characters_in_scene ?? [];
  const charsOff = hook.characters_offscreen_or_distant ?? [];
  const objsInScene = hook.objects_in_scene ?? [];
  const details = hook.canonical_details ?? [];
  const subhooksAnn = hook.subhooks_annotated ?? [];
  const text = hook.text_preview ?? hook.text_full ?? "";

  // Status summary
  const charsTotal = charsInScene.length + charsOff.length;
  const charsReady = charsInScene.filter(
    (cid) => (audited.personaggi[cid]?.n_images ?? 0) > 0,
  ).length;
  const locAud = loc.id ? audited.luoghi[loc.id] : undefined;
  const locDot: "ok" | "warn" | "missing" = !loc.id
    ? "missing"
    : (locAud?.n_images ?? 0) > 0
      ? "ok"
      : locAud?.prompt_grok
        ? "warn"
        : "missing";
  const imgReady = !!hook.image && hook.image !== "TBD";

  // Prompt-livello hook (usato quando NON ci sono subhook annotati).
  const hookLevelPrompt = !subhooksAnn.length
    ? buildHookPrompt({
        sceneNote: "",
        location: loc,
        charsInScene,
        charsOff,
        objsInScene,
        canonicalDetails: details,
        sagaStyle,
        hookId: hook.hook_id,
      })
    : "";

  return (
    <details className="group rounded-md border border-rule-soft bg-paper open:bg-paper-soft">
      <summary
        className="flex cursor-pointer list-none flex-wrap items-center gap-x-3 gap-y-1 px-3 py-2.5 text-ink hover:bg-paper-soft"
      >
        <ChevronRight
          className="h-4 w-4 shrink-0 text-ink-faint transition-transform group-open:rotate-90"
          aria-hidden
        />
        <span className="inline-flex h-6 w-10 shrink-0 items-center justify-center rounded-full bg-rule-soft font-mono text-xs text-ink">
          P{hook.page}
        </span>
        <code className="font-mono text-xs text-ink-soft">{hook.hook_id}</code>
        <span className="font-mono text-sm text-ink">
          {loc.id ? (
            <>
              {loc.id}
              {loc.variant ? (
                <em className="font-serif text-ink-faint">
                  {" "}
                  ({loc.variant})
                </em>
              ) : null}
            </>
          ) : (
            <em className="font-serif italic text-accent-warm">no loc</em>
          )}
        </span>
        <span className="ml-auto flex flex-wrap items-center gap-1.5">
          <Dot tone={locDot} title={`luogo: ${locDot}`} />
          <span
            className="font-mono text-[10px] uppercase tracking-wider text-ink-faint"
            title="personaggi pronti / personaggi totali"
          >
            <span className="text-ink-soft">{charsReady}</span>/{charsTotal}{" "}
            char
          </span>
          {subhooksAnn.length > 0 && (
            <span className="rounded-full bg-rule-soft px-1.5 py-0.5 font-mono text-[10px] uppercase tracking-wider text-ink-soft">
              {subhooksAnn.length} sub
            </span>
          )}
          <ImgStatusBadge ready={imgReady} />
        </span>
      </summary>

      <div className="space-y-4 border-t border-rule-soft px-4 py-4">
        {/* Luogo */}
        <Section title="Luogo (dove succede la scena)" emoji="📍">
          {loc.id ? (
            <EntityRow
              id={loc.id}
              kind="luogo"
              audit={audited.luoghi[loc.id]}
              variantNote={loc.variant}
            />
          ) : (
            <Empty>Location non specificata nelle annotazioni.</Empty>
          )}
        </Section>

        {/* Personaggi in scena */}
        <Section
          title={`Personaggi in scena (${charsInScene.length})`}
          emoji="👤"
        >
          {charsInScene.length > 0 ? (
            <div className="space-y-2">
              {charsInScene.map((cid) => (
                <EntityRow
                  key={cid}
                  id={cid}
                  kind="personaggio"
                  audit={audited.personaggi[cid]}
                />
              ))}
            </div>
          ) : (
            <Empty>nessun personaggio in scena</Empty>
          )}

          {charsOff.length > 0 && (
            <div className="mt-3 rounded-md border border-rule-soft bg-paper-soft/40 p-3">
              <h5 className="mb-2 font-mono text-[11px] uppercase tracking-wider text-ink-soft">
                Cammei / sagome / sonori
              </h5>
              <div className="space-y-2">
                {charsOff.map((cid) => (
                  <EntityRow
                    key={cid}
                    id={cid}
                    kind="personaggio"
                    audit={audited.personaggi[cid]}
                    isOffscreen
                  />
                ))}
              </div>
            </div>
          )}
        </Section>

        {/* Oggetti */}
        {objsInScene.length > 0 && (
          <Section
            title={`Oggetti in scena (${objsInScene.length})`}
            emoji="📦"
          >
            <div className="space-y-2">
              {objsInScene.map((oid) => (
                <EntityRow
                  key={oid}
                  id={oid}
                  kind="oggetto"
                  audit={audited.oggetti[oid]}
                />
              ))}
            </div>
          </Section>
        )}

        {/* Note canoniche */}
        {details.length > 0 && (
          <Section title="Note canoniche" emoji="📌">
            <ul className="list-disc space-y-1 pl-5 font-serif text-sm text-ink-soft">
              {details.map((d, i) => (
                <li key={`${i}-${d.slice(0, 12)}`}>{d}</li>
              ))}
            </ul>
          </Section>
        )}

        {/* Sotto-hook con prompt copiabile */}
        {subhooksAnn.length > 0 && (
          <Section
            title={`Sotto-hook (${subhooksAnn.length}) — pagine libro fisiche · prompt scena copiabili`}
            emoji="🎨"
          >
            <ul className="space-y-3">
              {subhooksAnn.map((sh) => (
                <SubhookCard
                  key={sh.id}
                  sub={sh}
                  hookId={hook.hook_id}
                  location={loc}
                  charsInScene={charsInScene}
                  charsOff={charsOff}
                  objsInScene={objsInScene}
                  canonicalDetails={details}
                  sagaStyle={sagaStyle}
                />
              ))}
            </ul>
          </Section>
        )}

        {/* Prompt-livello hook (solo se NON ci sono subhook annotati) */}
        {!subhooksAnn.length && (
          <Section title="Prompt scena (livello hook)" emoji="🎨">
            {loc.id || charsInScene.length > 0 || details.length > 0 ? (
              <div className="space-y-2 rounded-md border border-rule-soft bg-paper px-3 py-3">
                <pre className="max-h-60 overflow-auto whitespace-pre-wrap rounded bg-paper-soft p-2 font-mono text-[11px] leading-relaxed text-ink-soft">
                  {hookLevelPrompt}
                </pre>
                <div className="flex justify-end">
                  <CopyButton
                    text={hookLevelPrompt}
                    label="Copia prompt scena"
                  />
                </div>
              </div>
            ) : (
              <Empty>
                Annotazioni mancanti per questo hook. Aggiungi
                location/personaggi/dettagli in{" "}
                <code className="text-ink">_annotations/sNN.yaml</code> per
                generare il prompt.
              </Empty>
            )}
          </Section>
        )}

        {/* Testo */}
        {text && (
          <Section title="Testo (estratto)">
            <p className="whitespace-pre-line font-serif text-sm leading-relaxed text-ink">
              {text}
            </p>
          </Section>
        )}
      </div>
    </details>
  );
}

/* ----------------------------------------------------------------- */

interface SubhookCardProps {
  sub: SubhookAnnotated;
  hookId: string;
  location: HookLocation;
  charsInScene: string[];
  charsOff: string[];
  objsInScene: string[];
  canonicalDetails: string[];
  sagaStyle: string;
}

function SubhookCard({
  sub,
  hookId,
  location,
  charsInScene,
  charsOff,
  objsInScene,
  canonicalDetails,
  sagaStyle,
}: SubhookCardProps) {
  const ready =
    !!sub.image_status &&
    sub.image_status !== "TBD" &&
    !sub.image_status.toLowerCase().startsWith("tbd");
  const note = sub.note ?? "";
  const hasNote = note.trim().length > 0;

  const prompt = buildHookPrompt({
    sceneNote: note,
    location,
    charsInScene,
    charsOff,
    objsInScene,
    canonicalDetails,
    sagaStyle,
    hookId,
    subhookId: sub.id,
    pageBook: sub.page_book,
  });

  return (
    <li className="rounded-md border border-rule-soft bg-paper">
      <div className="flex flex-wrap items-center gap-x-3 gap-y-1 border-b border-rule-soft px-3 py-2">
        <code className="font-mono text-xs text-ink">{sub.id}</code>
        <span className="font-mono text-[11px] text-ink-faint">
          pag. libro {String(sub.page_book)}
        </span>
        <ImgStatusBadge ready={ready} />
        <span className="ml-auto">
          <CopyButton text={prompt} label="Copia prompt scena" />
        </span>
      </div>
      {hasNote ? (
        <div className="space-y-2 px-3 py-3">
          <p className="font-serif text-sm italic text-ink-soft">
            <span className="mr-1 font-mono text-[10px] uppercase tracking-wider text-ink-faint">
              scena:
            </span>
            {note}
          </p>
          <details className="rounded border border-rule-soft bg-paper-soft">
            <summary className="cursor-pointer px-2 py-1.5 font-mono text-[10px] uppercase tracking-wider text-ink-faint hover:text-accent">
              Anteprima prompt completo
            </summary>
            <pre className="max-h-60 overflow-auto whitespace-pre-wrap border-t border-rule-soft bg-paper-soft px-2 py-2 font-mono text-[11px] leading-relaxed text-ink-soft">
              {prompt}
            </pre>
          </details>
        </div>
      ) : (
        <p className="px-3 py-3 font-serif text-sm italic text-ink-faint">
          Nota scena ancora non scritta nelle annotazioni. Il prompt copiabile
          contiene comunque cast/location/canonical_details + style saga.
        </p>
      )}
    </li>
  );
}

/* ----------------------------------------------------------------- */

interface BuildPromptArgs {
  sceneNote: string;
  location: HookLocation;
  charsInScene: string[];
  charsOff: string[];
  objsInScene: string[];
  canonicalDetails: string[];
  sagaStyle: string;
  hookId?: string;
  subhookId?: string;
  pageBook?: number | string;
}

/**
 * Costruisce un prompt grok-pronto per illustrazione di una scena.
 * Concatena: scene note + cast/location/oggetti/dettagli canonici + style ref.
 */
function buildHookPrompt({
  sceneNote,
  location,
  charsInScene,
  charsOff,
  objsInScene,
  canonicalDetails,
  sagaStyle,
  hookId,
  subhookId,
  pageBook,
}: BuildPromptArgs): string {
  const lines: string[] = [];

  if (subhookId) {
    lines.push(
      `# Prompt scena ${subhookId} — pagina libro ${String(pageBook ?? "?")}`,
    );
  } else if (hookId) {
    lines.push(`# Prompt scena ${hookId}`);
  }
  lines.push("");

  if (sceneNote.trim()) {
    lines.push("## Scena (descrizione)");
    lines.push(sceneNote.trim());
    lines.push("");
  }

  if (location.id) {
    lines.push("## Location");
    lines.push(
      `- ${location.id}${location.variant ? ` (variante: ${location.variant})` : ""}`,
    );
    lines.push("");
  }

  if (charsInScene.length > 0) {
    lines.push("## Personaggi in scena");
    for (const c of charsInScene) lines.push(`- ${c}`);
    lines.push("");
  }

  if (charsOff.length > 0) {
    lines.push("## Cammei / sagome / sonori (offscreen o distanti)");
    for (const c of charsOff) lines.push(`- ${c}`);
    lines.push("");
  }

  if (objsInScene.length > 0) {
    lines.push("## Oggetti canonici visibili");
    for (const o of objsInScene) lines.push(`- ${o}`);
    lines.push("");
  }

  if (canonicalDetails.length > 0) {
    lines.push("## Dettagli canonici (vincoli)");
    for (const d of canonicalDetails) lines.push(`- ${d}`);
    lines.push("");
  }

  if (sagaStyle.trim()) {
    lines.push("## Style reference saga");
    lines.push(sagaStyle.trim());
  }

  return lines.join("\n").trim();
}

/* ----------------------------------------------------------------- */

function Section({
  title,
  emoji,
  children,
}: {
  title: string;
  emoji?: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <h4 className="mb-2 font-mono text-[11px] uppercase tracking-wider text-ink-soft">
        {emoji && <span className="mr-1">{emoji}</span>}
        {title}
      </h4>
      {children}
    </div>
  );
}

function Empty({ children }: { children: React.ReactNode }) {
  return (
    <p className="font-serif text-sm italic text-ink-faint">{children}</p>
  );
}

function Dot({
  tone,
  title,
}: {
  tone: "ok" | "warn" | "missing";
  title: string;
}) {
  return (
    <span
      title={title}
      aria-hidden
      className={cn(
        "inline-block h-2.5 w-2.5 rounded-full",
        tone === "ok" && "bg-accent",
        tone === "warn" && "bg-accent-warm",
        tone === "missing" && "bg-rule",
      )}
    />
  );
}

function ImgStatusBadge({ ready }: { ready: boolean }) {
  return (
    <span
      className={cn(
        "rounded-full px-1.5 py-0.5 font-mono text-[10px] uppercase tracking-wider",
        ready ? "bg-accent/15 text-accent" : "bg-rule-soft text-ink-soft",
      )}
    >
      {ready ? "img ✓" : "img TBD"}
    </span>
  );
}
