export type PageLayout =
  | "full-image"
  | "text-left"
  | "text-right"
  | "text-top"
  | "text-bottom"
  | "full-text"
  | "cover";

export type PageSize = "square" | "landscape" | "portrait";

export type FontFamily = "display" | "handwriting" | "body";

export interface BookPage {
  id: string;
  layout: PageLayout;
  text: string;
  imageUrl: string | null;
  backgroundColor: string;
  textColor: string;
  fontFamily: FontFamily;
  fontSize: number;
  showPageNumber: boolean;
  // Cover-specific
  title?: string;
  author?: string;
}

export interface Book {
  id: string;
  title: string;
  author: string;
  pageSize: PageSize;
  pages: BookPage[];
}

export const PAGE_SIZE_DIMENSIONS: Record<PageSize, { width: number; height: number; label: string }> = {
  square: { width: 210, height: 210, label: "Quadrato (21×21cm)" },
  landscape: { width: 280, height: 210, label: "Orizzontale (28×21cm)" },
  portrait: { width: 210, height: 280, label: "Verticale (21×28cm)" },
};

export const FONT_MAP: Record<FontFamily, string> = {
  display: "'Baloo 2', cursive",
  handwriting: "'Patrick Hand', cursive",
  body: "'Quicksand', sans-serif",
};

export const LAYOUT_LABELS: Record<PageLayout, string> = {
  "full-image": "Solo Illustrazione",
  "text-left": "Testo a Sinistra",
  "text-right": "Testo a Destra",
  "text-top": "Testo in Alto",
  "text-bottom": "Testo in Basso",
  "full-text": "Solo Testo",
  cover: "Copertina",
};
