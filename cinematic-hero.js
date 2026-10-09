/* Nearest-pose JPEG hero. No autoplay video: the cursor selects from the extracted sequence. */
(() => {
  const hero = document.querySelector('.cinematic-hero');
  const scene = document.getElementById('cinematicScene');
  const image = document.getElementById('cinematicPoseImage');
  if (!hero || !scene || !image) return;
  const archiveUrl = 'https://d2ol7oe51mr4n9.cloudfront.net/user_3J5wMb6jrWj1Y3i6X8tSPeXaSPn/92b4b47e-3daf-49f7-8748-5b8fe740384a.zip';
  // Pose labels based on the supplied contact sheet: front, side turns, upward and downward looks.
  const poses = [
    { frame: 0,   x: .50, y: .50, label: 'front' },
    { frame: 36,  x: .18, y: .50, label: 'left' },
    { frame: 48,  x: .08, y: .50, label: 'far-left' },
    { frame: 60,  x: .84, y: .50, label: 'right' },
    { frame: 72,  x: .84, y: .32, label: 'upper-right' },
    { frame: 84,  x: .70, y: .12, label: 'up-right' },
    { frame: 96,  x: .50, y: .10, label: 'up' },
    { frame: 120, x: .50, y: .50, label: 'front-return' },
    { frame: 132, x: .50, y: .88, label: 'down' },
    { frame: 150, x: .16, y: .56, label: 'left-turn' },
    { frame: 168, x: .08, y: .56, label: 'far-left-turn' },
    { frame: 192, x: .50, y: .16, label: 'up-front' },
    { frame: 216, x: .62, y: .12, label: 'up-right-front' },
    { frame: 234, x: .50, y: .48, label: 'front' }
  ];
  const frameUrls = new Map();
  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)');
  let loaded = false, activeFrame = -1, raf = 0;

  function nearestFrame(nx, ny) {
    let best = poses[0], bestScore = Infinity;
    for (const p of poses) {
      const dx = nx - p.x, dy = (ny - p.y) * 1.15;
      const score = dx * dx + dy * dy;
      if (score < bestScore) { bestScore = score; best = p; }
    }
    return best.frame;
  }
  function setFrame(frame) {
    const url = frameUrls.get(frame);
    if (!url || frame === activeFrame) return;
    activeFrame = frame;
    image.src = url;
    image.dataset.pose = String(frame);
    image.alt = 'Interactive portrait pose: ' + (poses.find(p => p.frame === frame)?.label || 'selected');
  }
  function handlePointer(event) {
    if (!loaded || event.pointerType === 'touch') return;
    const rect = hero.getBoundingClientRect();
    const nx = Math.max(0, Math.min(1, (event.clientX - rect.left) / rect.width));
    const ny = Math.max(0, Math.min(1, (event.clientY - rect.top) / rect.height));
    const frame = nearestFrame(nx, ny);
    if (raf) cancelAnimationFrame(raf);
    raf = requestAnimationFrame(() => {
      raf = 0;
      setFrame(frame);
      scene.style.setProperty('--scene-x', reduce.matches ? '0px' : ((nx - .5) * -3).toFixed(1) + 'px');
      scene.style.setProperty('--scene-y', reduce.matches ? '0px' : ((ny - .5) * -2).toFixed(1) + 'px');
    });
  }
  hero.addEventListener('pointermove', handlePointer, { passive: true });
  hero.addEventListener('pointerleave', () => {
    setFrame(0);
    scene.style.setProperty('--scene-x', '0px');
    scene.style.setProperty('--scene-y', '0px');
  }, { passive: true });

  const loader = document.createElement('script');
  loader.src = 'https://cdnjs.cloudflare.com/ajax/libs/jszip/3.10.1/jszip.min.js';
  loader.onload = async () => {
    try {
      const response = await fetch(archiveUrl, { cache: 'force-cache' });
      if (!response.ok) throw new Error('JPEG sequence archive request failed');
      const zip = await window.JSZip.loadAsync(await response.arrayBuffer());
      const frames = [...new Set(poses.map(p => p.frame))];
      await Promise.all(frames.map(async frame => {
        const name = 'frame_' + String(frame).padStart(6, '0') + '.jpg';
        const file = zip.file(name);
        if (!file) return;
        const blob = await file.async('blob');
        frameUrls.set(frame, URL.createObjectURL(blob));
      }));
      if (!frameUrls.has(0)) throw new Error('Default JPEG frame missing');
      loaded = true;
      setFrame(0);
      hero.classList.add('cinematic-poses-ready');
    } catch (err) {
      console.error('Could not load JPEG portrait poses:', err);
      hero.classList.add('cinematic-poses-failed');
    }
  };
  loader.onerror = () => hero.classList.add('cinematic-poses-failed');
  document.head.appendChild(loader);
})();
