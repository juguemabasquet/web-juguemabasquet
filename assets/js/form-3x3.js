// FORMULARI INSCRIPCIÓ 3x3
(function() {
  const form = document.getElementById('form-3x3');
  if (!form) return;

  form.addEventListener('submit', function(e) {
    e.preventDefault();

    // Validació
    let valid = true;
    form.querySelectorAll('[required]').forEach(function(el) {
      el.classList.remove('error');
      const isEmpty = el.type === 'checkbox' ? !el.checked : !el.value.trim();
      if (isEmpty) { el.classList.add('error'); valid = false; }
    });
    if (!valid) {
      form.querySelector('.error').scrollIntoView({ behavior: 'smooth', block: 'center' });
      return;
    }

    // Recollir dades
    const nom    = form.querySelector('[name="nom_equip"]').value.trim();
    const cat    = form.querySelector('[name="categoria"]').value;
    const j1     = form.querySelector('[name="jugador_1"]').value.trim();
    const j2     = form.querySelector('[name="jugador_2"]').value.trim();
    const j3     = form.querySelector('[name="jugador_3"]').value.trim();
    const j4     = form.querySelector('[name="jugador_4"]').value.trim();
    const dNom   = form.querySelector('[name="delegat_nom"]').value.trim();
    const dMobil = form.querySelector('[name="delegat_mobil"]').value.trim();
    const dEmail = form.querySelector('[name="delegat_email"]').value.trim();
    const imatge = form.querySelector('[name="imatge"]').checked ? 'Sí' : 'No';

    const subject = '3x3 JAB · Inscripció · ' + nom;
    const body =
      '=== INSCRIPCIÓ TORNEIG 3x3 JAB · 18 JULIOL 2026 ===\n\n' +
      'NOM DE L\'EQUIP: ' + nom + '\n' +
      'CATEGORIA: ' + cat + '\n\n' +
      'JUGADORS:\n' +
      '  1. ' + j1 + '\n' +
      '  2. ' + j2 + '\n' +
      '  3. ' + j3 + '\n' +
      (j4 ? '  4. ' + j4 + ' (suplent)\n' : '') +
      '\nDELEGAT/A:\n' +
      '  Nom: ' + dNom + '\n' +
      '  Mòbil: ' + dMobil + '\n' +
      '  Email: ' + dEmail + '\n\n' +
      'Drets d\'imatge: ' + imatge + '\n\n' +
      '---\n' +
      'PAGAMENT: Bizum 24€ al 655 585 695 (en el moment de la inscripció)\n' +
      'Concepte Bizum: 3x3 JAB · ' + nom;

    // Obrir client de correu
    window.location.href = 'mailto:info@juguemabasquet.org' +
      '?subject=' + encodeURIComponent(subject) +
      '&body=' + encodeURIComponent(body);

    // Mostrar instruccions Bizum a la pàgina
    const concepteEl = document.getElementById('concepte-display');
    if (concepteEl) concepteEl.textContent = '3x3 JAB · ' + nom;

    form.style.display = 'none';
    document.getElementById('form-sending').style.display = 'none';
    document.getElementById('form-success').style.display = 'block';
    document.getElementById('form-success').scrollIntoView({ behavior: 'smooth', block: 'start' });
  });
})();
