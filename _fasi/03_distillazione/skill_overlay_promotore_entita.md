# Skill overlay — promotore_entita (Fase 03)

> Layer 1 di specializzazione di fase per la skill `promotore_entita`. Si compone con il Layer 0 (`_skills/promotore_entita/SKILL.md`).

## Cosa aggiunge questo overlay alla skill base

Specializza il promotore_entita per il momento esatto in cui opera durante la Fase 03, chiamato dal distillatore in passata 0 (sentinella catalogo).

### Pattern operativo specifico

1. **Chiamato dal distillatore**, non dall'autore direttamente. Il distillatore segnala "emersa entità nuova citata: <nome>", il promotore_entita interviene in chat o via script.

2. **Conferma prima di promuovere**: chiedi all'autore in chat "vuoi promuovere `<nome>` come nuova entità di categoria `<X>`? Se sì, qual è il `<id>` snake_case che vuoi usare?" Se l'autore lascia decidere a te, proponi un id e fai validare.

3. **Verifica esistenza** prima di promuovere:
   - cerca id snake_case proposto nel grafo (livello macro)
   - cerca nome esteso nel catalogo (matching fuzzy)
   - chiedi se è davvero nuova o alias di qualcosa già promossa

4. **Promozione idempotente** via script (`promote_entities_to_graph.py` o equivalente):
   - aggiunge nodo entità al grafo a livello macro
   - crea cartella catalogo `<repo-progetto>/.../catalogo/<famiglia>/<id>/`
   - scrive `scheda.md` con frontmatter machine-readable + body con marker `_da popolare_`
   - genera backup canonico del grafo

5. **Restituisce controllo al distillatore** con messaggio sintetico: "✓ promosse N entità. Distillatore può continuare."

### Casi specifici Fase 03

- **Entità ambigua**: l'autore racconta "i fratelli passano per la casa di Z". È nuova o è "abitazione di Z" già promossa? Chiedi prima di promuovere.

- **Categoria tematica non esiste nello schema**: caso raro. Fermati, segnala all'orchestratrice. L'architetto_grafo aggiunge la categoria allo schema con migrazione one-shot, poi tu riprendi.

- **Entità che è in confine fra categorie**: chiedi all'autore. Esempio: un personaggio collettivo (un gruppo) va in *gruppi* o in *personaggi.collettivi*?

- **L'autore vuole "preventivare" molte entità in una sola chiamata**: pattern comune all'inizio di una unità. Ricevi una lista, processi una a una, restituisci consuntivo:
  ```
  ✓ Promosse 3/3 entità nuove:
    - sentiero_dei_pini [locations] → catalogo/luoghi/sentiero_dei_pini/
    - faggio_solitario [locations] → catalogo/luoghi/faggio_solitario/
    - rosario_di_mirto [objects] → catalogo/oggetti/rosario_di_mirto/
  ```

### Cosa NON fare in questo overlay

- Non caratterizzare le entità durante la promozione. Frontmatter compilato, body con marker `_da popolare_`. Caratterizzazione = catalogatore.
- Non promuovere senza autorizzazione esplicita dell'autore (almeno per la prima entità di una sessione; per batch successivi simili l'autore può dire "fai tu" e procedi).

## Stato

🟡 Overlay scritto, da testare al primo progetto reale.
