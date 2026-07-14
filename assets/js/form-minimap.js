  /* ===== MINI-MAPA del formulari ===== */
  let miniMap = null;

  function initMiniMapa() {
    if (miniMap || typeof L === 'undefined') return;
    miniMap = L.map('mini-mapa', {
      center: [20, 0], zoom: 2,
      zoomControl: true, scrollWheelZoom: true
    });
    L.tileLayer('https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png', {
      attribution: '© OpenStreetMap © CARTO', subdomains: 'abcd', maxZoom: 19
    }).addTo(miniMap);

    // Patró "pin central fix": la ubicació és el CENTRE del mapa.
    // L'usuari arrossega el mapa perquè el pin quedi sobre la pista.
    miniMap.on('moveend', updateMiniLocation);

    // Doble tap per fer zoom a mòbil (Leaflet no mapeja el doble tap tàctil
    // a 'dblclick' com fa a escriptori; ho gestionem manualment).
    var cont = miniMap.getContainer();
    var lastTapT = 0, lastTapX = 0, lastTapY = 0;
    cont.addEventListener('touchend', function(e) {
      if (e.touches.length > 0) return;            // encara hi ha dits (pinch)
      if (e.changedTouches.length !== 1) return;
      var t = e.changedTouches[0];
      var now = Date.now();
      var dx = Math.abs(t.clientX - lastTapX), dy = Math.abs(t.clientY - lastTapY);
      if (now - lastTapT < 300 && dx < 30 && dy < 30) {
        var rect = cont.getBoundingClientRect();
        var latlng = miniMap.containerPointToLatLng(L.point(t.clientX - rect.left, t.clientY - rect.top));
        miniMap.setZoomAround(latlng, miniMap.getZoom() + 1);
        lastTapT = 0; // evita triple tap
        e.preventDefault();
      } else {
        lastTapT = now; lastTapX = t.clientX; lastTapY = t.clientY;
      }
    }, { passive: false });
  }

  function updateMiniLocation() {
    if (!miniMap) return;
    var geoText = document.getElementById('geo-text');
    var geoIcon = document.getElementById('geo-icon');
    var fb = document.getElementById('geo-feedback');
    // Vista massa allunyada: encara no considerem la ubicació vàlida
    if (miniMap.getZoom() < 6) {
      document.getElementById('form-lat').value = '';
      document.getElementById('form-lng').value = '';
      if (geoText) geoText.textContent = (TRANSLATIONS[currentLang] || TRANSLATIONS.ca)['rep.step1.hint'];
      if (geoIcon) geoIcon.textContent = '🎯';
      if (fb) fb.style.background = 'var(--orange-soft)';
      return;
    }
    var c = miniMap.getCenter();
    document.getElementById('form-lat').value = c.lat.toFixed(6);
    document.getElementById('form-lng').value = c.lng.toFixed(6);
    var okMsgs = { ca: '✓ Ubicació marcada: ', es: '✓ Ubicación marcada: ', en: '✓ Location set: ' };
    if (geoText) geoText.textContent = (okMsgs[currentLang] || okMsgs.ca) + c.lat.toFixed(5) + ', ' + c.lng.toFixed(5);
    if (geoIcon) geoIcon.textContent = '📍';
    if (fb) fb.style.background = '#d4f7e7';
  }

  /* Centra el mini-mapa a la zona de l'usuari (geolocalització del navegador).
     Si es denega el permís o falla, es manté la vista mundial per defecte.
     No fixa la ubicació: només acosta el mapa; el centre (pin) la determina. */
  function locateMiniMap() {
    if (!miniMap || !navigator.geolocation) return;
    if (document.getElementById('form-lat').value) return; // ja hi ha ubicació
    var geoText = document.getElementById('geo-text');
    var locMsgs = { ca: '📍 Localitzant la teva zona…', es: '📍 Localizando tu zona…', en: '📍 Locating your area…' };
    var prev = geoText ? geoText.textContent : '';
    if (geoText) geoText.textContent = locMsgs[currentLang] || locMsgs.ca;
    navigator.geolocation.getCurrentPosition(function(pos) {
      if (document.getElementById('form-lat').value) return; // l'usuari ja ha mogut el mapa
      miniMap.setView([pos.coords.latitude, pos.coords.longitude], 15);
      // 'moveend' -> updateMiniLocation actualitza el text i la ubicació
    }, function() {
      if (geoText) geoText.textContent = prev;
    }, { enableHighAccuracy: true, timeout: 8000, maximumAge: 300000 });
  }


  /* ===== ENVIAMENT AJAX del formulari ===== */
  document.getElementById('reporta-form').addEventListener('submit', async function(e) {
    e.preventDefault();
    const form = this;
    const btn = form.querySelector('.btn-submit');

    const lat = document.getElementById('form-lat').value;
    const lng = document.getElementById('form-lng').value;
    if (!lat || !lng) {
      var warnMsgs = { ca: '⚠️ Acosta el mapa i deixa el pin 📍 just sobre la pista', es: '⚠️ Acerca el mapa y deja el pin 📍 justo sobre la pista', en: '⚠️ Zoom in and place the pin 📍 right on the court' };
      document.getElementById('geo-text').textContent = warnMsgs[currentLang] || warnMsgs.ca;
      document.getElementById('geo-feedback').style.background = '#fdecea';
      document.getElementById('mini-mapa').scrollIntoView({ behavior: 'smooth', block: 'center' });
      return;
    }

    // Generar codi pista per al correu
    const nom    = (form.querySelector('[name="nom-pista"]').value || '').trim().replace(/'/g, "\\'");
    const barri  = (form.querySelector('[name="barri"]').value || '').trim().replace(/'/g, "\\'");
    const fotos  = (form.querySelector('[name="fotos"]').value || '').trim();
    // Compondre descripció dels camps estructurats
    const _dLabels = { ca: ['Cistelles','Paviment','Pintura','Estat per jugar','Enllumenat','Accessibilitat','Comentari'], en: ['Hoops','Surface','Lines','Playability','Lighting','Accessibility','Comments'], es: ['Canastas','Pavimento','Pintura','Estado para jugar','Iluminación','Accesibilidad','Comentario'] };
    const _dLbl = _dLabels[currentLang] || _dLabels.ca;
    const _dFields = ['desc-cistelles','desc-paviment','desc-pintura','desc-estat-joc','desc-enllumenat','desc-accessibilitat','desc-comentari']
      .map((n,i) => { const v=(form.querySelector(`[name="${n}"]`)?.value||'').trim(); return v ? `${_dLbl[i]}: ${v}` : ''; })
      .filter(Boolean).join(' | ');
    const desc = _dFields.replace(/'/g, "\\'");
    const estatRaw = form.querySelector('[name="estat"]').value;
    let estat = 'malmes';
    if (estatRaw.includes('Bon')) estat = 'bon';
    else if (estatRaw.includes('Regular') || estatRaw.includes('Nova')) estat = 'regular';
    const fotoLine = fotos ? `, foto: '${fotos.split('\n')[0].trim()}'` : '';
    const codiPista = `  { nom: '${nom}', barri: '${barri}', estat: '${estat}', descripcio: '${desc}'${fotoLine}, coords: [${parseFloat(lat).toFixed(4)}, ${parseFloat(lng).toFixed(4)}] },`;

    let hiddenCodi = form.querySelector('[name="codi_pistes"]');
    if (!hiddenCodi) { hiddenCodi = document.createElement('input'); hiddenCodi.type = 'hidden'; hiddenCodi.name = 'codi_pistes'; form.appendChild(hiddenCodi); }
    hiddenCodi.value = codiPista;

    btn.textContent = 'Enviant…';
    btn.disabled = true;

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 12000);

    try {
      const formData = new FormData(form);
      formData.append('access_key', 'e20664cf-14c1-4900-8107-dfbfcc6c19d1');
      formData.append('to', 'info@juguemabasquet.org');
      formData.append('botcheck', '');

      const res = await fetch('https://api.web3forms.com/submit', {
        method: 'POST',
        body: formData,
        signal: controller.signal
      });
      let json = await res.json();

      clearTimeout(timeoutId);
      if (json.success) {
        form.style.display = 'none';
        document.getElementById('reporta-success').style.display = 'block';
      } else { throw new Error(json.message || 'Error desconegut'); }
    } catch(err) {
      clearTimeout(timeoutId);
      btn.textContent = (TRANSLATIONS[currentLang] || TRANSLATIONS['ca'])['rep.modal.submit'] || 'Enviar reportatge →';
      btn.disabled = false;
      const msg = err.name === 'AbortError'
        ? 'La connexió ha trigat massa. Escriu-nos a info@juguemabasquet.org'
        : 'Hi ha hagut un problema (' + err.message + '). Escriu-nos a info@juguemabasquet.org';
      alert(msg);
    }
  });

  /* ===== FORMULARI CONTACTE FOOTER ===== */
  document.getElementById('footer-contact-form').addEventListener('submit', async function(e) {
    e.preventDefault();
    const form = this;
    const btn = document.getElementById('footer-form-btn');
    const nom = form.nom.value.trim();
    const email = form.email.value.trim();
    const missatge = form.missatge.value.trim();
    if (!nom || !email || !missatge) { alert('Omple tots els camps.'); return; }
    btn.textContent = 'Enviant...'; btn.disabled = true;
    try {
      const data = {
        access_key: 'e20664cf-14c1-4900-8107-dfbfcc6c19d1',
        name: nom, email: email, message: missatge,
        subject: 'Missatge web — Juguem a Bàsquet',
        from_name: 'Web JAB',
        cc: 'info@juguemabasquet.org',
        to: 'info@juguemabasquet.org'
      };
      const res = await fetch('https://api.web3forms.com/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
        body: JSON.stringify(data)
      });
      const json = await res.json();
      if (json.success) {
        form.style.display = 'none';
        document.getElementById('footer-form-ok').style.display = 'block';
      } else { throw new Error(json.message || 'Error'); }
    } catch(err) {
      btn.textContent = 'Enviar missatge →'; btn.disabled = false;
      alert('Hi ha hagut un problema. Escriu-nos directament a info@juguemabasquet.org');
    }
  });

  /* ===== MODAL: obrir / tancar ===== */
  function openReportaModal() {
    const modal = document.getElementById('reporta-modal');
    modal.classList.add('open');
    document.body.style.overflow = 'hidden';
    // Reset form si s'havia enviat
    const form = document.getElementById('reporta-form');
    const success = document.getElementById('reporta-success');
    if (success.style.display === 'block') {
      success.style.display = 'none';
      form.style.display = '';
      form.reset();
      if (miniMap) miniMap.setView([20, 0], 2); // torna a vista mundial (moveend reseteja la ubicació)
      var geoIcon = document.getElementById('geo-icon');
      if (geoIcon) geoIcon.textContent = '🎯';
      document.getElementById('geo-text').textContent = (TRANSLATIONS[currentLang] || TRANSLATIONS.ca)['rep.step1.hint'];
      document.getElementById('geo-feedback').style.background = 'var(--orange-soft)';
    }
    setTimeout(function() {
      initMiniMapa();
      if (miniMap) miniMap.invalidateSize();
      locateMiniMap();
    }, 120);
    if (typeof updateLangSwitcherVisibility === 'function') updateLangSwitcherVisibility();
  }
  function closeReportaModal() {
    document.getElementById('reporta-modal').classList.remove('open');
    document.body.style.overflow = '';
    if (typeof updateLangSwitcherVisibility === 'function') updateLangSwitcherVisibility();
  }

  document.getElementById('modal-close').addEventListener('click', closeReportaModal);
  document.getElementById('reporta-modal').addEventListener('click', function(e) {
    if (e.target === this) closeReportaModal();
  });
  document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape') { closeReportaModal(); closeInformeModal(); }
  });

