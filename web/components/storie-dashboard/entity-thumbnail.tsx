// Thumbnail singola di un'immagine canonica entity, con bottone download
// in overlay (anchor puro `download`, niente JS).
// Server component.
//
// Non usiamo next/image qui: le immagini stanno sul deploy CDN del catalogo
// (NEXT_PUBLIC_IMAGE_BASE) e l'optimizer Next non ha senso applicarlo a
// thumbnail audit (variabile size + immutabili lato build).

import { Download } from "lucide-react";

import { imageUrl } from "@/lib/image-url";

interface EntityThumbnailProps {
  /** Path repo dell'immagine, es. `visual/.../immagini/...jpg`. */
  relPath: string;
  /** Alt text base (es. id entity). */
  alt: string;
}

export function EntityThumbnail({ relPath, alt }: EntityThumbnailProps) {
  const url = imageUrl(relPath);
  const filename = relPath.split("/").pop() ?? "image.jpg";
  return (
    <div className="group relative h-20 w-20 overflow-hidden rounded-md border border-rule-soft bg-paper-soft">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={url}
        alt={alt}
        loading="lazy"
        className="h-full w-full object-cover transition-transform group-hover:scale-105"
      />
      <a
        href={url}
        download={filename}
        title={`Scarica ${filename}`}
        aria-label={`Scarica ${filename}`}
        className="absolute right-1 top-1 inline-flex h-6 w-6 items-center justify-center rounded-full bg-paper/85 text-ink-soft shadow-sm opacity-0 backdrop-blur-sm transition-opacity hover:bg-accent hover:text-accent-foreground group-hover:opacity-100 focus-visible:opacity-100"
      >
        <Download className="h-3.5 w-3.5" aria-hidden />
      </a>
    </div>
  );
}
