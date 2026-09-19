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


/* =========================================
   CRAFTED — FINAL 2-FOLDER COLUMN SCROLL
========================================= */

(() => {
  const section = document.querySelector("#work");
  const viewport = document.querySelector("#work .crafted-viewport");
  const grid = document.querySelector("#work .crafted-grid");

  if (!section || !viewport || !grid) return;
 
  let currentX = 0;
  let targetX = 0;
  let animating = false;

  /* One horizontal column = 2 folders */
  const getStep = () => 325;

  const getMax = () => {
    return Math.max(
      0,
      grid.scrollWidth - viewport.clientWidth
    );
  };

  const animate = () => {
    currentX += (targetX - currentX) * 0.12;

    grid.style.transform =
      `translate3d(${-currentX}px, 0, 0)`;

    if (Math.abs(targetX - currentX) > 0.5) {
      animating = true;
      requestAnimationFrame(animate);
    } else {
      currentX = targetX;
      animating = false;
    }
  };

  const move = (direction) => {
    const max = getMax();

    targetX = Math.max(
      0,
      Math.min(
        max,
        targetX + (direction * getStep())
      )
    );

    if (!animating) {
      requestAnimationFrame(animate);
    }
  };

  const isCraftedActive = () => {
    const rect = section.getBoundingClientRect();

    return (
      rect.top <= 10 &&
      rect.bottom >= window.innerHeight - 10
    );
  };

  window.addEventListener(
    "wheel",
    (e) => {

      if (!isCraftedActive()) return;

      const max = getMax();

      if (max <= 0) return;

      if (e.deltaY > 0 && targetX < max) {
        e.preventDefault();
        move(1);
        return;
      }

      if (e.deltaY < 0 && targetX > 0) {
        e.preventDefault();
        move(-1);
      }

    },
    { passive: false }
  );

  window.addEventListener("resize", () => {

    const max = getMax();

    targetX = Math.min(targetX, max);
    currentX = Math.min(currentX, max);

    grid.style.transform =
      `translate3d(${-currentX}px, 0, 0)`;

  });

})();


/* =========================================================
   CRAFTED — one wheel notch = one column, edge to edge.
   Paste at the very bottom of script.js (replace the old
   "CRAFTED — vertical scroll drives..." block if present).
   No HTML changes needed — the sticky wrapper is built here.
   ========================================================= */

(function () {
  const section = document.querySelector('#work');
  if (!section) return;

  const viewport = section.querySelector('.crafted-viewport');
  const track    = section.querySelector('.crafted-grid');
  if (!viewport || !track) return;

  /* --- build the sticky stage around the existing markup --- */
  let pin = section.querySelector('.crafted-pin');
  if (!pin) {
    pin = document.createElement('div');
    pin.className = 'crafted-pin';
    while (section.firstChild) pin.appendChild(section.firstChild);
    section.appendChild(pin);
  }

  const MOBILE = () => window.matchMedia('(max-width: 760px)').matches;

  let colStep  = 0;   // px per column step (card width + gap)
  let maxIndex = 0;   // last valid column index
  let index    = 0;   // current column index
  let current  = 0;
  let target   = 0;
  const EASE   = 0.16;
  let cooldown = false;

  function measure() {
    if (MOBILE()) {
      section.style.height = '';
      track.style.transform = '';
      return;
    }

    const styles  = getComputedStyle(section);
    const rows    = parseInt(styles.getPropertyValue('--rows'))    || 1;
    const visible = parseInt(styles.getPropertyValue('--visible')) || 3;
    const gap     = parseFloat(styles.getPropertyValue('--col-gap')) || 0;

    /* size the columns so exactly --visible of them fill the
       viewport's full width — flush to both true edges */
    const availW = viewport.clientWidth;
    const colW   = (availW - (visible - 1) * gap) / visible;
    section.style.setProperty('--card-w', colW + 'px');
    colStep = colW + gap;

    const folders   = track.querySelectorAll('.crafted-folder').length;
    const totalCols = Math.ceil(folders / rows);
    maxIndex = Math.max(0, totalCols - visible);

    index   = Math.min(index, maxIndex);
    target  = -index * colStep;
    current = target;
    track.style.transform = 'translate3d(' + current + 'px,0,0)';

    /* just enough runway for the section to stay pinned while
       you're stepping through it */
    section.style.height = (window.innerHeight + 220) + 'px';
  }

  function frame() {
    if (!MOBILE()) {
      current += (target - current) * EASE;
      if (Math.abs(target - current) < 0.4) current = target;
      track.style.transform = 'translate3d(' + current.toFixed(2) + 'px,0,0)';
    }
    requestAnimationFrame(frame);
  }

  function inPinZone() {
    const r = section.getBoundingClientRect();
    return r.top <= 1 && r.bottom > window.innerHeight;
  }

  function onWheel(e) {
    if (MOBILE() || !inPinZone()) return;

    const goingDown = e.deltaY > 0;
    const atEnd   = goingDown && index >= maxIndex;
    const atStart = !goingDown && index <= 0;

    /* at either end, hand scrolling back to the normal page */
    if (atEnd || atStart) return;

    e.preventDefault();
    if (cooldown) return;

    index  += goingDown ? 1 : -1;
    index   = Math.max(0, Math.min(maxIndex, index));
    target  = -index * colStep;

    /* one physical scroll gesture = exactly one column step */
    cooldown = true;
    setTimeout(() => { cooldown = false; }, 550);
  }

  window.addEventListener('wheel', onWheel, { passive: false });
  window.addEventListener('resize', measure);
  window.addEventListener('load', measure);

  section.querySelectorAll('img').forEach(img => {
    if (!img.complete) img.addEventListener('load', measure, { once: true });
  });

  measure();
  requestAnimationFrame(frame);
})();
