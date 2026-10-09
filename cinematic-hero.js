/* Cursor-to-pose mapping calibrated against the actual 101-frame contact sheet. */
(() => {
  const hero=document.querySelector('.cinematic-hero');
  const scene=document.getElementById('cinematicScene');
  const image=document.getElementById('cinematicPoseImage');
  if(!hero||!scene||!image)return;
  const archiveUrl='https://d2ol7oe51mr4n9.cloudfront.net/user_3J5wMb6jrWj1Y3i6X8tSPeXaSPn/83ddd944-5873-41ae-8efe-e7e6d8adb08f.zip';
  // Actual sequence regions: 14-23 turn sideways, 24-48 look up/right,
  // 49-62 look down, 63-78 turn to the opposite side, 79-90 look up,
  // 91-100 look down/front. Cursor coordinates are normalized to the whole hero.
  const poses=[
    {f:0,  x:.50,y:.50,label:'front'},
    {f:18, x:.98,y:.50,label:'right'},
    {f:28, x:.98,y:.78,label:'right-down'},
    {f:39, x:.90,y:.08,label:'upper-right'},
    {f:46, x:.70,y:.06,label:'up-right'},
    {f:86, x:.50,y:.03,label:'up'},
    {f:67, x:.02,y:.50,label:'left'},
    {f:72, x:.02,y:.78,label:'left-down'},
    {f:77, x:.04,y:.18,label:'upper-left'},
    {f:55, x:.50,y:.98,label:'down'},
    {f:60, x:.82,y:.98,label:'down-right'},
    {f:96, x:.18,y:.98,label:'down-left'},
    {f:84, x:.50,y:.25,label:'upper-middle'}
  ];
  const urls=new Map();let ready=false,active=-1,raf=0;
  const reduced=matchMedia('(prefers-reduced-motion: reduce)');
  function nearest(x,y){
    let best=poses[0],scoreBest=Infinity;
    for(const p of poses){
      const dx=(x-p.x),dy=(y-p.y)*1.05;
      const score=dx*dx+dy*dy;
      if(score<scoreBest){scoreBest=score;best=p;}
    }
    return best;
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
    const p=nearest(x,y);
    if(raf)cancelAnimationFrame(raf);
    raf=requestAnimationFrame(()=>{
      raf=0;setPose(p.f);
      scene.style.setProperty('--scene-x',reduced.matches?'0px':((x-.5)*-2).toFixed(1)+'px');
      scene.style.setProperty('--scene-y',reduced.matches?'0px':((y-.5)*-1.5).toFixed(1)+'px');
    });
  },{passive:true});
  hero.addEventListener('pointerleave',()=>{
    setPose(0);scene.style.setProperty('--scene-x','0px');scene.style.setProperty('--scene-y','0px');
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
      if(!urls.has(0))throw Error('Front pose missing');
      ready=true;setPose(0);hero.classList.add('cinematic-poses-ready');
    }catch(err){console.error('Pose sequence load failed',err);hero.classList.add('cinematic-poses-failed');}
  };
  loader.onerror=()=>hero.classList.add('cinematic-poses-failed');
  document.head.appendChild(loader);
})();
