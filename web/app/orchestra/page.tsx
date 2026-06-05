// Atlante saga (Orchestra) — server component.
// Carica `orchestra.json` (prebuild) e monta header + view client.

import type { Metadata } from "next";

import { getOrchestraData } from "@/lib/orchestra";
import { HeaderOrchestra } from "@/components/orchestra/header-orchestra";
import { OrchestraView } from "@/components/orchestra/orchestra-view";

export const metadata: Metadata = {
  title: "Atlante saga",
  description:
    "Vista a tre tracce sull'asse temporale delle unità narrative: storie con archi semi, presenze personaggi, presenze luoghi. Deep linking via hash.",
};

export default async function OrchestraPage() {
  const data = await getOrchestraData();

  return (
    <main className="mx-auto max-w-[1400px] px-4 sm:px-6 py-8 space-y-6">
      <HeaderOrchestra
        graphVersion={data.graph_version}
        schemaVersion={data.schema_version}
        storiesCount={data.stories.length}
        charactersCount={data.characters.length}
        locationsCount={data.locations.length}
        seedsCount={data.seeds.length}
      />
      <OrchestraView data={data} />
    </main>
  );
}
