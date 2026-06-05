# `_template_misalignments/` — Template rolling file di misalignment

Pattern del rolling file `<repo-progetto>/.../misalignments.json` (o equivalente nominato dal progetto), dove gli agenti IA segnalano incoerenze fra le fonti del progetto durante distillazione, compilazione catalogo, audit.

## Forma

Vedi `TEMPLATE_misalignments.json`. Due liste:

- `open`: misalignment rilevati ma non ancora risolti dall'autore
- `resolved`: misalignment risolti, mantenuti come trail di audit storico (mai cancellati)

## Quando si scrive

- **distillatore** in passata 2 (co-autore consultivo) annota incoerenze rilevate fra catalogo / grafo / bibbia
- **catalogatore** durante la compilazione di una scheda annota incoerenze fra fonti
- **critic_fisica_realismo** annota incoerenze fisiche/realismo grossolane
- **autore** in qualsiasi momento, manualmente, se rileva un'incoerenza esplorando il progetto

## Quando si risolve

L'autore fa **passate dedicate di risoluzione misalignment**: legge la lista `open`, decide caso per caso, sposta in `resolved` con la decisione presa.

Risolvere un misalignment può comportare:

- modifica del catalogo (se la decisione è "vince catalogo, da propagare ai nodi grafo che usano questi dati")
- modifica del grafo (se la decisione è "vince grafo, catalogo da aggiornare")
- modifica della bibbia (raro, richiede bump versione bibbia)
- nessuna modifica strutturale (se la decisione è "lasciamo entrambi, non è un vero conflitto")

## Vincolo

I misalignment **non si risolvono mai dentro la stessa chat in cui sono stati rilevati**. Sono notazioni asincrone, l'autore decide quando affrontarli.

Vedi `_convenzioni/stato_progetto.md` §2 per il dettaglio dei contenuti del rolling file.
