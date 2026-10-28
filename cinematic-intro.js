/* First-visit cinematic intro. No dependencies; leaves existing site scripts untouched. */
(function(){
  const intro=document.getElementById('cinematicIntro');
  if(!intro) return;
  const count=document.getElementById('cinematicIntroCount');
  const progress=document.getElementById('cinematicIntroProgress');
  const reduced=window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  let seen=false;
  try{seen=sessionStorage.getItem('subhajit-cinematic-intro-seen')==='1';}catch(e){}
  if(seen || reduced){
    intro.remove();
    return;
  }
  document.documentElement.classList.add('cinematic-intro-active');
  intro.classList.add('is-running');
  const start=performance.now();
  const duration=2350;
  function tick(now){
    const p=Math.min(1,(now-start)/duration);
    if(count) count.textContent=String(Math.round(p*100)).padStart(2,'0');
    if(p<1 && intro.isConnected) requestAnimationFrame(tick);
  }
  requestAnimationFrame(tick);
  window.setTimeout(function(){
    intro.classList.add('is-exiting');
    try{sessionStorage.setItem('subhajit-cinematic-intro-seen','1');}catch(e){}
    window.setTimeout(function(){
      intro.remove();
      document.documentElement.classList.remove('cinematic-intro-active');
    },950);
  },2550);
})();