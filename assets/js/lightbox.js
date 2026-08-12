(function() {
  const lb = document.getElementById('lightbox');
  const lbImg = document.getElementById('lightbox-img');
  const lbCap = document.getElementById('lightbox-caption');
  const lbClose = document.getElementById('lightbox-close');
  const lbPrev = document.getElementById('lightbox-prev');
  const lbNext = document.getElementById('lightbox-next');
  let photos = [];
  let current = 0;

  function render() {
    if (!photos.length) return;
    const p = photos[current];
    lbImg.src = p.src;
    lbImg.alt = p.alt || '';
    lbCap.textContent = p.caption || '';
    const multi = photos.length > 1;
    if (lbPrev) lbPrev.style.display = multi ? '' : 'none';
    if (lbNext) lbNext.style.display = multi ? '' : 'none';
  }

  function open(list, idx) {
    photos = Array.isArray(list) ? list : [];
    if (!photos.length) return;
    current = Math.min(Math.max(idx || 0, 0), photos.length - 1);
    render();
    lb.classList.add('active');
    document.body.style.overflow = 'hidden';
  }

  function close() {
    lb.classList.remove('active');
    document.body.style.overflow = '';
    lbImg.src = '';
  }

  function showPrev() { current = (current - 1 + photos.length) % photos.length; render(); }
  function showNext() { current = (current + 1) % photos.length; render(); }

  function buildGallery() {
    const list = [];
    document.querySelectorAll('.gallery .ph figure').forEach(fig => {
      const img = fig.querySelector('img');
      const cap = fig.querySelector('figcaption');
      if (img) list.push({ src: img.src, alt: img.alt, caption: cap ? cap.textContent : '' });
    });
    return list;
  }

  document.addEventListener('DOMContentLoaded', function() {
    const galleryPhotos = buildGallery();
    document.querySelectorAll('.gallery .ph figure').forEach((fig, idx) => {
      fig.parentElement.addEventListener('click', () => open(galleryPhotos, idx));
    });
    if (lbClose) lbClose.addEventListener('click', close);
    if (lbPrev) lbPrev.addEventListener('click', function(e) { e.stopPropagation(); showPrev(); });
    if (lbNext) lbNext.addEventListener('click', function(e) { e.stopPropagation(); showNext(); });
    lb.addEventListener('click', function(e) { if (e.target === lb) close(); });
    document.addEventListener('keydown', function(e) {
      if (!lb.classList.contains('active')) return;
      if (e.key === 'Escape') close();
      if (e.key === 'ArrowLeft') showPrev();
      if (e.key === 'ArrowRight') showNext();
    });
  });

  // Public API so other modules (e.g. the shop) can reuse the same viewer.
  window.JABLightbox = { open: open, close: close };
})();
