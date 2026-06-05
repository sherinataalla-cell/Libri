# STATO PROGETTO — L'Ombra del Vesper

> **File di stato corrente.** Aggiornare dall'orchestratrice ad ogni sincronizzazione significativa.

---

## §POSIZIONE

```
@capitolo.corrente: 08 (scritto, importato)
@capitolo.next: 09 (da scrivere)
@parole.totali: ~60.000 stimato (8 capitoli, ~7.500 parole/cap)
@completamento: ~40% (8/20 capitoli)
@versione_grafo: 0.0.0 (inizializzato, cap_01+cap_02+cap_03+cap_04+cap_05+cap_06+cap_07+cap_08 distillati)
@versione_schema: bozza (grafo_schema.json — Fase 02 non ancora completata)
@branch.attivo: claude/chapter-8-distillation-x4qUG
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
  cap_06 ✅ — 10 scene, 5 seeds, 3 debts, 3 entità promosse (2026-06-05)
  cap_07 ✅ — 10 scene, 9 seeds, 4 debts, 3 entità promosse (2026-06-05)
  cap_08 ✅ — 10 scene, 7 seeds, 4 debts, 2 entità promosse (2026-06-05)
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
  ✅ cap_06 distillato nel grafo (10 scene, compound_volkov + marcus + fascicolo_adrian_bell promossi)
  ✅ cap_07 distillato nel grafo (10 scene, 9 seeds, 4 debts, safe_house + mina + chiavetta_usb_rory promossi, M16 aperto)
  ✅ cap_08 distillato nel grafo (10 scene, 7 seeds, 4 debts, macchina_fotografica_adrian + terrazza_vesper promossi, M17 aperto)

@blocchi.pending:
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
@obiettivo: merge branch cap_08 su main + inizio fase successiva
@branch.corrente: claude/chapter-8-distillation-x4qUG (distillazione cap_08 completa)
@regola: merge su richiesta esplicita utente — non fare merge autonomamente

@passi:
  1. Merge branch cap_08 su main (su richiesta utente)
  2. Decidere prossimo obiettivo:
     A. Scrittura cap_09 (Fase 05 brief → Fase 06 prosa) — percorso principale
     B. Completare Fase 02 schema grafo (skill architetto_grafo)
     C. pattern_ai_da_bandire.md (chat dedicata)
     D. Catalogo bootstrap completo (--bootstrap-catalog)
  3. Seeds aperti da considerare per cap_09:
     - dante_ferita_vesper, dante_ferita_gravita
     - sofia_volkov_cosa_sa, sofia_volkov_level2_aspettava
     - liquido_allucinogeno_esposizione
     - squadra_adrian_identita
     - terza_lezione_cacciatore (maturing — manifesta ma non enunciata)
     - rory_infertilita_come_sa_adrian, mina_dove_e_ora (cap_07 — ancora aperti)
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
M11 — pronome ambiguo nel messaggio finale cap_05: chi ha "quasi preso" chi 2 anni fa? [bassa gravità] — cap_06 supporta Interpretazione B
M12 — doppione entità grafo: 'il_cacciatore' e 'adrian' sono la stessa persona (Adrian Bell/Belkov) [alta gravità]
M13 — categoria '?' per dimitri_volkov e detective_chen nel grafo [bassa gravità]
M14 — Sofia promessa ai Kozlov a sei anni (cap_06): info nuova, verificare vs fonti esistenti [media gravità]
M15 — Rory appare armata in cap_06_s08 senza spiegazione di quando ha preso l'arma [bassa gravità]
M16 — posizione di Adrian alla morte di Marcus: POV Rory dice terrazza/attico, POV Dante dice studio [bassa gravità] — cap_08 chiarisce: terrazza = Vesper top floor (non attico privato)
M17 — condotto ventilazione 7° piano → Level-2: percorso fisico abbreviato narrativamente [bassa gravità] — cap_08
→ Dettagli: progetto/misalignments.json
```

---

## §NOTE

```
@data.ultima.modifica: 2026-06-05
@evento: distillazione cap_08 completa (10 scene, 7 seeds, 4 debts, 2 entità promosse: macchina_fotografica_adrian + terrazza_vesper, 1 misalignment M17, M16 aggiornato)
@stato: distillazione retroattiva cap_01-08 COMPLETA — pronto per merge branch cap_08 e fase successiva
```
