const dot = document.querySelector('.cursor-dot');
const hero = document.querySelector('.interactive-hero');
const portrait = document.querySelector('.portrait-interactive');
const art = document.querySelector('.hero-art');
const icons = [...document.querySelectorAll('.app-icon')];
const magnetic = document.querySelector('.magnetic');

let mouseX = 0, mouseY = 0;
let smoothX = 0, smoothY = 0;
let hoveringPortrait = false;

const clamp = (v, min, max) => Math.max(min, Math.min(max, v));

window.addEventListener('mousemove', e => {
  mouseX = e.clientX;
  mouseY = e.clientY;

  if (dot) {
    dot.style.left = `${mouseX}px`;
    dot.style.top = `${mouseY}px`;
  }

  if (!hero || window.innerWidth <= 800) return;

  const r = hero.getBoundingClientRect();
  if (mouseX >= r.left && mouseX <= r.right && mouseY >= r.top && mouseY <= r.bottom) {
    hero.style.setProperty('--mx', `${((mouseX-r.left)/r.width)*100}%`);
    hero.style.setProperty('--my', `${((mouseY-r.top)/r.height)*100}%`);
  }
});

if (portrait) {
  portrait.addEventListener('mouseenter', () => {
    hoveringPortrait = true;
    hero?.classList.add('portrait-hover');
  });

  portrait.addEventListener('mouseleave', () => {
    hoveringPortrait = false;
    hero?.classList.remove('portrait-hover');
  });
}

function frame(time) {
  smoothX += (mouseX - smoothX) * 0.055;
  smoothY += (mouseY - smoothY) * 0.055;

  if (art && window.innerWidth > 800) {
    const r = art.getBoundingClientRect();
    const px = clamp((smoothX - (r.left + r.width/2)) / r.width, -1, 1);
    const py = clamp((smoothY - (r.top + r.height/2)) / r.height, -1, 1);

    if (portrait) {
      const pr = portrait.getBoundingClientRect();
      const ppx = clamp((smoothX - (pr.left + pr.width/2)) / pr.width, -1, 1);
      const ppy = clamp((smoothY - (pr.top + pr.height/2)) / pr.height, -1, 1);
      portrait.style.transform = `translate3d(${ppx*7}px, ${ppy*5}px, 0)`;
    }

    icons.forEach((icon, i) => {
      const speed = Number(icon.dataset.speed || 1);
      const phase = i * 1.37;
      const bobX = Math.sin(time * 0.00055 * speed + phase) * 4.5;
      const bobY = Math.cos(time * 0.00072 * speed + phase) * 7;
      const tilt = Math.sin(time * 0.00042 * speed + phase) * 3;
      const mouseMoveX = px * 4;
      const mouseMoveY = py * 4;

      if (hoveringPortrait) {
        // Retreat inward: each icon moves toward the center and shrinks.
        const x = (50 - Number(icon.dataset.x)) * 0.58;
        const y = (50 - Number(icon.dataset.y)) * 0.58;
        icon.style.transform =
          `translate3d(${x + bobX/3}px, ${y + bobY/3}px, 0) scale(.38) rotate(${tilt/2}deg)`;
      } else {
        icon.style.transform =
          `translate3d(${bobX + mouseMoveX}px, ${bobY + mouseMoveY}px, 0) rotate(${tilt}deg) scale(1)`;
      }
    });
  }

  requestAnimationFrame(frame);
}
requestAnimationFrame(frame);

if (magnetic) {
  magnetic.addEventListener('mousemove', e => {
    const r = magnetic.getBoundingClientRect();
    const x = (e.clientX - r.left - r.width/2) * 0.10;
    const y = (e.clientY - r.top - r.height/2) * 0.10;
    magnetic.style.transform = `translate(${x}px,${y}px)`;
  });
  magnetic.addEventListener('mouseleave', () => {
    magnetic.style.transform = '';
  });
}

const reveals = document.querySelectorAll('.project,.process-grid > div,.about,.contact');
if ('IntersectionObserver' in window) {
  const io = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.style.opacity = '1';
        entry.target.style.transform = 'translateY(0)';
        io.unobserve(entry.target);
      }
    });
  }, {threshold:.08});

  reveals.forEach(el => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(28px)';
    el.style.transition = 'opacity .8s ease, transform .8s ease';
    io.observe(el);
  });
}
