# Pattern — Entità complesse (multi-blocco)

> Pattern per entità del catalogo che hanno **più "facce"** distinte: luoghi con esterno + interno + cortile/annessi, personaggi con modalità comportamentali codificate, oggetti con stati nel tempo.

---

## §1. Il problema

Alcune entità non si descrivono adeguatamente con un singolo blocco descrittivo. Esempi:

- **Luoghi composti**: una casa con esterno + interno + cortile annesso. Una scena può svolgersi in uno solo dei tre. Generare un asset visivo che mescola "facciata della casa + tavolo della cucina + cortile lastricato" produce un'immagine confusa, ibrida, inutilizzabile.

- **Personaggi multi-modali**: un personaggio che ha modalità comportamentali distinte (es. "modalità lavoro" / "modalità rituale" / "modalità riposo") visivamente differenti. Una scena lo mostra in *una* modalità, non in tutte.

- **Oggetti con stati nel tempo**: un oggetto che è "nuovo" in una unità, "usato" in un'altra, "spezzato" in un'altra ancora. Ogni stato richiede descrizione propria.

## §2. Il pattern

**Più blocchi descrittivi distinti dentro la stessa scheda**, mai mescolati. Quando un asset (prompt scena, descrizione brief) richiama l'entità, sceglie *un solo blocco* in base al contesto.

### Schema della scheda

Un'entità complessa ha N blocchi descrittivi distinti, ognuno con il proprio template di sezione. Esempio luogo composto:

```markdown
## ⭐ Descrizione visiva canonica per generazione — ESTERNO

[descrizione esterno...]

## ⭐ Descrizione visiva canonica per generazione — INTERNO (solo se applicabile)

[descrizione interno...]

## ⭐ Descrizione visiva canonica per generazione — CORTILE / ANNESSI (solo se applicabile)

[descrizione cortile...]
```

I blocchi sono dichiarati nel frontmatter con flag booleani:

```yaml
ha_esterno: true
ha_interno: true
ha_cortile_o_annessi: true
```

### Schema del prompt scena (Fase 03 distillazione)

Quando una scena del livello micro referenzia il luogo, dichiara *quale blocco* usare:

```yaml
location:
  id: "<id_luogo>"
  qualifier: "interno"           # "esterno" | "interno" | "cortile" | null
```

Il `qualifier` istruisce gli script downstream (brieffer, compositore output) su quale blocco descrittivo dell'entità applicare alla scena.

### Schema dell'asset di generazione

Il prompt di generazione asset (es. immagine), quando assemblato, **incolla solo il blocco rilevante** della scheda, mai più di uno. Il negative prompt esplicito vieta elementi degli altri blocchi se rilevante.

## §3. Casi specifici

### §3.1 Luoghi composti (esterno + interno + cortile)

Pattern tipico per case, edifici pubblici, luoghi di lavoro:

- **Esterno**: facciata, accesso, contesto urbanistico
- **Interno**: ambiente principale, mobili, atmosfera
- **Cortile/annessi**: spazi annessi distinti dal corpo principale

Una stessa scena ha *un* qualifier. Mai mescolare.

### §3.2 Personaggi multi-modali

Pattern per personaggi che cambiano fortemente aspetto/comportamento in base a una modalità dichiarata:

- **Modalità A**: descrizione visiva + comportamentale + atmosferica
- **Modalità B**: idem
- **Modalità C**: idem

Il distillatore in Fase 03 marca la modalità attiva nel campo `cast_in_scene[].active_modality` del nodo unità.

### §3.3 Oggetti con stati nel tempo

Pattern per oggetti che evolvono attraverso il progetto:

- **Stato 1 (nuovo)**: descrizione
- **Stato 2 (usato)**: descrizione
- **Stato 3 (spezzato/perso)**: descrizione

Il grafo registra lo stato dell'oggetto per ogni unità in cui appare. Il prompt asset usa il blocco corrispondente allo stato della unità corrente.

### §3.4 Modalità "non multi-blocco"

Non tutte le entità sono complesse. Personaggi semplici, luoghi semplici, oggetti senza evoluzione: una sola descrizione canonica, niente flag multi-blocco. Il qualifier nella scena è `null`.

## §4. Vincoli

- **Mai mescolare blocchi** in un asset di generazione. Produrrebbe asset ibridi confusi.
- **Mai duplicare informazioni** fra blocchi. Ogni blocco descrive una *faccia* distinta dell'entità.
- **Sempre dichiarare il qualifier** nelle scene del livello micro che usano entità multi-blocco. Se omesso, lo script writer fallisce o pesca il blocco "default" (esterno per luoghi, modalità A per personaggi, stato 1 per oggetti).

## §5. Esempi di applicazione (medium-dipendenti)

| Medium | Tipica entità multi-blocco |
|---|---|
| Illustrato | Luoghi composti (case, edifici), personaggi multi-modali |
| Fumetto | Personaggi multi-stagione, ambientazioni multi-pannello |
| Audio | Locazioni audio multi-ambiente (interno/esterno con timbri diversi) |
| Testo | Oggetti con stati nel tempo, archi personaggi (descrizione del personaggio in fase A vs fase B) |

In ogni caso, il pattern è: **più blocchi distinti, qualifier nelle scene, mai mescolare**.
