const portrait = document.querySelector('#portrait');
const visual = document.querySelector('.hero-visual');
const cursorGlow = document.querySelector('.cursor-glow');
const icons = [...document.querySelectorAll('.floating-icon')];
const magnetic = document.querySelector('.magnetic');

let mx = 0, my = 0, tx = 0, ty = 0;

document.addEventListener('mousemove', e => {
  mx = e.clientX;
  my = e.clientY;

  if (cursorGlow) {
    cursorGlow.style.left = `${mx}px`;
    cursorGlow.style.top = `${my}px`;
  }
});

function animate() {
  tx += (mx - tx) * 0.055;
  ty += (my - ty) * 0.055;

  if (visual && window.innerWidth > 900) {
    const r = visual.getBoundingClientRect();
    const px = ((tx - (r.left + r.width / 2)) / r.width) * 2;
    const py = ((ty - (r.top + r.height / 2)) / r.height) * 2;

    if (portrait) {
      portrait.style.transform = `translate3d(${px * 7}px, ${py * 5}px, 0)`;
    }

    icons.forEach((icon, i) => {
      const depth = Number(icon.dataset.depth || 1);
      const moveX = px * (4 + depth * 2);
      const moveY = py * (3 + depth * 2);
      icon.style.marginLeft = `${moveX}px`;
      icon.style.marginTop = `${moveY}px`;
    });
  }

  requestAnimationFrame(animate);
}
animate();

if (portrait) {
  portrait.addEventListener('mouseenter', () => {
    icons.forEach((icon, i) => {
      icon.style.transition = 'opacity .35s ease, filter .35s ease';
      icon.style.opacity = i % 2 === 0 ? '.48' : '.68';
    });
  });

  portrait.addEventListener('mouseleave', () => {
    icons.forEach(icon => {
      icon.style.opacity = '1';
    });
  });
}

if (magnetic) {
  magnetic.addEventListener('mousemove', e => {
    const r = magnetic.getBoundingClientRect();
    const x = (e.clientX - r.left - r.width / 2) * 0.16;
    const y = (e.clientY - r.top - r.height / 2) * 0.16;
    magnetic.style.transform = `translate(${x}px, ${y}px)`;
  });
  magnetic.addEventListener('mouseleave', () => {
    magnetic.style.transform = '';
  });
}

const revealItems = document.querySelectorAll('.content-section');
const observer = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.style.opacity = '1';
      entry.target.style.transform = 'translateY(0)';
      observer.unobserve(entry.target);
    }
  });
}, {threshold: 0.12});

revealItems.forEach(section => {
  section.style.opacity = '0';
  section.style.transform = 'translateY(35px)';
  section.style.transition = 'opacity .8s ease, transform .8s ease';
  observer.observe(section);
});
