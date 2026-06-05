"use client";

import * as React from "react";

interface SidebarContextValue {
  open: boolean;
  setOpen: (v: boolean) => void;
  toggle: () => void;
  close: () => void;
}

const SidebarContext = React.createContext<SidebarContextValue | null>(null);

export function SidebarProvider({ children }: { children: React.ReactNode }) {
  const [open, setOpen] = React.useState(false);

  // Riflette lo stato sul body per i CSS che si appoggiano a `body.sidebar-open`.
  // Single source of truth: lo stato React. La classe sul body è solo un mirror.
  React.useEffect(() => {
    if (typeof document === "undefined") return;
    if (open) {
      document.body.classList.add("sidebar-open");
    } else {
      document.body.classList.remove("sidebar-open");
    }
    return () => {
      document.body.classList.remove("sidebar-open");
    };
  }, [open]);

  const value = React.useMemo<SidebarContextValue>(
    () => ({
      open,
      setOpen,
      toggle: () => setOpen((v) => !v),
      close: () => setOpen(false),
    }),
    [open],
  );

  return (
    <SidebarContext.Provider value={value}>{children}</SidebarContext.Provider>
  );
}

export function useSidebar(): SidebarContextValue {
  const ctx = React.useContext(SidebarContext);
  if (!ctx) {
    throw new Error("useSidebar must be used inside SidebarProvider");
  }
  return ctx;
}
