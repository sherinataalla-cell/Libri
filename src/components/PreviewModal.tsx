"use client";

import { useState } from "react";
import { Book } from "@/types/book";
import PageCanvas from "./PageCanvas";

interface PreviewModalProps {
  book: Book;
  onClose: () => void;
}

export default function PreviewModal({ book, onClose }: PreviewModalProps) {
  const [currentPage, setCurrentPage] = useState(0);

  if (book.pages.length === 0) return null;

  return (
    <div
      className="fixed inset-0 bg-black/70 flex items-center justify-center z-50"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-xl max-w-[90vw] max-h-[90vh] overflow-auto p-6"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold text-primary font-display">
            Anteprima: {book.title}
          </h2>
          <button
            onClick={onClose}
            className="text-2xl text-gray-400 hover:text-gray-600 px-2"
          >
            &times;
          </button>
        </div>

        <div className="flex justify-center mb-4">
          <PageCanvas
            page={book.pages[currentPage]}
            pageIndex={currentPage}
            pageSize={book.pageSize}
            onUpdate={() => {}}
            isPreview
          />
        </div>

        <div className="flex justify-center items-center gap-4">
          <button
            onClick={() => setCurrentPage((p) => Math.max(0, p - 1))}
            disabled={currentPage === 0}
            className="px-4 py-2 bg-gray-100 border border-gray-200 rounded text-sm font-semibold disabled:opacity-30 hover:bg-gray-200 transition-colors"
          >
            ← Precedente
          </button>
          <span className="text-sm text-gray-500">
            {currentPage + 1} / {book.pages.length}
          </span>
          <button
            onClick={() => setCurrentPage((p) => Math.min(book.pages.length - 1, p + 1))}
            disabled={currentPage === book.pages.length - 1}
            className="px-4 py-2 bg-gray-100 border border-gray-200 rounded text-sm font-semibold disabled:opacity-30 hover:bg-gray-200 transition-colors"
          >
            Successiva →
          </button>
        </div>
      </div>
    </div>
  );
}
