// Client-safe helpers per costruire URL pubblici delle immagini catalogo.
// Tenuti separati da `lib/data.ts` (che usa fs/promises ed è server-only).
//
// **PROJECT**: imposta NEXT_PUBLIC_IMAGE_BASE per servire le immagini da un
// CDN esterno. Se non impostato, le immagini sono servite localmente da
// public/visual/.
//
// Il path `relPath` arriva dal JSON ed è nella forma
// "visual/<categoria>/.../immagini/<file>.jpg" o equivalente.

export const IMAGE_BASE: string =
  (typeof process !== "undefined" &&
    process.env &&
    (process.env.NEXT_PUBLIC_IMAGE_BASE as string | undefined)) ||
  "";

export function imageUrl(relPath: string): string {
  const base = IMAGE_BASE.replace(/\/+$/, "");
  const normalized = relPath.startsWith("/") ? relPath : "/" + relPath;
  return base + normalized;
}
