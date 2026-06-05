# Convenzione — Git

> Convenzione trasversale al kit: branch, commit, push, backup chain, divieti operativi.

---

## §1. Branch

- **Branch principale**: `main`. Stato sempre coerente, mai work-in-progress
- **Per lavori grandi**: branch dedicato `<agente>/<scope>` con merge fast-forward su `main`
  - esempi: `claude/distillazione-cap03`, `autore/migrazione-schema-1.5`, `claude/starter-kit-fase-04`
- **Per micro-fix**: commit diretto su `main` se il fix è banale e l'autore lo autorizza, altrimenti branch dedicato

I branch dedicati sono **tracciabilità autoriale**: ogni grande blocco di lavoro lascia trail di audit nelle history di Git.

---

## §2. Commit

### Forma

- **Prima riga ≤72 caratteri**, descrittiva, in italiano (o nella lingua del progetto)
- **Riga vuota**, poi corpo che spiega **cosa è stato fatto** e **perché**
- Eventuali link/riferimenti (issue, doc, commit precedenti) nel corpo

Esempio:

```
distillazione: cap03 passata 1 + 2 complete

Nodo cap03 popolato in tutti i campi obbligatori (passata 1 carpentiere
meccanico). Riempiti i null con valori provvisori marcati grado B
(passata 2 co-autore consultivo). Misalignment rilevati segnalati
in _canon_misalignments.json (3 issue, da decidere autore).

Backup pre-distillazione: story_graph.json.pre_cap03.backup.json.
Quote tracker aggiornato (gruppo X +1, formula Y +1).
```

### Prefix consigliati per scope

Non obbligatori, ma rendono leggibile la history:

| Prefix | Scope |
|---|---|
| `ideazione:` | modifiche ai documenti-anima della Fase 01 |
| `schema:` | modifiche allo schema del grafo (Fase 02) |
| `distillazione:` | popolamento del grafo per unità (Fase 03) |
| `catalogo:` | modifiche schede del catalogo (Fase 04) |
| `brief:` | modifiche al brief o al brieffer (Fase 05) |
| `prosa:` | testi finali e annotazioni autoriali (Fase 06) |
| `editing:` | revisioni, asset finali, composizione output (Fase 07) |
| `convenzione:` | aggiornamento di un documento `_convenzioni/` |
| `script:` | modifiche agli script idempotenti |
| `skill:` | modifiche a una skill agente IA |
| `starter_kit:` | modifiche allo starter kit (per chi sta sviluppando il template) |

---

## §3. Push

- **`git push -u origin <branch>`** la prima volta su un branch nuovo
- **Retry con backoff esponenziale** in caso di network error (4 tentativi: 2s, 4s, 8s, 16s)
- **Mai `--force`**. Mai. Se hai un casino, fermati e chiedi all'autore.
- **Mai `--no-verify`** per bypassare pre-commit hooks. Se un hook fallisce, capisci perché e fixa.

---

## §4. Backup chain canonico

Vedi `naming_e_versioning.md` §5.

In sintesi: prima di ogni modifica destruttiva al grafo (anche idempotente, anche tramite script), si genera un backup canonico con nome esplicito che dichiara *prima di cosa* il backup è stato fatto:

```
<file-grafo>.pre_<scope-fase>.backup.<estensione>
```

I backup canonici si **commit-tano insieme alle modifiche** (vivono nella history Git). Sono un trail di audit visibile nello stato corrente della repo.

I backup automatici timestamp-based (`.bak.<timestamp>`) generati dagli script idempotenti **non si commit-tano** (sono in `.gitignore` per design): sono rete di sicurezza locale, non audit autoriale.

---

## §5. Divieti

| Divieto | Perché |
|---|---|
| `git push --force` | distrugge la history altrui |
| `git push --force-with-lease` (senza autorizzazione esplicita) | meno pericoloso ma comunque rischioso |
| `git reset --hard` su file modificati altrui | distrugge il lavoro |
| `git checkout -- <file>` su file modificati senza chiedere | idem |
| `git commit --amend` su commit altrui | viola la firma autoriale |
| `git commit --no-verify` | bypassa hook che esistono per un motivo |
| Modificare `.gitignore` per nascondere file work-in-progress | i WIP vivono in branch, non nascosti |

---

## §6. Pre-commit hooks (opzionali)

Il progetto può configurare hook che validano:

- **JSON valido** sui file canonici del grafo (`python3 -c "import json; json.load(open('<file>'))"`)
- **YAML valido** sui frontmatter delle schede catalogo
- **Audit grafo** (i 4 audit del kit, vedi `_scripts/audit/`) automaticamente prima di ogni commit che tocca il grafo
- **Lint Python** sugli script idempotenti

Questi hook sono **opzionali** ma consigliati. Vivono in `.git/hooks/` o sono gestiti da `pre-commit` (framework Python). Il kit fornisce un esempio in `_scripts/_hooks/` (da popolare).

---

## §7. Tagging delle release del prodotto finale

Quando il prodotto finale (Fase 07) raggiunge una release pubblica, si può creare un tag Git:

```bash
git tag -a v1.0 -m "Release pubblica v1.0 — <data>"
git push origin v1.0
```

Convenzione tag: `v<major>.<minor>` per release pubbliche, `v<major>.<minor>.<patch>` per release minori.

---

## §8. Coordinamento agenti IA con Git

Gli agenti IA che operano sulla repo:

- **leggono** sempre dalla `main` (a meno di branch esplicito dichiarato dall'autore)
- **scrivono** sempre su un branch dedicato (`<agente>/<scope>`), mai direttamente su `main`
- **chiedono autorizzazione esplicita** prima di mergiare su `main`
- **non fanno mai merge su `main` in autonomia** — il merge avviene solo su richiesta esplicita dell'utente
- **non pushano remoto** senza l'OK dell'autore (per repo con cui non hanno credenziali, è ovvio; per repo con credenziali — es. via MCP — il push è azione autorizzata caso per caso)
- **a inizio sessione** verificano il branch attivo: se è `main`, creano o switchano su branch appropriato prima di qualsiasi modifica

L'orchestratrice mantiene questo come regola dura, e gli agenti rispettano.

---

## §9. Modifiche strutturali — autorizzazione creatore del sistema

Le modifiche **strutturali** al grafo (che cambiano la *forma* dei nodi, non il loro contenuto) richiedono autorizzazione esplicita del **creatore del sistema** prima di procedere. Questo perché una modifica strutturale mal coordinata può rendere inconsistente l'intero grafo e rompere gli script.

### Cosa rientra nelle modifiche strutturali

| Operazione | Autorizzazione richiesta |
|---|---|
| Modificare `grafo_schema.json` (aggiunta/rimozione/rinomina campi) | ✅ sì |
| Eseguire `_scripts/migrate_schema.py` | ✅ sì |
| Aggiungere nuove categorie top-level in `entities` | ✅ sì |
| Cambiare `schema_version` nel grafo | ✅ sì |
| Modificare struttura nodi unità (campi obbligatori, nuovi livelli) | ✅ sì |
| Aggiungere contenuto via `write_node_to_graph.py` | ❌ no — operazione normale |
| Aggiungere entità via `promote_entities_to_graph.py` | ❌ no — operazione normale |
| `bootstrap_graph.py` (inizializzazione) | ❌ no — operazione normale |
| Script di lettura/audit | ❌ no — read-only |
| Modificare file narrativi (`narrazione_fattuale/`, `testi_finali/`) | ❌ no — contenuto |

### Protocollo per l'agente

Se una richiesta dell'utente rientra nelle modifiche strutturali:
1. Spiega all'utente cos'è la modifica strutturale e perché richiede coordinamento
2. **Fermati. Non procedere.**
3. Di' all'utente: *"Questa modifica richiede l'autorizzazione del creatore del sistema. Contatta il creatore, descrivi la modifica, e torna con la sua conferma prima di continuare."*

Non è sufficiente che l'utente dica "sì, voglio farlo" — serve la conferma esplicita del creatore.
