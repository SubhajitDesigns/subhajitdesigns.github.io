/* Reference-matched continuous right-to-left poster carousel: center card grows, then recedes. */
(()=>{const root=document.getElementById('craftedFilmStrip');if(!root)return;const track=document.getElementById('craftedFilmTrack');const original=track.querySelector('.crafted-film-set');if(!original)return;
track.querySelectorAll('.crafted-film-set[aria-hidden="true"]').forEach(n=>n.remove());
const clone=original.cloneNode(true);clone.setAttribute('aria-hidden','true');clone.querySelectorAll('img').forEach(img=>img.alt='');track.append(clone);
const cards=[...track.querySelectorAll('.crafted-film-card')];let offset=0,last=performance.now(),loopWidth=0,paused=false;const reduce=window.matchMedia('(prefers-reduced-motion: reduce)');
function measure(){loopWidth=original.getBoundingClientRect().width;}
function animate(now){const dt=Math.min(40,now-last);last=now;if(!reduce.matches&&!paused&&loopWidth){offset-=dt*.105;if(offset<=-loopWidth)offset+=loopWidth;track.style.transform='translate3d('+offset+'px,0,0)';}
const stageRect=root.querySelector('.crafted-film-stage').getBoundingClientRect();const center=stageRect.left+stageRect.width/2;
cards.forEach(card=>{const r=card.getBoundingClientRect();const mid=r.left+r.width/2;const distance=Math.abs(mid-center);const range=Math.max(190,stageRect.width*.23);const focus=Math.max(0,1-distance/range);const scale=.78+focus*.34;card.style.opacity=(.24+focus*.76).toFixed(3);card.style.filter='brightness('+(0.42+focus*.58).toFixed(3))+ saturate('+(0.72+focus*.28).toFixed(3))';card.style.transform='scale('+scale.toFixed(3)+')';card.classList.toggle('is-focused',focus>.72);card.style.zIndex=String(10+Math.round(focus*10));});
requestAnimationFrame(animate);}
root.addEventListener('focusin',()=>paused=true);root.addEventListener('focusout',()=>paused=false);
cards.forEach(card=>{card.addEventListener('pointermove',e=>{const r=card.getBoundingClientRect();const px=(e.clientX-r.left)/r.width-.5;const py=(e.clientY-r.top)/r.height-.5;const focus=card.classList.contains('is-focused');if(focus)card.style.transform='scale(1.12) rotateX('+(-py*3.5).toFixed(2)+'deg) rotateY('+(px*4.5).toFixed(2)+'deg)';});card.addEventListener('pointerleave',()=>{card.style.transform='';});});
window.addEventListener('resize',measure);measure();requestAnimationFrame(animate);
})();