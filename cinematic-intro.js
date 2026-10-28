/* Replays the typographic preloader on every full page load. */
(function(){
  const intro=document.getElementById('cinematicIntro');
  if(!intro) return;
  const count=document.getElementById('cinematicIntroCount');
  const counter=document.getElementById('cinematicIntroCounter');
  const reduced=window.matchMedia&&window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const duration=reduced?300:2150;
  const start=performance.now();
  intro.classList.add('is-running');
  function tick(now){
    const p=Math.min(1,(now-start)/duration);
    if(count) count.textContent=String(Math.round(p*100)).padStart(2,'0');
    if(p<1&&intro.isConnected){requestAnimationFrame(tick);return;}
    if(!intro.isConnected)return;
    if(count)count.textContent='100';
    intro.classList.add('is-complete');
    window.setTimeout(function(){
      if(!intro.isConnected)return;
      intro.classList.add('is-exiting');
      window.setTimeout(function(){if(intro.isConnected)intro.remove();},reduced?30:780);
    },reduced?120:760);
  }
  requestAnimationFrame(tick);
})();
