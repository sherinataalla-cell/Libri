"use client";

import { useState } from "react";
import { Book } from "@/types/book";

interface PdfExportProps {
  book: Book;
}

export default function PdfExport({ book }: PdfExportProps) {
  const [loading, setLoading] = useState(false);

  if (book.pages.length === 0) return null;

  const handleExport = async () => {
    setLoading(true);
    try {
      const { pdf } = await import("@react-pdf/renderer");
      const { default: BookPdfDocument } = await import("./BookPdfDocument");
      const blob = await pdf(<BookPdfDocument book={book} />).toBlob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `${book.title || "libro"}.pdf`;
      a.click();
      URL.revokeObjectURL(url);
    } catch (err) {
      console.error("Errore generazione PDF:", err);
      alert("Errore durante la generazione del PDF. Riprova.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      onClick={handleExport}
      disabled={loading}
      className="px-3 py-1.5 bg-gray-100 border border-gray-200 rounded text-sm font-semibold hover:bg-gray-200 transition-colors whitespace-nowrap disabled:opacity-50"
    >
      {loading ? "⏳ Generazione..." : "📄 Esporta PDF"}
    </button>
  );
}
