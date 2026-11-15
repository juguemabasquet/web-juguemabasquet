# Plan: tancar el pòdcast «Juguem al Temps» · Episodi 1 (12/11/2026)

Segueix el patró del tancament de Halloween & Castanyada (commit `be6ed19`).

## Canvis

1. **Pàgina de crònica** `events/podcast-juguem-al-temps-ep1-2026/index.html`, a partir de la de Halloween: cartell ampliable, badge "Celebrada", títol "Episodi 1", data, Temps Mort (Maps), crònica, galeria amb lightbox i traduccions CA/EN/ES.
2. **Fotos** convertides a `.webp` a `assets/events/`: `podcast-ep1-conversa-public`, `podcast-ep1-public-sala`, `podcast-ep1-cistella-temps-mort`. Totes tres en format ample a la galeria.
   - La foto de la cistella va sense descripció (`alt=""`) fins que es decideixi què hi posem.
3. **Bloc "Escolta l'episodi"** (`.listen-block` a `assets/css/events.css`): ara diu "Molt aviat a Spotify i YouTube". Quan hi hagi enllaços, treure el `<p class="listen-pending">` i descomentar els botons amb les URL.
4. **Inici (`index.html`)**: la targeta de l'ep. 1 a Activitats enllaça a la pàgina ("Veure la galeria →"); s'elimina el modal de l'ep. 1 (`podcast1-modal.js` i els seus selectors CSS); el fallback estàtic del destacat del bento passa a l'ep. 2.
5. **Crònica genèrica**: només fets coneguts (primer episodi, en directe al Temps Mort, sala plena, Jose Hita com a convidat). Es pot ampliar quan hi hagi detalls.

## Pendent

- Enllaços de Spotify i YouTube.
- Descripció de la foto de la cistella.
