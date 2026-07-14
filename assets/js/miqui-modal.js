  (function() {
    var mqOverlay = document.getElementById('miqui-modal-overlay');
    mqOverlay.addEventListener('click', function(e) {
      if (e.target === mqOverlay) mqOverlay.classList.remove('active');
    });
    document.addEventListener('keydown', function(e) {
      if (e.key === 'Escape') mqOverlay.classList.remove('active');
    });
  })();
