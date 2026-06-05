/** @type {import('next').NextConfig} */
//
// next.config.mjs — Configurazione Next per il cruscotto editoriale.
//
// **PROJECT**: il progetto adottante imposta NEXT_PUBLIC_IMAGE_BASE
// se vuole servire le immagini del catalogo da un CDN esterno. Default:
// vuoto, le immagini sono servite localmente da public/visual/.
//
// Strategia consigliata: NON copiare le immagini grandi in public/ del
// progetto Next, ma servirle dal CDN del progetto adottante (es. il deploy
// statico del catalogo, o un host separato). next/image non ottimizza
// immagini esterne (gallery hanno `unoptimized: true`).

const IMAGE_BASE = process.env.NEXT_PUBLIC_IMAGE_BASE || "";

let imageRemoteHostname = "";
try {
  if (IMAGE_BASE) imageRemoteHostname = new URL(IMAGE_BASE).hostname;
} catch {
  // ignore
}

const nextConfig = {
  reactStrictMode: true,
  images: {
    remotePatterns: imageRemoteHostname
      ? [
          {
            protocol: "https",
            hostname: imageRemoteHostname,
            pathname: "/visual/**",
          },
        ]
      : [],
  },
};

export default nextConfig;
