# `_template_schede/` — Template di scheda per categoria tematica

Template di scheda catalogo, una per categoria tematica universale o ricorrente. Si usano in Fase 04 (compilazione catalogo) come punto di partenza, da specializzare al dominio del progetto.

## File

| File | Categoria | Sezioni canoniche |
|---|---|---|
| `TEMPLATE_personaggio.md` | personaggi (universale) | identità / aspetto / abbigliamento / espressione / palette / contesto / coerenza / variabilità / cliché / voce e frasi codificate / 3D / social / storie / disallineamenti / riferimenti |
| `TEMPLATE_luogo.md` | luoghi (universale) | identità / geografia / dinamica / palette / contesto / coerenza / variabilità / cliché / **blocchi multi: ESTERNO + INTERNO + CORTILE** / 3D / social / storie / disallineamenti / riferimenti |
| `TEMPLATE_oggetto.md` | oggetti (comune) | identità / aspetto / stato d'uso / espressione / palette / contesto / coerenza / variabilità / cliché / **stati nel tempo** / 3D / social / storie / disallineamenti / riferimenti |

## Quando usare quale template

- **Personaggi**: tutti i personaggi del progetto, individuali e collettivi
- **Luoghi**: tutti i luoghi del progetto, semplici e complessi (con esterno/interno/cortile)
- **Oggetti**: oggetti significativi narrativamente, semplici o con stati nel tempo

## Categorie tematiche specifiche al progetto

Se il progetto ha categorie tematiche specifiche (es. fenomeni atmosferici, artefatti, dispositivi, gruppi/collettività), il progetto crea **template aggiuntivi** in `<repo-progetto>/.../template_schede/TEMPLATE_<categoria>.md`, modellati sul pattern dei tre universali.

Pattern del template di categoria:

1. frontmatter machine-readable (id, nome, famiglia, sottotipo, status, fonti, relazioni, ultima modifica)
2. sezione "Identità (sintesi)"
3. sezioni descrittive specifiche al dominio (es. per "fenomeno atmosferico": manifestazione visiva / suono / sensazione / quando si verifica)
4. sezione "Coerenza cross-scena"
5. sezione "Variabilità ammessa"
6. sezione "Cliché da evitare"
7. eventuale blocco multi-blocco (se l'entità ha più "facce")
8. sezione "Storie / scene di apparizione"
9. sezione "Disallineamenti / domande aperte"
10. sezione "Riferimenti puntuali"

## Convenzioni comuni a tutti i template

- **Frontmatter machine-readable** sempre presente, con campi obbligatori uniformi
- **Body** sotto il secondo `---`, con sezioni canoniche
- **Marker `_da popolare_`** per sezioni non ancora compilate (vedi `_convenzioni/marker_machine_readable.md` §4)
- **Sezione "Riferimenti puntuali"** sempre presente: ogni dato canonico citato con riferimento puntuale alla fonte
- **Sezione "Disallineamenti / domande aperte"** sempre presente, anche se vuota

## Cosa NON fare

- Non modificare i template del kit per le proprie esigenze di progetto. Fai una copia in `<repo-progetto>/.../template_schede/` e modifica quella.
- Non aggiungere sezioni "carine" senza giustificazione strutturale. La ricchezza canonica dei template è sufficiente.
- Non rimuovere sezioni canoniche del template per "snellire". La sezione vuota con marker `_da popolare_` è un protocollo, non un'imperfezione.
