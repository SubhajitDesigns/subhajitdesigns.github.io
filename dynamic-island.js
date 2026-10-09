/* Dynamic Island-inspired portfolio navigation — compact horizontal header layout. */
(() => {
  const header=document.querySelector('.hero-nav');
  const musicPlayer=document.getElementById('siteMusicPlayer');
  const themeSwitch=document.querySelector('.hero-nav .switch');
  if(!header||!musicPlayer||document.getElementById('dynamicIslandRoot')) return;
  // Move the light/dark toggle inside the Dynamic Island instead of outside it.

  const root=document.createElement('div');
  root.id='dynamicIslandRoot';
  root.innerHTML=`
    <div class="di-card">
      <div class="di-top-row">
        <button class="di-toggle" id="dynamicIslandToggle" type="button" aria-expanded="false" aria-label="Open portfolio navigation">
          <span class="di-toggle-left">
            <span class="di-mark" aria-hidden="true">S.</span>
            <span class="di-wordmark">SUBHAJIT<span style="color:#ff493b">.</span></span>
          </span>
          <span class="di-toggle-right" aria-hidden="true"><span class="di-wave"><i></i><i></i><i></i><i></i><i></i></span><span class="di-chevron">⌄</span></span>
        </button>
        <nav class="di-nav" aria-label="Main navigation">
          <a href="#about">About</a>
          <a href="#what-i-do">What I Do</a>
          <a href="resume.html">Resume <span aria-hidden="true">↗</span></a>
          <a href="#work">Work</a>
          <a href="#clients">Clients</a>
          <button class="di-music-link" id="dynamicIslandMusicLink" type="button" aria-expanded="false"><span aria-hidden="true">♫</span> Music</button>
        </nav>
      </div>
      <div class="di-panel" id="dynamicIslandPanel">
        <div class="di-panel-inner">
          <div class="di-divider"></div>
          <div class="di-music-label"><span>PORTFOLIO SOUNDTRACK</span><span>NOW PLAYING</span></div>
          <div id="dynamicIslandMusicMount"></div>
        </div>
      </div>
    </div>`;
  document.body.appendChild(root);
  header.replaceChildren();
  root.querySelector('#dynamicIslandMusicMount').appendChild(musicPlayer);
  if(themeSwitch){themeSwitch.classList.add('di-theme-switch');root.querySelector('.di-top-row').appendChild(themeSwitch);}

  const toggle=root.querySelector('#dynamicIslandToggle');
  const musicLink=root.querySelector('#dynamicIslandMusicLink');
  const links=[...root.querySelectorAll('.di-nav a')];
  const coarse=window.matchMedia('(pointer: coarse)');
  let pinnedOpen=false;

  function setOpen(open,pin=false){
    if(pin) pinnedOpen=open;
    root.classList.toggle('di-open',Boolean(open));
    toggle.setAttribute('aria-expanded',String(Boolean(open)));
    toggle.setAttribute('aria-label',open?'Close portfolio navigation':'Open portfolio navigation');
    if(!open) setMusicOpen(false);
  }
  function setMusicOpen(open){
    root.classList.toggle('di-music-open',Boolean(open));
    musicLink.classList.toggle('is-active',Boolean(open));
    musicLink.setAttribute('aria-expanded',String(Boolean(open)));
    if(open){
      root.classList.add('di-open');
      toggle.setAttribute('aria-expanded','true');
    }
  }
  root.addEventListener('pointerenter',()=>{if(!coarse.matches) setOpen(true);});
  // Close as soon as the pointer leaves; CSS handles the short, smooth collapse.
  root.addEventListener('pointerleave',()=>{
    if(!pinnedOpen&&!coarse.matches) setOpen(false);
  });
  toggle.addEventListener('click',()=>{
    if(root.classList.contains('di-open')&&pinnedOpen) setOpen(false,true);
    else setOpen(true,true);
  });
  links.forEach(link=>link.addEventListener('click',()=>{
    links.forEach(item=>item.classList.toggle('is-active',item===link));
    setOpen(false,true);
  }));
  musicLink.addEventListener('click',()=>{
    const opening=!root.classList.contains('di-music-open');
    setOpen(true,true);
    setMusicOpen(opening);
  });
  document.addEventListener('pointerdown',event=>{
    if(!root.contains(event.target)&&((coarse.matches)||pinnedOpen)) setOpen(false,true);
  });
  document.addEventListener('keydown',event=>{
    if(event.key==='Escape'&&(root.classList.contains('di-open')||root.classList.contains('di-music-open'))){
      setOpen(false,true);toggle.focus({preventScroll:true});
    }
  });

  document.querySelectorAll('a[href^="#"]').forEach(anchor=>{
    anchor.addEventListener('click',event=>{
      const id=anchor.getAttribute('href');
      if(!id||id==='#') return;
      const target=document.querySelector(id);
      if(target){
        event.preventDefault();
        target.scrollIntoView({behavior:window.matchMedia('(prefers-reduced-motion: reduce)').matches?'auto':'smooth',block:'start'});
        history.replaceState(null,'',id);
      }
    });
  });
})();