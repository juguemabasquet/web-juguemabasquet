# Plan: evolución de la portada (bento)


## Contexto

La identidad actual (naranja `#FF6A1A`, Bungee + Inter, mosaico bento) funciona y no se va a reemplazar. Lo que falla es que la portada es un menú estático:

- La tarjeta grande (Actividades, 2×2) sigue con el cartel del 3x3 Carmelites de septiembre, mientras que hoy (12/11) se graba el episodio 1 del pódcast y no aparece en ningún lado de la home.
- "Qui som" y "Entitats amigues" son bloques grises con solo un título. "Col·laboradors" dice "Properament", aunque la sección ya tiene unos 15 colaboradores con logo.
- En móvil, el texto del cartel ("DISSABTE 19 DE SETEMBRE") queda pisado por la etiqueta de la tarjeta, y las tarjetas son altas con mucho espacio vacío.
- Bungee se usa en casi todo, también en fechas y metadatos (`.acts-date`, etiquetas), y eso le quita jerarquía.
- Todo el bento está hecho con estilos inline, repetidos en cada tarjeta.

Objetivo: que la portada muestre lo que está pasando, sin huecos, con mejor jerarquía tipográfica y bien en móvil. El pódcast queda fuera de este plan.

## Cambios

### 1. Tarjeta grande = "destacado" automático

- Añadir `data-date="AAAA-MM-DD"` a cada `<article class="acts-item">` del timeline (`index.html:417-600`). Ese timeline pasa a ser la única fuente de verdad: no se duplica contenido.
- Nuevo `assets/js/bento-destacat.js`, siguiendo el estilo de los demás JS (funciones globales, sin build):
  - Si hay una actividad celebrada hace 3 días o menos (`DIES_CELEBRADA`), la mantiene con la etiqueta "Celebrada" (da margen para subir fotos y crónica). Si no, elige la primera con `data-date >= hoy`. Si no hay ninguna, la más reciente ("Última activitat").
  - Rellena la tarjeta: imagen = `src`/`alt` de `.acts-thumb img`; título y meta = **copia el atributo `data-i18n`** de `.acts-title` y `.acts-date`, para que `setLang()` (`assets/js/i18n.js:1161`) los traduzca sin lógica extra. Después aplica las traducciones del idioma actual a esos nodos.
  - Pone la etiqueta "Pròxim" o "Última activitat" (claves i18n nuevas).
  - El clic reproduce la acción de la tarjeta original (su `onclick`/`href`: modal o página de crónica). Un enlace secundario "Totes les activitats →" llama a `showSection('activitats')` (`assets/js/navigation.js:1`).
- El HTML estático de la tarjeta lleva ya el destacado actual (pódcast ep. 1), así que sin JS no hay salto visual.
- Maquetación de la tarjeta: los carteles son verticales y el texto queda dentro de la imagen. Cartel completo (`object-fit: contain`) sobre su propia versión desenfocada de fondo, y el bloque de texto separado con un degradado. En móvil, el cartel arriba y el texto debajo. Así se arregla el solapamiento.

### 2. Tarjetas con contenido real (solo recursos que ya existen)

| Tarjeta | Ahora | Propuesta |
|---|---|---|
| Qui som | gris vacío | se mantiene gris (sin foto: la del equipo no era de la asociación) + dato de las fites ("+40 pistes analitzades", ya en `fites.f3.sub`) |
| Entrevistes | azul plano | foto que rota por turnos cada 3 días entre las entrevistas de la sección (`assets/js/bento-entrevista.js`, `DIES_ROTACIO`) + nombre del entrevistado; el clic sigue abriendo la sección |
| Entitats amigues | gris vacío | los 2 logos (`assets/entitats/*.png`) en la tarjeta |
| Col·laboradors | "Properament" | tira de 4-6 logos de `assets/patrocinadors/` + "15 col·laboradors →" (se corrige el texto obsoleto en las 3 lenguas) |
| Mapa, Arxiu, Xarxes | — | sin cambios de contenido |

Nuevas claves y claves modificadas en `assets/js/i18n.js` (bloques ca/en/es, líneas ~243, ~628, ~1013).

### 3. Tipografía y limpieza del bento

- Pasar los estilos inline del bento a clases (`.bento-eye`, `.bento-title`, `.bento-sub`, `.bento-media`) en `assets/css/styles.css` (zona ~2282-2445). Se mantiene `data-i18n$=".title"` para que sigan funcionando los tamaños por idioma (líneas 2334-2342 y 2436-2438).
- Bungee solo para los titulares de las tarjetas y de las secciones. Metadatos, fechas y etiquetas en Inter 700/800 con mayúsculas y espaciado. Se aplica a `.acts-date` y a los equivalentes del bento.
- Eyebrows a 11-12px como mínimo (ahora 10px) y contraste de los subtítulos ≥ 4.5:1 (ahora hay `rgba(255,255,255,.35)` sobre negro).

### 4. Móvil (≤600px y ≤1100px, `styles.css:2415-2445`)

- Orden: Destacado primero (ahora va 3º, detrás de Qui som y Mapa), después Mapa, Qui som, Entrevistes…
- Tarjetas de altura ajustada al contenido (sin `min-height` vacíos) y destacado a todo el ancho.
- Revisar que el selector de idioma flotante no tape tarjetas (en la captura tapa la de Entrevistes).

## Fuera de alcance

- Pódcast como sección o página: se decidirá aparte.
- Cambios de paleta, logo o tipografías nuevas.
- Resto de secciones (solo se toca `.acts-date` por coherencia).

## Ficheros

- `index.html`: markup del bento (131-228), `data-date` en el timeline, `<script>` nuevo
- `assets/css/styles.css`: bloque bento y breakpoints
- `assets/js/bento-destacat.js` (nuevo)
- `assets/js/i18n.js`: claves bento en ca/en/es

## Verificación

1. `npm run dev` y revisión manual en CA/EN/ES.
2. Capturas con Playwright (script ya preparado en el scratchpad, con el Chromium en caché) a 1440×900 y 390×844: home y sección Actividades.
3. Probar el destacado cambiando la fecha (pasar la fecha de hoy por parámetro, p. ej. `?hoy=2026-12-18`, solo para debug): antes del 12/11 → ep. 1; el 13/11 → ep. 2; después del 17/12 → la última actividad celebrada.
4. Detector de impeccable sobre los ficheros tocados: `../skills/impeccable/skill/scripts/impeccable detect --json index.html assets/css/styles.css`.
5. Con JS desactivado, la portada se ve bien (destacado estático).
