(function() {
  const navLinks = document.querySelectorAll('.nav a.nav-link');
  const sections = [];
  navLinks.forEach(link => {
    const href = link.getAttribute('href');
    if (href && href.startsWith('#')) {
      const section = document.querySelector(href);
      if (section) sections.push({ link, section });
    }
  });
  if (!sections.length) return;
  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        navLinks.forEach(l => l.classList.remove('active'));
        const active = sections.find(s => s.section === entry.target);
        if (active) active.link.classList.add('active');
      }
    });
  }, { rootMargin: '-40% 0px -55% 0px', threshold: 0 });
  sections.forEach(s => observer.observe(s.section));
})();
