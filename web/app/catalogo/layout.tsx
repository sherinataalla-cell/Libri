import { getEntitiesData } from "@/lib/data";
import { SidebarProvider } from "@/components/catalogo/sidebar-provider";
import { SidebarDesktop } from "@/components/catalogo/sidebar-desktop";
import { TopbarMobile } from "@/components/catalogo/topbar-mobile";

export default async function CatalogoLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const data = await getEntitiesData();

  return (
    <SidebarProvider>
      <div className="catalogo-shell flex min-h-screen">
        <SidebarDesktop tree={data.tree} totalEntities={data.totals.totale} />
        <div className="min-w-0 flex-1 flex flex-col">
          <TopbarMobile tree={data.tree} totalEntities={data.totals.totale} />
          <div className="flex-1 px-4 py-6 catalogo-sidebar-desktop:px-8 catalogo-sidebar-desktop:py-10">
            {children}
          </div>
        </div>
      </div>
    </SidebarProvider>
  );
}
