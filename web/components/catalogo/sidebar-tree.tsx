"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ChevronRight } from "lucide-react";

import type { Tree, TreeNode } from "@/lib/types";
import { cn } from "@/lib/utils";
import { useSidebar } from "@/components/catalogo/sidebar-provider";

interface SidebarTreeProps {
  tree: Tree;
  query: string;
}

interface NormalizedNode {
  key: string;
  label: string;
  pathKey: string;
  depth: number;
  entityId?: string;
  entityName?: string;
  nImages?: number;
  status?: string;
  children: NormalizedNode[];
}

/**
 * Normalizza il tree JSON in una struttura più comoda da renderizzare.
 * Ordinamento: prima i container (con figli), poi le foglie, alfabetico.
 */
function normalize(
  node: TreeNode,
  key: string,
  depth: number,
  parentPath: string,
): NormalizedNode {
  const pathKey = parentPath ? `${parentPath}/${key}` : key;
  const childrenRaw = node._children ?? {};
  const children: NormalizedNode[] = Object.entries(childrenRaw)
    .map(([k, v]) => normalize(v, k, depth + 1, pathKey))
    .sort((a, b) => {
      const aHasChildren = a.children.length > 0;
      const bHasChildren = b.children.length > 0;
      if (aHasChildren !== bHasChildren) return aHasChildren ? -1 : 1;
      return a.label.localeCompare(b.label, "it");
    });
  return {
    key,
    label: node._entity_meta?.name ?? humanize(key),
    pathKey,
    depth,
    entityId: node._entity_id,
    entityName: node._entity_meta?.name,
    nImages: node._entity_meta?.n_images,
    status: node._entity_meta?.status,
    children,
  };
}

function humanize(key: string): string {
  return key.replace(/_/g, " ");
}

const TOP_LEVEL_LABELS: Record<string, string> = {
  personaggi: "Personaggi",
  luoghi: "Luoghi",
  oggetti: "Oggetti",
  venti: "Venti",
  visual_signatures: "Visual signatures",
};

const TOP_LEVEL_ORDER = [
  "personaggi",
  "luoghi",
  "oggetti",
  "venti",
  "visual_signatures",
];

/** Match query case-insensitive su label / entityId / entityName / pathKey. */
function matches(node: NormalizedNode, q: string): boolean {
  if (!q) return true;
  const needle = q.toLowerCase();
  const haystack = [
    node.label,
    node.entityId ?? "",
    node.entityName ?? "",
    node.pathKey,
  ]
    .join(" ")
    .toLowerCase();
  return haystack.includes(needle);
}

/**
 * Filtra ricorsivamente: un nodo è incluso se matcha lui stesso o uno dei
 * suoi discendenti. Quando la query non è vuota, espandiamo automaticamente.
 */
function filterTree(
  nodes: NormalizedNode[],
  q: string,
): { filtered: NormalizedNode[]; matchedKeys: Set<string> } {
  const matchedKeys = new Set<string>();
  if (!q) {
    return { filtered: nodes, matchedKeys };
  }
  const visit = (node: NormalizedNode): NormalizedNode | null => {
    const childResults = node.children
      .map(visit)
      .filter((x): x is NormalizedNode => x !== null);
    const selfMatch = matches(node, q);
    if (childResults.length === 0 && !selfMatch) return null;
    matchedKeys.add(node.pathKey);
    return { ...node, children: childResults };
  };
  const filtered = nodes
    .map(visit)
    .filter((x): x is NormalizedNode => x !== null);
  return { filtered, matchedKeys };
}

export function SidebarTree({ tree, query }: SidebarTreeProps) {
  const roots = React.useMemo<NormalizedNode[]>(() => {
    const all = Object.entries(tree).map(([k, v]) => normalize(v, k, 0, ""));
    // Sort by canonical top-level order
    return all.sort((a, b) => {
      const ai = TOP_LEVEL_ORDER.indexOf(a.key);
      const bi = TOP_LEVEL_ORDER.indexOf(b.key);
      const aiSafe = ai === -1 ? 999 : ai;
      const biSafe = bi === -1 ? 999 : bi;
      return aiSafe - biSafe;
    });
  }, [tree]);

  const { filtered, matchedKeys } = React.useMemo(
    () => filterTree(roots, query.trim()),
    [roots, query],
  );

  return (
    <nav aria-label="Navigazione catalogo" className="text-sm">
      <ul className="space-y-1">
        {filtered.map((root) => (
          <TreeBranch
            key={root.pathKey}
            node={root}
            forceOpen={query.trim().length > 0}
            matchedKeys={matchedKeys}
            isRoot
          />
        ))}
        {filtered.length === 0 && (
          <li className="text-ink-faint px-2 py-2 italic">
            Nessuna entità corrisponde a “{query}”.
          </li>
        )}
      </ul>
    </nav>
  );
}

interface TreeBranchProps {
  node: NormalizedNode;
  forceOpen: boolean;
  matchedKeys: Set<string>;
  isRoot?: boolean;
}

function TreeBranch({
  node,
  forceOpen,
  matchedKeys,
  isRoot,
}: TreeBranchProps) {
  // Default: top-level expanded, deeper levels collapsed.
  const [open, setOpen] = React.useState<boolean>(isRoot ?? false);

  // Forced open: when query active OR ancestor of an active route.
  const pathname = usePathname();
  const { close } = useSidebar();

  const isActive = !!node.entityId && pathname === `/catalogo/${node.entityId}`;
  const hasChildren = node.children.length > 0;
  const effectivelyOpen = forceOpen || open;

  // ---- LEAF (entity) ----
  if (!hasChildren && node.entityId) {
    return (
      <li>
        <Link
          href={`/catalogo/${node.entityId}`}
          onClick={close}
          className={cn(
            "flex items-center justify-between gap-2 rounded-md px-2 py-1.5 hover:bg-rule-soft/60",
            isActive && "bg-accent/10 text-accent font-medium",
          )}
          style={{ paddingLeft: `${0.5 + node.depth * 0.75}rem` }}
        >
          <span className="truncate">{node.label}</span>
          {node.nImages != null && node.nImages > 0 && (
            <span className="font-mono text-[10px] text-ink-faint shrink-0">
              {node.nImages}
            </span>
          )}
        </Link>
      </li>
    );
  }

  // ---- BRANCH ----
  const label = isRoot
    ? TOP_LEVEL_LABELS[node.key] ?? humanize(node.key)
    : humanize(node.label);

  // Branch with own entity (rare): show toggle + link
  return (
    <li>
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className={cn(
          "group flex w-full items-center gap-1 rounded-md px-2 py-1.5 text-left hover:bg-rule-soft/40",
          isRoot && "uppercase tracking-wider font-mono text-xs text-ink-soft",
        )}
        style={{ paddingLeft: `${0.5 + node.depth * 0.75}rem` }}
        aria-expanded={effectivelyOpen}
      >
        <ChevronRight
          aria-hidden
          className={cn(
            "h-3.5 w-3.5 shrink-0 transition-transform",
            effectivelyOpen && "rotate-90",
          )}
        />
        <span className="truncate">{label}</span>
        {node.entityId && (
          <span className="ml-auto text-[10px] text-ink-faint">
            {matchedKeys.has(node.pathKey) ? "✓" : ""}
          </span>
        )}
      </button>
      {effectivelyOpen && (
        <ul className="mt-0.5 space-y-0.5">
          {node.entityId && (
            <li>
              <Link
                href={`/catalogo/${node.entityId}`}
                onClick={close}
                className={cn(
                  "flex items-center gap-2 rounded-md px-2 py-1 text-xs text-ink-soft hover:bg-rule-soft/60 italic",
                  pathname === `/catalogo/${node.entityId}` &&
                    "bg-accent/10 text-accent",
                )}
                style={{
                  paddingLeft: `${1.25 + node.depth * 0.75}rem`,
                }}
              >
                → scheda {node.label}
              </Link>
            </li>
          )}
          {node.children.map((child) => (
            <TreeBranch
              key={child.pathKey}
              node={child}
              forceOpen={forceOpen}
              matchedKeys={matchedKeys}
            />
          ))}
        </ul>
      )}
    </li>
  );
}
