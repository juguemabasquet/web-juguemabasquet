// Targeta "Entrevistes" del bento d'inici: la foto va rotant per torns entre les
// entrevistes publicades (#entrevistes .entrev-card), canviant cada DIES_ROTACIO dies.
// Tothom veu la mateixa el mateix dia. Una entrevista nova entra sola a la rotació.
// Per provar-ho amb una altra data: index.html?avui=2026-11-20
(function () {
  var DIES_ROTACIO = 3;

  function diaActual() {
    var param = new URLSearchParams(window.location.search).get('avui');
    var d = param && /^\d{4}-\d{2}-\d{2}$/.test(param) ? param.split('-') : null;
    var data = d ? new Date(+d[0], +d[1] - 1, +d[2]) : new Date();
    // Dies sencers des de l'1/1/1970 en hora local (evita salts pel canvi d'hora)
    return Math.floor(Date.UTC(data.getFullYear(), data.getMonth(), data.getDate()) / 86400000);
  }

  document.addEventListener('DOMContentLoaded', function () {
    var card = document.getElementById('bento-entrevista');
    var fotos = document.querySelectorAll('#entrevistes .entrev-card .entrev-thumb img');
    if (!card || !fotos.length) return;

    var origen = fotos[Math.floor(diaActual() / DIES_ROTACIO) % fotos.length];
    var img = card.querySelector('.bento-foto-img');
    img.src = origen.src;
    img.style.objectPosition = origen.style.objectPosition || 'center 20%';
    card.querySelector('.bento-entrev-nom').textContent = origen.alt;
  });
})();
