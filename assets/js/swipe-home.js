// Swipe left-to-right (touch) to go back to the home page from any open section.
// Mirrors the "Inici" button so mobile users don't need to reach for it.
(function () {
  var THRESHOLD_X = 70;   // min horizontal distance (px) to count as a swipe
  var MAX_TIME = 600;     // max duration (ms) for the gesture
  var startX = 0, startY = 0, startT = 0, tracking = false, ignore = false;

  // True when a modal / overlay / lightbox is open and should absorb the gesture.
  function isBlocked() {
    if (document.body.style.overflow === 'hidden') return true; // reporta, informe, lightbox, mobile menu
    if (document.querySelector('#modal-avis.open, #modal-privacitat.open, #modal-cookies.open')) return true; // legal modals
    if (document.querySelector('#event-modal-overlay.active, #miqui-modal-overlay.active')) return true;
    var reunio = document.getElementById('modal-reunio');
    if (reunio && getComputedStyle(reunio).display !== 'none') return true;
    return false;
  }

  // Ignore gestures that start on the map or on a horizontally scrollable element,
  // where a left/right drag has its own meaning.
  function startsOnHorizontalTarget(el) {
    while (el && el !== document.body) {
      if (el.classList && (el.classList.contains('leaflet-container') || el.classList.contains('no-swipe-home'))) {
        return true;
      }
      if (el.scrollWidth - el.clientWidth > 8) {
        var ox = getComputedStyle(el).overflowX;
        if (ox === 'auto' || ox === 'scroll') return true;
      }
      el = el.parentElement;
    }
    return false;
  }

  document.addEventListener('touchstart', function (e) {
    tracking = false;
    if (e.touches.length !== 1) return;
    if (!document.querySelector('.page-section.active')) return; // only when a section is open
    if (isBlocked()) return;
    var t = e.touches[0];
    startX = t.clientX;
    startY = t.clientY;
    startT = Date.now();
    ignore = startsOnHorizontalTarget(e.target);
    tracking = true;
  }, { passive: true });

  document.addEventListener('touchend', function (e) {
    if (!tracking || ignore) { tracking = false; return; }
    tracking = false;
    if (!document.querySelector('.page-section.active')) return;
    var t = e.changedTouches[0];
    var dx = t.clientX - startX;
    var dy = t.clientY - startY;
    var dt = Date.now() - startT;
    // left-to-right, fast enough, and clearly horizontal (not a vertical scroll)
    if (dt <= MAX_TIME && dx > THRESHOLD_X && Math.abs(dx) > Math.abs(dy) * 2) {
      showHome();
    }
  }, { passive: true });
})();
