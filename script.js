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
