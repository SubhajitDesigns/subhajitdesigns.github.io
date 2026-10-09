/* Cursor-controlled facial pose prototype.
   The source clip stays paused; pointer position selects a recorded facial pose. */
(() => {
  const hero = document.querySelector('.cinematic-hero');
  const scene = document.getElementById('cinematicScene');
  const video = hero && hero.querySelector('video');
  if (!hero || !scene || !video) return;

  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)');
  let frame = 0, x = 0, y = 0, targetTime = 0, seekFrame = 0;
  let lastSeek = -1;
  // These timestamps are based on the actual uploaded 10-second clip:
  // front-facing, looking upward/right, looking down, side glance, and near-front.
  const poses = [
    { x: 0.50, y: 0.50, t: 0.15 },
    { x: 0.78, y: 0.32, t: 3.55 },
    { x: 0.52, y: 0.78, t: 5.45 },
    { x: 0.82, y: 0.62, t: 7.15 },
    { x: 0.36, y: 0.42, t: 8.10 }
  ];

  const pickPose = (nx, ny) => {
    let best = poses[0], bestScore = Infinity;
    for (const pose of poses) {
      const dx = (nx - pose.x) * 1.0;
      const dy = (ny - pose.y) * 1.15;
      const score = dx * dx + dy * dy;
      if (score < bestScore) { bestScore = score; best = pose; }
    }
    return best.t;
  };

  const animate = () => {
    frame = 0;
    scene.style.setProperty('--scene-x', x.toFixed(2) + 'px');
    scene.style.setProperty('--scene-y', y.toFixed(2) + 'px');
    if (video.readyState >= 2 && Math.abs(video.currentTime - targetTime) > 0.07) {
      // Seeking creates a still pose; playback is never started.
      try { video.currentTime = targetTime; } catch (_) {}
    }
  };

  const onPointer = event => {
    if (event.pointerType === 'touch') return;
    const rect = hero.getBoundingClientRect();
    const nx = Math.max(0, Math.min(1, (event.clientX - rect.left) / rect.width));
    const ny = Math.max(0, Math.min(1, (event.clientY - rect.top) / rect.height));
    targetTime = pickPose(nx, ny);
    x = reduce.matches ? 0 : (nx - .5) * -8;
    y = reduce.matches ? 0 : (ny - .5) * -5;
    if (!frame) frame = requestAnimationFrame(animate);
  };

  hero.addEventListener('pointermove', onPointer, { passive: true });
  hero.addEventListener('pointerleave', () => {
    targetTime = poses[0].t;
    x = 0; y = 0;
    if (!frame) frame = requestAnimationFrame(animate);
  }, { passive: true });

  video.addEventListener('loadedmetadata', () => {
    video.pause();
    video.currentTime = poses[0].t;
  });
  video.addEventListener('seeked', () => { video.pause(); });
  video.addEventListener('play', () => video.pause());
  // Never call play(): use the video only as a collection of recorded facial poses.
  if (video.readyState >= 1) {
    video.pause();
    try { video.currentTime = poses[0].t; } catch (_) {}
  }
})();
