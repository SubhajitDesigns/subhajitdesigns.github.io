/* Interactive 3D hero — Subhajit Das. Model asset expected at ./character-only.glb */
import * as THREE from 'https://cdn.jsdelivr.net/npm/three@0.169.0/build/three.module.js';
import { GLTFLoader } from 'https://cdn.jsdelivr.net/npm/three@0.169.0/examples/jsm/loaders/GLTFLoader.js';

const root=document.querySelector('#home.subh-hero');
if(root){
  const stage=root.querySelector('.subh-hero-stage');
  const canvas=root.querySelector('.subh-hero-canvas');
  const loaderLabel=root.querySelector('.subh-hero-loader');
  const reduceMotion=window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const scene=new THREE.Scene();
  const camera=new THREE.PerspectiveCamera(32,1,.1,100);
  camera.position.set(0,0,5.6);
  const renderer=new THREE.WebGLRenderer({canvas,alpha:true,antialias:true,powerPreference:'high-performance'});
  renderer.setPixelRatio(Math.min(window.devicePixelRatio||1,1.75));
  renderer.outputColorSpace=THREE.SRGBColorSpace;
  renderer.toneMapping=THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure=1.25;
  scene.add(new THREE.HemisphereLight(0xffe9df,0x170b0b,2.0));
  const key=new THREE.DirectionalLight(0xffd6c7,3.1);key.position.set(2.5,3.5,4);scene.add(key);
  const red=new THREE.PointLight(0xff3028,28,9,2);red.position.set(-2.5,.6,-1);scene.add(red);
  const rim=new THREE.DirectionalLight(0xff6559,2.6);rim.position.set(-3,2,-3);scene.add(rim);
  const modelRoot=new THREE.Group();scene.add(modelRoot);
  const pointer={x:0,y:0,tx:0,ty:0};
  let mixer=null,blinkAction=null,head=null,neck=null,eyeBones=[],baseHead=null,baseNeck=null,lastBlink=0,nextBlink=2.7,loaded=false;
  const clock=new THREE.Clock();
  const loader=new GLTFLoader();
  loader.load('./character-only.glb',gltf=>{
    const model=gltf.scene;
    modelRoot.add(model);
    model.updateMatrixWorld(true);
    const box=new THREE.Box3().setFromObject(model);
    const size=box.getSize(new THREE.Vector3());
    const center=box.getCenter(new THREE.Vector3());
    model.position.sub(center);
    const targetHeight=3.65;
    modelRoot.scale.setScalar(targetHeight/Math.max(size.y,.001));
    modelRoot.position.set(.12,-.16,0);
    // Frame the head/upper body by keeping the camera close to the model's upper half.
    camera.position.set(0,.2,5.7);
    camera.lookAt(0,.16,0);
    const all=[];
    model.traverse(o=>{all.push(o);if(o.isBone){if(o.name==='spine.006'||o.name==='spine006'||o.name.toLowerCase()==='head')head=o;if(o.name==='spine.005'||o.name==='spine005'||o.name.toLowerCase()==='neck')neck=o;if(/eye/i.test(o.name))eyeBones.push(o);}});
    if(head)baseHead=head.rotation.clone();if(neck)baseNeck=neck.rotation.clone();
    mixer=new THREE.AnimationMixer(model);
    const blink=gltf.animations.find(a=>/blink/i.test(a.name));
    if(blink){blinkAction=mixer.clipAction(blink);blinkAction.setLoop(THREE.LoopOnce,1);blinkAction.clampWhenFinished=true;blinkAction.enabled=true;}
    // Keep the intro clip available but don't force a potentially incompatible full-body animation.
    loaded=true;
    loaderLabel.classList.add('is-hidden');
    setTimeout(()=>loaderLabel.hidden=true,550);
    resize();
  },undefined,error=>{
    console.warn('3D hero model could not load. Add character-only.glb to the repository root.',error);
    stage.classList.add('has-fallback');
    loaderLabel.textContent='ADD CHARACTER-ONLY.GLB TO THE SITE ROOT';
    setTimeout(()=>loaderLabel.classList.add('is-hidden'),2200);
    setTimeout(()=>loaderLabel.hidden=true,2800);
  });
  function resize(){const r=stage.getBoundingClientRect();if(!r.width||!r.height)return;renderer.setSize(r.width,r.height,false);camera.aspect=r.width/r.height;camera.updateProjectionMatrix();}
  const ro=new ResizeObserver(resize);ro.observe(stage);window.addEventListener('resize',resize,{passive:true});
  window.addEventListener('pointermove',e=>{pointer.tx=(e.clientX/window.innerWidth-.5)*2;pointer.ty=(e.clientY/window.innerHeight-.5)*2;},{passive:true});
  root.addEventListener('pointerleave',()=>{pointer.tx=0;pointer.ty=0;});
  let scrollQueued=false;function scrollUpdate(){if(scrollQueued)return;scrollQueued=true;requestAnimationFrame(()=>{root.classList.toggle('is-scrolled',window.scrollY>window.innerHeight*.22);scrollQueued=false;});}
  window.addEventListener('scroll',scrollUpdate,{passive:true});scrollUpdate();
  function animate(){
    requestAnimationFrame(animate);
    const dt=Math.min(clock.getDelta(),.05);
    pointer.x=THREE.MathUtils.damp(pointer.x,pointer.tx,reduceMotion?2:3.4,dt);
    pointer.y=THREE.MathUtils.damp(pointer.y,pointer.ty,reduceMotion?2:3.4,dt);
    if(loaded){
      // Small, damped head/neck response; body stays mostly still.
      if(head&&baseHead){head.rotation.y=baseHead.y+pointer.x*.24;head.rotation.x=baseHead.x-pointer.y*.13;}
      if(neck&&baseNeck){neck.rotation.y=baseNeck.y+pointer.x*.075;neck.rotation.x=baseNeck.x-pointer.y*.045;}
      // If the rig exposes eye bones, let them track the pointer subtly.
      eyeBones.forEach((eye,i)=>{eye.rotation.y=pointer.x*.11;eye.rotation.x=-pointer.y*.075;});
      if(mixer)mixer.update(dt);
      if(blinkAction&&clock.elapsedTime>nextBlink){blinkAction.reset().play();nextBlink=clock.elapsedTime+3.0+Math.random()*2.8;}
      // Keep a tiny idle drift even when the cursor is still.
      modelRoot.rotation.y=reduceMotion?0:Math.sin(clock.elapsedTime*.35)*.025;
    }
    renderer.render(scene,camera);
  }
  resize();animate();
}
