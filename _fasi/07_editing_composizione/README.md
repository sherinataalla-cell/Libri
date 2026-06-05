# Fase 07 — Editing + Composizione + Output finale

> Le passate finali: revisione editoriale, asset finali se previsti (illustrazioni, audio, impaginazione), compositore output (PDF / EPUB / HTML / fumetto / audio / web).

## Cosa accade in questa fase

Fase di **chiusura**. Il testo finale (Fase 06) viene rivisto, accompagnato dagli asset previsti dal medium, e composto nel prodotto finale distribuibile.

Sotto-fasi tipiche (variano per medium):

### 7a — Editing
Revisione editoriale del testo finale: refusi, microcorrezioni di voce, pulizie. È l'unica fase del kit dove l'umano lavora *senza* AI o con AI minimale (es. controllo refusi automatico). Le correzioni di voce restano umane.

### 7b — Asset finali (se previsti)
Generazione delle immagini-scena composte per illustrato/fumetto, audio per podcast narrativo, ecc. Le immagini canoniche del catalogo (Fase 04) sono *reference*; le immagini-scena composte qui sono *prodotto finale*: una per pagina-prodotto fisica, naming deterministico, riferite dai marker machine-readable nel testo.

### 7c — Compositore output
Script che assembla testo finale + asset componendo il prodotto finale (PDF stampa, EPUB, HTML, fumetto, audio mixato, sito web). Legge i marker machine-readable per orientarsi.

## Input

- Testo finale della Fase 06
- Catalogo della Fase 04 (per asset reference)
- Schede di compositore in `_convenzioni/marker_machine_readable.md`
- Eventuali skill per asset specifici (illustratore, audio designer, impaginatore)

## Output atteso

- Testo finale editato
- Asset finali (se previsti) nominati deterministicamente
- Prodotto finale: PDF / EPUB / HTML / fumetto / audio / sito web

## Stato di uscita atteso

Prodotto finale distribuibile. Eventuale audit di coerenza finale (catalogo riferito coerentemente, marker rispettati, naming asset corretto).

## Skill chiamate dall'orchestratrice in questa fase

- `_skills/illustratore/` (Layer 0, opzionale) — per progetti illustrati, gestisce generazione immagini-scena composte
- `_skills/impaginatore/` (Layer 0, opzionale) — per progetti con impaginazione complessa
- `_skills/audio_designer/` (Layer 0, opzionale) — per progetti audio
- script idempotente di **compositore output** (in `_scripts/` del kit)

## Cosa NON va in questa fase

- non si torna a modificare grafo, catalogo, bibbia, brief, prosa salvo errori manifesti
- non si reinterpreta il testo finale durante la composizione
- non si saltano i marker machine-readable: sono il contratto col compositore

## Stato

🟡 Cartella creata, README dichiarativo presente. Skill illustratore/impaginatore/audio_designer da definire dopo aver chiarito i casi d'uso. Compositore output template da scrivere (è il "buco di fine pipeline" identificato nelle discussioni preliminari — non urgente).
