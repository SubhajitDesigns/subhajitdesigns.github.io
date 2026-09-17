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

  /*
    V11 is intentionally NOT a full orbit.
    The icons behave like shy 3D objects hiding behind the portrait:
    two peek from behind the shoulders/head, while three sit closer to
    the viewer around the lower body/hand area. Each one makes a small
    looping bob so the scene still feels alive.
  */
  const layout=[
    {x:34,y:24,z:-80,rx:7,ry:12,rot:-8,back:true},
    {x:66,y:29,z:-65,rx:8,ry:14,rot:8,back:true},
    {x:13,y:57,z:120,rx:10,ry:12,rot:-9,back:false},
    {x:75,y:59,z:135,rx:8,ry:11,rot:10,back:false},
    {x:43,y:77,z:105,rx:7,ry:10,rot:-5,back:false}
  ];

  let hovering=false;
  let pointerX=0,pointerY=0;
  let start=performance.now();

  icons.forEach((icon,i)=>{
    const p=layout[i%layout.length];
    icon.classList.add(p.back?'peek-back':'peek-front');
  });

  function render(now){
    const t=(now-start)/1000;
    const r=art.getBoundingClientRect();
    const mx=(pointerX/r.width-.5);
    const my=(pointerY/r.height-.5);

    icons.forEach((icon,i)=>{
      const p=layout[i%layout.length];
      const bobX=Math.sin(t*(0.75+i*.07)+i)*p.rx;
      const bobY=Math.cos(t*(0.68+i*.09)+i*1.4)*p.ry;
      const sway=Math.sin(t*.42+i)*4;
      const x=((p.x/100)*r.width)+bobX+mx*8;
      const y=((p.y/100)*r.height)+bobY+my*7;
      const z=p.z + Math.sin(t*.55+i)*12;
      const scale=p.back ? .72 : 1.0;

      if(hovering){
        /* Visually dive into the portrait rather than simply switching off. */
        const cx=r.width*.49, cy=r.height*.49;
        icon.style.transform=`translate3d(${cx-x}px,${cy-y}px,-180px) rotateX(24deg) rotateY(-18deg) rotate(${p.rot}deg) scale(.12)`;
        icon.style.opacity='0';
        icon.style.filter='blur(5px) brightness(.35)';
      }else{
        icon.style.transform=`translate3d(calc(${x}px - 50%),calc(${y}px - 50%),${z}px) rotateX(${Math.sin(t+i)*4}deg) rotateY(${sway+p.rot}deg) scale(${scale})`;
        icon.style.opacity=p.back ? '.78' : '1';
        icon.style.filter=p.back ? 'brightness(.52) saturate(.75) blur(.35px)' : 'brightness(1) saturate(1)';
      }
    });

    if(!hovering){
      if(type) type.style.transform=`translate3d(${mx*-14}px,${my*-7}px,0)`;
      portrait.style.transform=`translate3d(${mx*6}px,${my*-4}px,0)`;
    }
    requestAnimationFrame(render);
  }

  function pointerMove(e){
    const r=art.getBoundingClientRect();
    pointerX=e.clientX-r.left;
    pointerY=e.clientY-r.top;
  }

  function enterPortrait(){
    hovering=true;
    hero.classList.add('portrait-hover');
  }

  function leavePortrait(){
    hovering=false;
    hero.classList.remove('portrait-hover');
  }

  art.addEventListener('pointermove',pointerMove);
  portrait.addEventListener('pointerenter',enterPortrait);
  portrait.addEventListener('pointerleave',leavePortrait);
  requestAnimationFrame(render);
})();

const magnetic=document.querySelector('.magnetic');
if(magnetic){magnetic.addEventListener('mousemove',e=>{const r=magnetic.getBoundingClientRect();magnetic.style.transform=`translate(${(e.clientX-r.left-r.width/2)*.1}px,${(e.clientY-r.top-r.height/2)*.1}px)`});magnetic.addEventListener('mouseleave',()=>magnetic.style.transform='')}
