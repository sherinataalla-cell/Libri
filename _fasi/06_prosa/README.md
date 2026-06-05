# Fase 06 — Prosa (agente IA + umano in chat dedicata)

> L'agente prosa riceve il brief autosufficiente e applica la voce autoriale sui contenuti già fissati, una pagina alla volta, in chat dedicata con l'autore.

## Cosa accade in questa fase

L'orchestratrice apre una **chat dedicata** in cui l'autore e l'agente prosa lavorano focalizzati. L'orchestratrice **non guarda** la chat — riceve solo l'esito quando la chat chiude (testo finale committato).

L'agente prosa, ricevuto il brief della Fase 05:

1. Conferma all'autore di aver letto, propone un piano (lunghezza target, scene/pagine, registro, frasi codificate da preservare, callback aperti)
2. Scrive una pagina/scena alla volta. Mai 2 pagine in fila senza pausa
3. Dopo ogni blocco, si ferma. L'autore valida o chiede modifiche, l'agente applica e ripresenta lo stesso blocco prima di passare al successivo
4. A pagina/scena completata, scrive un consuntivo: pattern-firma applicati, frasi codificate integrate, callback chiusi, semi piantati, punti di incertezza residui

L'agente prosa **non inventa, non reinterpreta, non aggiunge canone**. Applica voce. Se gli serve un dato che non c'è nel brief, segnala — è il sintomo che manca qualcosa nelle 4 fonti, e l'orchestratrice torna a Fase 04 o 05.

## Input

- Il brief della Fase 05 — autosufficiente, fonte unica
- L'autore in chat dedicata
- `_skills/prosa/` (Layer 0) come prompt autoiniziante per l'agente

## Output atteso

- `<repo-progetto>/.../testi_finali/<id>_<slug>.md` — testo finale dell'unità narrativa
- Frontmatter machine-readable
- Marker machine-readable nel testo per il compositore output (vedi `_convenzioni/marker_machine_readable.md`):
  - marker di livello narrativo (una scena/hook = un blocco)
  - marker di livello pagina-prodotto fisica (per illustrato/fumetto/impaginazione)
- Annotazioni autoriali separate (note su scelte di voce, dubbi, alternative)
- Eventuale inventario testuale per audit/QA prosa

## Stato di uscita atteso

Testo finale dell'unità narrativa committato. Da qui passa alla Fase 07 (editing + composizione + asset finali se previsti).

## Skill chiamate dall'orchestratrice in questa fase

- `_skills/prosa/` (Layer 0) — agente che scrive in chat dedicata con l'autore
- Eventuale specializzazione Layer 1 in questa cartella per medium specifici (prosa albo illustrato vs prosa romanzo vs sceneggiatura fumetto vs script audio)

Tipologia operativa: **agente-in-chat-dedicata** (vedi `ARCHITETTURA.md` §7.2). L'orchestratrice avvia, non guarda, riceve esito.

## Cosa NON va in questa fase

- non si modificano grafo, catalogo, bibbia, carta voce (sono fissi)
- non si rifetcha materiale dalla repo durante la chat (il brief è autosufficiente)
- non si scrivono 2 pagine in fila senza pausa dell'autore
- non si chiama un critic agent automatico sulla prosa: il critico è l'autore

## Stato

✅ Cartella popolata: PIPELINE.md, esempi formato blocco, template annotazioni post-prosa, template inventario QA, skill_overlay prosa.
