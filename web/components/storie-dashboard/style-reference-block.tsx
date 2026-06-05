// Reference stile saga: <details open> con <pre> + CopyButton.
// Server component; il bottone copia è Client component dedicato.

import { Palette } from "lucide-react";

import { CopyButton } from "@/components/storie-dashboard/copy-button";

interface StyleReferenceBlockProps {
  text: string;
}

export function StyleReferenceBlock({ text }: StyleReferenceBlockProps) {
  if (!text.trim()) return null;
  return (
    <details
      open
      className="group rounded-md border border-rule-soft bg-paper-soft"
    >
      <summary className="flex cursor-pointer list-none items-center gap-2 px-4 py-3 text-ink hover:text-accent">
        <Palette className="h-4 w-4 text-accent-warm" aria-hidden />
        <span className="font-mono text-xs uppercase tracking-wider">
          Reference stile saga
        </span>
        <span className="font-serif text-sm italic text-ink-faint">
          — style-only pass: copia in Grok per ripassare immagini gia
          generate senza alterare soggetti / posa
        </span>
        <span
          className="ml-auto font-mono text-[10px] uppercase tracking-wider text-ink-faint group-open:hidden"
          aria-hidden
        >
          espandi
        </span>
        <span
          className="ml-auto hidden font-mono text-[10px] uppercase tracking-wider text-ink-faint group-open:inline"
          aria-hidden
        >
          comprimi
        </span>
      </summary>
      <div className="space-y-3 border-t border-rule-soft px-4 py-3">
        <pre className="max-h-72 overflow-auto whitespace-pre-wrap rounded-md border border-rule-soft bg-paper p-3 font-mono text-[11px] leading-relaxed text-ink-soft">
          {text}
        </pre>
        <div className="flex justify-end">
          <CopyButton text={text} />
        </div>
      </div>
    </details>
  );
}
