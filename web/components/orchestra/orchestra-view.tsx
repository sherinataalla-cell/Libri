"use client";

// Contenitore client dell'atlante saga.
// - State: selezione corrente + hover storia.
// - Deep linking: hash routes (#/story/s05, #/character/elias, …).
// - Responsive: layout grid con side-panel sticky desktop ≥800px;
//   mobile usa bottom-sheet (shadcn `Sheet`) quando c'è una selezione.

import * as React from "react";

import type {
  OrchestraData,
  OrchestraSelection,
  OrchestraSelectionKind,
} from "@/lib/types-orchestra";
import { SELECTION_HASH_PREFIX } from "@/lib/types-orchestra";
import { Atlas } from "@/components/orchestra/atlas";
import { OrchestraLegend } from "@/components/orchestra/legend";
import { SidePanel } from "@/components/orchestra/side-panel";
import {
  Sheet,
  SheetContent,
  SheetTitle,
  SheetDescription,
} from "@/components/ui/sheet";

interface OrchestraViewProps {
  data: OrchestraData;
}

function parseHash(hash: string): OrchestraSelection | null {
  if (!hash || hash === "#" || hash === "") return null;
  const clean = hash.replace(/^#\/?/, "");
  const slashIdx = clean.indexOf("/");
  if (slashIdx <= 0) return null;
  const kind = clean.slice(0, slashIdx) as OrchestraSelectionKind;
  const id = clean.slice(slashIdx + 1);
  if (!id) return null;
  if (kind !== "story" && kind !== "character" && kind !== "location" && kind !== "seed") return null;
  return { kind, id };
}

function buildHash(sel: OrchestraSelection | null): string {
  if (!sel) return "#";
  return `${SELECTION_HASH_PREFIX[sel.kind]}${sel.id}`;
}

export function OrchestraView({ data }: OrchestraViewProps) {
  const [selection, setSelectionState] =
    React.useState<OrchestraSelection | null>(null);
  const [hoverStory, setHoverStory] = React.useState<string | null>(null);

  const [isMobile, setIsMobile] = React.useState(false);
  React.useEffect(() => {
    const mq = window.matchMedia("(max-width: 799px)");
    const update = () => setIsMobile(mq.matches);
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, []);

  const writingHashRef = React.useRef(false);

  React.useEffect(() => {
    const syncFromHash = () => {
      if (writingHashRef.current) {
        writingHashRef.current = false;
        return;
      }
      const sel = parseHash(window.location.hash);
      setSelectionState(sel);
    };
    syncFromHash();
    window.addEventListener("hashchange", syncFromHash);
    return () => window.removeEventListener("hashchange", syncFromHash);
  }, []);

  const setSelection = React.useCallback((sel: OrchestraSelection | null) => {
    setSelectionState(sel);
    const desired = buildHash(sel);
    const current = window.location.hash || "#";
    if (current !== desired) {
      writingHashRef.current = true;
      const url = `${window.location.pathname}${window.location.search}${desired}`;
      window.history.replaceState(null, "", url);
    }
  }, []);

  const onSelect = React.useCallback((sel: OrchestraSelection) => {
    if (selection && selection.kind === sel.kind && selection.id === sel.id) {
      setSelection(null);
    } else {
      setSelection(sel);
    }
  }, [selection, setSelection]);

  return (
    <div className="space-y-4">
      <div className="grid gap-4 lg:grid-cols-[1fr_380px]">
        <div className="space-y-3 min-w-0">
          <Atlas
            stories={data.stories}
            characters={data.characters}
            locations={data.locations}
            seeds={data.seeds}
            selection={selection}
            hoverStory={hoverStory}
            onSelect={setSelection}
            onHoverStory={setHoverStory}
          />
          <OrchestraLegend />

          <div className="rounded-lg border border-dashed border-rule-soft bg-paper-soft/30 p-4">
            <p className="font-mono text-[10px] uppercase tracking-wider text-ink-faint">
              Step 4.2
            </p>
            <p className="text-ink-soft text-sm italic">
              Chat orchestratrice in arrivo. Per ora l&apos;atlante è read-only:
              la selezione si propaga via deep link nell&apos;URL (hash), così
              è condivisibile.
            </p>
          </div>
        </div>

        <div className="hidden lg:block">
          <div className="sticky top-4">
            <SidePanel
              selection={selection}
              stories={data.stories}
              characters={data.characters}
              locations={data.locations}
              seeds={data.seeds}
              onSelect={setSelection}
              closable
            />
          </div>
        </div>
      </div>

      <Sheet
        open={isMobile && selection !== null}
        onOpenChange={(open) => { if (!open) setSelection(null); }}
      >
        <SheetContent
          side="bottom"
          className="max-h-[85vh] overflow-y-auto rounded-t-lg p-5"
        >
          <SheetTitle className="sr-only">Dettaglio nodo</SheetTitle>
          <SheetDescription className="sr-only">
            Dettaglio del nodo selezionato nell&apos;atlante saga.
          </SheetDescription>
          <SidePanel
            selection={selection}
            stories={data.stories}
            characters={data.characters}
            locations={data.locations}
            seeds={data.seeds}
            onSelect={setSelection}
          />
        </SheetContent>
      </Sheet>
    </div>
  );
}
