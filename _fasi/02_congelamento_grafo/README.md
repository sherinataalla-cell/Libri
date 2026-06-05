# Fase 02 — Congelamento Schema-Grafo

> Si fissa una volta per tutte la **forma** del grafo del progetto: quali campi nei nodi, quali relazioni globali, quali categorie di entità, quante granularità (livelli macro / medio / micro).

## Cosa accade in questa fase

L'autore (con eventuale supporto AI) decide la forma del grafo del progetto, partendo dal **template-pattern frattale a 3 livelli** del kit (vedi §4 di `ARCHITETTURA.md`) e specializzandolo per il proprio dominio:

- quali categorie tematiche di entità servono (personaggi e luoghi sono universali; oggetti, gruppi, fenomeni, artefatti, dispositivi sono opzionali e dipendono dal progetto)
- quali relazioni globali tenere (saghe lunghe: seeds + callbacks + debts + archi; opere singole: forse niente)
- quanti livelli usare (saga: tutti e 3; albo singolo: macro + micro; romanzo: macro + medio + micro)
- quali campi specializzare con nomi specifici al dominio
- quali tracciatori globali servono (contatori unicità, quote tracker, ecc.)

L'output è uno **schema-template del grafo** (file JSON canonico) che dichiara *la forma* di ogni nodo possibile, con campi obbligatori, opzionali, e tipi.

## Input

- `ARCHITETTURA.md` §4 (template-pattern A — il grafo come albero frattale)
- I documenti-anima della Fase 01 (specialmente: archi globali, glossario-consegna, framework strutturale silente)
- `_skills/architetto_grafo/` (Layer 0, da popolare)
- Eventuale specializzazione Layer 1 in questa cartella

## Output atteso

- `_schema_template/grafo_schema_v1.json` — schema canonico del grafo per il progetto
- `_schema_template/README.md` — note autoriali sulle scelte di specializzazione (perché questa categoria sì, perché questa no, ecc.)
- Eventuali script idempotenti di bootstrap/migrazione in `_scripts/` (nella cartella scripts del kit, non qui)

## Stato di uscita atteso

Lo schema è **congelato**. Da qui in avanti vale la regola d'oro (vedi `ARCHITETTURA.md` §4.8):

1. aggiunte di campo additive, mai rimozioni o rinominazioni
2. retroattive a `null` su tutti i nodi dello stesso livello
3. riempimento dei `null` solo in passate dedicate, contestualizzate, mai inventando
4. ogni modifica strutturale = bump di versione schema + script di migrazione idempotente con backup

## Skill chiamate dall'orchestratrice in questa fase

- `_skills/architetto_grafo/` (Layer 0) — agente che propone specializzazione del template-pattern frattale al dominio del progetto
- script idempotenti per bootstrap del grafo iniziale (vuoto ma con tutte le entità del glossario-consegna promosse a livello macro)

## Cosa NON va in questa fase

- non si riempie il contenuto del grafo (i nodi `stories.<sid>` restano vuoti o con solo identificatore — la distillazione storia per storia è la Fase 03)
- non si scrivono schede catalogo (Fase 04)
- non si modifica più dopo la chiusura, salvo passate riempitive

## Stato

🟡 Cartella creata, README dichiarativo presente. Schema-template grafo da scrivere — è una delle priorità del kit (collegato a Fase 04, perché grafo e catalogo si riferiscono a vicenda).
