  // Nav shrink on scroll (preserves the big logo at top, shrinks when scrolling)
  const nav = document.querySelector('.nav');
  window.addEventListener('scroll', () => {
    if (window.scrollY > 60) nav.classList.add('shrunk');
    else nav.classList.remove('shrunk');
  });

  // Smooth scroll robust per a tots els enllaços d'àncora del menú i del CTA
  document.querySelectorAll('a[href^="#"]').forEach(link => {
    link.addEventListener('click', (e) => {
      const id = link.getAttribute('href');
      if (!id || id === '#') return;
      const target = document.querySelector(id);
      if (!target) return;
      e.preventDefault();
      const navH = nav.classList.contains('shrunk') ? 64 : 80;
      const y = target.getBoundingClientRect().top + window.scrollY - navH + 1;
      window.scrollTo({ top: y, behavior: 'smooth' });
    });
  });
