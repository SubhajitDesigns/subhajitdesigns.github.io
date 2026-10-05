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
        1 + (amount * 0.16);


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
   CRAFTED DESIGNS — 3-CARD SCROLL STACK
   ========================================================= */

(function () {

  const section =
    document.getElementById('work');


  if (!section) {
    return;
  }


  const cards =
    Array.from(
      section.querySelectorAll(
        '.crafted-stack-card'
      )
    );


  const hint =
    document.getElementById(
      'craftedStackHint'
    );


  if (!cards.length) {
    return;
  }


  let activeIndex = 0;

  let locked = false;

  let pointerInside = false;

  let stackDone = false;


  /* =========================================================
     RENDER STACK
     ========================================================= */

  function render() {

    cards.forEach(
      (card, index) => {

        card.classList.remove(
          'is-active',
          'is-next',
          'is-next-2',
          'is-passed'
        );


        if (index === activeIndex) {

          card.classList.add(
            'is-active'
          );

        }

        else if (
          index === activeIndex + 1
        ) {

          card.classList.add(
            'is-next'
          );

        }

        else if (
          index === activeIndex + 2
        ) {

          card.classList.add(
            'is-next-2'
          );

        }

        else if (
          index < activeIndex
        ) {

          card.classList.add(
            'is-passed'
          );

        }

        else {

          card.classList.add(
            'is-next-2'
          );

        }

      }
    );


    stackDone =
      activeIndex === cards.length - 1;


    section.classList.toggle(
      'is-stack-done',
      stackDone
    );


    if (hint) {

      hint.classList.toggle(
        'is-hidden',
        stackDone
      );

    }

  }


  /* =========================================================
     CHECK IF CRAFTED IS VISIBLE
     ========================================================= */

  function sectionIsInView() {

    const r =
      section.getBoundingClientRect();


    return (
      r.top <
      window.innerHeight * 0.78
      &&
      r.bottom >
      window.innerHeight * 0.22
    );

  }


  /* =========================================================
     MOUSE ENTER / LEAVE
     ========================================================= */

  section.addEventListener(
    'pointerenter',
    () => {

      pointerInside = true;

    }
  );


  section.addEventListener(
    'pointerleave',
    () => {

      pointerInside = false;

    }
  );


  /* =========================================================
     WHEEL CONTROL
     
     Only the mouse wheel over Crafted is intercepted.

     Scroll DOWN:
     Card 1 → Card 2 → Card 3

     After Card 3:
     Normal page scrolling resumes.

     Scroll UP:
     Card 3 → Card 2 → Card 1

     At Card 1:
     Normal page scrolling resumes upward.
     ========================================================= */

  window.addEventListener(
    'wheel',
    event => {

      if (
        !pointerInside ||
        !sectionIsInView()
      ) {
        return;
      }


      const down =
        event.deltaY > 0;

      const up =
        event.deltaY < 0;


      if (locked) {
        return;
      }


      /*
       * At the end, allow normal
       * page scrolling downward.
       */

      if (
        stackDone &&
        down
      ) {

        return;

      }


      /*
       * At the beginning, allow normal
       * page scrolling upward.
       */

      if (
        activeIndex === 0 &&
        up
      ) {

        return;

      }


      /*
       * Stop the normal page scroll
       * while changing cards.
       */

      event.preventDefault();

      locked = true;


      if (
        down &&
        activeIndex <
        cards.length - 1
      ) {

        activeIndex++;

        render();

      }

      else if (
        up &&
        activeIndex > 0
      ) {

        activeIndex--;

        render();

      }


      /*
       * Small lock prevents one physical
       * wheel movement from skipping cards.
       */

      window.setTimeout(
        () => {
          locked = false;
        },
        900
      );

    },
    {
      passive: false
    }
  );


  /* =========================================================
     INITIAL STATE
     ========================================================= */

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
