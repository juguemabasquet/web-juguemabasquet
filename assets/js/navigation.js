function showSection(id) {
  var target = document.getElementById(id);
  if (!target) return;
  document.querySelectorAll('.page-section').forEach(function(s){ s.classList.remove('active'); });
  target.classList.add('active');
  target.scrollTop = 0;
  document.getElementById('back-home-btn').classList.add('visible');
  var b = document.querySelector('.banner-3x3'); if (b) b.classList.add('hidden');
  updateLangSwitcherVisibility();
  // Inicialitza el mapa la primera vegada que s'obre (Leaflet necessita el contenidor visible)
  if (id === 'mapa') {
    if (!window._mapaInit) {
      window._mapaInit = true;
      setTimeout(initMapa, 80);
    } else if (window._leafletMap) {
      setTimeout(function(){ window._leafletMap.invalidateSize(); }, 80);
    }
  }
  // Carrega Instagram embed.js la primera vegada que s'obre Xarxes
  if (id === 'xarxes') {
    if (!document.getElementById('ig-embed-script')) {
      var s = document.createElement('script');
      s.id = 'ig-embed-script';
      s.async = true;
      s.src = 'https://www.instagram.com/embed.js';
      document.body.appendChild(s);
    } else if (window.instgrm) {
      window.instgrm.Embeds.process();
    }
  }
}
function showHome() {
  document.querySelectorAll('.page-section').forEach(function(s){ s.classList.remove('active'); });
  document.getElementById('back-home-btn').classList.remove('visible');
  var b = document.querySelector('.banner-3x3'); if (b) b.classList.remove('hidden');
  updateLangSwitcherVisibility();
}
// El selector d'idioma només té sentit a la pàgina principal.
// L'idioma s'aplica globalment (setLang) i es recorda, així que amagar-lo
// fora de la home no impedeix que la traducció es mantingui a totes les seccions.
function updateLangSwitcherVisibility() {
  var sw = document.querySelector('.lang-switcher');
  if (!sw) return;
  var sectionOpen = !!document.querySelector('.page-section.active');
  var reporta = document.getElementById('reporta-modal');
  var modalOpen = reporta && reporta.classList.contains('open');
  sw.style.display = (sectionOpen || modalOpen) ? 'none' : '';
}
document.addEventListener('DOMContentLoaded', function() {
  document.querySelectorAll('body > section:not(#inici), body > footer').forEach(function(el){
    el.classList.add('page-section');
  });
  // Obre la secció correcta si ve d'una altra pàgina amb hash (ex: index.html#arxiu-historic)
  var hash = window.location.hash.substring(1);
  if (hash && document.getElementById(hash)) {
    setTimeout(function(){ showSection(hash); }, 50);
  }

  var brandEl = document.querySelector('.brand');
  if (brandEl) { brandEl.addEventListener('click', function(e){ e.preventDefault(); showHome(); }); }
  document.querySelectorAll('.nav-link, .mobile-link').forEach(function(link){
    var href = link.getAttribute('href');
    if (!href || href === '#inici') {
      link.addEventListener('click', function(e){ e.preventDefault(); showHome(); });
    } else if (href.startsWith('#')) {
      link.addEventListener('click', function(e){ e.preventDefault(); showSection(href.substring(1)); });
    }
  });
});
