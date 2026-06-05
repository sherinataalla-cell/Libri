"use client";

// Side-panel dell'atlante saga.
// Mostra il dettaglio del nodo selezionato in 4 varianti:
// StoryPanel | CharacterPanel | LocationPanel | SeedPanel.

import * as React from "react";
import { Sprout, Flower2, MapPin, User2, BookOpen, X } from "lucide-react";

import type {
  OrchestraCharacter,
  OrchestraLocation,
  OrchestraSeed,
  OrchestraSelection,
  OrchestraStory,
} from "@/lib/types-orchestra";
import {
  BLOCK_LABEL,
  CYCLE_LABEL,
  LOCATION_TYPE_LABEL,
  SEASON_LABEL,
} from "@/lib/types-orchestra";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

interface SidePanelProps {
  selection: OrchestraSelection | null;
  stories: OrchestraStory[];
  characters: OrchestraCharacter[];
  locations: OrchestraLocation[];
  seeds: OrchestraSeed[];
  onSelect: (sel: OrchestraSelection | null) => void;
  closable?: boolean;
}

export function SidePanel({
  selection, stories, characters, locations, seeds, onSelect, closable,
}: SidePanelProps) {
  const storyBy = React.useMemo(() => new Map(stories.map((s) => [s.sid, s])), [stories]);
  const charBy = React.useMemo(() => new Map(characters.map((c) => [c.id, c])), [characters]);
  const locBy = React.useMemo(() => new Map(locations.map((l) => [l.id, l])), [locations]);
  const seedBy = React.useMemo(() => new Map(seeds.map((x) => [x.id, x])), [seeds]);

  let body: React.ReactNode;
  if (!selection) {
    body = <EmptyHint />;
  } else if (selection.kind === "story") {
    const s = storyBy.get(selection.id);
    body = s ? <StoryPanel story={s} characters={characters} locations={locations} seeds={seeds} onSelect={onSelect} /> : <NotFound id={selection.id} />;
  } else if (selection.kind === "character") {
    const c = charBy.get(selection.id);
    body = c ? <CharacterPanel character={c} stories={stories} onSelect={onSelect} /> : <NotFound id={selection.id} />;
  } else if (selection.kind === "location") {
    const l = locBy.get(selection.id);
    body = l ? <LocationPanel location={l} stories={stories} onSelect={onSelect} /> : <NotFound id={selection.id} />;
  } else if (selection.kind === "seed") {
    const seed = seedBy.get(selection.id);
    body = seed ? <SeedPanel seed={seed} onSelect={onSelect} /> : <NotFound id={selection.id} />;
  }

  return (
    <aside className="rounded-lg border border-rule-soft bg-paper-soft/60 p-5 space-y-4 text-sm">
      {closable && selection && (
        <div className="flex justify-end -mb-2">
          <button type="button" onClick={() => onSelect(null)}
            className="inline-flex items-center gap-1 rounded-md p-1 text-ink-faint hover:bg-rule-soft hover:text-ink"
            aria-label="Chiudi pannello">
            <X className="h-4 w-4" aria-hidden />
          </button>
        </div>
      )}
      {body}
    </aside>
  );
}

function EmptyHint() {
  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2 text-accent-warm">
        <BookOpen className="h-4 w-4" aria-hidden />
        <span className="font-mono text-[10px] uppercase tracking-wider">Atlante saga</span>
      </div>
      <h2 className="font-serif text-xl font-semibold text-ink">Esplora la saga</h2>
      <p className="text-ink-soft leading-relaxed">
        L&apos;atlante mostra le 12 storie sull&apos;asse temporale, con sotto le tracce di personaggi e luoghi.
        Ogni arco curvo rappresenta un seme: parte dalla storia in cui è stato piantato, atterra nelle storie in cui fiorisce.
      </p>
      <ul className="space-y-2 text-ink-soft">
        <li><strong className="text-ink">Click</strong> su una storia, un personaggio, un luogo o un arco-seme per il dettaglio.</li>
        <li><strong className="text-ink">Hover</strong> su una storia: il cast e il luogo principale si evidenziano.</li>
        <li><strong className="text-ink">Deep link</strong>: l&apos;URL aggiorna l&apos;hash (<code className="font-mono text-xs">#/story/s05</code>, <code className="font-mono text-xs">#/seed/&lt;id&gt;</code>, ecc.).</li>
      </ul>
    </div>
  );
}

function NotFound({ id }: { id: string }) {
  return (
    <div className="space-y-2">
      <p className="font-mono text-xs uppercase tracking-wider text-ink-faint">Non trovato</p>
      <p className="text-ink-soft">Nessun nodo con id <code className="font-mono">{id}</code>.</p>
    </div>
  );
}

function StoryPanel({
  story, characters, locations, seeds, onSelect,
}: {
  story: OrchestraStory; characters: OrchestraCharacter[]; locations: OrchestraLocation[];
  seeds: OrchestraSeed[]; onSelect: (sel: OrchestraSelection | null) => void;
}) {
  const loc = locations.find((l) => l.id === story.location_id);
  const chars = story.character_ids.map((cid) => characters.find((c) => c.id === cid)).filter((c): c is OrchestraCharacter => Boolean(c));
  const planted = seeds.filter((s) => s.planted === story.sid);
  const bloomedHere = seeds.filter((s) => s.bloom_targets.includes(story.sid));

  return (
    <div className={cn(story.season ? `season-${story.season}` : "", "space-y-4")}>
      <div className="space-y-2">
        <div className="flex items-center gap-2">
          <Badge variant="default" className="font-mono">{story.sid}</Badge>
          {story.season && (
            <Badge variant="outline" className="font-mono"
              style={{ color: `var(--season-${story.season}-ink)`, borderColor: `var(--season-${story.season}-ink)`, background: `var(--season-${story.season}-wash)` }}>
              {SEASON_LABEL[story.season]}
            </Badge>
          )}
          {story.cycle && <Badge variant="secondary" className="font-mono">{CYCLE_LABEL[story.cycle]}</Badge>}
          {story.block && <Badge variant="outline" className="font-mono">{BLOCK_LABEL[story.block]}</Badge>}
        </div>
        <h2 className="font-serif text-xl font-semibold text-ink leading-tight">{story.title}</h2>
      </div>

      {story.premise && (
        <p className="text-ink-soft italic leading-relaxed border-l-2 pl-3 border-accent/40">{story.premise}</p>
      )}

      {loc && (
        <div className="space-y-1">
          <p className="font-mono text-[10px] uppercase tracking-wider text-ink-faint">Luogo principale</p>
          <Chip icon={MapPin} label={loc.name} sublabel={LOCATION_TYPE_LABEL[loc.type]}
            onClick={() => onSelect({ kind: "location", id: loc.id })} tone={`var(--loc-${loc.type})`} />
        </div>
      )}

      {chars.length > 0 && (
        <div className="space-y-1.5">
          <p className="font-mono text-[10px] uppercase tracking-wider text-ink-faint">Cast in scena ({chars.length})</p>
          <div className="flex flex-wrap gap-1.5">
            {chars.map((c) => (
              <button key={c.id} type="button"
                onClick={() => onSelect({ kind: "character", id: c.id })}
                className="inline-flex items-center gap-1 rounded-full border border-rule bg-paper px-2.5 py-0.5 text-xs text-ink hover:border-accent hover:text-accent">
                <User2 className="h-3 w-3" aria-hidden />
                {c.name}
              </button>
            ))}
          </div>
        </div>
      )}

      {story.fear && (story.fear.brother || story.fear.fear_id || story.fear.status) && (
        <div className="rounded-md border border-rule-soft bg-paper p-3 space-y-1">
          <p className="font-mono text-[10px] uppercase tracking-wider text-ink-faint">Paura toccata</p>
          <div className="text-ink space-y-0.5">
            {story.fear.brother && <p><span className="text-ink-soft">Fratello: </span><strong>{story.fear.brother}</strong></p>}
            {story.fear.fear_id && <p><span className="text-ink-soft">Paura: </span><code className="font-mono text-xs">{story.fear.fear_id}</code></p>}
            {story.fear.status && <p><span className="text-ink-soft">Stato: </span><em>{story.fear.status}</em></p>}
            {story.fear.mode_of_touch && <p className="text-ink-soft text-xs italic mt-1">{story.fear.mode_of_touch}</p>}
          </div>
        </div>
      )}

      <div className="grid grid-cols-5 gap-2 pt-2 border-t border-rule-soft">
        <Stat label="semi" value={story.seeds_planted_count} tone="planted" />
        <Stat label="fiorit." value={story.seeds_bloomed_count} tone="bloomed" />
        <Stat label="db.+" value={story.debts_opened_count} />
        <Stat label="db.−" value={story.debts_closed_count} />
        <Stat label="cb." value={story.callbacks_count} />
      </div>

      {(planted.length > 0 || bloomedHere.length > 0) && (
        <div className="space-y-3 pt-1">
          {planted.length > 0 && (
            <SeedList title="Semi piantati qui" icon={Sprout} tone="var(--seed-planted)"
              seeds={planted} storySid={story.sid} onSelect={onSelect} />
          )}
          {bloomedHere.length > 0 && (
            <SeedList title="Semi che fioriscono qui" icon={Flower2} tone="var(--seed-bloomed)"
              seeds={bloomedHere} storySid={story.sid} onSelect={onSelect} />
          )}
        </div>
      )}
    </div>
  );
}

function CharacterPanel({
  character, stories, onSelect,
}: {
  character: OrchestraCharacter; stories: OrchestraStory[];
  onSelect: (sel: OrchestraSelection | null) => void;
}) {
  const sids = stories.map((s) => s.sid);
  const presence = sids.map((sid) => character.appearances.includes(sid));
  return (
    <div className="space-y-4">
      <div className="space-y-1">
        <div className="flex items-center gap-2 text-accent-warm">
          <User2 className="h-4 w-4" aria-hidden />
          <span className="font-mono text-[10px] uppercase tracking-wider">Personaggio</span>
        </div>
        <h2 className="font-serif text-xl font-semibold text-ink leading-tight">{character.name}</h2>
        <div className="flex flex-wrap gap-1.5 pt-1">
          {character.role && <Badge variant="secondary" className="font-mono">{character.role}</Badge>}
          {character.species && <Badge variant="outline" className="font-mono">{character.species}</Badge>}
          {character.age_band && <Badge variant="outline" className="font-mono">{character.age_band}</Badge>}
        </div>
      </div>

      <div className="space-y-1.5">
        <p className="font-mono text-[10px] uppercase tracking-wider text-ink-faint">
          Presenza saga ({character.appearances.length}/{sids.length})
        </p>
        <div className="flex gap-0.5" role="list">
          {sids.map((sid, i) => (
            <button key={sid} type="button" role="listitem"
              onClick={() => presence[i] && onSelect({ kind: "story", id: sid })}
              className={cn("h-5 flex-1 rounded-sm border text-[9px] font-mono",
                presence[i]
                  ? "bg-ink/80 border-ink text-paper hover:bg-accent hover:border-accent cursor-pointer"
                  : "bg-paper border-rule-soft text-ink-faint cursor-default")}
              aria-label={`${sid}: ${presence[i] ? "presente" : "assente"}`}
              tabIndex={presence[i] ? 0 : -1}>
              {sid.replace("s", "")}
            </button>
          ))}
        </div>
      </div>

      <div className="space-y-1.5">
        <p className="font-mono text-[10px] uppercase tracking-wider text-ink-faint">Apparizioni</p>
        <div className="flex flex-wrap gap-1.5">
          {character.appearances.map((sid) => {
            const st = stories.find((s) => s.sid === sid);
            return (
              <button key={sid} type="button"
                onClick={() => onSelect({ kind: "story", id: sid })}
                className="inline-flex items-center gap-1 rounded-md border border-rule bg-paper px-2 py-1 text-xs text-ink hover:border-accent hover:text-accent">
                <span className="font-mono text-[10px]">{sid}</span>
                {st?.title && <span className="text-ink-soft">— {st.title}</span>}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}

function LocationPanel({
  location, stories, onSelect,
}: {
  location: OrchestraLocation; stories: OrchestraStory[];
  onSelect: (sel: OrchestraSelection | null) => void;
}) {
  return (
    <div className="space-y-4">
      <div className="space-y-1">
        <div className="flex items-center gap-2" style={{ color: `var(--loc-${location.type})` }}>
          <MapPin className="h-4 w-4" aria-hidden />
          <span className="font-mono text-[10px] uppercase tracking-wider">
            Luogo · {LOCATION_TYPE_LABEL[location.type]}
          </span>
        </div>
        <h2 className="font-serif text-xl font-semibold text-ink leading-tight">{location.name}</h2>
        <div className="flex flex-wrap gap-1.5 pt-1">
          {location.raw_type && <Badge variant="outline" className="font-mono">{location.raw_type}</Badge>}
          {location.quadrant && <Badge variant="secondary" className="font-mono">{location.quadrant}</Badge>}
        </div>
        {location.role_saga && <p className="text-ink-soft italic text-xs leading-relaxed pt-1">{location.role_saga}</p>}
      </div>

      {location.appearances.length > 0 ? (
        <div className="space-y-1.5">
          <p className="font-mono text-[10px] uppercase tracking-wider text-ink-faint">
            Apparizioni come luogo principale ({location.appearances.length})
          </p>
          <div className="flex flex-wrap gap-1.5">
            {location.appearances.map((sid) => {
              const st = stories.find((s) => s.sid === sid);
              return (
                <button key={sid} type="button"
                  onClick={() => onSelect({ kind: "story", id: sid })}
                  className="inline-flex items-center gap-1 rounded-md border border-rule bg-paper px-2 py-1 text-xs text-ink hover:border-accent hover:text-accent">
                  <span className="font-mono text-[10px]">{sid}</span>
                  {st?.title && <span className="text-ink-soft">— {st.title}</span>}
                </button>
              );
            })}
          </div>
        </div>
      ) : (
        <p className="text-ink-soft text-xs italic">
          Mai luogo principale di una storia. Compare nel grafo come riferimento.
        </p>
      )}
    </div>
  );
}

function SeedPanel({
  seed, onSelect,
}: {
  seed: OrchestraSeed; onSelect: (sel: OrchestraSelection | null) => void;
}) {
  return (
    <div className="space-y-4">
      <div className="space-y-1">
        <div className="flex items-center gap-2 text-accent-warm">
          <Sprout className="h-4 w-4" aria-hidden />
          <span className="font-mono text-[10px] uppercase tracking-wider">Seme</span>
        </div>
        <h2 className="font-serif text-base font-semibold text-ink leading-tight break-words">{seed.id}</h2>
        <div className="flex flex-wrap gap-1.5 pt-1">
          {seed.type && <Badge variant="outline" className="font-mono">{seed.type}</Badge>}
          {seed.status && <Badge variant="secondary" className="font-mono">{seed.status}</Badge>}
          {seed.bloom_type && <Badge variant="outline" className="font-mono text-[9px]">{seed.bloom_type}</Badge>}
        </div>
      </div>

      {seed.description && (
        <p className="text-ink leading-relaxed border-l-2 pl-3 border-accent/40">{seed.description}</p>
      )}

      <div className="space-y-3">
        {seed.planted && (
          <div className="space-y-1">
            <p className="font-mono text-[10px] uppercase tracking-wider text-ink-faint">Piantato in</p>
            <button type="button"
              onClick={() => onSelect({ kind: "story", id: seed.planted as string })}
              className="inline-flex items-center gap-2 rounded-md border border-rule bg-paper px-3 py-1.5 text-sm text-ink hover:border-accent hover:text-accent"
              style={{ borderLeftWidth: 3, borderLeftColor: "var(--seed-planted)" }}>
              <Sprout className="h-3.5 w-3.5" style={{ color: "var(--seed-planted)" }} aria-hidden />
              <span className="font-mono text-xs">{seed.planted}</span>
            </button>
          </div>
        )}

        {seed.bloom_targets.length > 0 && (
          <div className="space-y-1">
            <p className="font-mono text-[10px] uppercase tracking-wider text-ink-faint">
              {seed.bloom_targets.length === 1 ? "Fiorisce in" : `Fiorisce in (${seed.bloom_targets.length} target)`}
            </p>
            <div className="flex flex-wrap gap-1.5">
              {seed.bloom_targets.map((sid) => (
                <button key={sid} type="button"
                  onClick={() => onSelect({ kind: "story", id: sid })}
                  className="inline-flex items-center gap-2 rounded-md border border-rule bg-paper px-3 py-1.5 text-sm text-ink hover:border-accent hover:text-accent"
                  style={{ borderLeftWidth: 3, borderLeftColor: "var(--seed-bloomed)" }}>
                  <Flower2 className="h-3.5 w-3.5" style={{ color: "var(--seed-bloomed)" }} aria-hidden />
                  <span className="font-mono text-xs">{sid}</span>
                </button>
              ))}
            </div>
          </div>
        )}

        {!seed.planted && seed.bloom_targets.length === 0 && (
          <p className="text-ink-soft text-xs italic">Seme senza origine né target nel grafo.</p>
        )}
      </div>
    </div>
  );
}

function Stat({ label, value, tone }: { label: string; value: number; tone?: "planted" | "bloomed" }) {
  const color = tone === "planted" ? "var(--seed-planted)"
    : tone === "bloomed" ? "var(--seed-bloomed)" : "hsl(var(--ink))";
  return (
    <div className="text-center">
      <div className="font-mono text-lg font-semibold leading-tight" style={{ color }}>{value}</div>
      <div className="font-mono text-[9px] uppercase tracking-wider text-ink-faint">{label}</div>
    </div>
  );
}

function Chip({
  icon: Icon, label, sublabel, onClick, tone,
}: {
  icon: React.ComponentType<{ className?: string }>; label: string;
  sublabel?: string; onClick: () => void; tone?: string;
}) {
  return (
    <button type="button" onClick={onClick}
      className="inline-flex items-center gap-2 rounded-md border border-rule bg-paper px-3 py-1.5 text-sm text-ink hover:border-accent hover:text-accent"
      style={tone ? { borderLeftWidth: 3, borderLeftColor: tone } : undefined}>
      <Icon className="h-3.5 w-3.5" aria-hidden />
      <span>{label}</span>
      {sublabel && (
        <span className="font-mono text-[10px] uppercase tracking-wider text-ink-faint">· {sublabel}</span>
      )}
    </button>
  );
}

function SeedList({
  title, icon: Icon, tone, seeds, storySid: _storySid, onSelect,
}: {
  title: string;
  icon: React.ComponentType<{ className?: string; style?: React.CSSProperties }>;
  tone: string; seeds: OrchestraSeed[]; storySid: string;
  onSelect: (sel: OrchestraSelection | null) => void;
}) {
  return (
    <div className="space-y-1.5">
      <p className="font-mono text-[10px] uppercase tracking-wider text-ink-faint flex items-center gap-1.5">
        <Icon className="h-3 w-3" style={{ color: tone }} aria-hidden />
        {title} ({seeds.length})
      </p>
      <ul className="space-y-1">
        {seeds.map((seed) => (
          <li key={seed.id}>
            <button type="button"
              onClick={() => onSelect({ kind: "seed", id: seed.id })}
              className="w-full text-left rounded-md border border-rule-soft bg-paper px-2.5 py-1.5 text-xs text-ink hover:border-accent hover:text-accent"
              style={{ borderLeftWidth: 3, borderLeftColor: tone }}>
              <div className="font-mono text-[10px] text-ink-soft truncate">{seed.id}</div>
              {seed.description && (
                <div className="text-ink-soft text-xs mt-0.5 line-clamp-2 leading-snug">{seed.description}</div>
              )}
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
