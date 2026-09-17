const dot=document.querySelector('.cursor-dot');
window.addEventListener('mousemove',e=>{if(dot){dot.style.left=e.clientX+'px';dot.style.top=e.clientY+'px'}});

const reveals=document.querySelectorAll('.project,.process-grid > div,.about,.contact');
if('IntersectionObserver' in window){const io=new IntersectionObserver(entries=>{entries.forEach(entry=>{if(entry.isIntersecting){entry.target.style.opacity='1';entry.target.style.transform='translateY(0)';io.unobserve(entry.target)}})},{threshold:.08});reveals.forEach(el=>{el.style.opacity='0';el.style.transform='translateY(28px)';el.style.transition='opacity .8s ease, transform .8s ease';io.observe(el)})}

(()=>{
  const hero=document.querySelector('.interactive-hero');
  const art=document.querySelector('.hero-art');
  const portrait=document.querySelector('.portrait-interactive');
  const type=document.querySelector('.hero-type-back');
  const icons=[...document.querySelectorAll('.app-icon')];
  if(!hero||!art||!portrait||!icons.length)return;

  let raf=0;
  let hoveringPortrait=false;
  const orbitOffsets=[
    {x:-250,y:-20,r:-12,s:1},
    {x:-145,y:150,r:9,s:.98},
    {x:-55,y:-150,r:-8,s:1.02},
    {x:165,y:-150,r:10,s:1.04},
    {x:245,y:-5,r:-8,s:.98},
    {x:175,y:150,r:12,s:1.02}
  ];

  function render(e){
    cancelAnimationFrame(raf);
    raf=requestAnimationFrame(()=>{
      const ar=art.getBoundingClientRect();
      const x=(e.clientX-ar.left)/ar.width-.5;
      const y=(e.clientY-ar.top)/ar.height-.5;
      if(!hoveringPortrait){
        if(type)type.style.transform=`translate3d(${x*-16}px,calc(-50% + ${y*-7}px),0)`;
        portrait.style.transform=`translate3d(${x*12}px,${y*-7}px,0) scale(1.01)`;
        icons.forEach((icon,i)=>{
          const o=orbitOffsets[i]||{x:0,y:0,r:0,s:1};
          const d=Number(icon.dataset.depth||1);
          icon.style.transform=`translate3d(${x*18*d}px,${y*14*d}px,0) rotate(${o.r+x*5*d}deg) scale(${o.s})`;
        });
      }
    });
  }

  function enterPortrait(){
    hoveringPortrait=true;
    hero.classList.add('portrait-hover');
    portrait.style.transform='translate3d(0,0,0) scale(1.025)';
    if(type)type.style.opacity='.18';
    icons.forEach((icon,i)=>{
      const o=orbitOffsets[i]||{x:0,y:0,r:0};
      icon.style.transform=`translate3d(${o.x*.14}px,${o.y*.14}px,-40px) rotate(${o.r}deg) scale(.12)`;
      icon.style.opacity='0';
    });
  }

  function leavePortrait(){
    hoveringPortrait=false;
    hero.classList.remove('portrait-hover');
    if(type)type.style.opacity='';
    icons.forEach(icon=>icon.style.opacity='');
  }

  art.addEventListener('mousemove',render);
  portrait.addEventListener('mouseenter',enterPortrait);
  portrait.addEventListener('mouseleave',leavePortrait);
  art.addEventListener('mouseleave',()=>{if(!hoveringPortrait){portrait.style.transform='';if(type)type.style.transform='';icons.forEach(icon=>{icon.style.transform='';icon.style.opacity=''})}});
})();

const magnetic=document.querySelector('.magnetic');
if(magnetic){magnetic.addEventListener('mousemove',e=>{const r=magnetic.getBoundingClientRect();magnetic.style.transform=`translate(${(e.clientX-r.left-r.width/2)*.1}px,${(e.clientY-r.top-r.height/2)*.1}px)`});magnetic.addEventListener('mouseleave',()=>magnetic.style.transform='')}
