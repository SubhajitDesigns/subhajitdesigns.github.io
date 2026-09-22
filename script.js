/* =========================================================
   SUBHAJIT — LANDING SCENE
   ========================================================= */

(() => {
  const page = document.querySelector('#home');
  const scene = document.querySelector('.scene');

  if (!page || !scene) return;

  const sky = document.querySelector('#sky');
  const clouds = document.querySelector('#clouds');
  const world = document.querySelector('#world');
  const char = document.querySelector('#char');
  const charNF = document.querySelector('#charNF');
  const mountain = document.querySelector('#mountain');
  const heroCopy = document.querySelector('#heroCopy');
  const pointCard = document.querySelector('#pointCard');

  if (!sky || !world || !char || !mountain) return;

  let targetMouseX = 0;
  let targetMouseY = 0;

  let mouseX = 0;
  let mouseY = 0;

  let currentScroll = 0;

  const clamp = (v, min, max) =>
    Math.min(Math.max(v, min), max);

  const ease = (t) =>
    1 - Math.pow(1 - t, 3);

  function getScrollProgress() {
    const rect = page.getBoundingClientRect();

    const scrollable =
      Math.max(page.offsetHeight - window.innerHeight, 1);

    return clamp(
      -rect.top / scrollable,
      0,
      1
    );
  }

  /* ---------------------------------------------------------
     MOUSE PARALLAX
     --------------------------------------------------------- */

  window.addEventListener(
    'pointermove',
    (event) => {

      if (
        window.matchMedia('(pointer: coarse)').matches
      ) return;

      targetMouseX =
        event.clientX / window.innerWidth - 0.5;

      targetMouseY =
        event.clientY / window.innerHeight - 0.5;

    },
    { passive: true }
  );


  /* ---------------------------------------------------------
     ANIMATION LOOP
     --------------------------------------------------------- */

  function render() {

    const scrollProgress =
      getScrollProgress();

    currentScroll +=
      (scrollProgress - currentScroll) * 0.085;

    mouseX +=
      (targetMouseX - mouseX) * 0.08;

    mouseY +=
      (targetMouseY - mouseY) * 0.08;

    const p = ease(currentScroll);


    /* -------------------------------------------------------
       SKY
       ------------------------------------------------------- */

    sky.style.transform =
      `translate3d(
        ${mouseX * -10}px,
        ${mouseY * -7}px,
        0
      )
      scale(${1.02 + p * 0.22})`;


    /* -------------------------------------------------------
       CLOUDS
       ------------------------------------------------------- */

    if (clouds) {

      clouds.style.transform =
        `translate3d(
          ${mouseX * -16}px,
          ${mouseY * -9}px,
          0
        )`;

    }


    /* -------------------------------------------------------
       WORLD
       ------------------------------------------------------- */

    world.style.transform =
      `translate3d(
        ${mouseX * -22}px,
        ${mouseY * -14}px,
        0
      )`;


    /* -------------------------------------------------------
       MAIN FOREGROUND
       ------------------------------------------------------- */

    const charScale =
      1 + p * 1.65;

    const charFade =
      1 -
      clamp(
        (p - 0.30) / 0.32,
        0,
        1
      );

    char.style.opacity =
      charFade;

    char.style.transform =
      `translate3d(
        ${mouseX * 10}px,
        ${mouseY * 8 - p * 8}px,
        0
      )
      scale(${charScale})`;


    /* -------------------------------------------------------
       MOUNTAIN
       ------------------------------------------------------- */

    const mountainProgress =
      p;

    const mountainScale =
      0.82 +
      mountainProgress * 0.55;

    mountain.style.transform =
      `translate3d(
        calc(-50% + ${mouseX * 8}px),
        ${20 - mountainProgress * 10}px,
        0
      )
      scale(${mountainScale})`;


    /* -------------------------------------------------------
       SECOND CHARACTER
       ------------------------------------------------------- */

    if (charNF) {

      const nfProgress =
        clamp(
          (p - 0.42) / 0.38,
          0,
          1
        );

      const nfEase =
        ease(nfProgress);

      charNF.style.opacity =
        nfEase;

      charNF.style.transform =
        `translate3d(
          ${40 * nfEase + mouseX * 8}px,
          ${-10 * nfEase + mouseY * 5}px,
          0
        )
        scale(${0.82 + nfEase * 0.18})`;

    }


    /* -------------------------------------------------------
       HERO COPY
       ------------------------------------------------------- */

    if (heroCopy) {

      const copyProgress =
        clamp(
          (p - 0.48) / 0.30,
          0,
          1
        );

      const copyEase =
        ease(copyProgress);

      heroCopy.style.opacity =
        copyEase;

      heroCopy.style.transform =
        `translate3d(
          ${-70 + 70 * copyEase}px,
          0,
          0
        )`;

    }


    /* -------------------------------------------------------
       WORK CARD
       ------------------------------------------------------- */

    if (pointCard) {

      const cardProgress =
        clamp(
          (p - 0.58) / 0.25,
          0,
          1
        );

      const cardEase =
        ease(cardProgress);

      pointCard.style.transform =
        `translate3d(
          ${135 - 135 * cardEase}%,
          0,
          0
        )`;

    }


    /* -------------------------------------------------------
       STATE
       ------------------------------------------------------- */

    if (p > 0.48) {

      scene.classList.add('state-2');

    } else {

      scene.classList.remove('state-2');

    }


    requestAnimationFrame(render);

  }

  requestAnimationFrame(render);

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


/* =========================================================
   SUBHAJIT — REFERENCE STYLE LANDING SCENE
   Standalone adaptation of the reference landing architecture
   ========================================================= */

(() => {
  const page = document.querySelector('.page');
  const scene = document.querySelector('.scene');

  if (!page || !scene) return;

  const sky = document.querySelector('#sky');
  const clouds = document.querySelector('#clouds');
  const world = document.querySelector('#world');
  const char = document.querySelector('#char');
  const charNF = document.querySelector('#charNF');
  const mountain = document.querySelector('#mountain');
  const heroCopy = document.querySelector('#heroCopy');
  const pointCard = document.querySelector('#pointCard');

  if (!sky || !world || !char || !charNF || !mountain) {
    console.warn('Landing scene: required elements are missing.');
    return;
  }

  /* ---------------------------------------------------------
     STATE
     --------------------------------------------------------- */

  let targetScroll = 0;
  let currentScroll = 0;

  let targetMouseX = 0;
  let targetMouseY = 0;

  let mouseX = 0;
  let mouseY = 0;

  let ticking = false;

  /* ---------------------------------------------------------
     HELPERS
     --------------------------------------------------------- */

  const clamp = (value, min, max) =>
    Math.min(Math.max(value, min), max);

  const ease = (t) =>
    1 - Math.pow(1 - t, 3);

  /* ---------------------------------------------------------
     SCROLL PROGRESS
     --------------------------------------------------------- */

  function getScrollProgress() {
    const rect = page.getBoundingClientRect();

    const scrollable =
      Math.max(page.offsetHeight - window.innerHeight, 1);

    const travelled =
      clamp(-rect.top, 0, scrollable);

    return clamp(travelled / scrollable, 0, 1);
  }

  /* ---------------------------------------------------------
     MOUSE PARALLAX
     --------------------------------------------------------- */

  window.addEventListener(
    'pointermove',
    (event) => {
      if (window.matchMedia('(pointer: coarse)').matches) return;

      targetMouseX =
        (event.clientX / window.innerWidth - 0.5);

      targetMouseY =
        (event.clientY / window.innerHeight - 0.5);
    },
    { passive: true }
  );

  /* ---------------------------------------------------------
     RENDER
     --------------------------------------------------------- */

  function render() {
    ticking = false;

    const rawProgress = getScrollProgress();

    /*
      Smooth scroll interpolation
    */
    targetScroll = rawProgress;

    currentScroll +=
      (targetScroll - currentScroll) * 0.085;

    /*
      Smooth mouse interpolation
    */
    mouseX +=
      (targetMouseX - mouseX) * 0.08;

    mouseY +=
      (targetMouseY - mouseY) * 0.08;

    const p = ease(currentScroll);

    /* -------------------------------------------------------
       MOUSE PARALLAX
       ------------------------------------------------------- */

    const skyX = mouseX * -10;
    const skyY = mouseY * -7;

    const worldX = mouseX * -22;
    const worldY = mouseY * -14;

    const cloudX = mouseX * -16;
    const cloudY = mouseY * -9;

    sky.style.transform =
      `translate3d(${skyX}px, ${skyY}px, 0) scale(${1.02 + p * 0.22})`;

    if (clouds) {
      clouds.style.transform =
        `translate3d(${cloudX}px, ${cloudY}px, 0)`;
    }

    world.style.transform =
      `translate3d(${worldX}px, ${worldY}px, 0)`;

    /* -------------------------------------------------------
       INITIAL CHARACTER / FOREGROUND
       ------------------------------------------------------- */

    const charScale =
      1 + p * 1.65;

    const charX =
      mouseX * 10;

    const charY =
      mouseY * 8 - p * 8;

    char.style.transform =
      `translate3d(${charX}px, ${charY}px, 0) scale(${charScale})`;

    /* -------------------------------------------------------
       MOUNTAIN
       ------------------------------------------------------- */

    const mountainScale =
      0.82 + p * 0.55;

    const mountainX =
      mouseX * 8;

    const mountainY =
      20 - p * 10;

    mountain.style.transform =
      `translate3d(calc(-50% + ${mountainX}px), ${mountainY}px, 0) scale(${mountainScale})`;

    /* -------------------------------------------------------
       SECOND CHARACTER STATE
       ------------------------------------------------------- */

    const nfProgress =
      clamp((p - 0.42) / 0.38, 0, 1);

    const nfEase = ease(nfProgress);

    const nfX =
      40 * nfEase + mouseX * 8;

    const nfY =
      -10 * nfEase + mouseY * 5;

    const nfScale =
      0.82 + nfEase * 0.18;

    charNF.style.opacity =
      nfEase.toFixed(3);

    charNF.style.transform =
      `translate3d(${nfX}px, ${nfY}px, 0) scale(${nfScale})`;

    /* -------------------------------------------------------
       FIRST CHARACTER FADE
       ------------------------------------------------------- */

    const charFade =
      1 - clamp((p - 0.30) / 0.32, 0, 1);

    char.style.opacity =
      charFade.toFixed(3);

    /* -------------------------------------------------------
       HERO COPY
       ------------------------------------------------------- */

    const copyProgress =
      clamp((p - 0.48) / 0.30, 0, 1);

    const copyEase =
      ease(copyProgress);

    if (heroCopy) {
      heroCopy.style.opacity =
        copyEase.toFixed(3);

      heroCopy.style.transform =
        `translate3d(${-70 + 70 * copyEase}px, 0, 0)`;
    }

    /* -------------------------------------------------------
       WORK CARD
       ------------------------------------------------------- */

    const cardProgress =
      clamp((p - 0.58) / 0.25, 0, 1);

    const cardEase =
      ease(cardProgress);

    if (pointCard) {
      pointCard.style.transform =
        `translate3d(${135 - 135 * cardEase}%, 0, 0)`;
    }

    /* -------------------------------------------------------
       SCENE STATE
       ------------------------------------------------------- */

    if (p > 0.48) {
      scene.classList.add('state-2');
    } else {
      scene.classList.remove('state-2');
    }

    /* -------------------------------------------------------
       CONTINUE LOOP
       ------------------------------------------------------- */

    requestAnimationFrame(render);
  }

  /* ---------------------------------------------------------
     SCROLL
     --------------------------------------------------------- */

  window.addEventListener(
    'scroll',
    () => {
      if (!ticking) {
        ticking = true;
        requestAnimationFrame(render);
      }
    },
    { passive: true }
  );

  /* ---------------------------------------------------------
     RESIZE
     --------------------------------------------------------- */

  window.addEventListener(
    'resize',
    () => {
      targetScroll = getScrollProgress();
    },
    { passive: true }
  );

  /* ---------------------------------------------------------
     START
     --------------------------------------------------------- */

  targetScroll = getScrollProgress();
  currentScroll = targetScroll;

  requestAnimationFrame(render);

})();


/* =========================================================
   SUBHAJIT — CINEMATIC HERO ANIMATION
   ========================================================= */

(() => {
  const hero = document.querySelector(".cinematic-hero");

  if (!hero) return;

  const scene = document.querySelector(".cinematic-scene");
  const sky = document.querySelector(".cinematic-sky");
  const clouds = document.querySelector(".cinematic-clouds");
  const foreground = document.querySelector(".cinematic-foreground");
  const cutout = document.querySelector(".cinematic-cutout");
  const copy = document.querySelector(".cinematic-copy");
  const intro = document.querySelector(".cinematic-intro");

  if (!scene || !foreground) return;

  /* -------------------------------------------------------
     STATE
     ------------------------------------------------------- */

  const mouse = {
    x: 0,
    y: 0,
    targetX: 0,
    targetY: 0
  };

  const motion = {
    scroll: 0,
    smoothScroll: 0
  };

  /* -------------------------------------------------------
     MOUSE POSITION
     ------------------------------------------------------- */

  window.addEventListener("mousemove", (event) => {

    mouse.targetX =
      (event.clientX / window.innerWidth - 0.5);

    mouse.targetY =
      (event.clientY / window.innerHeight - 0.5);

  }, { passive: true });


  /* -------------------------------------------------------
     HELPERS
     ------------------------------------------------------- */

  const clamp = (value, min, max) => {
    return Math.max(min, Math.min(max, value));
  };

  const lerp = (a, b, amount) => {
    return a + (b - a) * amount;
  };


  /* -------------------------------------------------------
     SCROLL PROGRESS
     ------------------------------------------------------- */

  function updateScroll() {

    const rect = hero.getBoundingClientRect();

    const scrollDistance =
      hero.offsetHeight - window.innerHeight;

    if (scrollDistance <= 0) {
      motion.scroll = 0;
      return;
    }

    motion.scroll =
      clamp(
        -rect.top / scrollDistance,
        0,
        1
      );
  }


  window.addEventListener(
    "scroll",
    updateScroll,
    { passive: true }
  );

  updateScroll();


  /* -------------------------------------------------------
     ANIMATION LOOP
     ------------------------------------------------------- */

  function animate() {

    /* Smooth mouse */

    mouse.x = lerp(
      mouse.x,
      mouse.targetX,
      0.055
    );

    mouse.y = lerp(
      mouse.y,
      mouse.targetY,
      0.055
    );


    /* Smooth scroll */

    motion.smoothScroll = lerp(
      motion.smoothScroll,
      motion.scroll,
      0.075
    );

    const s = motion.smoothScroll;


    /* -----------------------------------------------------
       MOUSE PARALLAX
       ----------------------------------------------------- */

    const skyX = mouse.x * 16;
    const skyY = mouse.y * 10;

    const cloudX = mouse.x * 34;
    const cloudY = mouse.y * 18;

    const foregroundX = mouse.x * 22;
    const foregroundY = mouse.y * 14;


    /* -----------------------------------------------------
       SKY
       ----------------------------------------------------- */

    if (sky) {

      const skyScale =
        1.04 + (s * 0.10);

      sky.style.transform =
        `translate3d(${skyX}px, ${skyY}px, 0)
         scale(${skyScale})`;
    }


    /* -----------------------------------------------------
       CLOUDS
       ----------------------------------------------------- */

    if (clouds) {

      const cloudScroll =
        s * -70;

      clouds.style.transform =
        `translate3d(
          ${cloudX + cloudScroll}px,
          ${cloudY}px,
          0
        )`;
    }


    /* -----------------------------------------------------
       MAIN CHARACTER IMAGE
       ----------------------------------------------------- */

    /*
      At the beginning:
      Large cinematic close-up.

      While scrolling:
      Camera slowly pulls away and
      artwork moves slightly upward/right.
    */

    const foregroundScale =
  lerp(1.65, 0.57, s);

   const foregroundYScroll =
  lerp(0, 3, s);

    const foregroundXScroll =
  lerp(0, 0, s);

    const foregroundRotate =
  lerp(0, 0, s);

    foreground.style.transform =
      `translate3d(
        calc(-50% + ${foregroundX + foregroundXScroll}px),
        calc(-50% + ${foregroundY + foregroundYScroll}px),
        0
      )
      scale(${foregroundScale})
      rotate(${foregroundRotate}deg)`;


    /* -----------------------------------------------------
       SECOND CUTOUT
       ----------------------------------------------------- */

    if (cutout) {

      /*
        It stays hidden during the opening.

        Then slowly appears as the camera
        moves deeper into the page.
      */

      const cutoutProgress =
        clamp(
          (s - 0.34) / 0.38,
          0,
          1
        );

      const cutoutOpacity =
        cutoutProgress * 0.72;

      const cutoutScale =
        lerp(0.72, 0.94, cutoutProgress);

      const cutoutY =
        lerp(35, -5, cutoutProgress);

      cutout.style.opacity =
        cutoutOpacity;

      cutout.style.transform =
        `translate3d(
          calc(-50% + ${mouse.x * 12}px),
          calc(-50% + ${cutoutY + mouse.y * 8}px),
          0
        )
        scale(${cutoutScale})`;
    }


    /* -----------------------------------------------------
       INTRO INDICATOR
       ----------------------------------------------------- */

    if (intro) {

      const introOpacity =
        clamp(
          1 - (s / 0.18),
          0,
          1
        );

      intro.style.opacity =
        introOpacity;
    }


    /* -----------------------------------------------------
       TYPOGRAPHY REVEAL
       ----------------------------------------------------- */

    if (copy) {

      /*
        Text begins entering around 45%
        of the hero scroll.
      */

      const copyProgress =
        clamp(
          (s - 0.43) / 0.32,
          0,
          1
        );

      const copyX =
        lerp(-90, 0, copyProgress);

      const copyOpacity =
        clamp(
          copyProgress * 1.25,
          0,
          1
        );

      copy.style.opacity =
        copyOpacity;

      copy.style.transform =
        `translate3d(
          ${copyX}px,
          -50%,
          0
        )`;
    }


    /* -----------------------------------------------------
       FINAL CINEMATIC DEPTH
       ----------------------------------------------------- */

    const depth =
      clamp(
        (s - 0.65) / 0.35,
        0,
        1
      );

    scene.style.setProperty(
      "--cinematic-depth",
      depth.toFixed(3)
    );


    requestAnimationFrame(animate);
  }


  /* -------------------------------------------------------
     START
     ------------------------------------------------------- */

  requestAnimationFrame(animate);

})();
