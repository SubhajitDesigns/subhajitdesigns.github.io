const dot=document.querySelector('.cursor-dot');
window.addEventListener('mousemove',e=>{if(dot){dot.style.left=e.clientX+'px';dot.style.top=e.clientY+'px'}});

const reveals=document.querySelectorAll('.project,.process-grid > div,.about,.contact');
if('IntersectionObserver' in window){const io=new IntersectionObserver(entries=>{entries.forEach(entry=>{if(entry.isIntersecting){entry.target.style.opacity='1';entry.target.style.transform='translateY(0)';io.unobserve(entry.target)}})},{threshold:.08});reveals.forEach(el=>{el.style.opacity='0';el.style.transform='translateY(28px)';el.style.transition='opacity .8s ease, transform .8s ease';io.observe(el)})}

/* V14 — reliable peek / hide interaction */
(()=>{
  const hero=document.querySelector('.interactive-hero');
  const art=document.querySelector('.hero-art');
  const portrait=document.querySelector('.portrait-interactive');
  if(!hero||!art||!portrait)return;
  portrait.addEventListener('pointerenter',()=>hero.classList.add('portrait-hover'));
  portrait.addEventListener('pointerleave',()=>hero.classList.remove('portrait-hover'));
})();

const magnetic=document.querySelector('.magnetic');
if(magnetic){magnetic.addEventListener('mousemove',e=>{const r=magnetic.getBoundingClientRect();magnetic.style.transform=`translate(${(e.clientX-r.left-r.width/2)*.1}px,${(e.clientY-r.top-r.height/2)*.1}px)`});magnetic.addEventListener('mouseleave',()=>magnetic.style.transform='')}
