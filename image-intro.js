/* CINEMATIC IMAGE INTRO — exact reference base + cinematic camera + moving cloud */
(function(){
  const intro=document.getElementById('imageIntro');
  if(!intro)return;
  const scene=intro.querySelector('.image-intro-scene');
  const base=intro.querySelector('.image-intro-base');
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
      const driftX=Math.sin(t*.18)*1.1;
      const driftY=Math.cos(t*.16)*.8;
      base.style.transform=`translate3d(${x*3+driftX}px,${y*2+driftY}px,0) scale(1.025)`;

      const sceneW=scene.clientWidth;
      const cloudW=cloud.getBoundingClientRect().width;
      const travel=sceneW+cloudW+40;
      const progress=(elapsed%22000)/22000;
      const cloudX=sceneW+20-progress*travel;
      cloud.style.transform=`translate3d(${cloudX}px,${Math.sin(t*.4)*4+y*1.5}px,0)`;
    }

    if(!leaving&&elapsed>=introDuration)leave();
    requestAnimationFrame(tick);
  }

  function leave(){
    if(leaving)return;
    leaving=true;
    intro.classList.add('is-leaving');
    document.body.classList.remove('image-intro-lock');
    document.body.classList.add('image-intro-ready');
    setTimeout(()=>intro.remove(),leaveDuration);
  }

  function ready(){reduce?setTimeout(leave,2200):requestAnimationFrame(tick)}
  let loaded=0;
  const done=()=>{if(++loaded===imgs.length)ready()};
  imgs.forEach(img=>{
    if(img.complete&&img.naturalWidth)done();
    else{
      img.addEventListener('load',done,{once:true});
      img.addEventListener('error',done,{once:true});
    }
  });
  setTimeout(()=>{if(!leaving)leave()},6500);
})();