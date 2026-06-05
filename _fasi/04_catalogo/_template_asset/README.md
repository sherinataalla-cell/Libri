# `_template_asset/` — Template di prompt per generazione asset

Pattern di prompt per generazione asset di output associati alle schede catalogo. Specifico al medium del progetto.

## File

| File | Medium | Cosa è |
|---|---|---|
| `TEMPLATE_prompt_immagine.md` | illustrato / fumetto | template agnostico al modello (Grok / FLUX / DALL·E / SD), pattern: stylesheet + scale + entity + vista + negative |
| `TEMPLATE_prompt_audio.md` | audio / podcast | 🟡 da definire (timbri canonici + ambiente + traccia richiesta) |
| `TEMPLATE_layout_pannello.md` | fumetto / graphic novel | 🟡 da definire (grid + layout + pannelli + balloon) |

## Quando usare quale

| Progetto | Usa |
|---|---|
| Picture book / illustrato | `TEMPLATE_prompt_immagine.md` |
| Albo singolo illustrato | `TEMPLATE_prompt_immagine.md` |
| Fumetto / graphic novel | `TEMPLATE_layout_pannello.md` + `TEMPLATE_prompt_immagine.md` per i pannelli singoli |
| Podcast / audio drama | `TEMPLATE_prompt_audio.md` |
| Romanzo / racconto puro testo | nessuno (skip questa cartella) |

## Specializzazione al progetto

I template del kit sono **agnostici al modello specifico**. Il progetto:

1. copia il template in `<repo-progetto>/.../template_asset/TEMPLATE_prompt_<modello>.md`
2. specializza al modello scelto (Grok / FLUX / Midjourney / DALL·E / SD / ...)
3. testa su 1-2 entità di prova per validare la forma
4. una volta validato, scala a tutto il catalogo

## Stato

🟢 1/3 template scritto (immagine). Audio e fumetto/layout: rimandati a quando un progetto reale del kit ne avrà bisogno (per non scrivere senza un caso d'uso concreto).
