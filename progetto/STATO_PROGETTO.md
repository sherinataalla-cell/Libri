# STATO PROGETTO — Coinquilini per Contratto

> **File di stato corrente.** Aggiornare ad ogni sincronizzazione significativa.

---

## §POSIZIONE

```
@capitolo.corrente: 01 (distillato + brief pronto, prosa da scrivere)
@capitolo.next: 02 (da distillare)
@parole.totali: 0 (testo finale ancora da scrivere)
@completamento: 0% (0/20 capitoli in prosa) — cap.01 in stato brief_ready
@versione_grafo: 0.0.0 (bootstrap fatto, 9 entità + nodo cap_01)
@versione_schema: 1.0.0 (story_graph.json bootstrappato dallo schema)
```

---

## §STRUTTURA NARRATIVA

```
◉atti:
  Atto I  — La Gabbia     (cap. 01-06): ⬜ da scrivere
  Atto II — Il Patto      (cap. 07-15): ⬜ da scrivere
  Atto III— La Terza Via  (cap. 16-20): ⬜ da scrivere

◉heat.map:
  cap.01-04: tensione mascherata
  cap.05-07: prima crepa
  cap.08-09: prima resa (esplicito)
  cap.10-13: il patto (esplicito ricorrente)
  cap.14-16: rottura del patto
  cap.17-20: resa emotiva + HEA
```

---

## §GRAFO — STATO DISTILLAZIONE

```
◉bootstrap: ✅ story_graph.json (schema v1.0.0, graph v0.0.0)
◉entità: 9 promosse (3 characters, 3 locations, 1 group, 2 objects)
◉unità distillate: cap_01 (4 scene, status scenes_distilled)
◉misalignments: nessuno aperto
```

---

## §ATTIVITÀ PIPELINE

```
@fase.corrente: Fase 05 completata per cap.01 (brief pronto) → prossimo Fase 06 (prosa)

@blocchi.fatti:
  ✅ DNA Libro → progetto/_documenti_anima/bibbia.md
  ✅ DNA Capitoli → progetto/_documenti_anima/framework_strutturale.md
  ✅ Vocabolario Frattale → progetto/_documenti_anima/carta_voce.md
  ✅ grafo_schema.json (usato per bootstrap, v1.0.0)
  ✅ glossario_consegna.json (entità principali)
  ✅ Fase 02 — bootstrap story_graph.json (9 entità)
  ✅ Fase 03 — distillazione cap_01 (nodo + 4 scene + narrazione fattuale)
  ✅ Fase 04 — catalogo: schede francesca_ferrante, giovanni_liguori, palazzo_aldovrandi (provvisorie) + indice
  ✅ pattern_ai_da_bandire.md → progetto/_documenti_anima/ (proposta da validare)
  ✅ Fase 05 — brief cap_01 → progetto/briefs/cap_01_brief.md (COMPLETO: catalogo + pattern AI, zero fallback)

@blocchi.pending:
  🟡 Validare pattern_ai_da_bandire.md (voce/stile = decisione autoriale) + raffinare dopo cap.1-8 in prosa
  🟡 Schede catalogo: sezioni `_da popolare_` (aspetto fisico/guardaroba) + passaggio critic_fisica_realismo
  🟡 Builder brief: §6 convenzioni mondo e §9 quote tracker sono TODO interni allo script (non lacune di fonte)
  🟡 Fase 06 — prosa cap.01 (in chat dedicata, dal brief)
```

---

## §PROSSIMA SESSIONE

```
@obiettivo: validare la bozza di distillazione cap.01 + scrivere la prosa

@passi suggeriti:
  1. Rivedere la bozza distillazione cap_01 (narrazione fattuale + nodo grafo):
     - confermare/correggere i valori provvisori (time_of_day, atmosfere)
     - decidere su entità "notaio" (promuovere o lasciare in narrazione)
  2. (Opzionale) Fase 04 — catalogo schede Francesca/Giovanni/palazzo, poi
     rigenerare il brief per arricchire il canone visivo
  3. Fase 06 — prosa cap.01 in chat dedicata, partendo da
     progetto/briefs/cap_01_brief.md (doppio POV, prima persona presente)
```

---

## §MISALIGNMENT APERTI

```
(nessuno)
```

---

## §NOTE

@comando.build_brief (path fonti non-default, da usare sempre):
  REPO_ROOT=progetto \
  CARTA_VOCE_PATH=progetto/_documenti_anima/carta_voce.md \
  BIBBIA_PATH=progetto/_documenti_anima/bibbia.md \
  PATTERN_AI_PATH=progetto/_documenti_anima/pattern_ai_da_bandire.md \
  CATALOG_DIR=progetto/catalogo NARRAZIONE_DIR=progetto/narrazione_fattuale \
  BRIEFS_DIR=progetto/briefs \
  python3 _scripts/build_brief.py --unit cap_NN
```

```
@data.ultima.modifica: 2026-06-06
@evento: setup repo per nuova storia Coinquilini per Contratto
@stato: pronto per Fase 02 → bootstrap → scrittura cap.01
```
