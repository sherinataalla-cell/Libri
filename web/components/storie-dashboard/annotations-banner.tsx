// Banner status annotazioni: ok (manuali presenti, link GitHub) o warn
// (NER auto, mancanti). Server component.

import { AlertTriangle, CheckCircle2, ExternalLink } from "lucide-react";

import { cn } from "@/lib/utils";

interface AnnotationsBannerProps {
  present: boolean;
  path?: string;
  githubUrl?: string;
}

export function AnnotationsBanner({
  present,
  path,
  githubUrl,
}: AnnotationsBannerProps) {
  return (
    <div
      role="status"
      className={cn(
        "flex flex-wrap items-center gap-2 rounded-md border px-3 py-2 text-sm",
        present
          ? "border-accent/30 bg-accent/10 text-accent"
          : "border-accent-warm/40 bg-accent-warm/10 text-accent-warm",
      )}
    >
      {present ? (
        <CheckCircle2 className="h-4 w-4 shrink-0" aria-hidden />
      ) : (
        <AlertTriangle className="h-4 w-4 shrink-0" aria-hidden />
      )}
      {present ? (
        <span className="font-serif">
          Annotazioni manuali presenti
          {path && (
            <>
              {" — "}
              {githubUrl ? (
                <a
                  href={githubUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 underline-offset-2 hover:underline"
                >
                  <code className="font-mono text-xs">{path}</code>
                  <ExternalLink className="h-3 w-3" aria-hidden />
                </a>
              ) : (
                <code className="font-mono text-xs">{path}</code>
              )}
            </>
          )}
        </span>
      ) : (
        <span className="font-serif">
          Annotazioni manuali non ancora create — i dati dei hook sono
          auto-rilevati (NER fuzzy)
        </span>
      )}
    </div>
  );
}
