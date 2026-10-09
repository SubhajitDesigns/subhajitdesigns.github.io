/* Subtle cursor-driven scene parallax: shifts the whole video to create a restrained follow illusion. */
(() => {
  const hero = document.querySelector('.cinematic-hero');
  const scene = document.getElementById('cinematicScene');
  if (!hero || !scene) return;
  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)');
  let frame = 0;
  let x = 0, y = 0;
  const apply = () => {
    frame = 0;
    scene.style.setProperty('--scene-x', x.toFixed(2) + 'px');
    scene.style.setProperty('--scene-y', y.toFixed(2) + 'px');
  };
  hero.addEventListener('pointermove', event => {
    if (reduce.matches || event.pointerType === 'touch') return;
    const rect = hero.getBoundingClientRect();
    const nx = ((event.clientX - rect.left) / rect.width - .5);
    const ny = ((event.clientY - rect.top) / rect.height - .5);
    /* Very small movement, with the scene drifting toward the pointer. */
    x = nx * -16;
    y = ny * -10;
    if (!frame) frame = requestAnimationFrame(apply);
  }, { passive: true });
  hero.addEventListener('pointerleave', () => {
    x = 0; y = 0;
    if (!frame) frame = requestAnimationFrame(apply);
  }, { passive: true });
  document.addEventListener('visibilitychange', () => {
    const video = hero.querySelector('video');
    if (!video) return;
    if (document.hidden) video.pause();
    else video.play().catch(() => {});
  });
  const video = hero.querySelector('video');
  if (video) video.play().catch(() => {});
})();
