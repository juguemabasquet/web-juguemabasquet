(function() {
  var audio = null, ticker = null;

  function initAudio() {
    if (audio) return;
    audio = document.getElementById('himne-audio');
    if (!audio) return;
    audio.addEventListener('loadedmetadata', function() {
      document.getElementById('himne-total').textContent = fmt(audio.duration);
    });
    audio.addEventListener('ended', function() {
      setPlayState(false);
      setProgress(0);
      document.getElementById('himne-current').textContent = '0:00';
      document.getElementById('himne-time-right').textContent = '0:00';
      if (lletreLines) lletreLines.forEach(function(el){ el.classList.remove('active','past'); });
    });
  }

  function fmt(s) {
    if (!s || isNaN(s)) return '0:00';
    var m = Math.floor(s / 60), sec = Math.floor(s % 60);
    return m + ':' + (sec < 10 ? '0' : '') + sec;
  }

  var PLAY_PATH = '<path d="M8 5v14l11-7z"/>';
  var PAUSE_PATH = '<path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z"/>';

  function setPlayState(playing) {
    // campanya player
    var wrap = document.getElementById('himne-wrap');
    if (wrap) wrap.classList.toggle('playing', playing);
    var icon = document.getElementById('himne-icon');
    if (icon) icon.innerHTML = playing ? PAUSE_PATH : PLAY_PATH;
    var btn = document.getElementById('himne-play-btn');
    if (btn) btn.classList.toggle('paused', !playing);
    // floating player
    var fpIcon = document.getElementById('fp-icon');
    if (fpIcon) fpIcon.innerHTML = playing ? PAUSE_PATH : PLAY_PATH;
    var fpBtn = document.getElementById('fp-play-btn');
    if (fpBtn) fpBtn.classList.toggle('pause-mode', playing);
    if (!playing) { clearInterval(ticker); ticker = null; }
  }

  function setProgress(pct) {
    var fill = document.getElementById('himne-fill');
    if (fill) fill.style.width = pct + '%';
    var fpFill = document.getElementById('fp-fill');
    if (fpFill) fpFill.style.width = pct + '%';
  }

  var lletreLines = null;
  function syncLletra(t) {
    if (!lletreLines) lletreLines = document.querySelectorAll('#himne-lletra .himne-line');
    lletreLines.forEach(function(el) {
      var s = parseFloat(el.dataset.start), e = parseFloat(el.dataset.end);
      if (t >= s && t < e) {
        el.classList.add('active');
        el.classList.remove('past');
        el.scrollIntoView({ block: 'nearest', behavior: 'smooth' });
      } else if (t >= e) {
        el.classList.remove('active');
        el.classList.add('past');
      } else {
        el.classList.remove('active', 'past');
      }
    });
  }

  window.toggleLletra = function() {
    var wrap = document.getElementById('himne-wrap');
    if (wrap) wrap.classList.toggle('lletra-on');
  };

  window.toggleHimne = function() {
    initAudio();
    if (!audio) return;
    if (audio.paused) {
      audio.play();
      setPlayState(true);
      var wrap = document.getElementById('himne-wrap');
      if (wrap) wrap.classList.add('lletra-on');
      ticker = setInterval(function() {
        if (!audio || isNaN(audio.duration)) return;
        var pct = audio.currentTime / audio.duration * 100;
        setProgress(pct);
        var t = fmt(audio.currentTime);
        document.getElementById('himne-current').textContent = t;
        document.getElementById('himne-time-right').textContent = t;
        syncLletra(audio.currentTime);
      }, 200);
    } else {
      audio.pause();
      setPlayState(false);
    }
  };

  window.seekHimne = function(e) {
    initAudio();
    if (!audio || isNaN(audio.duration)) return;
    var seekEl = e.currentTarget || document.getElementById('himne-seek');
    var rect = seekEl.getBoundingClientRect();
    audio.currentTime = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width)) * audio.duration;
  };

  window.closeFloatPlayer = function() {
    document.getElementById('float-player').classList.add('fp-hidden');
  };

  // Apareix el player flotant quan s'ha carregat la pàgina (400ms delay)
})();
