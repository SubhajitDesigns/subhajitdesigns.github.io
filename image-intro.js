/* CINEMATIC IMAGE INTRO — layered parallax + moving cloud */
(function(){
  const intro=document.getElementById('imageIntro');
  if(!intro) return;

  const base=intro.querySelector('.image-intro-base');
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
    const driftX=Math.sin(t*.23)*2.5;
    const driftY=Math.cos(t*.19)*1.8;

    if(!reduce){
      base.style.transform=`translate3d(${x*3+driftX}px,${y*2+driftY}px,0) scale(1.045)`;
      sky.style.transform=`translate3d(${x*5+driftX*.6}px,${y*3+driftY*.5}px,0) scale(1.055)`;
      chars.style.transform=`translate3d(${x*12+driftX*1.2}px,${y*8+driftY}px,0) scale(1.085)`;

      const cloudTravel=window.innerWidth+cloud.getBoundingClientRect().width+80;
      const cloudStart=-cloud.getBoundingClientRect().width-40;
      const cloudCycle=((elapsed*.028)% (cloudTravel-cloudStart))+cloudStart;
      cloud.style.transform=`translate3d(${cloudCycle}px, ${Math.sin(t*.55)*10+y*4}px,0)`;
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

  // Never trap the visitor if an asset fails to load.
  setTimeout(()=>{
    if(!leaving) leave();
  },6500);
})();
