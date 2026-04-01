"use client";

import { BookPage, FONT_MAP } from "@/types/book";
import { useRef } from "react";

interface PageCanvasProps {
  page: BookPage;
  pageIndex: number;
  pageSize: string;
  onUpdate: (updates: Partial<BookPage>) => void;
  isPreview?: boolean;
}

const sizeClasses: Record<string, string> = {
  square: "w-[500px] h-[500px]",
  landscape: "w-[600px] h-[450px]",
  portrait: "w-[450px] h-[600px]",
};

const previewSizeClasses: Record<string, string> = {
  square: "w-[400px] h-[400px]",
  landscape: "w-[480px] h-[360px]",
  portrait: "w-[360px] h-[480px]",
};

export default function PageCanvas({
  page,
  pageIndex,
  pageSize,
  onUpdate,
  isPreview = false,
}: PageCanvasProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const font = FONT_MAP[page.fontFamily];
  const sizes = isPreview ? previewSizeClasses : sizeClasses;

  const handleImageClick = () => {
    if (!isPreview) fileInputRef.current?.click();
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      onUpdate({ imageUrl: ev.target?.result as string });
    };
    reader.readAsDataURL(file);
  };

  const renderTextArea = (placeholder: string, className = "") => (
    <div
      className={`p-6 outline-none overflow-auto ${className}`}
      style={{
        fontFamily: font,
        fontSize: `${page.fontSize}px`,
        lineHeight: 1.6,
        color: page.textColor,
      }}
      contentEditable={!isPreview}
      suppressContentEditableWarning
      onBlur={(e) => onUpdate({ text: e.currentTarget.textContent || "" })}
      data-placeholder={placeholder}
    >
      {page.text || (!isPreview ? "" : undefined)}
    </div>
  );

  const renderImageArea = () => (
    <div
      className="flex items-center justify-center bg-gray-50 cursor-pointer relative overflow-hidden hover:bg-gray-100 transition-colors"
      onClick={handleImageClick}
    >
      {page.imageUrl ? (
        <img
          src={page.imageUrl}
          alt="Illustrazione"
          className="w-full h-full object-cover"
        />
      ) : (
        <div className="text-center text-gray-300">
          <span className="text-5xl block mb-2">🎨</span>
          <span className="text-sm">
            {isPreview ? "Nessuna immagine" : "Clicca per aggiungere un'illustrazione"}
          </span>
        </div>
      )}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={handleImageUpload}
      />
    </div>
  );

  const renderContent = () => {
    switch (page.layout) {
      case "cover":
        return (
          <div className="flex flex-col items-center justify-center h-full gap-4 p-8 text-center">
            <div
              className="text-4xl font-bold outline-none w-full"
              style={{ fontFamily: FONT_MAP.display, color: page.textColor }}
              contentEditable={!isPreview}
              suppressContentEditableWarning
              onBlur={(e) => onUpdate({ title: e.currentTarget.textContent || "" })}
            >
              {page.title || ""}
            </div>
            {page.imageUrl && (
              <img
                src={page.imageUrl}
                alt="Copertina"
                className="max-h-[200px] rounded-lg object-cover cursor-pointer"
                onClick={handleImageClick}
              />
            )}
            {!page.imageUrl && (
              <div
                className="w-48 h-48 bg-gray-50 rounded-lg flex items-center justify-center cursor-pointer hover:bg-gray-100 transition-colors"
                onClick={handleImageClick}
              >
                <span className="text-5xl">🎨</span>
              </div>
            )}
            <div
              className="text-lg outline-none text-gray-500 w-full"
              style={{ fontFamily: font }}
              contentEditable={!isPreview}
              suppressContentEditableWarning
              onBlur={(e) => onUpdate({ author: e.currentTarget.textContent || "" })}
            >
              {page.author || ""}
            </div>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleImageUpload}
            />
          </div>
        );

      case "full-image":
        return <div className="h-full">{renderImageArea()}</div>;

      case "full-text":
        return (
          <div className="h-full flex items-center justify-center">
            {renderTextArea("Scrivi il testo qui...", "w-full h-full flex items-center justify-center")}
          </div>
        );

      case "text-bottom":
        return (
          <div className="grid grid-rows-[1fr_auto] h-full">
            {renderImageArea()}
            {renderTextArea("Scrivi il testo qui...")}
          </div>
        );

      case "text-top":
        return (
          <div className="grid grid-rows-[auto_1fr] h-full">
            {renderTextArea("Scrivi il testo qui...")}
            {renderImageArea()}
          </div>
        );

      case "text-left":
        return (
          <div className="grid grid-cols-[2fr_3fr] h-full">
            {renderTextArea("Scrivi il testo qui...", "flex items-center")}
            {renderImageArea()}
          </div>
        );

      case "text-right":
        return (
          <div className="grid grid-cols-[3fr_2fr] h-full">
            {renderImageArea()}
            {renderTextArea("Scrivi il testo qui...", "flex items-center")}
          </div>
        );
    }
  };

  return (
    <div
      className={`${sizes[pageSize]} bg-white shadow-xl rounded relative overflow-hidden`}
      style={{ backgroundColor: page.backgroundColor }}
    >
      <style jsx>{`
        [contenteditable]:empty:before {
          content: attr(data-placeholder);
          color: #ccc;
          font-style: italic;
        }
      `}</style>
      {renderContent()}
      {page.showPageNumber && page.layout !== "cover" && (
        <div className="absolute bottom-2 left-1/2 -translate-x-1/2 text-xs text-gray-400">
          {pageIndex + 1}
        </div>
      )}
    </div>
  );
}
