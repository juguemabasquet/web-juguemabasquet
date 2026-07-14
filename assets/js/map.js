/* MAPA DE PISTES DE BÀSQUET DE BADALONA */

const CONFIG = {
  // Deixa buit per usar mode email (les propostes arribaran a info@juguemabasquet.org)
  FORM_URL: '',
  // Deixa buit perquè el mapa només mostri les pistes hardcoded de sota
  SHEET_CSV_URL: '',
  // Email públic que veu la gent
  EMAIL_CONTACTE: 'info@juguemabasquet.org',
  // Còpia oculta (BCC): rep tots els correus sense que la persona ho sàpiga.
  // Deixa buit per desactivar-ho.
  EMAIL_BCC_OCULT: 'info@juguemabasquet.org'
};

/* ---------- Geocodificació automàtica via Nominatim (OSM) ---------- */
async function geocodeAdreca(adreca, city = 'Badalona') {
  const cacheKey = 'geo_' + adreca.toLowerCase().trim();
  try {
    const cached = localStorage.getItem(cacheKey);
    if (cached) return JSON.parse(cached);
  } catch(e) {}

  const q = encodeURIComponent(adreca + ', ' + city + ', Catalunya, Espanya');
  try {
    const res = await fetch(
      'https://nominatim.openstreetmap.org/search?q=' + q + '&format=json&limit=1&countrycodes=es',
      { headers: { 'Accept': 'application/json' } }
    );
    const data = await res.json();
    if (data && data[0]) {
      const result = { lat: parseFloat(data[0].lat), lng: parseFloat(data[0].lon), display: data[0].display_name };
      try { localStorage.setItem(cacheKey, JSON.stringify(result)); } catch(e) {}
      return result;
    }
  } catch(e) {
    console.warn('Geocodificació fallida per:', adreca, e);
  }
  return null;
}



const PISTES = [
  { nom: 'Pista dels Carmelites Descalços', pais: 'Espanya', ciutat: 'Badalona', barri: 'Badalona Centre', estat: 'projecte',
    descripcio: 'Pista cedida pels Pares Carmelites Descalços. Entrada pel Carrer del Mar, 47. Espai inclusiu per a tothom, amb especial atenció a persones amb mobilitat reduïda i diversitat funcional. En procés de renovació.',
    descripcio_en: 'Court lent by the Discalced Carmelite Fathers. Entrance at Carrer del Mar, 47. Inclusive space for everyone, with special attention to people with reduced mobility and functional diversity. Under renovation.',
    descripcio_es: 'Pista cedida por los Padres Carmelitas Descalzos. Entrada por Carrer del Mar, 47. Espacio inclusivo para todos, con especial atención a personas con movilidad reducida y diversidad funcional. En proceso de renovación.',
    adreca: 'Carrer del Mar, 47', coords: [41.4488, 2.2486] },
  { nom: 'Pista Iris-sol-casagemes', pais: 'Espanya', ciutat: 'Badalona', barri: 'Canyadó', estat: 'regular',
    descripcio: '', descripcio_en: '', descripcio_es: '',
    adreca: 'Carrer de Santa Madrona, 158-160', coords: [41.4541, 2.2584] },
  { nom: 'La gàbia', pais: 'Espanya', ciutat: 'Badalona', barri: 'Canyadó', estat: 'bon',
    descripcio: '', descripcio_en: '', descripcio_es: '',
    adreca: 'Eduard Maristany, 18', coords: [41.4567, 2.2586] },
  { nom: 'la Baixadeta', pais: 'Espanya', ciutat: 'Badalona', barri: 'Canyadó', estat: 'malmes',
    descripcio: 'Cistella de ferro amb paviment de sorra',
    descripcio_en: 'Iron hoop with sand surface',
    descripcio_es: 'Canasta de hierro con pavimento de arena',
    adreca: 'Plaça de la Baixadeta', coords: [41.4573, 2.2577] },
  { nom: 'Can soley i Ca l\'arnús', pais: 'Espanya', ciutat: 'Badalona', barri: 'Casagemes', estat: 'regular',
    descripcio: 'Cistelles de ferro i paviment lliscant',
    descripcio_en: 'Iron hoops and slippery surface',
    descripcio_es: 'Canastas de hierro y pavimento resbaladizo',
    adreca: 'Carrer de Sant Bru', coords: [41.4554, 2.2535] },
  { nom: 'Pista Joaquim Ruyra', pais: 'Espanya', ciutat: 'Badalona', barri: 'Gorg', estat: 'regular',
    descripcio: '', descripcio_en: '', descripcio_es: '',
    adreca: 'Carrer Joaquim Ruyra, s/n', coords: [41.4402, 2.2310] },
  { nom: 'Pista Plaça Joan Miró', pais: 'Espanya', ciutat: 'Badalona', barri: 'Gorg', estat: 'malmes',
    descripcio: 'les cistelles sense xarxe formen part del fanals de la plaça, paviment de ciment i lineas de camp sense pintar, us recreatiu, sense poder fer partits',
    descripcio_en: 'Hoops without nets are part of the square lampposts, cement surface, unpainted court lines, recreational use only, no proper games possible.',
    descripcio_es: 'Las canastas sin red forman parte de las farolas de la plaza, pavimento de cemento y líneas de campo sin pintar, uso recreativo, sin poder hacer partidos.',
    adreca: 'Plaça Joan Miró', coords: [41.4431, 2.2331] },
  { nom: 'Pista Plaça Pompeu Fabra', pais: 'Espanya', ciutat: 'Badalona', barri: 'Centre', estat: 'regular',
    descripcio: 'Cistelles: Una cistella gran i una petita | Paviment: Ciment relliscant | Pintura: Sense pintar | Estat per jugar: No es pot jugar partits, ja que les cistelles estan en diferents posicions | Enllumenat: Llum parcial | Accessibilitat: Accessibilitat per tothom',
    descripcio_en: 'Hoops: One large and one small hoop | Surface: Slippery cement | Lines: No painted lines | Playability: Games not possible, hoops are at different positions | Lighting: Partial lighting | Accessibility: Accessible for everyone',
    descripcio_es: 'Canastas: Una grande y una pequeña | Pavimento: Cemento resbaladizo | Pintura: Sin pintar | Estado para jugar: No se puede jugar partidos, las canastas están en posiciones distintas | Iluminación: Luz parcial | Accesibilidad: Accesibilidad para todos',
    adreca: 'Plaça de Pompeu Fabra', coords: [41.4484, 2.2428] },
  { nom: 'Pista La Mora', pais: 'Espanya', ciutat: 'Badalona', barri: 'La Mora', estat: 'regular',
    descripcio: 'Cistelles ja amb xarxes, paviment amb inclinació, sense línies pintades. Es pot jugar partits tot i que cal recordar que la pista té una inclinació.',
    descripcio_en: 'Hoops with nets, sloped surface, no painted lines. Games can be played but the slope must be taken into account.',
    descripcio_es: 'Canastas con red, pavimento con inclinación, sin líneas pintadas. Se pueden hacer partidos teniendo en cuenta la inclinación de la pista.',
    adreca: 'La Mora, Badalona', coords: [41.4312, 2.2376] },
  { nom: 'Plaça d\'Oriol Martorell', pais: 'Espanya', ciutat: 'Badalona', barri: 'Coll i Pujol', estat: 'malmes',
    descripcio: 'Cistelles: Sense xarxa | Paviment: Desnivellat | Pintura: Sense',
    descripcio_en: 'Hoops: No net | Surface: Uneven | Markings: None',
    descripcio_es: 'Canastas: Sin red | Pavimento: Desnivel | Pintura: Sin',
    adreca: 'Plaça d\'Oriol Martorell, Badalona', coords: [41.4520, 2.2429] },

  { nom: 'Plaça Països Catalans', pais: 'Espanya', ciutat: 'Badalona', barri: 'Progrés', estat: 'regular',
    descripcio: 'Cistelles: Metàl·liques, amb xarxes malmeses o inexistents (segons la cistella) | Paviment: Ciment, relliscós | Pintura: Pràcticament esborrades les línies | Estat per jugar: Tirs encara, perillós 1x1 o 3x3 per relliscades. Risc elevat de lesió | Enllumenat: Té llum | Accessibilitat: Accessible | Comentari: Doble pista (dues cistelles). Si s\'acondicionés el paviment (per evitar les relliscades) i es pintessin les línies... Baixaríem a jugar molts dies cada setmana!!',
    descripcio_es: 'Canastas: Metálicas, con redes deterioradas o inexistentes (según la canasta) | Pavimento: Cemento, resbaladizo | Pintura: Líneas prácticamente borradas | Estado para jugar: Tiros aún posibles, peligroso 1x1 o 3x3 por resbalones. Riesgo elevado de lesión | Iluminación: Tiene luz | Accesibilidad: Accesible | Comentario: Pista doble (dos canastas). ¡Si se acondicionara el pavimento y se pintaran las líneas, bajaríamos a jugar muchos días!',
    descripcio_en: 'Hoops: Metal, with damaged or missing nets (depending on the hoop) | Surface: Cement, slippery | Markings: Lines almost completely worn off | Playability: Free throws still possible, dangerous for 1v1 or 3v3 due to slipping. High injury risk | Lighting: Yes | Accessibility: Accessible | Note: Double court (two hoops). If the surface were resurfaced and lines repainted, we\'d be down here playing every week!!',
    adreca: 'Plaça Països Catalans, Badalona', coords: [41.4439, 2.2390] },
];

const ESTAT_TXTS = {
  ca: { bon: 'En bon estat', regular: 'Estat regular', malmes: 'Necessita millora', projecte: '⭐ Projecte actiu',
        arribar: '↗ Com arribar', reporta: '⚠ Reporta',
        incidencia: 'Incidència a', incBody: 'Hola Juguem a Bàsquet,\n\nVull reportar una incidència a la pista:\n',
        incDetall: 'Descripció del problema:\n[explica què has vist]\n\nAdjunto fotos si en tens.\n\nGràcies!',
        capPista: 'Cap pista trobada' },
  es: { bon: 'En buen estado', regular: 'Estado regular', malmes: 'Necesita mejora', projecte: '⭐ Proyecto activo',
        arribar: '↗ Cómo llegar', reporta: '⚠ Reportar',
        incidencia: 'Incidencia en', incBody: 'Hola Juguem a Bàsquet,\n\nQuiero reportar una incidencia en la pista:\n',
        incDetall: 'Descripción del problema:\n[explica qué has visto]\n\nAdjunto fotos si tienes.\n\n¡Gracias!',
        capPista: 'No se ha encontrado ninguna pista' },
  en: { bon: 'Good condition', regular: 'Fair condition', malmes: 'Needs repair', projecte: '⭐ Active project',
        arribar: '↗ Get directions', reporta: '⚠ Report',
        incidencia: 'Issue at', incBody: 'Hi Juguem a Bàsquet,\n\nI want to report an issue at the court:\n',
        incDetall: 'Description of the problem:\n[explain what you saw]\n\nI\'ll attach photos if I have any.\n\nThank you!',
        capPista: 'No courts found' },
};
function getEstatTxts() { return ESTAT_TXTS[currentLang] || ESTAT_TXTS.ca; }

const PAIS_TXTS = {
  ca: { 'Espanya': 'Espanya', 'Desconegut': 'Desconegut' },
  es: { 'Espanya': 'España', 'Desconegut': 'Desconocido' },
  en: { 'Espanya': 'Spain', 'Desconegut': 'Unknown' },
};
function getPaisTxt(pais) {
  const m = PAIS_TXTS[currentLang] || PAIS_TXTS.ca;
  return m[pais] || pais;
}

const ESTAT_LBL = {
  bon: { text: 'En bon estat', cls: 'bon' },
  regular: { text: 'Estat regular', cls: 'regular' },
  malmes: { text: 'Necessita millora', cls: 'malmes' },
  projecte: { text: '⭐ Projecte actiu', cls: 'projecte' }
};
function getEstatLbl(estat) {
  const t = getEstatTxts();
  const cls = { bon:'bon', regular:'regular', malmes:'malmes', projecte:'projecte' };
  return { text: t[estat] || t.regular, cls: cls[estat] || 'regular' };
}

/* ---------- Helper per construir mailto amb BCC ocult ---------- */
function buildMailto(to, subject, body) {
  const params = [`subject=${encodeURIComponent(subject)}`];
  if (CONFIG.EMAIL_BCC_OCULT) {
    params.push(`bcc=${encodeURIComponent(CONFIG.EMAIL_BCC_OCULT)}`);
  }
  params.push(`body=${encodeURIComponent(body)}`);
  return `mailto:${to}?${params.join('&')}`;
}

/* ---------- Configurar el botó "Proposa una pista" ---------- */
function setupProposaBtn() {
  const btn = document.getElementById('proposa-btn');
  if (!btn) return;
  if (CONFIG.FORM_URL) {
    btn.href = CONFIG.FORM_URL;
    btn.target = '_blank';
  } else {
    // Mode email per defecte: obre el client de correu amb plantilla preomplerta
    const proposaTemplates = {
      ca: {
        subject: 'Proposta de nova pista per al mapa',
        body: `Hola Juguem a Bàsquet!\n\nVull proposar afegir una pista al mapa:\n\n📍 NOM DE LA PISTA: \n🏘️ BARRI: \n📌 UBICACIÓ (adreça o enllaç de Google Maps): \n🔧 ESTAT (Bon / Regular / Malmesa): \n📝 DESCRIPCIÓ (cistelles, xarxes, paviment, il·luminació…):\n\n\n📸 Adjunto fotos: SÍ / NO  (les pots adjuntar a aquest mateix correu)\n\nNom (opcional): \nTelèfon o email de contacte (opcional): \n\nGràcies per col·laborar! 🏀`
      },
      en: {
        subject: 'New court proposal for the map',
        body: `Hi Juguem a Bàsquet!\n\nI'd like to propose adding a court to the map:\n\n📍 COURT NAME: \n🏘️ NEIGHBOURHOOD: \n📌 LOCATION (address or Google Maps link): \n🔧 CONDITION (Good / Regular / Poor): \n📝 DESCRIPTION (hoops, nets, surface, lighting…):\n\n\n📸 Attaching photos: YES / NO  (you can attach them to this email)\n\nName (optional): \nPhone or email (optional): \n\nThanks for contributing! 🏀`
      },
      es: {
        subject: 'Propuesta de nueva pista para el mapa',
        body: `Hola Juguem a Bàsquet!\n\nQuiero proponer añadir una pista al mapa:\n\n📍 NOMBRE DE LA PISTA: \n🏘️ BARRIO: \n📌 UBICACIÓN (dirección o enlace de Google Maps): \n🔧 ESTADO (Bueno / Regular / Deteriorada): \n📝 DESCRIPCIÓN (canastas, redes, pavimento, iluminación…):\n\n\n📸 Adjunto fotos: SÍ / NO  (puedes adjuntarlas a este mismo correo)\n\nNombre (opcional): \nTeléfono o email de contacto (opcional): \n\nGracias por colaborar! 🏀`
      }
    };
    const tpl = proposaTemplates[currentLang] || proposaTemplates.ca;
    btn.href = buildMailto(CONFIG.EMAIL_CONTACTE, tpl.subject, tpl.body);
    btn.removeAttribute('target');
  }
}

/* ---------- Parser CSV simple (només si activem Google Sheet) ---------- */
function parseCSV(text) {
  const rows = [];
  let row = [], cell = '', inQuotes = false;
  for (let i = 0; i < text.length; i++) {
    const ch = text[i], next = text[i+1];
    if (inQuotes) {
      if (ch === '"' && next === '"') { cell += '"'; i++; }
      else if (ch === '"') { inQuotes = false; }
      else { cell += ch; }
    } else {
      if (ch === '"') { inQuotes = true; }
      else if (ch === ',') { row.push(cell); cell = ''; }
      else if (ch === '\n' || ch === '\r') {
        if (cell !== '' || row.length) { row.push(cell); rows.push(row); }
        row = []; cell = '';
        if (ch === '\r' && next === '\n') i++;
      } else { cell += ch; }
    }
  }
  if (cell !== '' || row.length) { row.push(cell); rows.push(row); }
  return rows;
}

async function fetchSheetPistes() {
  if (!CONFIG.SHEET_CSV_URL) return [];
  try {
    const res = await fetch(CONFIG.SHEET_CSV_URL, { cache: 'no-cache' });
    if (!res.ok) return [];
    const csv = await res.text();
    const rows = parseCSV(csv);
    if (rows.length < 2) return [];
    const headers = rows[0].map(h => h.trim().toLowerCase());
    const idx = (name) => headers.findIndex(h => h.includes(name));
    const iNom = idx('nom');
    const iBarri = idx('barri');
    const iEstat = idx('estat');
    const iDesc = idx('descripci');
    const iFoto = idx('foto');
    const iAprov = idx('aprovat');
    const iLat = idx('lat');
    const iLng = idx('lng');

    return rows.slice(1).map(r => {
      if (iAprov >= 0) {
        const ap = (r[iAprov] || '').trim().toUpperCase();
        if (!['SI', 'SÍ', 'YES', 'TRUE', 'X', '1'].includes(ap)) return null;
      }
      const lat = parseFloat((r[iLat] || '').replace(',', '.'));
      const lng = parseFloat((r[iLng] || '').replace(',', '.'));
      if (isNaN(lat) || isNaN(lng)) return null;
      const estatRaw = ((r[iEstat] || '').toLowerCase());
      let estat = 'regular';
      if (estatRaw.includes('bon')) estat = 'bon';
      else if (estatRaw.includes('malm') || estatRaw.includes('dolent')) estat = 'malmes';
      else if (estatRaw.includes('reg')) estat = 'regular';
      return {
        nom: (r[iNom] || 'Pista sense nom').trim(),
        barri: (r[iBarri] || '—').trim(),
        estat,
        descripcio: (r[iDesc] || '').trim(),
        foto: iFoto >= 0 ? (r[iFoto] || '').trim() : '',
        coords: [lat, lng],
        font: 'sheet'
      };
    }).filter(Boolean);
  } catch (e) {
    console.warn('No s\'ha pogut llegir el full de propostes:', e);
    return [];
  }
}

/* ---------- Flags per país ---------- */
const COUNTRY_FLAGS = {
  'Espanya': '🇪🇸', 'Spain': '🇪🇸',
  'França': '🇫🇷', 'France': '🇫🇷',
  'Estats Units': '🇺🇸', 'USA': '🇺🇸', 'United States': '🇺🇸',
  'Alemanya': '🇩🇪', 'Germany': '🇩🇪',
  'Itàlia': '🇮🇹', 'Italy': '🇮🇹',
  'Portugal': '🇵🇹',
  'Regne Unit': '🇬🇧', 'United Kingdom': '🇬🇧',
  'Argentina': '🇦🇷',
  'Brasil': '🇧🇷', 'Brazil': '🇧🇷',
  'Mèxic': '🇲🇽', 'Mexico': '🇲🇽',
};
function getFlag(pais) { return COUNTRY_FLAGS[pais] || '🌍'; }

/* ---------- Inicialització del mapa i la llista ---------- */
function initMapa() {
  const mapEl = document.getElementById('mapa-pistes');
  if (!mapEl || typeof L === 'undefined') return;

  setupProposaBtn();

  // Mostrar pistes locals immediatament; sheet s'afegeix en background
  let allPistes = [...PISTES].sort((a, b) => {
    if (a.estat === 'projecte' && b.estat !== 'projecte') return -1;
    if (b.estat === 'projecte' && a.estat !== 'projecte') return 1;
    return 0;
  });

  const map = window.jabMap = L.map('mapa-pistes', {
    center: [41.4520, 2.2470],
    zoom: 14,
    scrollWheelZoom: false,
    dragging: true,
    tap: false,
    zoomControl: true
  });
  window._leafletMap = map;

  // Capa satèl·lit Esri
  L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', {
    attribution: 'Tiles &copy; Esri &mdash; Source: Esri, USGS, NOAA',
    maxZoom: 19
  }).addTo(map);
  // Capa de noms de carrers i etiquetes per sobre del satèl·lit
  L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/Reference/World_Boundaries_and_Places/MapServer/tile/{z}/{y}/{x}', {
    maxZoom: 19, opacity: 0.85
  }).addTo(map);

  map.on('focus', () => map.scrollWheelZoom.enable());
  map.on('blur', () => map.scrollWheelZoom.disable());

  /* ---- Cluster group ---- */
  const clusterGroup = L.markerClusterGroup({
    maxClusterRadius: 60,
    spiderfyOnMaxZoom: true,
    showCoverageOnHover: false,
    zoomToBoundsOnClick: true,
    iconCreateFunction: function(cluster) {
      const n = cluster.getChildCount();
      const big = n >= 10;
      return L.divIcon({
        html: `<div class="cluster-icon${big ? ' cluster-icon-lg' : ''}">${n}</div>`,
        className: '',
        iconSize: L.point(big ? 54 : 44, big ? 54 : 44)
      });
    }
  });

  const markers = [];
  const bounds = [];

  function addMarkers(pistes, idxOffset) {
  pistes.forEach((p, i) => {
    p._id = `pista-${idxOffset + i}`;
    p.pais = p.pais || 'Desconegut';
    p.ciutat = p.ciutat || p.barri || '—';

    const icon = L.divIcon({
      className: '',
      html: `<div class="pista-marker ${p.estat}" title="${p.nom}"></div>`,
      iconSize: p.estat === 'projecte' ? [58, 58] : [36, 36],
      iconAnchor: p.estat === 'projecte' ? [29, 29] : [18, 18],
      popupAnchor: [0, -18]
    });

    const gmapsUrl = `https://www.google.com/maps/dir/?api=1&destination=${p.coords[0]},${p.coords[1]}&travelmode=walking`;
    const t = getEstatTxts();
    const mailBody = t.incBody + `📍 ${p.nom} (${p.barri || p.ciutat})\nCoordenades: ${p.coords[0]}, ${p.coords[1]}\n\n` + t.incDetall;
    const reportUrl = buildMailto(CONFIG.EMAIL_CONTACTE, `${t.incidencia} ${p.nom}`, mailBody);
    const lbl = getEstatLbl(p.estat);
    const fotoHtml = p.foto
      ? `<div class="ph-photo" style="background-image:url('${p.foto}');background-size:cover;background-position:center;"></div>`
      : `<div class="ph-photo"><span>${p.nom}</span></div>`;

    const popupHtml = `
      <div class="pista-popup">
        ${fotoHtml}
        <div class="body">
          <div class="state-row">
            <span class="badge ${lbl.cls}"><span class="dot"></span>${lbl.text}</span>
            <span class="barri">${p.barri || p.ciutat}</span>
          </div>
          <h4>${p.nom}</h4>
          ${p.adreca ? `<p class="adreca-popup">📍 ${p.adreca}</p>` : ''}
          <p>${(currentLang === 'en' ? p.descripcio_en : currentLang === 'es' ? p.descripcio_es : p.descripcio) || p.descripcio || ''}</p>
          <div class="actions">
            <a class="btn-go" href="${gmapsUrl}" target="_blank" rel="noopener">${t.arribar}</a>
            <a class="btn-report" href="${reportUrl}">${t.reporta}</a>
          </div>
        </div>
      </div>`;

    const marker = L.marker(p.coords, { icon }).bindPopup(popupHtml, { maxWidth: 300, closeButton: true });
    marker._estat = p.estat;
    marker._id = p._id;
    marker._pista = p;
    markers.push(marker);
    bounds.push(p.coords);
    clusterGroup.addLayer(marker);
  });
  } // fi addMarkers

  addMarkers(allPistes, 0);
  map.addLayer(clusterGroup);

  if (bounds.length > 1) map.fitBounds(bounds, { padding: [40, 40] });

  /* ---- Popup dinàmic per idioma ---- */
  map.on('popupopen', function(e) {
    const marker = e.popup._source;
    if (!marker || !marker._pista) return;
    const p = marker._pista;
    const t = getEstatTxts();
    const gmapsUrl = `https://www.google.com/maps/dir/?api=1&destination=${p.coords[0]},${p.coords[1]}&travelmode=walking`;
    const mailBody = t.incBody + `📍 ${p.nom} (${p.barri || p.ciutat})\nCoordenades: ${p.coords[0]}, ${p.coords[1]}\n\n` + t.incDetall;
    const reportUrl = buildMailto(CONFIG.EMAIL_CONTACTE, `${t.incidencia} ${p.nom}`, mailBody);
    const lbl = getEstatLbl(p.estat);
    const fotoHtml = p.foto
      ? `<div class="ph-photo" style="background-image:url('${p.foto}');background-size:cover;background-position:center;"></div>`
      : `<div class="ph-photo"><span>${p.nom}</span></div>`;
    const desc = (currentLang === 'en' ? p.descripcio_en : currentLang === 'es' ? p.descripcio_es : p.descripcio) || p.descripcio || '';
    const popupHtml = `
      <div class="pista-popup">
        ${fotoHtml}
        <div class="body">
          <div class="state-row">
            <span class="badge ${lbl.cls}"><span class="dot"></span>${lbl.text}</span>
            <span class="barri">${p.barri || p.ciutat}</span>
          </div>
          <h4>${p.nom}</h4>
          ${p.adreca ? `<p class="adreca-popup">📍 ${p.adreca}</p>` : ''}
          <p>${desc}</p>
          <div class="actions">
            <a class="btn-go" href="${gmapsUrl}" target="_blank" rel="noopener">${t.arribar}</a>
            <a class="btn-report" href="${reportUrl}">${t.reporta}</a>
          </div>
        </div>
      </div>`;
    e.popup.setContent(popupHtml);
  });

  /* ---- Estadístiques ---- */
  function updateStats() {
    const cnt = { bon: 0, regular: 0, malmes: 0 };
    allPistes.forEach(p => { if (cnt[p.estat] !== undefined) cnt[p.estat]++; });
    document.getElementById('stat-total').textContent = allPistes.length;
    document.getElementById('stat-bon').textContent = cnt.bon;
    document.getElementById('stat-regular').textContent = cnt.regular;
    document.getElementById('stat-malmes').textContent = cnt.malmes;
  }
  updateStats();

  /* ---- Renderitzar llista en accordion ---- */
  let currentStateFilter = 'all';
  let currentSearch = '';

  function getPistesVisibles() {
    return allPistes.filter(p => {
      const isProjecte = p.estat === 'projecte';
      const okEstat = isProjecte || currentStateFilter === 'all' || p.estat === currentStateFilter;
      if (!okEstat) return false;
      if (!currentSearch) return true;
      const q = currentSearch;
      return (p.nom || '').toLowerCase().includes(q)
        || (p.barri || '').toLowerCase().includes(q)
        || (p.ciutat || '').toLowerCase().includes(q)
        || (p.pais || '').toLowerCase().includes(q)
        || (p.descripcio || '').toLowerCase().includes(q);
    });
  }

  function renderLlista() {
    const llistaEl = document.getElementById('pistes-llista-items');
    const llistaCountEl = document.getElementById('llista-count');
    const visibles = getPistesVisibles();
    llistaCountEl.textContent = visibles.length;
    llistaEl.innerHTML = '';

    if (visibles.length === 0) {
      llistaEl.innerHTML = `<div class="pistes-llista-empty">${getEstatTxts().capPista}</div>`;
      return;
    }

    // Agrupar per país → ciutat (clau interna en català, traduïm només a la visualització)
    const groups = {};
    visibles.forEach(p => {
      const pais = p.pais || 'Desconegut';
      const ciutat = p.ciutat || '—';
      if (!groups[pais]) groups[pais] = {};
      if (!groups[pais][ciutat]) groups[pais][ciutat] = [];
      groups[pais][ciutat].push(p);
    });

    const paisos = Object.keys(groups).sort((a, b) => {
      // Espanya primer (on hi ha més pistes inicialment)
      if (a === 'Espanya') return -1;
      if (b === 'Espanya') return 1;
      return a.localeCompare(b);
    });

    const autoOpen = paisos.length === 1 || currentSearch;

    paisos.forEach((pais, pi) => {
      const ciutats = groups[pais];
      const totalPais = Object.values(ciutats).reduce((s, arr) => s + arr.length, 0);
      const groupEl = document.createElement('div');
      groupEl.className = 'llista-group' + (autoOpen || pi === 0 ? ' open' : '');

      const hdr = document.createElement('div');
      hdr.className = 'llista-group-hdr';
      hdr.innerHTML = `
        <span class="llista-group-flag">${getFlag(pais)}</span>
        <span class="llista-group-name">${getPaisTxt(pais)}</span>
        <span class="llista-group-count">${totalPais}</span>
        <span class="llista-group-chevron">▼</span>`;
      hdr.addEventListener('click', () => groupEl.classList.toggle('open'));

      const body = document.createElement('div');
      body.className = 'llista-group-body';

      Object.keys(ciutats).sort().forEach((ciutat, ci) => {
        const pistes = ciutats[ciutat];
        const subEl = document.createElement('div');
        subEl.className = 'llista-subgroup' + (autoOpen || ci === 0 ? ' open' : '');

        const subHdr = document.createElement('div');
        subHdr.className = 'llista-subgroup-hdr';
        subHdr.innerHTML = `
          <span class="llista-subgroup-name">${ciutat}</span>
          <span class="llista-subgroup-count">${pistes.length}</span>
          <span class="llista-subgroup-chevron">▼</span>`;
        subHdr.addEventListener('click', () => subEl.classList.toggle('open'));

        const subBody = document.createElement('div');
        subBody.className = 'llista-subgroup-body';

        pistes.forEach(p => {
          const lbl = getEstatLbl(p.estat);
          const marker = markers.find(m => m._id === p._id);
          const item = document.createElement('div');
          item.className = 'pista-item' + (p.estat === 'projecte' ? ' projecte-item' : '');
          item.dataset.id = p._id;
          item.dataset.estat = p.estat;
          item.innerHTML = `
            <span class="state-pill ${p.estat}" aria-label="${lbl.text}"></span>
            <div class="info">
              <p class="name">${p.nom}</p>
              <div class="barri">${p.barri || ''}${p.adreca ? ' · ' + p.adreca : ''}</div>
            </div>
            <span class="arrow">→</span>`;
          item.addEventListener('click', () => {
            document.querySelectorAll('.pista-item').forEach(it => it.classList.remove('active'));
            item.classList.add('active');
            const mapaEl = document.getElementById('mapa-pistes');
            const isStacked = window.matchMedia('(max-width: 900px)').matches;
            if (isStacked && mapaEl) {
              mapaEl.scrollIntoView({ behavior: 'smooth', block: 'center' });
              setTimeout(() => {
                map.invalidateSize();
                map.flyTo(p.coords, 17, { duration: 0.8 });
                if (marker) setTimeout(() => marker.openPopup(), 900);
              }, 450);
            } else {
              map.flyTo(p.coords, 17, { duration: 0.8 });
              if (marker) setTimeout(() => marker.openPopup(), 900);
            }
          });
          subBody.appendChild(item);
        });

        subEl.appendChild(subHdr);
        subEl.appendChild(subBody);
        body.appendChild(subEl);
      });

      groupEl.appendChild(hdr);
      groupEl.appendChild(body);
      llistaEl.appendChild(groupEl);
    });
  }

  /* ---- Actualitzar clustering al filtrar ---- */
  function applyFilters() {
    const visibles = getPistesVisibles();
    const visibleIds = new Set(visibles.map(p => p._id));
    clusterGroup.clearLayers();
    markers.forEach(m => {
      if (visibleIds.has(m._id)) clusterGroup.addLayer(m);
    });
    renderLlista();
  }

  /* ---- Filtres d'estat ---- */
  document.querySelectorAll('.mapa-filter').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.mapa-filter').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      currentStateFilter = btn.dataset.state;
      applyFilters();
    });
  });

  /* ---- Cerca ---- */
  document.getElementById('llista-cerca').addEventListener('input', function() {
    currentSearch = this.value.toLowerCase().trim();
    applyFilters();
  });

  renderLlista();
  window.jabRenderLlista = renderLlista;

  setTimeout(() => map.invalidateSize(), 200);
  window.addEventListener('resize', () => map.invalidateSize());

  // Carrega pistes del full de propostes en background (no bloqueja el mapa)
  fetchSheetPistes().then(sheetPistes => {
    window._sheetPistes = sheetPistes;
    if (!sheetPistes.length) return;
    const offset = allPistes.length;
    sheetPistes.forEach(p => allPistes.push(p));
    allPistes.sort((a, b) => {
      if (a.estat === 'projecte' && b.estat !== 'projecte') return -1;
      if (b.estat === 'projecte' && a.estat !== 'projecte') return 1;
      return 0;
    });
    addMarkers(sheetPistes, offset);
    updateStats();
    renderLlista();
  });
}


