// Swipe left-to-right (touch) to go back from a standalone subpage (event pages, etc.)
// to where the user came from. Mirrors the SPA's swipe-home gesture so mobile users
// get the same "drag to go back" behaviour outside the single-page app.
(function () {
  var THRESHOLD_X = 70;   // min horizontal distance (px) to count as a swipe
  var MAX_TIME = 600;     // max duration (ms) for the gesture
  var startX = 0, startY = 0, startT = 0, tracking = false, ignore = false;

  // True when a modal / overlay / lightbox is open and should absorb the gesture.
  function isBlocked() {
    if (document.body.style.overflow === 'hidden') return true;
    if (document.querySelector('.poster-lightbox.open')) return true;
    return false;
  }

  // Ignore gestures that start on a horizontally scrollable element (e.g. a gallery
  // carousel), where a left/right drag has its own meaning.
  function startsOnHorizontalTarget(el) {
    while (el && el !== document.body) {
      if (el.classList && el.classList.contains('no-swipe-back')) return true;
      if (el.scrollWidth - el.clientWidth > 8) {
        var ox = getComputedStyle(el).overflowX;
        if (ox === 'auto' || ox === 'scroll') return true;
      }
      el = el.parentElement;
    }
    return false;
  }

  // Navigate back: if we came from our own site, use the browser history so the
  // previous page/section is restored exactly (like the native back gesture).
  // Otherwise fall back to the "← Inici" link (or the site home).
  function goBack() {
    var sameOrigin = document.referrer && document.referrer.indexOf(location.origin) === 0;
    if (sameOrigin && window.history.length > 1) {
      window.history.back();
      return;
    }
    var link = document.querySelector('.header-back');
    location.href = (link && link.getAttribute('href')) || '../../index.html';
  }

  document.addEventListener('touchstart', function (e) {
    tracking = false;
    if (e.touches.length !== 1) return;
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
    var t = e.changedTouches[0];
    var dx = t.clientX - startX;
    var dy = t.clientY - startY;
    var dt = Date.now() - startT;
    // left-to-right, fast enough, and clearly horizontal (not a vertical scroll)
    if (dt <= MAX_TIME && dx > THRESHOLD_X && Math.abs(dx) > Math.abs(dy) * 2) {
      goBack();
    }
  }, { passive: true });
})();
