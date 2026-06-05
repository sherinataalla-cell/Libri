import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { getAllEntityIds, getEntitiesData, getEntityById } from "@/lib/data";
import { parseBody } from "@/lib/markdown";
import { EntityHeader } from "@/components/catalogo/entity-header";
import { EntityGallery } from "@/components/catalogo/entity-gallery";
import { EntityBody } from "@/components/catalogo/entity-body";
import { FrontmatterBlock } from "@/components/catalogo/frontmatter-block";
import { PromptGrokBlock } from "@/components/catalogo/prompt-grok-block";

interface PageProps {
  params: Promise<{ id: string }>;
}

export async function generateStaticParams() {
  // Pre-renderizza tutte le 116 schede a build-time → static & cacheable.
  const ids = await getAllEntityIds();
  return ids.map((id) => ({ id }));
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { id } = await params;
  const entity = await getEntityById(id);
  if (!entity) {
    return { title: "Entità non trovata — Catalogo" };
  }
  return {
    title: `${entity.name} — Catalogo entità`,
    description: `${entity.famiglia}${entity.sottotipo ? ` · ${entity.sottotipo}` : ""}${entity.quartiere ? ` · quartiere ${entity.quartiere}` : ""}`,
  };
}

export default async function EntityPage({ params }: PageProps) {
  const { id } = await params;
  const data = await getEntitiesData();
  const entity = data.entities.find((e) => e.id === id);
  if (!entity) {
    notFound();
  }

  const parsedBody = parseBody(entity.body_md);

  return (
    <article className="mx-auto max-w-4xl space-y-6">
      <EntityHeader entity={entity} />

      {entity.images.length > 0 && (
        <EntityGallery images={entity.images} altPrefix={entity.name} />
      )}

      <FrontmatterBlock frontmatter={entity.frontmatter} />

      <EntityBody
        preambleHtml={parsedBody.preambleHtml}
        sections={parsedBody.sections}
      />

      {entity.has_prompt_grok && entity.prompt_grok_md && (
        <PromptGrokBlock promptMd={entity.prompt_grok_md} />
      )}
    </article>
  );
}
