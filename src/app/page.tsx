"use client";

import { useState } from "react";
import { useBookStore } from "@/lib/use-book-store";
import { PageLayout, PageSize, LAYOUT_LABELS, PAGE_SIZE_DIMENSIONS } from "@/types/book";
import PageCanvas from "@/components/PageCanvas";
import PageThumbnail from "@/components/PageThumbnail";
import PropertiesPanel from "@/components/PropertiesPanel";
import PreviewModal from "@/components/PreviewModal";
import dynamic from "next/dynamic";

const PdfExport = dynamic(() => import("@/components/PdfExport"), { ssr: false });

export default function Home() {
  const {
    book,
    selectedPageIndex,
    selectedPage,
    setSelectedPageIndex,
    addPage,
    updatePage,
    deletePage,
    movePage,
    setPageSize,
    loadSampleBook,
  } = useBookStore();

  const [showPreview, setShowPreview] = useState(false);
  const [selectedLayout, setSelectedLayout] = useState<PageLayout>("text-bottom");

  return (
    <>
      {/* Toolbar */}
      <header className="flex items-center justify-between px-4 py-2 bg-white border-b-2 border-gray-200 shadow-sm z-50 flex-wrap gap-2">
        <div className="flex items-center gap-3">
          <h1 className="text-2xl font-bold text-primary" style={{ fontFamily: "'Baloo 2', cursive" }}>
            📚 Libri
          </h1>
          <span className="text-xs text-gray-400 hidden sm:inline">
            Impaginazione Libri per Bambini
          </span>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => addPage(selectedLayout)}
            className="px-3 py-1.5 bg-primary text-white rounded text-sm font-semibold hover:bg-primary-dark transition-colors"
          >
            + Pagina
          </button>

          <div className="w-px h-6 bg-gray-200" />

          <select
            value={selectedLayout}
            onChange={(e) => setSelectedLayout(e.target.value as PageLayout)}
            className="px-2 py-1.5 border border-gray-200 rounded text-sm"
          >
            {Object.entries(LAYOUT_LABELS).map(([value, label]) => (
              <option key={value} value={value}>{label}</option>
            ))}
          </select>

          <div className="w-px h-6 bg-gray-200" />

          <select
            value={book.pageSize}
            onChange={(e) => setPageSize(e.target.value as PageSize)}
            className="px-2 py-1.5 border border-gray-200 rounded text-sm"
          >
            {Object.entries(PAGE_SIZE_DIMENSIONS).map(([value, { label }]) => (
              <option key={value} value={value}>{label}</option>
            ))}
          </select>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowPreview(true)}
            disabled={book.pages.length === 0}
            className="px-3 py-1.5 bg-gray-100 border border-gray-200 rounded text-sm font-semibold hover:bg-gray-200 transition-colors disabled:opacity-30 whitespace-nowrap"
          >
            👁 Anteprima
          </button>
          <PdfExport book={book} />
          <button
            onClick={loadSampleBook}
            className="px-3 py-1.5 bg-accent text-white rounded text-sm font-semibold hover:bg-accent-dark transition-colors whitespace-nowrap"
          >
            ✨ Esempio
          </button>
        </div>
      </header>

      {/* Workspace */}
      <main className="flex flex-1 overflow-hidden">
        {/* Page list */}
        <aside className="w-44 min-w-[176px] bg-white border-r border-gray-200 p-3 overflow-y-auto">
          <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">
            Pagine ({book.pages.length})
          </h3>
          <div className="flex flex-col gap-2">
            {book.pages.map((page, index) => (
              <PageThumbnail
                key={page.id}
                page={page}
                index={index}
                isActive={index === selectedPageIndex}
                onClick={() => setSelectedPageIndex(index)}
              />
            ))}
          </div>
        </aside>

        {/* Editor */}
        <section
          className="flex-1 flex items-center justify-center p-6 overflow-auto"
          style={{
            backgroundImage: "radial-gradient(circle at 20px 20px, #e0e5eb 1px, transparent 1px)",
            backgroundSize: "40px 40px",
          }}
        >
          {selectedPage ? (
            <PageCanvas
              page={selectedPage}
              pageIndex={selectedPageIndex}
              pageSize={book.pageSize}
              onUpdate={(updates) => updatePage(selectedPageIndex, updates)}
            />
          ) : (
            <div className="text-center text-gray-400">
              <div className="text-6xl mb-4">📖</div>
              <h2 className="text-xl font-bold text-gray-600 mb-2" style={{ fontFamily: "'Baloo 2', cursive" }}>
                Crea il tuo libro per bambini!
              </h2>
              <p className="text-sm leading-relaxed">
                Clicca <strong>+ Pagina</strong> per aggiungere la prima pagina,
                <br />
                oppure carica un <strong>Esempio</strong> per iniziare.
              </p>
            </div>
          )}
        </section>

        {/* Properties */}
        {selectedPage && (
          <PropertiesPanel
            page={selectedPage}
            onUpdate={(updates) => updatePage(selectedPageIndex, updates)}
            onDelete={() => deletePage(selectedPageIndex)}
          />
        )}
      </main>

      {/* Preview Modal */}
      {showPreview && (
        <PreviewModal book={book} onClose={() => setShowPreview(false)} />
      )}
    </>
  );
}
