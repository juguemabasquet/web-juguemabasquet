  (function() {
    var overlay = document.getElementById('llefia-modal-overlay');
    overlay.addEventListener('click', function(e) {
      if (e.target === overlay) overlay.classList.remove('active');
    });
    document.addEventListener('keydown', function(e) {
      if (e.key === 'Escape') overlay.classList.remove('active');
    });
  })();
