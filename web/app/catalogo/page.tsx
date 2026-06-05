import type { Metadata } from "next";

import { getEntitiesData } from "@/lib/data";
import { StatsGrid } from "@/components/catalogo/stats-grid";
import { FeaturedGrid } from "@/components/catalogo/featured-grid";

export const metadata: Metadata = {
  title: "Catalogo entità",
  description:
    "Catalogo visuale: personaggi, luoghi, oggetti, venti, visual signatures.",
};

export default async function CatalogoHomePage() {
  const data = await getEntitiesData();

  return (
    <div className="space-y-10">
      <header className="space-y-2">
        <p className="font-mono text-[10px] uppercase tracking-wider text-ink-faint">
          Catalogo entità
        </p>
        <h1 className="font-serif text-4xl font-semibold tracking-tight text-ink">
          Catalogo entità
        </h1>
        <p className="font-serif text-lg italic text-ink-soft max-w-2xl">
          {data.totals.totale} schede vive — personaggi, luoghi, oggetti
          e categorie del progetto. Cerca, esplora il tree, apri una scheda
          per la galleria completa e il body editoriale.
        </p>
      </header>

      <StatsGrid totals={data.totals} byStatus={data.by_status} />

      <FeaturedGrid entities={data.entities} />

      <footer className="border-t border-rule-soft pt-4 font-mono text-[11px] text-ink-faint">
        <span>generato {data.generated_at}</span>
      </footer>
    </div>
  );
}
