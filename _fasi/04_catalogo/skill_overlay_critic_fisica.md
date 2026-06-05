# Skill overlay — critic_fisica_realismo (Fase 04)

> Layer 1 di specializzazione di fase per la skill `critic_fisica_realismo`. Si compone con il Layer 0 (`_skills/critic_fisica_realismo/SKILL.md`).

## Cosa aggiunge questo overlay alla skill base

Specializza il critic per il loop chiuso con il catalogatore in Fase 04.

### Pattern operativo specifico

1. **Chiamato dal catalogatore**, non dall'autore direttamente. Il catalogatore propone una scheda, il critic la valida.

2. **Agente esterno minimal**: il critic in Fase 04 riceve dal catalogatore:
   - la scheda proposta (la versione che sta per essere consegnata)
   - il grafo del progetto (lettura)
   - la bibbia / canone-mondo (lettura)
   - le altre schede già canonizzate del catalogo (lettura)
   - eventualmente, cartografia / GeoJSON / timeline (lettura, se progetto ne ha)

   Non riceve carta voce, non riceve pattern AI da bandire, non riceve testi finali della prosa. Non gli servono.

3. **Cerca incoerenze fisiche/realismo grossolane** nella scheda proposta, contro le altre fonti. Non cerca perfezione narrativa, non giudica voce/stile.

4. **Output canonico**: OK pulito, oppure lista di issue con riferimento alla fonte di verità in conflitto + suggerimento di correzione (se derivabile) oppure "decisione autoriale richiesta".

5. **Mai corregge**: solo segnala. Il catalogatore corregge dove la correzione è derivabile, oppure si blocca e segnala all'autore.

### Casi tipici Fase 04

- **Personaggio**: età narrativa dichiarata "giovane" nella scheda, ma la bibbia dice "anziano". Critic segnala incoerenza fonte.

- **Luogo**: dimensioni dichiarate "piccola casa" nella scheda, ma cartografia GeoJSON dichiara una feature di 200 m². Critic segnala incoerenza fonte.

- **Oggetto**: materiale dichiarato "metallo" nella scheda, ma la fonte canonica dice "legno". Critic segnala incoerenza fonte.

- **Personaggio**: caratteristica fisica dichiarata "solleva 50 kg" che è plausibile per un adulto, ma la scheda dichiara età "bambino" (8 anni). Critic segnala incoerenza interna.

- **Luogo composto**: blocco INTERNO dichiara "stanza con quattro finestre", blocco ESTERNO dichiara "facciata con due finestre". Critic segnala incoerenza interna.

### Cosa NON fare in questo overlay

- Non valutare la qualità narrativa della scheda (quella la valuta l'autore).
- Non valutare la voce / stile / atmosfera (quella la valuta l'autore).
- Non valutare se la scheda è "completa" (sezioni `_da popolare_` sono protocollo, non incoerenza).
- Non correggere: solo segnalare.
- Non leggere il testo finale della prosa: non è scope.

## Stato

🟡 Overlay scritto, da testare al primo progetto reale.
