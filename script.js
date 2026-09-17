const dot=document.querySelector('.cursor-dot');
window.addEventListener('mousemove',e=>{if(dot){dot.style.left=e.clientX+'px';dot.style.top=e.clientY+'px'}});

const reveals=document.querySelectorAll('.project,.process-grid > div,.about,.contact');
if('IntersectionObserver' in window){const io=new IntersectionObserver(entries=>{entries.forEach(entry=>{if(entry.isIntersecting){entry.target.style.opacity='1';entry.target.style.transform='translateY(0)';io.unobserve(entry.target)}})},{threshold:.08});reveals.forEach(el=>{el.style.opacity='0';el.style.transform='translateY(28px)';el.style.transition='opacity .8s ease, transform .8s ease';io.observe(el)})}

/* V12 — shy 3D tools: peek from behind the portrait, then dive inward on hover. */
(()=>{
  const hero=document.querySelector('.interactive-hero');
  const art=document.querySelector('.hero-art');
  const portrait=document.querySelector('.portrait-interactive');
  const icons=[...document.querySelectorAll('.app-icon')];
  if(!hero||!art||!portrait||!icons.length)return;

  // x/y are percentages of the portrait area. z controls depth.
  // Back icons sit behind the shoulders/head; front icons sit over the lower body.
  const spots=[
    {x:31,y:28,z:-110,scale:.78,rot:-12,back:true,phase:0.2},
    {x:69,y:28,z:-90, scale:.82,rot:10, back:true,phase:1.5},
    {x:22,y:69,z:120, scale:.86,rot:-10,back:false,phase:2.7},
    {x:73,y:70,z:130, scale:.90,rot:9,  back:false,phase:4.0},
    {x:57,y:82,z:145, scale:.84,rot:-6, back:false,phase:5.1}
  ];

  let hover=false, px=0, py=0, start=performance.now();
  icons.forEach((icon,i)=>{
    icon.classList.toggle('peek-back',spots[i].back);
    icon.classList.toggle('peek-front',!spots[i].back);
  });

  function frame(now){
    const t=(now-start)/1000;
    const r=art.getBoundingClientRect();
    const cx=r.width*.50, cy=r.height*.49;
    const mouseX=(px/r.width-.5), mouseY=(py/r.height-.5);

    icons.forEach((icon,i)=>{
      const p=spots[i%spots.length];
      const bx=Math.sin(t*.72+p.phase)*7;
      const by=Math.cos(t*.62+p.phase)*5;
      const x=r.width*p.x/100 + bx + mouseX*10;
      const y=r.height*p.y/100 + by + mouseY*7;
      const z=p.z + Math.sin(t*.45+p.phase)*14;

      if(hover){
        // Pull the object toward the portrait center and sink it behind the body.
        const dx=cx-x, dy=cy-y;
        icon.style.zIndex='5';
        icon.style.transform=`translate3d(calc(${x}px - 50% + ${dx*.72}px),calc(${y}px - 50% + ${dy*.72}px),-260px) rotate(${p.rot*1.4}deg) scale(.16)`;
        icon.style.opacity='.04';
        icon.style.filter='blur(7px) brightness(.28)';
      }else{
        icon.style.zIndex=p.back?'8':'45';
        icon.style.transform=`translate3d(calc(${x}px - 50%),calc(${y}px - 50%),${z}px) rotateZ(${p.rot+Math.sin(t*.5+p.phase)*3}deg) rotateX(${Math.sin(t*.7+p.phase)*5}deg) rotateY(${Math.cos(t*.6+p.phase)*7}deg) scale(${p.scale})`;
        icon.style.opacity=p.back?'.90':'1';
        icon.style.filter=p.back?'brightness(.72) saturate(.88) drop-shadow(0 12px 18px rgba(0,0,0,.42))':'drop-shadow(0 18px 22px rgba(0,0,0,.52))';
      }
    });

    if(!hover) portrait.style.transform=`translate3d(${mouseX*5}px,${mouseY*-3}px,0)`;
    requestAnimationFrame(frame);
  }

  art.addEventListener('pointermove',e=>{const r=art.getBoundingClientRect();px=e.clientX-r.left;py=e.clientY-r.top});
  portrait.addEventListener('pointerenter',()=>{hover=true;hero.classList.add('portrait-hover')});
  portrait.addEventListener('pointerleave',()=>{hover=false;hero.classList.remove('portrait-hover')});
  requestAnimationFrame(frame);
})();

const magnetic=document.querySelector('.magnetic');
if(magnetic){magnetic.addEventListener('mousemove',e=>{const r=magnetic.getBoundingClientRect();magnetic.style.transform=`translate(${(e.clientX-r.left-r.width/2)*.1}px,${(e.clientY-r.top-r.height/2)*.1}px)`});magnetic.addEventListener('mouseleave',()=>magnetic.style.transform='')}
