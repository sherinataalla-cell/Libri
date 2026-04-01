"use client";

import { useState, useCallback } from "react";
import { Book, BookPage, PageSize } from "@/types/book";
import { createEmptyPage, createSampleBook } from "./sample-book";

let pageCounter = 0;

function generatePageId(): string {
  return `page-${Date.now()}-${++pageCounter}`;
}

export function useBookStore() {
  const [book, setBook] = useState<Book>({
    id: "new-book",
    title: "Nuovo Libro",
    author: "",
    pageSize: "square",
    pages: [],
  });
  const [selectedPageIndex, setSelectedPageIndex] = useState<number>(-1);

  const selectedPage = selectedPageIndex >= 0 ? book.pages[selectedPageIndex] : null;

  const addPage = useCallback(
    (layout?: BookPage["layout"]) => {
      const newPage = createEmptyPage(generatePageId());
      if (layout) newPage.layout = layout;
      setBook((prev) => {
        const pages = [...prev.pages, newPage];
        return { ...prev, pages };
      });
      setSelectedPageIndex(book.pages.length);
    },
    [book.pages.length]
  );

  const updatePage = useCallback(
    (index: number, updates: Partial<BookPage>) => {
      setBook((prev) => {
        const pages = [...prev.pages];
        pages[index] = { ...pages[index], ...updates };
        return { ...prev, pages };
      });
    },
    []
  );

  const deletePage = useCallback(
    (index: number) => {
      setBook((prev) => {
        const pages = prev.pages.filter((_, i) => i !== index);
        return { ...prev, pages };
      });
      setSelectedPageIndex((prev) => {
        if (prev >= book.pages.length - 1) return Math.max(0, book.pages.length - 2);
        return prev;
      });
    },
    [book.pages.length]
  );

  const movePage = useCallback((fromIndex: number, toIndex: number) => {
    setBook((prev) => {
      const pages = [...prev.pages];
      const [moved] = pages.splice(fromIndex, 1);
      pages.splice(toIndex, 0, moved);
      return { ...prev, pages };
    });
    setSelectedPageIndex(toIndex);
  }, []);

  const setPageSize = useCallback((size: PageSize) => {
    setBook((prev) => ({ ...prev, pageSize: size }));
  }, []);

  const loadSampleBook = useCallback(() => {
    const sample = createSampleBook();
    setBook(sample);
    setSelectedPageIndex(0);
  }, []);

  const updateBookMeta = useCallback((title: string, author: string) => {
    setBook((prev) => ({ ...prev, title, author }));
  }, []);

  return {
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
    updateBookMeta,
  };
}
