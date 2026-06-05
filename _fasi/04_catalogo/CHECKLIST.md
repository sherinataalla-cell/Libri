# Fase 04 — Checklist per ogni scheda

> Lista di controllo passo-passo. Spunta ogni voce prima di consegnare la scheda all'autore.

---

## ✅ Pre-compilazione

- [ ] ho letto `PIPELINE.md` di questa fase
- [ ] ho letto i documenti di canone trasversale del progetto
- [ ] ho letto il template della tipologia di entità
- [ ] ho letto un esempio di scheda già canonizzata, se esiste
- [ ] ho letto la skill `critic_fisica_realismo` per sapere cosa verificherà

## ✅ Frontmatter

- [ ] `id` snake_case ASCII, stabile, univoco
- [ ] `name` esteso (visualizzato)
- [ ] `famiglia` (es. personaggio / luogo / oggetto / categoria specifica)
- [ ] `sottotipo` (sotto-categoria della famiglia, se rilevante)
- [ ] `tipo_grafo` (riferimento al campo `type` del nodo grafo)
- [ ] `ruolo_saga` (riferimento al campo `role_saga` del nodo grafo)
- [ ] `status: provvisorio` (default iniziale)
- [ ] `ultima_modifica` aggiornata
- [ ] `fonti` con almeno una voce (riferimento al nodo grafo o alla bibbia)
- [ ] `appare_in_storie` (lista, anche vuota)
- [ ] `relazioni` (dimora se applicabile, quartiere, related_to, cross_skill)

## ✅ Compilazione body

Per ogni sezione canonica del template:

- [ ] **Identità visuale (sintesi)** — 1 paragrafo. A colpo d'occhio.
- [ ] **Aspetto / forma** — descrizione fisica dettagliata. Travaso 1:1 da bibbia + derivazione autoriale dichiarata.
- [ ] **Abbigliamento / stato d'uso** — firma visiva canonica, varianti permesse, vincoli stagionali (se applicabili).
- [ ] **Espressione / comportamento** — tratti comportamentali esteriori, gesti tipici, modalità.
- [ ] **Palette e atmosfera** — palette canonica, atmosfera tipica.
- [ ] **Contesto e ambientazioni ricorrenti** — luoghi tipici dove appare l'entità.
- [ ] **Coerenza cross-scena (cose che NON cambiano)** — invarianti dell'entità.
- [ ] **Variabilità ammessa** — cosa può variare fra apparizioni.
- [ ] **Cliché da evitare** — pattern visivi/narrativi banditi per l'entità.
- [ ] **Per stampa 3D** (se progetto illustrato + 3D) — note su modello tridimensionale.
- [ ] **Per narrativa e social** — pattern di descrizione esterna.
- [ ] **Storie / scene di apparizione** — lista derivata dal grafo.
- [ ] **Disallineamenti / domande aperte** — note su incoerenze rilevate o decisioni rimandate.
- [ ] **Riferimenti puntuali (citazioni dirette dalle fonti)** — ogni dato canonico citato con riferimento puntuale alla fonte.

## ✅ Sezioni multi-blocco (per entità complesse)

Se l'entità è complessa (es. luogo con esterno + interno + cortile):

- [ ] **⭐ Descrizione visiva canonica per generazione — ESTERNO** (sempre presente per luoghi)
- [ ] **⭐ Descrizione visiva canonica per generazione — INTERNO** (se applicabile)
- [ ] **⭐ Descrizione visiva canonica per generazione — CORTILE / ANNESSI** (se applicabile)

I tre blocchi sono distinti e separati. Mai mescolati.

## ✅ Asset di output (se previsti dal progetto)

Per progetti illustrati / audio / fumetto:

- [ ] `prompt_<modello>.md` compilato (stylesheet canone + blocco entity dalla scheda + N angoli/modalità + negative prompt)
- [ ] N immagini/audio/sample canonici di riferimento generati e nominati con pattern stabile (`<id>_canonica_v1_<vista>.<estensione>`)

Per progetti di solo testo: skip.

## ✅ Descrizione narrativa-social (opzionale)

Se il progetto necessita materiale marketing/pubblicazione:

- [ ] `descrizione_narrativa_social.md` compilato con i 7 registri d'uso (tag breve / scheda riga / paragrafo descrittivo / paragrafo evocativo / registri d'uso / cosa NON dire / frasi tipiche se parla)

## ✅ Validazione critic

- [ ] scheda passata al `critic_fisica_realismo`
- [ ] critic ha dato OK pulito, **oppure** issue rilevati sono stati corretti / segnalati all'autore
- [ ] eventuali misalignment rilevati dal critic sono stati annotati nel rolling file

## ✅ Status finale

- [ ] `status` nel frontmatter aggiornato (`provvisorio` o `canonico`)
- [ ] se `canonico`: l'autore ha approvato esplicitamente
- [ ] se `canonico`: gli asset associati sono finalizzati (immutabili come reference)

## ✅ Indice catalogo (a chiusura batch)

- [ ] `python3 _scripts/build_catalog_index.py` lanciato con successo
- [ ] indice generato in `<repo-progetto>/.../catalogo_index/data/entities.json` (o equivalente)
