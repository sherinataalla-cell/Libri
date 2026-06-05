# `_validazione/` — Test di accettazione del builder brief

> Pattern di validazione del builder `build_brief.py`: il diff vuoto vs reference autoriale.

---

## §1. Il principio

Il builder brief è uno script puramente meccanico (zero LLM): rilanciato sulle stesse fonti, produce **lo stesso identico output**. Questa proprietà permette di validarlo via **test di accettazione**.

Il test di accettazione è semplice:

1. l'autore consegna un **brief reference**, scritto a mano per una unità di prova, considerato "gold standard"
2. lo script `build_brief.py` viene calibrato finché il suo output per quella unità è **identico** al reference (`diff` vuoto)
3. una volta passato il test, il builder è dichiarato pronto per scaling

Se il diff non è vuoto: **si corregge il builder, mai si patcha il brief generato**.

## §2. Workflow

### Passo 1 — Reference autoriale

L'autore sceglie una unità di prova rappresentativa (idealmente la prima distillata, perché è quella su cui ha pensato di più al "che brief vorrei"). Scrive a mano il brief che vorrebbe ricevere come output dello script. Lo salva come:

```
<repo-progetto>/.../template_brief/REFERENCE/<id-unità>_brief_reference.md
```

Questo file è **immutabile** durante la fase di calibrazione: è il gold standard.

### Passo 2 — Prima esecuzione del builder

```bash
python3 _scripts/build_brief.py --unit <id-unità>
```

Output: `<repo-progetto>/.../briefs/<id-unità>_brief.md`.

### Passo 3 — Diff

```bash
diff <repo-progetto>/.../briefs/<id-unità>_brief.md \
     <repo-progetto>/.../template_brief/REFERENCE/<id-unità>_brief_reference.md
```

### Passo 4 — Iterazione

Per ogni differenza rilevata dal diff, identifica la causa:

- **dato mancante nel brief generato**: lo script non sta pescando da una fonte che il reference cita. Aggiusta lo script per leggere quella fonte / quella sezione.
- **dato extra nel brief generato**: lo script sta pescando da una fonte che il reference non cita. Aggiusta lo script per filtrare.
- **formato diverso**: lo script formatta diversamente. Aggiusta lo script per produrre il formato del reference.
- **ordine diverso**: lo script ordina diversamente. Aggiusta l'ordine delle sezioni o delle entry.

Rilancia il builder, ripeti il diff. Itera finché il diff è vuoto.

### Passo 5 — Dichiarazione di test passato

Quando `diff` produce zero output, il builder è validato. Lo si dichiara nello stato di progetto:

```markdown
## Stato builder brief (data: 2026-05-07)

- Reference autoriale: <id-unità> in template_brief/REFERENCE/
- Test accettazione: ✓ passato (diff vuoto)
- Builder: pronto per scaling su tutte le unità
```

A questo punto, `build_brief.py --all` è autorizzato.

## §3. Vincoli

- **Mai patchare il brief generato**: se manca qualcosa, si modifica lo script o la fonte upstream e si rilancia. Mai modifiche manuali al brief.
- **Mai modificare il reference**: durante la calibrazione, il reference è gold standard. Se l'autore cambia idea su come il brief dovrebbe essere, scrive un *nuovo reference* e ricomincia il test.
- **Sempre versionare il reference**: il reference vive nel Git, è un artefatto autoriale tracciato.

## §4. Limiti del test di accettazione

Il test valida **una unità**. Per scalare il builder a tutte le unità, valgono questi vincoli:

- il reference deve essere **rappresentativo**: contenere tutti i pattern (cast multi-personaggio, scene multi-blocco, callback, seeds, ecc.) che le altre unità avranno
- la calibrazione del builder è **generica**: non hardcodare valori specifici della unità di prova; le mappature devono funzionare per qualsiasi unità

Se la prima unità non è abbastanza rappresentativa, l'autore può scegliere una **seconda** unità di prova e calibrare il builder su entrambe (`diff` vuoto su entrambi).

## §5. Quando rifare il test

Si rifà il test ogni volta che:

- cambia lo schema delle sezioni del brief (es. aggiunta di una sezione canonica)
- cambia una mappatura sezione → fonte
- l'autore dichiara nuove esigenze nel brief

Si rifà aggiornando il reference autoriale con le nuove esigenze, poi calibrando il builder finché il diff è di nuovo vuoto.

## §6. Test multipli (avanzato)

Per progetti grandi, l'autore può tenere **N reference** (uno per ogni "tipo" di unità del progetto) e validare il builder contro ciascuno. Pattern raro ma supportato:

```bash
for unit_id in <reference_ids>; do
  python3 _scripts/build_brief.py --unit "$unit_id"
  diff briefs/"$unit_id"_brief.md template_brief/REFERENCE/"$unit_id"_brief_reference.md
done
# Tutti i diff devono essere vuoti
```
