(() => {
  const hero = document.querySelector('.interactive-hero');
  const art = document.querySelector('.hero-art');
  const portrait = document.querySelector('#portraitTarget');
  const portraitImg = portrait?.querySelector('img');
  const icons = [...document.querySelectorAll('#iconLayer .app-icon')];
  const cursor = document.querySelector('.cursor-dot');
  const magnetic = document.querySelector('.magnetic');

  let mouseX = innerWidth / 2, mouseY = innerHeight / 2;
  let sx = mouseX, sy = mouseY;
  let hovering = false;

  addEventListener('mousemove', e => {
    mouseX=e.clientX; mouseY=e.clientY;
    if(cursor){cursor.style.left=`${mouseX}px`;cursor.style.top=`${mouseY}px`;}
    if(hero){
      const r=hero.getBoundingClientRect();
      hero.style.setProperty('--mx',`${((mouseX-r.left)/r.width)*100}%`);
      hero.style.setProperty('--my',`${((mouseY-r.top)/r.height)*100}%`);
    }
  },{passive:true});

  function hoverOn(){
    if(hovering)return;
    hovering=true;
    hero?.classList.add('icon-retreat');
  }
  function hoverOff(){
    if(!hovering)return;
    hovering=false;
    hero?.classList.remove('icon-retreat');
  }

  portrait?.addEventListener('mouseenter',hoverOn);
  portrait?.addEventListener('mouseleave',hoverOff);
  portraitImg?.addEventListener('mouseenter',hoverOn);
  portraitImg?.addEventListener('mouseleave',hoverOff);

  function animate(){
    sx += (mouseX-sx)*.055;
    sy += (mouseY-sy)*.055;

    if(art && portrait && innerWidth>800){
      const ar=art.getBoundingClientRect();
      const px=Math.max(-1,Math.min(1,(sx-(ar.left+ar.width/2))/ar.width));
      const py=Math.max(-1,Math.min(1,(sy-(ar.top+ar.height/2))/ar.height));

      portrait.style.transform=`translate3d(${px*(hovering?2:7)}px,${py*(hovering?1.5:5)}px,0)`;

      icons.forEach((icon,i)=>{
        if(!hovering){
          const f=1+i*.04;
          icon.style.marginLeft=`${px*1.6*f}px`;
          icon.style.marginTop=`${py*1.6*f}px`;
        }else{
          icon.style.marginLeft='0px';
          icon.style.marginTop='0px';
        }
      });

      const grid=hero.querySelector('.hero-bg-grid');
      if(grid)grid.style.transform=`translate(${px*3}px,${py*3}px)`;
    }
    requestAnimationFrame(animate);
  }
  requestAnimationFrame(animate);

  if(magnetic){
    magnetic.addEventListener('mousemove',e=>{
      const r=magnetic.getBoundingClientRect();
      magnetic.style.transform=`translate(${(e.clientX-r.left-r.width/2)*.10}px,${(e.clientY-r.top-r.height/2)*.10}px)`;
    });
    magnetic.addEventListener('mouseleave',()=>magnetic.style.transform='');
  }
})();
