"use client";

import {
  Document,
  Page,
  View,
  Text,
  Image,
  StyleSheet,
  Font,
} from "@react-pdf/renderer";
import { Book, BookPage, PAGE_SIZE_DIMENSIONS } from "@/types/book";

// Register Google Fonts for PDF
Font.register({
  family: "Baloo2",
  src: "https://fonts.gstatic.com/s/baloo2/v21/wXK0E3kTposypRyd51ncAFcu.ttf",
});

Font.register({
  family: "PatrickHand",
  src: "https://fonts.gstatic.com/s/patrickhand/v23/LDI1apSQOAYtSuYWp8ZhfYeMWcjKm7sp8g.ttf",
});

Font.register({
  family: "Quicksand",
  src: "https://fonts.gstatic.com/s/quicksand/v31/6xK-dSZaM9iE8KbpRA_LJ3z8mH9BOJvgkP8o58a-xDwxUD2X6WHIg.ttf",
});

const fontFamilyMap: Record<string, string> = {
  display: "Baloo2",
  handwriting: "PatrickHand",
  body: "Quicksand",
};

const mmToPt = (mm: number) => mm * 2.835;

interface BookPdfDocumentProps {
  book: Book;
}

export default function BookPdfDocument({ book }: BookPdfDocumentProps) {
  const dims = PAGE_SIZE_DIMENSIONS[book.pageSize];
  const pageWidth = mmToPt(dims.width);
  const pageHeight = mmToPt(dims.height);

  const renderPageContent = (page: BookPage, index: number) => {
    const fontFamily = fontFamilyMap[page.fontFamily] || "Quicksand";

    const textStyle = {
      fontFamily,
      fontSize: page.fontSize * 0.6,
      color: page.textColor,
      lineHeight: 1.6,
    };

    const textBlock = (
      <View style={{ padding: 20, flex: page.layout === "full-text" ? 1 : undefined, justifyContent: "center" as const }}>
        <Text style={textStyle}>{page.text}</Text>
      </View>
    );

    const imageBlock = page.imageUrl ? (
      <View style={{ flex: 1 }}>
        <Image src={page.imageUrl} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
      </View>
    ) : (
      <View style={{ flex: 1, backgroundColor: "#F8F9FA" }} />
    );

    switch (page.layout) {
      case "cover":
        return (
          <View style={{ flex: 1, justifyContent: "center", alignItems: "center", padding: 30 }}>
            <Text
              style={{
                fontFamily: "Baloo2",
                fontSize: 28,
                color: page.textColor,
                textAlign: "center",
                marginBottom: 20,
              }}
            >
              {page.title || book.title}
            </Text>
            {page.imageUrl && (
              <Image
                src={page.imageUrl}
                style={{ width: 150, height: 150, objectFit: "cover", marginBottom: 20, borderRadius: 8 }}
              />
            )}
            <Text
              style={{
                fontFamily,
                fontSize: 14,
                color: page.textColor,
                textAlign: "center",
                opacity: 0.7,
              }}
            >
              {page.author || book.author}
            </Text>
          </View>
        );

      case "full-image":
        return imageBlock;

      case "full-text":
        return (
          <View style={{ flex: 1, justifyContent: "center", alignItems: "center", padding: 30 }}>
            <Text style={{ ...textStyle, textAlign: "center" }}>{page.text}</Text>
          </View>
        );

      case "text-bottom":
        return (
          <View style={{ flex: 1 }}>
            {imageBlock}
            {textBlock}
          </View>
        );

      case "text-top":
        return (
          <View style={{ flex: 1 }}>
            {textBlock}
            {imageBlock}
          </View>
        );

      case "text-left":
        return (
          <View style={{ flex: 1, flexDirection: "row" }}>
            <View style={{ flex: 2 }}>{textBlock}</View>
            <View style={{ flex: 3 }}>{imageBlock}</View>
          </View>
        );

      case "text-right":
        return (
          <View style={{ flex: 1, flexDirection: "row" }}>
            <View style={{ flex: 3 }}>{imageBlock}</View>
            <View style={{ flex: 2 }}>{textBlock}</View>
          </View>
        );

      default:
        return textBlock;
    }
  };

  return (
    <Document title={book.title} author={book.author}>
      {book.pages.map((page, index) => (
        <Page
          key={page.id}
          size={{ width: pageWidth, height: pageHeight }}
          style={{
            backgroundColor: page.backgroundColor,
            position: "relative",
          }}
        >
          {renderPageContent(page, index)}
          {page.showPageNumber && page.layout !== "cover" && (
            <Text
              style={{
                position: "absolute",
                bottom: 8,
                left: 0,
                right: 0,
                textAlign: "center",
                fontSize: 8,
                color: "#B0BEC5",
              }}
            >
              {index + 1}
            </Text>
          )}
        </Page>
      ))}
    </Document>
  );
}
