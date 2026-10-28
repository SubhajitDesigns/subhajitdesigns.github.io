/* White portfolio preloader. Runs on every full page load and never blocks the page indefinitely. */
(function(){
  const intro=document.getElementById('cinematicIntro');
  if(!intro) return;
  const count=document.getElementById('cinematicIntroCount');
  const reduced=window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  intro.classList.add('is-running');
  const duration=reduced?250:1900;
  const start=performance.now();
  function tick(now){
    const p=Math.min(1,(now-start)/duration);
    if(count) count.textContent=String(Math.round(p*100)).padStart(2,'0');
    if(p<1 && intro.isConnected) requestAnimationFrame(tick);
  }
  requestAnimationFrame(tick);
  const exitDelay=reduced?350:2050;
  window.setTimeout(function(){
    if(!intro.isConnected) return;
    intro.classList.add('is-exiting');
    window.setTimeout(function(){if(intro.isConnected) intro.remove();},reduced?50:700);
  },exitDelay);
})();
