function openInformeModal() {
  const modal = document.getElementById('informe-modal');
  modal.style.display = 'block';
  document.body.style.overflow = 'hidden';
  // Traduir capçalera i botons PRIMER
  const tl = { ca: { eye:'Informe de catalogació', tit:'Pistes de Badalona', all:'Totes', bon:'Bon estat', reg:'Regular', mal:'Necessita millora' },
                en: { eye:'Cataloguing report', tit:'Badalona Courts', all:'All', bon:'Good condition', reg:'Fair', mal:'Needs repair' },
                es: { eye:'Informe de catalogación', tit:'Pistas de Badalona', all:'Todas', bon:'Buen estado', reg:'Regular', mal:'Necesita mejora' } };
  const l = tl[currentLang] || tl.ca;
  document.getElementById('informe-eyebrow').textContent = l.eye;
  document.getElementById('informe-title').textContent = l.tit;
  document.getElementById('inf-f-all').textContent = l.all;
  document.getElementById('inf-f-bon').textContent = '● ' + l.bon;
  document.getElementById('inf-f-regular').textContent = '● ' + l.reg;
  document.getElementById('inf-f-malmes').textContent = '● ' + l.mal;
  // Ara renderitzar amb l'idioma ja configurat
  renderInforme('all');
}

function closeInformeModal() {
  document.getElementById('informe-modal').style.display = 'none';
  document.body.style.overflow = '';
}

function filterInforme(estat) {
  // Highlight botó actiu
  ['all','bon','regular','malmes'].forEach(f => {
    const btn = document.getElementById('inf-f-' + f);
    btn.style.background = f === estat ? '#0A0A0A' : 'none';
    btn.style.color = f === estat ? 'white' : '';
  });
  renderInforme(estat);
}

function renderInforme(filtre) {
  const t = getEstatTxts();
  // Usar PISTES (global) + sheetPistes si existeix
  const base = PISTES.concat(typeof window._sheetPistes !== 'undefined' ? window._sheetPistes : []);
  const pistes = base
    .filter(p => filtre === 'all' || p.estat === filtre)
    .sort((a,b) => { if(a.estat==='projecte') return -1; if(b.estat==='projecte') return 1; return a.barri.localeCompare(b.barri); });

  const colors = { bon:'#2ECC71', regular:'#F39C12', malmes:'#E74C3C', projecte:'#5DADE2' };
  const countTxt = { ca:`${pistes.length} pistes`, en:`${pistes.length} courts`, es:`${pistes.length} pistas` };
  document.getElementById('informe-count').textContent = countTxt[currentLang] || countTxt.ca;

  const descKey = currentLang === 'en' ? 'descripcio_en' : currentLang === 'es' ? 'descripcio_es' : 'descripcio';
  const adrecaLbl = { ca:'Adreça', en:'Address', es:'Dirección' }[currentLang] || 'Adreça';

  const reportLbl = { ca: '⚠ Reportar canvi', en: '⚠ Report change', es: '⚠ Reportar cambio' }[currentLang] || '⚠ Reportar canvi';
  const arribarLbl = { ca: '↗ Com arribar', en: '↗ Get directions', es: '↗ Cómo llegar' }[currentLang] || '↗ Com arribar';

  let html = pistes.map(p => {
    const lbl = getEstatLbl(p.estat);
    const color = colors[p.estat] || '#999';
    const gmaps = `https://www.google.com/maps/dir/?api=1&destination=${p.coords[0]},${p.coords[1]}&travelmode=walking`;
    const desc = p[descKey] || p.descripcio || '';
    const localitzacio = [p.barri, p.ciutat, p.pais].filter(Boolean).join(' · ');
    const mailBody = `${t.incBody}📍 ${p.nom}\n${localitzacio ? localitzacio + '\n' : ''}${p.adreca ? '📍 ' + p.adreca + '\n' : ''}Coordenades: ${p.coords[0]}, ${p.coords[1]}\n\n${t.incDetall}`;
    const reportUrl = buildMailto(CONFIG.EMAIL_CONTACTE, `${t.incidencia} ${p.nom}`, mailBody);
    return `
      <div style="display:flex;align-items:flex-start;gap:14px;padding:16px 0;border-bottom:1px solid #F0F0F0;">
        <span style="width:10px;height:10px;border-radius:50%;background:${color};flex-shrink:0;margin-top:5px;"></span>
        <div style="flex:1;min-width:0;">
          <div style="font-weight:700;font-size:14px;color:#0A0A0A;">${p.nom}</div>
          <div style="font-size:12px;color:#888;margin-top:2px;">${localitzacio}${p.adreca ? ' · 📍 ' + p.adreca : ''}</div>
          ${desc ? `<div style="font-size:12px;color:#555;margin-top:5px;line-height:1.5;">${desc}</div>` : ''}
          <div style="display:flex;align-items:center;gap:10px;margin-top:8px;flex-wrap:wrap;">
            <span style="background:${color}22;color:${color};border:1px solid ${color};padding:2px 8px;border-radius:999px;font-size:10px;font-weight:800;">${lbl.text}</span>
            <a href="${gmaps}" target="_blank" rel="noopener" style="font-size:11px;color:var(--orange);font-weight:700;text-decoration:none;">${arribarLbl}</a>
            <a href="${reportUrl}" style="font-size:11px;color:#888;font-weight:600;text-decoration:none;">${reportLbl}</a>
          </div>
        </div>
      </div>`;
  }).join('');
  if (!html) html = `<p style="color:#999;padding:24px 0;text-align:center;">—</p>`;
  document.getElementById('informe-llista').innerHTML = html;
}

  // ===== MENÚ HAMBURGUESA =====
  const burger = document.getElementById('burger');
  const mobileMenu = document.getElementById('mobile-menu');
  const mobileOverlay = document.getElementById('mobile-overlay');
  const mobileClose = document.getElementById('mobile-close');

  function openMenu() {
    burger.classList.add('open');
    mobileMenu.classList.add('open');
    mobileOverlay.classList.add('open');
    burger.setAttribute('aria-expanded', 'true');
    mobileMenu.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
  }
  function closeMenu() {
    burger.classList.remove('open');
    mobileMenu.classList.remove('open');
    mobileOverlay.classList.remove('open');
    burger.setAttribute('aria-expanded', 'false');
    mobileMenu.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
  }

  burger.addEventListener('click', () => mobileMenu.classList.contains('open') ? closeMenu() : openMenu());
  mobileClose.addEventListener('click', closeMenu);
  mobileOverlay.addEventListener('click', closeMenu);
  document.querySelectorAll('.mobile-link, .mobile-cta').forEach(link => {
    link.addEventListener('click', closeMenu);
  });

  // ── Auto-obre entrevista Aíto si ve de #entrevista-aito ──
  window.addEventListener('load', () => {
    if (window.location.hash === '#entrevista-aito') {
      const btn = document.getElementById('aito-toggle-btn');
      if (btn) setTimeout(() => { toggleAitoQA(btn); }, 400);
    }
  });

  // ── Acordió entrevista Aíto ──────────────────────────────
  function toggleAitoQA(btn) {
    const wrap = document.getElementById('aito-qa');
    const isOpen = wrap.classList.toggle('open');
    const key = isOpen ? 'aito.btn.tancar' : 'aito.btn.llegir';
    const txt = (TRANSLATIONS[currentLang] && TRANSLATIONS[currentLang][key]) || (isOpen ? 'Tanca l\'entrevista ↑' : 'Llegeix l\'entrevista ↓');
    btn.textContent = txt;
    if (isOpen) wrap.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }
  function toggleBusquetsQA(btn) {
    const wrap = document.getElementById('busquets-qa');
    const isOpen = wrap.classList.toggle('open');
    btn.textContent = isOpen ? 'Tanca l\'entrevista ↑' : 'Llegeix l\'entrevista ↓';
    if (isOpen) wrap.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }
  function toggleVillacampaQA(btn) {
    const wrap = document.getElementById('villacampa-qa');
    const isOpen = wrap.classList.toggle('open');
    btn.textContent = isOpen ? 'Tanca l\'entrevista ↑' : 'Llegeix l\'entrevista ↓';
    if (isOpen) wrap.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }
  function toggleQ(btn) {
    const item = btn.closest('.aito-qa-item');
    item.classList.toggle('open');
  }

