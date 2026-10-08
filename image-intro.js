/* CINEMATIC IMAGE INTRO — corrected 16:9 parallax */
(function(){
  const intro=document.getElementById('imageIntro');
  if(!intro) return;

  const scene=intro.querySelector('.image-intro-scene');
  const sky=intro.querySelector('.image-intro-sky');
  const chars=intro.querySelector('.image-intro-characters');
  const cloud=intro.querySelector('.image-intro-cloud');
  const imgs=[...intro.querySelectorAll('img')];

  const reduce=window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const coarse=window.matchMedia('(pointer: coarse)').matches;

  let targetX=0,targetY=0,x=0,y=0;
  let start=performance.now();
  let leaving=false;
  const introDuration=4200;
  const leaveDuration=900;

  function pointerMove(e){
    if(coarse || leaving) return;
    targetX=(e.clientX/window.innerWidth-.5)*2;
    targetY=(e.clientY/window.innerHeight-.5)*2;
  }
  window.addEventListener('pointermove',pointerMove,{passive:true});

  function tick(now){
    const elapsed=now-start;
    x+=(targetX-x)*.055;
    y+=(targetY-y)*.055;

    const t=elapsed/1000;
    const driftX=Math.sin(t*.23)*1.6;
    const driftY=Math.cos(t*.19)*1.2;

    if(!reduce){
      sky.style.transform=`translate3d(${x*4+driftX}px,${y*2.5+driftY}px,0) scale(1.025)`;
      chars.style.transform=`translate3d(${x*10+driftX*1.5}px,${y*6+driftY}px,0) scale(1.035)`;

      // Slow, continuous right-to-left cloud travel.
      const sceneW=scene.clientWidth;
      const cloudW=cloud.getBoundingClientRect().width;
      const travel=sceneW+cloudW+40;
      const progress=(elapsed%22000)/22000;
      const cloudX=sceneW+20-(progress*travel);
      const cloudY=Math.sin(t*.42)*7+y*3;
      cloud.style.transform=`translate3d(${cloudX}px,${cloudY}px,0)`;
    }

    if(!leaving && elapsed>=introDuration) leave();
    requestAnimationFrame(tick);
  }

  function leave(){
    if(leaving) return;
    leaving=true;
    intro.classList.add('is-leaving');
    document.body.classList.remove('image-intro-lock');
    document.body.classList.add('image-intro-ready');
    setTimeout(()=>{
      intro.remove();
      window.dispatchEvent(new Event('imageIntroFinished'));
    },leaveDuration);
  }

  function revealWhenReady(){
    if(reduce){
      setTimeout(leave,2200);
      return;
    }
    requestAnimationFrame(tick);
  }

  let loaded=0;
  const done=()=>{
    loaded++;
    if(loaded===imgs.length) revealWhenReady();
  };

  imgs.forEach(img=>{
    if(img.complete && img.naturalWidth) done();
    else{
      img.addEventListener('load',done,{once:true});
      img.addEventListener('error',done,{once:true});
    }
  });

  setTimeout(()=>{
    if(!leaving) leave();
  },6500);
})();