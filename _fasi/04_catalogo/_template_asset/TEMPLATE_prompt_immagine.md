# Template — Prompt asset visivo (agnostico al modello)

> Pattern di prompt per generazione asset visivo. Il prompt è composto a partire dalla scheda catalogo dell'entità + i documenti di canone trasversale del progetto. Agnostico al modello generativo (Grok Imagine, FLUX, DALL·E, Stable Diffusion, ecc.).
>
> **Per il progetto reale**: copia questo template in `<repo-progetto>/.../template_asset/TEMPLATE_prompt_<modello>.md` e specializzalo al modello specifico (alcuni modelli richiedono format diverso, alcuni accettano negative prompt esplicito, altri no).

---

## Forma generale del prompt

Un prompt di generazione asset visivo per un'entità del catalogo è composto da questi blocchi, in ordine:

```
[1. STYLESHEET CANONE TRASVERSALE]
   ↓
[2. SCALE / PROPORZIONI CANONE TRASVERSALE]
   ↓
[3. BLOCCO ENTITY DALLA SCHEDA CATALOGO]
   ↓
[4. ANGOLO / VISTA SPECIFICA RICHIESTA]
   ↓
[5. NEGATIVE PROMPT GLOBALE (se modello supporta)]
```

### Blocco 1 — Stylesheet canone trasversale

Incollato identico dal documento `<repo-progetto>/.../canone_trasversale/01_STYLESHEET.md` (o equivalente). Mai variato. Mai abbreviato.

```
[contenuto del blocco STYLESHEET dal canone trasversale del progetto]
```

### Blocco 2 — Scale / proporzioni canone trasversale (per prompt multi-personaggio)

Incollato identico dal documento `<repo-progetto>/.../canone_trasversale/02_SCALE.md` (o equivalente). Necessario per prompt con più personaggi insieme.

```
[contenuto del blocco SCALE dal canone trasversale del progetto]
```

### Blocco 3 — Blocco entity dalla scheda catalogo

Si incolla la sezione canonica della scheda dell'entità (vedi `_template_schede/TEMPLATE_<famiglia>.md` sezione "Aspetto / forma" + "Abbigliamento / stato d'uso" + "Palette" + eventuale blocco multi-blocco corretto per la scena).

```
[blocco entity dalla scheda]
```

Per entità complesse (luogo con esterno+interno+cortile, personaggio multi-modale, oggetto con stati), si **incolla solo il blocco corrispondente al qualifier/stato richiesto**, mai più di uno (vedi `PATTERN_ENTITA_COMPLESSE.md`).

### Blocco 4 — Angolo / vista specifica

Per ogni asset canonico che si vuole generare, si specifica l'angolo/vista:

- **Personaggi** — tipicamente 4 viste canoniche:
  - **Fronte**: posa neutra, vista frontale, espressione canonica
  - **Azione**: posa in azione tipica del personaggio
  - **Modalità**: variante in modalità comportamentale specifica (se personaggio multi-modale)
  - **Turnaround**: 4 angolazioni in singola immagine (per riferimento 3D)

- **Oggetti** — 1-2 viste canoniche:
  - Vista principale isolata
  - Vista in contesto d'uso (opzionale)

- **Luoghi** — 0-1 vista canonica establishing:
  - Vista di stabilimento atmosferica del luogo (per atlante / cartografia visiva)
  - I luoghi vivono prevalentemente come BLOCCO LOCATION testuale dentro la scheda, non come asset reference

```
[descrizione dell'angolo/vista richiesto]
```

### Blocco 5 — Negative prompt globale

Se il modello supporta il negative prompt esplicito, incollato identico dal canone:

```
NEGATIVE: [contenuto del negative prompt globale del progetto]
```

---

## Esempio di prompt completo (struttura)

```
ART STYLE — fixed for the whole project "<nome progetto>":
[contenuto stylesheet canone]

CHARACTER SCALE REFERENCE:
[contenuto scale canone, se prompt multi-personaggio]

CHARACTER: <Nome Visualizzato> (<id>)
[blocco entity dalla scheda catalogo, sezione corretta per la vista richiesta]

VIEW: <fronte | azione | modalità | turnaround>
[descrizione vista specifica]

NEGATIVE: [negative prompt globale]
```

---

## Specializzazione al modello

Modelli diversi accettano format diversi:

- **Grok Imagine, Midjourney, DALL·E**: prompt testuale unico, naturale linguaggio. Il template sopra incolla i blocchi in sequenza nel prompt testuale.
- **FLUX, Stable Diffusion**: prompt testuale + negative prompt esplicito. Il template separa i due.
- **Modelli locali con LoRA / IP-Adapter**: i blocchi 1-2 (canone) possono essere parzialmente embedded nel modello via LoRA, lasciando il prompt testuale solo per i blocchi 3-4.

Il template del kit è **agnostico**. Il progetto specializza al modello specifico copiando questo template in `<repo-progetto>/.../template_asset/TEMPLATE_prompt_<modello>.md` e modificandolo.

---

## Naming dell'asset prodotto

Vedi `_convenzioni/naming_e_versioning.md` §2:

```
<id>_canonica_v1_<vista>.<estensione>
<id>_turnaround_v1.<estensione>
```

Una volta canonico, l'asset è **intoccabile come reference**. Modifiche richiedono bump versione (v1 → v2) e archiviazione della v1.
