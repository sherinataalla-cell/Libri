# L'Ombra del Vesper

Dark contemporary romance — pipeline narrativa agentica.

- **Protagonisti**: Dante Ravencroft & Aurora "Rory" Winters
- **Setting**: Seattle, The Vesper (club esclusivo con segreti oscuri)
- **Struttura**: 20 capitoli, 4 movimenti, doppio POV
- **Target**: 60-80k parole, Kindle Unlimited
- **Stato**: 8/20 capitoli scritti

---

## ⚠️ Leggere prima di qualsiasi lavoro

**Leggi `CLAUDE.md` e questo file per intero.** Contengono le regole operative fondamentali. Ignorarle può rompere il sistema.

---

## Workflow Git — regole obbligatorie

### Mai lavorare direttamente su `main`

`main` è sempre stabile. Ogni sessione di lavoro avviene su un branch dedicato.

**Flusso obbligatorio per ogni sessione:**

```
1. git checkout main && git pull origin main   # aggiorna main
2. git checkout -b cap/cap_NN-distillazione    # crea branch per il lavoro
3. ... lavora ...
4. git add <file specifici> && git commit      # commit atomici
5. git push -u origin <branch-name>            # push del branch
6. Apri una PR su GitHub                       # per review + merge
7. Merge su main solo quando il lavoro è chiuso e verificato
```

### Naming convention branch

| Tipo | Esempio |
|---|---|
| Distillazione capitolo | `cap/cap_09-distillazione` |
| Prosa capitolo | `cap/cap_09-prosa` |
| Schema grafo (Fase 02) | `fase/02-schema` |
| Catalogo (Fase 04) | `fase/04-catalogo` |
| Correzione | `fix/descrizione` |

### Regole tassative

- **Mai `git push --force`** su nessun branch
- **Mai commit diretti su `main`** — sempre branch + PR
- **Merge su `main` solo su richiesta esplicita** — non farlo in autonomia
- **Un capitolo = un branch** (atomicità): chiudi e mergia prima di aprire il prossimo
- **Ricorda sempre** di fare `git pull origin main` prima di creare un nuovo branch

---

## Modifiche strutturali — autorizzazione creatore obbligatoria

Alcune operazioni cambiano la *forma* del sistema (non il contenuto) e possono romperlo se fatte senza coordinamento.

**Richiedono autorizzazione esplicita del creatore del sistema prima di procedere:**
- Modificare `progetto/grafo_schema.json` (struttura dei nodi)
- Eseguire `_scripts/migrate_schema.py`
- Aggiungere categorie top-level nuove al grafo
- Cambiare `schema_version`

**Se hai dubbi: fermati e chiedi al creatore.** Non procedere autonomamente.

---

## Struttura repo

```
progetto/                        # contenuto narrativo del romanzo
  _documenti_anima/              # bibbia, framework strutturale, carta voce
  _convenzioni_progetto/         # regole specifiche del progetto
  narrazione_fattuale/           # capitoli — fonte canonica
  testi_finali/                  # capitoli pronti per editing
  catalogo/                      # schede entità (personaggi, luoghi, oggetti)
  grafo_schema.json              # schema del grafo narrativo
  glossario_consegna.json        # glossario entità per bootstrap
  STATO_PROGETTO.md              # stato corrente + prossimi passi

_scripts/                        # script Python idempotenti (dry-run di default)
_skills/                         # skill degli agenti AI
_fasi/                           # documentazione pipeline 7 fasi
_convenzioni/                    # convenzioni trasversali del sistema
_agenti/                         # template sessioni agenti foreground
_mcp_server/                     # server MCP per Claude Code
web/                             # cruscotto editoriale Next.js
ARCHITETTURA.md                  # documento fondante del sistema
CLAUDE.md                        # istruzioni operative per Claude Code
```

---

## Quick start

```bash
# 1. Installa server MCP (una volta)
cd _mcp_server && pip install -e .

# 2. Cruscotto editoriale (opzionale)
cd web && npm install && npm run dev

# 3. Audit grafo (dopo bootstrap)
python3 _scripts/audit/audit_1_integrity.py

# 4. Esempio uso script (dry-run → poi apply)
python3 _scripts/bootstrap_graph.py
python3 _scripts/bootstrap_graph.py --apply
```

---

## Prossimo passo

Vedi `progetto/STATO_PROGETTO.md`.

In sintesi: completare `progetto/glossario_consegna.json` → specializzare `progetto/grafo_schema.json` (Fase 02, con skill `architetto_grafo`) → bootstrap del grafo → distillazione retroattiva cap. 1-8 (un capitolo per branch).
