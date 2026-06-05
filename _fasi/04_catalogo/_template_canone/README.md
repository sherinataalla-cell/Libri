# `_template_canone/` — Template di canone trasversale

Pattern: il progetto ha **N documenti di canone trasversale** che vengono incollati identici in ogni asset di generazione del progetto, garantendo coerenza fra tutti gli output.

I documenti di canone trasversale **non sono nel kit**: sono specifici al progetto e al medium. Il kit fornisce solo il *pattern*: come si dichiarano, come si usano, come si mantengono.

## Il pattern

In Fase 04, il progetto crea una cartella `<repo-progetto>/.../canone_trasversale/` con N documenti, ognuno responsabile di un aspetto della coerenza.

Esempi tipici di N e cosa coprono:

| Medium | N tipico | Documenti tipici |
|---|---|---|
| Illustrato | 3 | stylesheet visivo, scale (proporzioni canoniche), palette per area/personaggio |
| Fumetto | 3-4 | stylesheet inchiostro, layout grid, palette, pattern font |
| Audio | 2-3 | timbri canonici (chi suona come), atmosfere ambiente, ritmo/cadenza |
| Testo | 1-2 | carta voce (già esistente in Fase 01), pattern strutturali ricorrenti |

## Forma di un documento di canone trasversale

Ogni documento ha questa forma:

```markdown
# <Titolo del documento di canone>

**Stato:** validato <data> — è in vigore.

**Scopo:** questo blocco va incollato **identico** in ogni prompt asset / sample / brief del progetto. Garantisce coerenza fra tutte le generazioni.

**Quando NON usarlo:** mai. È sempre necessario.

**Quando aggiornarlo:** solo se l'autore decide consapevolmente di cambiarlo. In quel caso bumpa a v2.0 e si rigenerano tutti gli asset.

---

## 📋 BLOCCO CANONE — copia/incolla in ogni prompt

[BLOCCO TESTUALE DEL CANONE — sezione che si incolla letteralmente in prompt asset, brief, ecc.]
```

## Vincoli

- **Mai cambiare un documento di canone senza decisione esplicita autoriale** (con bump versione e rigenerazione)
- **Sempre incollato identico** in tutti gli asset/sample/prompt rilevanti
- **Vive nella repo del progetto**, non nel kit (è specifico al progetto)
- **Riferito nelle schede catalogo** quando una sezione della scheda dipende da una parte del canone trasversale (es. la palette di un personaggio nel catalogo cita il documento "palette" del canone trasversale)

## Cosa fa il kit per il progetto

Il kit:

1. Dichiara il **pattern** (questo file)
2. Dichiara nelle SKILL (vedi `_skills/catalogatore/SKILL.md` §3) di leggere i documenti di canone trasversale prima di compilare le schede
3. Dichiara nei template di scheda (vedi `_template_schede/`) i punti dove citare il canone trasversale

Il progetto:

1. Decide quali N documenti gli servono (in base al medium)
2. Li scrive in `<repo-progetto>/.../canone_trasversale/`
3. Li valida sui primi N esempi di asset (validazione del template prima dello scaling)
4. Li mantiene immutati salvo bump esplicito

## Esempio applicativo

Esempio di un'esperienza tipica con un progetto illustrato:

- 3 documenti: `01_STYLESHEET_v1.md` (stile visivo), `02_SCALE_v1.md` (proporzioni canoniche, es. "Personaggio_X = 1.0 GU di altezza, gli altri proporzionali"), `03_PALETTE_v1.md` (palette per area/personaggio)
- Validazione su 2 esempi (es. un personaggio con specie "leggera" e uno con specie "robusta") prima di scalare l'intero catalogo
- Una volta validati, i 3 documenti sono incollati identici in tutti i prompt di generazione asset

Questo pattern scala a qualsiasi medium che ha bisogno di coerenza fra molti asset prodotti separatamente nel tempo.
