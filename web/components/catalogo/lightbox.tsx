"use client";

import * as React from "react";
import { ChevronLeft, ChevronRight, X } from "lucide-react";
import { createPortal } from "react-dom";

import type { EntityImage } from "@/lib/types";
import { imageUrl } from "@/lib/image-url";

interface LightboxProps {
  images: EntityImage[];
  index: number;
  onClose: () => void;
  onIndexChange: (i: number) => void;
}

export function Lightbox({
  images,
  index,
  onClose,
  onIndexChange,
}: LightboxProps) {
  const total = images.length;
  const current = images[index];

  // Lock scroll
  React.useEffect(() => {
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, []);

  // Keyboard nav
  React.useEffect(() => {
    function onKey(ev: KeyboardEvent) {
      if (ev.key === "Escape") onClose();
      else if (ev.key === "ArrowRight") onIndexChange((index + 1) % total);
      else if (ev.key === "ArrowLeft")
        onIndexChange((index - 1 + total) % total);
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [index, total, onClose, onIndexChange]);

  // Touch swipe
  const touchStartX = React.useRef<number | null>(null);
  const touchEndX = React.useRef<number | null>(null);

  function onTouchStart(ev: React.TouchEvent) {
    touchEndX.current = null;
    touchStartX.current = ev.targetTouches[0].clientX;
  }
  function onTouchMove(ev: React.TouchEvent) {
    touchEndX.current = ev.targetTouches[0].clientX;
  }
  function onTouchEnd() {
    if (touchStartX.current == null || touchEndX.current == null) return;
    const dx = touchStartX.current - touchEndX.current;
    const threshold = 40;
    if (dx > threshold) onIndexChange((index + 1) % total);
    else if (dx < -threshold) onIndexChange((index - 1 + total) % total);
  }

  const [mounted, setMounted] = React.useState(false);
  React.useEffect(() => setMounted(true), []);
  if (!mounted) return null;
  if (!current) return null;

  const url = imageUrl(current.path);

  return createPortal(
    <div
      role="dialog"
      aria-modal="true"
      aria-label={`Immagine ${index + 1} di ${total}: ${current.filename}`}
      className="fixed inset-0 z-[60] flex flex-col bg-ink/95"
      onClick={onClose}
    >
      {/* Topbar */}
      <div
        className="flex items-center justify-between p-3 text-paper"
        onClick={(e) => e.stopPropagation()}
      >
        <span className="font-mono text-xs">
          {index + 1} / {total}
        </span>
        <button
          type="button"
          aria-label="Chiudi"
          className="rounded-md p-2 hover:bg-paper/10"
          onClick={onClose}
        >
          <X className="h-5 w-5" />
        </button>
      </div>

      {/* Image area */}
      <div
        className="relative flex-1 select-none"
        onTouchStart={onTouchStart}
        onTouchMove={onTouchMove}
        onTouchEnd={onTouchEnd}
        onClick={(e) => e.stopPropagation()}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={url}
          alt={current.filename}
          className="absolute inset-0 m-auto max-h-full max-w-full object-contain"
          loading="eager"
        />
        {total > 1 && (
          <>
            <button
              type="button"
              aria-label="Precedente"
              onClick={() => onIndexChange((index - 1 + total) % total)}
              className="absolute left-2 top-1/2 -translate-y-1/2 rounded-full bg-ink/40 p-2 text-paper hover:bg-ink/60"
            >
              <ChevronLeft className="h-6 w-6" />
            </button>
            <button
              type="button"
              aria-label="Successiva"
              onClick={() => onIndexChange((index + 1) % total)}
              className="absolute right-2 top-1/2 -translate-y-1/2 rounded-full bg-ink/40 p-2 text-paper hover:bg-ink/60"
            >
              <ChevronRight className="h-6 w-6" />
            </button>
          </>
        )}
      </div>

      {/* Footer info */}
      <div
        className="flex items-center justify-between gap-2 p-3 text-paper"
        onClick={(e) => e.stopPropagation()}
      >
        <span className="font-mono text-xs truncate">{current.filename}</span>
        {current.size_kb != null && (
          <span className="font-mono text-xs text-paper/70 shrink-0">
            {current.size_kb.toFixed(0)} KB
          </span>
        )}
      </div>
    </div>,
    document.body,
  );
}
