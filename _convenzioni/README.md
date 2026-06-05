# `_convenzioni/` — Convenzioni trasversali del kit

Convenzioni **stabili attraverso tutto il progetto**, dichiarate una volta per tutte. Sono le regole "di basso livello" che fanno girare il sistema agentico: come si nominano le cose, dove vivono i dati, come si tracciano i cambiamenti, come si gestiscono i vincoli quantitativi globali.

Le convenzioni qui sono **del kit** (Layer 0 generico). Il progetto reale che adotta il kit le **eredita** così come sono, e può **sovrascriverle/specializzarle** dichiarando varianti specifiche in `<repo-progetto>/.../convenzioni_progetto.md`.

## Inventario corrente

| File | Cosa copre | Stato |
|---|---|---|
| [`marker_machine_readable.md`](./marker_machine_readable.md) | marker a 2 livelli (scena/pagina-prodotto), frontmatter, marker stato sezione, marker provvisorietà | ✅ scritto |
| [`naming_e_versioning.md`](./naming_e_versioning.md) | id snake_case, file canone, status schede, semver schema, backup chain canonico | ✅ scritto |
| [`architettura_informativa.md`](./architettura_informativa.md) | N fonti del progetto, regola di non-duplicazione, gerarchia di precedenza, trasferimento di autorità | ✅ scritto |
| [`git.md`](./git.md) | branch, commit, push, divieti, hook, coordinamento agenti IA | ✅ scritto |
| [`stato_progetto.md`](./stato_progetto.md) | 3 file di stato canonici, misalignment tracking, rolling files, pattern pacchetto autoriale | ✅ scritto |
| [`quote_tracker.md`](./quote_tracker.md) | vincoli quantitativi globali, categorie, integrazione con skill distillatore e audit | ✅ scritto |
| `protocollo_iterazione.md` | come si iterano le passate fra agente e autore, autorizzazioni, segnalazioni | 🟡 da scrivere (dipende da Fase 01) |

## Come si usano le convenzioni

Gli agenti IA del kit (skill in `_skills/`) **referenziano** queste convenzioni nei loro SKILL.md. Quando un agente dice "applica la regola d'oro" o "annota nel rolling file di misalignment", sta puntando a queste convenzioni.

Lo stesso vale per gli script del kit (`_scripts/`): quando uno script genera un backup canonico, segue il pattern di `naming_e_versioning.md`. Quando uno script aggiorna i contatori globali, segue il pattern di `quote_tracker.md`.

## Punti di attenzione per il progetto adottante

Quando un nuovo progetto adotta il kit, l'autore (e l'agente architetto in Fase 01-02) **dichiara**:

1. **Lessico stabile** del progetto (vedi `naming_e_versioning.md` §8): come si chiamano le unità narrative, le scene, le pagine-prodotto. Il kit usa termini neutri (*unità*, *scena*, *pagina-prodotto*); il progetto può rinominarli al proprio dominio.

2. **Gerarchia di precedenza fra le fonti** (vedi `architettura_informativa.md` §3): catalogo > grafo > bibbia, oppure altre.

3. **Forma esatta dei marker di provvisorietà** (vedi `marker_machine_readable.md` §5): se i marker `_provisional` vivono nel grafo o in un rolling file separato. *(Decisione che impatta Fase 01)*.

4. **Vincoli quantitativi globali** del progetto (vedi `quote_tracker.md` §3): elementi unici saga, distribuzioni minime/massime, anti-consecutività, ecc.

5. **Convenzione marker di stato sezione** (vedi `marker_machine_readable.md` §4): testo `_da popolare_` visibile, oppure commento HTML invisibile.

Queste dichiarazioni vivono in `<repo-progetto>/.../convenzioni_progetto.md`, un file che il progetto reale crea adottando il kit.

## Stato

🟢 6/7 convenzioni scritte. Manca: `protocollo_iterazione.md` — come si iterano le passate fra agente e autore in chat (autorizzazioni, segnalazioni, blocchi), che dipende da decisioni iterative di Fase 01 e quindi va scritta dopo l'estrazione delle chat di ideazione.
