"use client";

// Atlante SVG a 3 tracce sull'asse temporale s01..s12.
// - Top: 12 card storia (168 px), con titolo + sid + season pill + dot semi
// - Center: N righe personaggio (22 px) con segmenti contigui per apparizioni
// - Bottom: N righe luogo (22 px) con linea tratteggiata + pallini sui sid
// - Archi seed sopra le storie (uno per ogni bloom_target → multi-bloom)

import * as React from "react";

import type {
  OrchestraCharacter,
  OrchestraLocation,
  OrchestraSeed,
  OrchestraSelection,
  OrchestraStory,
  Season,
} from "@/lib/types-orchestra";
import { cn } from "@/lib/utils";

interface AtlasProps {
  stories: OrchestraStory[];
  characters: OrchestraCharacter[];
  locations: OrchestraLocation[];
  seeds: OrchestraSeed[];
  selection: OrchestraSelection | null;
  hoverStory: string | null;
  onSelect: (sel: OrchestraSelection) => void;
  onHoverStory: (sid: string | null) => void;
}

const LABEL_W = 140;
const STORY_TRACK_H = 168;
const ROW_H = 22;
const TRACK_GAP = 18;
const STORY_PAD_X = 8;
const SEED_ARC_MAX = 64;
const MIN_ATLAS_W = 1100;

function seasonClass(season: Season | null) {
  if (!season) return "";
  return `season-${season}`;
}

export function Atlas({
  stories, characters, locations, seeds,
  selection, hoverStory, onSelect, onHoverStory,
}: AtlasProps) {
  const wrapperRef = React.useRef<HTMLDivElement | null>(null);
  const [containerW, setContainerW] = React.useState<number>(MIN_ATLAS_W);

  React.useEffect(() => {
    if (!wrapperRef.current) return;
    const ro = new ResizeObserver((entries) => {
      for (const e of entries) {
        const w = Math.round(e.contentRect.width);
        if (w > 0) setContainerW(w);
      }
    });
    ro.observe(wrapperRef.current);
    return () => ro.disconnect();
  }, []);

  const atlasW = Math.max(MIN_ATLAS_W, containerW);
  const colW = (atlasW - LABEL_W) / Math.max(stories.length, 1);
  const cardW = colW - STORY_PAD_X * 2;

  const visibleChars = React.useMemo(() => characters.filter((c) => c.appearances.length > 0), [characters]);
  const visibleLocs = React.useMemo(() => locations.filter((l) => l.appearances.length > 0), [locations]);

  const charsTrackH = visibleChars.length * ROW_H;
  const locsTrackH = visibleLocs.length * ROW_H;
  const totalH = SEED_ARC_MAX + STORY_TRACK_H + TRACK_GAP + charsTrackH + TRACK_GAP + locsTrackH + 20;

  const storyTrackY = SEED_ARC_MAX;
  const charsTrackY = storyTrackY + STORY_TRACK_H + TRACK_GAP;
  const locsTrackY = charsTrackY + charsTrackH + TRACK_GAP;

  const sidIndex = React.useMemo(() => {
    const m = new Map<string, number>();
    stories.forEach((s, i) => m.set(s.sid, i));
    return m;
  }, [stories]);

  const colCenter = React.useCallback((sid: string) => {
    const i = sidIndex.get(sid);
    if (i === undefined) return -9999;
    return LABEL_W + i * colW + colW / 2;
  }, [sidIndex, colW]);

  const isStoryDimmed = (sid: string) => {
    if (selection) {
      if (selection.kind === "story") return selection.id !== sid;
      if (selection.kind === "character") {
        const c = characters.find((x) => x.id === selection.id);
        return c ? !c.appearances.includes(sid) : false;
      }
      if (selection.kind === "location") {
        const l = locations.find((x) => x.id === selection.id);
        return l ? !l.appearances.includes(sid) : false;
      }
      if (selection.kind === "seed") {
        const s = seeds.find((x) => x.id === selection.id);
        if (!s) return false;
        const involved = new Set<string>();
        if (s.planted) involved.add(s.planted);
        for (const t of s.bloom_targets) involved.add(t);
        return !involved.has(sid);
      }
    }
    if (hoverStory) return hoverStory !== sid;
    return false;
  };

  const isCharDimmed = (cid: string) => {
    if (selection?.kind === "character") return selection.id !== cid;
    if (hoverStory) {
      const story = stories.find((s) => s.sid === hoverStory);
      if (!story) return false;
      return !story.character_ids.includes(cid);
    }
    return false;
  };

  const isLocDimmed = (lid: string) => {
    if (selection?.kind === "location") return selection.id !== lid;
    if (hoverStory) {
      const story = stories.find((s) => s.sid === hoverStory);
      if (!story) return false;
      return story.location_id !== lid;
    }
    return false;
  };

  return (
    <div
      ref={wrapperRef}
      className="orchestra-atlas-wrapper relative overflow-x-auto rounded-lg border border-rule-soft bg-paper-soft/40"
    >
      <svg
        viewBox={`0 0 ${atlasW} ${totalH}`}
        width={atlasW}
        height={totalH}
        role="img"
        aria-label="Atlante saga: tre tracce sull'asse temporale s01..s12"
        style={{ display: "block", minWidth: MIN_ATLAS_W }}
        className="font-serif"
      >
        <rect x={0} y={0} width={LABEL_W} height={totalH} fill="hsl(var(--paper-soft))" />

        <text x={LABEL_W - 12} y={storyTrackY + 14} textAnchor="end" className="fill-ink-faint"
          style={{ fontFamily: "var(--font-jetbrains-mono), monospace", fontSize: 10, textTransform: "uppercase", letterSpacing: "0.1em" }}>
          Storie
        </text>
        <text x={LABEL_W - 12} y={charsTrackY - 8} textAnchor="end" className="fill-ink-faint"
          style={{ fontFamily: "var(--font-jetbrains-mono), monospace", fontSize: 10, textTransform: "uppercase", letterSpacing: "0.1em" }}>
          Personaggi
        </text>
        <text x={LABEL_W - 12} y={locsTrackY - 8} textAnchor="end" className="fill-ink-faint"
          style={{ fontFamily: "var(--font-jetbrains-mono), monospace", fontSize: 10, textTransform: "uppercase", letterSpacing: "0.1em" }}>
          Luoghi
        </text>

        <SeedsArcs seeds={seeds} colCenter={colCenter} baseY={storyTrackY - 4}
          maxArcH={SEED_ARC_MAX - 8} selection={selection} onSelect={onSelect} />

        {stories.map((s, i) => {
          const x = LABEL_W + i * colW + STORY_PAD_X;
          const dimmed = isStoryDimmed(s.sid);
          const isSel = selection?.kind === "story" && selection.id === s.sid;
          return (
            <StoryCard key={s.sid} story={s} x={x} y={storyTrackY} w={cardW} h={STORY_TRACK_H}
              dimmed={dimmed} selected={isSel}
              onSelect={() => onSelect({ kind: "story", id: s.sid })}
              onHover={(h) => onHoverStory(h ? s.sid : null)} />
          );
        })}

        {visibleChars.map((c, i) => {
          const y = charsTrackY + i * ROW_H;
          const dimmed = isCharDimmed(c.id);
          const isSel = selection?.kind === "character" && selection.id === c.id;
          return (
            <CharRow key={c.id} character={c} stories={stories} y={y} labelW={LABEL_W} colW={colW}
              dimmed={dimmed} selected={isSel}
              onSelect={() => onSelect({ kind: "character", id: c.id })} />
          );
        })}

        {visibleLocs.map((l, i) => {
          const y = locsTrackY + i * ROW_H;
          const dimmed = isLocDimmed(l.id);
          const isSel = selection?.kind === "location" && selection.id === l.id;
          return (
            <LocRow key={l.id} location={l} stories={stories} y={y} labelW={LABEL_W} colW={colW} atlasW={atlasW}
              dimmed={dimmed} selected={isSel}
              onSelect={() => onSelect({ kind: "location", id: l.id })} />
          );
        })}
      </svg>
    </div>
  );
}

interface StoryCardProps {
  story: OrchestraStory; x: number; y: number; w: number; h: number;
  dimmed: boolean; selected: boolean;
  onSelect: () => void; onHover: (hovering: boolean) => void;
}

function StoryCard({ story, x, y, w, h, dimmed, selected, onSelect, onHover }: StoryCardProps) {
  const sClass = seasonClass(story.season);
  const bg = story.season ? `var(--season-${story.season}-wash)` : "hsl(var(--paper))";
  const ink = story.season ? `var(--season-${story.season}-ink)` : "hsl(var(--ink))";
  const plantedCount = story.seeds_planted_count;
  const bloomedCount = story.seeds_bloomed_count;

  return (
    <g className={cn(sClass, "cursor-pointer transition-opacity")}
      style={{ opacity: dimmed ? 0.3 : 1 }}
      onClick={onSelect}
      onMouseEnter={() => onHover(true)}
      onMouseLeave={() => onHover(false)}
      role="button" tabIndex={0}
      onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); onSelect(); } }}
      aria-label={`Storia ${story.sid}: ${story.title}`}>
      <rect x={x} y={y} width={w} height={h} rx={6} ry={6}
        fill={bg} stroke={selected ? "hsl(var(--accent))" : ink} strokeWidth={selected ? 2 : 1} />
      <text x={x + 8} y={y + 16}
        style={{ fontFamily: "var(--font-jetbrains-mono), monospace", fontSize: 10, letterSpacing: "0.08em", textTransform: "uppercase", fill: ink }}>
        {story.sid}
      </text>
      {story.season && (
        <text x={x + w - 8} y={y + 16} textAnchor="end"
          style={{ fontFamily: "var(--font-jetbrains-mono), monospace", fontSize: 9, letterSpacing: "0.08em", textTransform: "uppercase", fill: ink, opacity: 0.85 }}>
          {story.season}{story.cycle ? ` · ${story.cycle}` : ""}
        </text>
      )}
      <foreignObject x={x + 8} y={y + 24} width={w - 16} height={h - 60}>
        <div style={{
          color: "hsl(var(--ink))",
          fontFamily: "var(--font-fraunces), Georgia, serif",
          fontSize: 13, lineHeight: 1.25, fontWeight: 600,
          overflow: "hidden", display: "-webkit-box",
          WebkitLineClamp: 4, WebkitBoxOrient: "vertical",
        }}>
          {story.title}
        </div>
      </foreignObject>
      <g transform={`translate(${x + 8}, ${y + h - 22})`}>
        {Array.from({ length: Math.min(plantedCount, 10) }).map((_, i) => (
          <circle key={`p${i}`} cx={i * 8 + 3} cy={3} r={2.5} fill="var(--seed-planted)" />
        ))}
        {plantedCount > 10 && (
          <text x={10 * 8 + 3} y={6}
            style={{ fontFamily: "var(--font-jetbrains-mono), monospace", fontSize: 9, fill: "var(--seed-planted)" }}>
            +{plantedCount - 10}
          </text>
        )}
      </g>
      <g transform={`translate(${x + 8}, ${y + h - 12})`}>
        {Array.from({ length: Math.min(bloomedCount, 10) }).map((_, i) => (
          <circle key={`b${i}`} cx={i * 8 + 3} cy={3} r={3} fill="var(--seed-bloomed)" />
        ))}
        {bloomedCount > 10 && (
          <text x={10 * 8 + 3} y={6}
            style={{ fontFamily: "var(--font-jetbrains-mono), monospace", fontSize: 9, fill: "var(--seed-bloomed)" }}>
            +{bloomedCount - 10}
          </text>
        )}
      </g>
    </g>
  );
}

interface CharRowProps {
  character: OrchestraCharacter; stories: OrchestraStory[]; y: number;
  labelW: number; colW: number; dimmed: boolean; selected: boolean; onSelect: () => void;
}

function CharRow({ character, stories, y, labelW, colW, dimmed, selected, onSelect }: CharRowProps) {
  const present = stories.map((s) => character.appearances.includes(s.sid));
  const runs: Array<{ start: number; end: number }> = [];
  let runStart = -1;
  for (let i = 0; i < present.length; i++) {
    if (present[i] && runStart === -1) runStart = i;
    if ((!present[i] || i === present.length - 1) && runStart !== -1) {
      const end = present[i] ? i : i - 1;
      runs.push({ start: runStart, end });
      runStart = -1;
    }
  }

  return (
    <g className="cursor-pointer transition-opacity"
      style={{ opacity: dimmed ? 0.25 : 1 }}
      onClick={onSelect} role="button" tabIndex={0}
      onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); onSelect(); } }}
      aria-label={`Personaggio ${character.name}, ${character.appearances.length} apparizioni`}>
      <text x={labelW - 10} y={y + 15} textAnchor="end"
        style={{ fontFamily: "var(--font-fraunces), Georgia, serif", fontSize: 12,
          fill: selected ? "hsl(var(--accent))" : "hsl(var(--ink))", fontWeight: selected ? 600 : 400 }}>
        {character.name}
      </text>
      <line x1={labelW + 4} y1={y + 11} x2={labelW + 12 * colW - 4} y2={y + 11}
        stroke="hsl(var(--rule-soft))" strokeWidth={1} />
      {runs.map((r, i) => {
        const x1 = labelW + r.start * colW + colW * 0.18;
        const x2 = labelW + r.end * colW + colW * 0.82;
        return (
          <rect key={i} x={x1} y={y + 7} width={Math.max(x2 - x1, 4)} height={8} rx={4} ry={4}
            fill={selected ? "hsl(var(--accent))" : "hsl(var(--ink-soft))"} />
        );
      })}
      {present.map((p, i) => p ? (
        <circle key={`d${i}`} cx={labelW + i * colW + colW / 2} cy={y + 11} r={2.5}
          fill={selected ? "hsl(var(--accent))" : "hsl(var(--ink))"} />
      ) : null)}
    </g>
  );
}

interface LocRowProps {
  location: OrchestraLocation; stories: OrchestraStory[]; y: number;
  labelW: number; colW: number; atlasW: number;
  dimmed: boolean; selected: boolean; onSelect: () => void;
}

function LocRow({ location, stories, y, labelW, colW, atlasW, dimmed, selected, onSelect }: LocRowProps) {
  const color = `var(--loc-${location.type})`;
  return (
    <g className="cursor-pointer transition-opacity"
      style={{ opacity: dimmed ? 0.25 : 1 }}
      onClick={onSelect} role="button" tabIndex={0}
      onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); onSelect(); } }}
      aria-label={`Luogo ${location.name}, ${location.appearances.length} apparizioni`}>
      <text x={labelW - 10} y={y + 15} textAnchor="end"
        style={{ fontFamily: "var(--font-fraunces), Georgia, serif", fontSize: 12,
          fill: selected ? "hsl(var(--accent))" : "hsl(var(--ink))", fontWeight: selected ? 600 : 400 }}>
        {location.name}
      </text>
      <line x1={labelW + 4} y1={y + 11} x2={atlasW - 4} y2={y + 11}
        stroke={color} strokeWidth={1} strokeDasharray="3 3" opacity={0.5} />
      {stories.map((s, i) => {
        const isHere = location.appearances.includes(s.sid);
        if (!isHere) return null;
        return (
          <circle key={s.sid} cx={labelW + i * colW + colW / 2} cy={y + 11} r={5}
            fill={color}
            stroke={selected ? "hsl(var(--accent))" : "hsl(var(--paper-soft))"}
            strokeWidth={selected ? 2 : 1.5} />
        );
      })}
    </g>
  );
}

interface SeedsArcsProps {
  seeds: OrchestraSeed[]; colCenter: (sid: string) => number;
  baseY: number; maxArcH: number;
  selection: OrchestraSelection | null; onSelect: (sel: OrchestraSelection) => void;
}

function SeedsArcs({ seeds, colCenter, baseY, maxArcH, selection, onSelect }: SeedsArcsProps) {
  return (
    <g>
      {seeds.flatMap((seed) => {
        if (!seed.planted || seed.bloom_targets.length === 0) return [];
        const x1 = colCenter(seed.planted);
        if (x1 < 0) return [];
        return seed.bloom_targets.map((tgt, ti) => {
          const x2 = colCenter(tgt);
          if (x2 < 0) return null;
          const dist = Math.abs(x2 - x1);
          const arcH = Math.min(maxArcH, 14 + dist * 0.18);
          const cy = baseY - arcH;
          const path = `M ${x1} ${baseY} C ${x1} ${cy}, ${x2} ${cy}, ${x2} ${baseY}`;
          const isSel = selection?.kind === "seed" && selection.id === seed.id;
          const weight = Math.max(0.5, 1.6 - ti * 0.25);
          return (
            <g key={`${seed.id}_${tgt}_${ti}`} className="cursor-pointer"
              onClick={(e) => { e.stopPropagation(); onSelect({ kind: "seed", id: seed.id }); }}
              role="button" tabIndex={0}
              aria-label={`Seme ${seed.id} (${seed.planted} → ${tgt})`}>
              <path d={path} fill="none"
                stroke={isSel ? "hsl(var(--accent))" : "var(--seed-bloomed)"}
                strokeWidth={isSel ? weight + 1 : weight}
                opacity={isSel ? 1 : 0.55} />
              <circle cx={x1} cy={baseY} r={2} fill={isSel ? "hsl(var(--accent))" : "var(--seed-planted)"} />
              <circle cx={x2} cy={baseY} r={2.5} fill={isSel ? "hsl(var(--accent))" : "var(--seed-bloomed)"} />
            </g>
          );
        });
      })}
    </g>
  );
}
