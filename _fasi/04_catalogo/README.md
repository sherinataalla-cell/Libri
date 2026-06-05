# Fase 04 — Catalogo (entità promosse + arricchimento schede)

> Per ogni entità del grafo si scrive una **scheda canonica** nel catalogo: vista esterna strutturata dell'entità, fonte sensoriale per la prosa e per gli asset di output (se previsti).

## Cosa accade in questa fase

Per ogni entità promossa nel grafo a livello macro (Fasi 02 e 03), si compila una scheda nel catalogo seguendo il **template-pattern B** (vedi `ARCHITETTURA.md` §5).

Il lavoro si fa a coppia di agenti, in **loop chiuso**:

- agente **catalogatore-compilatore** propone i contenuti delle sezioni della scheda, derivando da bibbia + grafo + glossario-consegna + chat con l'autore
- agente **critic-fisica-realismo** valida coerenza fisica, realismo, coerenza interna contro grafo e bibbia (es. "questo personaggio sta cucinando con un coltello che secondo grafo non possiede ancora a quel punto della saga"; "questo legno è stato segato due settimane fa, non può essere usato come tavolo finito")
- l'orchestratrice avvia il loop, riceve l'esito ("scheda canonica" oppure "blocco — serve umano"). L'umano interviene quando il critic blocca o quando il catalogatore chiede una decisione autoriale

Le sezioni della scheda non popolate restano marcate `_da popolare_` (è un protocollo di stato, vedi `ARCHITETTURA.md` §5.3), riempite in **passate successive** quando ci sono più dati. Ogni passata riempitiva è contestualizzata: l'agente legge il contesto attorno al `null` e completa, mai inventa.

## Input

- Il grafo aggiornato dalla distillazione (Fase 03)
- Il glossario-consegna della Fase 01 (è il pre-catalogo embrionale)
- I template di scheda (in `_schede_template/`, da popolare)
- I documenti-anima della Fase 01 (bibbia per il travaso 1:1, carta voce per le note voce)
- Eventuale fetch web per riferimenti visivi/sonori/atmosferici (con autorizzazione dell'autore)

## Output atteso

- Per ogni entità di livello macro nel grafo, una scheda in `<repo-progetto>/catalogo/<famiglia>/<id>/scheda.md`
- Frontmatter machine-readable (id, nome, famiglia, sottotipo, fonti, status, relazioni)
- Body con sezioni canoniche compilate o marcate `_da popolare_`
- Eventuali asset associati nella sottocartella della scheda (immagini canoniche, prompt di generazione, sample audio, mood board) — solo se il progetto ha quel canale di output
- `descrizione_narrativa_social.md` per uso pubblico/marketing (opzionale)
- Status della scheda: `provvisorio` o `canonico`

## Stato di uscita atteso

Quando una scheda passa da `provvisorio` a `canonico`, l'autore l'ha approvata e diventa **immutabile come reference** — gli asset associati (es. immagini canoniche `<id>_canonica_v1_*.<estensione>`) sono intoccabili. Modifiche successive richiedono bump di versione esplicito.

## Skill chiamate dall'orchestratrice in questa fase

- `_skills/catalogatore/` (Layer 0) — compila body schede da fonti canoniche
- `_skills/critic_fisica_realismo/` (Layer 0) — valida coerenza fisica nel loop chiuso con catalogatore
- Eventuali specializzazioni Layer 1 in questa cartella (per medium/dominio)

Il loop **catalogatore ↔ critic-fisica-realismo** è il caso canonico di "agente-a-agente" descritto in `ARCHITETTURA.md` §7.2.

## Cosa NON va in questa fase

- non si modifica il grafo (è solo lettura)
- non si scrive prosa (Fase 06)
- non si toccano schede con status `canonico` senza bump esplicito

## Stato

✅ Cartella popolata: PIPELINE.md, CHECKLIST.md, PATTERN_ENTITA_COMPLESSE.md, PATTERN_BULK_INIZIALE.md, template scheda (personaggio, luogo, oggetto), template canone trasversale, template asset (prompt immagine), template descrizione narrativa-social, skill_overlay catalogatore + critic_fisica.
