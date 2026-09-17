const dot = document.querySelector('.cursor-dot');
window.addEventListener('mousemove', e => {
  if (!dot) return;
  dot.style.left = e.clientX + 'px';
  dot.style.top = e.clientY + 'px';
});
const reveals = document.querySelectorAll('.project, .process-grid > div, .about, .contact');
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

/* Magnetic buttons + cursor-responsive hero composition */
(() => {
  const hero = document.querySelector('.hero-v2');
  const title = document.querySelector('.hero-display');
  const photo = document.querySelector('.hero-v2-photo-wrap');
  const magnetic = document.querySelector('.magnetic');
  if (!hero) return;

  hero.addEventListener('mousemove', (e) => {
    const r = hero.getBoundingClientRect();
    const x = (e.clientX-r.left)/r.width-.5;
    const y = (e.clientY-r.top)/r.height-.5;
    if (title) title.style.transform = `translate(${x*12}px,${y*8}px)`;
    if (photo) photo.style.transform = `translate(${x*-10}px,${y*-7}px)`;
  });
  hero.addEventListener('mouseleave', () => {
    if (title) title.style.transform = '';
    if (photo) photo.style.transform = '';
  });
  if (magnetic) {
    magnetic.addEventListener('mousemove', (e) => {
      const r = magnetic.getBoundingClientRect();
      magnetic.style.transform = `translate(${(e.clientX-r.left-r.width/2)*.14}px,${(e.clientY-r.top-r.height/2)*.14}px)`;
    });
    magnetic.addEventListener('mouseleave', () => magnetic.style.transform = '');
  }
})();
