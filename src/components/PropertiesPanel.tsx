"use client";

import { BookPage, PageLayout, FontFamily, LAYOUT_LABELS } from "@/types/book";

interface PropertiesPanelProps {
  page: BookPage;
  onUpdate: (updates: Partial<BookPage>) => void;
  onDelete: () => void;
}

export default function PropertiesPanel({ page, onUpdate, onDelete }: PropertiesPanelProps) {
  return (
    <aside className="w-56 min-w-[220px] bg-white border-l border-gray-200 p-4 overflow-y-auto">
      <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">
        Proprietà
      </h3>

      <div className="mb-3">
        <label className="block text-xs font-semibold text-gray-500 mb-1">Template</label>
        <select
          value={page.layout}
          onChange={(e) => onUpdate({ layout: e.target.value as PageLayout })}
          className="w-full p-1.5 border border-gray-200 rounded text-sm"
        >
          {Object.entries(LAYOUT_LABELS).map(([value, label]) => (
            <option key={value} value={value}>{label}</option>
          ))}
        </select>
      </div>

      <div className="mb-3">
        <label className="block text-xs font-semibold text-gray-500 mb-1">Sfondo</label>
        <input
          type="color"
          value={page.backgroundColor}
          onChange={(e) => onUpdate({ backgroundColor: e.target.value })}
          className="w-full h-8 border border-gray-200 rounded cursor-pointer"
        />
      </div>

      <div className="mb-3">
        <label className="block text-xs font-semibold text-gray-500 mb-1">Font</label>
        <select
          value={page.fontFamily}
          onChange={(e) => onUpdate({ fontFamily: e.target.value as FontFamily })}
          className="w-full p-1.5 border border-gray-200 rounded text-sm"
        >
          <option value="display">Baloo (Giocoso)</option>
          <option value="handwriting">Patrick Hand (Scritto a mano)</option>
          <option value="body">Quicksand (Moderno)</option>
        </select>
      </div>

      <div className="mb-3">
        <label className="block text-xs font-semibold text-gray-500 mb-1">
          Dimensione testo: {page.fontSize}px
        </label>
        <input
          type="range"
          min={14}
          max={48}
          value={page.fontSize}
          onChange={(e) => onUpdate({ fontSize: Number(e.target.value) })}
          className="w-full cursor-pointer"
        />
      </div>

      <div className="mb-3">
        <label className="block text-xs font-semibold text-gray-500 mb-1">Colore testo</label>
        <input
          type="color"
          value={page.textColor}
          onChange={(e) => onUpdate({ textColor: e.target.value })}
          className="w-full h-8 border border-gray-200 rounded cursor-pointer"
        />
      </div>

      <div className="mb-3">
        <label className="flex items-center gap-2 text-xs font-semibold text-gray-500 cursor-pointer">
          <input
            type="checkbox"
            checked={page.showPageNumber}
            onChange={(e) => onUpdate({ showPageNumber: e.target.checked })}
          />
          Numero pagina
        </label>
      </div>

      <hr className="my-4 border-gray-200" />

      <button
        onClick={onDelete}
        className="w-full py-2 px-3 bg-red-500 text-white rounded text-sm font-semibold hover:bg-red-600 transition-colors"
      >
        🗑 Elimina Pagina
      </button>
    </aside>
  );
}
