/* Cursor-to-JPEG pose selection using the user's 10 FPS sequence. No video playback. */
(() => {
  const hero = document.querySelector('.cinematic-hero');
  const scene = document.getElementById('cinematicScene');
  const image = document.getElementById('cinematicPoseImage');
  if (!hero || !scene || !image) return;
  const archiveUrl = 'https://d2ol7oe51mr4n9.cloudfront.net/user_3J5wMb6jrWj1Y3i6X8tSPeXaSPn/83ddd944-5873-41ae-8efe-e7e6d8adb08f.zip';
  // Representative frames visually checked from the 101-frame contact sheet.
  const poses = [
    {f:0,   x:.50,y:.50}, // neutral/front
    {f:17,  x:.08,y:.50}, // turn/gaze left
    {f:24,  x:.95,y:.50}, // right
    {f:33,  x:.90,y:.12}, // upper-right
    {f:42,  x:.68,y:.10}, // upward/right
    {f:52,  x:.50,y:.95}, // down
    {f:57,  x:.30,y:.90}, // down-left
    {f:67,  x:.05,y:.55}, // left-facing
    {f:76,  x:.12,y:.75}, // lower-left/side
    {f:84,  x:.50,y:.02}, // up
    {f:88,  x:.78,y:.15}, // up-right/front
    {f:94,  x:.50,y:.88}, // down/front
    {f:100, x:.50,y:.50} // return/front
  ];
  const urls = new Map();
  let ready = false, active = -1, raf = 0;
  const reduced = matchMedia('(prefers-reduced-motion: reduce)');
  const nearest = (x,y) => {
    let best=poses[0], min=Infinity;
    for (const p of poses) {
      const score=(x-p.x)**2 + ((y-p.y)*1.1)**2;
      if(score<min){min=score;best=p;}
    }
    return best.f;
  };
  const setPose = f => {
    const url=urls.get(f);
    if(!url || active===f) return;
    active=f; image.src=url; image.dataset.pose=String(f);
  };
  hero.addEventListener('pointermove', e => {
    if(!ready || e.pointerType==='touch') return;
    const r=hero.getBoundingClientRect();
    const x=Math.max(0,Math.min(1,(e.clientX-r.left)/r.width));
    const y=Math.max(0,Math.min(1,(e.clientY-r.top)/r.height));
    const f=nearest(x,y);
    if(raf) cancelAnimationFrame(raf);
    raf=requestAnimationFrame(()=>{
      raf=0; setPose(f);
      scene.style.setProperty('--scene-x',reduced.matches?'0px':((x-.5)*-3).toFixed(1)+'px');
      scene.style.setProperty('--scene-y',reduced.matches?'0px':((y-.5)*-2).toFixed(1)+'px');
    });
  },{passive:true});
  hero.addEventListener('pointerleave',()=>{
    setPose(0);
    scene.style.setProperty('--scene-x','0px');
    scene.style.setProperty('--scene-y','0px');
  },{passive:true});
  const loader=document.createElement('script');
  loader.src='https://cdnjs.cloudflare.com/ajax/libs/jszip/3.10.1/jszip.min.js';
  loader.onload=async()=>{
    try{
      const res=await fetch(archiveUrl,{cache:'force-cache'});
      if(!res.ok) throw Error('Could not fetch JPEG archive');
      const zip=await JSZip.loadAsync(await res.arrayBuffer());
      await Promise.all([...new Set(poses.map(p=>p.f))].map(async f=>{
        const file=zip.file('frame_'+String(f).padStart(6,'0')+'.jpg');
        if(file) urls.set(f,URL.createObjectURL(await file.async('blob')));
      }));
      if(!urls.has(0)) throw Error('Front-facing frame missing');
      ready=true; setPose(0); hero.classList.add('cinematic-poses-ready');
    }catch(err){console.error(err);hero.classList.add('cinematic-poses-failed');}
  };
  loader.onerror=()=>hero.classList.add('cinematic-poses-failed');
  document.head.appendChild(loader);
})();
