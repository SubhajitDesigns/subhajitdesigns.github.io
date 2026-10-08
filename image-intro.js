/* CINEMATIC IMAGE INTRO — reference-matched framing */
(function(){
  const intro=document.getElementById('imageIntro');
  if(!intro)return;
  const scene=intro.querySelector('.image-intro-scene');
  const sky=intro.querySelector('.image-intro-sky');
  const chars=intro.querySelector('.image-intro-characters');
  const cloud=intro.querySelector('.image-intro-cloud');
  const imgs=[...intro.querySelectorAll('img')];
  const reduce=window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const coarse=window.matchMedia('(pointer: coarse)').matches;
  let targetX=0,targetY=0,x=0,y=0,start=performance.now(),leaving=false;
  const introDuration=4200,leaveDuration=900;

  function pointerMove(e){
    if(coarse||leaving)return;
    targetX=(e.clientX/window.innerWidth-.5)*2;
    targetY=(e.clientY/window.innerHeight-.5)*2;
  }
  window.addEventListener('pointermove',pointerMove,{passive:true});

  function tick(now){
    const elapsed=now-start,t=elapsed/1000;
    x+=(targetX-x)*.045;y+=(targetY-y)*.045;
    if(!reduce){
      const driftX=Math.sin(t*.20)*1.2,driftY=Math.cos(t*.17)*.9;
      sky.style.transform=`translate3d(${x*2.2+driftX}px,${y*1.5+driftY}px,0) scale(1.018)`;
      chars.style.transform=`translate3d(${x*5.5+driftX}px,${y*3.5+driftY}px,0) scale(1.018)`;
      const sceneW=scene.clientWidth,cloudW=cloud.getBoundingClientRect().width;
      const travel=sceneW+cloudW+40,progress=(elapsed%22000)/22000;
      const cloudX=sceneW+20-progress*travel;
      cloud.style.transform=`translate3d(${cloudX}px,${Math.sin(t*.42)*5+y*1.5}px,0)`;
    }
    if(!leaving&&elapsed>=introDuration)leave();
    requestAnimationFrame(tick);
  }
  function leave(){
    if(leaving)return;
    leaving=true;intro.classList.add('is-leaving');
    document.body.classList.remove('image-intro-lock');
    document.body.classList.add('image-intro-ready');
    setTimeout(()=>intro.remove(),leaveDuration);
  }
  function ready(){reduce?setTimeout(leave,2200):requestAnimationFrame(tick)}
  let loaded=0;
  const done=()=>{if(++loaded===imgs.length)ready()};
  imgs.forEach(img=>{
    if(img.complete&&img.naturalWidth)done();
    else{img.addEventListener('load',done,{once:true});img.addEventListener('error',done,{once:true})}
  });
  setTimeout(()=>{if(!leaving)leave()},6500);
})();