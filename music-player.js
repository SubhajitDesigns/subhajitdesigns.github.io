(() => {
  const player = document.getElementById('siteMusicPlayer');
  const audio = document.getElementById('siteMusicAudio');
  if (!player || !audio || player.dataset.initialized === 'true') return;
  player.dataset.initialized = 'true';

  const track = {
    title: 'Wake Up To Reality',
    artist: 'Madara Uchiha · 8D Audio',
    src: 'https://d2ol7oe51mr4n9.cloudfront.net/user_3J5wMb6jrWj1Y3i6X8tSPeXaSPn/35f4d5a2-cca7-43db-8fb4-f8fc69cbee47.mp3'
  };
  const $ = id => document.getElementById(id);
  const playBtn = $('musicPlay');
  const progress = $('musicProgress');
  const volume = $('musicVolume');
  let autoplayBlocked = false;

  const timeLabel = seconds => !Number.isFinite(seconds) || seconds < 0
    ? '0:00'
    : Math.floor(seconds / 60) + ':' + String(Math.floor(seconds % 60)).padStart(2, '0');

  function sync() {
    player.classList.toggle('is-playing', !audio.paused);
    playBtn.textContent = audio.paused ? '▶' : 'Ⅱ';
    playBtn.setAttribute('aria-label', audio.paused ? 'Play music' : 'Pause music');
    $('musicMute').textContent = audio.muted ? '🔇' : '🔊';
    $('musicMute').setAttribute('aria-label', audio.muted ? 'Unmute audio' : 'Mute audio');
    $('musicMute').setAttribute('aria-pressed', String(audio.muted));
    player.classList.toggle('autoplay-blocked', autoplayBlocked && audio.paused);
  }

  function play() {
    audio.play().then(() => {
      autoplayBlocked = false;
      sync();
    }).catch(() => {
      autoplayBlocked = true;
      sync();
    });
  }

  audio.src = track.src;
  audio.preload = 'auto';
  audio.volume = Number(volume.value || 0.55);
  $('musicTrackName').textContent = track.title;
  $('musicTrackArtist').textContent = track.artist;
  $('musicTrackNumber').textContent = '01 / 01';
  $('musicCurrentTime').textContent = '0:00';
  $('musicDuration').textContent = '0:00';
  audio.setAttribute('playsinline', '');
  audio.setAttribute('autoplay', '');

  playBtn.addEventListener('click', () => {
    if (audio.paused) play();
    else audio.pause();
  });

  // One song is currently configured: previous/next restart this same track.
  $('musicPrev').addEventListener('click', () => {
    audio.currentTime = 0;
    play();
  });
  $('musicNext').addEventListener('click', () => {
    audio.currentTime = 0;
    play();
  });

  audio.addEventListener('timeupdate', () => {
    $('musicCurrentTime').textContent = timeLabel(audio.currentTime);
    if (Number.isFinite(audio.duration) && audio.duration > 0) {
      progress.value = audio.currentTime / audio.duration * 100;
      $('musicDuration').textContent = timeLabel(audio.duration);
    }
  });
  audio.addEventListener('loadedmetadata', () => {
    $('musicDuration').textContent = timeLabel(audio.duration);
  });
  audio.addEventListener('ended', () => {
    audio.currentTime = 0;
    play();
  });
  audio.addEventListener('play', sync);
  audio.addEventListener('pause', sync);
  progress.addEventListener('input', () => {
    if (Number.isFinite(audio.duration) && audio.duration > 0) {
      audio.currentTime = Number(progress.value) / 100 * audio.duration;
    }
  });
  volume.addEventListener('input', () => {
    audio.volume = Number(volume.value);
    if (audio.volume > 0) audio.muted = false;
    sync();
  });
  $('musicMute').addEventListener('click', () => {
    audio.muted = !audio.muted;
    sync();
  });
  $('musicCollapse').addEventListener('click', () => {
    const collapsed = player.classList.toggle('is-collapsed');
    $('musicCollapse').textContent = collapsed ? '+' : '−';
    $('musicCollapse').setAttribute('aria-label', collapsed ? 'Expand music player' : 'Minimize music player');
  });

  // Browsers may block audible autoplay; retry on the visitor's first real interaction.
  const retryOnInteraction = () => {
    if (audio.paused && autoplayBlocked) play();
    window.removeEventListener('pointerdown', retryOnInteraction);
    window.removeEventListener('keydown', retryOnInteraction);
  };
  window.addEventListener('pointerdown', retryOnInteraction, { once: true });
  window.addEventListener('keydown', retryOnInteraction, { once: true });

  sync();
  play();
})();