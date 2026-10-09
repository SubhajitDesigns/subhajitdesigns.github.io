/* Cursor-to-gaze matching based on inspection of all 101 JPEG frames. */
(() => {
  const hero=document.querySelector('.cinematic-hero');
  const scene=document.getElementById('cinematicScene');
  const image=document.getElementById('cinematicPoseImage');
  if(!hero||!scene||!image)return;
  const archiveUrl='https://d2ol7oe51mr4n9.cloudfront.net/user_3J5wMb6jrWj1Y3i6X8tSPeXaSPn/83ddd944-5873-41ae-8efe-e7e6d8adb08f.zip';
  // Frame ranges reviewed in contact sheet:
  // 0-12 front; 13-23 side glance to image-right; 24-47 upward/image-right;
  // 48-62 down; 63-78 side glance to image-left; 79-90 up; 91-100 down.
  // Use the middle of each stable pose, avoiding transition/blink frames.
  const poses=[
    {f:5,  gx:0, gy:0, label:'front'},
    {f:20, gx:1, gy:0, label:'right'},
    {f:35, gx:.72, gy:-.72, label:'upper-right'},
    {f:57, gx:0, gy:1, label:'down'},
    {f:70, gx:-1, gy:0, label:'left'},
    {f:85, gx:0, gy:-1, label:'up'},
    {f:96, gx:0, gy:.85, label:'down-front'}
  ];
  const urls=new Map();let ready=false,active=-1,raf=0;
  const reduced=matchMedia('(prefers-reduced-motion: reduce)');
  function nearest(x,y){
    // Cursor coordinates are translated to gaze coordinates; compare direction vectors,
    // not screen quadrants, so a left-side cursor never accidentally picks an up-right pose.
    const dx=(x-.5)*2, dy=(y-.5)*2;
    const mag=Math.hypot(dx,dy)||1;
    const vx=dx/mag, vy=dy/mag;
    let best=poses[0],bestScore=Infinity;
    for(const p of poses){
      const score=(vx-p.gx)**2+(vy-p.gy)**2;
      if(score<bestScore){bestScore=score;best=p;}
    }
    return best.f;
  }
  function setPose(f){
    const url=urls.get(f);if(!url||active===f)return;
    active=f;image.src=url;image.dataset.pose=String(f);
  }
  hero.addEventListener('pointermove',e=>{
    if(!ready||e.pointerType==='touch')return;
    const r=hero.getBoundingClientRect();
    const x=Math.max(0,Math.min(1,(e.clientX-r.left)/r.width));
    const y=Math.max(0,Math.min(1,(e.clientY-r.top)/r.height));
    const f=nearest(x,y);
    if(raf)cancelAnimationFrame(raf);
    raf=requestAnimationFrame(()=>{
      raf=0;setPose(f);
      scene.style.setProperty('--scene-x',reduced.matches?'0px':((x-.5)*-1.5).toFixed(1)+'px');
      scene.style.setProperty('--scene-y',reduced.matches?'0px':((y-.5)*-1).toFixed(1)+'px');
    });
  },{passive:true});
  hero.addEventListener('pointerleave',()=>{
    setPose(5);scene.style.setProperty('--scene-x','0px');scene.style.setProperty('--scene-y','0px');
  },{passive:true});
  const loader=document.createElement('script');
  loader.src='https://cdnjs.cloudflare.com/ajax/libs/jszip/3.10.1/jszip.min.js';
  loader.onload=async()=>{
    try{
      const res=await fetch(archiveUrl,{cache:'force-cache'});if(!res.ok)throw Error('JPEG archive unavailable');
      const zip=await JSZip.loadAsync(await res.arrayBuffer());
      await Promise.all([...new Set(poses.map(p=>p.f))].map(async f=>{
        const file=zip.file('frame_'+String(f).padStart(6,'0')+'.jpg');
        if(file)urls.set(f,URL.createObjectURL(await file.async('blob')));
      }));
      if(!urls.has(5))throw Error('Neutral pose missing');
      ready=true;setPose(5);hero.classList.add('cinematic-poses-ready');
    }catch(err){console.error('Pose sequence load failed',err);hero.classList.add('cinematic-poses-failed');}
  };
  loader.onerror=()=>hero.classList.add('cinematic-poses-failed');
  document.head.appendChild(loader);
})();
