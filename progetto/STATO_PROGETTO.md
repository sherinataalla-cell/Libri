# STATO PROGETTO — Coinquilini per Contratto

> **File di stato corrente.** Aggiornare ad ogni sincronizzazione significativa.

---

## §POSIZIONE

```
@capitolo.corrente: 02 (distillato + brief pronto, prosa da scrivere)
@capitolo.next: 03 (da distillare)
@parole.totali: cap.01 in prosa (testo finale scritto) — cap.02 testo da scrivere
@completamento: cap.01 in prosa (1/20) — cap.02 in stato brief_ready
@versione_grafo: 0.0.0 (bootstrap fatto, 9 entità + nodi cap_01, cap_02)
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
◉unità distillate: cap_01 (4 scene), cap_02 (4 scene) — status scenes_distilled
◉misalignments: nessuno aperto
◉audit noto: audit_3 (navigability) segnala seed/debt non registrati in
  global_relations (narrative_promises/narrative_debts vuoti) — gap di tooling
  preesistente dal cap_01 (write_node non popola i registri). Da colmare in un
  giro dedicato, non bloccante per brief/prosa.
```

---

## §ATTIVITÀ PIPELINE

```
@fase.corrente: cap.01 → prosa scritta (Fase 06 fatta). cap.02 → Fase 03 (distillato)
  + Fase 05 (brief pronto) → prossimo Fase 06 (prosa cap.02)

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
  ✅ Fase 06 — prosa cap_01 → progetto/testi_finali/cap_01.md (+ annotazioni)
  ✅ Fase 03 — distillazione cap_02 (nodo + 4 scene + narrazione fattuale)
  ✅ Fase 05 — brief cap_02 → progetto/briefs/cap_02_brief.md (COMPLETO: catalogo + pattern AI)

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
@data.ultima.modifica: 2026-06-07
@evento: distillazione cap.02 + brief cap.02 pronto
@stato: cap.01 in prosa; cap.02 brief_ready → prossimo prosa cap.02
```
