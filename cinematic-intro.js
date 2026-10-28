/* Replays the full typographic intro on every full page load. */
(function(){
  const intro=document.getElementById('cinematicIntro');
  if(!intro) return;
  const count=document.getElementById('cinematicIntroCount');
  const reduced=window.matchMedia&&window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const duration=reduced?350:2600;
  const start=performance.now();
  intro.classList.add('is-running');
  function tick(now){
    const progress=Math.min(1,(now-start)/duration);
    if(count) count.textContent=String(Math.round(progress*100)).padStart(2,'0');
    if(progress<1&&intro.isConnected){requestAnimationFrame(tick);return;}
    if(!intro.isConnected)return;
    if(count)count.textContent='100';
    intro.classList.add('is-complete');
    // Let the oversized 100% become the transition, then uncover the portfolio.
    window.setTimeout(function(){
      if(!intro.isConnected)return;
      intro.classList.add('is-exiting');
      window.setTimeout(function(){if(intro.isConnected)intro.remove();},reduced?220:560);
    },reduced?80:930);
  }
  requestAnimationFrame(tick);
})();
