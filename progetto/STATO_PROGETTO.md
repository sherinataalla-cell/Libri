# STATO PROGETTO — L'Ombra del Vesper

> **File di stato corrente.** Aggiornare dall'orchestratrice ad ogni sincronizzazione significativa.

---

## §POSIZIONE

```
@capitolo.corrente: 08 (scritto, importato)
@capitolo.next: 09 (da scrivere)
@parole.totali: ~60.000 stimato (8 capitoli, ~7.500 parole/cap)
@completamento: ~40% (8/20 capitoli)
@versione_grafo: 0.0.0 (inizializzato, cap_01+cap_02 distillati)
@versione_schema: bozza (grafo_schema.json — Fase 02 non ancora completata)
@branch.attivo: claude/chapter-2-distillation-dvm3g
```

---

## §STRUTTURA NARRATIVA

```
◉movimenti:
  Movimento 1 — La Danza     (cap. 01-05): ✅ scritti
  Movimento 2 — La Caduta    (cap. 06-10): 🟡 parziale (cap.06-08 scritti)
  Movimento 3 — La Crisi     (cap. 11-15): ⬜ da scrivere
  Movimento 4 — La Battaglia (cap. 16-20): ⬜ da scrivere

◉capitoli.scritti:
  cap_01 — Il Cacciatore e la Preda       (POV Rory / Dante) ✅
  cap_02 — Maschere di Velluto            (POV Rory / Dante) ✅
  cap_03 — Il Contratto Non Scritto       (POV Rory / Dante) ✅
  cap_04 — Territori Pericolosi           (POV Rory / Dante) ✅
  cap_05 — Il Primo Sangue                (POV Rory / Dante) ✅
  cap_06 — Quello che Non Diciamo         (POV Rory / Dante) ✅
  cap_07 — Il Gioco del Cacciatore        (POV Rory / Dante) ✅
  cap_08 — Fantasmi e Ombre               (POV Rory / Dante) ✅
```

---

## §GRAFO — STATO DISTILLAZIONE

```
◉bootstrap: ✅ completato (story_graph.json — 10 entità iniziali)
◉entità.promosse.extra: marco, alexei, ufficio_dante (da cap_01)
◉misalignments: misalignments.json aperto (M01, M02, M03, M04)

◉distillazione.retroattiva:
  cap_01 ✅ — 9 scene, 5 seeds, 2 debts, 3 entità promosse (2026-06-05)
  cap_02 ✅ — 11 scene, 5 seeds, 5 debts, 10 entità promosse (2026-06-05)
  cap_03 ⬜
  cap_04 ⬜
  cap_05 ⬜
  cap_06 ⬜
  cap_07 ⬜
  cap_08 ⬜
```

---

## §ATTIVITÀ PIPELINE

```
@fase.corrente: Fase 03 — Distillazione retroattiva cap.01-08

@blocchi.fatti:
  ✅ Documenti-anima importati (bibbia, framework, carta_voce)
  ✅ 8 capitoli in narrazione_fattuale/ + testi_finali/
  ✅ grafo_schema.json (bozza funzionale)
  ✅ glossario_consegna.json (entità principali)
  ✅ bootstrap_graph.py --apply eseguito
  ✅ cap_01 distillato nel grafo (Passate 0→1→2 complete)
  ✅ Catalogo: schede embrionali per marco, alexei, ufficio_dante

@blocchi.pending:
  🟡 Distillazione cap_02..08 (una per chat)
  🟡 Completare grafo_schema.json — Fase 02 (skill architetto_grafo) — può attendere
  🟡 Completare glossario_consegna.json — entità secondarie — può attendere
  🟡 pattern_ai_da_bandire.md — chat dedicata
  🟡 Catalogo bootstrap completo (--bootstrap-catalog) — dopo distillazione cap.01-08
  🟡 Brief cap.09 (Fase 05) — dopo distillazione completa
  🟡 Prosa cap.09 (Fase 06) — dopo brief
```

---

## §PROSSIMA SESSIONE

```
@obiettivo: distillazione cap_03 — "Il Contratto Non Scritto"
@branch: creare claude/chapter-3-distillation-XXXXX (nuovo branch da main)
@regola: una unità per chat — non mescolare cap_03 e cap_04

@passi:
  1. Leggere STATO_PROGETTO.md (questo file)
  2. Verificare/creare branch per cap_03
  3. Leggere story_graph.json per vedere seeds/debts aperti da cap_02
  4. Leggere narrazione_fattuale/cap_03.md
  5. Avviare distillazione cap_03 (Passata 0 → 1 → 2)
```

---

## §MISALIGNMENT APERTI

```
M01 — POV order cap_01: framework dice Dante/Rory, testo è Rory/Dante [bassa gravità]
M02 — Campo 'pov' assente da TEMPLATE_unita.yaml e write_node_to_graph.py [media gravità]
M03 — Macchia di sangue polsino Dante (cap_02): origine non spiegata [bassa gravità]
M04 — voce_nel_buio "sente" Rory senza spiegazione meccanismo percettivo [media gravità]
→ Dettagli: progetto/misalignments.json
```

---

## §NOTE

```
@data.ultima.modifica: 2026-06-05
@evento: distillazione cap_02 completa (11 scene, 10 entità promosse, 2 misalignment annotati)
@stato: pronto per distillazione cap_03
```
