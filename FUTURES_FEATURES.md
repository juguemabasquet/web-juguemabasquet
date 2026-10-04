# Futures features / fixes pendents

Recull de canvis discutits però no implementats encara. Pendents pel proper deploy.

---

## 1. Fix: mini-mapa del modal "Reporta una pista" trenca amb "API KEY REQUIRED"

**Estat:** bug confirmat, reproduït amb Playwright tant en local com en producció (juguemabasquet.org).

**Causa:** `assets/js/form-minimap.js` (~línia 10, dins `initMiniMapa()`) carrega els tiles del mini-mapa des de CartoDB Voyager (`{s}.basemaps.cartocdn.com/rastertiles/voyager/...`). Carto ara exigeix API key pròpia per aquest servei; sense key, retorna un tile d'avís amb el text "API KEY REQUIRED" repetit en diagonal en lloc del mapa. El mapa principal de la secció (`assets/js/map.js:277-295`) no té aquest problema perquè fa servir Esri, un proveïdor diferent.

**Fix acordat:** canviar la URL dels tiles del mini-mapa a **Esri** (el mateix proveïdor que ja fa servir el mapa principal a `assets/js/map.js:288-295`), per mantenir consistència visual entre els dos mapes i evitar dependència de cap key.

**Abast:** canvi d'una línia (URL del tile layer) dins `initMiniMapa()` a `assets/js/form-minimap.js`. No cal tocar lògica ni la resta del formulari.

---

## 2. Bento "Troba la teva pista": mapa de fons + mirilla animada

**Estat:** idea validada, disseny acordat, pendent d'implementar.

**Objectiu:** substituir el fons pla taronja (`.c-orange`, `assets/css/styles.css:2478`) de la targeta "Mapa de Pistes / Troba la teva pista" (`index.html:168-177`, 3a targeta del bento grid) per un mapa estàtic de Badalona amb una "mirilla" (retícle) que recorre l'amplada de la targeta en bucle.

**Font del mapa:** Esri **World Street Map** (gratuït, sense API key, sense compte Google Cloud) — és l'estil que visualment més s'assembla al Google Maps "clàssic" (fons clar, jerarquia de vies en taronja/groc), i és el mateix proveïdor (Esri) que ja fa servir el mapa principal de pistes, així que no s'afegeix cap dependència nova al projecte. Descartat OpenStreetMap estàndard (estil massa diferent de Google) i Esri World Imagery/satèl·lit (ja s'usa al mapa principal per l'aspecte aeri, aquí busquem l'aspecte "mapa de carrers"). S'exporta/renderitza **un sol cop** i es guarda com a asset local (`.webp` comprimit, objectiu ≤100-150KB) — no hi ha cap crida a cap API en producció, cost i rendiment son zero.

**Patró a reutilitzar:** el mateix que ja fa servir la targeta "Activitats" (`bento-poster`, `index.html:159-165`): imatge de fons `position:absolute;inset:0;object-fit:cover`, amb un scrim en gradient (aquí, tons taronja/negre de marca) a sobre perquè el text segueixi sent llegible.

**Mirilla animada:** SVG inline (no GIF — un GIF real pesaria molt més per mala compressió), animada amb `@keyframes` sobre `transform: translateX()` (GPU, no `left`, per evitar reflow), recorrent tota l'amplada de la targeta en bucle. Respectar `prefers-reduced-motion: reduce`.

**Fitxers a tocar:**
- `index.html:168-177` — marcatge de la targeta (afegir `<img>` de fons + element mirilla, seguint l'estructura de `bento-poster`)
- `assets/css/styles.css:2478` (classe `.c-orange` actual) — nova classe tipus `.bento-mapa-bg` amb `padding:0`, overlay, `@keyframes` de la mirilla
- Nou asset: `assets/mapa/badalona-static.webp`

Els textos i claus i18n (`bento.mapa.eye`, `bento.mapa.title`, `bento.mapa.sub` a `assets/js/i18n.js:246`) es mantenen sense canvis, només canvia el tractament visual del fons.

---

## 3. Tancament del Torneig 3x3 Carmelites 2026: treure banner, convertir pàgina en galeria i donar de baixa les inscripcions

**Estat:** idea validada, pendent d'implementar. El torneig ja ha passat.

**a) Treure el banner taronja fix de la home**

`index.html:101-112` — `<a class="banner-3x3" href="events/3x3-carmelites-2026/">`, banner fix (`position:fixed;top:56px`, CSS a `assets/css/styles.css:114-138`) que apareix a totes les pàgines sota el `<nav>`. Com el torneig ja s'ha celebrat, cal treure'l (o el bloc HTML sencer, o amagar-lo per CSS — a decidir en el moment d'implementar).

**b) Convertir `events/3x3-carmelites-2026/index.html` en pàgina de fotos del torneig**

Actualment (340 línies) és una pàgina de presentació de l'esdeveniment (hero amb cartell, detalls, premis, CTA cap a inscripció). Cal transformar-la en una galeria de fotos, seguint exactament el patró de `events/arranjament-pista-carmelites-2026/index.html` (189 línies, ja servint aquest propòsit):
- `event-hero` amb foto de portada + badge "Celebrada" + meta (data/lloc)
- `event-story` — **cal redactar una mini crònica del torneig** (2 paràgrafs curts, com fa `arranjament-pista-carmelites-2026/index.html:56-62`), no és només copiar l'estructura buida
- `event-gallery` amb `.gallery-grid` de `<div class="gallery-item js-zoom"><img loading="lazy"></div>` (fotos noves del torneig a `assets/events/`, seguint el patró de noms pla `3x3-carmelites-<descripció>.webp`)
- Lightbox compartit (`#poster-lightbox`, mateixa lògica JS que la pàgina de referència)
- Treure el CTA cap a `inscripcio.html` (ja no aplica, veure punt c)

**c) Donar de baixa `events/3x3-carmelites-2026/inscripcio.html` — però conservar-la com a plantilla**

Formulari complet d'inscripció d'equips (652 línies): Netlify form, pagament per Bizum, secció de menors/tutors, i18n en 3 idiomes. Un cop tancat el torneig no ha de quedar accessible ni acceptant inscripcions (evitar que arribi gent pensant que encara poden inscriure's i fer Bizum). Però **no s'ha d'esborrar** — és una base reutilitzable per a la propera edició del 3x3.

**Decidit:** moure-la a una ubicació de plantilla, `events/_template-inscripcio-3x3.html`, seguint el patró que ja existeix amb `events/_template.html`, i treure-la de la ruta pública (deixa de ser accessible a `/events/3x3-carmelites-2026/inscripcio`). El CTA que hi apuntava a la pàgina de l'esdeveniment (`index.html:94-98`, `event-cta`) es treu en convertir la pàgina en galeria (punt b).

**d) Enllaçar la galeria des d'Activitats**

Ja existeix un enllaç des de la timeline d'Activitats (`index.html:417-437`, `.acts-item[data-status="soon"]` → `.acts-card href="events/3x3-carmelites-2026/"`), seguint exactament el mateix patró que ja té l'esdeveniment de l'arranjament de pista (`index.html:463-...`, `data-status="done"`). Només cal actualitzar aquesta targeta existent en comptes de crear-ne una de nova:
- `data-status="soon"` → `data-status="done"`
- badge `act3x3.badge` ("Inscripcions obertes") → reutilitzar `act.badge.celebrada` ("Celebrada")
- lead/CTA text (`act3x3.p`, `act3x3.cta`) actualitzats per reflectir que ara és una galeria de fotos, no una inscripció oberta
- thumbnail actualitzat a una foto real del torneig en comptes del cartell promocional

**Fitxers implicats:** `index.html` (banner, timeline d'Activitats), `assets/css/styles.css` (estils `.banner-3x3` a eliminar/amagar), `events/3x3-carmelites-2026/index.html` (reescriure com a galeria), `events/3x3-carmelites-2026/inscripcio.html` (donar de baixa/moure), `assets/js/i18n.js` (actualitzar claus `act3x3.*` i `t3x3p.banner.*` si el banner s'elimina del tot).
