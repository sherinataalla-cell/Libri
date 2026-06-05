# Guida — Come lavoriamo insieme

> Per te, autrice. Spiega come funziona il sistema, come usarlo in chat e come vedere la tua storia evolversi nel cruscotto visivo.

---

## Il quadro generale

Il sistema è composto da tre elementi che si parlano:

```
Tu (chat con Claude)  →  Grafo della storia (il "cervello")  →  Cruscotto web (Vercel)
```

1. **Tu** racconti, descrivi, decidi. Claude traduce in struttura.
2. **Il grafo** è la memoria della storia: personaggi, luoghi, scene, archi narrativi.
3. **Il cruscotto web** è la tua finestra visiva sulla storia: puoi vedere i capitoli, le entità, il progresso.

Tutto il lavoro tecnico (script, grafo, file) lo fa Claude. Tu non devi toccare nulla nella repo direttamente — solo aprire PR e mergiarle quando Claude ti dice che è pronto.

---

## Il tuo strumento principale: la chat

Lavori qui, in chat con Claude. Non hai bisogno di aprire file o terminali.

**Cosa fai tu:**
- Racconti le scene del capitolo che stai scrivendo
- Descrivi i personaggi, i luoghi, cosa succede
- Prendi decisioni narrative ("Dante in questo capitolo fa X, mentre Rory capisce Y")
- Dici quando sei soddisfatta di un capitolo

**Cosa fa Claude:**
- Traduce quello che racconti in nodi strutturati nel grafo
- Traccia personaggi, relazioni, archi narrativi
- Genera il brief per il capitolo successivo
- Ti aiuta a scrivere la prosa finale
- Gestisce tutto il lavoro tecnico

---

## Il cruscotto visivo — deploy su Vercel

Puoi vedere la tua storia prendere forma su un sito web privato. Ogni volta che si fa un merge su `main`, il sito si aggiorna automaticamente.

### Come deployarlo (una volta sola)

1. Vai su [vercel.com](https://vercel.com) e collega il tuo account GitHub
2. Crea un nuovo progetto → importa la repo `Libri`
3. Nelle impostazioni del progetto, imposta:
   - **Root Directory**: `web`
   - **Build Command**: `npm run build` (già configurato)
   - **Environment Variable**: aggiungi `REPO_ROOT` con valore `../progetto`
4. Deploy → ottieni il link del tuo sito

Da quel momento, ogni merge su `main` aggiorna il sito automaticamente.

### Cosa vedi nel cruscotto

- **Catalogo**: tutti i personaggi, luoghi, oggetti con le loro schede
- **Atlante saga**: le relazioni e connessioni tra elementi della storia
- **Capitoli**: i testi con le scene evidenziate, i ganci narrativi

---

## Come funziona una sessione di lavoro

### Regola base: una sessione = un branch = un capitolo (o un'attività)

Prima di iniziare ogni sessione, Claude crea un branch dedicato. Tu lavori con Claude sulla chat. Quando il lavoro è finito, Claude apre una PR, tu la mergi su GitHub, e il sito si aggiorna.

**Il flusso passo per passo:**

```
1. Apri una chat con Claude Code
2. Claude crea un branch (es. "cap/cap_09-distillazione")
3. Lavori insieme in chat — tu racconti, Claude struttura
4. Claude committa il lavoro e apre una PR
5. Tu vai su GitHub, apri la PR, clicchi "Merge"
6. Il sito Vercel si aggiorna automaticamente
7. Sei pronta per il prossimo capitolo
```

---

## Prima fase: importare i capitoli già scritti

Hai già 8 capitoli scritti. Prima di iniziare a scrivere i nuovi, questi vanno portati nel grafo — così il sistema conosce la storia fino a qui e può aiutarti meglio da quel punto in poi.

**Come funziona:**

Questo lavoro lo fate insieme, capitolo per capitolo. Per ogni capitolo:

1. Claude legge il testo del capitolo
2. Insieme estraete: cosa succede, chi c'è, dove, quali semi narrativi vengono piantati
3. Claude crea il nodo nel grafo
4. Si passa al capitolo successivo

Non devi fare nulla di tecnico — solo confermarlo se qualcosa non torna e integrare con dettagli che conosci tu.

---

## Dopo l'importazione: il flusso per i capitoli nuovi

Per ogni capitolo dal 9 al 20, il flusso è:

### Fase A — Distillazione (struttura)
Racconti a Claude cosa succede nel capitolo: le scene, le tensioni, chi c'è, cosa cambia nei personaggi. Claude crea il nodo nel grafo.

### Fase B — Brief (contesto)
Claude genera automaticamente un documento con tutto il contesto di quel capitolo: chi è presente, cosa sanno i personaggi fino a quel punto, i semi narrativi aperti, la voce da usare. Zero lavoro da parte tua.

### Fase C — Prosa (scrittura)
Apri una chat dedicata (Claude specifico per la prosa) e lavori sul testo del capitolo. Il brief è il punto di partenza: l'AI scrive applicando la voce di Dante e Rory senza inventare — tutto viene dalla struttura che hai costruito.

---

## Le regole Git in parole semplici

Non devi diventare esperta di Git. Devi sapere solo tre cose:

**1. Ogni sessione ha un suo "cassetto"** (branch)
Claude crea il cassetto all'inizio. Non devi farlo tu.

**2. Quando il lavoro è finito, apri una porta** (PR)
Claude apre la PR. Tu vai su GitHub e clicchi "Merge pull request". Fine.

**3. Non toccare mai `main` direttamente**
`main` è lo stato stabile della storia. Si aggiorna solo quando mergi una PR.

> **Se non sai come mergiarla**: sul browser, apri la repo su GitHub → vai su "Pull requests" → clicca sulla PR → scorri in fondo → "Merge pull request" → "Confirm merge".

---

## In sintesi — cosa devi ricordare

| Cosa | Chi lo fa |
|---|---|
| Raccontare le scene, decidere la storia | Tu |
| Creare branch, gestire il grafo, script | Claude |
| Aprire PR | Claude |
| Mergiarle su main | Tu |
| Vedere la storia nel cruscotto | Entrambi |
| Modifiche strutturali al sistema | Solo con autorizzazione del creatore |

---

## Se qualcosa va storto

- **Non modificare mai file nella repo a mano** (tranne i testi narrativi)
- **Se Claude fa qualcosa di strano**: digli di fermarsi, non mergiarla, e segnalalo al creatore del sistema
- **Per domande tecniche sul sistema**: contatta il creatore

---

*Il sistema è costruito per essere solido anche se si sbaglia. Gli script non rompono nulla senza conferma esplicita. I backup sono automatici. Puoi lavorare tranquilla.*
