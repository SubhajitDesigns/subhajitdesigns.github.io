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
