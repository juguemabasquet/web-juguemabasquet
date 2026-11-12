// Targeta gran del bento d'inici: mostra l'activitat celebrada fa ≤ DIES_CELEBRADA dies,
// si n'hi ha; si no, la pròxima del timeline (#activitats .acts-item, ordenades per
// data-date); i si no n'hi ha cap de futura, l'última celebrada. El timeline és l'única font: només cal mantenir data-date i data-status.
// Per provar-ho amb una altra data: index.html?avui=2026-12-18
(function () {
  function avui() {
    var param = new URLSearchParams(window.location.search).get('avui');
    if (param && /^\d{4}-\d{2}-\d{2}$/.test(param)) return param;
    var d = new Date();
    return d.getFullYear() + '-' + String(d.getMonth() + 1).padStart(2, '0') + '-' + String(d.getDate()).padStart(2, '0');
  }

  // Dies que una activitat ja celebrada es manté destacada abans de passar a la següent
  // (temps per penjar-ne les fotos i la crònica)
  var DIES_CELEBRADA = 3;

  function restaDies(iso, dies) {
    var p = iso.split('-');
    var d = new Date(+p[0], +p[1] - 1, +p[2] - dies);
    return d.getFullYear() + '-' + String(d.getMonth() + 1).padStart(2, '0') + '-' + String(d.getDate()).padStart(2, '0');
  }

  function triaActivitat() {
    var items = Array.prototype.slice.call(document.querySelectorAll('#activitats .acts-item[data-date]'));
    if (!items.length) return null;
    var hoy = avui();
    var passades = items.filter(function (el) { return el.dataset.date < hoy; })
      .sort(function (a, b) { return a.dataset.date < b.dataset.date ? 1 : -1; });
    if (passades.length && passades[0].dataset.date >= restaDies(hoy, DIES_CELEBRADA)) {
      return { item: passades[0], estat: 'celebrada' };
    }
    var futures = items.filter(function (el) { return el.dataset.date >= hoy; })
      .sort(function (a, b) { return a.dataset.date < b.dataset.date ? -1 : 1; });
    if (futures.length) return { item: futures[0], estat: 'proxima' };
    return passades.length ? { item: passades[0], estat: 'ultima' } : null;
  }

  var BADGES = {
    proxima: { status: 'soon', key: 'act.badge.propera', text: 'Pròxima' },
    celebrada: { status: 'done', key: 'act.badge.celebrada', text: 'Celebrada' },
    ultima: { status: 'done', key: 'bento.destacat.ultima', text: 'Última activitat' }
  };

  function copiaText(desti, origen) {
    if (!desti || !origen) return;
    var key = origen.getAttribute('data-i18n');
    if (key) desti.setAttribute('data-i18n', key); else desti.removeAttribute('data-i18n');
    desti.innerHTML = origen.innerHTML;
  }

  function omple() {
    var card = document.getElementById('bento-destacat');
    var tria = triaActivitat();
    if (!card || !tria) return;
    var item = tria.item;
    var origen = item.querySelector('.acts-card');
    var img = item.querySelector('.acts-thumb img');

    if (img) {
      card.querySelector('.bento-destacat-bg').src = img.src;
      var poster = card.querySelector('.bento-destacat-poster img');
      poster.src = img.src;
      poster.alt = img.alt;
    }
    copiaText(card.querySelector('.bento-destacat-meta'), item.querySelector('.acts-date'));
    copiaText(card.querySelector('.bento-destacat-title'), item.querySelector('.acts-title'));
    copiaText(card.querySelector('.bento-destacat-cta'), item.querySelector('.acts-more'));

    var badge = card.querySelector('.bento-destacat-badge');
    var b = BADGES[tria.estat];
    badge.dataset.status = b.status;
    badge.setAttribute('data-i18n', b.key);
    badge.textContent = b.text;

    // La targeta fa el mateix que la del timeline: obrir el modal o anar a la pàgina de crònica
    card.onclick = function () {
      if (origen.tagName === 'A') window.location.href = origen.getAttribute('href');
      else origen.click();
    };
  }

  document.addEventListener('DOMContentLoaded', function () {
    omple();
    var card = document.getElementById('bento-destacat');
    if (card) {
      card.addEventListener('keydown', function (e) {
        if (e.target !== card) return;
        if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); card.click(); }
      });
    }
  });
})();
