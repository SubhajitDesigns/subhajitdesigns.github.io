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


/* FINAL 3D CLIENT LOGO EFFECT */

const clientLogoStrip = document.querySelector('.client-logo-strip');
const clientLogoTrack = document.querySelector('.client-logo-track');

if (clientLogoStrip && clientLogoTrack) {

  function updateClientLogo3D() {

    const stripRect = clientLogoStrip.getBoundingClientRect();
    const centerX = stripRect.left + stripRect.width / 2;

    const logos = clientLogoTrack.querySelectorAll('.client-logo-item');

    logos.forEach((logo) => {

      const rect = logo.getBoundingClientRect();
      const logoCenter = rect.left + rect.width / 2;

      const distance = Math.abs(centerX - logoCenter);

      const maxDistance = stripRect.width * 0.55;

      let progress = distance / maxDistance;

      progress = Math.min(progress, 1);

      /* CENTER = BIG / SIDES = SMALL */
      const scale = 1.28 - (progress * 0.46);

      /* Subtle 3D perspective */
      const offset = logoCenter - centerX;
      const rotateY = Math.max(-10, Math.min(10, offset * 0.025));

      logo.style.transform =
        `scale(${scale}) rotateY(${rotateY}deg)`;

      logo.style.opacity =
        0.82 + ((1 - progress) * 0.18);
    });

    requestAnimationFrame(updateClientLogo3D);
  }

  updateClientLogo3D();
}
