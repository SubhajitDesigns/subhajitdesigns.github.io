/* Cursor-controlled portrait prototype driven by the user's extracted 30 FPS sequence.
   Video element is used only as a paused frame source; playback is never started. */
(() => {
  const hero = document.querySelector('.cinematic-hero');
  const scene = document.getElementById('cinematicScene');
  const video = hero && hero.querySelector('video');
  if (!hero || !scene || !video) return;
  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)');
  let raf = 0, x = 0, y = 0, targetTime = 0.10;

  // Approximate representative poses from the supplied 240-frame sequence.
  const poses = [
    { x: .50, y: .50, t: .10 },
    { x: .18, y: .50, t: 1.20 },
    { x: .82, y: .50, t: 2.00 },
    { x: .80, y: .22, t: 2.80 },
    { x: .30, y: .20, t: 3.20 },
    { x: .50, y: .82, t: 4.00 },
    { x: .20, y: .54, t: 6.00 },
    { x: .60, y: .18, t: 6.80 },
    { x: .50, y: .50, t: 4.80 }
  ];
  const findPose = (nx, ny) => {
    let best = poses[0], bestScore = Infinity;
    for (const pose of poses) {
      const dx = nx - pose.x, dy = (ny - pose.y) * 1.08;
      const score = dx * dx + dy * dy;
      if (score < bestScore) { bestScore = score; best = pose; }
    }
    return best.t;
  };
  const render = () => {
    raf = 0;
    scene.style.setProperty('--scene-x', x.toFixed(2) + 'px');
    scene.style.setProperty('--scene-y', y.toFixed(2) + 'px');
    if (video.readyState >= 2 && Math.abs(video.currentTime - targetTime) > .035) {
      try { video.currentTime = targetTime; } catch (_) {}
    }
  };
  const queue = () => { if (!raf) raf = requestAnimationFrame(render); };
  hero.addEventListener('pointermove', event => {
    if (event.pointerType === 'touch') return;
    const rect = hero.getBoundingClientRect();
    const nx = Math.max(0, Math.min(1, (event.clientX - rect.left) / rect.width));
    const ny = Math.max(0, Math.min(1, (event.clientY - rect.top) / rect.height));
    targetTime = findPose(nx, ny);
    x = reduce.matches ? 0 : (nx - .5) * -5;
    y = reduce.matches ? 0 : (ny - .5) * -3;
    queue();
  }, { passive: true });
  hero.addEventListener('pointerleave', () => {
    targetTime = .10; x = 0; y = 0; queue();
  }, { passive: true });
  video.addEventListener('loadedmetadata', () => {
    video.pause();
    try { video.currentTime = .10; } catch (_) {}
  });
  video.addEventListener('seeked', () => video.pause());
  video.addEventListener('play', () => video.pause());
  video.pause();
  if (video.readyState >= 1) {
    try { video.currentTime = .10; } catch (_) {}
  }
})();
