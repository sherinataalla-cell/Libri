# 📚 Libri

Strumento per l'impaginazione di libri per bambini con esportazione PDF.

## Funzionalità

- **Editor visuale** - Modifica testo e immagini direttamente sulla pagina
- **7 template di pagina** - Copertina, solo illustrazione, testo sopra/sotto/sinistra/destra, solo testo
- **3 formati pagina** - Quadrato (21×21cm), orizzontale (28×21cm), verticale (21×28cm)
- **Font per bambini** - Baloo 2 (giocoso), Patrick Hand (scritto a mano), Quicksand (moderno)
- **Esportazione PDF** - Genera PDF pronti per la stampa con `@react-pdf/renderer`
- **Anteprima libro** - Naviga tra le pagine in modalità anteprima
- **Libro di esempio** - "Il Piccolo Esploratore" per iniziare subito

## Tech Stack

- **Next.js 14** con App Router
- **TypeScript**
- **Tailwind CSS**
- **@react-pdf/renderer** per la generazione PDF

## Avvio rapido

```bash
npm install
npm run dev
```

Apri [http://localhost:3000](http://localhost:3000) nel browser.

## Utilizzo

1. Clicca **+ Pagina** per aggiungere una nuova pagina
2. Scegli il template e il formato desiderato
3. Modifica testo e carica le illustrazioni
4. Personalizza colori, font e dimensioni dal pannello Proprietà
5. Clicca **📄 Esporta PDF** per scaricare il libro

Oppure clicca **✨ Esempio** per caricare un libro dimostrativo.
