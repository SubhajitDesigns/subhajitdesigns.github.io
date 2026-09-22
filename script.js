(() => {
  const hero = document.querySelector('.interactive-hero');
  const art = document.querySelector('.hero-art');
  const portrait = document.querySelector('#portraitTarget');
  const cursor = document.querySelector('.cursor-dot');
  const magnetic = document.querySelector('.magnetic');
  const navLinks = [...document.querySelectorAll('.hero-nav nav a, .hero-nav .nav-cta')];
  let mx = innerWidth/2, my = innerHeight/2, sx = mx, sy = my;

  addEventListener('mousemove', e => {
    mx=e.clientX; my=e.clientY;
    if(cursor){cursor.style.left=mx+'px';cursor.style.top=my+'px';}
    if(hero){const r=hero.getBoundingClientRect(); hero.style.setProperty('--mx',((mx-r.left)/r.width*100)+'%'); hero.style.setProperty('--my',((my-r.top)/r.height*100)+'%');}
  },{passive:true});

  portrait?.addEventListener('mouseenter',()=>hero?.classList.add('icon-retreat'));
  portrait?.addEventListener('mouseleave',()=>hero?.classList.remove('icon-retreat'));

  // Keep the depth effect predictable: the portrait owns the hover, icons stay behind it.
  portrait?.addEventListener('pointerenter',()=>hero?.classList.add('icon-retreat'));
  portrait?.addEventListener('pointerleave',()=>hero?.classList.remove('icon-retreat'));


  navLinks.forEach(link=>link.addEventListener('click',()=>{
    navLinks.forEach(x=>x.classList.remove('nav-active'));
    link.classList.add('nav-active');
    setTimeout(()=>link.classList.remove('nav-active'),600);
  }));

  function frame(){
    sx += (mx-sx)*.055; sy += (my-sy)*.055;
    if(art && portrait && innerWidth>800){
      const r=art.getBoundingClientRect();
      const px=Math.max(-1,Math.min(1,(sx-(r.left+r.width/2))/(r.width/2)));
      const py=Math.max(-1,Math.min(1,(sy-(r.top+r.height/2))/(r.height/2)));
      const retreat=hero?.classList.contains('icon-retreat');
      const move=retreat?2.2:10;
      portrait.style.transform=`translate3d(${px*move}px,${py*move*.7}px,0) rotateX(${py*(retreat?1.2:3.2)}deg) rotateY(${px*(retreat?-2:4.5)}deg)`;
      const grid=hero.querySelector('.hero-bg-grid');
      if(grid)grid.style.transform=`translate3d(${px*4}px,${py*3}px,0)`;
    }
    requestAnimationFrame(frame);
  }
  requestAnimationFrame(frame);

  const reelButton=document.querySelector('#showReel');
  const reelModal=document.querySelector('#reelModal');
  const reelClose=document.querySelector('#reelClose');
  const closeReel=()=>{ if(reelModal){ reelModal.classList.remove('is-open'); reelModal.setAttribute('aria-hidden','true'); } };
  reelButton?.addEventListener('click',()=>{ if(reelModal){ reelModal.classList.add('is-open'); reelModal.setAttribute('aria-hidden','false'); } });
  reelClose?.addEventListener('click',closeReel);
  reelModal?.addEventListener('click',e=>{ if(e.target===reelModal) closeReel(); });
  addEventListener('keydown',e=>{ if(e.key==='Escape') closeReel(); });

  if(magnetic){
    magnetic.addEventListener('mousemove',e=>{const r=magnetic.getBoundingClientRect(); magnetic.style.transform=`translate(${(e.clientX-r.left-r.width/2)*.1}px,${(e.clientY-r.top-r.height/2)*.1}px)`});
    magnetic.addEventListener('mouseleave',()=>magnetic.style.transform='');
  }
})();


/* V29 FINAL: subtle red cursor-following atmosphere */
(() => {
  const glow = document.querySelector('.cursor-glow');
  if (!glow || window.matchMedia('(pointer: coarse)').matches) return;

  let tx = window.innerWidth / 2, ty = window.innerHeight / 2;
  let x = tx, y = ty;
  let active = false;

  window.addEventListener('pointermove', (e) => {
    tx = e.clientX;
    ty = e.clientY;
    if (!active) {
      active = true;
      document.body.classList.add('cursor-active');
    }
  }, { passive: true });

  window.addEventListener('pointerleave', () => {
    active = false;
    document.body.classList.remove('cursor-active');
  });

  const tick = () => {
    x += (tx - x) * 0.10;
    y += (ty - y) * 0.10;
    glow.style.transform = `translate3d(${x}px, ${y}px, 0) translate3d(-50%, -50%, 0)`;
    requestAnimationFrame(tick);
  };
  requestAnimationFrame(tick);
})();


/* CLEAN CLIENT LOGO 3D EFFECT */

const clientTrack = document.querySelector('.client-logo-track');

if (clientTrack) {
  function updateClientLogos() {

    const logos = clientTrack.querySelectorAll('.client-logo-item img');
    const center = window.innerWidth / 2;

    logos.forEach((logo) => {

      const rect = logo.getBoundingClientRect();
      const logoCenter = rect.left + rect.width / 2;

      const distance = Math.abs(center - logoCenter);
      const range = window.innerWidth * 0.50;

      let amount = 1 - (distance / range);
      amount = Math.max(0, Math.min(1, amount));

      /* Very subtle size change */
      const scale = 1 + (amount * 0.16);

      logo.style.transform = `scale(${scale})`;
    });

    requestAnimationFrame(updateClientLogos);
  }

  updateClientLogos();
}


/* =========================================================
   SUBHAJIT CLIENTS — CLEAN CENTER FOCUS
   No stretch • No vertical movement • No tilt
   ========================================================= */

(function(){

  const carousel = document.querySelector('.client-carousel');
  const track = document.querySelector('.client-carousel-track');

  if(!carousel || !track) return;

  const cards = Array.from(
    track.querySelectorAll('.client-card')
  );


  function updateClientFocus(){

    const centerX = window.innerWidth / 2;


    cards.forEach(function(card){

      const rect = card.getBoundingClientRect();

      const cardCenter =
        rect.left + rect.width / 2;

      const distance =
        Math.abs(cardCenter - centerX);


      /*
       * Wide focus zone.
       * This keeps several logos visible.
       */

      const influence = Math.min(
        distance / (window.innerWidth * 0.58),
        1
      );


      const focus =
        Math.pow(1 - influence, 1.15);


      /*
       * UNIFORM SCALE ONLY.
       *
       * No separate X/Y scaling.
       * No stretching.
       */

      const scale =
        0.84 + (0.16 * focus);


      /*
       * Side logos remain visible.
       * Center logo becomes fully visible.
       */

      const opacity =
        0.38 + (0.62 * focus);


      /*
       * Very small amount of blur.
       *
       * Center = 0px
       * Far sides = 0.7px
       */

      const blur =
        0.7 * (1 - focus);


      card.style.setProperty(
        'transform',
        'scale(' + scale.toFixed(3) + ')',
        'important'
      );


      card.style.opacity =
        opacity.toFixed(3);


      card.style.filter =
        'blur(' + blur.toFixed(2) + 'px)';


      card.style.zIndex =
        String(
          Math.round(
            100 + focus * 100
          )
        );

    });


    requestAnimationFrame(
      updateClientFocus
    );

  }


  requestAnimationFrame(
    updateClientFocus
  );

})();


/* =========================================================
   SUBHAJIT — CRAFTED DESIGNS
   AUTO MARQUEE + 2-WHEEL HORIZONTAL CONTROL
   ========================================================= */

(() => {

  const section = document.querySelector("#work");
  const grid = section?.querySelector(".crafted-grid");

  if (!section || !grid) return;

  const originalFolders = Array.from(
    grid.querySelectorAll(".crafted-folder")
  );

  if (!originalFolders.length) return;

  /* ---------------------------------------------------------
     INFINITE LOOP
     --------------------------------------------------------- */

  originalFolders.forEach(folder => {
    grid.appendChild(folder.cloneNode(true));
  });

  let position = 0;
  let loopWidth = 0;

  let lastTime = performance.now();

  /* Normal slow movement */
  const AUTO_SPEED = 45;

  /* Horizontal movement per wheel */
  const WHEEL_STEP = 420;

  /* Only allow 2 wheel movements */
  const MAX_WHEEL_MOVES = 2;

  let wheelMoves = 0;

  let wheelAnimating = false;

  let wheelTarget = 0;

  let wasInsideCrafted = false;

  /* ---------------------------------------------------------
     LOOP WIDTH
     --------------------------------------------------------- */

  function calculateLoopWidth() {

    const firstOriginal = grid.children[0];
    const firstClone = grid.children[originalFolders.length];

    if (!firstOriginal || !firstClone) return;

    loopWidth =
      firstClone.getBoundingClientRect().left -
      firstOriginal.getBoundingClientRect().left;

  }

  /* ---------------------------------------------------------
     KEEP INFINITE LOOP
     --------------------------------------------------------- */

  function normalizePosition() {

    if (loopWidth <= 0) return;

    while (position >= loopWidth) {
      position -= loopWidth;
    }

    while (position < 0) {
      position += loopWidth;
    }

  }

  /* ---------------------------------------------------------
     RENDER
     --------------------------------------------------------- */

  function render() {

    grid.style.transform =
      `translate3d(${-position}px, 0, 0)`;

  }

  /* ---------------------------------------------------------
     AUTO MARQUEE
     --------------------------------------------------------- */

  function animate(time) {

    const deltaTime =
      Math.min((time - lastTime) / 1000, 0.05);

    lastTime = time;

    /*
      Automatic movement continues normally,
      except while a wheel movement is animating.
    */

    if (!wheelAnimating) {

      position += AUTO_SPEED * deltaTime;

      normalizePosition();

      render();

    }

    requestAnimationFrame(animate);

  }

  /* ---------------------------------------------------------
     CHECK WHETHER CRAFTED IS ACTIVE
     --------------------------------------------------------- */

  function isCraftedActive() {

    const rect =
      section.getBoundingClientRect();

    /*
      Crafted must be substantially inside
      the viewport before horizontal scrolling activates.
    */

    return (
      rect.top <= window.innerHeight * 0.25 &&
      rect.bottom >= window.innerHeight * 0.75
    );

  }

  /* ---------------------------------------------------------
     SMOOTH HORIZONTAL WHEEL MOVEMENT
     --------------------------------------------------------- */

  function animateWheelTo(target) {

    wheelAnimating = true;

    const start = position;

    let startTime = null;

    const duration = 650;

    function step(timestamp) {

      if (!startTime) {
        startTime = timestamp;
      }

      const progress =
        Math.min(
          (timestamp - startTime) / duration,
          1
        );

      /*
        Smooth ease-out
      */

      const eased =
        1 - Math.pow(1 - progress, 3);

      position =
        start + (target - start) * eased;

      normalizePosition();

      render();

      if (progress < 1) {

        requestAnimationFrame(step);

      } else {

        position = target;

        normalizePosition();

        render();

        wheelAnimating = false;

      }

    }

    requestAnimationFrame(step);

  }

  /* ---------------------------------------------------------
     MOUSE WHEEL
     --------------------------------------------------------- */

  window.addEventListener(
    "wheel",
    (event) => {

      if (!isCraftedActive()) {

        /*
          When we leave Crafted,
          reset the special wheel counter.
        */

        wheelMoves = 0;
        wasInsideCrafted = false;

        return;

      }

      wasInsideCrafted = true;

      /*
        DOWN = later folders
        UP = previous folders
      */

      const direction =
        event.deltaY > 0 ? 1 : -1;

      /*
        Only intercept the first two
        wheel movements.
      */

      if (wheelMoves < MAX_WHEEL_MOVES) {

        event.preventDefault();

        wheelMoves++;

        wheelTarget =
          position +
          direction * WHEEL_STEP;

        animateWheelTo(wheelTarget);

      }

      /*
        After two wheel movements:
        DO NOT preventDefault().
        The website resumes normal
        vertical scrolling.
      */

    },
    {
      passive: false
    }
  );

  /* ---------------------------------------------------------
     RESET WHEN CRAFTED IS LEFT
     --------------------------------------------------------- */

  window.addEventListener(
    "scroll",
    () => {

      if (!isCraftedActive()) {

        if (wasInsideCrafted) {

          wheelMoves = 0;
          wasInsideCrafted = false;

        }

      }

    }
  );

  /* ---------------------------------------------------------
     RESIZE
     --------------------------------------------------------- */

  window.addEventListener(
    "resize",
    () => {

      calculateLoopWidth();

      normalizePosition();

      render();

    }
  );

  /* ---------------------------------------------------------
     START
     --------------------------------------------------------- */

  calculateLoopWidth();

  render();

  requestAnimationFrame(animate);

})();


/* =========================================================
   CURRENTLY CREATING — 5 SECOND CREATIVE ROTATION
   ========================================================= */
(() => {
  const section = document.querySelector('.currently-creating');
  if (!section) return;

  const slides = [...section.querySelectorAll('.creating-slide')];
  const progress = section.querySelector('#creatingProgress');
  const title = section.querySelector('#creatingTitle');
  const category = section.querySelector('#creatingCategory');
  const next = section.querySelector('#creatingNext');
  if (!slides.length) return;

  const details = [
    { title: 'FONT FAILS', category: 'TYPOGRAPHY / ART DIRECTION' },
    { title: 'GOOD DESIGN?', category: 'EDITORIAL / CONCEPTUAL DESIGN' },
    { title: 'CAPCUT', category: 'VISUAL CAMPAIGN / CREATIVE DESIGN' },
    { title: 'IDEA OVERLOAD', category: 'EDITORIAL / PHOTO MANIPULATION' }
  ];

  const visual = section.querySelector('.creating-visual');
  const stage = section.querySelector('#creatingStage');
  const caption = section.querySelector('.creating-caption');

  function syncCaptionToImage() {
    if (!visual || !stage || !caption) return;
    const active = slides[index];
    const img = active?.querySelector('img');
    if (!img) return;
    const rect = img.getBoundingClientRect();
    const stageRect = stage.getBoundingClientRect();
    const width = Math.min(rect.width, stageRect.width);
    const left = Math.max(0, rect.left - stageRect.left);
    visual.style.setProperty('--creating-image-width', width + 'px');
    visual.style.setProperty('--creating-caption-left', left + 'px');
    // Collapse the stage to the actual artwork height so there is no giant empty area.
    if (rect.height > 0) stage.style.height = rect.height + 'px';
  }


  let index = 0;
  let timer = null;
  const DISPLAY_TIME = 5000;

  function restartProgress() {
    if (!progress) return;
    progress.classList.remove('is-running');
    void progress.offsetWidth;
    progress.classList.add('is-running');
  }

  function showSlide(nextIndex) {
    index = (nextIndex + slides.length) % slides.length;
    slides.forEach((slide, i) => slide.classList.toggle('is-active', i === index));
    if (title) title.textContent = details[index].title;
    if (category) category.textContent = details[index].category;
    restartProgress();
    requestAnimationFrame(syncCaptionToImage);
    clearTimeout(timer);
    timer = setTimeout(() => showSlide(index + 1), DISPLAY_TIME);
  }

  next?.addEventListener('click', () => showSlide(index + 1));

  // Always rotate automatically every 5 seconds.
  // Hovering no longer pauses the slideshow.
  document.addEventListener('visibilitychange', () => {
    clearTimeout(timer);
    if (document.hidden) {
      timer = null;
      progress?.classList.remove('is-running');
    } else {
      showSlide(index);
    }
  });

  slides.forEach(slide => {
    const img = slide.querySelector('img');
    img?.addEventListener('load', syncCaptionToImage);
  });
  window.addEventListener('resize', syncCaptionToImage);

  showSlide(0);
})();

/* =========================================================
   SUBHAJIT — SCROLL CINEMATIC LANDING
   Only controls #home.
   ========================================================= */
(() => {
  const scene=document.querySelector('.hero-scroll-scene');
  if(!scene) return;
  const sky=scene.querySelector('.scene-sky');
  const mountain=scene.querySelector('.scene-mountain');
  const subject=scene.querySelector('.scene-subhajit');
  const cloud1=scene.querySelector('.cloud-one');
  const cloud2=scene.querySelector('.cloud-two');
  const copy=scene.querySelector('.scene-copy');
  const flash=scene.querySelector('.scene-flash');

  let tx=0,ty=0,cx=0,cy=0,progress=0;
  const clamp=(v,a=0,b=1)=>Math.max(a,Math.min(b,v));
  const ease=t=>t*t*(3-2*t);
  const lerp=(a,b,t)=>a+(b-a)*t;

  addEventListener('pointermove',e=>{
    tx=(e.clientX/innerWidth-.5)*2;
    ty=(e.clientY/innerHeight-.5)*2;
  },{passive:true});

  function measure(){
    const r=scene.getBoundingClientRect();
    progress=clamp(-r.top/Math.max(1,r.height-innerHeight));
  }

  function frame(){
    cx+=(tx-cx)*.055; cy+=(ty-cy)*.055;
    const p=progress;
    const zoom=ease(clamp(p/.72));
    const reveal=ease(clamp((p-.50)/.22));
    const par=lerp(1,.16,zoom);

    sky.style.transform=`translate3d(${cx*14*par}px,${cy*9*par}px,0) scale(${lerp(1.06,1.12,zoom)})`;

    cloud1.style.transform=`translate3d(${cx*28*par-p*150}px,${cy*15*par-p*38}px,0) scale(${lerp(1,.94,zoom)})`;
    cloud1.style.opacity=String(lerp(.72,.35,p));

    cloud2.style.transform=`translate3d(${cx*-18*par+p*120}px,${cy*12*par-p*28}px,0) scale(${lerp(.72,.9,zoom)})`;
    cloud2.style.opacity=String(lerp(.42,.18,p));

    // Mountain starts as a large close-up and settles into the full scene.
    mountain.style.transform=`translate3d(${cx*9*par}px,${lerp(26,0,zoom)+cy*5*par}%,0) scale(${lerp(1.48,1,zoom)})`;

    // IMPORTANT: the subject stays centered. Previous version incorrectly started it at 50% without centering.
    subject.style.transform=`translate3d(${cx*18*par}px,${lerp(17,-2,zoom)+cy*9*par}%,0) scale(${lerp(1.34,.74,zoom)}) rotateY(${cx*1.7*par}deg) rotateX(${-cy*.9*par}deg)`;

    copy.style.opacity=String(reveal);
    copy.style.transform=`translate3d(${lerp(-32,0,reveal)}px,${lerp(28,0,reveal)}px,0)`;
    copy.style.pointerEvents=reveal>.9?'auto':'none';

    // Short white flash around the middle of the pull-back.
    const a=clamp((p-.40)/.035), b=clamp((p-.455)/.09);
    flash.style.opacity=String(Math.max(0,a-b));

    requestAnimationFrame(frame);
  }
  addEventListener('scroll',measure,{passive:true});
  addEventListener('resize',measure);
  measure();
  requestAnimationFrame(frame);
})();
