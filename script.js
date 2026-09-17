(() => {
  const hero = document.querySelector('.interactive-hero');
  const art = document.querySelector('.hero-art');
  const portrait = document.querySelector('#portraitTarget');
  const portraitImg = portrait?.querySelector('img');
  const icons = [...document.querySelectorAll('#iconLayer .app-icon')];
  const cursor = document.querySelector('.cursor-dot');
  const magnetic = document.querySelector('.magnetic');

  let mouseX = innerWidth / 2;
  let mouseY = innerHeight / 2;
  let smoothX = mouseX;
  let smoothY = mouseY;
  let hovering = false;

  window.addEventListener('mousemove', e => {
    mouseX = e.clientX;
    mouseY = e.clientY;

    if (cursor) {
      cursor.style.left = `${mouseX}px`;
      cursor.style.top = `${mouseY}px`;
    }

    if (hero) {
      const r = hero.getBoundingClientRect();
      hero.style.setProperty('--mx', `${((mouseX-r.left)/r.width)*100}%`);
      hero.style.setProperty('--my', `${((mouseY-r.top)/r.height)*100}%`);
    }
  }, {passive:true});

  function setHover(value){
    hovering = value;
    if (hero) hero.classList.toggle('icon-retreat', value);
  }

  /* Use both wrapper and image so the effect cannot fail because of image hit area. */
  portrait?.addEventListener('mouseenter', () => setHover(true));
  portrait?.addEventListener('mouseleave', () => setHover(false));
  portraitImg?.addEventListener('mouseenter', () => setHover(true));
  portraitImg?.addEventListener('mouseleave', () => setHover(false));

  function animate(){
    smoothX += (mouseX - smoothX) * .055;
    smoothY += (mouseY - smoothY) * .055;

    if (art && portrait && innerWidth > 800) {
      const a = art.getBoundingClientRect();
      const px = Math.max(-1, Math.min(1, (smoothX-(a.left+a.width/2))/a.width));
      const py = Math.max(-1, Math.min(1, (smoothY-(a.top+a.height/2))/a.height));

      portrait.style.transform =
        `translate3d(${px*(hovering?2.5:7)}px,${py*(hovering?2:5)}px,0)`;

      icons.forEach((icon, i) => {
        if (!hovering) {
          const factor = 1 + i*.05;
          icon.style.marginLeft = `${px*2*factor}px`;
          icon.style.marginTop = `${py*2*factor}px`;
        } else {
          icon.style.marginLeft = '0px';
          icon.style.marginTop = '0px';
        }
      });

      const grid = hero.querySelector('.hero-bg-grid');
      if (grid) grid.style.transform = `translate(${px*4}px,${py*4}px)`;
    }

    requestAnimationFrame(animate);
  }
  requestAnimationFrame(animate);

  if (magnetic) {
    magnetic.addEventListener('mousemove', e => {
      const r = magnetic.getBoundingClientRect();
      const x = (e.clientX-r.left-r.width/2)*.12;
      const y = (e.clientY-r.top-r.height/2)*.12;
      magnetic.style.transform = `translate(${x}px,${y}px)`;
    });
    magnetic.addEventListener('mouseleave', () => magnetic.style.transform = '');
  }

  /* Scroll reveal — only content sections, never the hero. */
  const reveal = document.querySelectorAll('.project,.process-grid > div,.about,.contact');
  if ('IntersectionObserver' in window) {
    const io = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        entry.target.style.opacity = '1';
        entry.target.style.transform = 'translateY(0)';
        io.unobserve(entry.target);
      });
    }, {threshold:.08});

    reveal.forEach(el => {
      el.style.opacity = '0';
      el.style.transform = 'translateY(28px)';
      el.style.transition = 'opacity .8s ease,transform .8s ease';
      io.observe(el);
    });
  }
})();


/* V19 micro-interaction: a very small portrait tilt follows the pointer. */
(() => {
  const p = document.querySelector('#portraitTarget');
  const h = document.querySelector('.interactive-hero');
  if (!p || !h || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  let rx = 0, ry = 0, tx = 0, ty = 0;
  window.addEventListener('mousemove', e => {
    if (window.innerWidth <= 800) return;
    const r = p.getBoundingClientRect();
    const x = Math.max(-1, Math.min(1, (e.clientX - (r.left+r.width/2))/(r.width/2)));
    const y = Math.max(-1, Math.min(1, (e.clientY - (r.top+r.height/2))/(r.height/2)));
    tx = x * 1.6;
    ty = y * 1.1;
  }, {passive:true});

  function tick(){
    rx += (tx-rx)*.08;
    ry += (ty-ry)*.08;
    if (!h.classList.contains('icon-retreat')) {
      p.style.rotate = `${rx}deg`;
    } else {
      p.style.rotate = `0deg`;
    }
    requestAnimationFrame(tick);
  }
  tick();
})();
