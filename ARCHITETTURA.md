# Architettura — Starter Kit Pipeline Narrativa

> Documento fondante. Spiega *come è fatto* il sistema che questo kit ti aiuta a costruire, prima di mostrarti *cosa* mettere dove.
>
> Audience: chi scarica lo starter kit per iniziare un proprio progetto narrativo (saga, romanzo, albo illustrato, fumetto, podcast narrativo, qualsiasi cosa abbia una struttura "una storia o più → testo / asset → prodotto finale"). Lo legge una volta a freddo, ci torna quando deve prendere decisioni di forma.

---

## 1. Cos'è questo kit, cosa non è

**Cos'è.** Lo scheletro riusabile di un sistema *agentico* per produrre opere narrative complesse con qualità autoriale e impronta umana, riducendo i costi di gestione del flusso. Non è una libreria, non è un framework software: è un *modello operativo* — cartelle, template, skill agente IA, script idempotenti, convenzioni di stato e di versionamento — che dichiara *che forma* devono avere le cose perché il flusso non degeneri.

**Cosa non è.**
- Non è un generatore automatico di storie. L'umano resta il decisore strategico in ogni fase. Gli agenti IA fanno lavoro a contesto fisso, validato dall'umano, dentro vincoli espliciti.
- Non è proporzionale alla lunghezza del prodotto. Funziona uguale per un albo da 800 parole e per un capitolo di romanzo da 8.000 parole. La ragione è dichiarata in §3.
- Non è opinionato sul medium. Testo puro, illustrato, fumetto, audio, multimediale: la forma è la stessa, cambiano gli asset di output e qualche scheda nel catalogo.
- Non è un kit di contenuto. Non porta con sé personaggi, mondi, stili. Porta una *forma* dentro cui chi adatta inserisce il proprio contenuto.

**Premessa epistemica.** L'inferenza iniziale del grafo è la barriera anti-drift in scrittura. Più precisamente: la *densità del brief* a valle è la barriera. Il grafo, il catalogo, la bibbia, la voce non scrivono prosa — alimentano un brief autosufficiente, e un agente prosa con brief denso non ha spazio per andare a deriva. Tutto il kit ruota attorno a questo principio.

---

## 2. Pipeline a 7 fasi

Le fasi sono in ordine, ma le prime quattro **iterano** liberamente: si va avanti e indietro finché chi-è-l'autore non dice "ora basta, abbiamo abbastanza". Da fase 5 in poi il flusso è deterministico per unità narrativa.

```
[ 1 ]  IDEAZIONE
       umano + AI in chat, iterazione continua su un set di
       documenti-anima che si arricchiscono a vicenda
              │
              ▼
[ 2 ]  CONGELAMENTO SCHEMA-GRAFO
       fissato il template-pattern del grafo (vedi §4):
       schema chiuso, da qui in avanti aggiunte additive
       retroattive a null + riempimenti contestualizzati
              │
              ▼
[ 3 ]  DISTILLAZIONE (per unità narrativa)
       umano racconta → AI inferisce e riempie il nodo →
       umano valida blocco-per-blocco
              │
              ▼
[ 4 ]  CATALOGO (entità promosse + arricchimento)
       per ogni entità del grafo si scrive scheda nel catalogo
       (vista esterna strutturata — vedi §5)
              │
              ▼  <-- da qui in poi, deterministico per unità
              │
[ 5 ]  BRIEF (script meccanico, zero LLM)
       per la storia N: grafo + narrazione fattuale +
       catalogo del cast in scena + bibbia + carta voce +
       pattern AI da bandire ─→ brief autosufficiente
              │
              ▼
[ 6 ]  PROSA (agente IA + umano in chat dedicata)
       l'agente applica voce autoriale sui contenuti
       già fissati nel brief, una pagina alla volta
              │
              ▼
[ 7 ]  EDITING + COMPOSIZIONE / OUTPUT FINALE
       passaggi successivi: revisione, asset finali se
       previsti (illustrazioni, audio, impaginazione),
       compositore output (PDF / EPUB / HTML / fumetto /
       audio / web)
```

**Iterazione fra le fasi 1-2-3-4** (dichiarata, non eccezione):
- da fase 3 si torna in 1 se manca un documento-anima fondamentale (es. non avevamo deciso la voce del narratore)
- da fase 4 si torna in 3 per riempire `null` lasciati nel grafo (passata riempitiva contestualizzata)
- da fase 6 si torna in 4 o 5 raramente, e solo se emerge che il brief era incompleto (è un segnale forte di un buco a monte)

**Da fase 5 in avanti l'iterazione è bandita** salvo errori manifesti. Se l'agente prosa fa domande strutturali o tenta di reinterpretare, manca qualcosa nel brief — e il brief non si patcha in chat, si rigenera dallo script dopo aver corretto la fonte a monte.

---

## 3. Le quattro fonti del brief, e perché il brief non scala col testo

### 3.1 Le quattro fonti

Il brief autosufficiente — cuore della fase 5, oggetto da cui dipende tutta la qualità della fase 6 — si compone meccanicamente da **quattro fonti** distinte e non sovrapposte:

| Fonte | Cosa contiene | Vive in | Si modifica… |
|---|---|---|---|
| **Grafo** | struttura: cosa succede nelle storie, scene, ruoli per scena, seeds, callbacks, debts, archi personaggi, ancore visive/sensoriali, vincoli locali alla storia | un file JSON canonico del progetto (o equivalente) | solo via script idempotente, mai a mano, dopo congelamento schema |
| **Catalogo** | vista esterna delle entità: come si presentano e vanno raccontate (anche per testo puro), aspetto/comportamento/atmosfera, modalità distinguibili, cliché da evitare specifici per entità | una cartella di schede strutturate, una per entità | manualmente con cautela, body delle schede arricchibile, frontmatter via script |
| **Bibbia** | canone del mondo: cosmologia, regole interne, atmosfera generale, framework strutturale silente (se presente), atlante, distinzioni e categorie | uno o più documenti Markdown nel progetto | raramente, con bump di versione esplicito; ogni cambio innesca propagazione a valle |
| **Carta voce + pattern AI da bandire** | come scrivere e come non scrivere: registro, ritmo, lessico ammesso/escluso, pattern stilistici banditi (proposti dall'AI con fetch web in fase ideazione, scelti dall'umano) | due documenti Markdown nel progetto | quando si decide di evolvere lo stile (raro); il pattern AI può essere rifrescato per modello LLM in uso |

**Le quattro fonti non si sovrappongono.** Un dato vive in una sola fonte. Aspetto di un personaggio → catalogo. Voce di un personaggio → grafo (frasi-codice del nodo personaggio) e bibbia (note di voce generali). Ruolo del personaggio nella scena di S5 → grafo (nodo storia, sotto-nodo cast in scena). Mai duplicazione. Quando un dato emerge in fase ideazione, *si decide subito dove vive*, non si mette in due posti "per sicurezza".

### 3.2 Perché il brief non scala col testo finale

Empiricamente, dentro un progetto serio, **il brief comprime il *seme* di una storia**, non il testo della storia. Quel seme ha una dimensione che è funzione della *complessità* della storia, non del medium o del target.

Ordine di grandezza osservato: **fino a ~30k parole di brief** per comprimere il seme di un'unità narrativa qualunque. Sotto questa soglia, in storie ricche, qualcosa di necessario all'agente prosa va perso. Sopra, non serve.

Implicazione: un capitolo di romanzo denso e un albo illustrato denso hanno semi della *stessa grandezza*, perché entrambi contengono cast attivo + arco + voce + vincoli + callback + setting + visivo. Il rapporto brief : testo finale può andare da 1:1 a 30:1 senza che questo segnali inefficienza. Segnala compressione spinta.

**Conseguenza per il kit.** Non perdere tempo a "ottimizzare la lunghezza del brief" come metrica primaria. La metrica primaria è: *l'agente prosa scrive senza fare domande strutturali e senza inventare?* Se sì, il brief è denso quanto basta. Se no, manca qualcosa. La densità si misura sull'output, non sul brief.

---

## 4. Template-pattern A — il grafo come albero frattale a 3 livelli

Questa è la prima decisione architetturale congelata del kit. Il grafo del tuo progetto **deve avere questa forma, qualunque sia il medium o la lunghezza dell'opera**. Cambia il numero di livelli effettivamente usati e i nomi dei campi specializzati al tuo dominio. Non cambia la *forma frattale*.

### 4.1 La forma — tre livelli, stesso pattern

```
LIVELLO MACRO  (radice del grafo)
   │
   ├── metadata progetto
   ├── entities                  ← catalogo strutturale tipizzato
   ├── relazioni globali          ← seeds, callbacks, debts, archi
   ├── unità narrative            ← una per storia/capitolo/episodio/tavola
   ├── tracciatori globali        ← contatori unicità saga, quote tracker
   ├── convenzioni del mondo      ← regole trasversali a tutte le unità
   └── vincoli globali attivi
```

```
LIVELLO MEDIO  (ogni entità + ogni unità narrativa)
   │
   ├── identità (chi/cosa/dove)
   ├── tipo + sottotipo + categoria tematica
   ├── arco temporale (stato che evolve attraverso le unità)
   ├── vincoli + cliché-da-evitare specifici
   ├── note voce / sensoriali
   ├── relazioni con altre entità
   └── riferimento alle apparizioni nelle unità
```

```
LIVELLO MICRO  (ogni scena dentro un'unità narrativa)
   │
   ├── chi-è-presente (riferimenti a entità del macro)
   ├── dove (riferimento a luogo del macro + qualifier locale)
   ├── quando (momento temporale, condizioni)
   ├── focal action + focal object
   ├── atmosfera + palette + sensoriale
   ├── stratificazione semantica (se il framework strutturale lo prevede)
   ├── composizione / inquadratura / layout (dipende dal medium)
   └── vincoli locali a questa scena
```

### 4.2 La forma è frattale: i tre livelli condividono famiglie di campi

I tre livelli sono **viste a granularità diverse della stessa cosa**. Indipendentemente dal livello, ogni nodo del grafo ha tipicamente:

- *chi* (entità coinvolte)
- *dove* (riferimento spaziale)
- *quando* (riferimento temporale o di posizione narrativa)
- *cosa accade / cosa è* (azione o stato)
- *come si presenta* (sensoriale: visivo, sonoro, palette, atmosfera)
- *vincoli* (cosa non può fare/essere — negative prompt locale)
- *riferimenti incrociati* (a altri nodi: entità, seeds, archi, scene)
- *note di voce* (come narrare questo)

Lo *stesso pattern* compare a livello di personaggio (entità del macro), di storia (unità narrativa del macro), di scena (micro). Cambia solo cosa va in ogni campo.

**Conseguenza.** Quando l'agente IA riempie un livello, sa già la forma. Quando l'umano legge un livello, riconosce la forma. Quando lo script genera il brief, naviga la forma. Il pattern è uno solo, declinato a tre granularità.

### 4.3 Quanti livelli usare nel tuo progetto

| Tipo di opera | Macro | Medio | Micro |
|---|---|---|---|
| Saga / serie / antologia | sì | sì (una unità per storia/episodio) | sì (scene/hook dentro l'unità) |
| Romanzo singolo | sì | sì (una unità per capitolo) | sì o no (scene se servono al brief) |
| Albo illustrato singolo | sì | no (collassa con macro) | sì (una scena per pagina/doppia pagina) |
| Fumetto / graphic novel | sì | sì (per episodio o capitolo) | sì (tavole, eventualmente pannelli sotto) |
| Racconto breve singolo | sì | no | sì (scene se ricche, altrimenti un solo blocco) |
| Podcast narrativo a episodi | sì | sì (un episodio per unità) | sì (segmenti audio) |

Regola: **non saltare il livello macro mai**. Il livello medio si può collassare con il macro per opere singole. Il livello micro si può tenere semplice (poche scene, pochi campi) ma esiste sempre, perché è dove il brief pesca per scena/pagina.

### 4.4 Famiglie di campi del livello macro — categorie generali

Ti dichiaro le **categorie** di campi che servono al livello macro, non i nomi esatti. I nomi li scegli tu, allineati al tuo dominio.

**Identificazione e versionamento del progetto**
- nome / id progetto, versione schema, versione grafo, data ultimo aggiornamento, fase corrente, descrizione

**Entities — catalogo tipizzato delle "cose" del mondo**
- per categoria tematica: personaggi, luoghi, oggetti significativi, e tutte le altre categorie *specifiche del tuo dominio* (in un mondo con magia: incantesimi; in un mondo con tecnologia: artefatti tecnici; in una saga con elementi atmosferici dominanti: fenomeni; ecc.)
- ogni entità è un nodo strutturato (vedi §4.5)

**Relazioni globali — il "tessuto" che lega le unità narrative**
- promesse narrative (qualcosa piantato in un'unità che fiorirà in un'altra; in vari progetti chiamati *seeds*)
- richiami espliciti (callback espliciti tra unità)
- debiti narrativi (qualcosa aperto che resta aperto, da chiudere)
- archi personaggi (l'evoluzione di un'entità attraverso le unità)

**Unità narrative — una per storia/capitolo/episodio**
- ogni unità è un mini-grafo (vedi §4.6)

**Tracciatori globali — contatori che impongono unicità o varietà a livello saga**
- "questo nome / oggetto / pattern è già stato usato in queste unità"
- serve per far rispettare regole tipo "mai due unità di fila con la stessa formula" o "questo elemento è unico nella saga"

**Convenzioni del mondo — regole trasversali**
- pattern ricorrenti che attraversano tutte le unità
- formule, ritornelli, leggi del mondo, schemi temporali (giorno/notte, stagioni, cicli)

**Vincoli globali attivi**
- cose che valgono sempre, in ogni unità
- particolarmente utile come negative prompt globale al livello scrittura

### 4.5 Pattern di un nodo entità (livello medio)

Ogni entità del grafo, qualunque sia la sua categoria tematica, ha un nodo con pattern:

- **identità** — id, nome, categoria tematica, tipo, sottotipo
- **caratterizzazione** — campi specifici alla categoria (per personaggio: specie/età/funzione; per luogo: tipo edificio o spazio, abitante; per oggetto: materiale, scopo, simbolismo)
- **arco temporale** (opzionale) — `stato_per_unità: { unità_1: stato, unità_2: stato, ... }` — utile per le entità che evolvono
- **note voce / sensoriali** — come si manifesta narrativamente (frasi tipiche se parla, suoni se è un luogo, ecc.)
- **vincoli** — cosa non fa mai, cosa non è mai
- **relazioni con altre entità** — riferimenti incrociati
- **riferimenti incrociati a altre fonti** — bibbia §X.Y, catalogo `<famiglia>/<id>`, eventuali riferimenti esterni

### 4.6 Pattern di un nodo unità narrativa (livello medio)

Una unità narrativa è un *mini-grafo che riferisce le entità del macro con vincoli locali a quell'unità*:

- **identità + posizione** — id, titolo provvisorio, posizione nella sequenza (capitolo N, episodio N, blocco/parte della saga)
- **meta-narrativa** — registro, lunghezza target, dominante tematica, condizioni ambientali (stagione, momento del giorno, atmosfera dominante), eventuali attributi di framework strutturale silente
- **plot a tre tempi** (o più, dipende dalla forma narrativa scelta) — premessa, problema, momento-soglia, modalità di risoluzione (in narrazione fattuale, non in prosa: questi sono i fatti)
- **cast in scena** — riferimenti alle entità presenti, con ruolo locale a questa unità e vincoli locali (cosa fa qui, cosa NON fa qui, frasi codificate da preservare)
- **luoghi** — primario + secondari, riferimenti al macro
- **scene / hook (livello micro)** — vedi §4.7
- **relazioni narrative ereditate** — seeds piantati / maturati / fioriti / raccolti qui; callback fatti qui; debts aperti / chiusi qui
- **vincoli universali toccati** — quali vincoli globali sono rilevanti per questa unità
- **note voce essenziali per questa unità** — istruzioni specifiche all'agente prosa per *questa* unità
- **note strutturali** — annotazioni sulla posizione di questa unità rispetto all'arco saga complessivo

### 4.7 Pattern di un nodo scena/hook (livello micro)

Ogni scena è un nodo con pattern:

- **identità** — id, tipo (può essere classificato: scena di azione, dialogo, paesaggio, introspezione, transizione...)
- **chi è presente** — entità del macro
- **dove** — riferimento a luogo del macro + qualifier locale (es. "interno banco impasto", "soglia all'alba")
- **quando** — momento, condizioni
- **cosa accade** — focal action (l'azione centrale), focal object (eventuale)
- **come si presenta** — atmosfera, palette, elementi sensoriali
- **stratificazione** (opzionale) — se il progetto ha un framework strutturale silente con strati di lettura, ogni scena dichiara cosa porta a ogni strato
- **composizione / inquadratura / layout** — *dipende dal medium*: per illustrato, zona compositiva e palette; per fumetto, layout della tavola/pannello; per testo puro, ritmo e densità della prosa attesa
- **vincoli locali** — cosa NON va in questa scena specifica
- **note** — eventuali annotazioni tecniche

### 4.8 La regola d'oro del grafo — schema congelato + aggiunte additive

**Una volta fissato il template-pattern del grafo per il tuo progetto, lo schema si congela.** Da qui in avanti:

1. **Aggiunte di campo sono rare e devono essere intenzionali.** Non si aggiungono campi "ah, mi sono ricordato che serve anche X, lo metto solo dove me ne ricordo".
2. **Quando si aggiunge davvero un nuovo campo, si aggiunge retroattivamente in tutti i nodi dello stesso livello, con valore `null` dove non si sa.** Non si lascia il campo "presente in alcuni nodi sì, altri no": la non-uniformità dello schema è bug strutturale, non flessibilità.
3. **Il riempimento dei `null` avviene in passate dedicate**, mai in modalità "approfittone mentre faccio altro". Una passata riempitiva è un'operazione idempotente che cicla su tutti i nodi con `null` per quel campo, e *contestualizza* il riempimento: l'agente IA legge bibbia + entità coinvolte + arco + nodi adiacenti, e *completa* — non inventa, perché ogni `null` è un buco preciso in un contesto preciso, e la risposta è già implicita altrove.
4. **Le rinominazioni di campo sono vietate** dopo il congelamento. Se proprio si deve rinominare, si fa via script di migrazione idempotente con backup, e si bumpa la versione schema.

Questa è **la promessa di non-deriva del grafo**, e la condizione necessaria perché il brief sia generabile meccanicamente con qualità ripetibile.

---

## 5. Template-pattern B — il catalogo come vista esterna del grafo

Il catalogo è la **rappresentazione esteriore strutturata** delle entità del grafo. Per ogni entità promossa nel grafo a livello macro esiste una scheda nel catalogo. Le due cose sono speculari ma non duplicate: il grafo dice *come l'entità interagisce con la storia*, il catalogo dice *come l'entità si presenta*.

### 5.1 Perché il catalogo serve anche per testo puro

Il catalogo non è "il posto delle illustrazioni". Il catalogo è il **glossario esteso** del progetto: per ogni entità, una scheda che dice come quel personaggio/luogo/oggetto si presenta sensorialmente e si racconta. Anche per opere di solo testo, l'agente prosa pesca dal catalogo per descrivere coerentemente attraverso le unità narrative — la stessa volpe deve avere la stessa coda nello stesso mantello con la stessa firma visiva in ogni scena, anche se non c'è alcuna illustrazione.

Per opere illustrate o multimediali, dal catalogo si genera anche l'asset (immagine canonica, sample audio, mood board), ma è una funzione *aggiuntiva*, non la funzione primaria.

### 5.2 Le sezioni canoniche di una scheda

Una scheda nel catalogo segue il pattern qui sotto. Le sezioni con *(medium-dipendente)* esistono solo se il tuo progetto ha quel canale di output. Tutte le altre sono universali.

```
FRONTMATTER MACHINE-READABLE
   id, nome, famiglia (categoria tematica), sottotipo,
   tipo (dal grafo), ruolo nel progetto, status (provvisorio/canonico),
   data ultima modifica, fonti (riferimenti puntuali alle altre tre fonti),
   relazioni con altre entità

§ IDENTITÀ — SINTESI
   un paragrafo di 3-5 righe: cosa coglie a colpo d'occhio
   chi incontra l'entità

§ FORMA / ASPETTO / SENSORIALE
   la presenza fisica (o sonora, o atmosferica): tutto ciò che è
   percepibile dall'esterno

§ MANIFESTAZIONE / ABBIGLIAMENTO / FIRMA VISIVA O SONORA
   tratti distintivi permanenti, firma riconoscibile,
   stato d'uso

§ ESPRESSIONE / COMPORTAMENTO / MODALITÀ
   come l'entità si manifesta narrativamente, modalità
   visivamente o ritmicamente distinguibili (es. modalità di
   espressione che cambiano ma sono codificate)

§ PALETTE / ATMOSFERA / REGISTRO
   il registro sensoriale permanente dell'entità

§ CONTESTO E AMBIENTAZIONI RICORRENTI
   dove l'entità appare tipicamente, in che configurazioni
   di scena

§ COERENZA CROSS-SCENA
   cosa è fisso attraverso tutte le apparizioni, cosa varia,
   cosa NON deve mai variare

§ VARIABILITÀ AMMESSA
   in che modi l'entità può essere rappresentata diversamente
   senza rompere il canone

§ CLICHÉ DA EVITARE
   negative prompt specifico a questa entità, distinto dal
   pattern AI globale (es. "mai sguardo da rapace, è
   un airone calmo": vincolo specifico)

§ PER STAMPA 3D     (medium-dipendente)
§ PER NARRATIVA E SOCIAL  (medium-dipendente)
§ PER GENERAZIONE IMMAGINE  (medium-dipendente)
§ PER GENERAZIONE AUDIO  (medium-dipendente)
§ PER IMPAGINAZIONE / FUMETTO  (medium-dipendente)

§ STORIE / SCENE DI APPARIZIONE
   lista deterministica, derivata dal grafo: in quali unità
   narrative e scene compare

§ DISALLINEAMENTI / DOMANDE APERTE
   inconsistenze rilevate ma non ancora risolte, da
   ridiscutere con l'autore

§ RIFERIMENTI PUNTUALI
   per ogni dato della scheda, da dove viene:
   bibbia §X.Y, grafo entities.<famiglia>.<id>,
   ricordo di chat con l'autore del DD/MM, derivazione autoriale,
   ecc.
```

### 5.3 Provenance di sezione e marker di completamento

Ogni sezione della scheda ha **provenance dichiarata**: travaso 1:1 dalla bibbia, dal grafo (deterministico), derivazione autoriale, autoriale puro. Le sezioni in derivazione vanno tracciate in *Riferimenti puntuali*.

Le sezioni non ancora compilate **non si lasciano vuote silenziose**: si marcano con un placeholder esplicito (in molti progetti `_da popolare_` o equivalente). I marker non sono imperfezioni: sono **un protocollo di stato**. Lo script che genera il brief sa distinguere "sezione non popolata" da "sezione popolata vuota" perché trova il marker.

Lo **status** della scheda è esplicito nel frontmatter: `provvisorio` (alcune sezioni hanno marker) o `canonico` (tutte le sezioni applicabili sono compilate, l'autore ha approvato).

### 5.4 Categorie tematiche del catalogo — universali e specifiche

Universali (le incontra qualsiasi progetto narrativo):
- **personaggi** — chiunque agisce o parla
- **luoghi** — dove le scene avvengono

Comuni ma non sempre presenti:
- **oggetti significativi** — solo se nel tuo progetto degli oggetti sono ricorrenti, simbolici, o portatori di seeds
- **gruppi / collettività** — quando un insieme di personaggi agisce come unità (un coro, una folla nominata, un gruppo professionale)

Specifici al dominio del progetto (esempi possibili):
- **fenomeni atmosferici** in mondi con elementi naturali dominanti
- **incantesimi / artefatti** in mondi fantasy
- **dispositivi / sistemi** in mondi di fantascienza
- **rituali / cerimonie** in mondi a forte componente cerimoniale
- **firme audio / leitmotiv** in opere musicali

Regola: una categoria tematica esiste nel catalogo *se e solo se* compare nel grafo come tipo di entità. Se non c'è nel grafo, non c'è nel catalogo.

### 5.5 Asset associabili a una scheda — opzionali, dipendono dal medium

Una scheda può avere asset accompagnatori in una sottocartella dedicata:
- **immagini canoniche** (per opere illustrate o con asset visivi): `<id>_canonica_v1_<vista>.<estensione>`, intoccabili come reference
- **prompt di generazione** per AI di immagine / audio (separati per modello, perché lo stile cambia con il modello)
- **descrizione narrativa-social** breve, lunga, registri d'uso interni
- **mood board** o reference esterni
- **sample audio** per opere che hanno componente sonora

Il pattern di naming canonico degli asset, e il vincolo "una volta canonizzato non si tocca", sono regole del kit.

### 5.6 Il catalogo come glossario-consegna in fase ideazione

In fase ideazione (fase 1 della pipeline), il catalogo non è ancora il catalogo maturo. È la sua versione embrionale: per ogni entità che sai esistere (anche solo per nome), apri una scheda con quei pochi campi che hai già in testa. Lascia tutto il resto come marker `_da popolare_`. Quando inizi a raccontare le storie all'AI in fase 3, l'AI distilla dalle storie e riempie i marker, fermandosi a chiederti dove decidi tu.

Conseguenza: **non esiste un "documento glossario" separato dal catalogo nel kit**. Il glossario è il catalogo all'inizio, prima del congelamento del grafo. Il *contenuto* del glossario è quello che gli autori esperti già vorrebbero scrivere subito (nome, atmosfera, voce, fisico, arco), riversato direttamente nelle sezioni della scheda canonica.

---

## 6. Mappa isomorfica all'architettura agentica generale

Questo kit è una **specializzazione narrativa** di un'architettura agentica generale. Mappando le sue 7 macro-aree tipiche:

| Macro-area generale | Da noi |
|---|---|
| **Input / contesto** | umano in fase ideazione (chat, idee), file canone (bibbia / voce / glossario / archi), narrazione fattuale per unità narrativa, eventi-trigger (es. "ho aggiornato bibbia, rilancia") |
| **Costruzione del contesto** (RAG / CAG / Knowledge Graph) | **CAG-first + KG-first**, RAG marginale (vedi §6.1) |
| **Orchestrazione** (single / planner-executor / multi-agent) | **multi-agent specializzato** con un livello *orchestratrice* sopra (vedi §7) |
| **Tool / azioni** | web fetch (per leggere brief o canone da repo durante chat), filesystem repo (read/write Markdown e JSON), esecuzione script Python idempotenti, eventuale fetch web in fase ideazione per inferenza voce e pattern AI da bandire |
| **Output / risultati** | testo prosa per unità, modifiche al grafo via script, schede catalogo, asset di output |
| **Valutazione / guardrails** | audit script idempotenti del grafo + revisione umana blocco-per-blocco + critic agent per coerenza fisica e realismo (vedi §6.2) |
| **Memoria** | repo Git versionata come long-term (KG + data lake + vector "logico" tutto insieme), brief generato come cache materializzata, chat corrente come short-term |

### 6.1 Tre scelte architetturali specifiche del kit

**1. CAG-first + Knowledge-Graph-first, non RAG-first.**
La conoscenza vive nel grafo (KG) e in brief pre-costruiti (CAG: contesto strutturato, materializzato per la singola operazione). RAG (ricerca semantica su corpus) è marginale: serve solo in fase ideazione (es. per inferire pattern AI da bandire o voce da autori reali via fetch web). La ragione: nelle opere narrative *il canone è finito e fissato*, non è un corpus che cresce. Vector DB è la soluzione sbagliata al problema. Filesystem versionato è più trasparente, più ispezionabile, più editabile a mano.

**2. Multi-agent con routing tramite orchestratrice.**
Più agenti specializzati (uno per skill: ideazione, catalogatore, brieffer, scrittrice, illustratore, impaginatore, critic agent), routing operativo dato a un'**orchestratrice** che vive sopra di loro e parla con l'umano. Il planner non è automatico/algoritmico: l'orchestratrice è un agente IA che conosce il flusso del kit, lo stato del progetto, e sa quale skill attivare e in che modalità (in propria chat condivisa, oppure aprendo una chat dedicata in cui un agente specifico lavora con l'umano, oppure invocando uno script). Vedi §7.

**3. Filesystem Git come memoria long-term.**
Niente database. Cartelle e file Markdown/JSON versionati. Trasparenza > velocità. L'umano può ispezionare, fare diff, fare rollback con strumenti standard. Per progetti narrativi non serve velocità di query massiva — serve tracciabilità delle decisioni autoriali nel tempo.

### 6.2 Un'aggiunta nostra rispetto all'architettura generale

**Guardrail preventivi nel contesto, non solo post-output.**

Le architetture agentiche generali pongono i guardrail dopo l'output (validazione, retry, critic). Noi li abbiamo anche **prima**, dentro il brief stesso: il pattern AI da bandire è incluso integrale nel brief che riceve l'agente prosa. La validazione avviene *durante* la generazione, non *dopo*. Ragione di dominio: la qualità della voce autoriale è meglio definita per esclusione (cosa non fare) che per prescrizione (cosa fare), e l'esclusione è più efficace inserita prima che dopo.

Abbiamo comunque un guardrail post-output: il **critic agent** (vedi §7.2) per coerenza fisica e realismo. Ma opera su grafo e catalogo (fase 2-4), non su prosa (fase 6). Sulla prosa è l'umano che valuta blocco-per-blocco — non c'è critic automatico, perché la valutazione di voce autoriale richiede sensibilità umana.

---

## 7. Lo spazio dell'orchestratrice — predisposizione

L'orchestratrice è il *livello di mediazione tra l'umano e il sistema agentico*. È l'agente che rende usabile il kit a chi non sa gestire sistemi complessi in autonomia, e che fa risparmiare tempo anche a chi sa.

In questa fase del kit la **predisponiamo come spazio architetturale, non la implementiamo ancora**. La sua specifica completa, le sue skill operative, e il suo MCP di supporto vengono in fasi successive del kit. Qui dichiariamo solo la sua forma e la sua funzione, perché lo scheletro del kit deve già lasciarle spazio.

### 7.1 Funzione dell'orchestratrice

- **dialoga direttamente con l'umano**, allo stesso livello (è il punto d'ingresso umano-friendly al kit, non un tool sotto l'umano)
- **mantiene lo stato del progetto** (a che fase è il progetto, quali unità sono fatte, quali entità promosse, quali brief generati, quali decisioni autoriali prese, dove sono i `null` ancora aperti)
- **decide quale skill attivare** in base allo stato e alla richiesta dell'umano
- **passa il testimone** lungo la pipeline: unità finita → critic agent → catalogatore se ci sono entità nuove → illustratore se l'opera ha asset visivi → impaginatore
- **apre chat dedicate** dove l'umano lavora con un agente specifico in modo focalizzato (es. agente prosa + umano per la singola unità narrativa); l'orchestratrice in quel momento *non guarda*, riceve solo l'esito quando la chat chiude
- **lancia gli script idempotenti** che non hanno bisogno di chat (brieffer, audit, build catalogo)
- **interpella l'umano sulle decisioni autoriali** che non può prendere lei

### 7.2 Tipologie operative degli agenti sotto l'orchestratrice

Due tipologie operative — distinte per *come* l'agente viene attivato e *con chi* parla, non per *cosa* fa.

**Agenti background (autonomi, niente UI).** L'orchestratrice li lancia direttamente come **subprocess** o tool MCP. Niente interazione con l'utente. Idempotenti. Esempi: `bootstrap_graph`, `build_brief`, `audit_graph`, gli script di prebuild della web.

**Agenti foreground (interattivi, dialogo con utente).** Hanno bisogno di una **chat dedicata** con l'utente. Esempi tipici: distillatore Fase 03, agente prosa Fase 06, analista voce, agente di Fase 01 ideazione. Lavorano con il loro contesto pulito, senza il "rumore" di tutto ciò che ha fatto l'orchestratrice. Producono output che l'orchestratrice integra alla fine della sessione.

> **L'orchestratrice non può aprire una nuova istanza di Claude Code da sé.** Quindi per gli agenti foreground il pattern è: l'orchestratrice prepara la sessione in `_agenti/<nome>/_sessione_corrente/`, istruisce l'utente a lanciare `claude` in quella cartella, l'agente lavora con l'utente, scrive output nel filesystem, l'utente torna nella chat orchestratrice, l'orchestratrice integra.
>
> Comunicazione orchestratrice ↔ agente foreground = via filesystem (BRIEFING + INPUT + OUTPUT + log append-only). Robusta, ispezionabile, permette riprese di sessioni interrotte. Convenzione completa: `_convenzioni/agenti_foreground.md`. Tool MCP dedicati: `prepare_agent_session`, `read_agent_session_output`, `list_pending_agent_sessions`.

**Loop a-agente (caso particolare).** Due o più agenti background possono dialogare fra loro a circuito chiuso, senza umano in mezzo. L'orchestratrice li avvia in coppia, riceve l'esito quando il loop chiude. Esempio canonico: catalogatore-compilatore + critic-fisica-realismo. Il critic vive *dentro* loop chiusi con un altro agente, mai in chat diretta con l'umano.

### 7.3 Memoria differenziata

Gli agenti sotto l'orchestratrice hanno memoria **del task** (la skill che incarnano + il contesto della chat corrente). L'orchestratrice ha memoria **del progetto intero** (KG completo + log fasi + decisioni autoriali storiche). È l'unica che usa il KG come *memoria attiva*. Gli altri agenti lo usano come *fonte di lettura*.

### 7.4 MCP di supporto

Il server MCP **`kit-orchestrator`** vive in `_mcp_server/`. Dà all'orchestratrice braccia operative reali sulla repo del progetto: read/write strutturato sul grafo, lancio script, lettura stato, gestione di sessioni di agenti foreground. È la *forma operativa* dell'orchestratrice — il livello sotto cui le sue capacità diventano azioni concrete sul filesystem versionato.

Inventario primo rilascio (16 tool + 2 resources):

- **Resources**: `kit://config`, `kit://status`
- **Fase 02**: `bootstrap_graph`, `migrate_schema`
- **Fase 03**: `write_unit_to_graph`, `split_source_to_units`, `promote_entities`
- **Fase 04**: `compile_catalog`, `build_catalog_index`
- **Fase 05**: `build_brief`
- **Fase 06**: `normalize_storie`
- **Trasversali**: `audit_graph`, `rebuild_web_data`, `get_project_status`, `read_canonical_file`
- **Agenti foreground**: `prepare_agent_session`, `read_agent_session_output`, `list_pending_agent_sessions`

Stack: Python ≥3.10 + FastMCP + stdio. L'utente lo installa una volta (`pip install -e .` in `_mcp_server/`), Claude Code lo aggancia via `.mcp.json` (presente in radice del kit). Vedi `_mcp_server/README.md`.

### 7.5 Pattern di ingegnerizzazione delle skill — 3 layer

Le skill agente IA del kit sono organizzate in **tre layer** componibili. È un pattern standard di prompt engineering applicato al nostro caso, non una complicazione.

**Layer 0 — skill base, generica, riusabile.** Vive in `_skills/<nome>/SKILL.md` dello starter kit. Contiene: identità dell'agente / quando intervenire / come operare / cosa NON fare / output / coordinamento con altri agenti / checklist sanity. È *agnostico al progetto*. Funziona da solo se la fase non ha bisogno di contestualizzare — l'orchestratrice in quel caso passa direttamente il Layer 0 all'agente.

**Layer 1 — specializzazione di fase.** Vive in `_fasi/<NN_fase>/skill_overlay_<nome>.md` dello starter kit. È un *overlay* sopra il Layer 0: aggiunge il contesto specifico della fase — "in questa fase la skill X opera con questi input attesi, questi output attesi, questi vincoli aggiuntivi". Non riscrive il Layer 0, lo specializza. Se una fase non ha bisogno di Layer 1, il file non esiste e l'orchestratrice usa direttamente il Layer 0.

**Layer 2 — specializzazione di progetto/storia.** Vive nella *repo del progetto reale* (non nello starter kit), tipicamente in `_skill_overlays_progetto/<nome>.md` o equivalente. È l'overlay che l'orchestratrice gestisce *per la specifica opera* su cui si sta lavorando. Aggiunge le particolarità di *quella* storia, *quel* mondo, *quella* voce — esempi: "in questa saga il critic-fisica deve controllare anche stagionalità del legno", "in questo romanzo l'agente prosa deve preservare voci dialettali specifiche". È il layer più volatile e più ricco. Vive nel progetto, non nel kit, perché ogni progetto ha i suoi.

**Composizione.** Quando l'orchestratrice attiva una skill, compone:

```
Layer 0 (base)  →  + Layer 1 (di fase, se esiste)  →  + Layer 2 (di progetto, se esiste)
```

e passa il risultato all'agente come contesto operativo. L'agente legge quello, e opera.

**Conseguenza per il kit.** Lo starter kit fornisce **Layer 0 e Layer 1**. Il Layer 2 è responsabilità di chi adatta il kit al proprio progetto, e si scrive man mano che il progetto evolve. Il Layer 2 è anche il punto naturale dove l'orchestratrice impara dalle correzioni dell'umano: se l'umano corregge sistematicamente un comportamento dell'agente, quella correzione diventa una riga di Layer 2.

---

## 8. Cosa contiene il kit, cosa non contiene

Lo starter kit estrae **forma**: pipeline, template, pattern, convenzioni. Mai **contenuto**: nessun nome di personaggio, nessun luogo, nessuna prosa, nessun prompt canonico di un progetto specifico.

**Il kit contiene (forma):**
- la pipeline 7 fasi (Fase 01-07)
- il template-pattern frattale del grafo a 3 livelli (macro / medio / micro)
- il template-pattern del catalogo (schede entità con frontmatter machine-readable + body con marker `_da popolare_`)
- le 4 fonti del brief (grafo / catalogo / bibbia / carta voce + pattern AI da bandire)
- il pattern degli script idempotenti (`--dry-run` di default, `--apply` per scrivere, backup canonico, additivo)
- il pattern delle skill agente IA autosufficienti (identità / quando intervenire / come operare / cosa NON fare / output / coordinamento / checklist sanity)
- il pattern dei marker machine-readable nel testo finale (uno per scena narrativa, uno per pagina-prodotto fisica)
- il pattern di backup chain canonico (`<file>.pre_<fase>.backup.<estensione>`)
- la convenzione di stato per fasi (file di stato di progetto + log di sincronizzazione + indice fasi storicizzato)
- il pattern di pacchetto autoriale consegnato (documento autoriale → script idempotenti → archivio post-integrazione)
- il pattern del cruscotto editoriale (Next.js + grafo letto via env vars + soft fields per portabilità fra progetti)

**Il kit non contiene (contenuto):**
- nessun personaggio, nessun luogo, nessun oggetto del mondo di un progetto specifico
- nessuna prosa, nessuna frase-codificata
- nessun prompt di generazione canonico
- nessun documento di canone narrativo (bibbia, carta voce, voce autore, framework strutturale silente, pattern AI da bandire — quelli di un progetto sono di quel progetto)
- nessuna immagine
- nessuno snippet di un grafo concreto usato come default

Tutto ciò che è specifico del progetto adottante si scrive nel progetto adottante, mai nel kit.

---

## 9. Stato del kit e prossimi passi

### Cosa è fatto
- (questa fase) Il documento architetturale fondante — questo file.
- Lo scheletro di cartelle di `_starter_kit/` esiste, vuoto.
- Il README di `_starter_kit/` esistente è una versione minima (verrà espanso o sostituito nella prossima fase).

### Struttura modulare delle cartelle

Lo starter kit si organizza in **moduli sviluppabili singolarmente**, dove ogni *fase della pipeline* è una cartella autocontenuta. Questo permette di lavorare a una fase alla volta in qualsiasi ordine, senza che le scelte di una blocchino l'altra.

```
_starter_kit/
├── ARCHITETTURA.md                  documento fondante (questo file)
├── README.md                        entry point del kit (da aggiornare)
│
├── _fasi/                           le 7 fasi della pipeline, una cartella ciascuna
│   ├── 01_ideazione/
│   ├── 02_congelamento_grafo/
│   ├── 03_distillazione/
│   ├── 04_catalogo/
│   ├── 05_brief/
│   ├── 06_prosa/
│   └── 07_editing_composizione/
│       (ogni fase: README + materiali specifici + skill_overlay di fase)
│
├── _skills/                         inventario skill agente IA (Layer 0)
│   ├── README.md                    mappa skill → fasi che le usano
│   ├── orchestratrice/              (predisposta come spazio, vedi §7)
│   ├── ideazione/
│   ├── catalogatore/
│   ├── critic_fisica_realismo/
│   ├── brieffer/
│   ├── prosa/
│   └── ...
│
├── _scripts/                        script Python idempotenti riusabili
│   └── README.md
│
├── _convenzioni/                    regole trasversali al kit
│   ├── stato_progetto.md            convenzione di stato per fasi
│   ├── git.md                       convenzione branch/commit/backup
│   ├── naming_e_versioning.md       naming entità, versioning schema/grafo
│   ├── marker_machine_readable.md   marker testo finale (livello narrativo / pagina-prodotto)
│   ├── architettura_informativa.md  N fonti, gerarchia precedenza
│   ├── quote_tracker.md             vincoli quantitativi globali
│   └── agenti_foreground.md         pattern filesystem-bus per agenti in chat dedicata
│
├── _agenti/                         pattern agenti foreground (chat dedicate)
│   ├── README.md
│   └── _TEMPLATE_AGENTE/            scheletro pronto da copiare per nuovo agente
│       ├── README.md, CLAUDE.md, SKILL.md
│       ├── _sessione_corrente/      preparata dall'orchestratrice
│       └── _sessioni_archivio/      storico sessioni passate
│
├── _mcp_server/                     server MCP kit-orchestrator (FastMCP)
│   ├── kit_orchestrator/            16 tool + 2 resources
│   └── pyproject.toml
│
└── web/                             cruscotto editoriale (Next.js)
    └── README.md
```

**Perché skill in cartella separata, non dentro le fasi.** Alcune skill operano in più fasi (es. catalogatore vive in distillazione + arricchimento + passate riempitive; critic-fisica vive in catalogo + grafo). Tenerle in `_skills/` rende l'orchestratrice un punto unico di pesca: chiama una skill per nome, indipendentemente dalla fase corrente. Le fasi referenziano le skill che usano nei loro README, senza duplicarle. Vedi §7.5 per il pattern Layer 0/1/2: il Layer 0 sta in `_skills/`, il Layer 1 sta dentro la singola `_fasi/`, il Layer 2 sta nella repo del progetto reale (fuori dal kit).

**Perché `_skills/` e `_agenti/` distinti.** Una **skill** è il *cosa fa* (Layer 0 dichiarativo, riusabile, non vincolato a una modalità di lancio). Un **agente foreground** è la *modalità di lancio in chat dedicata*: ha la sua cartella con `CLAUDE.md` di boot, una sessione preparata dall'orchestratrice, un log append-only. Un agente foreground può **importare** una skill (`SKILL.md` rinvia a `_skills/<nome>/SKILL.md`) e aggiungere le regole specifiche di sessione.

### Stato corrente

| Componente | Stato |
|---|---|
| Convenzioni trasversali (7/7) | ✅ |
| Skill agente IA Layer 0 (7/7) | ✅ |
| Script Python idempotenti (14 + 4 audit) | ✅ |
| Materiali fasi 02–06 | ✅ |
| Materiali fase 01 (ideazione) | 🟡 |
| Materiali fase 07 (editing/composizione) | 🟡 |
| Cruscotto editoriale `web/` | ✅ |
| Server MCP per orchestratrice (16 tool, `_mcp_server/`) | ✅ |
| Pattern agenti foreground (`_agenti/`) | ✅ |
| Agenti foreground specifici (Fase 01, voce, distillatore, prosa) | 🟡 |
| Specifica orchestratrice | 🟡 |

### Prossimi passi
1. **Estrarre il protocollo di iterazione collaborativa** per la Fase 01 (autorizzazioni, "fai tu" vs "chiedi sempre", come l'umano segnala "ora basta passiamo alla fase successiva", come l'AI propone scelte di derivazione voce o pattern AI con fetch web in ideazione).
2. **Scrivere la specifica dell'orchestratrice** + il suo MCP di supporto. Fase a sé, dopo che il kit base è completo.
3. **Estrarre i materiali della Fase 07** (editing/composizione) quando un primo progetto pilota arriva a quella fase.

---

## 10. Appendice — Convenzioni applicative

Quando si adotta il kit a un progetto reale, alcune scelte di forma vanno fissate dal progetto:

| Decisione del progetto | File / Path canonico | Riferimento |
|---|---|---|
| Lessico stabile (unità narrative, scene, pagine-prodotto) | `<repo-progetto>/.../convenzioni_progetto.md` | `_convenzioni/naming_e_versioning.md` §8 |
| Gerarchia di precedenza fra fonti (catalogo > grafo > bibbia, ecc.) | `<repo-progetto>/.../convenzioni_progetto.md` | `_convenzioni/architettura_informativa.md` §3 |
| Forma marker provvisorietà (campo gemello vs rolling file) | `<repo-progetto>/.../convenzioni_progetto.md` | `_convenzioni/marker_machine_readable.md` §5 |
| Vincoli quantitativi globali (quote tracker) | livello macro del grafo | `_convenzioni/quote_tracker.md` |
| Convenzione marker stato sezione (`_da popolare_` vs commento HTML) | `<repo-progetto>/.../convenzioni_progetto.md` | `_convenzioni/marker_machine_readable.md` §4 |
| Configurazione cruscotto web (titolo, sezioni attive) | `web/lib/project-config.ts` | `web/README.md` |

Ogni decisione è una specializzazione del Layer 2 del kit (vedi §7.5).

---

**Versione documento:** 0.2
**Branch:** `claude/starter-kit-architettura`
