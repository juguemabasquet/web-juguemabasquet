  const evOverlay = document.getElementById('event-modal-overlay');
  if (evOverlay) {
    const legacyTrigger = document.querySelector('.event-card.clickable');
    if (legacyTrigger) {
      legacyTrigger.addEventListener('click', () => { evOverlay.classList.add('active'); });
    }
    evOverlay.addEventListener('click', e => {
      if (e.target === evOverlay) evOverlay.classList.remove('active');
    });
    document.addEventListener('keydown', e => {
      if (e.key === 'Escape') evOverlay.classList.remove('active');
    });
  }
