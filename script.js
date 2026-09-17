const dot=document.querySelector('.cursor-dot');
window.addEventListener('mousemove',e=>{if(dot){dot.style.left=e.clientX+'px';dot.style.top=e.clientY+'px'}});

const reveals=document.querySelectorAll('.project,.process-grid > div,.about,.contact');
if('IntersectionObserver' in window){const io=new IntersectionObserver(entries=>{entries.forEach(entry=>{if(entry.isIntersecting){entry.target.style.opacity='1';entry.target.style.transform='translateY(0)';io.unobserve(entry.target)}})},{threshold:.08});reveals.forEach(el=>{el.style.opacity='0';el.style.transform='translateY(28px)';el.style.transition='opacity .8s ease, transform .8s ease';io.observe(el)})}

(()=>{
  const hero=document.querySelector('.interactive-hero');
  const art=document.querySelector('.hero-art');
  const portrait=document.querySelector('.portrait-interactive');
  const type=document.querySelector('.hero-type-back');
  const orbit=document.querySelector('.app-icons');
  const icons=[...document.querySelectorAll('.app-icon')];
  if(!hero||!art||!portrait||!orbit||!icons.length)return;

  let last=performance.now();
  let angle=0;
  let hoveringPortrait=false;
  let pointerX=0, pointerY=0;

  /* One complete revolution is about 18 seconds. */
  const speed=.00035;

  function render(now){
    const dt=Math.min(32,now-last); last=now;
    if(!hoveringPortrait) angle += dt*speed;

    const ar=art.getBoundingClientRect();
    const mobile=window.innerWidth<=800;
    const px=(pointerX/ar.width-.5);
    const py=(pointerY/ar.height-.5);

    /* Elliptical atmosphere around the portrait */
    const rx=mobile ? Math.min(ar.width*.33,145) : Math.min(ar.width*.37,300);
    const ry=mobile ? Math.min(ar.height*.27,150) : Math.min(ar.height*.32,245);
    const depth=mobile ? 95 : 180;

    icons.forEach((icon,i)=>{
      const base=(parseFloat(icon.dataset.angle)||0)*Math.PI/180;
      const d=parseFloat(icon.dataset.depth||1);
      const a=base+angle*d;

      const sin=Math.sin(a);
      const cos=Math.cos(a);

      /* x/y are the orbital ellipse; z makes the icons actually move
         toward and away from the viewer. */
      const x=sin*rx + px*16;
      const y=-cos*ry + py*12;
      const z=cos*depth;

      const normalized=(z/depth+1)/2;
      const scale=.68 + normalized*.48;
      const tiltX=cos*13 + py*4;
      const tiltY=sin*16 + px*5;
      const behind=z < -8;

      /* Icons behind the portrait sit underneath it and become darker.
         They remain part of the orbit rather than simply disappearing. */
      let opacity=behind ? .18 : .98;
      let filter=behind
        ? 'brightness(.45) saturate(.65) blur(.3px)'
        : 'brightness(1) saturate(1)';

      if(hoveringPortrait){
        opacity=0;
        filter='brightness(.25) blur(3px)';
      }

      icon.style.transform=
        `translate3d(calc(-50% + ${x}px),calc(-50% + ${y}px),${z}px) `+
        `rotateX(${tiltX}deg) rotateY(${tiltY}deg) scale(${scale})`;
      icon.style.opacity=opacity;
      icon.style.filter=filter;
      icon.style.zIndex=behind?5:50;
    });

    if(!hoveringPortrait){
      if(type) type.style.transform=`translate3d(${px*-18}px,${py*-8}px,0)`;
      portrait.style.transform=`translate3d(${px*8}px,${py*-5}px,0)`;
    }

    requestAnimationFrame(render);
  }

  function pointerMove(e){
    const r=art.getBoundingClientRect();
    pointerX=e.clientX-r.left;
    pointerY=e.clientY-r.top;
  }

  function enterPortrait(){
    hoveringPortrait=true;
    hero.classList.add('portrait-hover');
    icons.forEach(icon=>{
      icon.style.opacity='0';
      icon.style.filter='brightness(.25) blur(3px)';
    });
  }

  function leavePortrait(){
    hoveringPortrait=false;
    hero.classList.remove('portrait-hover');
    icons.forEach(icon=>{
      icon.style.opacity='';
      icon.style.filter='';
    });
  }

  art.addEventListener('pointermove',pointerMove);
  portrait.addEventListener('pointerenter',enterPortrait);
  portrait.addEventListener('pointerleave',leavePortrait);
  requestAnimationFrame(render);
})();

const magnetic=document.querySelector('.magnetic');
if(magnetic){magnetic.addEventListener('mousemove',e=>{const r=magnetic.getBoundingClientRect();magnetic.style.transform=`translate(${(e.clientX-r.left-r.width/2)*.1}px,${(e.clientY-r.top-r.height/2)*.1}px)`});magnetic.addEventListener('mouseleave',()=>magnetic.style.transform='')}
