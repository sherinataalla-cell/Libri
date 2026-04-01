"use client";

import { BookPage, LAYOUT_LABELS } from "@/types/book";

interface PageThumbnailProps {
  page: BookPage;
  index: number;
  isActive: boolean;
  onClick: () => void;
}

export default function PageThumbnail({ page, index, isActive, onClick }: PageThumbnailProps) {
  return (
    <button
      onClick={onClick}
      className={`w-full border-2 rounded-lg p-1 cursor-pointer transition-all hover:border-primary hover:shadow-sm ${
        isActive ? "border-primary shadow-md ring-2 ring-primary/30" : "border-gray-200"
      }`}
    >
      <div
        className="w-full aspect-square rounded flex items-center justify-center text-xs text-gray-400 relative overflow-hidden"
        style={{ backgroundColor: page.backgroundColor }}
      >
        {page.layout === "cover" ? (
          <div className="text-center p-1">
            <div className="font-bold text-[8px] truncate" style={{ color: page.textColor }}>
              {page.title || "Copertina"}
            </div>
          </div>
        ) : page.imageUrl ? (
          <img src={page.imageUrl} alt="" className="w-full h-full object-cover opacity-60" />
        ) : (
          <span className="text-2xl opacity-30">📄</span>
        )}
      </div>
      <div className="text-[10px] text-center mt-1 text-gray-500 truncate">
        {page.layout === "cover" ? "Copertina" : `Pag. ${index + 1}`}
      </div>
    </button>
  );
}
