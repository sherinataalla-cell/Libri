"use client";

import * as React from "react";
import Link from "next/link";
import { Menu } from "lucide-react";

import type { Tree } from "@/lib/types";
import { Badge } from "@/components/ui/badge";
import {
  Sheet,
  SheetContent,
  SheetTitle,
} from "@/components/ui/sheet";
import { useSidebar } from "@/components/catalogo/sidebar-provider";
import { SidebarContent } from "@/components/catalogo/sidebar-content";

interface TopbarMobileProps {
  tree: Tree;
  totalEntities: number;
}

export function TopbarMobile({ tree, totalEntities }: TopbarMobileProps) {
  const { open, setOpen } = useSidebar();
  return (
    <>
      <header className="sticky top-0 z-40 flex h-[54px] items-center gap-3 border-b border-rule-soft bg-paper/95 px-4 backdrop-blur supports-[backdrop-filter]:bg-paper/80 catalogo-topbar-mobile">
        <button
          type="button"
          aria-label="Apri menu"
          aria-expanded={open}
          onClick={() => setOpen(true)}
          className="inline-flex h-9 w-9 items-center justify-center rounded-md hover:bg-rule-soft/60"
        >
          <Menu className="h-5 w-5" />
        </button>
        <Link
          href="/catalogo"
          className="font-serif text-base font-semibold tracking-tight text-ink truncate"
        >
          Catalogo
        </Link>
        <Badge variant="secondary" className="ml-auto font-mono text-[10px]">
          {totalEntities}
        </Badge>
      </header>
      <Sheet open={open} onOpenChange={setOpen}>
        <SheetContent
          side="left"
          className="w-[85vw] max-w-sm p-0"
          aria-describedby={undefined}
        >
          <SheetTitle className="sr-only">Menu catalogo</SheetTitle>
          <SidebarContent tree={tree} totalEntities={totalEntities} />
        </SheetContent>
      </Sheet>
    </>
  );
}
