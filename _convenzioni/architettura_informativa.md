# Convenzione — Architettura informativa del progetto

> Convenzione trasversale al kit: dove vivono i dati, gerarchia di precedenza fra le fonti, regola di non-duplicazione, pattern di trasferimento di autorità.

---

## §1. Le N fonti del progetto

Il sistema agentico del kit poggia su un numero limitato di **fonti di verità**, distinte e non sovrapposte. Per un progetto narrativo tipico:

| Fonte | Cosa contiene | Vive in | Modificata da |
|---|---|---|---|
| **Grafo** | struttura: cosa succede nelle unità, scene, ruoli, seeds, callbacks, debts, archi personaggi | un file JSON canonico nel progetto | script idempotente, mai a mano dopo congelamento |
| **Catalogo** | vista esterna delle entità: come si presentano e si raccontano (sensoriale, comportamentale, atmosferico) | una cartella di schede, una per entità | catalogatore via loop con critic, body modificabile, frontmatter via script |
| **Bibbia / canone-mondo** | regole del mondo: cosmologia, leggi naturali, atlante, framework strutturale silente, archi globali | uno o più documenti Markdown nel progetto | autore raramente, con bump versione |
| **Carta voce + pattern AI da bandire** | come scrivere e come non scrivere: registri, ritmi, lessico, pattern stilistici banditi | due documenti Markdown | autore (a evoluzione stilistica), pattern AI può essere rifrescato per modello LLM in uso |

Fonti aggiuntive opzionali (dipendono dal progetto):

- **Cartografia / mappe** — se il mondo è geograficamente strutturato e le distanze contano (esempio: GeoJSON con feature)
- **Timeline** — se gli archi temporali hanno strutture rigide (date, stagioni, anni narrativi)
- **Documenti di canone trasversale** — stylesheet visivo, palette, scale, equivalenti audio per sample/timbri

---

## §2. La regola di non-duplicazione

**Ogni dato vive in UNA sola fonte.** Mai duplicato in due posti "per sicurezza".

- dato visivo / esteriore di un'entità → **catalogo** (mai in bibbia)
- voce di un personaggio (frasi codificate, modalità di parlare) → **grafo** (nodo entità) + **bibbia** (note di voce generali, se servono)
- ruolo del personaggio nella scena di una unità specifica → **grafo** (nodo unità, sotto-cast in scena con vincoli locali)
- arco temporale dell'entità (stato per unità) → **grafo** (nodo entità, campo `stato_per_unita`)
- regole del mondo che valgono ovunque (es. "in questo mondo non esiste l'elettricità") → **bibbia**
- registro stilistico generale del prodotto → **carta voce**
- pattern stilistici da evitare → **pattern AI da bandire**

**Quando un dato emerge** durante la distillazione o la prosa o l'arricchimento catalogo, ci si chiede *dove vive* e si scrive lì, non in due posti. Il routing senza ambiguità è il punto di forza del sistema.

---

## §3. La gerarchia di precedenza

Quando due fonti si contraddicono (succede), il progetto dichiara una **gerarchia di precedenza** fra le sue fonti. Esempi possibili:

- **catalogo > grafo > bibbia** — usato dai progetti dove il catalogo è la versione "viva e operativa", la bibbia è archivio storico/cosmologico
- **bibbia > grafo > catalogo** — usato dai progetti dove la bibbia è oracolo del mondo, il catalogo è derivato
- **grafo > catalogo > bibbia** — usato dai progetti dove il grafo è il piano di lavoro corrente, le altre fonti sono di riferimento

Non c'è una scelta giusta in assoluto: dipende da come il progetto ha vissuto la sua maturazione. Il punto è **dichiararla esplicitamente** in `<repo-progetto>/.../convenzioni_progetto.md`, e gli agenti la rispettano.

In caso di conflitto rilevato durante un lavoro:
- l'agente *non risolve* in autonomia
- segnala nel rolling file di misalignment del progetto (vedi `stato_progetto.md` §misalignment tracking)
- l'autore decide

---

## §4. Pattern di trasferimento di autorità

Caso non banale: la **prima compilazione** del catalogo è spesso bulk meccanica — travaso da una fonte canonica originaria (tipicamente la bibbia) verso le schede catalogo, sezione per sezione, automaticamente.

Dopo la compilazione bulk, il progetto può fare un'operazione **una-tantum, autoriale, esplicita**: rimuovere dalla fonte originaria il layer travasato. Da quel momento, il catalogo diventa **autoritativo** per quel layer, e la fonte originaria non lo contiene più.

Esempio concreto: in un progetto reale di riferimento, la bibbia iniziale conteneva tutto il visivo dei personaggi. Dopo la compilazione bulk del catalogo dalla bibbia, l'autore ha deciso di **rimuovere lo strato visivo dalla bibbia** e dichiarare che da quel momento dettagli visivi nuovi vanno **solo** nel catalogo.

Questo è un **trasferimento di autorità**:

```
PRIMA:                          DOPO:
  bibbia (con visivo)             bibbia (senza visivo, solo narrativo)
       ↓                                ↑ (mai più scrittura del visivo)
  catalogo (vista derivata)       catalogo (autoritativo per visivo)
```

Vincoli del trasferimento:

- è una **decisione autoriale esplicita**, mai automatica
- è una operazione **una-tantum** (non si rimette il layer indietro)
- è **tracciata** nel log di sincronizzazione del progetto (vedi `stato_progetto.md`) con motivazione
- da quel momento gli agenti sanno: "per quel layer, il catalogo è la fonte. La bibbia non contiene quel layer."

---

## §5. Architettura informativa nel testo finale

Il **testo finale** prodotto dall'agente prosa (Fase 06) ha la sua architettura informativa specifica:

- **testo letterario**: visibile al lettore, è il prodotto narrativo
- **frontmatter YAML**: visibile a script (compositore output, audit), invisibile al lettore
- **marker machine-readable**: visibili a script (compositore output), invisibili al lettore (commenti HTML/Markdown)
- **annotazioni autoriali post-prosa** (`<repo-progetto>/.../testi_finali/_annotations/<id>.yaml`): file separati, ground truth post-scrittura — sovrascrivono il NER fuzzy nei tool downstream
- **inventario per QA** (`<repo-progetto>/.../testi_finali/_inventory/<id>_inventory.md`): file separato, derivato dal testo finale, per audit e validazione coerenza con catalogo

Tutti questi vivono in cartelle parallele al testo finale, mai *dentro* il testo finale. Il testo finale resta pulito-letterario.

---

## §6. Il ruolo della Fase 01 (ideazione) nell'architettura informativa

In Fase 01 di ideazione, le 4 fonti del progetto **non esistono ancora** come entità separate. L'autore lavora su un set di documenti-anima che sono *embrioni* di tutte le 4 fonti contemporaneamente:

- **bibbia embrionale** (idea del mondo)
- **carta voce embrionale** (idea della voce)
- **archi globali** (idea della struttura)
- **glossario-consegna** (= pre-catalogo embrionale + pre-grafo a livello macro)
- **framework strutturale silente** (opzionale)
- **pattern AI da bandire** (inferito o composto in collaborazione)

Quando l'autore dichiara "Fase 01 chiusa, congeliamo il grafo", queste fonti embrionali si **stabilizzano** nelle loro posizioni canoniche:

- bibbia embrionale → bibbia (in `<repo-progetto>/.../canone/`)
- carta voce embrionale → carta voce (idem)
- glossario-consegna → bootstrap del grafo a livello macro + schede embrionali del catalogo
- archi globali → bootstrap del grafo (relazioni globali)
- framework strutturale → embedded nel grafo (campi `attributo_dominante` e simili) e/o bibbia
- pattern AI → documento standalone

Da quel momento si applica la regola di non-duplicazione e la gerarchia di precedenza.
