import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Libri - Impaginazione Libri per Bambini",
  description: "Crea e impagina bellissimi libri per bambini con esportazione PDF",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="it">
      <body className="h-screen flex flex-col overflow-hidden bg-gray-50">
        {children}
      </body>
    </html>
  );
}
