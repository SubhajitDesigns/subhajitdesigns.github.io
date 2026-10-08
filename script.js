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
   CRAFTED DESIGNS — CONTINUOUS RIGHT → LEFT ART WALL
   Infinite conveyor • smooth 3D depth • no image crop.
   ========================================================= */
(function () {
  const gallery = document.getElementById('craftedGallery');
  const cardsWrap = document.getElementById('craftedGalleryCards');
  if (!gallery || !cardsWrap) return;

  const centerImage = document.getElementById('craftedCenterImage');
  const centerNumber = document.getElementById('craftedCenterNumber');
  const centerType = document.getElementById('craftedCenterType');
  const centerKicker = document.getElementById('craftedCenterKicker');
  const centerTitle = document.getElementById('craftedCenterTitle');
  const centerLink = document.getElementById('craftedCenterLink');
  const counter = document.getElementById('craftedGalleryCounter');
  const dotsWrap = document.getElementById('craftedGalleryDots');
  const prev = document.getElementById('craftedGalleryPrev');
  const next = document.getElementById('craftedGalleryNext');

  const projects = [
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

  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  const coarse = window.matchMedia('(pointer: coarse)');
  let activeIndex = 0;
  let offset = 0;
  let lastTime = performance.now();
  let paused = false;
  let hoverCard = null;
  let nearestIndex = -1;
  let resizeTimer = null;
  let stageWidth = 0;
  let stageHeight = 0;
  let cachedWidths = [];

  const SPEED = 34; // px/sec
  const GAP = -34;

  function frameFor(img, frame, maxWidth, maxHeight, minWidth=150, minHeight=190) {
    if (!img || !frame) return;
    const apply = () => {
      if (!img.naturalWidth || !img.naturalHeight) return;
      const ratio = img.naturalWidth / img.naturalHeight;
      let width = maxWidth;
      let height = width / ratio;
      if (height > maxHeight) {
        height = maxHeight;
        width = height * ratio;
      }
      if (width < minWidth) {
        width = minWidth;
        height = width / ratio;
      }
      if (height < minHeight) {
        height = minHeight;
        width = height * ratio;
      }
      frame.style.width = width + 'px';
      frame.style.height = height + 'px';
      frame.style.setProperty('--frame-width', width + 'px');
      frame.style.setProperty('--frame-height', height + 'px');
    };
    if (img.complete && img.naturalWidth) apply();
    else img.addEventListener('load', apply, {once:true});
  }

  function updateCenterInfo(i) {
    const p = projects[i];
    activeIndex = i;
    centerImage.alt = p.title;
    centerImage.src = p.image;
    centerNumber.textContent = String(i + 1).padStart(2,'0') + ' / ' + projects.length;
    centerType.textContent = p.type;
    centerKicker.textContent = p.kicker;
    centerTitle.textContent = p.title;
    if (counter) counter.textContent = String(i + 1).padStart(2,'0');

    centerLink.classList.toggle('is-disabled', !p.live);
    centerLink.removeAttribute('href');
    centerLink.textContent = p.live ? 'OPEN ' : 'COMING SOON';
    if (p.live) {
      centerLink.href = p.url;
      const arrow = document.createElement('span');
      arrow.textContent = '↗';
      centerLink.appendChild(arrow);
    }

    const fit = () => frameFor(
      centerImage,
      document.getElementById('craftedGalleryCenter'),
      window.innerWidth <= 760 ? Math.min(390, window.innerWidth * .70) : Math.min(510, window.innerWidth * .42),
      window.innerWidth <= 760 ? 350 : 420,
      180, 220
    );
    centerImage.onload = fit;
    if (centerImage.complete && centerImage.naturalWidth) fit();
  }

  function cardFor(project, i) {
    const card = document.createElement('button');
    card.type = 'button';
    card.className = 'crafted-gallery-card';
    card.dataset.index = i;
    card.innerHTML =
      '<div class="crafted-gallery-card-image"><img src="' + project.image + '" alt="' + project.title + '" loading="lazy"><span>' +
      (project.live ? 'OPEN' : 'SOON') + '</span></div>';

    const img = card.querySelector('img');
    frameFor(
      img,
      card,
      window.innerWidth <= 760 ? 150 : (window.innerWidth <= 1000 ? 210 : 250),
      window.innerWidth <= 760 ? 220 : (window.innerWidth <= 1000 ? 285 : 315)
    );

    card.addEventListener('pointerenter', () => {
      if (coarse.matches) return;
      // Hover does not alter the conveyor's appearance or flow.
      hoverCard = card;
    });

    card.addEventListener('pointerleave', () => {
      if (coarse.matches) return;
      if (hoverCard === card) hoverCard = null;
    });

    card.addEventListener('click', () => {
      const p = projects[Number(card.dataset.index)];
      if (card.classList.contains('is-conveyor-hover') && p.live) {
        window.location.href = p.url;
      } else {
        activeIndex = Number(card.dataset.index);
        offset = 0;
        updateCenterInfo(activeIndex);
      }
    });

    return card;
  }

  projects.forEach((project, i) => cardsWrap.appendChild(cardFor(project, i)));

  const cards = Array.from(cardsWrap.children);

  function refreshLayoutMetrics() {
    const rect = gallery.getBoundingClientRect();
    stageWidth = rect.width;
    stageHeight = rect.height;
    cachedWidths = cards.map(card => Math.max(1, card.offsetWidth));
  }

  refreshLayoutMetrics();

  if (dotsWrap) dotsWrap.innerHTML = '';
  projects.forEach((project, i) => {
    const dot = document.createElement('button');
    dot.type = 'button';
    dot.title = project.title;
    dot.setAttribute('aria-label', project.title);
    dot.addEventListener('click', () => {
      activeIndex = i;
      offset = 0;
      updateCenterInfo(i);
    });
    if (dotsWrap) dotsWrap.appendChild(dot);
  });

  function shift(step) {
    activeIndex = (activeIndex + step + projects.length) % projects.length;
    offset = 0;
    updateCenterInfo(activeIndex);
  }

  prev?.addEventListener('click', () => shift(-1));
  next?.addEventListener('click', () => shift(1));

  // Continuous conveyor: hovering the gallery never pauses the motion.
  gallery.addEventListener('pointerenter', () => {});
  gallery.addEventListener('pointerleave', () => {});

  addEventListener('keydown', e => {
    if (!gallery.matches(':hover')) return;
    if (e.key === 'ArrowLeft') shift(-1);
    if (e.key === 'ArrowRight') shift(1);
  });

  function layout(now) {
    const dt = Math.min(32, now - lastTime);
    lastTime = now;

    const isMobile = window.innerWidth <= 760;
    const speed = isMobile ? 20 : SPEED;

    if (!paused && !reduceMotion.matches) {
      offset -= speed * dt / 1000;
    }

    const centerX = stageWidth / 2;
    const centerY = stageHeight / 2;
    const widths = cachedWidths;
    const total = widths.reduce((sum, w) => sum + w + GAP, 0);
    let bestDistance = Infinity;
    let bestIndex = activeIndex;

    let cursor = offset;

    cards.forEach((card, i) => {
      const w = widths[i] || 1;
      let x = cursor + w / 2;

      while (x > total / 2 + w) x -= total;
      while (x < -total / 2 - w) x += total;

      cursor += w + GAP;

      const abs = Math.abs(x);
      const depth = 1 - Math.min(abs / (stageWidth * .58), 1);
      const scale = isMobile
        ? .67 + depth * .25
        : .64 + depth * .40;
      const opacity = isMobile
        ? .30 + depth * .60
        : .18 + depth * .82;
      const brightness = isMobile
        ? .55 + depth * .45
        : .48 + depth * .52;
      const z = -180 + depth * 330;
      const rotate = Math.max(-17, Math.min(17, -x / 34));
      const y = Math.sin(x / 260) * (isMobile ? 3 : 8);

      card.style.transform =
        'translate3d(calc(-50% + ' + x.toFixed(2) + 'px), calc(-50% + ' +
        y.toFixed(2) + 'px), ' + z.toFixed(1) + 'px) rotateY(' +
        rotate.toFixed(2) + 'deg) scale(' + scale.toFixed(3) + ')';

      card.style.left = '50%';
      card.style.top = '50%';
      card.style.opacity = opacity.toFixed(3);
      card.style.filter =
        'brightness(' + brightness.toFixed(3) + ') saturate(' +
        (0.78 + depth * .22).toFixed(3) + ')';
      card.style.zIndex = String(10000 - Math.round(Math.abs(x) * 10));

      const d = Math.abs(x);
      if (d < bestDistance) {
        bestDistance = d;
        bestIndex = i;
      }
    });

    if (bestIndex !== nearestIndex) {
      nearestIndex = bestIndex;
      const logical = Number(cards[bestIndex].dataset.index);
      if (logical !== activeIndex) updateCenterInfo(logical);
    }

    requestAnimationFrame(layout);
  }
  updateCenterInfo(0);
  requestAnimationFrame(layout);

  addEventListener('resize', () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(() => {
      cards.forEach(card => {
        const img = card.querySelector('img');
        frameFor(
          img,
          card,
          window.innerWidth <= 760 ? 150 : (window.innerWidth <= 1000 ? 210 : 250),
          window.innerWidth <= 760 ? 220 : (window.innerWidth <= 1000 ? 285 : 315)
        );
      });
      refreshLayoutMetrics();
    }, 120);
  });

  if (reduceMotion.matches) {
    gallery.classList.add('reduced-motion');
  }
})();


/* =========================================================
   FULL-SCREEN SHOW REEL INTRO — SMOOTH PARTICLE REVEAL
   ========================================================= */
(() => {
  const intro = document.getElementById('introReel');
  const video = document.getElementById('introReelVideo');
  const canvas = document.getElementById('introReelCanvas');
  if (!intro || !video || !canvas) return;

  document.body.classList.add('intro-lock');

  let finished = false;
  let effectStarted = false;
  let dissolveTimer = null;
  let playRetry = null;

  const cleanup = () => {
    if (finished) return;
    finished = true;
    if (dissolveTimer) clearTimeout(dissolveTimer);
    if (playRetry) clearTimeout(playRetry);
    video.pause();
    video.style.visibility = '';
    intro.classList.add('is-done');
    document.body.classList.remove('intro-lock');
    setTimeout(() => intro.remove(), 140);
  };

  // Do not paint a black loading screen. The actual website remains underneath
  // until the video has a frame, then the video covers it immediately.
  const forcePlay = () => {
    if (finished || effectStarted) return;
    const p = video.play();
    if (p && typeof p.catch === 'function') {
      p.catch(() => {
        clearTimeout(playRetry);
        playRetry = setTimeout(forcePlay, 180);
      });
    }
  };

  video.addEventListener('loadeddata', forcePlay);
  video.addEventListener('canplay', forcePlay);
  video.addEventListener('playing', () => {
    intro.classList.add('is-ready');
    scheduleDissolve();
  });

  const startParticleDissolve = () => {
    if (finished || effectStarted || video.readyState < 2) return;
    effectStarted = true;
    clearTimeout(dissolveTimer);

    const w = Math.max(1, window.innerWidth);
    const h = Math.max(1, window.innerHeight);
    canvas.width = w;
    canvas.height = h;

    const ctx = canvas.getContext('2d', { alpha:true });
    if (!ctx) return cleanup();

    // Capture the exact frame that is currently playing.
    const sampleCanvas = document.createElement('canvas');
    const sampleW = Math.min(640, Math.max(360, Math.round(w * 0.58)));
    const sampleH = Math.max(1, Math.round(sampleW * h / w));
    sampleCanvas.width = sampleW;
    sampleCanvas.height = sampleH;

    const sctx = sampleCanvas.getContext('2d', { willReadFrequently:true });
    if (!sctx) return cleanup();

    sctx.drawImage(video, 0, 0, sampleW, sampleH);
    const image = sctx.getImageData(0, 0, sampleW, sampleH);
    const data = image.data;

    const step = Math.max(8, Math.round(sampleW / 78));
    const sxScale = w / sampleW;
    const syScale = h / sampleH;
    const particles = [];

    let seed = 734921;
    const rand = () => {
      seed = (seed * 1664525 + 1013904223) >>> 0;
      return seed / 4294967296;
    };

    const cx = w * 0.5;
    const cy = h * 0.5;
    const maxR = Math.hypot(cx, cy);

    for (let y = 0; y < sampleH; y += step) {
      for (let x = 0; x < sampleW; x += step) {
        const sx = Math.min(sampleW - 1, x + (step >> 1));
        const sy = Math.min(sampleH - 1, y + (step >> 1));
        const pos = (sy * sampleW + sx) * 4;
        const alpha = data[pos + 3];
        if (alpha < 10) continue;

        const ox = x * sxScale;
        const oy = y * syScale;
        const dx = ox - cx;
        const dy = oy - cy;
        const radius = Math.hypot(dx, dy);
        const angle = Math.atan2(dy, dx) + (rand() - 0.5) * 0.95;
        const speed = 35 + rand() * 95;

        // Center releases first; the edge follows. Small jitter makes the
        // boundary organic instead of a perfect circular wipe.
        const start = Math.max(
          0,
          Math.min(0.72, 0.02 + (radius / maxR) * 0.50 + (rand() - 0.5) * 0.18)
        );

        particles.push({
          ox, oy,
          dx: Math.cos(angle) * speed,
          dy: Math.sin(angle) * speed,
          size: 1.6 + rand() * 3.4,
          start,
          r:data[pos], g:data[pos+1], b:data[pos+2],
          a:alpha / 255
        });
      }
    }

    /*
     * IMPORTANT: keep a full snapshot underneath the particles. As each
     * original cell is released, its source area is erased with destination-
     * out, exposing the REAL WEBSITE underneath — never a black background.
     */
    video.style.visibility = 'hidden';

    const duration = 1500;
    const startedAt = performance.now();

    const animate = now => {
      if (finished) return;
      const progress = Math.min(1, (now - startedAt) / duration);

      ctx.globalCompositeOperation = 'source-over';
      ctx.clearRect(0, 0, w, h);
      ctx.drawImage(sampleCanvas, 0, 0, w, h);

      // Erase released source cells first, revealing the website behind.
      ctx.globalCompositeOperation = 'destination-out';
      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];
        if (progress <= p.start) continue;
        const local = Math.min(1, (progress - p.start) / (1 - p.start));
        const reveal = 1 - Math.pow(1 - local, 2.0);
        const hole = p.size * (1.2 + reveal * 2.2);
        ctx.fillRect(p.ox - hole * 0.5, p.oy - hole * 0.5, hole, hole);
      }

      // Then draw the released pixels as moving dust.
      ctx.globalCompositeOperation = 'source-over';
      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];
        const local = (progress - p.start) / (1 - p.start);
        if (local <= 0) continue;

        const t = Math.min(1, local);
        const ease = 1 - Math.pow(1 - t, 2.4);
        const px = p.ox + p.dx * ease * (0.45 + ease * 1.8);
        const py = p.oy + p.dy * ease * (0.45 + ease * 1.8);
        const fade = t < 0.48 ? 1 : Math.pow((1 - t) / 0.52, 1.55);
        const a = p.a * fade;
        if (a < 0.01) continue;

        ctx.fillStyle = 'rgba(' + p.r + ',' + p.g + ',' + p.b + ',' + a.toFixed(3) + ')';
        const size = p.size * (1 - ease * 0.25);
        ctx.fillRect(px, py, size, size);
      }

      if (progress < 1) {
        requestAnimationFrame(animate);
      } else {
        cleanup();
      }
    };

    requestAnimationFrame(animate);
  };

  function scheduleDissolve() {
    if (finished || effectStarted || !Number.isFinite(video.duration)) return;
    clearTimeout(dissolveTimer);

    const startAt = Math.min(3.5, Math.max(1.2, video.duration - 1.5));
    const wait = Math.max(0, (startAt - video.currentTime) * 1000);
    dissolveTimer = setTimeout(() => {
      if (video.currentTime >= startAt - 0.08) startParticleDissolve();
      else scheduleDissolve();
    }, wait);
  }

  video.addEventListener('loadedmetadata', scheduleDissolve, {once:true});
  video.addEventListener('ended', startParticleDissolve, {once:true});
  video.addEventListener('error', () => setTimeout(() => {
    if (!effectStarted) cleanup();
  }, 500), {once:true});

  // Immediate playback attempts; no artificial black-screen delay.
  forcePlay();
  setTimeout(forcePlay, 80);
  setTimeout(forcePlay, 300);
  setTimeout(forcePlay, 900);

  // Safety: if playback is genuinely unavailable, reveal the site instead
  // of trapping the visitor behind a black overlay.
  setTimeout(() => {
    if (!finished && !effectStarted && video.readyState < 2) cleanup();
  }, 5000);
})();