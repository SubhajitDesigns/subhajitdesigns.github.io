/* Interactions isolated to redesign-preview.html. */
(() => {
 const reduce=window.matchMedia('(prefers-reduced-motion: reduce)').matches;
 if(reduce) return;
 const fine=window.matchMedia('(pointer:fine)').matches;
 if(fine){
   const cards=document.querySelectorAll('.creating-slide,.crafted-gallery-card,.client-logo-item,.toolkit-card,.service-card');
   cards.forEach(card=>{
     card.addEventListener('pointermove',e=>{
       const r=card.getBoundingClientRect(),x=(e.clientX-r.left)/r.width-.5,y=(e.clientY-r.top)/r.height-.5;
       card.style.transform='perspective(900px) rotateX('+(-y*3.5)+'deg) rotateY('+(x*3.5)+'deg) translateY(-2px)';
     });
     card.addEventListener('pointerleave',()=>{card.style.transform='';});
   });
 }
})();