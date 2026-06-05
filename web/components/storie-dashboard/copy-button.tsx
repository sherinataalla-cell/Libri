"use client";

// Pulsante copia testo nel clipboard, con feedback visivo (~2s).
// Client Component dedicato — usato dentro <StyleReferenceBlock> ma riutilizzabile.

import * as React from "react";
import { Check, Clipboard, X as XIcon } from "lucide-react";

import { cn } from "@/lib/utils";

interface CopyButtonProps {
  text: string;
  /** Etichetta default. */
  label?: string;
  className?: string;
}

type CopyState = "idle" | "ok" | "err";

export function CopyButton({
  text,
  label = "Copia",
  className,
}: CopyButtonProps) {
  const [state, setState] = React.useState<CopyState>("idle");
  const timeoutRef = React.useRef<ReturnType<typeof setTimeout> | null>(null);

  React.useEffect(() => {
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, []);

  const onClick = React.useCallback(async () => {
    try {
      if (
        typeof navigator === "undefined" ||
        !navigator.clipboard ||
        typeof navigator.clipboard.writeText !== "function"
      ) {
        throw new Error("clipboard API non disponibile");
      }
      await navigator.clipboard.writeText(text);
      setState("ok");
    } catch {
      setState("err");
    }
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    timeoutRef.current = setTimeout(() => setState("idle"), 2000);
  }, [text]);

  const Icon = state === "ok" ? Check : state === "err" ? XIcon : Clipboard;
  const display =
    state === "ok" ? "Copiato" : state === "err" ? "Errore" : label;

  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={display}
      className={cn(
        "inline-flex items-center gap-1.5 rounded-md border px-3 py-1.5 font-mono text-xs uppercase tracking-wider transition-colors",
        state === "ok" &&
          "border-accent/40 bg-accent/15 text-accent",
        state === "err" &&
          "border-destructive/40 bg-destructive/10 text-destructive",
        state === "idle" &&
          "border-rule bg-paper text-ink-soft hover:border-accent/40 hover:text-accent",
        className,
      )}
    >
      <Icon className="h-3.5 w-3.5" aria-hidden />
      {display}
    </button>
  );
}
