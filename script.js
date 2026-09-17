const dot=document.querySelector('.cursor-dot');
const hero=document.querySelector('.interactive-hero');
const portrait=document.querySelector('.portrait-interactive');

window.addEventListener('mousemove',e=>{
  if(dot){dot.style.left=e.clientX+'px';dot.style.top=e.clientY+'px';}
  if(!hero || window.innerWidth<=800) return;
  const r=hero.getBoundingClientRect();
  if(e.clientX>=r.left && e.clientX<=r.right && e.clientY>=r.top && e.clientY<=r.bottom){
    const x=((e.clientX-r.left)/r.width)*100;
    const y=((e.clientY-r.top)/r.height)*100;
    hero.style.setProperty('--mx',x+'%');
    hero.style.setProperty('--my',y+'%');
    if(portrait){
      const pr=portrait.getBoundingClientRect();
      const px=((e.clientX-(pr.left+pr.width/2))/pr.width)*10;
      const py=((e.clientY-(pr.top+pr.height/2))/pr.height)*7;
      portrait.style.transform=`translate(${px}px,${py}px)`;
    }
  }
});

if(hero && portrait){
  hero.addEventListener('mouseleave',()=>{
    portrait.style.transform='translate(0,0)';
    hero.style.setProperty('--mx','50%');
    hero.style.setProperty('--my','50%');
  });
}

const reveals=document.querySelectorAll('.project,.process-grid > div,.about,.contact');
if('IntersectionObserver' in window){
  const io=new IntersectionObserver(entries=>{
    entries.forEach(entry=>{
      if(entry.isIntersecting){
        entry.target.style.opacity='1';
        entry.target.style.transform='translateY(0)';
        io.unobserve(entry.target);
      }
    });
  },{threshold:.08});
  reveals.forEach(el=>{
    el.style.opacity='0';
    el.style.transform='translateY(28px)';
    el.style.transition='opacity .8s ease, transform .8s ease';
    io.observe(el);
  });
}

const magnetic=document.querySelector('.magnetic');
if(magnetic){
  magnetic.addEventListener('mousemove',e=>{
    const r=magnetic.getBoundingClientRect();
    magnetic.style.transform=`translate(${(e.clientX-r.left-r.width/2)*.1}px,${(e.clientY-r.top-r.height/2)*.1}px)`;
  });
  magnetic.addEventListener('mouseleave',()=>magnetic.style.transform='');
}
