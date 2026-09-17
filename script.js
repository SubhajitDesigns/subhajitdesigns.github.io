const dot = document.querySelector('.cursor-dot');
const hero = document.querySelector('.interactive-hero');
const portrait = document.querySelector('.portrait-interactive');
const art = document.querySelector('.hero-art');
const icons = [...document.querySelectorAll('.app-icon')];
const magnetic = document.querySelector('.magnetic');

let mouseX = innerWidth / 2;
let mouseY = innerHeight / 2;
let smoothX = mouseX;
let smoothY = mouseY;
let hoveringPortrait = false;

window.addEventListener('mousemove', e => {
  mouseX = e.clientX;
  mouseY = e.clientY;

  if (dot) {
    dot.style.left = `${mouseX}px`;
    dot.style.top = `${mouseY}px`;
  }

  if (hero) {
    const r = hero.getBoundingClientRect();
    hero.style.setProperty('--mx', `${((mouseX-r.left)/r.width)*100}%`);
    hero.style.setProperty('--my', `${((mouseY-r.top)/r.height)*100}%`);
  }
});

function setPortraitHover(state){
  hoveringPortrait = state;
  if (hero) hero.classList.toggle('portrait-hover', state);
}

if (portrait) {
  portrait.addEventListener('mouseenter', () => setPortraitHover(true));
  portrait.addEventListener('mouseleave', () => setPortraitHover(false));
}

/* Also allow hover over the visible portrait image itself. */
const portraitImage = portrait?.querySelector('img');
if (portraitImage) {
  portraitImage.addEventListener('mouseenter', () => setPortraitHover(true));
  portraitImage.addEventListener('mouseleave', () => setPortraitHover(false));
}

/* Small mouse parallax, while CSS handles the independent icon floating. */
function animate(){
  smoothX += (mouseX - smoothX) * 0.055;
  smoothY += (mouseY - smoothY) * 0.055;

  if (art && portrait && innerWidth > 800) {
    const ar = art.getBoundingClientRect();
    const px = Math.max(-1, Math.min(1, (smoothX-(ar.left+ar.width/2))/ar.width));
    const py = Math.max(-1, Math.min(1, (smoothY-(ar.top+ar.height/2))/ar.height));

    if (!hoveringPortrait) {
      portrait.style.transform = `translate3d(${px*6}px,${py*4}px,0)`;
    } else {
      portrait.style.transform = `translate3d(${px*2}px,${py*1.5}px,0) scale(1.01)`;
    }

    /* Tiny cursor response, kept separate from the CSS bob animation. */
    icons.forEach((icon, i) => {
      const factor = 1 + i * 0.06;
      icon.style.marginLeft = `${px * factor * 2}px`;
      icon.style.marginTop = `${py * factor * 2}px`;
    });
  }

  requestAnimationFrame(animate);
}
requestAnimationFrame(animate);

if (magnetic) {
  magnetic.addEventListener('mousemove', e => {
    const r = magnetic.getBoundingClientRect();
    const x = (e.clientX-r.left-r.width/2)*0.12;
    const y = (e.clientY-r.top-r.height/2)*0.12;
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
