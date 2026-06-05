import Link from "next/link";
import { ArrowRight, BookOpen, Compass, ImageIcon, Map as MapIcon } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { PROJECT_CONFIG } from "@/lib/project-config";

const BUILD_DATE = "2026-05-10";
const APP_VERSION = "0.5.0-kit";

export default function HomePage() {
  return (
    <main className="max-w-6xl mx-auto px-6 py-10 space-y-12">
      <header className="space-y-3 border-b border-rule-soft pb-8">
        <h1 className="font-serif font-semibold text-5xl tracking-tight text-ink">
          {PROJECT_CONFIG.title}
        </h1>
        <p className="font-serif italic text-xl text-ink-soft">
          {PROJECT_CONFIG.subtitle}
        </p>
      </header>

      <section className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2 text-accent-warm">
              <ImageIcon className="h-5 w-5" aria-hidden />
              <span className="font-mono text-xs uppercase tracking-wider">
                Catalogo
              </span>
            </div>
            <CardTitle>Catalogo entità</CardTitle>
            <CardDescription>
              Schede per personaggi, luoghi, oggetti — vista navigabile del catalogo del progetto.
            </CardDescription>
          </CardHeader>
          <CardContent className="text-ink-soft">
            <p>
              Catalogo entità con tree gerarchico, gallerie con lightbox,
              body editoriale collassabile, prompt di generazione asset
              dove disponibili.
            </p>
          </CardContent>
          <CardFooter>
            <Button asChild variant="default">
              <Link href="/catalogo" className="inline-flex items-center gap-2">
                Apri catalogo
                <ArrowRight className="h-4 w-4" aria-hidden />
              </Link>
            </Button>
          </CardFooter>
        </Card>

        <Card>
          <CardHeader>
            <div className="flex items-center gap-2 text-accent-warm">
              <BookOpen className="h-5 w-5" aria-hidden />
              <span className="font-mono text-xs uppercase tracking-wider">
                Storie
              </span>
            </div>
            <CardTitle>Unità narrative</CardTitle>
            <CardDescription>
              Le unità del progetto — prosa definitiva + asset associati per
              ogni unità di pagina-prodotto.
            </CardDescription>
          </CardHeader>
          <CardContent className="text-ink-soft">
            <p>
              Indice delle unità narrative del progetto, con dettaglio
              pagina-per-pagina e link alle tappe narrative.
            </p>
          </CardContent>
          <CardFooter>
            <Button asChild variant="default">
              <Link href="/storie" className="inline-flex items-center gap-2">
                Apri storie
                <ArrowRight className="h-4 w-4" aria-hidden />
              </Link>
            </Button>
          </CardFooter>
        </Card>

        {PROJECT_CONFIG.hasMappa && (
          <Card>
            <CardHeader>
              <div className="flex items-center gap-2 text-accent">
                <MapIcon className="h-5 w-5" aria-hidden />
                <span className="font-mono text-xs uppercase tracking-wider">
                  Cartografia
                </span>
              </div>
              <CardTitle>Mappa &amp; indice strade</CardTitle>
              <CardDescription>
                Mappa cartografica navigabile e indice dei percorsi del mondo
                del progetto.
              </CardDescription>
            </CardHeader>
            <CardContent className="text-ink-soft space-y-2">
              <p>
                L&apos;indice fornisce accesso a vicoli, sentieri, percorsi
                con link alle schede catalogo.
              </p>
            </CardContent>
            <CardFooter className="flex flex-wrap gap-2">
              <Button asChild variant="default">
                <Link href="/strade" className="inline-flex items-center gap-2">
                  Indice strade
                  <ArrowRight className="h-4 w-4" aria-hidden />
                </Link>
              </Button>
              <Button asChild variant="ghost">
                <Link href="/mappa" className="inline-flex items-center gap-2">
                  <Compass className="h-4 w-4" aria-hidden />
                  Mappa
                </Link>
              </Button>
            </CardFooter>
          </Card>
        )}

        <Card>
          <CardHeader>
            <div className="flex items-center gap-2 text-accent-warm">
              <Compass className="h-5 w-5" aria-hidden />
              <span className="font-mono text-xs uppercase tracking-wider">
                Orchestra
              </span>
            </div>
            <CardTitle>Atlante saga</CardTitle>
            <CardDescription>
              Vista narrativa cross-unità: tutte le unità sull&apos;asse
              temporale, archi dei semi, presenze personaggi e luoghi.
            </CardDescription>
          </CardHeader>
          <CardContent className="text-ink-soft">
            <p>
              Atlante a tre tracce con archi seed (planted → bloomed),
              side-panel per il dettaglio di ogni nodo, deep linking via hash.
            </p>
          </CardContent>
          <CardFooter>
            <Button asChild variant="default">
              <Link href="/orchestra" className="inline-flex items-center gap-2">
                Apri atlante
                <ArrowRight className="h-4 w-4" aria-hidden />
              </Link>
            </Button>
          </CardFooter>
        </Card>
      </section>

      <footer className="border-t border-rule-soft pt-6 font-mono text-xs text-ink-faint">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <span>v{APP_VERSION} · build {BUILD_DATE}</span>
          <span>Cruscotto editoriale · starter kit</span>
        </div>
      </footer>
    </main>
  );
}
