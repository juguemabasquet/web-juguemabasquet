  const evOverlay = document.getElementById('event-modal-overlay');
  document.querySelector('.event-card.clickable').addEventListener('click', () => {
    evOverlay.classList.add('active');
  });
  evOverlay.addEventListener('click', e => {
    if (e.target === evOverlay) evOverlay.classList.remove('active');
  });
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape') evOverlay.classList.remove('active');
  });
