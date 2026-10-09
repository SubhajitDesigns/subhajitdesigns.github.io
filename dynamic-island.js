/* Dynamic Island-inspired navigation for Subhajit's portfolio.
   The existing soundtrack player is moved intact so its controls and audio logic remain connected. */
(() => {
  const header = document.querySelector('.hero-nav');
  const musicPlayer = document.getElementById('siteMusicPlayer');
  if (!header || !musicPlayer || document.getElementById('dynamicIslandRoot')) return;

  const root = document.createElement('div');
  root.id = 'dynamicIslandRoot';
  root.innerHTML = `
    <div class="di-card">
      <button class="di-toggle" id="dynamicIslandToggle" type="button" aria-expanded="false" aria-controls="dynamicIslandPanel" aria-label="Open portfolio navigation">
        <span class="di-toggle-left">
          <span class="di-mark" aria-hidden="true">S.</span>
          <span class="di-wordmark">SUBHAJIT<span style="color:#ff493b">.</span></span>
        </span>
        <span class="di-toggle-right">
          <span class="di-status"><i class="di-status-dot"></i> DESIGNER ONLINE</span>
          <span class="di-wave" aria-hidden="true"><i></i><i></i><i></i><i></i><i></i></span>
          <span class="di-chevron" aria-hidden="true">⌄</span>
        </span>
      </button>
      <div class="di-panel" id="dynamicIslandPanel">
        <div class="di-panel-inner">
          <div class="di-divider"></div>
          <nav class="di-links" aria-label="Main navigation">
            <a href="#about">About</a>
            <a href="#what-i-do">What I Do</a>
            <a href="resume.html">Resume <span aria-hidden="true">↗</span></a>
            <a href="#work">Work</a>
            <a href="#clients">Clients</a>
            <button class="di-music-link" id="dynamicIslandMusicLink" type="button"><span aria-hidden="true">♫</span> Music</button>
          </nav>
          <div class="di-music-label"><span>PORTFOLIO SOUNDTRACK</span><span>NOW PLAYING / PLAYER</span></div>
          <div id="dynamicIslandMusicMount"></div>
        </div>
      </div>
    </div>`;
  document.body.appendChild(root);

  // Keep the hero's existing vertical spacing but replace its old navigation UI.
  header.replaceChildren();
  const musicMount = root.querySelector('#dynamicIslandMusicMount');
  musicMount.appendChild(musicPlayer);

  const toggle = root.querySelector('#dynamicIslandToggle');
  const musicLink = root.querySelector('#dynamicIslandMusicLink');
  const links = [...root.querySelectorAll('.di-links a')];
  let pinnedOpen = false;
  let closeTimer = null;
  const isCoarse = window.matchMedia('(pointer: coarse)');

  function setOpen(open, pin = false) {
    clearTimeout(closeTimer);
    if (pin) pinnedOpen = open;
    const expanded = Boolean(open);
    root.classList.toggle('di-open', expanded);
    toggle.setAttribute('aria-expanded', String(expanded));
    toggle.setAttribute('aria-label', expanded ? 'Close portfolio navigation' : 'Open portfolio navigation');
  }
  function scheduleClose() {
    clearTimeout(closeTimer);
    if (!pinnedOpen && !isCoarse.matches) closeTimer = setTimeout(() => setOpen(false), 180);
  }

  root.addEventListener('pointerenter', () => {
    if (!isCoarse.matches) setOpen(true);
  });
  root.addEventListener('pointerleave', scheduleClose);
  toggle.addEventListener('click', () => {
    const next = !root.classList.contains('di-open');
    setOpen(next, true);
  });

  links.forEach(link => {
    link.addEventListener('click', () => {
      links.forEach(item => item.classList.toggle('is-active', item === link));
      setOpen(false, true);
    });
  });

  musicLink.addEventListener('click', () => {
    setOpen(true, true);
    const playButton = document.getElementById('musicPlay');
    if (playButton) playButton.focus({preventScroll:true});
  });

  document.addEventListener('pointerdown', event => {
    if (isCoarse.matches && !root.contains(event.target)) setOpen(false, true);
    else if (!isCoarse.matches && pinnedOpen && !root.contains(event.target)) setOpen(false, true);
  });
  document.addEventListener('keydown', event => {
    if (event.key === 'Escape' && root.classList.contains('di-open')) {
      setOpen(false, true);
      toggle.focus({preventScroll:true});
    }
  });

  // Anchor navigation stays native, while the floating island remains available on scroll.
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', event => {
      const id = anchor.getAttribute('href');
      if (!id || id === '#') return;
      const target = document.querySelector(id);
      if (target) {
        event.preventDefault();
        target.scrollIntoView({behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth', block:'start'});
        history.replaceState(null, '', id);
      }
    });
  });
})();