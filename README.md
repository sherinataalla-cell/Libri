# L'Ombra del Vesper

Dark contemporary romance — pipeline narrativa agentica.

## Progetto

- **Protagonisti**: Dante Ravencroft & Aurora "Rory" Winters
- **Setting**: Seattle, The Vesper (club esclusivo con segreti oscuri)
- **Struttura**: 20 capitoli, 4 movimenti, doppio POV
- **Target**: 60-80k parole, Kindle Unlimited
- **Stato**: 8/20 capitoli scritti

## Struttura repo

```
progetto/                        # contenuto narrativo del romanzo
  _documenti_anima/              # bibbia, framework strutturale, carta voce
  narrazione_fattuale/           # capitoli (fonte canonica)
  testi_finali/                  # capitoli pronti per editing
  catalogo/                      # schede entità (personaggi, luoghi, oggetti)
  grafo_schema.json              # schema del grafo narrativo
  glossario_consegna.json        # glossario entità per bootstrap
  STATO_PROGETTO.md              # stato corrente del progetto

_scripts/                        # script Python idempotenti (dry-run di default)
_skills/                         # skill degli agenti AI
_fasi/                           # documentazione pipeline 7 fasi
_convenzioni/                    # convenzioni trasversali
_agenti/                         # template sessioni agenti foreground
_mcp_server/                     # server MCP per Claude Code
web/                             # cruscotto editoriale Next.js
ARCHITETTURA.md                  # documento fondante — leggere prima di tutto
CLAUDE.md                        # istruzioni per Claude Code
```

## Quick start

```bash
# Installa server MCP (una volta)
cd _mcp_server && pip install -e .

# Cruscotto editoriale
cd web && npm install && npm run dev

# Audit grafo (dopo bootstrap)
python3 _scripts/audit/audit_1_integrity.py
```

## Prossimo passo

Completare `progetto/glossario_consegna.json` → specializzare `progetto/grafo_schema.json` (Fase 02) → bootstrap del grafo → distillazione retroattiva cap. 1-8.

Vedi `progetto/STATO_PROGETTO.md` e `ARCHITETTURA.md`.
