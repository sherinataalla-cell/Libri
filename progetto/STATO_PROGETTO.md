# STATO PROGETTO — L'Ombra del Vesper

> **File di stato corrente.** Aggiornare dall'orchestratrice ad ogni sincronizzazione significativa.

---

## §POSIZIONE

```
@capitolo.corrente: 08 (scritto, importato)
@capitolo.next: 09 (da scrivere)
@parole.totali: ~60.000 stimato (8 capitoli, ~7.500 parole/cap)
@completamento: ~40% (8/20 capitoli)
@versione_grafo: 0.0.0 (inizializzato, cap_01+cap_02+cap_03+cap_04+cap_05 distillati)
@versione_schema: bozza (grafo_schema.json — Fase 02 non ancora completata)
@branch.attivo: claude/chapter-5-distillation-6ZRPK
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
◉misalignments: misalignments.json aperto (M01, M02, M03, M04, M05, M06, M07)

◉distillazione.retroattiva:
  cap_01 ✅ — 9 scene, 5 seeds, 2 debts, 3 entità promosse (2026-06-05)
  cap_02 ✅ — 11 scene, 5 seeds, 5 debts, 10 entità promosse (2026-06-05)
  cap_03 ✅ — 11 scene, 4 seeds, 3 debts, 4 entità promosse (2026-06-05)
  cap_04 ✅ — 13 scene, 4 seeds, 2 debts, 1 entità promossa (2026-06-05)
  cap_05 ✅ — 17 scene, 5 seeds, 3 debts, 3 entità promosse (2026-06-05)
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
  ✅ cap_04 distillato nel grafo (13 scene, attico_dante promosso)
  ✅ cap_05 distillato nel grafo (17 scene, detective_chen + dimitri_volkov + album_fotografico promossi)

@blocchi.pending:
  🟡 Distillazione cap_05..08 (una per chat)
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
@obiettivo: distillazione cap_06 — "Quello che Non Diciamo"
@branch: creare claude/chapter-6-distillation-XXXXX (nuovo branch da main dopo merge cap_05)
@regola: una unità per chat — non mescolare cap_06 e cap_07

@passi:
  1. Merge branch cap_05 su main (su richiesta utente)
  2. Creare nuovo branch per cap_06
  3. Leggere story_graph.json per seeds/debts aperti da cap_05
  4. Leggere narrazione_fattuale/cap_06.md
  5. Avviare distillazione cap_06 (Passata 0 → 1 → 2)
```

---

## §MISALIGNMENT APERTI

```
M01 — POV order cap_01: framework dice Dante/Rory, testo è Rory/Dante [bassa gravità]
M02 — Campo 'pov' assente da TEMPLATE_unita.yaml e write_node_to_graph.py [media gravità]
M03 — Macchia di sangue polsino Dante (cap_02): origine non spiegata [bassa gravità]
M04 — voce_nel_buio "sente" Rory senza spiegazione meccanismo percettivo [media gravità]
M05 — interlocutore_numero_privato (cap_02) = contatto caccia (cap_03)? identità da confermare [bassa gravità]
M06 — prigioniero level-2 (cap_02) vs Sofia al level-2 (cap_03): stessa entità o due distinte? [media gravità]
M07 — voce_nel_buio (cap_02) vs voce_altoparlanti=Cacciatore (cap_03): coincidono? risolverebbe M04 [bassa gravità]
M08 — come il Cacciatore ha il numero privato di Dante (cap_04) [bassa gravità]
M09 — discrepanza timeline countdown: 48h−2h≠42h in cap_04 [bassa gravità]
M10 — il Cacciatore usa il numero di Alexei (cap_05): compromissione rete Dante [media gravità]
M11 — pronome ambiguo nel messaggio finale cap_05: chi ha "quasi preso" chi 2 anni fa? [bassa gravità]
→ Dettagli: progetto/misalignments.json
```

---

## §NOTE

```
@data.ultima.modifica: 2026-06-05
@evento: distillazione cap_05 completa (17 scene, 5 seeds, 3 debts, 3 entità promosse: detective_chen + dimitri_volkov + album_fotografico, 2 misalignment M10-M11)
@stato: pronto per distillazione cap_06 (dopo merge branch cap_05)
```
