/* Replays the loading pill -> Welcome -> expanding-screen reveal on each full page load. */
(function(){
  const intro=document.getElementById('cinematicIntro');
  if(!intro)return;
  const count=document.getElementById('cinematicIntroCount');
  const progressBar=document.getElementById('cinematicIntroProgress');
  const reduced=window.matchMedia&&window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const duration=reduced?350:2800;
  const start=performance.now();
  intro.classList.add('is-running');
  function tick(now){
    const p=Math.min(1,(now-start)/duration);
    if(count)count.textContent=String(Math.round(p*100)).padStart(2,'0');
    if(p<1&&intro.isConnected){requestAnimationFrame(tick);return}
    if(!intro.isConnected)return;
    if(count)count.textContent='100';
    intro.classList.add('is-complete');
    window.setTimeout(function(){
      if(!intro.isConnected)return;
      intro.classList.add('is-expanding');
      window.setTimeout(function(){
        if(!intro.isConnected)return;
        intro.classList.add('is-exiting');
        window.setTimeout(function(){if(intro.isConnected)intro.remove()},reduced?220:720);
      },reduced?220:900);
    },reduced?100:850);
  }
  requestAnimationFrame(tick);
})();
