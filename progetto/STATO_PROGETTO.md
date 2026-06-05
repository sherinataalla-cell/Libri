# STATO PROGETTO — L'Ombra del Vesper

> **File di stato corrente.** Aggiornare dall'orchestratrice ad ogni sincronizzazione significativa.

---

## §POSIZIONE

```
@capitolo.corrente: 08 (scritto, importato)
@capitolo.next: 09 (da scrivere)
@parole.totali: ~60.000 stimato (8 capitoli, ~7.500 parole/cap)
@completamento: ~40% (8/20 capitoli)
@versione_grafo: non ancora inizializzato (pre-Fase 02)
@versione_schema: bozza (grafo_schema.json da completare in Fase 02)
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

## §ATTIVITÀ PIPELINE

```
@fase.corrente: importazione (transizione Fase 01→02)

@blocchi.fatti:
  ✅ Documenti-anima importati:
     - progetto/_documenti_anima/bibbia.md (da DNA_LIBRO.txt)
     - progetto/_documenti_anima/framework_strutturale.md (da DNA_CAPITOLI.txt)
     - progetto/_documenti_anima/carta_voce.md (da VOCABOLARIO_FRATTALE.txt)
  ✅ 8 capitoli copiati in narrazione_fattuale/ + testi_finali/
  ✅ Bozza grafo_schema.json creata
  ✅ Bozza glossario_consegna.json creata (entità principali)

@blocchi.pending:
  🟡 Completare glossario_consegna.json — tutte le entità secondarie
  🟡 Completare grafo_schema.json — specializzazione Fase 02 (skill architetto_grafo)
  🟡 bootstrap_graph.py --apply — dopo completamento schema + glossario
  🟡 Distillazione retroattiva cap.01-08 (Fase 03) — una per chat
  🟡 pattern_ai_da_bandire.md — da scrivere in chat dedicata
  🟡 Catalogo schede embrionali — dopo promote_entities --bootstrap-catalog
  🟡 Brief cap.09 (Fase 05) — dopo distillazione
  🟡 Prosa cap.09 (Fase 06) — dopo brief
```

---

## §PROSSIMA SESSIONE

```
@obiettivo: completare Fase 01→02 (schema + glossario + bootstrap)

@passi:
  1. Leggere ARCHITETTURA.md per capire la pipeline completa
  2. Usare skill architetto_grafo per specializzare grafo_schema.json
  3. Completare glossario_consegna.json con entità emerse dai cap.1-8
  4. Lanciare: python3 _scripts/bootstrap_graph.py (dry-run, poi --apply)
  5. Iniziare distillazione retroattiva cap.01 (Fase 03)
```

---

## §NOTE

```
@data.ultima.modifica: 2026-06-05
@evento: organizzazione repo iniziale, import materiali esistenti
@stato: pronto per Fase 02 dopo completamento schema e glossario
```
