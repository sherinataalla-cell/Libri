import { Book } from "@/types/book";

export function createSampleBook(): Book {
  return {
    id: "sample-1",
    title: "Il Piccolo Esploratore",
    author: "Maria Rossi",
    pageSize: "square",
    pages: [
      {
        id: "page-cover",
        layout: "cover",
        text: "",
        imageUrl: null,
        backgroundColor: "#FFE4B5",
        textColor: "#8B4513",
        fontFamily: "display",
        fontSize: 36,
        showPageNumber: false,
        title: "Il Piccolo Esploratore",
        author: "di Maria Rossi",
      },
      {
        id: "page-1",
        layout: "text-bottom",
        text: "C'era una volta un piccolo esploratore di nome Leo che viveva in una casetta ai margini di un grande bosco.",
        imageUrl: null,
        backgroundColor: "#E8F5E9",
        textColor: "#2E7D32",
        fontFamily: "handwriting",
        fontSize: 22,
        showPageNumber: true,
      },
      {
        id: "page-2",
        layout: "text-left",
        text: "Ogni mattina Leo si svegliava con una grande curiosità: \"Cosa scoprirò oggi?\" si chiedeva guardando fuori dalla finestra.",
        imageUrl: null,
        backgroundColor: "#E3F2FD",
        textColor: "#1565C0",
        fontFamily: "handwriting",
        fontSize: 22,
        showPageNumber: true,
      },
      {
        id: "page-3",
        layout: "text-right",
        text: "Un giorno trovò una mappa misteriosa nascosta sotto una pietra. \"Un'avventura!\" esclamò con gli occhi brillanti.",
        imageUrl: null,
        backgroundColor: "#FFF3E0",
        textColor: "#E65100",
        fontFamily: "handwriting",
        fontSize: 22,
        showPageNumber: true,
      },
      {
        id: "page-4",
        layout: "text-top",
        text: "Seguendo la mappa, attraversò prati fioriti, saltò ruscelli scintillanti e si arrampicò su dolci colline verdi.",
        imageUrl: null,
        backgroundColor: "#F3E5F5",
        textColor: "#6A1B9A",
        fontFamily: "handwriting",
        fontSize: 22,
        showPageNumber: true,
      },
      {
        id: "page-5",
        layout: "full-text",
        text: "Alla fine del viaggio, Leo scoprì il tesoro più prezioso di tutti: un albero magico i cui frutti erano storie infinite.\n\n\"La vera avventura,\" pensò Leo sorridendo, \"è nella curiosità che ci guida.\"\n\nFine.",
        imageUrl: null,
        backgroundColor: "#FFFDE7",
        textColor: "#F57F17",
        fontFamily: "display",
        fontSize: 24,
        showPageNumber: true,
      },
    ],
  };
}

export function createEmptyPage(id: string): import("@/types/book").BookPage {
  return {
    id,
    layout: "text-bottom",
    text: "",
    imageUrl: null,
    backgroundColor: "#FFFFFF",
    textColor: "#333333",
    fontFamily: "body",
    fontSize: 24,
    showPageNumber: true,
  };
}
