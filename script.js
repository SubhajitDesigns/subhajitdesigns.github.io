(() => {
  const hero = document.querySelector('.interactive-hero');
  const art = document.querySelector('.hero-art');
  const portrait = document.querySelector('#portraitTarget');
  const cursor = document.querySelector('.cursor-dot');
  const magnetic = document.querySelector('.magnetic');
  const navLinks = [...document.querySelectorAll('.hero-nav nav a, .hero-nav .nav-cta')];

  let mx = innerWidth / 2;
  let my = innerHeight / 2;
  let sx = mx;
  let sy = my;


  /* =========================================================
     HERO — MOUSE FOLLOW
     ========================================================= */

  addEventListener('mousemove', e => {
    mx = e.clientX;
    my = e.clientY;

    if (cursor) {
      cursor.style.left = mx + 'px';
      cursor.style.top = my + 'px';
    }

    if (hero) {
      const r = hero.getBoundingClientRect();

      hero.style.setProperty(
        '--mx',
        ((mx - r.left) / r.width * 100) + '%'
      );

      hero.style.setProperty(
        '--my',
        ((my - r.top) / r.height * 100) + '%'
      );
    }
  }, {
    passive: true
  });


  /* =========================================================
     HERO — PORTRAIT HOVER
     ========================================================= */

  portrait?.addEventListener(
    'mouseenter',
    () => hero?.classList.add('icon-retreat')
  );

  portrait?.addEventListener(
    'mouseleave',
    () => hero?.classList.remove('icon-retreat')
  );

  // Keep the depth effect predictable:
  // the portrait owns the hover, icons stay behind it.

  portrait?.addEventListener(
    'pointerenter',
    () => hero?.classList.add('icon-retreat')
  );

  portrait?.addEventListener(
    'pointerleave',
    () => hero?.classList.remove('icon-retreat')
  );


  /* =========================================================
     NAVIGATION ACTIVE EFFECT
     ========================================================= */

  navLinks.forEach(link => {
    link.addEventListener('click', () => {

      navLinks.forEach(x =>
        x.classList.remove('nav-active')
      );

      link.classList.add('nav-active');

      setTimeout(() => {
        link.classList.remove('nav-active');
      }, 600);

    });
  });


  /* =========================================================
     HERO — PORTRAIT 3D MOVEMENT
     ========================================================= */

  function frame() {

    sx += (mx - sx) * 0.055;
    sy += (my - sy) * 0.055;

    if (art && portrait && innerWidth > 800) {

      const r = art.getBoundingClientRect();

      const px = Math.max(
        -1,
        Math.min(
          1,
          (sx - (r.left + r.width / 2)) /
          (r.width / 2)
        )
      );

      const py = Math.max(
        -1,
        Math.min(
          1,
          (sy - (r.top + r.height / 2)) /
          (r.height / 2)
        )
      );

      const retreat =
        hero?.classList.contains('icon-retreat');

      const move = retreat ? 2.2 : 10;

      portrait.style.transform =
        `translate3d(
          ${px * move}px,
          ${py * move * 0.7}px,
          0
        )
        rotateX(${py * (retreat ? 1.2 : 3.2)}deg)
        rotateY(${px * (retreat ? -2 : 4.5)}deg)`;

      const grid =
        hero.querySelector('.hero-bg-grid');

      if (grid) {
        grid.style.transform =
          `translate3d(
            ${px * 4}px,
            ${py * 3}px,
            0
          )`;
      }
    }

    requestAnimationFrame(frame);
  }

  requestAnimationFrame(frame);


  /* =========================================================
     SHOW REEL MODAL
     ========================================================= */

  const reelButton =
    document.querySelector('#showReel');

  const reelModal =
    document.querySelector('#reelModal');

  const reelClose =
    document.querySelector('#reelClose');


  const closeReel = () => {

    if (reelModal) {

      reelModal.classList.remove('is-open');

      reelModal.setAttribute(
        'aria-hidden',
        'true'
      );

    }

  };


  reelButton?.addEventListener(
    'click',
    () => {

      if (reelModal) {

        reelModal.classList.add('is-open');

        reelModal.setAttribute(
          'aria-hidden',
          'false'
        );

      }

    }
  );


  reelClose?.addEventListener(
    'click',
    closeReel
  );


  reelModal?.addEventListener(
    'click',
    e => {

      if (e.target === reelModal) {
        closeReel();
      }

    }
  );


  addEventListener(
    'keydown',
    e => {

      if (e.key === 'Escape') {
        closeReel();
      }

    }
  );


  /* =========================================================
     MAGNETIC BUTTON
     ========================================================= */

  if (magnetic) {

    magnetic.addEventListener(
      'mousemove',
      e => {

        const r =
          magnetic.getBoundingClientRect();

        magnetic.style.transform =
          `translate(
            ${(e.clientX - r.left - r.width / 2) * 0.1}px,
            ${(e.clientY - r.top - r.height / 2) * 0.1}px
          )`;

      }
    );


    magnetic.addEventListener(
      'mouseleave',
      () => {
        magnetic.style.transform = '';
      }
    );

  }

})();


/* =========================================================
   V29 FINAL — SUBTLE RED CURSOR ATMOSPHERE
   ========================================================= */

(() => {

  const glow =
    document.querySelector('.cursor-glow');

  if (
    !glow ||
    window.matchMedia('(pointer: coarse)').matches
  ) {
    return;
  }


  let tx = window.innerWidth / 2;
  let ty = window.innerHeight / 2;

  let x = tx;
  let y = ty;

  let active = false;


  window.addEventListener(
    'pointermove',
    e => {

      tx = e.clientX;
      ty = e.clientY;

      if (!active) {

        active = true;

        document.body.classList.add(
          'cursor-active'
        );

      }

    },
    {
      passive: true
    }
  );


  window.addEventListener(
    'pointerleave',
    () => {

      active = false;

      document.body.classList.remove(
        'cursor-active'
      );

    }
  );


  const tick = () => {

    x += (tx - x) * 0.10;
    y += (ty - y) * 0.10;

    glow.style.transform =
      `translate3d(
        ${x}px,
        ${y}px,
        0
      )
      translate3d(-50%, -50%, 0)`;

    requestAnimationFrame(tick);

  };


  requestAnimationFrame(tick);

})();


/* =========================================================
   CLIENT LOGOS — CENTER FOCUS
   ========================================================= */

const clientTrack =
  document.querySelector('.client-logo-track');


if (clientTrack) {

  function updateClientLogos() {

    const logos =
      clientTrack.querySelectorAll(
        '.client-logo-item img'
      );

    const center =
      window.innerWidth / 2;


    logos.forEach(logo => {

      const rect =
        logo.getBoundingClientRect();

      const logoCenter =
        rect.left + rect.width / 2;

      const distance =
        Math.abs(center - logoCenter);

      const range =
        window.innerWidth * 0.50;


      let amount =
        1 - (distance / range);


      amount =
        Math.max(
          0,
          Math.min(1, amount)
        );


      /* Very subtle size change */

      const scale =
        1 + (amount * 0.08);


      logo.style.transform =
        `scale(${scale})`;

    });


    requestAnimationFrame(
      updateClientLogos
    );

  }


  updateClientLogos();

}


/* =========================================================
   SUBHAJIT CLIENTS — CLEAN CENTER FOCUS
   No stretch • No vertical movement • No tilt
   ========================================================= */

(function () {

  const carousel =
    document.querySelector(
      '.client-carousel'
    );

  const track =
    document.querySelector(
      '.client-carousel-track'
    );


  if (!carousel || !track) {
    return;
  }


  const cards =
    Array.from(
      track.querySelectorAll(
        '.client-card'
      )
    );


  function updateClientFocus() {

    const centerX =
      window.innerWidth / 2;


    cards.forEach(card => {

      const rect =
        card.getBoundingClientRect();

      const cardCenter =
        rect.left + rect.width / 2;


      const distance =
        Math.abs(
          cardCenter - centerX
        );


      /*
       * Wide focus zone.
       * This keeps several logos visible.
       */

      const influence =
        Math.min(
          distance /
          (window.innerWidth * 0.58),
          1
        );


      const focus =
        Math.pow(
          1 - influence,
          1.15
        );


      /*
       * UNIFORM SCALE ONLY.
       * No separate X/Y scaling.
       * No stretching.
       */

      const scale =
        0.84 + (0.16 * focus);


      /*
       * Side logos remain visible.
       * Center logo becomes fully visible.
       */

      const opacity =
        0.38 + (0.62 * focus);


      /*
       * Very small amount of blur.
       *
       * Center = 0px
       * Far sides = 0.7px
       */

      const blur =
        0.7 * (1 - focus);


      card.style.setProperty(
        'transform',
        'scale(' +
        scale.toFixed(3) +
        ')',
        'important'
      );


      card.style.opacity =
        opacity.toFixed(3);


      card.style.filter =
        'blur(' +
        blur.toFixed(2) +
        'px)';


      card.style.zIndex =
        String(
          Math.round(
            100 + focus * 100
          )
        );

    });


    requestAnimationFrame(
      updateClientFocus
    );

  }


  requestAnimationFrame(
    updateClientFocus
  );

})();



/* =========================================================
   CRAFTED DESIGNS — 3D INFINITE FILMSTRIP
   Continuous horizontal motion + hover focus.
   ========================================================= */
(function () {
  const gallery = document.getElementById('craftedGallery');
  const cardsWrap = document.getElementById('craftedGalleryCards');
  if (!gallery || !cardsWrap) return;

  const center = {
    image: document.getElementById('craftedCenterImage'),
    number: document.getElementById('craftedCenterNumber'),
    type: document.getElementById('craftedCenterType'),
    kicker: document.getElementById('craftedCenterKicker'),
    title: document.getElementById('craftedCenterTitle'),
    link: document.getElementById('craftedCenterLink')
  };
  const counter = document.getElementById('craftedGalleryCounter');
  const dotsWrap = document.getElementById('craftedGalleryDots');
  const prev = document.getElementById('craftedGalleryPrev');
  const next = document.getElementById('craftedGalleryNext');

  const projects = [
    {title:'SOCIAL MEDIA',kicker:'POSTS • REELS • STORIES',type:'SOCIAL MEDIA',url:'social-media.html',live:true,image:'jaisalmer.jpg'},
    {title:'GOOGLE ADS',kicker:'ADS • BANNERS • CAMPAIGNS',type:'GOOGLE ADS',url:'google-ads.html',live:true,image:'ac094c3fedd25880080e0f0e4d5b7467.jpg'},
    {title:'PRODUCT ADS',kicker:'E-COMMERCE • PROMOTIONS',type:'PRODUCT ADS',url:'product-ads.html',live:true,image:'honey.jpg'},
    {title:'BRANDING',kicker:'IDENTITY • SYSTEMS • VISUALS',type:'COMING SOON',live:false,image:'dharmi-realty.jpg'},
    {title:'OTHER DESIGNS',kicker:'EXPERIMENTS • CONCEPTS • VISUALS',type:'COMING SOON',live:false,image:'port 7.jpg'},
    {title:'MOTION GRAPHICS',kicker:'ANIMATION • REVEALS • MOTION',type:'COMING SOON',live:false,image:'followes.jpg'},
    {title:'FLYERS',kicker:'PRINT • PROMOTION • CAMPAIGNS',type:'COMING SOON',live:false,image:'momo-street.jpg'},
    {title:'BANNERS',kicker:'DISPLAY • DIGITAL • CAMPAIGNS',type:'COMING SOON',live:false,image:'organic.jpg'},
    {title:'LOGOS',kicker:'MARKS • SYMBOLS • IDENTITY',type:'COMING SOON',live:false,image:'graphic.jpg'},
    {title:'PRINTABLES',kicker:'BROCHURES • MENUS • COLLATERAL',type:'COMING SOON',live:false,image:'bali.jpg'},
    {title:'CREATIVES',kicker:'CONCEPTS • CAMPAIGNS • ART DIRECTION',type:'COMING SOON',live:false,image:'restaurant.jpg'},
    {title:'DIGITAL MARKETING',kicker:'CAMPAIGNS • PERFORMANCE • CREATIVE',type:'COMING SOON',live:false,image:'business.jpg'},
    {title:'PET FOOD',kicker:'PRODUCT ADS • E-COMMERCE • PROMOTION',type:'COMING SOON',live:false,image:'food-ad.jpg'},
    {title:'GOA',kicker:'TRAVEL • TOURISM • CAMPAIGN',type:'COMING SOON',live:false,image:'goa.jpg'},
    {title:'FOOD & RESTAURANT',kicker:'FOOD • SOCIAL • PROMOTION',type:'COMING SOON',live:false,image:'idli.jpg'},
    {title:'JEWELRY',kicker:'JEWELRY • PRODUCT • SOCIAL',type:'COMING SOON',live:false,image:'jwel.jpg'},
    {title:'KASHMIR',kicker:'TRAVEL • TOURISM • CAMPAIGN',type:'COMING SOON',live:false,image:'kasfmir-tour.jpg'},
    {title:'TOUR & TRAVEL',kicker:'TRAVEL • TRANSPORT • PROMOTION',type:'COMING SOON',live:false,image:'safe-tour.jpg'},
    {title:'VIETNAM',kicker:'TRAVEL • TOURISM • CAMPAIGN',type:'COMING SOON',live:false,image:'vietnam.jpg'}
  ];

  let index = 0;
  let paused = false;
  let dragX = null;
  let dragMoved = false;
  let wheelLock = false;

  function fitFrame(img, frame, maxWidth, maxHeight, minWidth=150, minHeight=190) {
    const apply = () => {
      if (!img.naturalWidth || !img.naturalHeight) return;
      const ratio = img.naturalWidth / img.naturalHeight;
      let w = maxWidth, h = w / ratio;
      if (h > maxHeight) { h = maxHeight; w = h * ratio; }
      if (w < minWidth) { w = minWidth; h = w / ratio; }
      if (h < minHeight) { h = minHeight; w = h * ratio; }
      frame.style.width = w + 'px';
      frame.style.height = h + 'px';
      frame.style.setProperty('--frame-width', w + 'px');
      frame.style.setProperty('--frame-height', h + 'px');
    };
    if (img.complete && img.naturalWidth) apply();
    else img.addEventListener('load', apply, {once:true});
  }

  function makeCard(project, offset, actualIndex) {
    const card = document.createElement('button');
    card.type = 'button';
    card.className = 'crafted-gallery-card film-card';
    card.dataset.index = actualIndex;
    card.dataset.offset = offset;
    card.innerHTML =
      '<div class="crafted-gallery-card-image"><img src="' + project.image + '" alt="' + project.title + '" loading="lazy"><span>' +
      (project.live ? 'OPEN' : 'SOON') + '</span></div>' +
      '<div class="crafted-gallery-card-label"><small>' +
      String(actualIndex + 1).padStart(2,'0') + '</small><b>' + project.title + '</b></div>';

    const img = card.querySelector('img');
    fitFrame(img, card,
      window.innerWidth <= 760 ? 150 : (window.innerWidth <= 1000 ? 205 : 245),
      window.innerWidth <= 760 ? 220 : (window.innerWidth <= 1000 ? 285 : 305)
    );

    card.addEventListener('mouseenter', () => {
      paused = true;
      gallery.classList.add('film-hovering');
      card.classList.add('is-focused');
    });
    card.addEventListener('mouseleave', () => {
      card.classList.remove('is-focused');
      gallery.classList.remove('film-hovering');
      paused = false;
    });

    card.addEventListener('click', () => {
      const target = Number(card.dataset.index);
      if (dragMoved) return;
      if (project.live) window.location.href = project.url;
      else setCenter(target);
    });

    return card;
  }

  function setCenter(target) {
    index = (target + projects.length) % projects.length;
    const p = projects[index];
    center.image.alt = p.title;
    center.image.src = p.image;
    center.image.onload = () => fitFrame(
      center.image,
      document.getElementById('craftedGalleryCenter'),
      window.innerWidth <= 760 ? Math.min(390, window.innerWidth * .70) : Math.min(510, window.innerWidth * .42),
      window.innerWidth <= 760 ? 350 : 420,
      180, 220
    );
    center.number.textContent = String(index + 1).padStart(2,'0') + ' / ' + projects.length;
    center.type.textContent = p.type;
    center.kicker.textContent = p.kicker;
    center.title.textContent = p.title;
    counter.textContent = String(index + 1).padStart(2,'0');

    center.link.classList.toggle('is-disabled', !p.live);
    center.link.removeAttribute('href');
    center.link.textContent = p.live ? 'OPEN ' : 'COMING SOON';
    if (p.live) {
      center.link.href = p.url;
      const arrow = document.createElement('span');
      arrow.textContent = '↗';
      center.link.appendChild(arrow);
    }

    dotsWrap.innerHTML = '';
    projects.forEach((project, i) => {
      const dot = document.createElement('button');
      dot.type = 'button';
      dot.title = project.title;
      dot.setAttribute('aria-label', project.title);
      dot.className = i === index ? 'is-active' : '';
      dot.addEventListener('click', () => setCenter(i));
      dotsWrap.appendChild(dot);
    });
  }

  function build() {
    cardsWrap.innerHTML = '';
    // Enough cards on each side to make the strip feel continuous.
    for (let offset = -8; offset <= 8; offset++) {
      if (offset === 0) continue;
      const actual = (index + offset + projects.length) % projects.length;
      cardsWrap.appendChild(makeCard(projects[actual], offset, actual));
    }
    setCenter(index);
  }

  function shift(step) {
    setCenter(index + step);
  }

  // Smooth automatic drift. Cards are positioned from CSS using their offset.
  let phase = 0;
  let last = performance.now();
  function tick(now) {
    const dt = Math.min(40, now - last);
    last = now;
    if (!paused && !dragX && window.innerWidth > 760) {
      phase += dt * 0.018;
      cardsWrap.style.setProperty('--film-shift', phase.toFixed(2) + 'px');
    }
    requestAnimationFrame(tick);
  }

  gallery.addEventListener('pointerdown', e => {
    if (e.pointerType === 'mouse' && e.button !== 0) return;
    dragX = e.clientX;
    dragMoved = false;
    gallery.setPointerCapture?.(e.pointerId);
    paused = true;
  });

  gallery.addEventListener('pointermove', e => {
    if (dragX === null) return;
    const dx = e.clientX - dragX;
    if (Math.abs(dx) > 8) dragMoved = true;
    cardsWrap.style.setProperty('--drag-shift', dx + 'px');
  });

  gallery.addEventListener('pointerup', e => {
    if (dragX === null) return;
    const dx = e.clientX - dragX;
    cardsWrap.style.removeProperty('--drag-shift');
    dragX = null;
    paused = false;
    if (Math.abs(dx) > 65) shift(dx < 0 ? 1 : -1);
    setTimeout(() => { dragMoved = false; }, 80);
  });

  gallery.addEventListener('pointercancel', () => {
    dragX = null;
    cardsWrap.style.removeProperty('--drag-shift');
    paused = false;
  });

  gallery.addEventListener('wheel', e => {
    if (wheelLock) return;
    if (Math.abs(e.deltaY) < Math.abs(e.deltaX)) return;
    wheelLock = true;
    shift(e.deltaY > 0 ? 1 : -1);
    setTimeout(() => { wheelLock = false; }, 180);
  }, {passive:true});

  prev?.addEventListener('click', () => shift(-1));
  next?.addEventListener('click', () => shift(1));

  center.link?.addEventListener('click', e => {
    if (!projects[index].live) e.preventDefault();
  });

  setCenter(0);
  build();
  requestAnimationFrame(tick);
})();
