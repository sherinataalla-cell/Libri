import type { Tree } from "@/lib/types";
import { SidebarContent } from "@/components/catalogo/sidebar-content";

interface SidebarDesktopProps {
  tree: Tree;
  totalEntities: number;
}

/**
 * Sidebar fissa desktop. Mostrata solo a partire da `min-width: 800px`
 * (vedi `app/catalogo/layout.tsx`).
 */
export function SidebarDesktop({ tree, totalEntities }: SidebarDesktopProps) {
  return (
    <aside className="hidden catalogo-sidebar-desktop:block w-[320px] shrink-0 border-r border-rule-soft sticky top-0 h-screen">
      <SidebarContent tree={tree} totalEntities={totalEntities} />
    </aside>
  );
}
