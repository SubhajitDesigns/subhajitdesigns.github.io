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
   CRAFTED DESIGNS — 3D FLOATING CONTACT SHEET
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
    {title:'SOCIAL MEDIA', kicker:'POSTS • REELS • STORIES', type:'SOCIAL MEDIA', url:'social-media.html', live:true, image:'jaisalmer.jpg'},
    {title:'GOOGLE ADS', kicker:'ADS • BANNERS • CAMPAIGNS', type:'GOOGLE ADS', url:'google-ads.html', live:true, image:'ac094c3fedd25880080e0f0e4d5b7467.jpg'},
    {title:'PRODUCT ADS', kicker:'E-COMMERCE • PROMOTIONS', type:'PRODUCT ADS', url:'product-ads.html', live:true, image:'honey.jpg'},
    {title:'BRANDING', kicker:'IDENTITY • SYSTEMS • VISUALS', type:'COMING SOON', live:false, image:'dharmi-realty.jpg'},
    {title:'OTHER DESIGNS', kicker:'EXPERIMENTS • CONCEPTS • VISUALS', type:'COMING SOON', live:false, image:'port 7.jpg'},
    {title:'MOTION GRAPHICS', kicker:'ANIMATION • REVEALS • MOTION', type:'COMING SOON', live:false, image:'followes.jpg'},
    {title:'FLYERS', kicker:'PRINT • PROMOTION • CAMPAIGNS', type:'COMING SOON', live:false, image:'momo-street.jpg'},
    {title:'BANNERS', kicker:'DISPLAY • DIGITAL • CAMPAIGNS', type:'COMING SOON', live:false, image:'organic.jpg'},
    {title:'LOGOS', kicker:'MARKS • SYMBOLS • IDENTITY', type:'COMING SOON', live:false, image:'graphic.jpg'},
    {title:'PRINTABLES', kicker:'BROCHURES • MENUS • COLLATERAL', type:'COMING SOON', live:false, image:'bali.jpg'},
    {title:'CREATIVES', kicker:'CONCEPTS • CAMPAIGNS • ART DIRECTION', type:'COMING SOON', live:false, image:'restaurant.jpg'},
    {title:'DIGITAL MARKETING', kicker:'CAMPAIGNS • PERFORMANCE • CREATIVE', type:'COMING SOON', live:false, image:'business.jpg'},
    {title:'PET FOOD', kicker:'PRODUCT ADS • E-COMMERCE • PROMOTION', type:'COMING SOON', live:false, image:'food-ad.jpg'},
    {title:'GOA', kicker:'TRAVEL • TOURISM • CAMPAIGN', type:'COMING SOON', live:false, image:'goa.jpg'},
    {title:'FOOD & RESTAURANT', kicker:'FOOD • SOCIAL • PROMOTION', type:'COMING SOON', live:false, image:'idli.jpg'},
    {title:'JEWELRY', kicker:'JEWELRY • PRODUCT • SOCIAL', type:'COMING SOON', live:false, image:'jwel.jpg'},
    {title:'KASHMIR', kicker:'TRAVEL • TOURISM • CAMPAIGN', type:'COMING SOON', live:false, image:'kasfmir-tour.jpg'},
    {title:'TOUR & TRAVEL', kicker:'TRAVEL • TRANSPORT • PROMOTION', type:'COMING SOON', live:false, image:'safe-tour.jpg'},
    {title:'VIETNAM', kicker:'TRAVEL • TOURISM • CAMPAIGN', type:'COMING SOON', live:false, image:'vietnam.jpg'}
  ];

  let index = 0;
  let locked = false;


  function fitNaturalFrame(img, frame, maxWidth, maxHeight, minWidth=150, minHeight=190) {
    if (!img || !frame) return;

    const apply = () => {
      const nw = img.naturalWidth;
      const nh = img.naturalHeight;
      if (!nw || !nh) return;

      const ratio = nw / nh;

      // The artwork chooses the frame ratio. Only the overall size is bounded.
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

      // The center wrapper also needs the exact same dimensions.
      // Otherwise left:50% places its LEFT EDGE at the gallery center.
      if (frame.id === 'craftedGalleryCenter') {
        frame.parentElement.style.width = width + 'px';
        frame.parentElement.style.height = height + 'px';
        frame.parentElement.style.setProperty('--frame-width', width + 'px');
        frame.parentElement.style.setProperty('--frame-height', height + 'px');
      }

      if (frame.id === 'craftedGalleryCenter') {
        frame.style.left = 'calc(50% - ' + (width / 2) + 'px)';
        frame.style.top = 'calc(50% - ' + (height / 2) + 'px)';
      }
    };

    if (img.complete && img.naturalWidth) {
      apply();
    } else {
      img.addEventListener('load', apply, {once:true});
    }
  }

  function syncNearestRightCard() {
    const centerFrame = document.getElementById('craftedGalleryCenter');
    const rightCard = cardsWrap.querySelector('.crafted-gallery-card.position-right-1');
    if (!centerFrame || !rightCard) return;

    const centerRect = centerFrame.getBoundingClientRect();
    const rightRect = rightCard.getBoundingClientRect();

    // Move ONLY the nearest right card until its visible left edge
    // meets the center artwork's visible right edge.
    const delta = centerRect.right - rightRect.left;
    if (Math.abs(delta) < 0.5) return;

    const currentLeft = parseFloat(getComputedStyle(rightCard).left) || 0;
    rightCard.style.left = (currentLeft + delta) + 'px';
  }

  function makeCard(project, position, actualIndex) {
    const card = document.createElement('button');
    card.type = 'button';
    card.className = 'crafted-gallery-card position-' + position;
    card.dataset.index = actualIndex;
    card.innerHTML =
      '<div class="crafted-gallery-card-image"><img src="' + project.image + '" alt="" loading="lazy"><span>' +
      (project.live ? 'OPEN' : 'SOON') + '</span></div>' +
      '<div class="crafted-gallery-card-label"><small>' +
      String(actualIndex + 1).padStart(2,'0') + '</small><b>' + project.title + '</b></div>';
    card.addEventListener('click', () => {
      const target = Number(card.dataset.index);
      if (target === index) {
        if (project.live) window.location.href = project.url;
        return;
      }
      select(target, target > index ? 1 : -1);
    });
    const cardImage = card.querySelector('.crafted-gallery-card-image img');
    if (position === 'right-1') {
      cardImage.addEventListener('load', () => {
        requestAnimationFrame(syncNearestRightCard);
      }, {once:true});
    }

    fitNaturalFrame(
      cardImage,
      card,
      window.innerWidth <= 760 ? 150 : (window.innerWidth <= 1000 ? 210 : 250),
      window.innerWidth <= 760 ? 220 : (window.innerWidth <= 1000 ? 285 : 315)
    );

    return card;
  }

  function relativePosition(i) {
    let d = i - index;
    if (d > projects.length / 2) d -= projects.length;
    if (d < -projects.length / 2) d += projects.length;
    return d;
  }

  function render(direction = 0) {
    const p = projects[index];
    cardsWrap.innerHTML = '';

    /* Always show a dense wall of surrounding work. */
    [-5,-4,-3,-2,-1,1,2,3,4,5].forEach(offset => {
      let target = (index + offset + projects.length) % projects.length;
      const positionName = offset < 0 ? 'left-' + Math.abs(offset) : 'right-' + offset;
      const card = makeCard(projects[target], positionName, target);

      /* Compact 11-card contact sheet: a few extra artworks, tightly grouped. */
      const depth = Math.abs(offset);
      const side = offset < 0 ? -1 : 1;

      const leftPct = 50 + (side * (depth * 7.2));
      const scale = Math.max(0.52, 0.96 - (depth * 0.075));
      const rotY = side * (11 + depth * 2.1);
      const rotZ = side * (1 + depth * 0.5);
      const z = -depth * 42;
      const opacity = Math.max(0.28, 0.94 - (depth * 0.10));
      const brightness = Math.max(0.48, 0.88 - (depth * 0.06));

      card.style.setProperty('left', leftPct + '%', 'important');
      card.style.setProperty(
        'transform',
        'translate(-50%,-50%) rotateY(' + rotY + 'deg) rotateZ(' + rotZ + 'deg) translateZ(' + z + 'px) scale(' + scale + ')',
        'important'
      );
      card.style.opacity = opacity;
      card.style.filter = 'brightness(' + brightness + ')';
      card.style.zIndex = String(30 - depth);

      if (depth >= 4) {
        const label = card.querySelector('.crafted-gallery-card-label');
        const badge = card.querySelector('.crafted-gallery-card-image span');
        if (label) label.style.display = 'none';
        if (badge) badge.style.opacity = '0';
      }

      cardsWrap.appendChild(card);
    });

    centerImage.alt = p.title;

    const centerFrame = document.getElementById('craftedGalleryCenter');
    const fitCenter = () => fitNaturalFrame(
      centerImage,
      centerFrame,
      window.innerWidth <= 760 ? Math.min(390, window.innerWidth * .70) : Math.min(510, window.innerWidth * .42),
      window.innerWidth <= 760 ? 350 : 420,
      180,
      220
    );

    centerImage.onload = fitCenter;
    centerImage.src = p.image;

    if (centerImage.complete && centerImage.naturalWidth) {
      fitCenter();
    }

    requestAnimationFrame(() => {
      requestAnimationFrame(syncNearestRightCard);
    });

    centerNumber.textContent = String(index + 1).padStart(2,'0') + ' / ' + projects.length;
    centerType.textContent = p.type;
    centerKicker.textContent = p.kicker;
    centerTitle.textContent = p.title;
    counter.textContent = String(index + 1).padStart(2,'0');

    centerLink.classList.toggle('is-disabled', !p.live);
    centerLink.removeAttribute('href');
    centerLink.textContent = p.live ? 'OPEN ' : 'COMING SOON';
    if (p.live) {
      centerLink.href = p.url;
      const arrow = document.createElement('span');
      arrow.textContent = '↗';
      centerLink.appendChild(arrow);
    }

    dotsWrap.innerHTML = '';
    projects.forEach((project, i) => {
      const dot = document.createElement('button');
      dot.type = 'button';
      dot.title = project.title;
      dot.setAttribute('aria-label', project.title);
      dot.className = i === index ? 'is-active' : '';
      dot.addEventListener('click', () => select(i, i > index ? 1 : -1));
      dotsWrap.appendChild(dot);
    });

    gallery.classList.remove('gallery-next','gallery-prev');
    if (direction > 0) gallery.classList.add('gallery-next');
    if (direction < 0) gallery.classList.add('gallery-prev');
  }

  function select(target, direction) {
    if (locked || target === index) return;
    locked = true;
    index = (target + projects.length) % projects.length;
    render(direction);
    window.setTimeout(() => { locked = false; }, 500);
  }

  prev?.addEventListener('click', () => select(index - 1, -1));
  next?.addEventListener('click', () => select(index + 1, 1));

  centerLink?.addEventListener('click', event => {
    const p = projects[index];
    if (!p.live) event.preventDefault();
  });

  gallery.addEventListener('pointermove', event => {
    if (event.pointerType === 'touch') return;
    const r = gallery.getBoundingClientRect();
    const x = ((event.clientX - r.left) / r.width) * 2 - 1;
    const y = ((event.clientY - r.top) / r.height) * 2 - 1;
    gallery.style.setProperty('--gx', (x * 1.8).toFixed(2) + 'deg');
    gallery.style.setProperty('--gy', (y * -1.3).toFixed(2) + 'deg');
    gallery.style.setProperty('--px', (x * 10).toFixed(1) + 'px');
    gallery.style.setProperty('--py', (y * 7).toFixed(1) + 'px');
  });

  gallery.addEventListener('pointerleave', () => {
    gallery.style.setProperty('--gx','0deg');
    gallery.style.setProperty('--gy','0deg');
    gallery.style.setProperty('--px','0px');
    gallery.style.setProperty('--py','0px');
  });

  gallery.addEventListener('keydown', event => {
    if (event.key === 'ArrowRight') select(index + 1, 1);
    if (event.key === 'ArrowLeft') select(index - 1, -1);
  });

  render();
})();
/* =========================================================
   CURRENTLY CREATING
   5 SECOND CREATIVE ROTATION
   ========================================================= */

(() => {

  const section =
    document.querySelector(
      '.currently-creating'
    );


  if (!section) {
    return;
  }


  const slides =
    [
      ...section.querySelectorAll(
        '.creating-slide'
      )
    ];


  const progress =
    section.querySelector(
      '#creatingProgress'
    );


  const title =
    section.querySelector(
      '#creatingTitle'
    );


  const category =
    section.querySelector(
      '#creatingCategory'
    );


  const next =
    section.querySelector(
      '#creatingNext'
    );


  if (!slides.length) {
    return;
  }


  const details = [

    {
      title: 'FONT FAILS',
      category:
        'TYPOGRAPHY / ART DIRECTION'
    },

    {
      title: 'GOOD DESIGN?',
      category:
        'EDITORIAL / CONCEPTUAL DESIGN'
    },

    {
      title: 'CAPCUT',
      category:
        'VISUAL CAMPAIGN / CREATIVE DESIGN'
    },

    {
      title: 'IDEA OVERLOAD',
      category:
        'EDITORIAL / PHOTO MANIPULATION'
    },

    {
      title: 'SCHNEIDER ELECTRIC',
      category:
        'CAMPAIGN / BRAND DESIGN'
    }

  ];


  const visual =
    section.querySelector(
      '.creating-visual'
    );


  const stage =
    section.querySelector(
      '#creatingStage'
    );


  const caption =
    section.querySelector(
      '.creating-caption'
    );


  let index = 0;

  let timer = null;

  const DISPLAY_TIME = 5000;


  /* =========================================================
     SYNC CAPTION TO IMAGE
     ========================================================= */

  function syncCaptionToImage() {

    if (
      !visual ||
      !stage ||
      !caption
    ) {
      return;
    }


    const active =
      slides[index];


    const img =
      active?.querySelector('img');


    if (!img) {
      return;
    }


    const rect =
      img.getBoundingClientRect();


    const stageRect =
      stage.getBoundingClientRect();


    const width =
      Math.min(
        rect.width,
        stageRect.width
      );


    const left =
      Math.max(
        0,
        rect.left -
        stageRect.left
      );


    visual.style.setProperty(
      '--creating-image-width',
      width + 'px'
    );


    visual.style.setProperty(
      '--creating-caption-left',
      left + 'px'
    );


    /*
     * Collapse the stage to the actual
     * artwork height so there is no
     * giant empty area.
     */

    if (rect.height > 0) {

      stage.style.height =
        rect.height + 'px';

    }

  }


  /* =========================================================
     PROGRESS BAR
     ========================================================= */

  function restartProgress() {

    if (!progress) {
      return;
    }


    progress.classList.remove(
      'is-running'
    );


    void progress.offsetWidth;


    progress.classList.add(
      'is-running'
    );

  }


  /* =========================================================
     SHOW SLIDE
     ========================================================= */

  function showSlide(nextIndex) {

    index =
      (nextIndex + slides.length) %
      slides.length;


    slides.forEach(
      (slide, i) => {

        slide.classList.toggle(
          'is-active',
          i === index
        );

      }
    );


    if (title) {

      title.textContent =
        details[index].title;

    }


    if (category) {

      category.textContent =
        details[index].category;

    }


    restartProgress();


    requestAnimationFrame(
      syncCaptionToImage
    );


    clearTimeout(timer);


    timer =
      setTimeout(
        () => showSlide(index + 1),
        DISPLAY_TIME
      );

  }


  /* =========================================================
     NEXT BUTTON
     ========================================================= */

  next?.addEventListener(
    'click',
    () => {

      showSlide(index + 1);

    }
  );


  /* =========================================================
     PAGE VISIBILITY
     ========================================================= */

  document.addEventListener(
    'visibilitychange',
    () => {

      clearTimeout(timer);


      if (document.hidden) {

        timer = null;

        progress?.classList.remove(
          'is-running'
        );

      }

      else {

        showSlide(index);

      }

    }
  );


  /* =========================================================
     IMAGE LOAD
     ========================================================= */

  slides.forEach(
    slide => {

      const img =
        slide.querySelector('img');


      img?.addEventListener(
        'load',
        syncCaptionToImage
      );

    }
  );


  window.addEventListener(
    'resize',
    syncCaptionToImage
  );


  /* =========================================================
     START
     ========================================================= */

  showSlide(0);

})();
