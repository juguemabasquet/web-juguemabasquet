(function() {
  const lb = document.getElementById('lightbox');
  const lbImg = document.getElementById('lightbox-img');
  const lbCap = document.getElementById('lightbox-caption');
  const lbClose = document.getElementById('lightbox-close');
  const lbPrev = document.getElementById('lightbox-prev');
  const lbNext = document.getElementById('lightbox-next');
  let photos = [];
  let current = 0;

  function buildGallery() {
    photos = [];
    document.querySelectorAll('.gallery .ph figure').forEach(fig => {
      const img = fig.querySelector('img');
      const cap = fig.querySelector('figcaption');
      if (img) photos.push({ src: img.src, alt: img.alt, caption: cap ? cap.textContent : '' });
    });
  }

  function openLightbox(idx) {
    current = idx;
    lbImg.src = photos[current].src;
    lbImg.alt = photos[current].alt;
    lbCap.textContent = photos[current].caption;
    lb.classList.add('active');
    document.body.style.overflow = 'hidden';
  }

  function closeLightbox() {
    lb.classList.remove('active');
    document.body.style.overflow = '';
    lbImg.src = '';
  }

  function showPrev() { current = (current - 1 + photos.length) % photos.length; openLightbox(current); }
  function showNext() { current = (current + 1) % photos.length; openLightbox(current); }

  document.addEventListener('DOMContentLoaded', function() {
    buildGallery();
    document.querySelectorAll('.gallery .ph figure').forEach((fig, idx) => {
      fig.parentElement.addEventListener('click', () => openLightbox(idx));
    });
    lbClose.addEventListener('click', closeLightbox);
    lbPrev.addEventListener('click', function(e) { e.stopPropagation(); showPrev(); });
    lbNext.addEventListener('click', function(e) { e.stopPropagation(); showNext(); });
    lb.addEventListener('click', function(e) { if (e.target === lb) closeLightbox(); });
    document.addEventListener('keydown', function(e) {
      if (!lb.classList.contains('active')) return;
      if (e.key === 'Escape') closeLightbox();
      if (e.key === 'ArrowLeft') showPrev();
      if (e.key === 'ArrowRight') showNext();
    });
  });
})();
